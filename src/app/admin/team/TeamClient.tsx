"use client";

import {
  CheckCircle2,
  Edit3,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
  UserRound,
  UserX,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TeamMember = {
  id: string;
  name: string;
  slug: string;
  designation: string;
  department: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  imageId: string | null;
  image: {
    id: string;
    url: string;
    alt: string | null;
    originalName: string;
  } | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
  website: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
};

type TeamForm = {
  name: string;
  designation: string;
  department: string;
  bio: string;
  email: string;
  phone: string;
  imageId: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  website: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
};

const emptyForm: TeamForm = {
  name: "",
  designation: "",
  department: "Executive Board",
  bio: "",
  email: "",
  phone: "",
  imageId: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  website: "",
  isFeatured: false,
  isActive: true,
  sortOrder: 0,
};

const departments = [
  "Executive Board",
  "Advisory Council",
  "Technical Team",
];

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2457C5] focus:ring-4 focus:ring-[#EEF4FF]";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-2 block text-xs font-semibold text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function TeamClient() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] =
    useState<TeamMember | null>(null);
  const [form, setForm] = useState<TeamForm>(emptyForm);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<TeamMember | null>(null);

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/team", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to load team members.",
        );
      }

      setMembers(data.members ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load team members.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const stats = useMemo(
    () => ({
      total: members.length,
      active: members.filter((m) => m.isActive).length,
      featured: members.filter((m) => m.isFeatured).length,
      inactive: members.filter((m) => !m.isActive).length,
    }),
    [members],
  );

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.designation.toLowerCase().includes(query) ||
        (member.email ?? "").toLowerCase().includes(query);

      const matchesDepartment =
        departmentFilter === "ALL" ||
        member.department === departmentFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && member.isActive) ||
        (statusFilter === "INACTIVE" && !member.isActive);

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [members, search, departmentFilter, statusFilter]);

  function clearSelectedImage() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setSelectedImage(null);
    setImagePreview("");
    setRemoveImage(true);
    setForm((current) => ({ ...current, imageId: "" }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function resetImageState() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setSelectedImage(null);
    setImagePreview("");
    setRemoveImage(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function openCreate() {
    setEditingMember(null);
    setForm({ ...emptyForm });
    resetImageState();
    setError("");
    setNotice("");
    setShowModal(true);
  }

  function openEdit(member: TeamMember) {
    setEditingMember(member);

    setForm({
      name: member.name,
      designation: member.designation,
      department: member.department ?? "",
      bio: member.bio ?? "",
      email: member.email ?? "",
      phone: member.phone ?? "",
      imageId: member.imageId ?? "",
      facebook: member.facebook ?? "",
      instagram: member.instagram ?? "",
      linkedin: member.linkedin ?? "",
      twitter: member.twitter ?? "",
      website: member.website ?? "",
      isFeatured: member.isFeatured,
      isActive: member.isActive,
      sortOrder: member.sortOrder,
    });

    resetImageState();
    setImagePreview(member.image?.url ?? "");
    setError("");
    setNotice("");
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setEditingMember(null);
    setForm({ ...emptyForm });
    resetImageState();
  }

  function handleImageChange(file?: File) {
    if (!file) return;

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please choose a JPG, PNG, WEBP, GIF, or SVG image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("The image must be smaller than 10 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    setSelectedImage(file);
    setImagePreview(previewUrl);
    setRemoveImage(false);
  }

  async function uploadSelectedImage(): Promise<string | null> {
    if (!selectedImage) {
      return removeImage ? null : form.imageId || null;
    }

    const uploadData = new FormData();
    uploadData.append("file", selectedImage);
    uploadData.append("alt", form.name.trim() || selectedImage.name);

    const response = await fetch("/api/media", {
      method: "POST",
      body: uploadData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Image upload failed. Check your media.upload permission.",
      );
    }

    if (!data.media?.id) {
      throw new Error("Image uploaded, but the Media Library returned no ID.");
    }

    return data.media.id as string;
  }

  async function saveMember() {
    try {
      setSaving(true);
      setError("");
      setNotice("");

      if (!form.name.trim()) {
        throw new Error("Please enter the member's name.");
      }

      if (!form.designation.trim()) {
        throw new Error("Please enter the member's designation.");
      }

      const imageId = await uploadSelectedImage();

      const payload = {
        ...form,
        name: form.name.trim(),
        slug: slugify(form.name),
        designation: form.designation.trim(),
        department: form.department || null,
        bio: form.bio.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        imageId,
        facebook: form.facebook.trim() || null,
        instagram: form.instagram.trim() || null,
        linkedin: form.linkedin.trim() || null,
        twitter: form.twitter.trim() || null,
        website: form.website.trim() || null,
      };

      const response = await fetch(
        editingMember
          ? `/api/team/${editingMember.id}`
          : "/api/team",
        {
          method: editingMember ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to save team member.",
        );
      }

      setNotice(data.message || "Team member saved successfully.");
      setShowModal(false);
      setEditingMember(null);
      setForm({ ...emptyForm });
      resetImageState();
      await loadMembers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save team member.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateMember(member: TeamMember, changes: object) {
    try {
      setError("");
      setNotice("");

      const response = await fetch(`/api/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to update team member.",
        );
      }

      setNotice(data.message || "Team member updated successfully.");
      await loadMembers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update team member.",
      );
    }
  }

  async function deleteMember() {
    if (!deleteTarget) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/team/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to delete team member.",
        );
      }

      setDeleteTarget(null);
      setNotice(data.message || "Team member deleted successfully.");
      await loadMembers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete team member.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-7">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F7E9EE] px-3 py-1.5 text-xs font-semibold text-[#7A1F3D]">
              <Users size={14} />
              Organization Management
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-[#172033]">
              Team Management
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage Lifeline Achham’s executive board, advisory council,
              and technical team profiles.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-5 text-sm font-semibold text-white transition hover:bg-[#55152B]"
          >
            <Plus size={18} />
            Add Member
          </button>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <X size={18} className="mt-0.5 shrink-0 text-red-600" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-red-700">
              Something went wrong
            </p>
            <p className="mt-1 break-words text-xs text-red-600">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto text-red-500"
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {notice && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="ml-auto"
            aria-label="Dismiss notice"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Members"
          value={stats.total}
          icon={<Users size={21} />}
          iconClass="bg-[#F7E9EE] text-[#7A1F3D]"
        />
        <StatCard
          label="Active Members"
          value={stats.active}
          icon={<UserRound size={21} />}
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Featured Members"
          value={stats.featured}
          icon={<Star size={21} />}
          iconClass="bg-[#EEF4FF] text-[#2457C5]"
        />
        <StatCard
          label="Inactive Members"
          value={stats.inactive}
          icon={<UserX size={21} />}
          iconClass="bg-red-50 text-red-600"
        />
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-bold text-[#172033]">Team Directory</h2>
              <p className="mt-1 text-xs text-slate-500">
                {filteredMembers.length} members displayed
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search team..."
                  className={`${inputClass} pl-10 sm:w-56`}
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                className={`${inputClass} sm:w-auto`}
              >
                <option value="ALL">All Departments</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={`${inputClass} sm:w-auto`}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {["Member", "Department", "Status", "Display Order", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Loader2
                      size={24}
                      className="mx-auto animate-spin text-[#2457C5]"
                    />
                    <p className="mt-3 text-sm text-slate-400">
                      Loading team members...
                    </p>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Users size={22} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      No team members found
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try another filter or add your first member.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {member.image?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={member.image.url}
                            alt={member.image.alt || member.name}
                            className="h-11 w-11 shrink-0 rounded-xl border border-slate-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7E9EE] text-xs font-bold text-[#7A1F3D]">
                            {initials(member.name)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="flex items-center gap-2 truncate text-sm font-semibold text-slate-800">
                            {member.name}
                            {member.isFeatured && (
                              <Star
                                size={13}
                                className="shrink-0 fill-amber-400 text-amber-400"
                              />
                            )}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-400">
                            {member.designation}
                          </p>
                          <p className="mt-1 truncate text-[11px] text-slate-400">
                            {member.email || "No email added"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[11px] font-semibold text-[#2457C5]">
                        {member.department || "Unassigned"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${member.isActive ? "text-emerald-600" : "text-red-500"}`}>
                        <span className={`h-2 w-2 rounded-full ${member.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-slate-700">
                        {member.sortOrder}
                      </span>
                      <p className="mt-1 text-[11px] text-slate-400">
                        Added {formatDate(member.createdAt)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => void updateMember(member, { isFeatured: !member.isFeatured })}
                          title={member.isFeatured ? "Remove from featured" : "Mark as featured"}
                          aria-label={member.isFeatured ? "Remove from featured" : "Mark as featured"}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${member.isFeatured ? "bg-amber-50 text-amber-600" : "text-slate-400 hover:bg-amber-50 hover:text-amber-600"}`}
                        >
                          <Star size={16} className={member.isFeatured ? "fill-current" : ""} />
                        </button>

                        <button
                          type="button"
                          onClick={() => void updateMember(member, { isActive: !member.isActive })}
                          title={member.isActive ? "Deactivate" : "Activate"}
                          aria-label={member.isActive ? "Deactivate" : "Activate"}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          {member.isActive ? <UserX size={16} /> : <CheckCircle2 size={16} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(member)}
                          title="Edit member"
                          aria-label="Edit member"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#EEF4FF] hover:text-[#2457C5]"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(member)}
                          title="Delete member"
                          aria-label="Delete member"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-[#172033]">
                  {editingMember ? "Edit Team Member" : "Add Team Member"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Add a profile photo and enter the member's details.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6">
              <div className="space-y-7">
                <section>
                  <h3 className="mb-4 text-sm font-bold text-slate-800">
                    Profile Photo
                  </h3>

                  <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-5 sm:flex-row">
                    <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imagePreview}
                          alt="Team member preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <ImagePlus size={30} />
                          <span className="text-xs">No photo</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-sm font-semibold text-slate-800">
                        Upload a profile photo
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        JPG, PNG, WEBP, GIF or SVG. Maximum file size: 10 MB.
                        The preview updates immediately.
                      </p>

                      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2457C5] px-4 text-xs font-semibold text-white transition hover:bg-blue-800"
                        >
                          <ImagePlus size={16} />
                          {imagePreview ? "Change Photo" : "Choose Photo"}
                        </button>

                        {imagePreview && (
                          <button
                            type="button"
                            onClick={clearSelectedImage}
                            className="h-10 rounded-xl border border-red-200 bg-white px-4 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        className="hidden"
                        onChange={(event) =>
                          handleImageChange(event.target.files?.[0])
                        }
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-sm font-bold text-slate-800">
                    Basic Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name *">
                      <input
                        value={form.name}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        placeholder="Full name"
                        className={inputClass}
                        required
                      />
                    </Field>

                    <Field label="Designation *">
                      <input
                        value={form.designation}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            designation: event.target.value,
                          }))
                        }
                        placeholder="e.g. Chairperson"
                        className={inputClass}
                        required
                      />
                    </Field>

                    <Field label="Department">
                      <select
                        value={form.department}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            department: event.target.value,
                          }))
                        }
                        className={inputClass}
                      >
                        {departments.map((department) => (
                          <option key={department} value={department}>
                            {department}
                          </option>
                        ))}
                        <option value="">Unassigned</option>
                      </select>
                    </Field>

                    <Field label="Email Address">
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        placeholder="member@example.com"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Phone Number">
                      <input
                        value={form.phone}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                        placeholder="+977 ..."
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Display Order">
                      <input
                        type="number"
                        value={form.sortOrder}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            sortOrder: Number(event.target.value),
                          }))
                        }
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Biography" full>
                      <textarea
                        rows={4}
                        value={form.bio}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            bio: event.target.value,
                          }))
                        }
                        placeholder="Short profile biography..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2457C5] focus:ring-4 focus:ring-[#EEF4FF]"
                      />
                    </Field>
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-sm font-bold text-slate-800">
                    Social Links
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(
                      [
                        ["facebook", "Facebook URL"],
                        ["instagram", "Instagram URL"],
                        ["linkedin", "LinkedIn URL"],
                        ["twitter", "X / Twitter URL"],
                        ["website", "Personal / Organization Website"],
                      ] as const
                    ).map(([key, label]) => (
                      <Field key={key} label={label}>
                        <input
                          type="url"
                          value={form[key]}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              [key]: event.target.value,
                            }))
                          }
                          placeholder="https://..."
                          className={inputClass}
                        />
                      </Field>
                    ))}
                  </div>
                </section>

                <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <Toggle
                    label="Active profile"
                    description="Active members can appear on the public website."
                    checked={form.isActive}
                    onChange={(checked) =>
                      setForm((current) => ({ ...current, isActive: checked }))
                    }
                  />
                  <div className="border-t border-slate-200" />
                  <Toggle
                    label="Featured member"
                    description="Highlight this member in featured team sections."
                    checked={form.isFeatured}
                    onChange={(checked) =>
                      setForm((current) => ({ ...current, isFeatured: checked }))
                    }
                  />
                </section>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveMember()}
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-6 text-sm font-semibold text-white hover:bg-[#55152B] disabled:opacity-60"
              >
                {saving && <Loader2 size={17} className="animate-spin" />}
                {editingMember ? "Save Changes" : "Create Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={21} />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-800">
              Delete team member?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will permanently delete{" "}
              <strong className="text-slate-700">{deleteTarget.name}</strong>.
              Their profile will no longer be available.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={saving}
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void deleteMember()}
                disabled={saving}
                className="h-11 flex-1 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? "Deleting..." : "Delete Member"}
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
  icon,
  iconClass,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}>
        {icon}
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-[#172033]">{value}</p>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-emerald-500" : "bg-slate-300"}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}
