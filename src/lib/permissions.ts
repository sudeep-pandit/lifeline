import { getSessionUser } from "@/lib/auth";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR"
  | "ACCOUNTANT"
  | "STAFF";

/* -------------------------------------------------------------------------- */
/* Permission Registry                                                        */
/* -------------------------------------------------------------------------- */

export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard.view",

  // Content Management
  CONTENT_VIEW: "content.view",
  CONTENT_CREATE: "content.create",
  CONTENT_EDIT: "content.edit",
  CONTENT_DELETE: "content.delete",

  // Programs
  PROGRAMS_VIEW: "programs.view",
  PROGRAMS_CREATE: "programs.create",
  PROGRAMS_EDIT: "programs.edit",
  PROGRAMS_DELETE: "programs.delete",

  // Projects
  PROJECTS_VIEW: "projects.view",
  PROJECTS_CREATE: "projects.create",
  PROJECTS_EDIT: "projects.edit",
  PROJECTS_DELETE: "projects.delete",

  // Campaigns
  CAMPAIGNS_VIEW: "campaigns.view",
  CAMPAIGNS_CREATE: "campaigns.create",
  CAMPAIGNS_EDIT: "campaigns.edit",
  CAMPAIGNS_DELETE: "campaigns.delete",

  // Media Library
  MEDIA_VIEW: "media.view",
  MEDIA_UPLOAD: "media.upload",
  MEDIA_EDIT: "media.edit",
  MEDIA_DELETE: "media.delete",

  // Gallery
  GALLERY_VIEW: "gallery.view",
  GALLERY_CREATE: "gallery.create",
  GALLERY_EDIT: "gallery.edit",
  GALLERY_DELETE: "gallery.delete",

  // Team
  TEAM_VIEW: "team.view",
  TEAM_CREATE: "team.create",
  TEAM_EDIT: "team.edit",
  TEAM_DELETE: "team.delete",

  // Blood Donation
  BLOOD_DONATION_VIEW: "bloodDonation.view",
  BLOOD_DONATION_CREATE: "bloodDonation.create",
  BLOOD_DONATION_EDIT: "bloodDonation.edit",
  BLOOD_DONATION_DELETE: "bloodDonation.delete",
  BLOOD_DONATION_MANAGE: "bloodDonation.manage",

  // Messages
  MESSAGES_VIEW: "messages.view",
  MESSAGES_MANAGE: "messages.manage",

  // Reports
  REPORTS_VIEW: "reports.view",
  REPORTS_CREATE: "reports.create",
  REPORTS_EDIT: "reports.edit",
  REPORTS_DELETE: "reports.delete",

  // Users and Roles
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_EDIT: "users.edit",
  USERS_DELETE: "users.delete",

  // Settings
  SETTINGS_VIEW: "settings.view",
  SETTINGS_EDIT: "settings.edit",

  // Finance and Billing
  FINANCE_VIEW: "finance.view",
  FINANCE_CREATE: "finance.create",
  FINANCE_EDIT: "finance.edit",
  FINANCE_DELETE: "finance.delete",
  FINANCE_SUBMIT: "finance.submit",
  FINANCE_APPROVE: "finance.approve",
  FINANCE_REJECT: "finance.reject",
  FINANCE_MARK_PAID: "finance.markPaid",
  FINANCE_MANAGE_CATEGORIES: "finance.manageCategories",
  FINANCE_MANAGE_PARTIES: "finance.manageParties",
  FINANCE_REPORTS: "finance.reports",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ALL_PERMISSIONS = Object.values(PERMISSIONS) as Permission[];

const VALID_PERMISSION_SET = new Set<string>(ALL_PERMISSIONS);

export type CustomPermissions = {
  granted: Permission[];
  revoked: Permission[];
};

/* -------------------------------------------------------------------------- */
/* Permission Groups                                                          */
/* -------------------------------------------------------------------------- */

