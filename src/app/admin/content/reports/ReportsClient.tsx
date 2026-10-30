
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle, Download, ExternalLink, FileText, Loader2,
  Pencil, Plus, RefreshCw, Search, Trash2, UploadCloud, X,
} from "lucide-react";

type Category = "ANNUAL" | "FINANCIAL" | "PROGRAM" | "PROJECT";
type Status = "DRAFT" | "PUBLISHED";

type Report = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: Category;
  status: Status;
  reportYear: string | null;
  isFeatured: boolean;
  sortOrder: number;
  pdfUrl: string;
  pdfName: string;
  pdfSize: number;
  publishedAt: string | null;
  updatedAt: string;
};

const categories: { value: Category; label: string }[] = [
  { value: "ANNUAL", label: "Annual Reports" },
  { value: "FINANCIAL", label: "Financial Reports" },
  { value: "PROGRAM", label: "Program Reports" },
  { value: "PROJECT", label: "Project Reports" },
];

const initialForm = {
  title: "",
  slug: "",
  description: "",
  category: "ANNUAL" as Category,
  reportYear: "",
  status: "DRAFT" as Status,
  isFeatured: false,
  sortOrder: "0",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

function readableSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function ReportsClient() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editing, setEditing] = useState<Report | null>(null);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/reports", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load reports.");
      setReports(data.reports ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  function startNew() {
    setEditing(null);
    setForm(initialForm);
    setFile(null);
    setFileInputKey((key) => key + 1);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function startEdit(report: Report) {
    setEditing(report);
    setForm({
      title: report.title,
      slug: report.slug,
      description: report.description ?? "",
      category: report.category,
      reportYear: report.reportYear ?? "",
      status: report.status,
      isFeatured: report.isFeatured,
      sortOrder: String(report.sortOrder),
    });
    setFile(null);
    setFileInputKey((key) => key + 1);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (!editing && !file) throw new Error("Please select a PDF to upload.");

      const body = new FormData();
      body.set("title", form.title.trim());
      body.set("slug", form.slug.trim() || slugify(form.title));
      body.set("description", form.description);
      body.set("category", form.category);
      body.set("reportYear", form.reportYear.trim());
      body.set("status", form.status);
      body.set("isFeatured", String(form.isFeatured));
      body.set("sortOrder", form.sortOrder);

      if (file) body.set("file", file);

      const response = await fetch(
        editing ? `/api/reports/${editing.id}` : "/api/reports",
        { method: editing ? "PATCH" : "POST", body },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save the report.");

      setModalOpen(false);
      setNotice(data.message || "Report saved successfully.");
      await loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the report.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteReport(report: Report) {
    if (!window.confirm(`Delete "${report.title}" and its uploaded PDF? This cannot be undone.`)) return;

    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/reports/${report.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete report.");
      setNotice(data.message || "Report deleted.");
      await loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete report.");
    }
  }

  const filteredReports = reports.filter((report) => {
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      report.title.toLowerCase().includes(query) ||
      (report.description ?? "").toLowerCase().includes(query) ||
      (report.reportYear ?? "").toLowerCase().includes(query);
    return matchesSearch &&
      (categoryFilter === "ALL" || report.category === categoryFilter) &&
      (statusFilter === "ALL" || report.status === statusFilter);
  });

  return (
    <main className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
              Resources / Media & Stories
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#172033]">
              Reports Library
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Upload, organize, and publish Lifeline Achham reports.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => void loadReports()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <button
              onClick={startNew}
              className="inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#55152B]"
            >
              <Plus size={17} /> Add report
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["All reports", reports.length],
            ["Published", reports.filter((r) => r.status === "PUBLISHED").length],
            ["Drafts", reports.filter((r) => r.status === "DRAFT").length],
            ["Featured", reports.filter((r) => r.isFeatured).length],
          ].map(([label, count]) => (
            <div key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-[#172033]">{count}</p>
            </div>
          ))}
        </section>

        {error && !modalOpen && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}
        {notice && !modalOpen && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[1fr_200px_160px]">
            <div className="relative">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className={`${inputClass} pl-10`} placeholder="Search title, year or description..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className={inputClass} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="ALL">All categories</option>
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-16 text-sm text-slate-500"><Loader2 className="animate-spin" size={20} /> Loading reports...</div>
          ) : filteredReports.length === 0 ? (
            <div className="p-16 text-center">
              <FileText size={36} className="mx-auto text-slate-300" />
              <h2 className="mt-4 font-semibold text-slate-800">No reports found</h2>
              <p className="mt-1 text-sm text-slate-500">Add a report or adjust your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Report</th>
                    <th className="px-5 py-4">Category / year</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">PDF</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{report.title}</p>
                        <p className="mt-1 max-w-md truncate text-xs text-slate-500">{report.description || "No description"}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-slate-700">{categories.find((c) => c.value === report.category)?.label}</p>
                        <p className="mt-1 text-xs text-slate-500">{report.reportYear || "Year not set"}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${report.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {report.status === "PUBLISHED" ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <a href={report.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-700 hover:underline">
                          <FileText size={16} /> {readableSize(report.pdfSize)}
                          <ExternalLink size={13} />
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button title="Edit report" onClick={() => startEdit(report)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"><Pencil size={16} /></button>
                          <a title="Download PDF" href={report.pdfUrl} download={report.pdfName} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"><Download size={16} /></a>
                          <button title="Delete report" onClick={() => void deleteReport(report)} className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 py-8 sm:p-6">
          <section className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <header className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-[#172033]">{editing ? "Edit report" : "Add a report"}</h2>
                <p className="mt-1 text-sm text-slate-500">PDF files only · Maximum 25 MB</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={19} /></button>
            </header>

            <form onSubmit={submitForm} className="space-y-5 p-5 sm:p-6">
              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

              <div>
                <label className={labelClass}>Report title *</label>
                <input required maxLength={200} className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} placeholder="e.g. Annual Report 2082/83" />
              </div>

              <div>
                <label className={labelClass}>URL slug</label>
                <input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="annual-report-2082-83" />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea rows={3} className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Briefly describe this report..." />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                    {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Reporting year</label>
                  <input className={inputClass} value={form.reportYear} onChange={(e) => setForm({ ...form, reportYear: e.target.value })} placeholder="2082/83 or 2026" maxLength={30} />
                </div>
              </div>

              <div>
                <label className={labelClass}>PDF document {!editing && "*"}</label>
                <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-[#7A1F3D]/50">
                  <UploadCloud size={28} className="text-[#7A1F3D]" />
                  <span className="mt-2 text-sm font-semibold text-slate-700">{file ? file.name : editing ? `Current file: ${editing.pdfName}` : "Choose a PDF file"}</span>
                  <span className="mt-1 text-xs text-slate-500">{file ? readableSize(file.size) : editing ? "Choose a new PDF only if you want to replace it" : "PDF format, up to 25 MB"}</span>
                  <input key={fileInputKey} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required={!editing} />
                </label>
                {file && <button type="button" onClick={() => { setFile(null); setFileInputKey((key) => key + 1); }} className="mt-2 text-xs font-semibold text-red-600">Remove selected file</button>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Publication status</label>
                  <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>
                    <option value="DRAFT">Draft — hidden publicly</option>
                    <option value="PUBLISHED">Published — visible publicly</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Sort order</label>
                  <input type="number" className={inputClass} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="h-4 w-4 accent-[#7A1F3D]" />
                Feature this report on the public page
              </label>

              <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button disabled={saving} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#55152B] disabled:opacity-60">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? "Saving..." : editing ? "Save changes" : "Create report"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
