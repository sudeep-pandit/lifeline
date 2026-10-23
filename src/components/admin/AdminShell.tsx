
"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  BookOpenText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Droplet,
  FolderOpen,
  HeartPulse,
  Home,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  ReceiptText,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type NavigationItem = {
  label: string;
  href: string;
  icon: IconComponent;
  permission?: string;
};

type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

type AdminUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  permissions?: string[];
};

type BrandingResponse = {
  success?: boolean;
  data?: {
    organizationName?: string;
    shortName?: string;
    logoUrl?: string | null;
  };
};

type ApiResponse = {
  success?: boolean;
  user?: AdminUser;
  data?: AdminUser;
  message?: string;
};

const navigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard.view",
      },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        label: "Homepage Editor",
        href: "/admin/homepage",
        icon: Home,
        permission: "content.view",
      },
      {
        label: "Media Library",
        href: "/admin/media",
        icon: FolderOpen,
        permission: "media.view",
      },
      {
        label: "Team",
        href: "/admin/team",
        icon: Users,
        permission: "team.view",
      },
    ],
  },
  {
    title: "Media & Stories",
    items: [
      {
        label: "Gallery",
        href: "/admin/gallery",
        icon: Images,
        permission: "gallery.view",
      },
      {
        label: "News",
        href: "/admin/news",
        icon: Newspaper,
        permission: "content.view",
      },
      {
        label: "Blog",
        href: "/admin/blog",
        icon: BookOpenText,
        permission: "content.view",
      },
    ],
  },
  {
    title: "Blood Donation",
    items: [
      {
        label: "Donors",
        href: "/admin/blood-donation/donors",
        icon: Users,
        permission: "bloodDonation.view",
      },
      {
        label: "Blood Requests",
        href: "/admin/blood-donation/requests",
        icon: Droplet,
        permission: "bloodDonation.view",
      },
      {
        label: "Blood Banks",
        href: "/admin/blood-donation/blood-banks",
        icon: HeartPulse,
        permission: "bloodDonation.view",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Billing",
        href: "/admin/billing",
        icon: ReceiptText,
        permission: "finance.view",
      },
      {
        label: "Messages",
        href: "/admin/messages",
        icon: MessageSquare,
        permission: "messages.view",
      },
      {
        label: "Users & Roles",
        href: "/admin/users",
        icon: ShieldCheck,
        permission: "users.view",
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        permission: "settings.view",
      },
    ],
  },
];

const BRAND_BURGUNDY = "#7A1F3D";
const BRAND_COBALT = "#2457C5";

function isAdminRole(role?: string | null) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

function getDisplayName(user: AdminUser | null) {
  if (user?.name?.trim()) return user.name.trim();
  if (user?.email) return user.email.split("@")[0];
  return "Administrator";
}

