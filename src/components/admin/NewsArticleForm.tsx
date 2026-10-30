
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  ImagePlus,
  LoaderCircle,
  Save,
  Send,
  Star,
} from "lucide-react";

import RichTextEditor from "@/components/admin/RichTextEditor";

type NewsCategory = "NEWS" | "NOTICE" | "ANNOUNCEMENT" | "UPDATES";
type ArticleStatus = "DRAFT" | "PUBLISHED";

type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  status: ArticleStatus;
  imageUrl: string | null;
  imageAlt: string | null;
  location: string | null;
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
};

type NewsArticleFormProps = {
  articleId?: string;
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7A1F3D] focus:ring-2 focus:ring-[#7A1F3D]/10 disabled:cursor-not-allowed disabled:bg-slate-50";

const categories: { value: NewsCategory; label: string }[] = [
  { value: "NEWS", label: "News" },
  { value: "NOTICE", label: "Notice" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
  { value: "UPDATES", label: "Updates" },
];

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidImageUrl(value: string): boolean {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export default function NewsArticleForm({
  articleId,
}: NewsArticleFormProps) {
  const router = useRouter();
  const editing = Boolean(articleId);

  const [loading, setLoading] = useState(Boolean(articleId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [category, setCategory] = useState<NewsCategory>("NEWS");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [location, setLocation] = useState("");

  const [isFeatured, setIsFeatured] = useState(false);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Load an existing article when editing.
  useEffect(() => {
    if (!articleId) return;

    let cancelled = false;

    async function loadArticle() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/news/${articleId}`, {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to load this article.");
        }

        if (cancelled) return;

        const article = result.article as NewsArticle;

        setTitle(article.title);
        setSlug(article.slug);
        setSlugEdited(true);

        setExcerpt(article.excerpt);
        setContent(article.content);

        setCategory(article.category);
        setImageUrl(article.imageUrl ?? "");
        setImageAlt(article.imageAlt ?? "");
        setLocation(article.location ?? "");

        setIsFeatured(article.isFeatured);

        setSeoTitle(article.seoTitle ?? "");
        setSeoDescription(article.seoDescription ?? "");
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadArticle();

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  // Generate a slug from the title until the user edits the slug manually.
  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  async function saveArticle(status: ArticleStatus) {
    if (saving) return;

    setError("");
    setSuccess("");

    const cleanTitle = title.trim();
    const cleanSlug = slugify(slug);
    const cleanExcerpt = excerpt.trim();

    if (!cleanTitle) {
      setError("Please enter an article title.");
      return;
    }

    if (!cleanSlug) {
      setError("Please enter a valid URL slug using English letters or numbers.");
      return;
    }

    if (!cleanExcerpt) {
      setError("Please enter a short summary for the article.");
      return;
    }

    if (!content.trim() || content.replace(/<[^>]*>/g, "").trim() === "") {
      setError("Please write the article content before saving.");
      return;
    }

    if (!isValidImageUrl(imageUrl)) {
      setError("Please enter a valid HTTP or HTTPS cover image URL.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: cleanTitle,
        slug: cleanSlug,
        excerpt: cleanExcerpt,
        content,
        category,
        status,
        imageUrl: imageUrl.trim() || null,
        imageAlt: imageAlt.trim() || null,
        location: location.trim() || null,
        isFeatured,
        seoTitle: seoTitle.trim() || null,
        seoDescription: seoDescription.trim() || null,
      };

      const response = await fetch(
        editing ? `/api/news/${articleId}` : "/api/news",
        {
          method: editing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save the article.");
      }

      setSuccess(
        status === "PUBLISHED"
          ? "Article published successfully."
          : "Draft saved successfully.",
      );

      router.push("/admin/content/news");
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="text-center">
          <LoaderCircle className="mx-auto animate-spin text-[#7A1F3D]" size={28} />
          <p className="mt-3 text-sm text-slate-500">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#7A1F3D]">
            <FileText size={16} />
            Lifeline Achham · Newsroom
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
            {editing ? "Edit article" : "Write a story"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Create and publish news, community stories, notices, and
            organizational announcements.
          </p>
        </div>

        <Link
          href="/admin/content/news"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back to news
        </Link>
      </header>

      {/* Error and success messages */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span className="font-bold">!</span>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          <CheckCircle2 size={18} className="shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main editor column */}
        <div className="min-w-0 space-y-6">
          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div>
              <h2 className="text-base font-bold text-[#172033]">
                Article details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add the headline, summary, and full story.
              </p>
            </div>

            <div>
              <label
                htmlFor="news-title"
                className="text-sm font-semibold text-slate-700"
              >
                Article title <span className="text-red-500">*</span>
              </label>

              <input
                id="news-title"
                className={inputClass}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter a clear, descriptive headline"
                maxLength={200}
                required
                disabled={saving}
              />

              <p className="mt-1.5 text-right text-xs text-slate-400">
                {title.length}/200
              </p>
            </div>

            <div>
              <label
                htmlFor="news-slug"
                className="text-sm font-semibold text-slate-700"
              >
                URL slug <span className="text-red-500">*</span>
              </label>

              <input
                id="news-slug"
                className={inputClass}
                value={slug}
                onChange={(event) => {
                  setSlugEdited(true);
                  setSlug(slugify(event.target.value));
                }}
                placeholder="community-health-campaign"
                required
                disabled={saving}
              />

              <p className="mt-2 break-all text-xs text-slate-400">
                Public URL: /resources/news/{slug || "your-story-slug"}
              </p>
            </div>

            <div>
              <label
                htmlFor="news-excerpt"
                className="text-sm font-semibold text-slate-700"
              >
                Short summary <span className="text-red-500">*</span>
              </label>

              <textarea
                id="news-excerpt"
                className={inputClass}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Briefly explain what happened and why it matters..."
                required
                disabled={saving}
              />

              <p className="mt-1.5 text-right text-xs text-slate-400">
                {excerpt.length}/1000
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Article body <span className="text-red-500">*</span>
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Format your story with headings, links, lists, quotations, and
                images.
              </p>

              <div className="mt-3">
                <RichTextEditor value={content} onChange={setContent} />
              </div>
            </div>
          </section>

          {/* Cover image */}
          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A1F3D]/10 text-[#7A1F3D]">
                <ImagePlus size={20} />
              </div>

              <div>
                <h2 className="font-bold text-[#172033]">Cover image</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose the main image shown on the news card.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="news-image-url"
                className="text-sm font-semibold text-slate-700"
              >
                Image URL
              </label>

              <input
                id="news-image-url"
                className={inputClass}
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
                disabled={saving}
              />

              <p className="mt-1.5 text-xs leading-5 text-slate-400">
                Enter a publicly accessible HTTP or HTTPS image URL. This field
                does not upload files to your server.
              </p>
            </div>

            {imageUrl && isValidImageUrl(imageUrl) && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={imageAlt || "Cover image preview"}
                  className="max-h-80 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = "block";
                  }}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="news-image-alt"
                className="text-sm font-semibold text-slate-700"
              >
                Alternative text
              </label>

              <input
                id="news-image-alt"
                className={inputClass}
                value={imageAlt}
                onChange={(event) => setImageAlt(event.target.value)}
                placeholder="Describe the image for screen readers"
                maxLength={250}
                disabled={saving}
              />
            </div>
          </section>

          {/* SEO settings */}
          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div>
              <h2 className="font-bold text-[#172033]">
                Search engine optimization
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Optional metadata for search engines and sharing previews.
              </p>
            </div>

            <div>
              <label
                htmlFor="news-seo-title"
                className="text-sm font-semibold text-slate-700"
              >
                SEO title
              </label>

              <input
                id="news-seo-title"
                className={inputClass}
                value={seoTitle}
                onChange={(event) => setSeoTitle(event.target.value)}
                maxLength={160}
                placeholder={title || "Search engine title"}
                disabled={saving}
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Leave blank to use the article title.
              </p>
            </div>

            <div>
              <label
                htmlFor="news-seo-description"
                className="text-sm font-semibold text-slate-700"
              >
                SEO description
              </label>

              <textarea
                id="news-seo-description"
                className={inputClass}
                value={seoDescription}
                onChange={(event) => setSeoDescription(event.target.value)}
                rows={3}
                maxLength={320}
                placeholder="Write a concise description of this story..."
                disabled={saving}
              />

              <p className="mt-1.5 text-right text-xs text-slate-400">
                {seoDescription.length}/320
              </p>
            </div>
          </section>
        </div>

        {/* Publishing sidebar */}
        <aside className="space-y-5 xl:sticky xl:top-6">
          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
            <div>
              <h2 className="font-bold text-[#172033]">
                Publishing settings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Organize and publish your article.
              </p>
            </div>

            <div>
              <label
                htmlFor="news-category"
                className="text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <select
                id="news-category"
                className={inputClass}
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as NewsCategory)
                }
                disabled={saving}
              >
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="news-location"
                className="text-sm font-semibold text-slate-700"
              >
                Location
              </label>

              <input
                id="news-location"
                className={inputClass}
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Achham, Nepal"
                maxLength={200}
                disabled={saving}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) => setIsFeatured(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#7A1F3D]"
                disabled={saving}
              />

              <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Star size={15} className="text-amber-500" />
                  Featured article
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Mark this story for featured placement on the public news
                  page.
                </span>
              </span>
            </label>
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-bold text-[#172033]">Save your work</h2>

            <p className="text-xs leading-5 text-slate-500">
              Drafts remain private. Published articles can appear on the
              public website.
            </p>

            <button
              type="button"
              disabled={saving}
              onClick={() => void saveArticle("DRAFT")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}

              {saving ? "Saving..." : "Save as draft"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => void saveArticle("PUBLISHED")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#55152B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Send size={17} />
              )}

              {saving ? "Saving..." : "Publish article"}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
