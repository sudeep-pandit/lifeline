"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Images,
  CalendarDays,
  FolderKanban,
  Megaphone,
  FileBarChart,
  BookOpen,
  Newspaper,
  Image as ImageIcon,
  FolderOpen,
  Users,
  HeartPulse,
  Droplets,
  ClipboardList,
  Wallet,
  Tags,
  MessageSquare,
  Settings,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Globe,
  PanelsTopLeft,
  X,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavGroup = {
  label: string;
  icon: React.ElementType;
  items: NavItem[];
};

const dashboard: NavItem = {
  label: "Dashboard",
  href: "/admin/dashboard",
  icon: LayoutDashboard,
};

const mediaStories: NavGroup = {
  label: "Media & Stories",
  icon: Images,
  items: [
    {
      label: "Programs",
      href: "/admin/content/programs",
      icon: CalendarDays,
    },
    {
      label: "Projects",
      href: "/admin/content/projects",
      icon: FolderKanban,
    },
    {
      label: "Campaigns",
      href: "/admin/content/campaigns",
      icon: Megaphone,
    },
    {
      label: "Reports",
      href: "/admin/content/reports",
      icon: FileBarChart,
    },
    {
      label: "Publications",
      href: "/admin/content/publications",
      icon: BookOpen,
    },
    {
      label: "News & Stories",
      href: "/admin/content/news",
      icon: Newspaper,
    },
    {
      label: "Gallery",
      href: "/admin/gallery",
      icon: ImageIcon,
    },
    {
      label: "Media Library",
      href: "/admin/media",
      icon: FolderOpen,
    },
  ],
};

const managementGroups: NavGroup[] = [
  {
    label: "Blood Donation",
    icon: Droplets,
    items: [
      {
        label: "Donors",
        href: "/admin/blood-donation/donors",
        icon: HeartPulse,
      },
      {
        label: "Blood Requests",
        href: "/admin/blood-donation/requests",
        icon: ClipboardList,
      },
      {
        label: "Blood Banks",
        href: "/admin/blood-donation/blood-banks",
        icon: Droplets,
      },
    ],
  },
  {
    label: "Finance",
    icon: Wallet,
    items: [
      {
        label: "Billing",
        href: "/admin/billing",
        icon: Wallet,
      },
      {
        label: "Categories",
        href: "/admin/billing/categories",
        icon: Tags,
      },
    ],
  },
];

const standaloneItems: NavItem[] = [
  {
    label: "Homepage",
    href: "/admin/homepage",
    icon: Globe,
  },
  {
    label: "Team",
    href: "/admin/team",
    icon: Users,
  },
  {
    label: "Footer",
    href: "/admin/organization/footer",
    icon: PanelsTopLeft,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    label: "Users & Access",
    href: "/admin/users",
    icon: ShieldCheck,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

export default function AdminSidebar({
  mobileOpen = false,
  onMobileClose,
  collapsed: controlledCollapsed,
  onCollapsedChange,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([
    "Media & Stories",
  ]);

  const collapsed = controlledCollapsed ?? internalCollapsed;

  function toggleCollapsed() {
    const next = !collapsed;
    setInternalCollapsed(next);
    onCollapsedChange?.(next);
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function groupIsActive(group: NavGroup) {
    return group.items.some((item) => isActive(item.href));
  }

  function toggleGroup(label: string) {
    setOpenGroups((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  }

  useEffect(() => {
    const activeGroups = [mediaStories, ...managementGroups]
      .filter((group) => groupIsActive(group))
      .map((group) => group.label);

    setOpenGroups((current) =>
      Array.from(new Set([...current, ...activeGroups]))
    );
  }, [pathname]);

  function closeMobile() {
    onMobileClose?.();
  }

  function renderLink(item: NavItem, nested = false) {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={closeMobile}
        title={collapsed ? item.label : undefined}
        aria-current={active ? "page" : undefined}
        className={[
          "group flex min-h-10 items-center gap-3 rounded-xl",
          "px-3 py-2 text-sm font-medium transition-colors",
          collapsed ? "justify-center" : "",
          nested && !collapsed ? "ml-2" : "",
          active
            ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        ].join(" ")}
      >
        <Icon
          size={18}
          strokeWidth={active ? 2.3 : 1.8}
          className="shrink-0"
        />

        {!collapsed && (
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
        )}

        {!collapsed && active && (
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
        )}
      </Link>
    );
  }

  function renderGroup(group: NavGroup) {
    const Icon = group.icon;
    const expanded = openGroups.includes(group.label);
    const active = groupIsActive(group);

    if (collapsed) {
      return (
        <div key={group.label} className="space-y-1">
          <button
            type="button"
            title={group.label}
            aria-label={group.label}
            onClick={toggleCollapsed}
            className={[
              "flex h-10 w-full items-center justify-center rounded-xl",
              active
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-100",
            ].join(" ")}
          >
            <Icon size={19} />
          </button>
        </div>
      );
    }

    return (
      <div key={group.label} className="space-y-1">
        <button
          type="button"
          onClick={() => toggleGroup(group.label)}
          aria-expanded={expanded}
          className={[
            "flex min-h-10 w-full items-center gap-3 rounded-xl",
            "px-3 py-2 text-left text-sm font-semibold",
            active
              ? "text-blue-700"
              : "text-slate-700 hover:bg-slate-100",
          ].join(" ")}
        >
          <Icon size={18} className="shrink-0" />

          <span className="min-w-0 flex-1 truncate">{group.label}</span>

          <ChevronDown
            size={15}
            className={[
              "shrink-0 transition-transform",
              expanded ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {expanded && (
          <div className="ml-3 space-y-1 border-l border-slate-200 pl-2">
            {group.items.map((item) => renderLink(item, true))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col",
          "border-r border-slate-200 bg-white",
          "transition-[width,transform] duration-200",
          collapsed ? "w-[76px]" : "w-[272px]",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-slate-100 px-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
            <HeartPulse size={23} />
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold tracking-tight text-slate-950">
                Lifeline Achham
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Administration
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close sidebar"
            className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
          <section className="space-y-1">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Workspace
              </p>
            )}

            {renderLink(dashboard)}
            {renderGroup(mediaStories)}
          </section>

          <section className="space-y-1">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Operations
              </p>
            )}

            {managementGroups.map(renderGroup)}
          </section>

          <section className="space-y-1">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Organization
              </p>
            )}

            {standaloneItems.map((item) => renderLink(item))}
          </section>
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-3">
          <Link
            href="/"
            target="_blank"
            className={[
              "mb-2 flex min-h-10 items-center gap-3 rounded-xl",
              "px-3 py-2 text-sm font-medium text-slate-600",
              "hover:bg-slate-100 hover:text-slate-950",
              collapsed ? "justify-center" : "",
            ].join(" ")}
          >
            <Globe size={18} className="shrink-0" />

            {!collapsed && (
              <>
                <span className="flex-1">View Website</span>
                <span className="text-xs">↗</span>
              </>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={[
              "hidden min-h-10 w-full items-center gap-3 rounded-xl",
              "px-3 py-2 text-sm text-slate-500",
              "hover:bg-slate-100 hover:text-slate-900 lg:flex",
              collapsed ? "justify-center" : "",
            ].join(" ")}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <>
                <PanelLeftClose size={18} />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
