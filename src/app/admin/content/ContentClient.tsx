
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
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react";

type ContentType = "PAGE" | "SECTION";
type ContentStatus = "DRAFT" | "PUBLISHED";

type ContentItem = {
  id: string;
  title: string;
  key: string;
  slug: string | null;
  type: ContentType;
  status: ContentStatus;
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  isHomepage: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type ContentForm = {
  title: string;
  key: string;
  slug: string;
  type: ContentType;
  status: ContentStatus;
  excerpt: string;
  content: string;
  imageUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  isHomepage: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

const emptyForm: ContentForm = {
  title: "",
  key: "",
  slug: "",
  type: "PAGE",
  status: "DRAFT",
  excerpt: "",
  content: "",
  imageUrl: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  isHomepage: false,
  isFeatured: false,
  sortOrder: 0,
};

const inputClass =
  "block w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

function makeKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidImageUrl(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function formatDate(value: string) {
  if (!value) return "Recently updated";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Recently updated";

  return date.toLocaleDateString("en-NP", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getErrorMessage(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return fallback;
}

function StatusBadge({ status }: { status: ContentStatus }) {
  const published = status === "PUBLISHED";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        published
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {published ? (
        <CheckCircle2 size={13} />
      ) : (
        <Clock3 size={13} />
      )}
      {published ? "Published" : "Draft"}
    </span>
  );
}

function ImagePreview({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  const cleanUrl = url.trim();

  useEffect(() => {
    setFailed(false);
  }, [cleanUrl]);

  if (!cleanUrl) {
    return (
      <div className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
          <ImageIcon size={21} />
        </div>
        <p className="text-sm font-medium text-slate-600">
          No image added
        </p>
        <p className="text-xs text-slate-400">
          Your image preview will appear here
        </p>
      </div>
    );
  }

  if (!isValidImageUrl(cleanUrl)) {
    return (
      <div className="flex min-h-24 items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <AlertCircle
          size={20}
          className="shrink-0 text-amber-600"
        />
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Check the image URL
          </p>
          <p className="mt-1 break-words text-xs text-amber-700">
            Enter a complete URL beginning with http:// or https://.
          </p>
        </div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex min-h-24 items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
        <ImageIcon size={21} className="shrink-0 text-red-500" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-red-700">
            Image could not be loaded
          </p>
          <p className="mt-1 text-xs leading-5 text-red-600">
            Check that the link is publicly accessible and points
            directly to an image.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
        <span className="text-xs font-semibold text-slate-600">
          Image preview
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
          <Check size={13} />
          Preview loaded
        </span>
      </div>

      <div className="flex min-h-36 items-center justify-center bg-slate-50 p-2">
        <img
          key={cleanUrl}
          src={cleanUrl}
          alt="Content image preview"
          className="max-h-64 w-full rounded-lg object-contain"
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
}

export default function ContentClient() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [form, setForm] = useState<ContentForm>(emptyForm);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/content", {
        method: "GET",
        cache: "no-store",
      });

      const result: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result, "Unable to load content."),
        );
      }

      if (
        typeof result !== "object" ||
        result === null ||
        !("data" in result)
      ) {
        throw new Error("Unexpected content response from the server.");
      }

      const data = result.data;

      if (!Array.isArray(data)) {
        throw new Error("The server did not return a content list.");
      }

      setItems(data as ContentItem[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading content.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !term ||
        item.title?.toLowerCase().includes(term) ||
        item.key?.toLowerCase().includes(term) ||
        item.slug?.toLowerCase().includes(term) ||
        item.excerpt?.toLowerCase().includes(term);

      const matchesType =
        typeFilter === "ALL" || item.type === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [items, search, typeFilter, statusFilter]);

  const publishedCount = items.filter(
    (item) => item.status === "PUBLISHED",
  ).length;

  const draftCount = items.filter(
    (item) => item.status === "DRAFT",
  ).length;

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm });
    setAdvancedOpen(false);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function openEdit(item: ContentItem) {
    setEditing(item);
    setForm({
      title: item.title ?? "",
      key: item.key ?? "",
      slug: item.slug ?? "",
      type: item.type ?? "PAGE",
      status: item.status ?? "DRAFT",
      excerpt: item.excerpt ?? "",
      content: item.content ?? "",
      imageUrl: item.imageUrl ?? "",
      seoTitle: item.seoTitle ?? "",
      seoDescription: item.seoDescription ?? "",
      seoKeywords: item.seoKeywords ?? "",
      isHomepage: item.isHomepage ?? false,
      isFeatured: item.isFeatured ?? false,
      sortOrder: item.sortOrder ?? 0,
    });
    setAdvancedOpen(false);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function updateField<K extends keyof ContentForm>(
    field: K,
    value: ContentForm[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateTitle(value: string) {
    setForm((previous) => ({
      ...previous,
      title: value,
      key: editing
        ? previous.key
        : makeKey(value),
      slug: editing
        ? previous.slug
        : makeSlug(value),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!form.key.trim()) {
      setError("Please enter a content key.");
      return;
    }

    if (!isValidImageUrl(form.imageUrl)) {
      setError("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      key: form.key.trim(),
      slug: form.slug.trim() || null,
      type: form.type,
      status: form.status,
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      seoTitle: form.seoTitle.trim() || null,
      seoDescription: form.seoDescription.trim() || null,
      seoKeywords: form.seoKeywords.trim() || null,
      isHomepage: form.isHomepage,
      isFeatured: form.isFeatured,
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      const response = await fetch(
        editing ? `/api/content/${editing.id}` : "/api/content",
        {
          method: editing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            result,
            `Unable to ${editing ? "update" : "create"} content.`,
          ),
        );
      }

      setModalOpen(false);
      setEditing(null);
      setForm({ ...emptyForm });
      setNotice(
        editing
          ? "Content updated successfully."
          : "Content created successfully.",
      );

      await loadContent();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving content.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: "DELETE",
      });

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result, "Unable to delete this content."),
        );
      }

      setDeleteId(null);
      setNotice("Content deleted successfully.");
      await loadContent();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting content.",
      );
      setDeleteId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#FCFAF7] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#7A1F3D]">
              <FileText size={17} />
              Website management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Content Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage website pages, homepage sections, images, and
              published content from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void loadContent()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1947A8]"
            >
              <Plus size={17} />
              Add content
            </button>
          </div>
        </header>

        {(error || notice) && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error ? (
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0"
              />
            )}

            <p className="min-w-0 flex-1 break-words">
              {error || notice}
            </p>

            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => {
                setError("");
                setNotice("");
              }}
              className="shrink-0 rounded-lg p-1 transition hover:bg-black/5"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total content",
              value: items.length,
              icon: FileText,
              color: "text-blue-700",
              background: "bg-blue-50",
            },
            {
              label: "Published",
              value: publishedCount,
              icon: CheckCircle2,
              color: "text-emerald-700",
              background: "bg-emerald-50",
            },
            {
              label: "Drafts",
              value: draftCount,
              icon: Clock3,
              color: "text-amber-700",
              background: "bg-amber-50",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.background} ${stat.color}`}
                  >
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title, key, or slug..."
                  aria-label="Search content"
                  className={`${inputClass} pl-10`}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[390px]">
                <div className="relative">
                  <Filter
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                    aria-label="Filter by content type"
                    className={`${inputClass} appearance-none pl-9 pr-9`}
                  >
                    <option value="ALL">All types</option>
                    <option value="PAGE">Pages</option>
                    <option value="SECTION">Sections</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filter by publication status"
                    className={`${inputClass} appearance-none pr-9`}
                  >
                    <option value="ALL">All statuses</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Showing {filteredItems.length} of {items.length} content items
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8">
              <Loader2
                size={27}
                className="animate-spin text-[#2457C5]"
              />
              <p className="text-sm text-slate-500">
                Loading website content...
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FileText size={25} />
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-800">
                {items.length === 0
                  ? "No content yet"
                  : "No matching content"}
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {items.length === 0
                  ? "Create your first page or section to get started."
                  : "Try a different search term or change your filters."}
              </p>

              {items.length === 0 && (
                <button
                  type="button"
                  onClick={openCreate}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2457C5] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1947A8]"
                >
                  <Plus size={16} />
                  Create content
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 sm:p-5">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="relative flex h-40 items-center justify-center overflow-hidden bg-slate-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <ImageIcon size={28} />
                        <span className="text-xs">No image</span>
                      </div>
                    )}

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span className="rounded-lg border border-white/70 bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                        {item.type === "PAGE" ? "Page" : "Section"}
                      </span>

                      {item.isHomepage && (
                        <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          Homepage
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="min-w-0 break-words text-base font-bold text-slate-900">
                        {item.title}
                      </h2>
                      <StatusBadge status={item.status} />
                    </div>

                    <p className="mt-2 line-clamp-2 min-h-10 break-words text-sm leading-5 text-slate-500">
                      {item.excerpt || "No short description added."}
                    </p>

                    <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3">
                      <div className="flex items-start gap-2 text-xs">
                        <span className="shrink-0 font-semibold text-slate-500">
                          Key
                        </span>
                        <span className="min-w-0 break-all font-mono text-slate-700">
                          {item.key}
                        </span>
                      </div>

                      {item.slug && (
                        <div className="flex items-start gap-2 text-xs">
                          <span className="shrink-0 font-semibold text-slate-500">
                            Slug
                          </span>
                          <span className="min-w-0 break-all text-slate-600">
                            {item.slug}
                          </span>
                        </div>
                      )}

                      <div className="text-xs text-slate-400">
                        Updated {formatDate(item.updatedAt)}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1947A8]"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        title="View content details"
                        aria-label={`View ${item.title}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-600 transition hover:bg-slate-50"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteId(item.id)}
                        title="Delete content"
                        aria-label={`Delete ${item.title}`}
                        className="inline-flex items-center justify-center rounded-xl border border-red-100 px-3 py-2.5 text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <p className="text-center text-xs text-slate-400">
          Lifeline Achham · Website Content Management
        </p>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setModalOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="content-editor-title"
            className="flex max-h-[96dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[92dvh] sm:rounded-2xl"
          >
            <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-7">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2457C5]">
                  {editing ? (
                    <Edit3 size={20} />
                  ) : (
                    <Plus size={21} />
                  )}
                </div>

                <div className="min-w-0">
                  <h2
                    id="content-editor-title"
                    className="text-lg font-bold text-slate-900"
                  >
                    {editing ? "Edit content" : "Create content"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Manage content and its appearance on your website.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                aria-label="Close editor"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </header>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-7">
                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle
                      size={18}
                      className="mt-0.5 shrink-0"
                    />
                    <p className="break-words">{error}</p>
                  </div>
                )}

                <section>
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Basic information
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Add a title, category, and content description.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="content-title" className={labelClass}>
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="content-title"
                        value={form.title}
                        onChange={(event) => updateTitle(event.target.value)}
                        placeholder="e.g. About Lifeline Achham"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="content-type" className={labelClass}>
                        Content type
                      </label>
                      <select
                        id="content-type"
                        value={form.type}
                        onChange={(event) =>
                          updateField(
                            "type",
                            event.target.value as ContentType,
                          )
                        }
                        className={inputClass}
                      >
                        <option value="PAGE">Website page</option>
                        <option value="SECTION">Website section</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="content-status" className={labelClass}>
                        Publication status
                      </label>
                      <select
                        id="content-status"
                        value={form.status}
                        onChange={(event) =>
                          updateField(
                            "status",
                            event.target.value as ContentStatus,
                          )
                        }
                        className={inputClass}
                      >
                        <option value="DRAFT">Save as draft</option>
                        <option value="PUBLISHED">Publish content</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="content-excerpt" className={labelClass}>
                        Short description
                      </label>
                      <textarea
                        id="content-excerpt"
                        value={form.excerpt}
                        onChange={(event) =>
                          updateField("excerpt", event.target.value)
                        }
                        rows={3}
                        placeholder="Write a short introduction..."
                        className={`${inputClass} resize-y`}
                      />
                      <p className="mt-2 text-xs text-slate-400">
                        A brief description for cards, summaries, or
                        introductory text.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="content-body" className={labelClass}>
                        Main content
                      </label>
                      <textarea
                        id="content-body"
                        value={form.content}
                        onChange={(event) =>
                          updateField("content", event.target.value)
                        }
                        rows={7}
                        placeholder="Write your main content here..."
                        className={`${inputClass} resize-y`}
                      />
                      <p className="mt-2 text-xs text-slate-400">
                        Plain text is supported by this editor. Rich-text
                        formatting requires a separate rich-text editor.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="border-t border-slate-100 pt-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Featured image
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Add an image link and check the preview before saving.
                    </p>
                  </div>

                  <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-2">
                    <div className="min-w-0 space-y-3">
                      <label htmlFor="content-image-url" className={labelClass}>
                        Image URL
                      </label>

                      <div className="relative min-w-0">
                        <ImageIcon
                          size={18}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id="content-image-url"
                          type="url"
                          inputMode="url"
                          autoComplete="url"
                          value={form.imageUrl}
                          onChange={(event) =>
                            updateField("imageUrl", event.target.value)
                          }
                          placeholder="https://example.com/image.jpg"
                          aria-describedby="image-url-help"
                          className={`${inputClass} pl-10`}
                        />

                        {form.imageUrl.trim() && (
                          <button
                            type="button"
                            title="Open image URL in a new tab"
                            aria-label="Open image URL"
                            onClick={() => {
                              if (isValidImageUrl(form.imageUrl) && form.imageUrl.trim()) {
                                window.open(
                                  form.imageUrl.trim(),
                                  "_blank",
                                  "noopener,noreferrer",
                                );
                              }
                            }}
                            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#2457C5]"
                          >
                            <ExternalLink size={16} />
                          </button>
                        )}
                      </div>

                      <p
                        id="image-url-help"
                        className="text-xs leading-5 text-slate-500"
                      >
                        Paste a publicly accessible image link. Use HTTPS
                        when available. The URL field automatically expands
                        to fit its container.
                      </p>

                      {form.imageUrl.trim() && !isValidImageUrl(form.imageUrl) && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                          <AlertCircle size={14} />
                          Enter a valid HTTP or HTTPS URL.
                        </p>
                      )}
                    </div>

                    <div className="min-w-0">
                      <ImagePreview url={form.imageUrl} />
                    </div>
                  </div>
                </section>

                <section className="border-t border-slate-100 pt-6">
                  <h3 className="mb-4 text-sm font-bold text-slate-900">
                    Display settings
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
                      <input
                        type="checkbox"
                        checked={form.isHomepage}
                        onChange={(event) =>
                          updateField("isHomepage", event.target.checked)
                        }
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#2457C5]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">
                          Show on homepage
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          Mark this content for homepage use.
                        </span>
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(event) =>
                          updateField("isFeatured", event.target.checked)
                        }
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#2457C5]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">
                          Featured content
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          Mark this item as featured.
                        </span>
                      </span>
                    </label>
                  </div>
                </section>

                <section className="overflow-hidden rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setAdvancedOpen((value) => !value)}
                    aria-expanded={advancedOpen}
                    className="flex w-full items-center justify-between gap-3 bg-slate-50 px-4 py-4 text-left transition hover:bg-slate-100"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Settings2
                        size={19}
                        className="shrink-0 text-slate-500"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">
                          Advanced settings
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          Content key, URL slug, display order, and SEO.
                        </span>
                      </span>
                    </span>

                    {advancedOpen ? (
                      <ChevronUp size={18} className="shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="shrink-0" />
                    )}
                  </button>

                  {advancedOpen && (
                    <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 sm:p-5">
                      <div>
                        <label htmlFor="content-key" className={labelClass}>
                          Content key <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="content-key"
                          value={form.key}
                          onChange={(event) =>
                            updateField("key", event.target.value)
                          }
                          placeholder="about_lifeline"
                          required
                          className={inputClass}
                        />
                        <p className="mt-2 text-xs text-slate-400">
                          Must be unique across your content.
                        </p>
                      </div>

                      <div>
                        <label htmlFor="content-slug" className={labelClass}>
                          URL slug
                        </label>
                        <input
                          id="content-slug"
                          value={form.slug}
                          onChange={(event) =>
                            updateField("slug", event.target.value)
                          }
                          placeholder="about-lifeline"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label htmlFor="content-sort" className={labelClass}>
                          Display order
                        </label>
                        <input
                          id="content-sort"
                          type="number"
                          value={form.sortOrder}
                          onChange={(event) =>
                            updateField(
                              "sortOrder",
                              Number(event.target.value) || 0,
                            )
                          }
                          className={inputClass}
                        />
                        <p className="mt-2 text-xs text-slate-400">
                          Smaller numbers generally appear first.
                        </p>
                      </div>

                      <div>
                        <label htmlFor="content-seo-title" className={labelClass}>
                          SEO title
                        </label>
                        <input
                          id="content-seo-title"
                          value={form.seoTitle}
                          onChange={(event) =>
                            updateField("seoTitle", event.target.value)
                          }
                          placeholder="Page title for search engines"
                          className={inputClass}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="content-seo-description" className={labelClass}>
                          SEO description
                        </label>
                        <textarea
                          id="content-seo-description"
                          value={form.seoDescription}
                          onChange={(event) =>
                            updateField("seoDescription", event.target.value)
                          }
                          rows={3}
                          placeholder="Describe this page for search engines..."
                          className={`${inputClass} resize-y`}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="content-seo-keywords" className={labelClass}>
                          SEO keywords
                        </label>
                        <input
                          id="content-seo-keywords"
                          value={form.seoKeywords}
                          onChange={(event) =>
                            updateField("seoKeywords", event.target.value)
                          }
                          placeholder="blood donation, Achham, Nepal"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}
                </section>
              </div>

              <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <p className="hidden text-xs text-slate-400 sm:block">
                  {editing ? "Changes are saved to this item." : "New content starts as a draft unless published."}
                </p>

                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || !form.title.trim() || !form.key.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1947A8] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        {editing ? "Save changes" : "Create content"}
                      </>
                    )}
                  </button>
                </div>
              </footer>
            </form>
          </section>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>

            <h2
              id="delete-title"
              className="mt-4 text-lg font-bold text-slate-900"
            >
              Delete this content?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This action cannot be undone. Make sure you no longer need
              this content before deleting it.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDelete(deleteId)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Trash2 size={16} />
                Delete permanently
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}