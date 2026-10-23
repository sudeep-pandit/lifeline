"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  BadgeCheck,
  Ban,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FolderCog,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Tag,
  Wallet,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type TransactionType = "INCOME" | "EXPENSE";

type TransactionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "PAID"
  | "CANCELLED";

type TransactionAction =
  | "submit"
  | "approve"
  | "reject"
  | "mark-paid";

type Summary = {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  pendingApprovals: number;
  totalTransactions: number;
};

type Category = {
  id: string;
  name: string;
  type: TransactionType;
};

type Party = {
  id: string;
  name: string;
  type: string;
};

type Transaction = {
  id: string;
  referenceNumber: string;
  type: TransactionType;
  status: TransactionStatus;
  title: string;
  description?: string | null;
  amount: string | number;
  currency: string;
  transactionDate: string;
  paymentMethod?: string;
  paymentReference?: string | null;
  notes?: string | null;
  category?: { name: string } | null;
  party?: { name: string } | null;
  createdBy?: { id?: string; name?: string | null } | null;
};

type BillingData = {
  summary: Summary;
  transactions: Transaction[];
  categories: Category[];
  parties: Party[];
};

type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "ESEWA"
  | "KHALTI"
  | "CONNECT_IPS"
  | "CHEQUE"
  | "OTHER";

type TransactionForm = {
  type: TransactionType;
  title: string;
  amount: string;
  transactionDate: string;
  categoryId: string;
  partyId: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  description: string;
  notes: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  summary?: Summary;
  transactions?: Transaction[];
  categories?: Category[];
  parties?: Party[];
  transaction?: Transaction;
};

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const initialSummary: Summary = {
  totalIncome: 0,
  totalExpenses: 0,
  netBalance: 0,
  pendingApprovals: 0,
  totalTransactions: 0,
};

