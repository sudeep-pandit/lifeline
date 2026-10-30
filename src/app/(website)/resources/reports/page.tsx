
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileBarChart,
  FileText,
  Filter,
  FolderOpen,
  LoaderCircle,
  Search,
  ShieldCheck,
  X,
  RefreshCw,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type ReportCategory =
  | "Annual Reports"
  | "Financial Reports"
  | "Program Reports"
  | "Project Reports";

type ApiReportCategory =
  | "ANNUAL"
  | "FINANCIAL"
  | "PROGRAM"
  | "PROJECT";

type ApiReport = {
  id: string;
  title: string;
  slug?: string;
  description?: string | null;
  category: ApiReportCategory;
  reportYear?: string | null;
  pdfUrl: string;
  pdfName: string;
  pdfSize: number;
  mimeType?: string;
  publishedAt?: string | null;
  isFeatured?: boolean;
};

type Report = {
  id: string;
  title: string;
  description: string;
  year: string;
  category: ReportCategory;
  type: string;
  fileSize: string;
  fileUrl: string;
  fileName: string;
  isFeatured: boolean;
};

type ReportsApiResponse = {
  reports: ApiReport[];
  years?: string[];
  error?: string;
};

const API_URL = "/api/reports/public";

const categories = [
  "All",
  "Annual Reports",
  "Financial Reports",
  "Program Reports",
  "Project Reports",
] as const;

