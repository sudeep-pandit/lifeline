import Link from "next/link";
import { ArrowLeft, ShieldX } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <ShieldX size={32} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          Access Restricted
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          You do not have permission to access this page.
          Please contact an administrator if you believe this is a mistake.
        </p>

        <Link
          href="/admin/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17439F]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}