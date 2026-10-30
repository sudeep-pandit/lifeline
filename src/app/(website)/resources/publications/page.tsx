
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  Filter,
  FolderOpen,
  GraduationCap,
  LoaderCircle,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type PublicationCategoryKey =
  | "GUIDE_MANUAL"
  | "AWARENESS_MATERIAL"
  | "RESEARCH_LEARNING"
  | "PUBLICATION";

type PublicationCategory =
  | "Guides & Manuals"
  | "Awareness Materials"
  | "Research & Learning"
  | "Publications";

type ApiPublication = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: PublicationCategoryKey;
  status: "DRAFT" | "PUBLISHED";
  publicationYear: string | null;
  language: string | null;
  author: string | null;
  publisher: string | null;
  edition: string | null;
  isbn: string | null;
  pdfUrl: string;
  pdfName: string;
  pdfSize: number;
  coverImageUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Publication = {
  id: string;
  title: string;
  description: string;
  year: string;
  category: PublicationCategory;
  type: string;
  fileSize: string;
  fileUrl: string;
  language: string | null;
  author: string | null;
  isFeatured: boolean;
};

const categories = [
  "All",
  "Guides & Manuals",
  "Awareness Materials",
  "Research & Learning",
  "Publications",
] as const;

const categoryLabels: Record<
  PublicationCategoryKey,
  PublicationCategory
