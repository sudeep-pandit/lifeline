
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Droplet,
  FileBarChart,
  FileText,
  FolderOpen,
  HeartPulse,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PanelsTopLeft,
  ReceiptText,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import OrganizationLogo from "@/components/website/OrganizationLogo";

type NavigationItem = {
  label: string;
  href: string;
  icon: typeof Home;
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

type ApiResponse = {
  success?: boolean;
  message?: string;
  user?: AdminUser;
  permissions?: string[];
};

const LOGIN_PATH = "/login";

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
        label: "Pages & Content",
        href: "/admin/content",
        icon: FileText,
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
      {
        label: "Footer",
        href: "/admin/organization/footer",
        icon: PanelsTopLeft,
        permission: "content.view",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        label: "News & Notices",
        href: "/admin/content",
        icon: FileText,
        permission: "content.view",
      },
      {
        label: "Reports",
        href: "/admin/content",
        icon: FileBarChart,
        permission: "content.view",
      },
      {
        label: "Publications",
        href: "/admin/publications",
        icon: BookOpen,
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

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });

        if (response.status === 401) {
          window.location.replace(LOGIN_PATH);
          return;
        }

        if (!response.ok) {
          console.error(
            "Unable to verify admin session:",
            response.status,
          );
          return;
        }

        const data: ApiResponse = await response.json();

        if (cancelled) return;

        const currentUser = data.user ?? data;

        setUser({
          ...currentUser,
          permissions:
            currentUser.permissions ??
            data.permissions ??
            [],
        });
      } catch (error) {
        console.error("Unable to load admin session:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  const role = user?.role?.toUpperCase();

  function canAccess(permission?: string) {
    if (!permission) return true;

    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      return true;
    }

    return user?.permissions?.includes(permission) ?? false;
  }

  function isActive(href: string) {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const handleLogout = useCallback(async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");
    setProfileOpen(false);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result: ApiResponse = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || "Unable to sign out. Please try again.",
        );
      }

      window.location.replace(LOGIN_PATH);
    } catch (error) {
      console.error("Logout failed:", error);

      setLogoutError(
        error instanceof Error
          ? error.message
          : "Unable to sign out. Please try again.",
      );

      setLoggingOut(false);
    }
  }, [loggingOut]);

  const visibleNavigation = navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        canAccess(item.permission),
      ),
    }))
    .filter((section) => section.items.length > 0);

  const currentPageTitle =
    navigation
      .flatMap((section) => section.items)
      .find((item) => isActive(item.href))?.label ??
    (pathname.startsWith("/admin/organization/footer")
      ? "Footer"
      : "Admin Portal");

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-slate-800">
      {/* Mobile navigation backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
          sidebarCollapsed ? "lg:w-[88px]" : "lg:w-[270px]"
        } w-[270px] ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar branding */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-100 px-4">
          <Link
            href="/admin/dashboard"
            onClick={() => setSidebarOpen(false)}
            title={sidebarCollapsed ? "Lifeline Achham" : undefined}
            className={`flex min-w-0 items-center gap-3 ${
              sidebarCollapsed ? "lg:justify-center" : ""
            }`}
          >
            {/* Fixed-size logo container */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden">
              <OrganizationLogo
                className="block !h-auto !max-h-10 !w-auto !max-w-10 object-contain"
                fallbackClassName="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A1F3D] text-sm font-bold text-white"
              />
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  Lifeline Achham
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">
                  Administration
                </p>
              </div>
            )}
          </Link>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {visibleNavigation.map((section) => (
            <div key={section.title}>
              {!sidebarCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={`${section.title}-${item.label}`}
                      href={item.href}
                      title={sidebarCollapsed ? item.label : undefined}
                      onClick={() => setSidebarOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                        active
                          ? "bg-[#7A1F3D] text-white shadow-sm shadow-rose-950/10"
                          : "text-slate-600 hover:bg-rose-50 hover:text-[#7A1F3D]"
                      } ${sidebarCollapsed ? "lg:justify-center" : ""}`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={active ? 2.2 : 1.8}
                        className="shrink-0"
                      />

                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}

                      {!sidebarCollapsed && active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={() => setSidebarCollapsed((value) => !value)}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            className="hidden w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 lg:flex"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={17} />
            ) : (
              <>
                <ChevronLeft size={17} />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>

          {!sidebarCollapsed && (
            <div className="mt-2 rounded-xl bg-[#FCFAF7] p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-[#7A1F3D]">
                  <Activity size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800">
                    Lifeline Achham
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Management Portal
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div
        className={`min-h-screen transition-[margin] duration-300 ${
          sidebarCollapsed ? "lg:ml-[88px]" : "lg:ml-[270px]"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-900">
                {currentPageTitle}
              </h1>
              <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                Manage your organization and operations
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
              href="/admin/messages"
              aria-label="View messages"
              className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-[#7A1F3D]"
            >
              <Bell size={18} />
            </Link>

            {/* User profile */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50 sm:gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7A1F3D] text-sm font-bold text-white">
                  {(user?.name || user?.email || "A")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="max-w-[150px] truncate text-xs font-semibold text-slate-800">
                    {user?.name || user?.email || "Administrator"}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                    {role?.replaceAll("_", " ") || "Admin"}
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className="hidden text-slate-400 sm:block"
                />
              </button>

              {profileOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    onClick={() => setProfileOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />

                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                    <div className="border-b border-slate-100 px-3 py-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user?.name || "Administrator"}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {user?.email || ""}
                      </p>
                    </div>

                    <Link
                      href="/admin/settings"
                      onClick={() => setProfileOpen(false)}
                      className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>

                    {logoutError && (
                      <p
                        role="alert"
                        className="mx-2 my-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
                      >
                        {logoutError}
                      </p>
                    )}

                    <button
                      type="button"
                      disabled={loggingOut}
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <LogOut size={16} />
                      {loggingOut ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-76px)] p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#7A1F3D]" />
                Loading administration portal...
              </div>
            </div>
          ) : (
            children
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-white px-6 py-4">
          <div className="flex flex-col items-center justify-between gap-2 text-center text-[11px] text-slate-500 sm:flex-row sm:text-left">
            <p>
              © {new Date().getFullYear()} Lifeline Achham. All rights reserved.
            </p>

            <p>
              Designed and Developed by{" "}
              <a
                href="https://sudeeppandit.com.np"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#7A1F3D] hover:underline"
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
