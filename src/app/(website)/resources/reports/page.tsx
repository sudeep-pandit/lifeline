"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FileBarChart,
  FileText,
  Filter,
  FolderOpen,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ReportCategory =
  | "Annual Reports"
  | "Financial Reports"
  | "Program Reports"
  | "Project Reports";

type Report = {
  id: string;
  title: string;
  description: string;
  year: string;
  category: ReportCategory;
  type: string;
  pages: string;
  fileSize: string;
  fileUrl: string;
};

const reports: Report[] = [
  {
    id: "01",
    title: "Annual Report 2026",
    description:
      "A structured overview of organizational activities, programs, achievements and key developments during the year.",
    year: "2026",
    category: "Annual Reports",
    type: "PDF",
    pages: "32 pages",
    fileSize: "2.4 MB",
    fileUrl: "#",
  },
  {
    id: "02",
    title: "Annual Report 2025",
    description:
      "Annual documentation covering organizational activities, community engagement and major areas of work.",
    year: "2025",
    category: "Annual Reports",
    type: "PDF",
    pages: "28 pages",
    fileSize: "2.1 MB",
    fileUrl: "#",
  },
  {
    id: "03",
    title: "Financial Report 2026",
    description:
      "Financial reporting document prepared to support responsible financial documentation and accountability.",
    year: "2026",
    category: "Financial Reports",
    type: "PDF",
    pages: "18 pages",
    fileSize: "1.8 MB",
    fileUrl: "#",
  },
  {
    id: "04",
    title: "Financial Report 2025",
    description:
      "Financial documentation covering the relevant reporting period and organizational financial activities.",
    year: "2025",
    category: "Financial Reports",
    type: "PDF",
    pages: "16 pages",
    fileSize: "1.6 MB",
    fileUrl: "#",
  },
  {
    id: "05",
    title: "Community Wellbeing Program Report",
    description:
      "Program-level documentation describing activities, implementation approach and learning from community wellbeing work.",
    year: "2026",
    category: "Program Reports",
    type: "PDF",
    pages: "24 pages",
    fileSize: "2.0 MB",
    fileUrl: "#",
  },
  {
    id: "06",
    title: "Youth Education Program Report",
    description:
      "A program report documenting youth-focused learning, participation and community engagement activities.",
    year: "2026",
    category: "Program Reports",
    type: "PDF",
    pages: "22 pages",
    fileSize: "1.9 MB",
    fileUrl: "#",
  },
  {
    id: "07",
    title: "Community Engagement Initiative Report",
    description:
      "Project documentation covering community engagement activities, implementation and key learning areas.",
    year: "2025",
    category: "Project Reports",
    type: "PDF",
    pages: "20 pages",
    fileSize: "1.7 MB",
    fileUrl: "#",
  },
  {
    id: "08",
    title: "Health Awareness Initiative Report",
    description:
      "Project-level reporting document for health awareness and community outreach activities.",
    year: "2025",
    category: "Project Reports",
    type: "PDF",
    pages: "21 pages",
    fileSize: "1.8 MB",
    fileUrl: "#",
  },
];

const categories = [
  "All",
  "Annual Reports",
  "Financial Reports",
  "Program Reports",
  "Project Reports",
];

const years = ["All", "2026", "2025"];

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
ease: [0.22, 1, 0.36, 1] as const,    },
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