> = {
  GUIDE_MANUAL: "Guides & Manuals",
  AWARENESS_MATERIAL: "Awareness Materials",
  RESEARCH_LEARNING: "Research & Learning",
  PUBLICATION: "Publications",
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
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
  if (!Number.isFinite(bytes) || bytes <= 0) return "PDF";

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizePublication(
  item: ApiPublication,
): Publication {
  return {
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    year: item.publicationYear ?? "",
    category:
      categoryLabels[item.category] ?? "Publications",
    type: "PDF",
    fileSize: formatFileSize(item.pdfSize),
    fileUrl: item.pdfUrl,
    language: item.language,
    author: item.author,
    isFeatured: item.isFeatured,
  };
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<
    Publication[]
  >([]);
  const [activeCategory, setActiveCategory] =
    useState<string>("All");
  const [activeYear, setActiveYear] =
    useState<string>("All");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPublications() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "/api/publications/public",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load publications (HTTP ${response.status}).`,
          );
        }

        const data: unknown = await response.json();

        let records: ApiPublication[];

        if (Array.isArray(data)) {
          records = data as ApiPublication[];
        } else if (
          data !== null &&
          typeof data === "object" &&
          "publications" in data &&
          Array.isArray(data.publications)
        ) {
          records = data.publications as ApiPublication[];
        } else {
          throw new Error(
            "The publications API returned an unexpected response.",
          );
        }

        const normalized = records
        .filter(
          (item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.title === "string" &&
            typeof item.pdfUrl === "string",
        )
        .map(normalizePublication)
          .sort((a, b) => {
            if (a.isFeatured !== b.isFeatured) {
              return a.isFeatured ? -1 : 1;
            }

            return b.year.localeCompare(a.year);
          });

        setPublications(normalized);
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading publications.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadPublications();

    return () => controller.abort();
  }, []);

  const years = useMemo(() => {
    const availableYears = [
      ...new Set(
        publications
          .map((publication) => publication.year)
          .filter(Boolean),
      ),
    ].sort((a, b) => b.localeCompare(a));

    return ["All", ...availableYears];
  }, [publications]);

  const filteredPublications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return publications.filter((publication) => {
      const matchesCategory =
        activeCategory === "All" ||
        publication.category === activeCategory;

      const matchesYear =
        activeYear === "All" ||
        publication.year === activeYear;

      const matchesSearch =
        !query ||
        publication.title.toLowerCase().includes(query) ||
        publication.description.toLowerCase().includes(query) ||
        publication.category.toLowerCase().includes(query) ||
        (publication.author ?? "")
          .toLowerCase()
          .includes(query) ||
        (publication.language ?? "")
          .toLowerCase()
          .includes(query);

      return (
        matchesCategory &&
        matchesYear &&
        matchesSearch
      );
    });
  }, [
    publications,
    activeCategory,
    activeYear,
    search,
  ]);

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveYear("All");
    setSearch("");
  };

  const hasFilters =
    activeCategory !== "All" ||
    activeYear !== "All" ||
    search.trim() !== "";

  return (
    <main className="bg-[#FCFAF7]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[500px] sm:h-[540px] lg:h-[580px]">
          <Image
            src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=2200&q=90"
            alt="Lifeline Achham publications and learning resources"
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
                <span className="text-white">Publications</span>
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
                Publications &amp; Resources
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg"
              >
                Explore guides, awareness materials, learning resources
                and publications created to support knowledge sharing
                and community engagement.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTRO */}
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
                Knowledge &amp; Learning
              </div>

              <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
                Resources that help{" "}
                <span className="text-[#7A1F3D]">
                  ideas move forward.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                Publications can help communities, partners and
                stakeholders access practical knowledge, learning
                materials and organizational resources in one place.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <BookOpen size={22} className="text-[#2457C5]" />
                  <p className="mt-4 text-sm font-bold text-[#172033]">
                    Guides
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Practical resources
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <Sparkles size={22} className="text-[#7A1F3D]" />
                  <p className="mt-4 text-sm font-bold text-[#172033]">
                    Awareness
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Community materials
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <GraduationCap size={22} className="text-[#2457C5]" />
                  <p className="mt-4 text-sm font-bold text-[#172033]">
                    Learning
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Knowledge resources
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
                    src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1400&q=90"
                    alt="Learning and publication resources"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>

                <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                      <CheckCircle2 size={21} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#172033]">
                        Knowledge made accessible
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        A central space for useful public learning resources.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PUBLICATION LIBRARY */}
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
                  Resource Library
                </div>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                  Publications &amp; Materials
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                  Browse publications by category and year.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full bg-[#F7E9EE] px-4 py-2 text-xs font-bold text-[#7A1F3D] sm:flex">
                  <FolderOpen size={15} />
                  {filteredPublications.length} resources
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

            {/* SEARCH */}
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
                  placeholder="Search publications and resources..."
                  aria-label="Search publications"
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

            {/* FILTERS */}
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
                          {years.map((year) => {
                            const active = activeYear === year;

                            return (
                              <button
                                key={year}
                                type="button"
                                onClick={() => setActiveYear(year)}
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

            {/* RESULTS */}
            {loading ? (
              <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-[#FCFAF7] px-6 py-16 text-center">
                <LoaderCircle
                  size={30}
                  className="animate-spin text-[#2457C5]"
                />
                <h3 className="mt-5 text-lg font-bold text-[#172033]">
                  Loading publications
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Please wait while we load the resource library.
                </p>
              </div>
            ) : error ? (
              <div className="mt-10 rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center">
                <h3 className="text-lg font-bold text-[#172033]">
                  Unable to load publications
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-6 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#55152B]"
                >
                  Try again
                </button>
              </div>
            ) : filteredPublications.length > 0 ? (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.08 }}
                variants={staggerContainer}
                className="mt-10 grid gap-5 md:grid-cols-2"
              >
                {filteredPublications.map((publication) => (
                  <motion.article
                    key={publication.id}
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
                            {publication.category}
                          </span>

                          {publication.year && (
                            <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                              <CalendarDays size={13} />
                              {publication.year}
                            </span>
                          )}

                          {publication.isFeatured && (
                            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                              Featured
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 text-lg font-bold leading-7 text-[#172033] transition group-hover:text-[#7A1F3D]">
                          {publication.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {publication.description ||
                            "View this publication for more information."}
                        </p>

                        {(publication.author || publication.language) && (
                          <p className="mt-2 text-xs text-slate-500">
                            {publication.author && (
                              <span>By {publication.author}</span>
                            )}

                            {publication.author && publication.language && (
                              <span className="mx-2">·</span>
                            )}

                            {publication.language && (
                              <span>{publication.language}</span>
                            )}
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400">
                            <span>{publication.type}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>{publication.fileSize}</span>
                          </div>

                          <a
                            href={publication.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-2 rounded-lg bg-[#2457C5] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#17439F]"
                          >
                            <ArrowDownToLine size={15} />
                            Download PDF
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
                  {publications.length === 0
                    ? "No publications available yet"
                    : "No publications found"}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {publications.length === 0
                    ? "New resources will appear here once they are published by Lifeline Achham."
                    : "Try changing your search or selecting another category or year."}
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#55152B]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* RESOURCE TYPES */}
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
                Resource Types
                <span className="h-[3px] w-8 rounded-full bg-[#7A1F3D]" />
              </div>
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Explore our knowledge resources
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              A flexible library for practical knowledge, awareness and
              organizational learning.
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
                icon: BookOpen,
                title: "Guides & Manuals",
                text: "Practical resources for planning, implementation and community engagement.",
              },
              {
                icon: Sparkles,
                title: "Awareness Materials",
                text: "Materials designed to support accessible community awareness and communication.",
              },
              {
                icon: GraduationCap,
                title: "Research & Learning",
                text: "Learning resources, reflections and knowledge generated through activities.",
              },
              {
                icon: FolderOpen,
                title: "Publications",
                text: "Organizational publications and other useful public information resources.",
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

      {/* HOW RESOURCES HELP */}
      <section className="border-y border-slate-200 bg-white py-20 sm:py-24">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
              className="relative overflow-hidden rounded-[28px] bg-[#EEF4FF] p-8 sm:p-10"
            >
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#2457C5]/10" />
              <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-[#7A1F3D]/10" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#2457C5] shadow-sm">
                  <BookOpen size={25} />
                </div>

                <h3 className="mt-7 text-2xl font-bold tracking-tight text-[#172033]">
                  Knowledge should be easy to access.
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  A well-organized publication library helps people find
                  useful information without needing to search across
                  different channels.
                </p>

                <div className="mt-7 space-y-4">
                  {[
                    "Practical information",
                    "Community awareness",
                    "Organizational learning",
                    "Public knowledge sharing",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm font-medium text-[#172033]"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#2457C5]">
                        <CheckCircle2 size={15} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
                <span className="h-[3px] w-9 rounded-full bg-[#7A1F3D]" />
                Why Publications Matter
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Turning experience into shared learning.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600">
                Publications can preserve useful knowledge, communicate
                lessons and provide practical references for communities,
                partners and future activities.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  {
                    number: "01",
                    title: "Document",
                    text: "Capture useful knowledge, approaches and learning.",
                  },
                  {
                    number: "02",
                    title: "Share",
                    text: "Make relevant information easier for people to access.",
                  },
                  {
                    number: "03",
                    title: "Learn",
                    text: "Use documented experiences to improve future work.",
                  },
                ].map((item) => (
                  <div
                    key={item.number}
                    className="flex gap-5 rounded-2xl border border-slate-200 bg-[#FCFAF7] p-5"
                  >
                    <span className="text-sm font-black text-[#7A1F3D]">
                      {item.number}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#172033]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="section">
        <div className="container-main">
          <div className="overflow-hidden rounded-[28px] bg-[#55152B]">
            <div className="relative px-7 py-12 sm:px-10 lg:px-14 lg:py-14">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
              <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10" />

              <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                    <span className="h-[3px] w-8 rounded-full bg-white/70" />
                    Knowledge for Everyone
                  </div>

                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    A growing library of knowledge.
                  </h2>

                  <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
                    Explore resources shared by Lifeline Achham to support
                    community awareness, learning and access to useful
                    information.
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
