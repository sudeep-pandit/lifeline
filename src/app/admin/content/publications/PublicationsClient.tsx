
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type PublicationCategory =
  | "GUIDE_MANUAL"
  | "AWARENESS_MATERIAL"
  | "RESEARCH_LEARNING"
  | "PUBLICATION";

type PublicationStatus = "DRAFT" | "PUBLISHED";

type Publication = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: PublicationCategory;
  status: PublicationStatus;
  publicationYear: string | null;
  language: string | null;
  author: string | null;
  publisher: string | null;
  edition: string | null;
  isbn: string | null;
  pdfUrl: string;
  pdfName: string;
  pdfSize: number;
  coverImageUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type PublicationForm = {
  title: string;
  description: string;
  category: PublicationCategory;
  status: PublicationStatus;
  publicationYear: string;
  language: string;
  author: string;
  publisher: string;
  edition: string;
  isbn: string;
  coverImageUrl: string;
  isFeatured: boolean;
  sortOrder: string;
  file: File | null;
};

const CATEGORY_OPTIONS: {
  value: PublicationCategory;
  label: string;
}[] = [
  { value: "GUIDE_MANUAL", label: "Guides & Manuals" },
  { value: "AWARENESS_MATERIAL", label: "Awareness Materials" },
  { value: "RESEARCH_LEARNING", label: "Research & Learning" },
  { value: "PUBLICATION", label: "Publications" },
];

const EMPTY_FORM: PublicationForm = {
  title: "",
  description: "",
  category: "PUBLICATION",
  status: "DRAFT",
  publicationYear: "",
  language: "English",
  author: "",
  publisher: "Lifeline Achham",
  edition: "",
  isbn: "",
  coverImageUrl: "",
  isFeatured: false,
  sortOrder: "0",
  file: null,
};

