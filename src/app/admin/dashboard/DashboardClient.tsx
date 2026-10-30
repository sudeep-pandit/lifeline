
"use client";

import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Database,
  FileText,
  LayoutDashboard,
  LoaderCircle,
  RefreshCw,
  Server,
  Settings,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  UsersRound,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import OrganizationLogo from "@/components/website/OrganizationLogo";

type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR"
  | "ACCOUNTANT"
  | "STAFF";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

type RecentUser = UserData & {
  createdAt: string;
};

type DashboardData = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  superAdmins: number;
  admins: number;
  editors: number;
  accountants: number;
  staff: number;
  recentUsers: RecentUser[];
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  user?: UserData;
};

type HealthStatus =
  | "healthy"
  | "degraded"
  | "unavailable"
  | "checking";

type HealthResponse = {
  status?: string;
  checks?: {
    application?: string;
    database?: string;
  };
  checkedAt?: string;
};

type HealthData = {
  application: HealthStatus;
  database: HealthStatus;
  checkedAt: string | null;
  error: string | null;
};

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrator",
  EDITOR: "Editor",
  ACCOUNTANT: "Accountant",
  STAFF: "Staff",
};

const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-purple-50 text-purple-700 ring-purple-200",
  ADMIN: "bg-blue-50 text-blue-700 ring-blue-200",
  EDITOR: "bg-amber-50 text-amber-700 ring-amber-200",
  ACCOUNTANT: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  STAFF: "bg-slate-100 text-slate-700 ring-slate-200",
};

const BS_MONTH_STARTS = [
  { name: "Baisakh", date: "2026-04-14" },
  { name: "Jestha", date: "2026-05-15" },
  { name: "Ashadh", date: "2026-06-15" },
  { name: "Shrawan", date: "2026-07-17" },
  { name: "Bhadra", date: "2026-08-18" },
  { name: "Ashwin", date: "2026-09-17" },
  { name: "Kartik", date: "2026-10-18" },
  { name: "Mangsir", date: "2026-11-17" },
  { name: "Poush", date: "2026-12-17" },
  { name: "Magh", date: "2027-01-15" },
  { name: "Falgun", date: "2027-02-13" },
  { name: "Chaitra", date: "2027-03-15" },
];

const BS_SUPPORTED_FROM = "2026-04-14";
const BS_SUPPORTED_UNTIL = "2027-04-14";
const HEALTH_CHECK_INTERVAL = 60_000;

function getKathmanduDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function dateKeyToUtc(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function getNepaliDate(dateKey: string) {
  if (
    dateKey < BS_SUPPORTED_FROM ||
    dateKey >= BS_SUPPORTED_UNTIL
  ) {
    return null;
  }

  let currentMonthIndex = -1;

  for (let index = 0; index < BS_MONTH_STARTS.length; index++) {
    if (dateKey >= BS_MONTH_STARTS[index].date) {
      currentMonthIndex = index;
    } else {
      break;
    }
  }

  if (currentMonthIndex < 0) return null;

  const month = BS_MONTH_STARTS[currentMonthIndex];

  const day =
    Math.floor(
      (dateKeyToUtc(dateKey) - dateKeyToUtc(month.date)) /
        (24 * 60 * 60 * 1000),
    ) + 1;

  return `${month.name} ${day}, 2083`;
}

function getGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kathmandu",
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date()),
  );

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00+05:45`);

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kathmandu",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kathmandu",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatTime(value: string | null) {
  if (!value) return "Not checked yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kathmandu",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

function getEmptyDashboardData(): DashboardData {
  return {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    superAdmins: 0,
    admins: 0,
    editors: 0,
    accountants: 0,
    staff: 0,
    recentUsers: [],
  };
}

function normalizeHealthStatus(value: unknown): HealthStatus {
  if (value === "healthy") return "healthy";
  if (value === "degraded") return "degraded";
  if (value === "checking") return "checking";
  return "unavailable";
}

function getHealthLabel(status: HealthStatus) {
  switch (status) {
    case "healthy":
      return "Operational";
    case "degraded":
      return "Degraded";
    case "checking":
      return "Checking...";
    default:
      return "Unavailable";
  }
}

function getHealthClasses(status: HealthStatus) {
  switch (status) {
    case "healthy":
      return {
        badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        dot: "bg-emerald-500",
        icon: "text-emerald-600",
      };
    case "degraded":
      return {
        badge: "bg-amber-50 text-amber-700 ring-amber-200",
        dot: "bg-amber-500",
        icon: "text-amber-600",
      };
    case "checking":
      return {
        badge: "bg-blue-50 text-blue-700 ring-blue-200",
        dot: "bg-blue-500",
        icon: "text-blue-600",
      };
    default:
      return {
        badge: "bg-rose-50 text-rose-700 ring-rose-200",
        dot: "bg-rose-500",
        icon: "text-rose-600",
      };
  }
}

function HealthRow({
  title,
  description,
  status,
  icon: Icon,
}: {
  title: string;
  description: string;
  status: HealthStatus;
  icon: typeof Server;
}) {
  const classes = getHealthClasses(status);

  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 ${classes.icon}`}
      >
        <Icon size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${classes.badge}`}
      >
        {status === "checking" ? (
          <LoaderCircle size={12} className="animate-spin" />
        ) : (
          <span
            className={`h-1.5 w-1.5 rounded-full ${classes.dot}`}
          />
        )}
        {getHealthLabel(status)}
      </span>
    </div>
  );
}

export default function DashboardClient() {
  const [user, setUser] = useState<UserData | null>(null);
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [health, setHealth] = useState<HealthData>({
    application: "checking",
    database: "checking",
    checkedAt: null,
    error: null,
  });

  const [healthLoading, setHealthLoading] = useState(false);

  const today = useMemo(() => getKathmanduDateKey(), []);
  const nepaliDate = useMemo(() => getNepaliDate(today), [today]);
  const greeting = useMemo(() => getGreeting(), []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [meResponse, dashboardResponse] = await Promise.all([
        fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
        }),
        fetch("/api/dashboard", {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
        }),
      ]);

      if (
        meResponse.status === 401 ||
        dashboardResponse.status === 401
      ) {
        window.location.assign("/login");
        return;
      }

      if (
        meResponse.status === 403 ||
        dashboardResponse.status === 403
      ) {
        window.location.assign("/admin/forbidden");
        return;
      }

      const meJson = (await meResponse
        .json()
        .catch(() => ({}))) as ApiResponse<UserData> & {
        data?: UserData | { user?: UserData };
      };

      const dashboardJson = (await dashboardResponse
        .json()
        .catch(() => ({}))) as ApiResponse<DashboardData>;

      if (!meResponse.ok) {
        throw new Error(
          meJson.message || "Unable to load your account information.",
        );
      }

      if (!dashboardResponse.ok || !dashboardJson.success) {
        throw new Error(
          dashboardJson.message ||
            "Unable to load dashboard information.",
        );
      }

      const meData = meJson.data;

      const currentUser: UserData | undefined =
        meJson.user ??
        (meData && "id" in meData
          ? meData
          : meData?.user);

      if (currentUser) {
        setUser(currentUser);
      }

      setDashboard(
        dashboardJson.data ?? getEmptyDashboardData(),
      );

      setLastUpdated(new Date());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSystemHealth = useCallback(async () => {
    setHealthLoading(true);

    try {
      const response = await fetch("/api/health/ready", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
      });

      const result = (await response
        .json()
        .catch(() => ({}))) as HealthResponse;

      const applicationStatus: HealthStatus = response.ok
        ? normalizeHealthStatus(result.checks?.application)
        : result.checks?.application === "healthy"
          ? "healthy"
          : "unavailable";

      const databaseStatus: HealthStatus = response.ok
        ? normalizeHealthStatus(result.checks?.database)
        : result.checks?.database === "degraded"
          ? "degraded"
          : "unavailable";

      setHealth({
        application: applicationStatus,
        database: databaseStatus,
        checkedAt: result.checkedAt ?? new Date().toISOString(),
        error: response.ok
          ? null
          : `Health endpoint returned HTTP ${response.status}.`,
      });
    } catch {
      setHealth({
        application: "unavailable",
        database: "unavailable",
        checkedAt: new Date().toISOString(),
        error:
          "Could not reach the health endpoint. Check the route and server connection.",
      });
    } finally {
      setHealthLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
    void checkSystemHealth();

    const interval = window.setInterval(() => {
      void checkSystemHealth();
    }, HEALTH_CHECK_INTERVAL);

    return () => window.clearInterval(interval);
  }, [loadDashboard, checkSystemHealth]);

  const stats = useMemo(() => {
    const data = dashboard ?? getEmptyDashboardData();

    return [
      {
        label: "Total Users",
        value: data.totalUsers,
        detail: "All registered accounts",
        icon: UsersRound,
        iconClass: "bg-blue-50 text-blue-700",
        accent: "border-l-blue-600",
      },
      {
        label: "Active Users",
        value: data.activeUsers,
        detail: "Currently enabled accounts",
        icon: UserCheck,
        iconClass: "bg-emerald-50 text-emerald-700",
        accent: "border-l-emerald-600",
      },
      {
        label: "Inactive Users",
        value: data.inactiveUsers,
        detail: "Disabled accounts",
        icon: XCircle,
        iconClass: "bg-rose-50 text-rose-700",
        accent: "border-l-rose-500",
      },
      {
        label: "Administrators",
        value: data.superAdmins + data.admins,
        detail: "Super Admins and Admins",
        icon: ShieldCheck,
        iconClass: "bg-purple-50 text-purple-700",
        accent: "border-l-purple-600",
      },
    ];
  }, [dashboard]);

  const roleStats = useMemo(() => {
    const data = dashboard ?? getEmptyDashboardData();

    return [
      {
        label: "Super Admin",
        count: data.superAdmins,
        color: "bg-purple-600",
      },
      {
        label: "Administrator",
        count: data.admins,
        color: "bg-blue-600",
      },
      {
        label: "Editor",
        count: data.editors,
        color: "bg-amber-500",
      },
      {
        label: "Accountant",
        count: data.accountants,
        color: "bg-indigo-500",
      },
      {
        label: "Staff",
        count: data.staff,
        color: "bg-slate-500",
      },
    ];
  }, [dashboard]);

  const quickActions = [
    {
      title: "Manage Users",
      description: "Review accounts and user access.",
      href: "/admin/users",
      icon: Users,
      iconClass: "bg-blue-50 text-blue-700",
    },
    {
      title: "Manage Content",
      description: "Update website pages and content.",
      href: "/admin/content",
      icon: FileText,
      iconClass: "bg-purple-50 text-purple-700",
    },
    {
      title: "Manage Team",
      description: "Maintain the team directory.",
      href: "/admin/team",
      icon: UserCog,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Settings",
      description: "Review available system settings.",
      href: "/admin/settings",
      icon: Settings,
      iconClass: "bg-amber-50 text-amber-700",
    },
  ];

  const overallHealth: HealthStatus =
    health.application === "checking" ||
    health.database === "checking"
      ? "checking"
      : health.application === "unavailable" ||
          health.database === "unavailable"
        ? "unavailable"
        : health.application === "degraded" ||
            health.database === "degraded"
          ? "degraded"
          : "healthy";

  const overallHealthClasses = getHealthClasses(overallHealth);

  return (
    <main className="min-w-0 space-y-6 pb-8">
      {/* Page heading */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-blue-50"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-24 h-40 w-40 rounded-full bg-rose-50"
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {/* Organization logo and dashboard identity */}
            <div className="mb-4 flex items-center gap-3">
              <OrganizationLogo
                className="h-12 w-12 rounded-xl object-contain"
                fallbackClassName="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7A1F3D] text-sm font-bold text-white"
              />

              <div className="min-w-0">
                <p className="text-sm font-bold text-[#7A1F3D]">
                  Lifeline Achham
                </p>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-[#7A1F3D] ring-1 ring-rose-100">
                  <LayoutDashboard size={12} />
                  Administration Dashboard
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {greeting}
              {user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Welcome to your dashboard. Here&apos;s an overview of
              your organization&apos;s administration.
            </p>

            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
              <span className="inline-flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="text-[#7A1F3D]"
                />
                {formatDate(today)}
              </span>

              {nepaliDate && (
                <span className="inline-flex items-center gap-2">
                  <span className="font-semibold text-[#7A1F3D]">
                    BS
                  </span>
                  {nepaliDate}
                </span>
              )}

              {user && (
                <span
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                    ROLE_COLORS[user.role] ??
                    "bg-slate-100 text-slate-700 ring-slate-200"
                  }`}
                >
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              void loadDashboard();
              void checkSystemHealth();
            }}
            disabled={loading || healthLoading}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                loading || healthLoading ? "animate-spin" : ""
              }
            />
            {loading || healthLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </section>

      {/* Dashboard loading errors */}
      {error && (
        <section
          role="alert"
          className="flex flex-col gap-4 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={21}
              className="mt-0.5 shrink-0 text-rose-600"
            />
            <div>
              <p className="font-semibold text-rose-900">
                Unable to load the dashboard
              </p>
              <p className="mt-1 text-sm leading-5 text-rose-800">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={loading}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </section>
      )}

      {/* Statistics */}
      <section aria-label="User statistics">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              User account statistics
            </p>
          </div>

          {lastUpdated && (
            <span className="hidden items-center gap-1.5 text-xs text-slate-400 sm:inline-flex">
              <Clock3 size={13} />
              Updated{" "}
              {new Intl.DateTimeFormat("en-US", {
                timeZone: "Asia/Kathmandu",
                hour: "numeric",
                minute: "2-digit",
              }).format(lastUpdated)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className={`min-w-0 rounded-xl border border-slate-200 border-l-4 ${stat.accent} bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>

                    {loading && !dashboard ? (
                      <div className="mt-3 h-9 w-20 animate-pulse rounded-md bg-slate-100" />
                    ) : (
                      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        {stat.value.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}
                  >
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  {stat.detail}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* System health */}
      <section
        aria-labelledby="system-health-heading"
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Activity size={22} />
            </div>

            <div>
              <h2
                id="system-health-heading"
                className="text-lg font-bold text-slate-900"
              >
                System Health
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Application and database readiness status
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${overallHealthClasses.badge}`}
            >
              {overallHealth === "checking" ? (
                <LoaderCircle
                  size={13}
                  className="animate-spin"
                />
              ) : (
                <span
                  className={`h-2 w-2 rounded-full ${overallHealthClasses.dot}`}
                />
              )}

              {overallHealth === "healthy"
                ? "All systems operational"
                : overallHealth === "degraded"
                  ? "System degraded"
                  : overallHealth === "checking"
                    ? "Checking systems"
                    : "System unavailable"}
            </span>

            <button
              type="button"
              onClick={() => void checkSystemHealth()}
              disabled={healthLoading}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={healthLoading ? "animate-spin" : ""}
              />
              Check now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-5 sm:p-6 lg:grid-cols-2">
          <HealthRow
            title="Next.js Application"
            description="Health endpoint response from the running application."
            status={health.application}
            icon={Server}
          />

          <HealthRow
            title="PostgreSQL Database"
            description="Database connectivity as reported by the readiness endpoint."
            status={health.database}
            icon={Database}
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="inline-flex items-center gap-2">
            <Clock3 size={14} />
            Last checked: {formatTime(health.checkedAt)}
          </span>

          <span>
            Automatic check every 60 seconds while this page is open
          </span>
        </div>

        {health.error && (
          <div
            role="status"
            className="flex items-start gap-2 border-t border-amber-100 bg-amber-50 px-5 py-3 text-xs leading-5 text-amber-800 sm:px-6"
          >
            <AlertCircle
              size={15}
              className="mt-0.5 shrink-0"
            />
            <span>{health.error}</span>
          </div>
        )}
      </section>

      {/* Main dashboard grid */}
      <section className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent users */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Users
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                The latest accounts registered in the system
              </p>
            </div>

            <Link
              href="/admin/users"
              className="inline-flex min-h-9 items-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#7A1F3D]/30 hover:bg-rose-50 hover:text-[#7A1F3D]"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          {loading && !dashboard ? (
            <div className="space-y-4 p-5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-3"
                >
                  <div className="h-11 w-11 shrink-0 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-36 max-w-full rounded bg-slate-100" />
                    <div className="h-3 w-48 max-w-full rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : dashboard?.recentUsers.length ? (
            <div className="divide-y divide-slate-100">
              {dashboard.recentUsers.map((recentUser) => (
                <div
                  key={recentUser.id}
                  className="flex min-w-0 items-start gap-3 px-4 py-4 transition hover:bg-slate-50/70 sm:items-center sm:px-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7A1F3D]/10 text-sm font-bold text-[#7A1F3D]">
                    {getInitials(recentUser.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold text-slate-900">
                      {recentUser.name}
                    </p>
                    <p className="mt-0.5 break-all text-xs text-slate-500">
                      {recentUser.email}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${
                          ROLE_COLORS[recentUser.role] ??
                          "bg-slate-100 text-slate-700 ring-slate-200"
                        }`}
                      >
                        {ROLE_LABELS[recentUser.role] ??
                          recentUser.role}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold ${
                          recentUser.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            recentUser.isActive
                              ? "bg-emerald-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {recentUser.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="hidden max-w-32 shrink-0 text-right sm:block">
                    <p className="text-xs font-medium text-slate-600">
                      {formatDateTime(recentUser.createdAt)}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Joined
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center px-5 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Users size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No users yet
              </h3>

              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                Newly registered accounts will appear here.
              </p>

              <Link
                href="/admin/users"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#7A1F3D] hover:underline"
              >
                Open user management
                <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>

        {/* Role distribution */}
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Role Distribution
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Accounts by assigned role
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Activity size={20} />
            </div>
          </div>

          <div className="mt-7 space-y-5">
            {roleStats.map((role) => {
              const percentage =
                dashboard && dashboard.totalUsers > 0
                  ? Math.round(
                      (role.count / dashboard.totalUsers) * 100,
                    )
                  : 0;

              return (
                <div key={role.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-700">
                      {role.label}
                    </span>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-slate-900">
                      {role.count.toLocaleString()}
                    </span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={`${role.label} users`}
                    aria-valuemin={0}
                    aria-valuemax={dashboard?.totalUsers ?? 0}
                    aria-valuenow={role.count}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${role.color}`}
                      style={{
                        width:
                          dashboard && dashboard.totalUsers > 0
                            ? `${(role.count / dashboard.totalUsers) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>

                  <p className="mt-1.5 text-right text-xs text-slate-400">
                    {percentage}% of all users
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-blue-700"
              />

              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Access management
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-800">
                  Assign roles carefully and review account access
                  regularly.
                </p>

                <Link
                  href="/admin/users"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:underline"
                >
                  Manage accounts
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Shortcuts to frequently used administration pages
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex min-w-0 items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#7A1F3D]/30 hover:shadow-md"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconClass}`}
                >
                  <Icon size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-sm font-bold text-slate-900 group-hover:text-[#7A1F3D]">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {action.description}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#7A1F3D]">
                    Open page
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>Lifeline Achham Administration Dashboard</p>

        <p className="flex items-center gap-1.5">
          <span>Nepal Time (NPT)</span>
          <span aria-hidden="true">·</span>
          <span>System checks refresh every 60 seconds</span>
        </p>
      </footer>
    </main>
  );
}