export default function ReportsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeYear, setActiveYear] = useState("All");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
        report.category.toLowerCase().includes(query);

      return matchesCategory && matchesYear && matchesSearch;
    });
  }, [activeCategory, activeYear, search]);

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveYear("All");
    setSearch("");
  };

  const hasFilters =
    activeCategory !== "All" || activeYear !== "All" || search !== "";

  return (
    <main className="bg-[#FCFAF7]">
      {/* =====================================================
          HERO
      ====================================================== */}

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

          {/* Abstract shapes */}
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full border border-white/10" />

          <div className="absolute right-[18%] top-24 h-20 w-20 rotate-12 rounded-2xl border border-white/10" />

          <div className="absolute bottom-24 left-[32%] h-2 w-2 rounded-full bg-white/30" />
          <div className="absolute right-[30%] top-28 h-1.5 w-1.5 rounded-full bg-white/30" />

          {/* Hero content */}
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
                <Link
                  href="/"
                  className="transition hover:text-white"
                >
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
                Reports & Documentation
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg"
              >
                Explore organizational reports, financial documentation,
                program reports and project records that support transparency
                and responsible information sharing.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}

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
                <span className="text-[#7A1F3D]">
                  accountability.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                Reports provide a structured way to document activities,
                progress, learning and organizational information. This
                section is designed to make important documents easier for
                communities, partners and stakeholders to access.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <FileBarChart
                    size={22}
                    className="text-[#2457C5]"
                  />
                  <p className="mt-4 text-sm font-bold text-[#172033]">
                    Annual
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Organizational reporting
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <BarChart3
                    size={22}
                    className="text-[#7A1F3D]"
                  />
                  <p className="mt-4 text-sm font-bold text-[#172033]">
                    Financial
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Financial documentation
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <BookOpen
                    size={22}
                    className="text-[#2457C5]"
                  />
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
                        A central place for approved organizational
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

      {/* =====================================================
          REPORT LIBRARY
      ====================================================== */}

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
                  Reports & Documents
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                  Browse available reports by category and reporting year.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full bg-[#F7E9EE] px-4 py-2 text-xs font-bold text-[#7A1F3D] sm:flex">
                  <FolderOpen size={15} />
                  {filteredReports.length} documents
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilters((value) => !value)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#172033] transition hover:border-[#2457C5]/30 hover:bg-[#EEF4FF] hover:text-[#2457C5]"
                >
                  <Filter size={17} />
                  Filters
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mt-8 flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search reports and documents..."
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

            {/* Filters */}
            <AnimatePresence initial={false}>
              {showFilters && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
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
                            const active =
                              activeCategory === category;

                            return (
                              <button
                                key={category}
                                type="button"
                                onClick={() =>
                                  setActiveCategory(category)
                                }
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
                          {years.map((year) => {
                            const active = activeYear === year;

                            return (
                              <button
                                key={year}
                                type="button"
                                onClick={() =>
                                  setActiveYear(year)
                                }
                                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                                  active
                                    ? "bg-[#2457C5] text-white"
                                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#2457C5]/30 hover:text-[#2457C5]"
                                }`}
                              >
                                {year}
                              </button>
                            );
                          })}
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

            {/* Results */}
            {filteredReports.length > 0 ? (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.08 }}
                variants={staggerContainer}
                className="mt-10 grid gap-5 md:grid-cols-2"
              >
                {filteredReports.map((report) => (
                  <motion.article
                    key={report.id}
                    variants={fadeUp}
                    className="group rounded-[22px] border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/20 hover:shadow-xl"
                  >
                    <div className="flex gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F7E9EE] text-[#7A1F3D]">
                        <FileText size={25} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#2457C5]">
                            {report.category}
                          </span>

                          <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                            <CalendarDays size={13} />
                            {report.year}
                          </span>
                        </div>

                        <h3 className="mt-3 text-lg font-bold leading-7 text-[#172033] transition group-hover:text-[#7A1F3D]">
                          {report.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {report.description}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400">
                            <span>{report.type}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>{report.pages}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>{report.fileSize}</span>
                          </div>

                          <a
                            href={report.fileUrl}
                            download
                            className="inline-flex items-center gap-2 rounded-lg bg-[#2457C5] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#17439F]"
                          >
                            <ArrowDownToLine size={15} />
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            ) : (
              <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-[#FCFAF7] px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <Search size={23} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#172033]">
                  No reports found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try changing your search or selecting a different category
                  or year.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#55152B]"
                >
                  Clear filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          REPORT TYPES
      ====================================================== */}

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
              The reports library can grow with the organization and provide
              a central place for important public documentation.
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

      {/* =====================================================
          CMS NOTE
      ====================================================== */}

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
                    Future-ready
                  </div>

                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    A central library for organizational knowledge.
                  </h2>

                  <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
                    Once the custom admin system is connected, authorized
                    administrators will be able to upload reports, assign
                    categories and years, update descriptions and publish or
                    unpublish documents without changing the website code.
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
