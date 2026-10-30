
import {
  Activity,
  BookOpen,
  FileText,
  FolderOpen,
  HeartPulse,
  Home,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  ReceiptText,
  Settings,
  ShieldCheck,
  Users,
  Images,
  Droplet,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
};

export type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

export const adminNavigation: NavigationSection[] = [
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
    title: "Media & Stories",
    items: [
      {
        label: "Programs",
        href: "/admin/content/programs",
        icon: BookOpen,
        permission: "content.view",
      },
      {
        label: "Projects",
        href: "/admin/content/projects",
        icon: FolderOpen,
        permission: "content.view",
      },
      {
        label: "Campaigns",
        href: "/admin/content/campaigns",
        icon: Activity,
        permission: "content.view",
      },
      {
        label: "Reports",
        href: "/admin/content/reports",
        icon: FileText,
        permission: "content.view",
      },
      {
        label: "Publications",
        href: "/admin/content/publications",
        icon: Newspaper,
        permission: "content.view",
      },
      {
        label: "News & Stories",
        href: "/admin/content/news",
        icon: MessageSquare,
        permission: "content.view",
      },
      {
        label: "Gallery",
        href: "/admin/gallery",
        icon: Images,
        permission: "media.view",
      },
      {
        label: "Media Library",
        href: "/admin/media",
        icon: FolderOpen,
        permission: "media.view",
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
        label: "Team",
        href: "/admin/team",
        icon: Users,
        permission: "team.view",
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

export const adminConfig = {
  name: "Lifeline Achham",
  subtitle: "Administration",
  loginPath: "/login",
  dashboardPath: "/admin/dashboard",
  navigation: adminNavigation,
};
