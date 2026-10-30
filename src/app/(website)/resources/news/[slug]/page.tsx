import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Tag,
} from "lucide-react";

import ShareCampaignButton from "@/components/website/ShareCampaignButton";
import { prisma } from "@/lib/prisma";

const SITE_NAME = "Lifeline Achham";
const DEFAULT_LOCATION = "Achham, Nepal";

const categoryLabels: Record<string, string> = {
  NEWS: "News",
  NOTICE: "Notice",
  ANNOUNCEMENT: "Announcement",
  UPDATES: "Updates",
};

const categoryStyles: Record<string, string> = {
  NOTICE: "bg-blue-50 text-blue-700 border-blue-200",
  ANNOUNCEMENT: "bg-amber-50 text-amber-700 border-amber-200",
  UPDATES: "bg-emerald-50 text-emerald-700 border-emerald-200",
  NEWS: "bg-[#F7E9EE] text-[#7A1F3D] border-[#E7C7D1]",
};

function getCategoryLabel(category: string) {
  return categoryLabels[category] ?? category;
}

function getCategoryClasses(category: string) {
  return (
    categoryStyles[category] ??
    "bg-[#F7E9EE] text-[#7A1F3D] border-[#E7C7D1]"
  );
}

function formatArticleDate(date: Date | null) {
  if (!date) return "Recently published";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function estimateReadTime(content: string) {
  const plainText = content.replace(/<[^>]*>/g, " ");
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return `${minutes} min read`;
}

function getPublishedDate(article: {
  publishedAt: Date | null;
  createdAt: Date;
}) {
  return article.publishedAt ?? article.createdAt;
}

/**
 * Returns only published articles that are not scheduled for the future.
 * Articles with no publishedAt date are allowed when their status is PUBLISHED.
 */
async function getPublishedArticle(slug: string) {
  return prisma.newsArticle.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      OR: [
        { publishedAt: null },
        { publishedAt: { lte: new Date() } },
      ],
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);

  if (!article) {
    return {
      title: "News Not Found",
      description: "This news article could not be found.",
    };
  }

  return {
    title: article.seoTitle?.trim() || article.title,
    description:
      article.seoDescription?.trim() || article.excerpt,
    openGraph: {
      title: article.seoTitle?.trim() || article.title,
      description:
        article.seoDescription?.trim() || article.excerpt,
      type: "article",
      ...(article.imageUrl
        ? {
            images: [
              {
                url: article.imageUrl,
                alt: article.imageAlt || article.title,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function NewsDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getPublishedArticle(slug);

  if (!article) {
    notFound();
  }

  const publishedDate = getPublishedDate(article);
  const dateLabel = formatArticleDate(publishedDate);
  const categoryLabel = getCategoryLabel(article.category);
  const readTime = estimateReadTime(article.content);
  const location = article.location?.trim() || DEFAULT_LOCATION;

  const relatedArticles = await prisma.newsArticle.findMany({
    where: {
      status: "PUBLISHED",
      slug: { not: article.slug },
      OR: [
        { publishedAt: null },
        { publishedAt: { lte: new Date() } },
      ],
    },
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      imageUrl: true,
      imageAlt: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  const heroImage = article.imageUrl?.trim() || null;
  const heroAlt = article.imageAlt?.trim() || article.title;

  return (
    <main className="bg-[#FCFAF7]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#55152B] text-white">
        {heroImage && (
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt={heroAlt}
              fill
              priority
              unoptimized
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-[#55152B]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#55152B] via-[#55152B]/75 to-[#2457C5]/30" />

        <div className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="max-w-4xl">
            {/* BREADCRUMB */}
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/65"
            >
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>

              <span aria-hidden="true">/</span>

              <Link
                href="/resources/news"
                className="transition hover:text-white"
              >
                News &amp; Notices
              </Link>

              <span aria-hidden="true">/</span>

              <span className="text-white/90">{article.title}</span>
            </nav>

            {/* CATEGORY */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.13em] ${getCategoryClasses(article.category)}`}
              >
                {categoryLabel}
              </span>

              {article.isFeatured && (
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white">
                  Featured story
                </span>
              )}
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-7 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">
                {article.excerpt}
              </p>
            )}

            <div className="mt-9 flex flex-wrap gap-3">
              <ArticleMeta icon={CalendarDays} label={dateLabel} />
              <ArticleMeta icon={Clock3} label={readTime} />
              <ArticleMeta icon={MapPin} label={location} />
            </div>
          </div>
        </div>
      </section>

      {/* ACTION BAR */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <Link
            href="/resources/news"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2457C5] transition hover:text-[#17439F]"
          >
            <ArrowLeft size={16} />
            Back to News &amp; Notices
          </Link>

          <ShareCampaignButton
            title={article.title}
            text={article.excerpt}
          />
        </div>
      </section>

      {/* ARTICLE */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            {/* MAIN CONTENT */}
            <article>
              <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
                {heroImage && (
                  <div className="relative aspect-[16/8.5]">
                    <Image
                      src={heroImage}
                      alt={heroAlt}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 70vw"
                    />
                  </div>
                )}

                <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
                  <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-6 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {dateLabel}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={14} />
                      {readTime}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Tag size={14} />
                      {categoryLabel}
                    </span>
                  </div>

                  {/*
                    This assumes `content` contains HTML generated by your
                    admin rich-text editor. Sanitize HTML on the server before
                    storing or rendering it. Do not allow untrusted HTML here.
                  */}
                  <div
                    className="prose prose-slate mt-8 max-w-none
                      prose-headings:font-bold
                      prose-headings:text-[#172033]
                      prose-a:text-[#2457C5]
                      prose-strong:text-[#172033]
                      prose-blockquote:border-[#7A1F3D]
                      prose-li:marker:text-[#7A1F3D]
                      prose-p:text-base
                      prose-p:leading-8
                      prose-p:text-slate-600"
                    dangerouslySetInnerHTML={{
                      __html: article.content,
                    }}
                  />
                </div>
              </div>
            </article>

            {/* SIDEBAR */}
            <aside className="space-y-5 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                    <CheckCircle2 size={18} />
                  </div>

                  <h2 className="font-bold text-[#172033]">
                    About this story
                  </h2>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-600">
                  {article.excerpt}
                </p>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                  <div className="flex items-start gap-3 text-sm">
                    <Tag
                      size={16}
                      className="mt-0.5 shrink-0 text-[#7A1F3D]"
                    />
                    <div>
                      <p className="text-xs text-slate-400">Category</p>
                      <p className="mt-1 font-semibold text-[#172033]">
                        {categoryLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-[#7A1F3D]"
                    />
                    <div>
                      <p className="text-xs text-slate-400">Location</p>
                      <p className="mt-1 font-semibold text-[#172033]">
                        {location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTACT */}
              <div className="rounded-3xl bg-[#F7E9EE] p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A1F3D] text-white">
                  <MapPin size={18} />
                </div>

                <h2 className="mt-5 font-bold text-[#172033]">
                  Want to know more?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Contact Lifeline Achham for additional information about
                  this update or related activities.
                </p>

                <Link
                  href="/contact"
                  className="btn-burgundy mt-5 w-full"
                >
                  Contact Us
                  <ArrowRight size={15} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* RELATED NEWS */}
      {relatedArticles.length > 0 && (
        <section className="section bg-white">
          <div className="container-main">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel>More Updates</SectionLabel>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                  You may also like
                </h2>
              </div>

              <Link
                href="/resources/news"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#2457C5] transition hover:text-[#17439F]"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {relatedArticles.map((item) => {
                const itemDate = formatArticleDate(
                  getPublishedDate(item),
                );

                return (
                  <Link
                    key={item.id}
                    href={`/resources/news/${item.slug}`}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#F7E9EE]">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.imageAlt || item.title}
                          fill
                          unoptimized
                          className="object-cover transition duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#F7E9EE] to-[#EEF4FF]">
                          <span className="text-4xl font-bold text-[#7A1F3D]/30">
                            LA
                          </span>
                        </div>
                      )}

                      <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#7A1F3D]">
                        {getCategoryLabel(item.category)}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CalendarDays size={13} />
                        {itemDate}
                      </div>

                      <h3 className="mt-3 line-clamp-2 text-base font-bold leading-6 text-[#172033] transition group-hover:text-[#7A1F3D]">
                        {item.title}
                      </h3>

                      {item.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {item.excerpt}
                        </p>
                      )}

                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]">
                        Read more
                        <ArrowUpRight size={15} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-sm">
        <div className="container-main">
          <div className="relative overflow-hidden rounded-[30px] bg-[#55152B] px-7 py-14 text-white sm:px-10 sm:py-16 lg:px-16">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                  Lifeline Achham
                </span>

                <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                  Stay connected with our work.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                  Explore our programs, campaigns, resources and opportunities
                  to participate.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href="/work"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#55152B] transition hover:-translate-y-0.5 hover:bg-[#FCFAF7]"
                >
                  Explore Our Work
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
      <span className="h-[3px] w-8 rounded-full bg-[#7A1F3D]" />
      {children}
    </div>
  );
}

function ArticleMeta({
  icon: Icon,
  label,
}: {
  icon: typeof CalendarDays;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white/85 backdrop-blur-md">
      <Icon size={15} />
      {label}
    </div>
  );
}