const statusClass: Record<TransactionStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SUBMITTED: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-700",
  PAID: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-slate-100 text-slate-500",
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7A1F3D] focus:ring-4 focus:ring-[#7A1F3D]/10 disabled:cursor-not-allowed disabled:bg-slate-50";

const labelClass = "block text-sm font-semibold text-slate-700";

const paymentMethods: {
  value: PaymentMethod;
  label: string;
}[] = [
  { value: "CASH", label: "Cash" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "ESEWA", label: "eSewa" },
  { value: "KHALTI", label: "Khalti" },
  { value: "CONNECT_IPS", label: "connectIPS" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "OTHER", label: "Other" },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getToday() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function createInitialForm(): TransactionForm {
  return {
    type: "INCOME",
    title: "",
    amount: "",
    transactionDate: getToday(),
    categoryId: "",
    partyId: "",
    paymentMethod: "CASH",
    paymentReference: "",
    description: "",
    notes: "",
  };
}

function money(value: number | string) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function readableStatus(status: string) {
  return status.replaceAll("_", " ");
}

function isTransactionStatus(value: unknown): value is TransactionStatus {
  return (
    typeof value === "string" &&
    [
      "DRAFT",
      "SUBMITTED",
      "APPROVED",
      "REJECTED",
      "PAID",
      "CANCELLED",
    ].includes(value)
  );
}

/**
 * Read a response safely.
 *
 * Handles empty responses, invalid JSON, and API errors that use either
 * "message" or "error".
 */
async function readApiResponse(
  response: Response,
): Promise<ApiResponse> {
  const text = await response.text();

  if (!text.trim()) {
    throw new Error(
      `The server returned an empty response (HTTP ${response.status}). Check the API route and server terminal.`,
    );
  }

  let result: ApiResponse;

  try {
    result = JSON.parse(text) as ApiResponse;
  } catch {
    throw new Error(
      `The server returned invalid JSON (HTTP ${response.status}). Check the API route and server terminal.`,
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        result.error ||
        `The request failed (HTTP ${response.status}).`,
    );
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<TransactionForm>(createInitialForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  /* ------------------------------------------------------------------------ */
  /* Load billing information                                                 */
  /* ------------------------------------------------------------------------ */

  const loadBilling = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch("/api/billing", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await readApiResponse(response);

      setData({
        summary: {
          ...initialSummary,
          ...(result.summary ?? {}),
        },
        transactions: (result.transactions ?? []).filter(
          (transaction) =>
            transaction &&
            typeof transaction.id === "string" &&
            typeof transaction.title === "string" &&
            isTransactionStatus(transaction.status),
        ),
        categories: result.categories ?? [],
        parties: result.parties ?? [],
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load billing information.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadBilling();
  }, [loadBilling]);

  /* ------------------------------------------------------------------------ */
  /* Derived data                                                             */
  /* ------------------------------------------------------------------------ */

  const summary = data?.summary ?? initialSummary;

  const categories = useMemo(
    () =>
      (data?.categories ?? []).filter(
        (category) => category.type === form.type,
      ),
    [data?.categories, form.type],
  );

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (data?.transactions ?? []).filter((transaction) => {
      const matchesSearch =
        !query ||
        transaction.title.toLowerCase().includes(query) ||
        transaction.referenceNumber.toLowerCase().includes(query) ||
        (transaction.category?.name ?? "")
          .toLowerCase()
          .includes(query) ||
        (transaction.party?.name ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        transaction.status === statusFilter;

      const matchesType =
        typeFilter === "ALL" ||
        transaction.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [data?.transactions, search, statusFilter, typeFilter]);

  const cards = [
    {
      label: "Total Income",
      value: money(summary.totalIncome),
      description: "Approved and paid income",
      icon: ArrowDownLeft,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Total Expenses",
      value: money(summary.totalExpenses),
      description: "Approved and paid expenses",
      icon: ArrowUpRight,
      iconClass: "bg-rose-50 text-rose-700",
    },
    {
      label: "Net Balance",
      value: money(summary.netBalance),
      description: "Income minus expenses",
      icon: Wallet,
      iconClass: "bg-blue-50 text-blue-700",
    },
    {
      label: "Pending Approvals",
      value: String(summary.pendingApprovals),
      description: "Awaiting review",
      icon: Clock3,
      iconClass: "bg-amber-50 text-amber-700",
    },
  ];

  /* ------------------------------------------------------------------------ */
  /* Form helpers                                                             */
  /* ------------------------------------------------------------------------ */

  function updateForm<K extends keyof TransactionForm>(
    key: K,
    value: TransactionForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function openModal() {
    setForm(createInitialForm());
    setFormError("");
    setSuccessMessage("");
    setActionError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setFormError("");
  }

  /* ------------------------------------------------------------------------ */
  /* Create transaction                                                       */
  /* ------------------------------------------------------------------------ */

  async function submitTransaction(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setFormError("");
    setSuccessMessage("");

    if (!form.title.trim()) {
      setFormError("Please enter a transaction title.");
      return;
    }

    if (
      !/^(?:0|[1-9]\d{0,11})(?:\.\d{1,2})?$/.test(form.amount) ||
      !Number.isFinite(Number(form.amount)) ||
      Number(form.amount) <= 0
    ) {
      setFormError(
        "Enter a positive amount with up to two decimal places.",
      );
      return;
    }

    if (!form.categoryId) {
      setFormError("Please select a category.");
      return;
    }

    if (!form.transactionDate) {
      setFormError("Please select a transaction date.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          amount: form.amount,
          partyId: form.partyId || null,
          paymentReference: form.paymentReference.trim() || null,
          description: form.description.trim() || null,
          notes: form.notes.trim() || null,
        }),
      });

      const result = await readApiResponse(response);

      setModalOpen(false);
      setForm(createInitialForm());

      setSuccessMessage(
        result.message ||
          "Transaction created successfully as a draft.",
      );

      await loadBilling(true);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to save the transaction.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Submit / approve / reject / mark paid                                    */
  /* ------------------------------------------------------------------------ */

  async function handleTransactionAction(
    transaction: Transaction,
    action: TransactionAction,
  ) {
    let reason: string | undefined;

    if (action === "reject") {
      const answer = window.prompt(
        `Enter the reason for rejecting "${transaction.title}":`,
      );

      if (answer === null) {
        return;
      }

      reason = answer.trim();

      if (!reason || reason.length > 1000) {
        setActionError(
          "Enter a rejection reason between 1 and 1000 characters.",
        );
        return;
      }
    }

    if (
      action === "mark-paid" &&
      !window.confirm(
        `Confirm that "${transaction.title}" has been paid?`,
      )
    ) {
      return;
    }

    setActionLoadingId(transaction.id);
    setActionError("");
    setSuccessMessage("");

    try {
      // IMPORTANT:
      // This matches src/app/api/billing/transactions/[id]/action/route.ts
      const response = await fetch(
        `/api/billing/transactions/${encodeURIComponent(
          transaction.id,
        )}/action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            action,
            ...(reason ? { reason } : {}),
          }),
        },
      );

      const result = await readApiResponse(response);

      if (result.success !== true) {
        throw new Error(
          result.message || "The transaction action failed.",
        );
      }

      setSuccessMessage(
        result.message || "Transaction updated successfully.",
      );

      await loadBilling(true);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to update transaction.",
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Action buttons                                                           */
  /* ------------------------------------------------------------------------ */

  function renderActions(transaction: Transaction) {
    const busy = actionLoadingId !== null;

    const buttonClass =
      "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

    return (
      <div className="flex min-w-[145px] flex-wrap gap-2">
        {transaction.status === "DRAFT" && (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void handleTransactionAction(transaction, "submit")
            }
            className={`${buttonClass} bg-amber-50 text-amber-800 hover:bg-amber-100`}
          >
            {actionLoadingId === transaction.id ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            Submit
          </button>
        )}

        {transaction.status === "SUBMITTED" && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void handleTransactionAction(transaction, "approve")
              }
              className={`${buttonClass} bg-emerald-50 text-emerald-800 hover:bg-emerald-100`}
            >
              <ShieldCheck size={14} />
              Approve
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void handleTransactionAction(transaction, "reject")
              }
              className={`${buttonClass} bg-red-50 text-red-700 hover:bg-red-100`}
            >
              <Ban size={14} />
              Reject
            </button>
          </>
        )}

        {transaction.status === "APPROVED" && (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void handleTransactionAction(transaction, "mark-paid")
            }
            className={`${buttonClass} bg-blue-50 text-blue-800 hover:bg-blue-100`}
          >
            <BadgeCheck size={14} />
            Mark Paid
          </button>
        )}

        {["PAID", "CANCELLED", "REJECTED"].includes(
          transaction.status,
        ) && (
          <span className="py-2 text-xs text-slate-400">
            No actions
          </span>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="mx-auto max-w-[1600px] space-y-7">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#7A1F3D]">
            <ReceiptText size={15} />
            Finance Management
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Billing &amp; Finance
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage organizational income, expenses, receipts, vouchers,
            and financial transactions in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/billing/categories"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Tag size={16} />
            Categories
          </Link>

          <button
            type="button"
            onClick={() => void loadBilling(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#641830]"
          >
            <Plus size={17} />
            New Transaction
          </button>
        </div>
      </section>

      {/* Load error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <CircleAlert size={19} className="mt-0.5 shrink-0" />

          <div className="flex-1">
            <p className="font-semibold">
              Unable to load billing data
            </p>
            <p className="mt-1 break-words">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => void loadBilling(true)}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Action error */}
      {actionError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <CircleAlert size={19} className="mt-0.5 shrink-0" />

          <p className="flex-1 break-words">{actionError}</p>

          <button
            type="button"
            onClick={() => setActionError("")}
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />

          <p className="flex-1 font-semibold">{successMessage}</p>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="rounded-lg p-1 hover:bg-emerald-100"
            aria-label="Dismiss success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.label}
                  </p>

                  <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900">
                    {loading ? "—" : card.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                {card.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Information cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7A1F3D]/10 text-[#7A1F3D]">
            <Banknote size={23} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Transaction Register
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading transactions..."
                : `${summary.totalTransactions} transactions recorded`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <CalendarDays size={23} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Financial Records
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Review income and expense entries and their approval status.
            </p>
          </div>
        </div>
      </section>

      {/* Transactions */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02]">
        <div className="space-y-4 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">
                Recent Transactions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search, filter, and process recent financial records.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              <Activity size={14} />
              Showing {filteredTransactions.length} of{" "}
              {data?.transactions.length ?? 0}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(220px,1fr)_190px_160px]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                aria-label="Search transactions"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, reference, category..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-[#7A1F3D] focus:ring-4 focus:ring-[#7A1F3D]/10"
              />
            </div>

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#7A1F3D]"
            >
              <option value="ALL">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="PAID">Paid</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              aria-label="Filter by transaction type"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#7A1F3D]"
            >
              <option value="ALL">Income &amp; Expense</option>
              <option value="INCOME">Income only</option>
              <option value="EXPENSE">Expense only</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-500">
            <RefreshCw size={17} className="animate-spin" />
            Loading transactions...
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Reference</th>
                  <th className="px-5 py-4 font-semibold">Transaction</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-slate-600">
                        {transaction.referenceNumber}
                      </span>
                    </td>

                    <td className="max-w-[260px] px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {transaction.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {transaction.type === "INCOME"
                          ? "Income"
                          : "Expense"}
                        {transaction.party?.name
                          ? ` · ${transaction.party.name}`
                          : ""}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {transaction.category?.name ?? "Uncategorized"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(transaction.transactionDate)}
                    </td>

                    <td
                      className={`whitespace-nowrap px-5 py-4 font-semibold ${
                        transaction.type === "INCOME"
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "+" : "−"}
                      {money(transaction.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          statusClass[transaction.status]
                        }`}
                      >
                        {readableStatus(transaction.status)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {renderActions(transaction)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              {search ||
              statusFilter !== "ALL" ||
              typeFilter !== "ALL" ? (
                <Search size={25} />
              ) : (
                <ReceiptText size={25} />
              )}
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              {data?.transactions.length
                ? "No matching transactions"
                : "No transactions yet"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {data?.transactions.length
                ? "Try changing your search or filters."
                : "Create a category first, then record your first financial transaction."}
            </p>

            {data?.transactions.length ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setTypeFilter("ALL");
                }}
                className="mt-4 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear filters
              </button>
            ) : (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link
                  href="/admin/billing/categories"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <FolderCog size={16} />
                  Manage Categories
                </Link>

                <button
                  type="button"
                  onClick={openModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#641830]"
                >
                  <Plus size={16} />
                  New Transaction
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Finance notice */}
      <div className="flex items-start gap-2 text-xs leading-5 text-slate-500">
        <CircleAlert size={15} className="mt-0.5 shrink-0" />

        <p>
          Financial totals are calculated by the billing API. Draft and
          rejected entries should not be treated as approved financial
          totals. Verify records before using figures for official reporting.
        </p>
      </div>

      {/* New transaction modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-modal-title"
            className="flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A1F3D]">
                  <ReceiptText size={15} />
                  Finance Register
                </div>

                <h2
                  id="transaction-modal-title"
                  className="text-xl font-bold tracking-tight text-slate-900"
                >
                  New Transaction
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the details for an income or expense record.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close transaction form"
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={submitTransaction}
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <div className="space-y-6 px-5 py-6 sm:px-7">
                {formError && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                    <CircleAlert
                      size={18}
                      className="mt-0.5 shrink-0"
                    />
                    <p className="break-words">{formError}</p>
                  </div>
                )}

                {/* Transaction type */}
                <div>
                  <label className={labelClass}>
                    Transaction Type *
                  </label>

                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {(["INCOME", "EXPENSE"] as const).map((type) => {
                      const income = type === "INCOME";
                      const selected = form.type === type;
                      const Icon = income ? ArrowDownLeft : ArrowUpRight;

                      return (
                        <button
                          key={type}
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              type,
                              categoryId: "",
                            }))
                          }
                          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                            selected
                              ? income
                                ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10"
                                : "border-rose-500 bg-rose-50 ring-2 ring-rose-500/10"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              income
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            <Icon size={21} />
                          </span>

                          <span>
                            <span className="block text-sm font-bold text-slate-800">
                              {income ? "Income" : "Expense"}
                            </span>

                            <span className="mt-1 block text-xs text-slate-500">
                              {income ? "Money received" : "Money spent"}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label
                      className={labelClass}
                      htmlFor="transaction-title"
                    >
                      Transaction Title *
                    </label>

                    <input
                      id="transaction-title"
                      className={inputClass}
                      value={form.title}
                      onChange={(event) =>
                        updateForm("title", event.target.value)
                      }
                      placeholder={
                        form.type === "INCOME"
                          ? "e.g. Community donation"
                          : "e.g. Health awareness program supplies"
                      }
                      maxLength={200}
                      required
                      disabled={saving}
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label
                      className={labelClass}
                      htmlFor="transaction-amount"
                    >
                      Amount (NPR) *
                    </label>

                    <div className="relative mt-1.5">
                      <span className="absolute inset-y-0 left-3.5 flex items-center text-sm font-semibold text-slate-500">
                        Rs.
                      </span>

                      <input
                        id="transaction-amount"
                        className={`${inputClass} mt-0 pl-12`}
                        type="number"
                        min="0.01"
                        max="999999999999.99"
                        step="0.01"
                        value={form.amount}
                        onChange={(event) =>
                          updateForm("amount", event.target.value)
                        }
                        placeholder="0.00"
                        required
                        disabled={saving}
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label
                      className={labelClass}
                      htmlFor="transaction-date"
                    >
                      Transaction Date *
                    </label>

                    <input
                      id="transaction-date"
                      className={inputClass}
                      type="date"
                      value={form.transactionDate}
                      onChange={(event) =>
                        updateForm(
                          "transactionDate",
                          event.target.value,
                        )
                      }
                      required
                      disabled={saving}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      className={labelClass}
                      htmlFor="transaction-category"
                    >
                      Category *
                    </label>

                    <select
                      id="transaction-category"
                      className={inputClass}
                      value={form.categoryId}
                      onChange={(event) =>
                        updateForm("categoryId", event.target.value)
                      }
                      required
                      disabled={saving || categories.length === 0}
                    >
                      <option value="">Select a category</option>

                      {categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>

                    {categories.length === 0 && (
                      <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs leading-5 text-amber-800">
                          No {form.type.toLowerCase()} categories are
                          available.
                        </p>

                        <Link
                          href="/admin/billing/categories"
                          onClick={() => setModalOpen(false)}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1F3D] underline"
                        >
                          <Tag size={13} />
                          Create a category
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Party */}
                  <div>
                    <label
                      className={labelClass}
                      htmlFor="transaction-party"
                    >
                      Donor, Funder or Vendor
                    </label>

                    <select
                      id="transaction-party"
                      className={inputClass}
                      value={form.partyId}
                      onChange={(event) =>
                        updateForm("partyId", event.target.value)
                      }
                      disabled={saving}
                    >
                      <option value="">No party selected</option>

                      {(data?.parties ?? []).map((party) => (
                        <option key={party.id} value={party.id}>
                          {party.name} (
                          {party.type.replaceAll("_", " ").toLowerCase()})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment method */}
                  <div>
                    <label
                      className={labelClass}
                      htmlFor="payment-method"
                    >
                      Payment Method *
                    </label>

                    <select
                      id="payment-method"
                      className={inputClass}
                      value={form.paymentMethod}
                      onChange={(event) =>
                        updateForm(
                          "paymentMethod",
                          event.target.value as PaymentMethod,
                        )
                      }
                      required
                      disabled={saving}
                    >
                      {paymentMethods.map((method) => (
                        <option
                          key={method.value}
                          value={method.value}
                        >
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment reference */}
                  <div>
                    <label
                      className={labelClass}
                      htmlFor="payment-reference"
                    >
                      Payment Reference
                    </label>

                    <input
                      id="payment-reference"
                      className={inputClass}
                      value={form.paymentReference}
                      onChange={(event) =>
                        updateForm(
                          "paymentReference",
                          event.target.value,
                        )
                      }
                      placeholder="Receipt, cheque or transfer number"
                      maxLength={150}
                      disabled={saving}
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label
                      className={labelClass}
                      htmlFor="transaction-description"
                    >
                      Description
                    </label>

                    <textarea
                      id="transaction-description"
                      className={`${inputClass} min-h-24 resize-y`}
                      value={form.description}
                      onChange={(event) =>
                        updateForm("description", event.target.value)
                      }
                      placeholder="Describe the purpose or source of this transaction..."
                      maxLength={2000}
                      rows={3}
                      disabled={saving}
                    />
                  </div>

                  {/* Notes */}
                  <div className="sm:col-span-2">
                    <label
                      className={labelClass}
                      htmlFor="transaction-notes"
                    >
                      Internal Notes
                    </label>

                    <textarea
                      id="transaction-notes"
                      className={`${inputClass} min-h-20 resize-y`}
                      value={form.notes}
                      onChange={(event) =>
                        updateForm("notes", event.target.value)
                      }
                      placeholder="Additional notes for the finance team (optional)"
                      maxLength={2000}
                      rows={2}
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Draft notice */}
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <Clock3
                    size={19}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />

                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Saved as a draft
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-800">
                      The transaction must be submitted and processed
                      through the finance approval workflow.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form footer */}
              <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || categories.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#641830] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />
                      Saving Transaction...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Save Draft
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}