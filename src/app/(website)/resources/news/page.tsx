
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  LoaderCircle,
  Megaphone,
  Search,
  Tag,
} from "lucide-react";

type NewsCategory = "All" | "News" | "Notice" | "Announcement" | "Updates";

type ApiNewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  status?: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  isFeatured?: boolean;
  location?: string | null;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Exclude<NewsCategory, "All">;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  featured: boolean;
};

const categories: NewsCategory[] = [
  "All",
  "News",
  "Notice",
  "Announcement",
  "Updates",
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1400&q=85";

const categoryLabels: Record<string, Exclude<NewsCategory, "All">> = {
  NEWS: "News",
  NOTICE: "Notice",
  ANNOUNCEMENT: "Announcement",
  UPDATES: "Updates",
  News: "News",
  Notice: "Notice",
  Announcement: "Announcement",
  Updates: "Updates",
};

function formatDate(value?: string | null): string {
  if (!value) return "Recently published";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently published";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function estimateReadTime(content?: string): string {
  if (!content) return "1 min read";

  const plainText = content
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

  const words = plainText ? plainText.split(/\s+/).length : 0;

  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function mapArticle(article: ApiNewsArticle): NewsItem | null {
  const category = categoryLabels[article.category];

  if (!category || !article.slug || !article.title) {
    return null;
  }

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt || "",
    content: article.content || "",
    category,
    date: formatDate(article.publishedAt || article.createdAt),
    readTime: estimateReadTime(article.content),
    image: article.imageUrl || FALLBACK_IMAGE,
    imageAlt: article.imageAlt || article.title,
    featured: Boolean(article.isFeatured),
  };
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] =
    useState<NewsCategory>("All");

  const [search, setSearch] = useState("");
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNews = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/news/public", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
        signal,
      });

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "The public news API route was not found."
            : "Unable to load news articles. Please try again.",
        );
      }

      const data: unknown = await response.json();

      if (
        !data ||
        typeof data !== "object" ||
        !("articles" in data) ||
        !Array.isArray(data.articles)
      ) {
        throw new Error("The news API returned an unexpected response.");
      }

      const articles = (data.articles as ApiNewsArticle[])
        .map(mapArticle)
        .filter((article): article is NewsItem => article !== null);

      setNewsItems(articles);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading news.",
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void loadNews(controller.signal);

    return () => controller.abort();
  }, [loadNews]);

  const featured = useMemo(
    () => newsItems.find((item) => item.featured),
    [newsItems],
  );

  const filteredNews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return newsItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" ||
        item.category === activeCategory;

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [newsItems, activeCategory, search]);

  const showFeatured =
    Boolean(featured) &&
    activeCategory === "All" &&
    !search.trim() &&
    !loading &&
    !error;

  const regularNews = filteredNews.filter(
    (item) => !showFeatured || item.id !== featured?.id,
  );

  return (
    <main className="bg-[#FCFAF7]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[500px] sm:h-[540px] lg:h-[580px]">
          <Image
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2200&q=90"
            alt="Lifeline Achham news and community updates"
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-[#55152B]/78" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#7A1F3D]/65 to-[#2457C5]/20" />

          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="absolute right-[18%] top-24 h-20 w-20 rotate-12 rounded-2xl border border-white/10" />
          <div className="absolute bottom-24 left-[32%] h-2 w-2 rounded-full bg-white/30" />
          <div className="absolute right-[30%] top-28 h-1.5 w-1.5 rounded-full bg-white/30" />

          <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 pt-28 sm:px-8 lg:px-10">
            <div className="max-w-3xl text-white">
              <div className="mb-7 flex flex-wrap items-center gap-2 text-sm">
                <Link
                  href="/"
                  className="text-white/60 transition hover:text-white"
                >
                  Home
                </Link>

                <ChevronRight size={15} className="text-white/40" />

                <Link
                  href="/resources/news"
                  className="text-white/60 transition hover:text-white"
                >
                  Resources
                </Link>

                <ChevronRight size={15} className="text-white/40" />

                <span className="font-medium text-white">
                  News & Notices
                </span>
              </div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm">
                <Bell size={14} />
                News & Notices
              </div>

              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Stay informed.
                <span className="block text-white/70">
                  Stay connected.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                Explore updates, notices, announcements and stories
                from Lifeline Achham and its community-focused activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH AND FILTERS */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => {
                const active = category === activeCategory;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={active}
                    className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-[#2457C5] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-[#EEF4FF] hover:text-[#2457C5]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search news & notices..."
                aria-label="Search news and notices"
                className="h-11 w-full rounded-xl border border-slate-200 bg-[#FCFAF7] pl-11 pr-4 text-sm text-[#172033] outline-none transition placeholder:text-slate-400 focus:border-[#2457C5] focus:bg-white focus:ring-4 focus:ring-[#2457C5]/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      {showFeatured && featured && (
        <section className="section">
          <div className="container-main">
            <div className="mb-10">
              <SectionLabel>Featured Update</SectionLabel>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Latest from Lifeline Achham
              </h2>
            </div>

            <Link
              href={`/resources/news/${featured.slug}`}
              className="group grid overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl lg:grid-cols-2"
            >
              <div className="relative min-h-[330px] overflow-hidden sm:min-h-[430px]">
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/50 via-transparent to-transparent" />

                <div className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#7A1F3D] shadow-lg">
                  Featured
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                  <span className="rounded-full bg-[#F7E9EE] px-3 py-1.5 text-[#7A1F3D]">
                    {featured.category}
                  </span>

                  <span className="flex items-center gap-1.5 text-slate-400">
                    <CalendarDays size={13} />
                    {featured.date}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold leading-tight text-[#172033] transition group-hover:text-[#7A1F3D] sm:text-3xl">
                  {featured.title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                  {featured.excerpt}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                  <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Clock3 size={14} />
                    {featured.readTime}
                  </span>

                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]">
                    Read update
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* NEWS DIRECTORY */}
      <section className="section pt-0">
        <div className="container-main">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>
                {activeCategory === "All" ? "All Updates" : activeCategory}
              </SectionLabel>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                News, notices & announcements
              </h2>
            </div>

            {!loading && !error && (
              <p className="text-sm text-slate-500" aria-live="polite">
                {filteredNews.length}{" "}
                {filteredNews.length === 1 ? "item" : "items"}
              </p>
            )}
          </div>

          {loading ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center">
              <LoaderCircle
                size={34}
                className="animate-spin text-[#2457C5]"
              />
              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading news and notices...
              </p>
            </div>
          ) : error ? (
            <div className="mt-10 rounded-3xl border border-red-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <FileText size={22} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#172033]">
                We couldn&apos;t load the news
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void loadNews()}
                className="btn-primary mt-6"
              >
                Try Again
              </button>
            </div>
          ) : regularNews.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#2457C5]">
                <Search size={22} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#172033]">
                {newsItems.length === 0
                  ? "No published updates yet"
                  : "No updates found"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                {newsItems.length === 0
                  ? "Published news and notices from Lifeline Achham will appear here."
                  : "Try another search term or choose a different category."}
              </p>

              {(search || activeCategory !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                  }}
                  className="btn-primary mt-6"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* STAY CONNECTED */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <SectionLabel>Stay Connected</SectionLabel>

              <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#172033] sm:text-4xl">
                Keep up with community-focused activities.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                Visit this space for organizational news, public notices,
                campaign updates, announcements and other useful information.
              </p>
            </div>

            <div className="rounded-3xl bg-[#F7E9EE] p-7 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7A1F3D] text-white">
                <Megaphone size={21} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#172033]">
                Have a question?
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Contact Lifeline Achham for more information about activities,
                announcements or opportunities to get involved.
              </p>

              <Link href="/contact" className="btn-burgundy mt-6">
                Contact Us
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RESOURCES CTA */}
      <section className="section-sm">
        <div className="container-main">
          <div className="relative overflow-hidden rounded-[30px] bg-[#172033] px-7 py-14 text-white sm:px-10 sm:py-16 lg:px-16">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-[#2457C5]/20" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/65">
                  <FileText size={14} />
                  Resources
                </div>

                <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                  Explore more resources from Lifeline Achham.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
                  Browse reports, publications and community stories to learn
                  more about the organization and its work.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href="/resources/reports"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#172033] transition hover:-translate-y-0.5 hover:bg-[#FCFAF7]"
                >
                  View Reports
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/resources/publications"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Publications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/resources/news/${item.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/20 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          unoptimized
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/40 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#7A1F3D] shadow-sm backdrop-blur-sm">
          <Tag size={12} />
          {item.category}
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} />
            {item.date}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 size={13} />
            {item.readTime}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold leading-7 text-[#172033] transition group-hover:text-[#7A1F3D]">
          {item.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
          {item.excerpt}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <span className="text-sm font-bold text-[#2457C5]">
            Read more
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2457C5] transition group-hover:bg-[#2457C5] group-hover:text-white">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
      <span className="h-[3px] w-8 rounded-full bg-[#7A1F3D]" />
      {children}
    </div>
  );
}
