
"use client";

import {
  AlertTriangle,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Users,
} from "lucide-react";

const securityItems = [
  {
    title: "Password protection",
    description:
      "Use strong, unique passwords for administrator accounts. Password requirements and reset flows must be enforced by your authentication backend.",
    icon: KeyRound,
    status: "Review required",
  },
  {
    title: "Login protection",
    description:
      "Rate limiting, failed-login tracking, session expiration, and account lockout should be implemented and enforced on the server where appropriate.",
    icon: LockKeyhole,
    status: "Backend verification",
  },
  {
    title: "Permission management",
    description:
      "Protected admin pages and API routes must check the current user's permissions on the server. Hiding a button in the interface is not access control.",
    icon: ShieldCheck,
    status: "Access review",
  },
  {
    title: "Administrator accounts",
    description:
      "Review administrator access regularly. Remove unnecessary access and ensure sensitive actions are restricted to authorized roles.",
    icon: Users,
    status: "Periodic review",
  },
];

export default function SecurityAdministrationSettings() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={21}
            className="mt-0.5 shrink-0 text-amber-700"
          />

          <div>
            <h3 className="text-sm font-bold text-amber-950">
              Security review recommended
            </h3>
            <p className="mt-1 text-sm leading-6 text-amber-900/80">
              This page is a checklist, not a live security scanner.
              The items below have not been automatically tested or
              verified by this screen.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {securityItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2457C5]/[0.08] text-[#2457C5]">
                  <Icon size={21} />
                </div>

                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {item.status}
                </span>
              </div>

              <h3 className="mt-4 text-base font-bold text-[#172033]">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-[#F7F8FC] p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={21}
            className="mt-0.5 shrink-0 text-[#7A1F3D]"
          />

          <div>
            <h3 className="text-sm font-bold text-[#172033]">
              Existing permission controls
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Continue using your existing server-side permission
              checks, such as <code>requirePermission()</code>, for
              protected settings and administrative actions. Do not
              weaken existing access restrictions to make this screen
              accessible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