export const PERMISSION_GROUPS = [
  {
    key: "dashboard",
    label: "Dashboard",
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
  },
  {
    key: "content",
    label: "Content Management",
    permissions: [
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.CONTENT_CREATE,
      PERMISSIONS.CONTENT_EDIT,
      PERMISSIONS.CONTENT_DELETE,
    ],
  },
  {
    key: "programs",
    label: "Programs",
    permissions: [
      PERMISSIONS.PROGRAMS_VIEW,
      PERMISSIONS.PROGRAMS_CREATE,
      PERMISSIONS.PROGRAMS_EDIT,
      PERMISSIONS.PROGRAMS_DELETE,
    ],
  },
  {
    key: "projects",
    label: "Projects",
    permissions: [
      PERMISSIONS.PROJECTS_VIEW,
      PERMISSIONS.PROJECTS_CREATE,
      PERMISSIONS.PROJECTS_EDIT,
      PERMISSIONS.PROJECTS_DELETE,
    ],
  },
  {
    key: "campaigns",
    label: "Campaigns",
    permissions: [
      PERMISSIONS.CAMPAIGNS_VIEW,
      PERMISSIONS.CAMPAIGNS_CREATE,
      PERMISSIONS.CAMPAIGNS_EDIT,
      PERMISSIONS.CAMPAIGNS_DELETE,
    ],
  },
  {
    key: "media",
    label: "Media Library",
    permissions: [
      PERMISSIONS.MEDIA_VIEW,
      PERMISSIONS.MEDIA_UPLOAD,
      PERMISSIONS.MEDIA_EDIT,
      PERMISSIONS.MEDIA_DELETE,
    ],
  },
  {
    key: "gallery",
    label: "Gallery",
    permissions: [
      PERMISSIONS.GALLERY_VIEW,
      PERMISSIONS.GALLERY_CREATE,
      PERMISSIONS.GALLERY_EDIT,
      PERMISSIONS.GALLERY_DELETE,
    ],
  },
  {
    key: "team",
    label: "Team",
    permissions: [
      PERMISSIONS.TEAM_VIEW,
      PERMISSIONS.TEAM_CREATE,
      PERMISSIONS.TEAM_EDIT,
      PERMISSIONS.TEAM_DELETE,
    ],
  },
  {
    key: "bloodDonation",
    label: "Blood Donation",
    permissions: [
      PERMISSIONS.BLOOD_DONATION_VIEW,
      PERMISSIONS.BLOOD_DONATION_CREATE,
      PERMISSIONS.BLOOD_DONATION_EDIT,
      PERMISSIONS.BLOOD_DONATION_DELETE,
      PERMISSIONS.BLOOD_DONATION_MANAGE,
    ],
  },
  {
    key: "messages",
    label: "Messages",
    permissions: [
      PERMISSIONS.MESSAGES_VIEW,
      PERMISSIONS.MESSAGES_MANAGE,
    ],
  },
  {
    key: "reports",
    label: "Reports",
    permissions: [
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_CREATE,
      PERMISSIONS.REPORTS_EDIT,
      PERMISSIONS.REPORTS_DELETE,
    ],
  },
  {
    key: "users",
    label: "Users & Roles",
    permissions: [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.USERS_DELETE,
    ],
  },
  {
    key: "settings",
    label: "Settings",
    permissions: [
      PERMISSIONS.SETTINGS_VIEW,
      PERMISSIONS.SETTINGS_EDIT,
    ],
  },
  {
    key: "finance",
    label: "Billing & Finance",
    permissions: [
      PERMISSIONS.FINANCE_VIEW,
      PERMISSIONS.FINANCE_CREATE,
      PERMISSIONS.FINANCE_EDIT,
      PERMISSIONS.FINANCE_DELETE,
      PERMISSIONS.FINANCE_SUBMIT,
      PERMISSIONS.FINANCE_APPROVE,
      PERMISSIONS.FINANCE_REJECT,
      PERMISSIONS.FINANCE_MARK_PAID,
      PERMISSIONS.FINANCE_MANAGE_CATEGORIES,
      PERMISSIONS.FINANCE_MANAGE_PARTIES,
      PERMISSIONS.FINANCE_REPORTS,
    ],
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Base Permissions by Role                                                   */
/* -------------------------------------------------------------------------- */

type StandardRole = Exclude<UserRole, "SUPER_ADMIN">;

const ROLE_PERMISSIONS: Record<StandardRole, Permission[]> = {
  ADMIN: [
    ...ALL_PERMISSIONS.filter(
      (permission) => permission !== PERMISSIONS.DASHBOARD_VIEW,
    ),
    PERMISSIONS.DASHBOARD_VIEW,
  ],

  EDITOR: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,

    PERMISSIONS.PROGRAMS_VIEW,
    PERMISSIONS.PROGRAMS_CREATE,
    PERMISSIONS.PROGRAMS_EDIT,

    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.PROJECTS_CREATE,
    PERMISSIONS.PROJECTS_EDIT,

    PERMISSIONS.CAMPAIGNS_VIEW,
    PERMISSIONS.CAMPAIGNS_CREATE,
    PERMISSIONS.CAMPAIGNS_EDIT,

    PERMISSIONS.MEDIA_VIEW,
    PERMISSIONS.MEDIA_UPLOAD,
    PERMISSIONS.MEDIA_EDIT,

    PERMISSIONS.GALLERY_VIEW,
    PERMISSIONS.GALLERY_CREATE,
    PERMISSIONS.GALLERY_EDIT,

    PERMISSIONS.TEAM_VIEW,
  ],

  ACCOUNTANT: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.FINANCE_CREATE,
    PERMISSIONS.FINANCE_EDIT,
    PERMISSIONS.FINANCE_SUBMIT,
    PERMISSIONS.FINANCE_MARK_PAID,
    PERMISSIONS.FINANCE_MANAGE_CATEGORIES,
    PERMISSIONS.FINANCE_MANAGE_PARTIES,
    PERMISSIONS.FINANCE_REPORTS,

    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_CREATE,
    PERMISSIONS.REPORTS_EDIT,

    PERMISSIONS.BLOOD_DONATION_VIEW,
    PERMISSIONS.MESSAGES_VIEW,
  ],

  STAFF: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.PROGRAMS_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.CAMPAIGNS_VIEW,
    PERMISSIONS.MEDIA_VIEW,
    PERMISSIONS.GALLERY_VIEW,
    PERMISSIONS.TEAM_VIEW,
    PERMISSIONS.BLOOD_DONATION_VIEW,
    PERMISSIONS.MESSAGES_VIEW,
    PERMISSIONS.REPORTS_VIEW,
  ],
};

