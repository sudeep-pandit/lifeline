
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

type Article = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: "DRAFT" | "PUBLISHED";
  isFeatured: boolean;
  updatedAt: string;
  publishedAt: string | null;
  createdBy: { name: string } | null;
};

const categories = [
  { value: "", label: "All categories" },
  { value: "NEWS", label: "News" },
  { value: "NOTICE", label: "Notice" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
  { value: "UPDATES", label: "Updates" },
];

const inputClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#7A1F3D]";

function formatDate(value: string | null) {
  if (!value) return "Not published";

  return new Intl.DateTimeFormat("en-NP", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function NewsArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (category) params.set("category", category);
      if (status) params.set("status", status);

      const response = await fetch(`/api/news?${params.toString()}`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not load news articles.");
      }

      setArticles(result.articles ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load articles.");
    } finally {
      setLoading(false);
    }
  }, [search, category, status]);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  async function deleteArticle(article: Article) {
    const confirmed = window.confirm(
      `Delete "${article.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(article.id);
    setError("");

    try {
      const response = await fetch(`/api/news/${article.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not delete the article.");
      }

      setArticles((current) =>
        current.filter((item) => item.id !== article.id),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete article.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#7A1F3D]">
            Lifeline Achham · Content management
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172033]">
            News &amp; Stories
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage news, announcements, notices, and community stories.
          </p>
        </div>

        <Link
          href="/admin/content/news/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] px-4 py-3 text-sm font-semibold text-white hover:bg-[#55152B]"
        >
          <Plus size={17} />
          Write a story
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total articles</p>
          <p className="mt-2 text-3xl font-bold text-[#172033]">
            {articles.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Published in results</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">
            {articles.filter((article) => article.status === "PUBLISHED").length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Drafts in results</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">
            {articles.filter((article) => article.status === "DRAFT").length}
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className={`${inputClass} w-full pl-9`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search article titles or summaries..."
            />
          </div>

          <select
            className={inputClass}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            className={inputClass}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>

          <button
            type="button"
            onClick={() => void loadArticles()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {error && (
          <div role="alert" className="m-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading articles...
          </div>
        ) : articles.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileText size={35} className="mx-auto text-slate-300" />
            <h2 className="mt-4 font-semibold text-[#172033]">
              No articles found
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Create your first article or adjust your filters.
            </p>
            <Link
              href="/admin/content/news/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus size={16} />
              Write a story
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Article</th>
                  <th className="px-4 py-4 font-semibold">Category</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Updated</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/70">
                    <td className="max-w-md px-5 py-4">
                      <p className="font-semibold text-[#172033]">
                        {article.title}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-400">
                        /resources/news/{article.slug}
                      </p>
                      {article.isFeatured && (
                        <span className="mt-2 inline-block rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                          Featured
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {article.category.replaceAll("_", " ")}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          article.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {article.status === "PUBLISHED" ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                      {formatDate(article.updatedAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {article.status === "PUBLISHED" && (
                          <Link
                            href={`/resources/news/${article.slug}`}
                            target="_blank"
                            title="View public article"
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-[#2457C5]"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        )}

                        <Link
                          href={`/admin/content/news/${article.id}`}
                          title="Edit article"
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-[#7A1F3D]"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          title="Delete article"
                          disabled={deletingId === article.id}
                          onClick={() => void deleteArticle(article)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
