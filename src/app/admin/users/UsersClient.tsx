"use client";

import {
  Check,
  ChevronDown,
  Edit3,
  KeyRound,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  UserRound,
  UserX,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR"
  | "ACCOUNTANT"
  | "STAFF";

type PermissionState = {
  granted: string[];
  revoked: string[];
};

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  customPermissions?: PermissionState | null;
  createdAt: string;
  updatedAt?: string;
};

type UserForm = {
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  customPermissions: PermissionState;
};

const roles: {
  value: Role;
  label: string;
  description: string;
}[] = [
  {
    value: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Full access to every system feature.",
  },
  {
    value: "ADMIN",
    label: "Admin",
    description: "Manage core organization operations.",
  },
  {
    value: "EDITOR",
    label: "Editor",
    description: "Manage website and published content.",
  },
  {
    value: "ACCOUNTANT",
    label: "Accountant",
    description: "Manage financial and accounting areas.",
  },
  {
    value: "STAFF",
    label: "Staff",
    description: "Limited operational access.",
  },
];

const permissionGroups = [
  {
    title: "Dashboard",
    permissions: [
      {
        key: "dashboard.view",
        label: "View Dashboard",
      },
    ],
  },
  {
    title: "Content",
    permissions: [
      {
        key: "content.view",
        label: "View Content",
      },
      {
        key: "content.create",
        label: "Create Content",
      },
      {
        key: "content.edit",
        label: "Edit Content",
      },
      {
        key: "content.delete",
        label: "Delete Content",
      },
    ],
  },
  {
    title: "Programs",
    permissions: [
      {
        key: "programs.view",
        label: "View Programs",
      },
      {
        key: "programs.create",
        label: "Create Programs",
      },
      {
        key: "programs.edit",
        label: "Edit Programs",
      },
      {
        key: "programs.delete",
        label: "Delete Programs",
      },
    ],
  },
  {
    title: "Projects",
    permissions: [
      {
        key: "projects.view",
        label: "View Projects",
      },
      {
        key: "projects.create",
        label: "Create Projects",
      },
      {
        key: "projects.edit",
        label: "Edit Projects",
      },
      {
        key: "projects.delete",
        label: "Delete Projects",
      },
    ],
  },
  {
    title: "Campaigns",
    permissions: [
      {
        key: "campaigns.view",
        label: "View Campaigns",
      },
      {
        key: "campaigns.create",
        label: "Create Campaigns",
      },
      {
        key: "campaigns.edit",
        label: "Edit Campaigns",
      },
      {
        key: "campaigns.delete",
        label: "Delete Campaigns",
      },
    ],
  },
  {
    title: "Media",
    permissions: [
      {
        key: "media.view",
        label: "View Media",
      },
      {
        key: "media.upload",
        label: "Upload Media",
      },
      {
        key: "media.edit",
        label: "Edit Media",
      },
      {
        key: "media.delete",
        label: "Delete Media",
      },
    ],
  },
  {
    title: "Gallery",
    permissions: [
      {
        key: "gallery.view",
        label: "View Gallery",
      },
      {
        key: "gallery.create",
        label: "Create Gallery",
      },
      {
        key: "gallery.edit",
        label: "Edit Gallery",
      },
      {
        key: "gallery.delete",
        label: "Delete Gallery",
      },
    ],
  },
  {
    title: "Team",
    permissions: [
      {
        key: "team.view",
        label: "View Team",
      },
      {
        key: "team.create",
        label: "Create Team",
      },
      {
        key: "team.edit",
        label: "Edit Team",
      },
      {
        key: "team.delete",
        label: "Delete Team",
      },
    ],
  },
  {
    title: "Blood Donation",
    permissions: [
      {
        key: "blood_donation.view",
        label: "View Blood Donation",
      },
      {
        key: "blood_donation.create",
        label: "Create Records",
      },
      {
        key: "blood_donation.edit",
        label: "Edit Records",
      },
      {
        key: "blood_donation.delete",
        label: "Delete Records",
      },
      {
        key: "blood_donation.manage",
        label: "Manage Blood Donation",
      },
    ],
  },
  {
    title: "Messages",
    permissions: [
      {
        key: "messages.view",
        label: "View Messages",
      },
      {
        key: "messages.manage",
        label: "Manage Messages",
      },
    ],
  },
  {
    title: "Reports",
    permissions: [
      {
        key: "reports.view",
        label: "View Reports",
      },
      {
        key: "reports.create",
        label: "Create Reports",
      },
      {
        key: "reports.edit",
        label: "Edit Reports",
      },
      {
        key: "reports.delete",
        label: "Delete Reports",
      },
    ],
  },
  {
    title: "Users",
    permissions: [
      {
        key: "users.view",
        label: "View Users",
      },
      {
        key: "users.create",
        label: "Create Users",
      },
      {
        key: "users.edit",
        label: "Edit Users",
      },
      {
        key: "users.delete",
        label: "Delete Users",
      },
    ],
  },
  {
    title: "Settings",
    permissions: [
      {
        key: "settings.view",
        label: "View Settings",
      },
      {
        key: "settings.edit",
        label: "Edit Settings",
      },
    ],
  },
];

