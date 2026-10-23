"use client";

import {
  Archive,
  ArrowDownLeft,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  Inbox,
  LoaderCircle,
  Mail,
  MailOpen,
  RefreshCw,
  Search,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type MessageItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  enquiryType: string;
  subject: string;
  message: string;
  isRead: boolean;
  isImportant: boolean;
  isArchived: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type MessageFilter =
  | "inbox"
  | "unread"
  | "read"
  | "important"
  | "archived";

type MessageMeta = {
  total: number;
  unreadCount: number;
  importantCount: number;
  archivedCount: number;
};

const EMPTY_META: MessageMeta = {
  total: 0,
  unreadCount: 0,
  importantCount: 0,
  archivedCount: 0,
};

const FILTERS: {
  value: MessageFilter;
  label: string;
  icon: typeof Inbox;
}[] = [
  { value: "inbox", label: "Inbox", icon: Inbox },
  { value: "unread", label: "Unread", icon: Mail },
  { value: "read", label: "Read", icon: MailOpen },
  { value: "important", label: "Important", icon: Star },
  { value: "archived", label: "Archived", icon: Archive },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [meta, setMeta] = useState<MessageMeta>(EMPTY_META);
  const [filter, setFilter] = useState<MessageFilter>("inbox");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        filter,
        ...(search.trim() ? { search: search.trim() } : {}),
      });

      const response = await fetch(`/api/messages?${params.toString()}`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load messages.");
      }

      const loadedMessages = result.data as MessageItem[];

      setMessages(loadedMessages);
      setMeta({
        total: result.meta?.total ?? loadedMessages.length,
        unreadCount: result.meta?.unreadCount ?? 0,
        importantCount: result.meta?.importantCount ?? 0,
        archivedCount: result.meta?.archivedCount ?? 0,
      });

      setSelectedId((current) => {
        if (
          current &&
          loadedMessages.some((message) => message.id === current)
        ) {
          return current;
        }

        return loadedMessages[0]?.id ?? null;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading messages.",
      );
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedId) ?? null,
    [messages, selectedId],
  );

  async function updateMessage(
    id: string,
    updates: {
      isRead?: boolean;
      isImportant?: boolean;
      isArchived?: boolean;
    },
  ) {
    setActionLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to update the message.");
      }

      setNotice(result.message || "Message updated successfully.");
      await loadMessages();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update the message.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function openMessage(message: MessageItem) {
    setSelectedId(message.id);
    setNotice("");

    if (!message.isRead) {
      await updateMessage(message.id, { isRead: true });
    }
  }

  async function deleteMessage(message: MessageItem) {
    const confirmed = window.confirm(
      `Permanently delete the message from ${message.name}? This cannot be undone.`,
    );

    if (!confirmed) return;

    setActionLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/messages/${message.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete the message.");
      }

      setSelectedId(null);
      setNotice("Message deleted successfully.");
      await loadMessages();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete the message.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-[#FCFAF7] p-4 text-[#172033] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
              <Mail size={15} />
              Communication
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Messages
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage enquiries and messages received by Lifeline Achham.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadMessages()}
            disabled={loading || actionLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold transition hover:border-[#2457C5] hover:text-[#2457C5] disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh inbox
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <SummaryCard
            label="Inbox messages"
            value={meta.total}
            icon={Inbox}
            tone="burgundy"
          />
          <SummaryCard
            label="Unread messages"
            value={meta.unreadCount}
            icon={Mail}
            tone="blue"
          />
          <SummaryCard
            label="Important"
            value={meta.importantCount}
            icon={Star}
            tone="amber"
          />
          <SummaryCard
            label="Archived"
            value={meta.archivedCount}
            icon={Archive}
            tone="slate"
          />
        </div>

        {/* FEEDBACK */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <X size={18} className="mt-0.5 shrink-0" />
            <div className="flex-1">{error}</div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {notice && !error && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            <Check size={17} />
            {notice}
          </div>
        )}

        {/* INBOX WORKSPACE */}
        <div className="grid min-h-[680px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:grid-cols-[245px_minmax(300px,0.95fr)_minmax(350px,1.2fr)]">
          {/* FILTER SIDEBAR */}
          <aside className="border-b border-slate-200 p-4 xl:border-b-0 xl:border-r">
            <p className="mb-3 px-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Mailbox
            </p>

            <nav className="space-y-1">
              {FILTERS.map((item) => {
                const Icon = item.icon;
                const active = filter === item.value;

                const count =
                  item.value === "unread"
                    ? meta.unreadCount
                    : item.value === "important"
                      ? meta.importantCount
                      : item.value === "archived"
                        ? meta.archivedCount
                        : null;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setFilter(item.value);
                      setNotice("");
                    }}
                    className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition ${
                      active
                        ? "bg-[#F7E9EE] text-[#7A1F3D]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#172033]"
                    }`}
                  >
                    <Icon size={17} />
                    <span className="flex-1">{item.label}</span>

                    {count !== null && count > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          active
                            ? "bg-white text-[#7A1F3D]"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {count}
                      </span>
                    )}

                    {active && <ChevronRight size={15} />}
                  </button>
                );
              })}
            </nav>

            <div className="mt-7 rounded-xl bg-[#F7E9EE]/70 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#7A1F3D]">
                <ArrowDownLeft size={17} />
                Contact enquiries
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                Messages submitted through the public website appear here
                automatically once the contact form is connected.
              </p>
            </div>
          </aside>

          {/* MESSAGE LIST */}
          <section className="flex min-w-0 flex-col border-b border-slate-200 xl:border-b-0 xl:border-r">
            <div className="border-b border-slate-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold">
                    {FILTERS.find((item) => item.value === filter)?.label}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {messages.length} displayed
                  </p>
                </div>

                <span className="rounded-lg bg-slate-50 p-2 text-slate-400">
                  <Inbox size={18} />
                </span>
              </div>

              <div className="relative mt-4">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search messages..."
                  aria-label="Search messages"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-[#FCFAF7] pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2457C5] focus:ring-4 focus:ring-[#2457C5]/10"
                />
              </div>
            </div>

            <div className="flex-1">
              {loading ? (
                <LoadingState />
              ) : messages.length === 0 ? (
                <EmptyState
                  title="No messages found"
                  description={
                    search
                      ? "Try another search term."
                      : "Messages matching this mailbox will appear here."
                  }
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {messages.map((message) => {
                    const active = selectedId === message.id;

                    return (
                      <button
                        key={message.id}
                        type="button"
                        onClick={() => void openMessage(message)}
                        className={`block w-full border-l-[3px] p-4 text-left transition ${
                          active
                            ? "border-l-[#2457C5] bg-[#EEF4FF]/70"
                            : "border-l-transparent hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7E9EE] text-xs font-bold text-[#7A1F3D]">
                            {getInitials(message.name)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`truncate text-sm ${
                                  message.isRead
                                    ? "font-medium text-slate-600"
                                    : "font-bold text-[#172033]"
                                }`}
                              >
                                {message.name}
                              </p>

                              <span className="shrink-0 text-[10px] text-slate-400">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>

                            <p
                              className={`mt-1 truncate text-sm ${
                                message.isRead
                                  ? "font-medium text-slate-600"
                                  : "font-bold text-[#172033]"
                              }`}
                            >
                              {message.subject}
                            </p>

                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                              {message.message}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                                {message.enquiryType}
                              </span>

                              {!message.isRead && (
                                <span className="h-2 w-2 rounded-full bg-[#2457C5]" title="Unread" />
                              )}

                              {message.isImportant && (
                                <Star
                                  size={13}
                                  className="fill-amber-400 text-amber-500"
                                />
                              )}

                              {message.isArchived && (
                                <Archive
                                  size={13}
                                  className="text-slate-400"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {!loading && messages.length === 100 && (
              <p className="border-t border-slate-100 p-3 text-center text-xs text-slate-400">
                Showing the latest 100 matching messages.
              </p>
            )}
          </section>

          {/* MESSAGE DETAILS */}
          <section className="flex min-w-0 flex-col">
            {selectedMessage ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <MailOpen size={16} />
                    Message details
                  </div>

                  <div className="flex items-center gap-1">
                    <ActionButton
                      label={
                        selectedMessage.isImportant
                          ? "Remove important flag"
                          : "Mark important"
                      }
                      onClick={() =>
                        void updateMessage(selectedMessage.id, {
                          isImportant: !selectedMessage.isImportant,
                        })
                      }
                      disabled={actionLoading}
                    >
                      <Star
                        size={17}
                        className={
                          selectedMessage.isImportant
                            ? "fill-amber-400 text-amber-500"
                            : ""
                        }
                      />
                    </ActionButton>

                    <ActionButton
                      label={
                        selectedMessage.isArchived
                          ? "Restore to inbox"
                          : "Archive message"
                      }
                      onClick={() =>
                        void updateMessage(selectedMessage.id, {
                          isArchived: !selectedMessage.isArchived,
                        })
                      }
                      disabled={actionLoading}
                    >
                      {selectedMessage.isArchived ? (
                        <Inbox size={17} />
                      ) : (
                        <Archive size={17} />
                      )}
                    </ActionButton>

                    <ActionButton
                      label={
                        selectedMessage.isRead
                          ? "Mark unread"
                          : "Mark read"
                      }
                      onClick={() =>
                        void updateMessage(selectedMessage.id, {
                          isRead: !selectedMessage.isRead,
                        })
                      }
                      disabled={actionLoading}
                    >
                      {selectedMessage.isRead ? (
                        <Mail size={17} />
                      ) : (
                        <CheckCheck size={17} />
                      )}
                    </ActionButton>

                    <ActionButton
                      label="Delete message"
                      onClick={() => void deleteMessage(selectedMessage)}
                      disabled={actionLoading}
                      danger
                    >
                      <Trash2 size={17} />
                    </ActionButton>
                  </div>
                </div>

                <div className="flex-1 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-[#EEF4FF] px-3 py-1.5 text-xs font-bold text-[#2457C5]">
                      {selectedMessage.enquiryType}
                    </span>

                    {selectedMessage.isImportant && (
                      <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                        Important
                      </span>
                    )}

                    {selectedMessage.isArchived && (
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                        Archived
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 break-words text-xl font-bold leading-8 tracking-tight text-[#172033] sm:text-2xl">
                    {selectedMessage.subject}
                  </h2>

                  <div className="mt-6 flex items-start gap-3 border-b border-slate-100 pb-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F7E9EE] text-sm font-bold text-[#7A1F3D]">
                      {getInitials(selectedMessage.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-bold">
                        {selectedMessage.name}
                      </p>

                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="mt-1 block break-all text-sm text-[#2457C5] hover:underline"
                      >
                        {selectedMessage.email}
                      </a>

                      {selectedMessage.phone && (
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="mt-1 block text-sm text-slate-500 hover:text-[#2457C5]"
                        >
                          {selectedMessage.phone}
                        </a>
                      )}

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock3 size={13} />
                        Received {formatDateTime(selectedMessage.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="py-6">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      Message
                    </p>

                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div className="mt-2 rounded-xl border border-slate-200 bg-[#FCFAF7] p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-white p-2 text-slate-500">
                        <UserRound size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Reply to sender
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          Use your email application to reply directly.
                        </p>

                        <a
                          href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}`}
                          className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#2457C5] px-4 text-sm font-bold text-white transition hover:bg-[#17439F]"
                        >
                          <ArrowDownLeft size={16} />
                          Reply by email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-400">
                  <span>
                    Message ID: {selectedMessage.id.slice(0, 12)}
                  </span>
                  <span>Updated {formatDate(selectedMessage.updatedAt)}</span>
                </div>
              </>
            ) : (
              <EmptyState
                title="Select a message"
                description="Choose a message from the list to read its full details."
              />
            )}
          </section>
        </div>

        {actionLoading && (
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <LoaderCircle size={14} className="animate-spin" />
            Updating message…
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Inbox;
  tone: "burgundy" | "blue" | "amber" | "slate";
}) {
  const styles = {
    burgundy: "bg-[#F7E9EE] text-[#7A1F3D]",
    blue: "bg-[#EEF4FF] text-[#2457C5]",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold leading-5 text-slate-500 sm:text-sm">
          {label}
        </span>
        <span className={`rounded-xl p-2 ${styles[tone]}`}>
          <Icon size={18} />
        </span>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function ActionButton({
  children,
  label,
  onClick,
  disabled,
  danger = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition disabled:opacity-40 ${
        danger
          ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-[#2457C5]"
      }`}
    >
      {children}
    </button>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-sm text-slate-400">
      <LoaderCircle size={25} className="animate-spin text-[#2457C5]" />
      Loading messages…
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-60 flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#2457C5]">
        <MailOpen size={24} />
      </div>

      <h3 className="mt-4 text-base font-bold text-[#172033]">{title}</h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}