/* -------------------------------------------------------------------------- */
/* Permission Helpers                                                         */
/* -------------------------------------------------------------------------- */

export function isValidPermission(
  permission: unknown,
): permission is Permission {
  return (
    typeof permission === "string" &&
    VALID_PERMISSION_SET.has(permission)
  );
}

export function getRolePermissions(role: UserRole): Permission[] {
  if (role === "SUPER_ADMIN") {
    return [...ALL_PERMISSIONS];
  }

  return [...ROLE_PERMISSIONS[role]];
}

/**
 * Custom grants add permissions.
 * Custom revocations remove permissions.
 * Revocations take precedence if a permission appears in both lists.
 * SUPER_ADMIN cannot be restricted by custom permissions.
 */
export function getEffectivePermissions(
  role: UserRole,
  customPermissions?: unknown,
): Permission[] {
  if (role === "SUPER_ADMIN") {
    return [...ALL_PERMISSIONS];
  }

  const effective = new Set<Permission>(
    getRolePermissions(role),
  );

  if (
    !customPermissions ||
    typeof customPermissions !== "object" ||
    Array.isArray(customPermissions)
  ) {
    return [...effective];
  }

  const custom = customPermissions as Partial<CustomPermissions>;

  const granted = Array.isArray(custom.granted)
    ? custom.granted
    : [];

  const revoked = Array.isArray(custom.revoked)
    ? custom.revoked
    : [];

  for (const permission of granted) {
    if (isValidPermission(permission)) {
      effective.add(permission);
    }
  }

  for (const permission of revoked) {
    if (isValidPermission(permission)) {
      effective.delete(permission);
    }
  }

  return [...effective];
}

export function hasPermission(
  role: UserRole,
  permission: Permission,
  customPermissions?: unknown,
): boolean {
  if (role === "SUPER_ADMIN") {
    return true;
  }

  return getEffectivePermissions(
    role,
    customPermissions,
  ).includes(permission);
}

/* -------------------------------------------------------------------------- */
/* Server-Side Permission Guard                                               */
/* -------------------------------------------------------------------------- */

export async function requirePermission(
  permission: Permission,
) {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (
    !hasPermission(
      user.role,
      permission,
      user.customPermissions,
    )
  ) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

/* -------------------------------------------------------------------------- */
/* Permission Check Using a User Object                                       */
/* -------------------------------------------------------------------------- */

export type PermissionUser = {
  role: UserRole;
  customPermissions?: unknown;
};

export function userHasPermission(
  user: PermissionUser,
  permission: Permission,
): boolean {
  return hasPermission(
    user.role,
    permission,
    user.customPermissions,
  );
}
