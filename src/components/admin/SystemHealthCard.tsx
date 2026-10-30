
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Database,
  RefreshCw,
  Server,
  XCircle,
} from "lucide-react";

type HealthStatus = "healthy" | "degraded" | "unavailable";

type HealthResponse = {
  status?: HealthStatus;
  checks?: {
    application?: string;
    database?: string;
  };
  checkedAt?: string;
};

function formatCheckedAt(value?: string) {
  if (!value) return "Not checked yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString();
}

export default function SystemHealthCard() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastError, setLastError] = useState(false);

  const checkHealth = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);

    try {
      const response = await fetch("/api/health/ready", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });

      const data = (await response.json()) as HealthResponse;

      setHealth(data);
      setLastError(!response.ok);
    } catch {
      setHealth({
        status: "unavailable",
        checks: {
          application: "unavailable",
          database: "unknown",
        },
      });

      setLastError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void checkHealth();

    const interval = window.setInterval(() => {
      void checkHealth();
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [checkHealth]);

  const status: HealthStatus = lastError
    ? health?.status === "degraded"
      ? "degraded"
      : "unavailable"
    : health?.status ?? "unavailable";

  const statusConfig = {
    healthy: {
      label: "All systems operational",
      description: "Application and database are responding.",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      dotClassName: "bg-emerald-500",
    },
    degraded: {
      label: "Service degraded",
      description: "The application is responding, but a dependency needs attention.",
      icon: CircleAlert,
      className: "bg-amber-50 text-amber-700 ring-amber-200",
      dotClassName: "bg-amber-500",
    },
    unavailable: {
      label: "Health check unavailable",
      description: "The health endpoint could not confirm system availability.",
      icon: XCircle,
      className: "bg-red-50 text-red-700 ring-red-200",
      dotClassName: "bg-red-500",
    },
  }[status];

  const StatusIcon = statusConfig.icon;

  const rows = [
    {
      label: "Next.js application",
      value: health?.checks?.application ?? "unknown",
      icon: Server,
    },
    {
      label: "PostgreSQL database",
      value: health?.checks?.database ?? "unknown",
      icon: Database,
    },
  ];

  function getRowStatus(value: string) {
    if (value === "healthy") {
      return {
        label: "Healthy",
        className: "text-emerald-700",
        icon: CheckCircle2,
      };
    }

    if (value === "unavailable") {
      return {
        label: "Unavailable",
        className: "text-red-700",
        icon: XCircle,
      };
    }

    return {
      label: "Unknown",
      className: "text-slate-500",
      icon: CircleAlert,
    };
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Activity size={21} />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              System Health
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Live application and database checks
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void checkHealth(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div
          className={`flex items-start gap-3 rounded-xl p-4 ring-1 ${statusConfig.className}`}
        >
          <StatusIcon size={20} className="mt-0.5 shrink-0" />

          <div className="min-w-0">
            <p className="text-sm font-bold">
              {loading ? "Checking systems..." : statusConfig.label}
            </p>
            <p className="mt-1 text-xs leading-5 opacity-85">
              {loading
                ? "Waiting for the health endpoint."
                : statusConfig.description}
            </p>
          </div>

          <span
            className={`ml-auto mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${statusConfig.dotClassName} ${loading ? "animate-pulse" : ""}`}
          />
        </div>

        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
          {rows.map((row) => {
            const Icon = row.icon;
            const result = getRowStatus(row.value);
            const ResultIcon = result.icon;

            return (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Icon size={17} className="shrink-0 text-slate-400" />
                  <span className="truncate text-sm font-medium text-slate-700">
                    {row.label}
                  </span>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold ${result.className}`}
                >
                  <ResultIcon size={14} />
                  {loading ? "Checking" : result.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock3 size={14} />
          <span>
            Last checked: {formatCheckedAt(health?.checkedAt)}
          </span>
        </div>

        <p className="text-[11px] leading-5 text-slate-400">
          Automatic checks run every minute while this dashboard is open.
        </p>
      </div>
    </section>
  );
}
