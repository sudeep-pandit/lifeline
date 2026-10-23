
"use client";

import { useState } from "react";
import { LogOut, LoaderCircle, AlertCircle } from "lucide-react";

export default function AdminHeader() {
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Unable to sign out. Please try again.");
      }

      // A full navigation clears the current protected UI.
      window.location.replace("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while signing out.",
      );
      setLoggingOut(false);
    }
  }

  return (
    <header className="flex min-h-16 items-center justify-end gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 text-sm text-red-600"
        >
          <AlertCircle size={16} />
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSignOut}
        disabled={loggingOut}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loggingOut ? (
          <LoaderCircle size={17} className="animate-spin" />
        ) : (
          <LogOut size={17} />
        )}

        {loggingOut ? "Signing out..." : "Sign out"}
      </button>
    </header>
  );
}