function getInitials(user: AdminUser | null) {
  const name = getDisplayName(user);
  const parts = name.split(/[\s._-]+/).filter(Boolean);

  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [branding, setBranding] = useState<BrandingResponse["data"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [authError, setAuthError] = useState("");

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setAuthError("");

    try {
      const [authResponse, brandingResponse] = await Promise.all([
        fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }),
        fetch("/api/settings/organization-branding", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      if (authResponse.status === 401 || authResponse.status === 403) {
        window.location.replace("/login");
        return;
      }

      if (authResponse.ok) {
        const authResult = (await authResponse.json()) as ApiResponse;
        const currentUser = authResult.user ?? authResult.data;

        if (authResult.success !== false && currentUser) {
          setUser(currentUser);
        } else {
          setAuthError("Unable to load your administrator account.");
        }
      } else {
        setAuthError("Unable to verify your administrator account.");
      }

      if (brandingResponse.ok) {
        const brandingResult =
          (await brandingResponse.json()) as BrandingResponse;

        if (brandingResult.success !== false && brandingResult.data) {
          setBranding(brandingResult.data);
        }
      }
    } catch {
      setAuthError("Could not connect to the admin service.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAdminData();
  }, [loadAdminData]);

  useEffect(() => {
    setMobileSidebarOpen(false);
    setProfileMenuOpen(false);
    setNotificationMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileSidebarOpen && !profileMenuOpen && !notificationMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
        setProfileMenuOpen(false);
        setNotificationMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileSidebarOpen, profileMenuOpen, notificationMenuOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        window.location.replace("/login");
        return;
      }

      setAuthError("Logout failed. Please try again.");
    } catch {
      setAuthError("Could not connect to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const canAccess = (item: NavigationItem) => {
    if (!item.permission) return true;
    if (isAdminRole(user?.role)) return true;

    return user?.permissions?.includes(item.permission) ?? false;
  };

  const visibleNavigation = navigation
    .map((section) => ({
      ...section,
      items: section.items.filter(canAccess),
    }))
    .filter((section) => section.items.length > 0);

  const organizationName =
    branding?.organizationName?.trim() || "Lifeline Achham";
  const shortName = branding?.shortName?.trim() || "LA";
  const logoUrl = branding?.logoUrl || null;

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const linkClass = (href: string) =>
    [
      "group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5",
      "text-sm font-medium transition-all duration-200",
      isActive(href)
        ? "bg-[#7A1F3D] text-white shadow-sm"
        : "text-slate-600 hover:bg-rose-50 hover:text-[#7A1F3D]",
      sidebarCollapsed ? "justify-center px-2" : "",
    ].join(" ");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FCFAF7] px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <Activity
              className="h-7 w-7 animate-pulse"
              style={{ color: BRAND_BURGUNDY }}
            />
          </div>
          <div>
            <p className="font-semibold text-slate-800">
              Loading administration
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Preparing your Lifeline Achham workspace…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#172033]">
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200",
          "bg-white transition-all duration-200",
          sidebarCollapsed ? "w-[84px]" : "w-[270px]",
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-100 px-4">
          <Link
            href="/admin/dashboard"
            className="flex min-w-0 items-center gap-3"
            aria-label={`${organizationName} admin dashboard`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-rose-50 ring-1 ring-rose-100">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`${organizationName} logo`}
                  width={44}
                  height={44}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              ) : (
                <span
                  className="text-sm font-extrabold"
                  style={{ color: BRAND_BURGUNDY }}
                >
                  {shortName.slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {organizationName}
                </p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
                  Admin Portal
                </p>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {!sidebarCollapsed && (
            <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Workspace
            </p>
          )}

          <nav aria-label="Admin navigation" className="space-y-6">
            {visibleNavigation.map((section) => (
              <section key={section.title}>
                {!sidebarCollapsed && (
                  <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    {section.title}
                  </h2>
                )}

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={`${item.href}-${item.label}`}
                        href={item.href}
                        title={sidebarCollapsed ? item.label : undefined}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={linkClass(item.href)}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="min-w-0 flex-1 truncate">
                            {item.label}
                          </span>
                        )}
                        {!sidebarCollapsed && isActive(item.href) && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </nav>
        </div>

        <div className="shrink-0 border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={() => setSidebarCollapsed((current) => !current)}
            className="hidden w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 lg:flex"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>

          {!sidebarCollapsed && (
            <div className="mt-2 rounded-xl bg-[#FCFAF7] p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
                  <ShieldCheck className="h-4 w-4 text-[#7A1F3D]" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-700">
                    Secure workspace
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Role-based access
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      <div
        className={[
          "min-h-screen transition-[margin] duration-200",
          sidebarCollapsed ? "lg:ml-[84px]" : "lg:ml-[270px]",
        ].join(" ")}
      >
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                Administration
              </p>
              <p className="hidden truncate text-xs text-slate-500 sm:block">
                Manage your organization and resources
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationMenuOpen}
                onClick={() => {
                  setNotificationMenuOpen((open) => !open);
                  setProfileMenuOpen(false);
                }}
                className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50"
              >
                <Bell className="h-[18px] w-[18px]" />
              </button>

              {notificationMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                  <p className="text-sm font-semibold text-slate-800">
                    Notifications
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    There are no notifications to display.
                  </p>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-expanded={profileMenuOpen}
                onClick={() => {
                  setProfileMenuOpen((open) => !open);
                  setNotificationMenuOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 pr-2.5 transition hover:bg-slate-50 sm:gap-3 sm:pr-3"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: BRAND_BURGUNDY }}
                >
                  {getInitials(user)}
                </span>
                <span className="hidden max-w-32 text-left sm:block">
                  <span className="block truncate text-xs font-semibold text-slate-800">
                    {getDisplayName(user)}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                    {user?.role?.replaceAll("_", " ") || "Administrator"}
                  </span>
                </span>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {getDisplayName(user)}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user?.email || ""}
                    </p>
                  </div>

                  <Link
                    href="/admin/settings"
                    className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#7A1F3D]"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Account settings
                  </Link>

                  <button
                    type="button"
                    disabled={loggingOut}
                    onClick={() => void handleLogout()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {authError && (
          <div
            role="alert"
            className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:mx-6 lg:mx-8"
          >
            <span>{authError}</span>
            <button
              type="button"
              onClick={() => void loadAdminData()}
              className="font-semibold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>

        <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {organizationName}. All rights
              reserved.
            </p>
            <p>
              Designed and developed by{" "}
              <a
                href="https://sudeeppandit.com.np"
                target="_blank"
                rel="noreferrer"
                className="font-semibold transition hover:text-[#2457C5]"
                style={{ color: BRAND_COBALT }}
              >
                Sudeep Pandit
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