const emptyForm: UserForm = {
  name: "",
  email: "",
  password: "",
  role: "STAFF",
  isActive: true,
  customPermissions: {
    granted: [],
    revoked: [],
  },
};

function roleLabel(role: Role) {
  return (
    roles.find((item) => item.value === role)?.label ??
    role
  );
}

function roleBadge(role: Role) {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-[#F7E9EE] text-[#7A1F3D]";

    case "ADMIN":
      return "bg-[#EEF4FF] text-[#2457C5]";

    case "EDITOR":
      return "bg-violet-50 text-violet-700";

    case "ACCOUNTANT":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function UsersClient() {
  const [users, setUsers] = useState<UserRecord[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState<
    Role | "ALL"
  >("ALL");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const [showModal, setShowModal] = useState(false);

  const [editingUser, setEditingUser] =
    useState<UserRecord | null>(null);

  const [form, setForm] =
    useState<UserForm>(emptyForm);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showPermissions, setShowPermissions] =
    useState(false);

  const [openMenu, setOpenMenu] = useState<
    string | null
  >(null);

  const [confirmDelete, setConfirmDelete] =
    useState<UserRecord | null>(null);

  const [passwordResetUser, setPasswordResetUser] =
    useState<UserRecord | null>(null);

  const [newPassword, setNewPassword] =
    useState("");

  const [resettingPassword, setResettingPassword] =
    useState(false);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/users", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to load users.",
        );
      }

      setUsers(data.users ?? data.data ?? []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load users.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" &&
          user.isActive) ||
        (statusFilter === "INACTIVE" &&
          !user.isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter(
        (user) => user.isActive,
      ).length,
      inactive: users.filter(
        (user) => !user.isActive,
      ).length,
      admins: users.filter(
        (user) =>
          user.role === "SUPER_ADMIN" ||
          user.role === "ADMIN",
      ).length,
    }),
    [users],
  );

  function openCreateModal() {
    setEditingUser(null);

    setForm({
      ...emptyForm,
      customPermissions: {
        granted: [],
        revoked: [],
      },
    });

    setShowPassword(false);
    setShowPermissions(false);
    setShowModal(true);
  }

  function openEditModal(user: UserRecord) {
    setEditingUser(user);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive,
      customPermissions: {
        granted:
          user.customPermissions?.granted ?? [],
        revoked:
          user.customPermissions?.revoked ?? [],
      },
    });

    setShowPassword(false);
    setShowPermissions(false);
    setOpenMenu(null);
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setEditingUser(null);
    setForm(emptyForm);
    setShowPermissions(false);
  }

  function updatePermission(
    permission: string,
    state: "granted" | "revoked" | "default",
  ) {
    setForm((current) => {
      const granted =
        current.customPermissions.granted.filter(
          (item) => item !== permission,
        );

      const revoked =
        current.customPermissions.revoked.filter(
          (item) => item !== permission,
        );

      if (state === "granted") {
        granted.push(permission);
      }

      if (state === "revoked") {
        revoked.push(permission);
      }

      return {
        ...current,
        customPermissions: {
          granted,
          revoked,
        },
      };
    });
  }

  function permissionState(permission: string) {
    if (
      form.customPermissions.granted.includes(
        permission,
      )
    ) {
      return "granted";
    }

    if (
      form.customPermissions.revoked.includes(
        permission,
      )
    ) {
      return "revoked";
    }

    return "default";
  }

  async function saveUser() {
    try {
      setSaving(true);
      setError("");

      if (!form.name.trim()) {
        throw new Error("Name is required.");
      }

      if (!form.email.trim()) {
        throw new Error("Email is required.");
      }

      if (!editingUser && !form.password) {
        throw new Error(
          "Password is required for a new user.",
        );
      }

      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        isActive: form.isActive,
        customPermissions:
          form.customPermissions,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const response = await fetch(
        editingUser
          ? `/api/users/${editingUser.id}`
          : "/api/users",
        {
          method: editingUser ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to save user.",
        );
      }

      await loadUsers();

      closeModal();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save user.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleUser(user: UserRecord) {
    try {
      setOpenMenu(null);

      const response = await fetch(
        `/api/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !user.isActive,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to update user.",
        );
      }

      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update user.",
      );
    }
  }

  async function deleteUser() {
    if (!confirmDelete) return;

    try {
      setSaving(true);

      const response = await fetch(
        `/api/users/${confirmDelete.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to delete user.",
        );
      }

      setConfirmDelete(null);

      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete user.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function resetPassword() {
    if (!passwordResetUser) return;

    try {
      setResettingPassword(true);

      if (!newPassword.trim()) {
        throw new Error(
          "Please enter a new password.",
        );
      }

      const response = await fetch(
        `/api/users/${passwordResetUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to reset password.",
        );
      }

      setPasswordResetUser(null);
      setNewPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset password.",
      );
    } finally {
      setResettingPassword(false);
    }
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F7E9EE] px-3 py-1.5 text-xs font-semibold text-[#7A1F3D]">
              <ShieldCheck size={14} />
              Access Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#172033]">
              Users & Roles
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage administrators, editors,
              accountants and staff members with
              role-based access control.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#55152B]"
          >
            <Plus size={18} />
            Add User
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <UserX
            size={19}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>
            <p className="text-sm font-semibold text-red-700">
              Something went wrong
            </p>

            <p className="mt-1 text-xs text-red-600">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats.total}
          icon={UserRound}
          iconClass="bg-[#F7E9EE] text-[#7A1F3D]"
        />

        <StatCard
          label="Active Users"
          value={stats.active}
          icon={UserCheck}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          label="Inactive Users"
          value={stats.inactive}
          icon={UserX}
          iconClass="bg-red-50 text-red-600"
        />

        <StatCard
          label="Administrators"
          value={stats.admins}
          icon={Shield}
          iconClass="bg-[#EEF4FF] text-[#2457C5]"
        />
      </div>

      {/* Users table */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-bold text-[#172033]">
                System Users
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredUsers.length} users
                displayed
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search users..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2457C5] focus:bg-white focus:ring-4 focus:ring-[#EEF4FF] sm:w-64"
                />
              </div>

              <Select
                value={roleFilter}
                onChange={(value) =>
                  setRoleFilter(
                    value as Role | "ALL",
                  )
                }
                options={[
                  {
                    value: "ALL",
                    label: "All Roles",
                  },
                  ...roles.map((role) => ({
                    value: role.value,
                    label: role.label,
                  })),
                ]}
              />

              <Select
                value={statusFilter}
                onChange={(value) =>
                  setStatusFilter(
                    value as
                      | "ALL"
                      | "ACTIVE"
                      | "INACTIVE",
                  )
                }
                options={[
                  {
                    value: "ALL",
                    label: "All Status",
                  },
                  {
                    value: "ACTIVE",
                    label: "Active",
                  },
                  {
                    value: "INACTIVE",
                    label: "Inactive",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  User
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Created
                </th>

                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-14 text-center"
                  >
                    <Loader2
                      size={24}
                      className="mx-auto animate-spin text-[#2457C5]"
                    />

                    <p className="mt-3 text-sm text-slate-400">
                      Loading users...
                    </p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-14 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <UsersIcon />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      No users found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or
                      filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7E9EE] text-xs font-bold text-[#7A1F3D]">
                          {getInitials(user.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {user.name}
                          </p>

                          <p className="truncate text-xs text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${roleBadge(
                          user.role,
                        )}`}
                      >
                        {roleLabel(user.role)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          user.isActive
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            user.isActive
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />

                        {user.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {formatDate(
                        user.createdAt,
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-flex">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === user.id
                                ? null
                                : user.id,
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreHorizontal
                            size={18}
                          />
                        </button>

                        {openMenu === user.id && (
                          <div className="absolute right-0 top-11 z-30 w-48 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl">
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  user,
                                )
                              }
                              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            >
                              <Edit3 size={15} />
                              Edit User
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setPasswordResetUser(
                                  user,
                                );
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            >
                              <KeyRound size={15} />
                              Reset Password
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                toggleUser(user)
                              }
                              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            >
                              {user.isActive ? (
                                <UserX
                                  size={15}
                                />
                              ) : (
                                <UserCheck
                                  size={15}
                                />
                              )}

                              {user.isActive
                                ? "Disable User"
                                : "Enable User"}
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDelete(
                                  user,
                                );
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={15} />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D]">
                  {editingUser ? (
                    <Edit3 size={20} />
                  ) : (
                    <UserPlus size={20} />
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#172033]">
                    {editingUser
                      ? "Edit User"
                      : "Add New User"}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {editingUser
                      ? "Update account details and access."
                      : "Create a new system account."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto px-6 py-6 sm:px-7">
              <div className="space-y-7">
                {/* Basic Information */}
                <div>
                  <div className="mb-4">
                    <p className="text-sm font-bold text-slate-800">
                      Basic Information
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Enter the user's account details.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Full Name"
                      required
                    >
                      <input
                        value={form.name}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            name: event.target
                              .value,
                          })
                        }
                        placeholder="e.g. Sudeep Pandit"
                        className="input-style"
                      />
                    </Field>

                    <Field
                      label="Email Address"
                      required
                    >
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            email:
                              event.target.value,
                          })
                        }
                        placeholder="user@example.com"
                        className="input-style"
                      />
                    </Field>

                    <Field
                      label={
                        editingUser
                          ? "New Password"
                          : "Password"
                      }
                      required={!editingUser}
                    >
                      <div className="relative">
                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          value={form.password}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              password:
                                event.target
                                  .value,
                            })
                          }
                          placeholder={
                            editingUser
                              ? "Leave blank to keep current"
                              : "Enter password"
                          }
                          className="input-style pr-11"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              !showPassword,
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <UserX size={17} />
                          ) : (
                            <KeyRound size={17} />
                          )}
                        </button>
                      </div>
                    </Field>

                    <Field label="Account Status">
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            isActive:
                              !form.isActive,
                          })
                        }
                        className={`flex h-11 w-full items-center justify-between rounded-xl border px-3.5 transition ${
                          form.isActive
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              form.isActive
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />

                          <span
                            className={`text-sm font-semibold ${
                              form.isActive
                                ? "text-emerald-700"
                                : "text-slate-600"
                            }`}
                          >
                            {form.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>

                        <span
                          className={`relative h-5 w-9 rounded-full transition ${
                            form.isActive
                              ? "bg-emerald-500"
                              : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                              form.isActive
                                ? "left-[18px]"
                                : "left-0.5"
                            }`}
                          />
                        </span>
                      </button>
                    </Field>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <div className="mb-4">
                    <p className="text-sm font-bold text-slate-800">
                      User Role
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Choose the user's primary access
                      level.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {roles.map((role) => {
                      const selected =
                        form.role ===
                        role.value;

                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              role: role.value,
                            })
                          }
                          className={`relative rounded-2xl border p-4 text-left transition ${
                            selected
                              ? "border-[#7A1F3D] bg-[#F7E9EE]"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p
                                className={`text-sm font-bold ${
                                  selected
                                    ? "text-[#7A1F3D]"
                                    : "text-slate-700"
                                }`}
                              >
                                {role.label}
                              </p>

                              <p className="mt-1 text-xs leading-5 text-slate-400">
                                {role.description}
                              </p>
                            </div>

                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                selected
                                  ? "border-[#7A1F3D] bg-[#7A1F3D] text-white"
                                  : "border-slate-300"
                              }`}
                            >
                              {selected && (
                                <Check size={12} />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Permissions */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70">
                  <button
                    type="button"
                    onClick={() =>
                      setShowPermissions(
                        !showPermissions,
                      )
                    }
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2457C5] shadow-sm">
                        <Shield size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Custom Permissions
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Override individual role
                          permissions when needed.
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition ${
                        showPermissions
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {showPermissions && (
                    <div className="border-t border-slate-200 p-5">
                      <div className="mb-5 rounded-xl border border-[#2457C5]/10 bg-[#EEF4FF] p-4">
                        <p className="text-xs leading-5 text-[#2457C5]">
                          <strong>How it works:</strong>{" "}
                          Default permissions come from
                          the selected role. Use{" "}
                          <strong>Grant</strong> to allow
                          an extra permission or{" "}
                          <strong>Revoke</strong> to
                          remove one.
                        </p>
                      </div>

                      <div className="space-y-5">
                        {permissionGroups.map(
                          (group) => (
                            <div
                              key={group.title}
                            >
                              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                                {group.title}
                              </p>

                              <div className="grid gap-2 sm:grid-cols-2">
                                {group.permissions.map(
                                  (permission) => {
                                    const state =
                                      permissionState(
                                        permission.key,
                                      );

                                    return (
                                      <div
                                        key={
                                          permission.key
                                        }
                                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                                      >
                                        <span className="text-xs font-medium text-slate-600">
                                          {
                                            permission.label
                                          }
                                        </span>

                                        <div className="flex shrink-0 gap-1">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              updatePermission(
                                                permission.key,
                                                state ===
                                                  "granted"
                                                  ? "default"
                                                  : "granted",
                                              )
                                            }
                                            className={`rounded-lg px-2 py-1 text-[10px] font-bold transition ${
                                              state ===
                                              "granted"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                                            }`}
                                          >
                                            Grant
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              updatePermission(
                                                permission.key,
                                                state ===
                                                  "revoked"
                                                  ? "default"
                                                  : "revoked",
                                              )
                                            }
                                            className={`rounded-lg px-2 py-1 text-[10px] font-bold transition ${
                                              state ===
                                              "revoked"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                            }`}
                                          >
                                            Revoke
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end sm:px-7">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveUser}
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-6 text-sm font-semibold text-white transition hover:bg-[#55152B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                )}

                {editingUser
                  ? "Save Changes"
                  : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={21} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              Delete User?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will permanently delete{" "}
              <strong className="text-slate-700">
                {confirmDelete.name}
              </strong>{" "}
              from the system.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setConfirmDelete(null)
                }
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteUser}
                disabled={saving}
                className="h-11 flex-1 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving
                  ? "Deleting..."
                  : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset */}
      {passwordResetUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
              <KeyRound size={21} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              Reset Password
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Set a new password for{" "}
              <strong className="text-slate-700">
                {passwordResetUser.name}
              </strong>
              .
            </p>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value,
                  )
                }
                placeholder="Enter new password"
                className="input-style"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setPasswordResetUser(null);
                  setNewPassword("");
                }}
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={resetPassword}
                disabled={resettingPassword}
                className="h-11 flex-1 rounded-xl bg-[#2457C5] text-sm font-semibold text-white hover:bg-[#17439F] disabled:opacity-60"
              >
                {resettingPassword
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={21} />
      </div>

      <p className="mt-4 text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-[#172033]">
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {label}

        {required && (
          <span className="ml-1 text-[#7A1F3D]">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-600 outline-none transition focus:border-[#2457C5] focus:bg-white focus:ring-4 focus:ring-[#EEF4FF] sm:w-auto"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

function UsersIcon() {
  return (
    <UsersIconSvg />
  );
}

function UsersIconSvg() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}