"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  FolderPlus,
  RefreshCw,
  Tag,
  Wallet,
  ReceiptText,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { transactions: number };
};

type ApiResult = {
  error?: string;
  message?: string;
  categories?: Category[];
  category?: Category;
};

export default function FinanceCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/billing/categories", {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.includes("application/json")) {
        const responseText = await response.text();

        console.error(
          "[Finance categories] Non-JSON API response:",
          response.status,
          responseText.slice(0, 300),
        );

        throw new Error(
          `The categories API returned a non-JSON response (HTTP ${response.status}). Verify src/app/api/billing/categories/route.ts.`,
        );
      }

      const result: ApiResult = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            (response.status === 401
              ? "Please log in to view finance categories."
              : response.status === 403
                ? "You do not have permission to view finance categories."
                : "Unable to load categories."),
        );
      }

      setCategories(result.categories ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load categories.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const numericSortOrder = Number(sortOrder);

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setError("Category name must contain between 2 and 100 characters.");
      return;
    }

    if (
      !Number.isInteger(numericSortOrder) ||
      numericSortOrder < 0 ||
      numericSortOrder > 10000
    ) {
      setError("Display order must be a whole number from 0 to 10000.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/billing/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          type,
          description: description.trim(),
          sortOrder: numericSortOrder,
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.includes("application/json")) {
        const responseText = await response.text();

        console.error(
          "[Finance categories] Non-JSON create response:",
          response.status,
          responseText.slice(0, 300),
        );

        throw new Error(
          `The categories API returned a non-JSON response (HTTP ${response.status}). Check the API route location.`,
        );
      }

      const result: ApiResult = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to create finance category.",
        );
      }

      setName("");
      setDescription("");
      setSortOrder("0");

      setSuccess(
        result.category
          ? `"${result.category.name}" was created successfully.`
          : result.message || "Category created successfully.",
      );

      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create category.",
      );
    } finally {
      setSaving(false);
    }
  }

  const incomeCategories = categories.filter(
    (category) => category.type === "INCOME",
  );

  const expenseCategories = categories.filter(
    (category) => category.type === "EXPENSE",
  );

  const activeCount = categories.filter(
    (category) => category.isActive,
  ).length;

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 pb-10">
      <header>
        <Link
          href="/admin/billing"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#7A1F3D]"
        >
          <ArrowLeft size={16} />
          Back to Billing
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#7A1F3D]">
              <Tag size={15} />
              Finance Configuration
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Finance Categories
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Organize Lifeline Achham&apos;s income and expenditure for
              accurate financial records, accountability, and reporting.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadCategories()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Tag size={19} />}
          label="Total Categories"
          value={categories.length}
        />
        <StatCard
          icon={<Wallet size={19} />}
          label="Income Categories"
          value={incomeCategories.length}
        />
        <StatCard
          icon={<ReceiptText size={19} />}
          label="Active Categories"
          value={activeCount}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          <p className="break-words">{error}</p>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7A1F3D]/10 text-[#7A1F3D]">
              <FolderPlus size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">Add Category</h2>
              <p className="mt-1 text-xs text-slate-500">
                Create an income or expense classification.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <fieldset disabled={saving}>
              <legend className="text-sm font-semibold text-slate-700">
                Category Type *
              </legend>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("INCOME")}
                  aria-pressed={type === "INCOME"}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                    type === "INCOME"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ArrowDownLeft size={17} />
                  Income
                </button>

                <button
                  type="button"
                  onClick={() => setType("EXPENSE")}
                  aria-pressed={type === "EXPENSE"}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                    type === "EXPENSE"
                      ? "border-rose-500 bg-rose-50 text-rose-800"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ArrowUpRight size={17} />
                  Expense
                </button>
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="category-name"
                className="block text-sm font-semibold text-slate-700"
              >
                Category Name *
              </label>

              <input
                id="category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={
                  type === "INCOME"
                    ? "e.g. Individual Donations"
                    : "e.g. Transportation"
                }
                minLength={2}
                maxLength={100}
                required
                disabled={saving}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-[#7A1F3D] focus:ring-4 focus:ring-[#7A1F3D]/10 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="category-description"
                className="block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="category-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What should this category be used for?"
                maxLength={1000}
                rows={3}
                disabled={saving}
                className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-[#7A1F3D] focus:ring-4 focus:ring-[#7A1F3D]/10 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="category-sort"
                className="block text-sm font-semibold text-slate-700"
              >
                Display Order
              </label>

              <input
                id="category-sort"
                type="number"
                min="0"
                max="10000"
                step="1"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                required
                disabled={saving}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-[#7A1F3D] focus:ring-4 focus:ring-[#7A1F3D]/10 disabled:bg-slate-50"
              />

              <p className="mt-1.5 text-xs text-slate-500">
                Lower numbers appear first.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#641830] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Creating Category...
                </>
              ) : (
                <>
                  <FolderPlus size={17} />
                  Create Category
                </>
              )}
            </button>
          </form>
        </section>

        <div className="space-y-6">
          <CategoryList
            title="Income Categories"
            subtitle="Donations, grants, membership fees, and other incoming funds."
            type="INCOME"
            categories={incomeCategories}
            loading={loading}
          />

          <CategoryList
            title="Expense Categories"
            subtitle="Program costs, medical support, and organizational spending."
            type="EXPENSE"
            categories={expenseCategories}
            loading={loading}
          />
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
        <strong>Financial recordkeeping tip:</strong> Use consistent
        categories for similar transactions. Retain categories already used in
        transactions so historical financial reports remain understandable.
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7A1F3D]/10 text-[#7A1F3D]">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function CategoryList({
  title,
  subtitle,
  type,
  categories,
  loading,
}: {
  title: string;
  subtitle: string;
  type: "INCOME" | "EXPENSE";
  categories: Category[];
  loading: boolean;
}) {
  const isIncome = type === "INCOME";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 p-5">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isIncome
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {isIncome ? (
            <ArrowDownLeft size={20} />
          ) : (
            <ArrowUpRight size={20} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {categories.length}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 p-8 text-sm text-slate-500">
          <RefreshCw size={16} className="animate-spin" />
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="px-5 py-9 text-center">
          <Tag className="mx-auto text-slate-300" size={26} />
          <p className="mt-3 text-sm font-semibold text-slate-700">
            No categories yet
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Use the form to create your first{" "}
            {isIncome ? "income" : "expense"} category.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-start justify-between gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-slate-800">
                  {category.name}
                </p>

                {category.description && (
                  <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                    {category.description}
                  </p>
                )}

                <p className="mt-2 text-xs text-slate-400">
                  {category._count?.transactions ?? 0} transactions
                  {" · "}Order {category.sortOrder}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
                  category.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {category.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
