
"use client";

import {
  AlertTriangle,
  Database,
  HardDrive,
  Info,
  ServerCog,
  Wrench,
} from "lucide-react";

const systemItems = [
  {
    title: "Application runtime",
    description:
      "This application uses Next.js and Prisma. The running version, deployment environment, and runtime health need to be obtained from the actual server environment.",
    icon: ServerCog,
    status: "Not checked",
  },
  {
    title: "PostgreSQL database",
    description:
      "Prisma connects your application to PostgreSQL. A real health indicator requires a protected server-side database connectivity check.",
    icon: Database,
    status: "Not checked",
  },
  {
    title: "Media and file storage",
    description:
      "Uploaded images and other media may be stored separately from PostgreSQL. Confirm that your storage location is included in your backup and recovery plan.",
    icon: HardDrive,
    status: "Review required",
  },
  {
    title: "Maintenance operations",
    description:
      "Safe maintenance operations may include migrations, dependency updates, deployment checks, and recovery procedures. These should be performed through controlled workflows.",
    icon: Wrench,
    status: "Manual process",
  },
];

export default function SystemMaintenanceSettings() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Info
            size={21}
            className="mt-0.5 shrink-0 text-[#2457C5]"
          />

          <div>
            <h3 className="text-sm font-bold text-slate-900">
              System status has not been verified
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              The information on this page describes maintenance
              responsibilities. It does not connect to the database,
              inspect the server, or run maintenance commands.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {systemItems.map((item) => {
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

      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={21}
            className="mt-0.5 shrink-0 text-red-700"
          />

          <div>
            <h3 className="text-sm font-bold text-red-950">
              Backup and recovery
            </h3>

            <p className="mt-1 text-sm leading-6 text-red-900/80">
              A backup has not been verified by this dashboard. Before
              going live, establish a regular PostgreSQL backup
              schedule, protect backup files, include uploaded media
              where necessary, and periodically test restoration.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-[#F7F8FC] p-5">
        <h3 className="text-sm font-bold text-[#172033]">
          Maintenance mode
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your existing Website Configuration form saves the
          <code> maintenanceMode </code>
          preference. That preference alone does not block public
          requests. A separate server-side implementation is needed
          to enable maintenance mode safely and provide an authorized
          bypass for administrators.
        </p>
      </div>
    </div>
  );
}