const categoryLabels: Record<ApiReportCategory, ReportCategory> = {
  ANNUAL: "Annual Reports",
  FINANCIAL: "Financial Reports",
  PROGRAM: "Program Reports",
  PROJECT: "Project Reports",
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "PDF";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mapApiReport(report: ApiReport): Report {
  return {
    id: report.id,
    title: report.title,
    description:
      report.description?.trim() ||
      "Read this report for more information about Lifeline Achham's activities and work.",
    year: report.reportYear?.trim() || "Year not specified",
    category: categoryLabels[report.category],
    type: "PDF",
    fileSize: formatFileSize(report.pdfSize),
    fileUrl: report.pdfUrl,
    fileName: report.pdfName,
    isFeatured: Boolean(report.isFeatured),
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while loading reports.";
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeYear, setActiveYear] = useState("All");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
        signal,
      });

      const data = (await response.json()) as ReportsApiResponse;

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load reports. Please try again.",
        );
      }

      if (!Array.isArray(data.reports)) {
        throw new Error(
          "The reports API returned an unexpected response. Please check the public reports API.",
        );
      }

      const mappedReports = data.reports
        .filter(
          (report) =>
            report &&
            report.id &&
            report.title &&
            report.pdfUrl &&
            report.category in categoryLabels,
        )
        .map(mapApiReport);

      setReports(mappedReports);

      const apiYears = Array.isArray(data.years)
        ? data.years.map(String)
        : [];

      const reportYears = mappedReports
        .map((report) => report.year)
        .filter((year) => year !== "Year not specified");

      const years = [...new Set([...apiYears, ...reportYears])]
        .filter(Boolean)
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

      setAvailableYears(years);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      setError(getErrorMessage(err));
      setReports([]);
      setAvailableYears([]);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void loadReports(controller.signal);

    return () => controller.abort();
  }, [loadReports]);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesCategory =
        activeCategory === "All" || report.category === activeCategory;

      const matchesYear =
        activeYear === "All" || report.year === activeYear;

      const matchesSearch =
        !query ||
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.category.toLowerCase().includes(query) ||
        report.year.toLowerCase().includes(query);

      return matchesCategory && matchesYear && matchesSearch;
    });
  }, [reports, activeCategory, activeYear, search]);

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveYear("All");
    setSearch("");
  };

  const hasFilters =
    activeCategory !== "All" ||
    activeYear !== "All" ||
    search.trim() !== "";

  const openPdf = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="bg-[#FCFAF7]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[500px] sm:h-[540px] lg:h-[580px]">
          <Image
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2200&q=90"
            alt="Lifeline Achham reports and documentation"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-[#55152B]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#7A1F3D]/65 to-[#2457C5]/20" />

          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="absolute right-[18%] top-24 h-20 w-20 rotate-12 rounded-2xl border border-white/10" />
          <div className="absolute bottom-24 left-[32%] h-2 w-2 rounded-full bg-white/30" />
          <div className="absolute right-[30%] top-28 h-1.5 w-1.5 rounded-full bg-white/30" />

          <div className="relative mx-auto flex h-full max-w-7xl items-start px-5 pt-32 sm:px-8 sm:pt-36 lg:px-10 lg:pt-40">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl"
            >
              <motion.div
                variants={fadeUp}
                className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/75"
              >
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
                <span>/</span>
                <Link
                  href="/resources/news"
                  className="transition hover:text-white"
                >
                  Resources
                </Link>
                <span>/</span>
                <span className="text-white">Reports</span>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/75"
              >
                <span className="h-[3px] w-10 rounded-full bg-white" />
                Resources
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Reports &amp; Documentation
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg"
              >
                Explore published organizational reports, financial
                documentation, program reports and project records that support
                transparency and responsible information sharing.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
                <span className="h-[3px] w-9 rounded-full bg-[#7A1F3D]" />
                Our Reports
              </div>

              <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
                Information that supports{" "}
                <span className="text-[#7A1F3D]">accountability.</span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                Reports provide a structured way to document activities,
                progress, learning and organizational information. This
                library helps communities, partners and stakeholders access
                documents published by Lifeline Achham.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <FileBarChart size={22} className="text-[#2457C5]" />
                  <p className="mt-4 text-sm font-bold text-[#172033]">
                    Annual
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Organizational reporting
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <BarChart3 size={22} className="text-[#7A1F3D]" />
                  <p className="mt-4 text-sm font-bold text-[#172033]">
                    Financial
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Financial documentation
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <BookOpen size={22} className="text-[#2457C5]" />
                  <p className="mt-4 text-sm font-bold text-[#172033]">
                    Programs
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Program documentation
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
                  <Image
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=90"
                    alt="Reports and financial documentation"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>

                <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                      <ShieldCheck size={21} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#172033]">
                        Transparent documentation
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        A central place for published organizational
                        documentation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REPORT LIBRARY */}
      <section className="border-y border-slate-200 bg-white py-20 sm:py-24">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
                  <span className="h-[3px] w-9 rounded-full bg-[#7A1F3D]" />
                  Document Library
                </div>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                  Reports &amp; Documents
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                  Browse published reports by category and reporting year.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full bg-[#F7E9EE] px-4 py-2 text-xs font-bold text-[#7A1F3D] sm:flex">
                  <FolderOpen size={15} />
                  {filteredReports.length}{" "}
                  {filteredReports.length === 1 ? "document" : "documents"}
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilters((value) => !value)}
                  aria-expanded={showFilters}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#172033] transition hover:border-[#2457C5]/30 hover:bg-[#EEF4FF] hover:text-[#2457C5]"
                >
                  <Filter size={17} />
                  Filters
                  <span className="text-slate-400">
                    <motion.span
                      animate={{ rotate: showFilters ? 180 : 0 }}
                      className="inline-flex"
                    >
                      <ArrowRight size={14} className="rotate-90" />
                    </motion.span>
                  </span>
                </button>
              </div>
            </div>

            {/* SEARCH */}
            <div className="mt-8 flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search reports and documents..."
                  aria-label="Search reports"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-[#FCFAF7] pl-11 pr-11 text-sm text-[#172033] outline-none transition placeholder:text-slate-400 focus:border-[#2457C5] focus:bg-white focus:ring-4 focus:ring-[#2457C5]/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#172033]"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            </div>

            {/* FILTER CONTROLS */}
            <AnimatePresence initial={false}>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-[#FCFAF7] p-5">
                    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          Category
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => {
                            const active = activeCategory === category;

                            return (
                              <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                                  active
                                    ? "bg-[#7A1F3D] text-white"
                                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#7A1F3D]/30 hover:text-[#7A1F3D]"
                                }`}
                              >
                                {category}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          Year
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveYear("All")}
                            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                              activeYear === "All"
                                ? "bg-[#2457C5] text-white"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-[#2457C5]/30 hover:text-[#2457C5]"
                            }`}
                          >
                            All
                          </button>

                          {availableYears.map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() => setActiveYear(year)}
                              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                                activeYear === year
                                  ? "bg-[#2457C5] text-white"
                                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#2457C5]/30 hover:text-[#2457C5]"
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {hasFilters && (
                      <div className="mt-5 border-t border-slate-200 pt-5">
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="inline-flex items-center gap-2 text-xs font-bold text-[#7A1F3D] transition hover:text-[#55152B]"
                        >
                          <X size={14} />
                          Clear all filters
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOADING STATE */}
            {loading && (
              <div
                role="status"
                className="mt-10 grid gap-5 md:grid-cols-2"
              >
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-[22px] border border-slate-200 bg-white p-5"
                  >
                    <div className="flex gap-5">
                      <div className="h-14 w-14 shrink-0 rounded-2xl bg-slate-100" />
                      <div className="flex-1">
                        <div className="h-4 w-32 rounded bg-slate-100" />
                        <div className="mt-4 h-5 w-3/4 rounded bg-slate-100" />
                        <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                        <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
                        <div className="mt-6 h-9 rounded bg-slate-100" />
                      </div>
                    </div>
                  </div>
                ))}
                <span className="sr-only">Loading published reports...</span>
              </div>
            )}

            {/* ERROR STATE */}
            {!loading && error && (
              <div
                role="alert"
                className="mt-10 rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
                  <FileText size={23} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#172033]">
                  Unable to load reports
                </h3>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void loadReports()}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#55152B]"
                >
                  <RefreshCw size={16} />
                  Try again
                </button>
              </div>
            )}

            {/* REPORT CARDS */}
            {!loading && !error && filteredReports.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="mt-10 grid gap-5 md:grid-cols-2"
              >
                {filteredReports.map((report) => (
                  <motion.article
                    key={report.id}
                    variants={fadeUp}
                    className="group rounded-[22px] border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/20 hover:shadow-xl"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F7E9EE] text-[#7A1F3D]">
                        <FileText size={25} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#2457C5]">
                            {report.category}
                          </span>

                          {report.isFeatured && (
                            <span className="rounded-full bg-[#F7E9EE] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#7A1F3D]">
                              Featured
                            </span>
                          )}

                          <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                            <CalendarDays size={13} />
                            {report.year}
                          </span>
                        </div>

                        <h3 className="mt-3 break-words text-lg font-bold leading-7 text-[#172033] transition group-hover:text-[#7A1F3D]">
                          {report.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                          {report.description}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400">
                            <span>{report.type}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>{report.fileSize}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openPdf(report.fileUrl)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-[#172033] transition hover:border-[#7A1F3D]/30 hover:bg-[#F7E9EE] hover:text-[#7A1F3D]"
                            >
                              <ExternalLink size={14} />
                              View PDF
                            </button>

                            <a
                              href={report.fileUrl}
                              download={report.fileName || true}
                              className="inline-flex items-center gap-2 rounded-lg bg-[#2457C5] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#17439F]"
                            >
                              <ArrowDownToLine size={15} />
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}

            {/* EMPTY STATE */}
            {!loading && !error && filteredReports.length === 0 && (
              <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-[#FCFAF7] px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <Search size={23} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#172033]">
                  {reports.length === 0
                    ? "No published reports yet"
                    : "No reports found"}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {reports.length === 0
                    ? "Reports will appear here once Lifeline Achham publishes documents through the admin panel."
                    : "Try changing your search or selecting a different category or year."}
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#55152B]"
                  >
                    <X size={15} />
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {!loading && !error && reports.length > 0 && (
              <p className="mt-8 text-center text-xs leading-6 text-slate-400">
                Showing {filteredReports.length} of {reports.length} published{" "}
                {reports.length === 1 ? "report" : "reports"}.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* REPORT TYPES */}
      <section className="section">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            className="text-center"
          >
            <div className="flex justify-center">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
                <span className="h-[3px] w-8 rounded-full bg-[#7A1F3D]" />
                Documentation
                <span className="h-[3px] w-8 rounded-full bg-[#7A1F3D]" />
              </div>
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              What you can find here
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              Browse published organizational documentation across these
              report categories.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            variants={staggerContainer}
            className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: FileBarChart,
                title: "Annual Reports",
                text: "Yearly organizational documentation and summaries.",
              },
              {
                icon: BarChart3,
                title: "Financial Reports",
                text: "Financial documentation and accountability records.",
              },
              {
                icon: BookOpen,
                title: "Program Reports",
                text: "Documentation related to programs and activities.",
              },
              {
                icon: FolderOpen,
                title: "Project Reports",
                text: "Project-level reports, learning and documentation.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="card card-hover p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-[#172033]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="pb-24">
        <div className="container-main">
          <div className="overflow-hidden rounded-[28px] bg-[#55152B]">
            <div className="relative px-7 py-12 sm:px-10 lg:px-14 lg:py-14">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
              <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10" />

              <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                    <span className="h-[3px] w-8 rounded-full bg-white/70" />
                    Transparency &amp; Accountability
                  </div>

                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Have a question about our reports?
                  </h2>

                  <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
                    Contact Lifeline Achham if you need information about
                    published documents or our organizational activities.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#55152B] transition hover:bg-[#F7E9EE]"
                >
                  Contact Us
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