function categoryLabel(category: PublicationCategory) {
  return (
    CATEGORY_OPTIONS.find((item) => item.value === category)?.label ??
    "Publication"
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string | null) {
  if (!value) return "Not published";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-NP", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getErrorMessage(
  result: unknown,
  fallback: string,
): string {
  if (
    result &&
    typeof result === "object" &&
    "message" in result &&
    typeof result.message === "string"
  ) {
    return result.message;
  }

  return fallback;
}

export default function PublicationsClient() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Publication | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<PublicationForm>({ ...EMPTY_FORM });

  const loadPublications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (categoryFilter !== "ALL") params.set("category", categoryFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const response = await fetch(
        `/api/publications?${params.toString()}`,
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        },
      );

      const result: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result, "Unable to load publications."),
        );
      }

      if (
        !result ||
        typeof result !== "object" ||
        !("publications" in result) ||
        !Array.isArray(result.publications)
      ) {
        throw new Error("The server returned an unexpected response.");
      }

      setPublications(result.publications as Publication[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load publications.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter]);

  useEffect(() => {
    void loadPublications();
  }, [loadPublications]);

  const stats = useMemo(
    () => ({
      total: publications.length,
      published: publications.filter((item) => item.status === "PUBLISHED")
        .length,
      drafts: publications.filter((item) => item.status === "DRAFT").length,
      featured: publications.filter((item) => item.isFeatured).length,
    }),
    [publications],
  );

  function openCreateModal() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function openEditModal(publication: Publication) {
    setEditing(publication);
    setForm({
      title: publication.title,
      description: publication.description ?? "",
      category: publication.category,
      status: publication.status,
      publicationYear: publication.publicationYear ?? "",
      language: publication.language ?? "English",
      author: publication.author ?? "",
      publisher: publication.publisher ?? "",
      edition: publication.edition ?? "",
      isbn: publication.isbn ?? "",
      coverImageUrl: publication.coverImageUrl ?? "",
      isFeatured: publication.isFeatured,
      sortOrder: String(publication.sortOrder),
      file: null,
    });
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function updateForm<K extends keyof PublicationForm>(
    key: K,
    value: PublicationForm[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.title.trim()) {
      setError("Please enter a publication title.");
      return;
    }

    if (!editing && !form.file) {
      setError("Please choose a PDF file for this publication.");
      return;
    }

    if (form.file) {
      if (
        form.file.type !== "application/pdf" ||
        !form.file.name.toLowerCase().endsWith(".pdf")
      ) {
        setError("Only PDF files are allowed.");
        return;
      }

      if (form.file.size > 25 * 1024 * 1024) {
        setError("The PDF must be 25 MB or smaller.");
        return;
      }
    }

    const payload = new FormData();

    payload.set("title", form.title.trim());
    payload.set("description", form.description.trim());
    payload.set("category", form.category);
    payload.set("status", form.status);
    payload.set("publicationYear", form.publicationYear.trim());
    payload.set("language", form.language.trim());
    payload.set("author", form.author.trim());
    payload.set("publisher", form.publisher.trim());
    payload.set("edition", form.edition.trim());
    payload.set("isbn", form.isbn.trim());
    payload.set("coverImageUrl", form.coverImageUrl.trim());
    payload.set("isFeatured", String(form.isFeatured));
    payload.set("sortOrder", form.sortOrder);

    if (form.file) {
      payload.set("file", form.file);
    }

    setSaving(true);

    try {
      const response = await fetch(
        editing
          ? `/api/publications/${editing.id}`
          : "/api/publications",
        {
          method: editing ? "PATCH" : "POST",
          credentials: "same-origin",
          body: payload,
        },
      );

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            result,
            `Unable to ${editing ? "update" : "create"} publication.`,
          ),
        );
      }

      setModalOpen(false);
      setEditing(null);
      setForm({ ...EMPTY_FORM });
      setNotice(
        editing
          ? "Publication updated successfully."
          : "Publication created successfully.",
      );

      await loadPublications();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the publication.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublicationStatus(publication: Publication) {
    setError("");
    setNotice("");

    const payload = new FormData();
    payload.set("title", publication.title);
    payload.set("description", publication.description ?? "");
    payload.set("category", publication.category);
    payload.set(
      "status",
      publication.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
    );
    payload.set("publicationYear", publication.publicationYear ?? "");
    payload.set("language", publication.language ?? "English");
    payload.set("author", publication.author ?? "");
    payload.set("publisher", publication.publisher ?? "");
    payload.set("edition", publication.edition ?? "");
    payload.set("isbn", publication.isbn ?? "");
    payload.set("coverImageUrl", publication.coverImageUrl ?? "");
    payload.set("isFeatured", String(publication.isFeatured));
    payload.set("sortOrder", String(publication.sortOrder));

    try {
      const response = await fetch(`/api/publications/${publication.id}`, {
        method: "PATCH",
        credentials: "same-origin",
        body: payload,
      });

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result, "Unable to change publication status."),
        );
      }

      setNotice(
        publication.status === "PUBLISHED"
          ? "Publication moved to drafts."
          : "Publication published successfully.",
      );

      await loadPublications();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to change publication status.",
      );
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/publications/${deleteTarget.id}`,
        {
          method: "DELETE",
          credentials: "same-origin",
        },
      );

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result, "Unable to delete publication."),
        );
      }

      setDeleteTarget(null);
      setNotice("Publication deleted successfully.");
      await loadPublications();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete publication.",
      );
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FCFAF7] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#7A1F3D]">
              <BookOpen size={17} />
              Resources management
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Publications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Upload and manage guides, awareness materials, research and
              learning resources published by Lifeline Achham.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#55152B]"
          >
            <Plus size={18} />
            Add publication
          </button>
        </header>

        {notice && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <p className="flex-1">{notice}</p>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setNotice("")}
            >
              <X size={17} />
            </button>
          </div>
        )}

        {error && !modalOpen && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p className="flex-1">{error}</p>
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setError("")}
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total publications",
              value: stats.total,
              icon: FileText,
              color: "bg-[#F3E7EC] text-[#7A1F3D]",
            },
            {
              label: "Published",
              value: stats.published,
              icon: CheckCircle2,
              color: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Drafts",
              value: stats.drafts,
              icon: Pencil,
              color: "bg-amber-50 text-amber-700",
            },
            {
              label: "Featured",
              value: stats.featured,
              icon: BookOpen,
              color: "bg-blue-50 text-[#2457C5]",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon size={19} />
                  </span>
                </div>
                <p className="mt-4 text-3xl font-bold tracking-tight">
                  {loading ? "—" : stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search titles, authors, publishers..."
                  className="w-full rounded-xl border border-slate-200 bg-[#FCFAF7] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#7A1F3D] focus:ring-2 focus:ring-[#7A1F3D]/10"
                />
              </div>

              <div className="relative">
                <Filter
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-8 text-sm outline-none focus:border-[#7A1F3D] sm:w-56"
                  aria-label="Filter by category"
                >
                  <option value="ALL">All categories</option>
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#7A1F3D] sm:w-40"
                aria-label="Filter by status"
              >
                <option value="ALL">All statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Drafts</option>
              </select>

              <button
                type="button"
                onClick={() => void loadPublications()}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-sm text-slate-500">
              <LoaderCircle className="animate-spin text-[#7A1F3D]" size={28} />
              Loading publications...
            </div>
          ) : error && publications.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
              <AlertCircle size={30} className="text-red-500" />
              <p className="font-semibold text-slate-800">
                Unable to load publications
              </p>
              <p className="max-w-md text-sm text-slate-500">{error}</p>
              <button
                type="button"
                onClick={() => void loadPublications()}
                className="mt-2 rounded-lg bg-[#7A1F3D] px-4 py-2 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : publications.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E7EC] text-[#7A1F3D]">
                <BookOpen size={25} />
              </div>
              <h2 className="mt-4 font-semibold text-slate-900">
                No publications found
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Add your first publication or change your search and filters.
              </p>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#55152B]"
              >
                <Plus size={17} />
                Add publication
              </button>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Publication</th>
                      <th className="px-5 py-4 font-semibold">Category</th>
                      <th className="px-5 py-4 font-semibold">Year</th>
                      <th className="px-5 py-4 font-semibold">PDF file</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {publications.map((publication) => (
                      <tr
                        key={publication.id}
                        className="transition hover:bg-[#FCFAF7]/70"
                      >
                        <td className="max-w-sm px-5 py-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3E7EC] text-[#7A1F3D]">
                              <FileText size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="line-clamp-2 font-semibold text-slate-900">
                                {publication.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {publication.author || publication.publisher || "Lifeline Achham"}
                              </p>
                              {publication.isFeatured && (
                                <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#2457C5]">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {categoryLabel(publication.category)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {publication.publicationYear || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <a
                            href={publication.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex max-w-48 items-center gap-2 text-sm font-medium text-[#2457C5] hover:underline"
                            title={publication.pdfName}
                          >
                            <Download size={15} className="shrink-0" />
                            <span className="truncate">{publication.pdfName}</span>
                          </a>
                          <p className="mt-1 text-xs text-slate-400">
                            {formatFileSize(publication.pdfSize)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              publication.status === "PUBLISHED"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {publication.status === "PUBLISHED" ? "Published" : "Draft"}
                          </span>
                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(publication.publishedAt)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <a
                              href={publication.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Preview PDF"
                              aria-label={`Preview ${publication.title}`}
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-[#2457C5]"
                            >
                              <Eye size={17} />
                            </a>
                            <button
                              type="button"
                              onClick={() => openEditModal(publication)}
                              title="Edit publication"
                              aria-label={`Edit ${publication.title}`}
                              className="rounded-lg p-2 text-slate-500 hover:bg-[#F3E7EC] hover:text-[#7A1F3D]"
                            >
                              <Pencil size={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => void togglePublicationStatus(publication)}
                              title={publication.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                              aria-label={`${publication.status === "PUBLISHED" ? "Unpublish" : "Publish"} ${publication.title}`}
                              className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <Send size={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(publication)}
                              title="Delete publication"
                              aria-label={`Delete ${publication.title}`}
                              className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {publications.map((publication) => (
                  <article key={publication.id} className="space-y-4 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3E7EC] text-[#7A1F3D]">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-slate-900">
                          {publication.title}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                          {categoryLabel(publication.category)} ·{" "}
                          {publication.publicationYear || "Year not set"}
                        </p>
                        <span
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            publication.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {publication.status === "PUBLISHED" ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>

                    <a
                      href={publication.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-[#2457C5]"
                    >
                      <Download size={16} />
                      <span className="min-w-0 flex-1 truncate">{publication.pdfName}</span>
                      <span className="shrink-0 text-xs text-slate-400">
                        {formatFileSize(publication.pdfSize)}
                      </span>
                    </a>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(publication)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void togglePublicationStatus(publication)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        <Send size={14} />
                        {publication.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(publication)}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center">
                <p>
                  Showing {publications.length} publication
                  {publications.length === 1 ? "" : "s"}
                </p>
                <p>Changes are saved to your database.</p>
              </div>
            </>
          )}
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="publication-form-title"
            className="max-h-[95dvh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-7">
              <div>
                <h2
                  id="publication-form-title"
                  className="text-lg font-bold text-slate-900"
                >
                  {editing ? "Edit publication" : "Add publication"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Complete the details and attach a PDF document.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setError("");
                }}
                aria-label="Close publication form"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Publication title <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    maxLength={200}
                    value={form.title}
                    onChange={(event) => updateForm("title", event.target.value)}
                    placeholder="e.g. Community Health Awareness Guide"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7A1F3D] focus:ring-2 focus:ring-[#7A1F3D]/10"
                  />
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Description
                  </span>
                  <textarea
                    rows={3}
                    maxLength={10000}
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    placeholder="Describe the purpose and contents of this resource..."
                    className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7A1F3D] focus:ring-2 focus:ring-[#7A1F3D]/10"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Category <span className="text-red-500">*</span>
                  </span>
                  <select
                    required
                    value={form.category}
                    onChange={(event) =>
                      updateForm(
                        "category",
                        event.target.value as PublicationCategory,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#7A1F3D]"
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Publication status
                  </span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value as PublicationStatus)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#7A1F3D]"
                  >
                    <option value="DRAFT">Draft — not public</option>
                    <option value="PUBLISHED">Published — visible publicly</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Publication year
                  </span>
                  <input
                    maxLength={20}
                    value={form.publicationYear}
                    onChange={(event) =>
                      updateForm("publicationYear", event.target.value)
                    }
                    placeholder="2026 or 2082/83"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7A1F3D]"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Language
                  </span>
                  <input
                    maxLength={100}
                    value={form.language}
                    onChange={(event) => updateForm("language", event.target.value)}
                    placeholder="English, Nepali..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7A1F3D]"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Author / prepared by
                  </span>
                  <input
                    maxLength={200}
                    value={form.author}
                    onChange={(event) => updateForm("author", event.target.value)}
                    placeholder="Author or organization"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7A1F3D]"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Publisher
                  </span>
                  <input
                    maxLength={200}
                    value={form.publisher}
                    onChange={(event) =>
                      updateForm("publisher", event.target.value)
                    }
                    placeholder="Lifeline Achham"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7A1F3D]"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Edition
                  </span>
                  <input
                    maxLength={100}
                    value={form.edition}
                    onChange={(event) => updateForm("edition", event.target.value)}
                    placeholder="First edition"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7A1F3D]"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    ISBN (optional)
                  </span>
                  <input
                    maxLength={100}
                    value={form.isbn}
                    onChange={(event) => updateForm("isbn", event.target.value)}
                    placeholder="ISBN identifier"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7A1F3D]"
                  />
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Cover image URL (optional)
                  </span>
                  <input
                    type="url"
                    value={form.coverImageUrl}
                    onChange={(event) =>
                      updateForm("coverImageUrl", event.target.value)
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7A1F3D]"
                  />
                  <span className="block text-xs text-slate-500">
                    Use an accessible HTTP or HTTPS image URL.
                  </span>
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">
                    PDF document{" "}
                    {!editing && <span className="text-red-500">*</span>}
                  </span>
                  <span className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 bg-[#FCFAF7] px-5 py-7 text-center transition hover:border-[#7A1F3D]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E7EC] text-[#7A1F3D]">
                      <Upload size={23} />
                    </span>
                    <span className="mt-3 text-sm font-semibold text-slate-800">
                      {form.file
                        ? form.file.name
                        : editing
                          ? "Choose a replacement PDF"
                          : "Choose a PDF to upload"}
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                      PDF only · Maximum file size 25 MB
                    </span>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      required={!editing}
                      onChange={(event) =>
                        updateForm("file", event.target.files?.[0] ?? null)
                      }
                      className="sr-only"
                    />
                  </span>
                  {editing && (
                    <a
                      href={editing.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#2457C5] hover:underline"
                    >
                      <ExternalLink size={15} />
                      Current PDF: {editing.pdfName}
                    </a>
                  )}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Sort order
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={100000}
                    step={1}
                    value={form.sortOrder}
                    onChange={(event) =>
                      updateForm("sortOrder", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#7A1F3D]"
                  />
                  <span className="block text-xs text-slate-500">
                    Lower numbers appear first.
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 self-center rounded-xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(event) =>
                      updateForm("isFeatured", event.target.checked)
                    }
                    className="h-4 w-4 accent-[#7A1F3D]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      Featured publication
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Highlight this resource on the website.
                    </span>
                  </span>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setModalOpen(false);
                    setError("");
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#55152B] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}
                  {saving
                    ? "Saving..."
                    : editing
                      ? "Save changes"
                      : "Create publication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-publication-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={23} />
            </div>
            <h2
              id="delete-publication-title"
              className="mt-4 text-lg font-bold text-slate-900"
            >
              Delete publication?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              You are about to delete{" "}
              <span className="font-semibold text-slate-800">
                {deleteTarget.title}
              </span>
              . This action cannot be undone.
            </p>
            {error && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setDeleteTarget(null);
                  setError("");
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleDelete()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && <LoaderCircle size={16} className="animate-spin" />}
                {deleting ? "Deleting..." : "Delete publication"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
