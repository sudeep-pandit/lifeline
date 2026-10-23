
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
  FileText,
  Images,
  MapPin,
  Tag,
} from "lucide-react";

import ShareCampaignButton from "@/components/website/ShareCampaignButton";

type NewsCategory = "News" | "Notice" | "Announcement" | "Updates";

type NewsArticle = {
  slug: string;
  title: string;
  category: NewsCategory;
  date: string;
  readTime: string;
  location: string;
  summary: string;
  content: string[];
  image: string;
  highlights: string[];
  gallery: string[];
  resources: {
    title: string;
    type: string;
  }[];
};

const articles: Record<string, NewsArticle> = {
  "community-engagement-update": {
    slug: "community-engagement-update",
    title: "Community Engagement Initiative Update",
    category: "Updates",
    date: "October 2026",
    readTime: "4 min read",
    location: "Achham, Nepal",
    summary:
      "An overview of recent community engagement activities, discussions and opportunities for participation.",
    content: [
      "Community participation is an important part of creating meaningful and sustainable local initiatives. Through community-focused activities, people have opportunities to share ideas, discuss priorities and contribute to practical action.",
      "The Community Engagement Initiative provides a flexible framework for connecting with community members and creating opportunities for dialogue. Activities can include discussions, awareness sessions, outreach and collaborative community activities.",
      "The initiative also places importance on listening and learning. Feedback from participants can help shape future activities and ensure that community engagement remains relevant to local priorities.",
      "Lifeline Achham aims to continue creating spaces where community members, volunteers and local groups can participate and contribute in meaningful ways.",
    ],
    image:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=2000&q=90",
    highlights: [
      "Community-focused discussions and engagement",
      "Opportunities for local participation",
      "Information sharing and awareness",
      "Feedback and community learning",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85",
    ],
    resources: [
      {
        title: "Community Engagement Overview",
        type: "Document",
      },
      {
        title: "Community Participation Materials",
        type: "Publication",
      },
    ],
  },

  "health-awareness-notice": {
    slug: "health-awareness-notice",
    title: "Health Awareness Program Notice",
    category: "Notice",
    date: "October 2026",
    readTime: "3 min read",
    location: "Achham, Nepal",
    summary:
      "Information about upcoming awareness activities and ways community members can participate.",
    content: [
      "Health awareness and access to useful information can play an important role in strengthening community wellbeing. Awareness activities provide opportunities for people to learn, ask questions and discuss issues relevant to their communities.",
      "The Health Awareness Program is designed as a community-focused initiative where information can be shared in an accessible and responsible way.",
      "Community members, volunteers and relevant local stakeholders can participate in activities according to the specific arrangements and schedules of each campaign or program.",
      "For updated information about participation or upcoming activities, please contact Lifeline Achham directly.",
    ],
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=2000&q=90",
    highlights: [
      "Community health awareness",
      "Responsible information sharing",
      "Community participation",
      "Health-focused discussions",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1400&q=85",
    ],
    resources: [
      {
        title: "Health Awareness Information",
        type: "Document",
      },
      {
        title: "Program Materials",
        type: "Publication",
      },
    ],
  },

  "youth-participation-update": {
    slug: "youth-participation-update",
    title: "Youth Participation & Community Activities",
    category: "News",
    date: "September 2026",
    readTime: "5 min read",
    location: "Achham, Nepal",
    summary:
      "A look at opportunities for young people to contribute ideas, participate and support local activities.",
    content: [
      "Young people can play an important role in community development through ideas, creativity, participation and volunteerism. Creating meaningful opportunities for youth engagement can help communities benefit from their perspectives and energy.",
      "The Youth Participation Initiative provides a framework for encouraging young people to participate in discussions, learning activities and community-focused initiatives.",
      "Participation can take different forms, including volunteering, sharing ideas, supporting awareness activities and contributing to community projects.",
      "The initiative is designed to remain flexible so that youth participation can respond to local interests and opportunities.",
    ],
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=90",
    highlights: [
      "Youth participation opportunities",
      "Youth-led ideas and activities",
      "Community volunteering",
      "Learning and knowledge sharing",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=85",
    ],
    resources: [
      {
        title: "Youth Participation Overview",
        type: "Document",
      },
      {
        title: "Youth Engagement Materials",
        type: "Publication",
      },
    ],
  },

  "community-campaign-announcement": {
    slug: "community-campaign-announcement",
    title: "Community Campaign Announcement",
    category: "Announcement",
    date: "September 2026",
    readTime: "3 min read",
    location: "Achham, Nepal",
    summary:
      "Details about a new community-focused campaign and how individuals and groups can get involved.",
    content: [
      "Lifeline Achham is preparing a community-focused campaign framework designed to encourage awareness, participation and practical local action.",
      "The campaign approach brings together community members, volunteers and relevant groups around shared priorities and opportunities for meaningful participation.",
      "Activities may include community discussions, awareness sessions, outreach and collaborative activities depending on the campaign focus.",
      "Further information about specific activities and participation opportunities can be shared through official Lifeline Achham communication channels.",
    ],
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2000&q=90",
    highlights: [
      "Community awareness",
      "Participation opportunities",
      "Volunteer engagement",
      "Local collaboration",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=85",
    ],
    resources: [
      {
        title: "Campaign Announcement",
        type: "Document",
      },
      {
        title: "Participation Information",
        type: "Publication",
      },
    ],
  },

  "volunteer-engagement-update": {
    slug: "volunteer-engagement-update",
    title: "Volunteer Engagement Update",
    category: "Updates",
    date: "August 2026",
    readTime: "4 min read",
    location: "Achham, Nepal",
    summary:
      "An update on volunteer participation and opportunities to contribute to community-focused activities.",
    content: [
      "Volunteers can make an important contribution to community-focused work by sharing their time, skills, ideas and energy.",
      "Volunteer engagement can support a wide range of activities, from awareness and outreach to community events and organizational support.",
      "Lifeline Achham aims to create meaningful opportunities for people who want to contribute to community initiatives while ensuring that participation remains organized and purposeful.",
      "People interested in learning more about volunteer opportunities can contact the organization for further information.",
    ],
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=2000&q=90",
    highlights: [
      "Volunteer participation",
      "Community outreach",
      "Skills and knowledge sharing",
      "Meaningful local contribution",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=85",
    ],
    resources: [
      {
        title: "Volunteer Information",
        type: "Document",
      },
      {
        title: "Volunteer Participation Guide",
        type: "Publication",
      },
    ],
  },

  "community-information-notice": {
    slug: "community-information-notice",
    title: "Community Information Notice",
    category: "Notice",
    date: "August 2026",
    readTime: "2 min read",
    location: "Achham, Nepal",
    summary:
      "Important information and resources for community members, volunteers and local stakeholders.",
    content: [
      "This notice provides a general space for sharing important information with community members, volunteers and other stakeholders.",
      "Community information may include upcoming activities, participation opportunities, organizational updates and other relevant announcements.",
      "People are encouraged to follow official Lifeline Achham communication channels for the latest information.",
    ],
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=90",
    highlights: [
      "Community information",
      "Upcoming activities",
      "Participation opportunities",
      "Organizational announcements",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=85",
    ],
    resources: [
      {
        title: "Community Information",
        type: "Document",
      },
    ],
  },

  "local-collaboration-update": {
    slug: "local-collaboration-update",
    title: "Local Collaboration & Partnership Update",
    category: "News",
    date: "July 2026",
    readTime: "4 min read",
    location: "Achham, Nepal",
    summary:
      "A general update on collaboration, coordination and opportunities for meaningful community action.",
    content: [
      "Collaboration can help organizations and communities combine ideas, knowledge and resources around shared priorities.",
      "Local collaboration provides opportunities for different groups and stakeholders to communicate, coordinate and identify practical ways to contribute.",
      "Lifeline Achham aims to support constructive collaboration around community-focused activities while maintaining clear communication and responsible coordination.",
    ],
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2000&q=90",
    highlights: [
      "Local collaboration",
      "Community coordination",
      "Knowledge sharing",
      "Shared action",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=85",
    ],
    resources: [
      {
        title: "Collaboration Overview",
        type: "Document",
      },
      {
        title: "Community Partnership Information",
        type: "Publication",
      },
    ],
  },

  "upcoming-community-activities": {
    slug: "upcoming-community-activities",
    title: "Upcoming Community Activities",
    category: "Announcement",
    date: "July 2026",
    readTime: "3 min read",
    location: "Achham, Nepal",
    summary:
      "A summary of upcoming activities and ways community members can stay informed and participate.",
    content: [
      "Community activities provide opportunities for people to connect, learn, contribute and work together around shared interests and priorities.",
      "Upcoming activities may include awareness sessions, discussions, community outreach, volunteer activities and other locally relevant initiatives.",
      "Specific schedules and participation information can be shared through official organizational communication channels as activities are confirmed.",
    ],
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=2000&q=90",
    highlights: [
      "Upcoming community activities",
      "Community participation",
      "Volunteer opportunities",
      "Local engagement",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85",
    ],
    resources: [
      {
        title: "Community Activities Information",
        type: "Document",
      },
    ],
  },
};

function getCategoryClasses(category: NewsCategory) {
  switch (category) {
    case "Notice":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "Announcement":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Updates":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    default:
      return "bg-[#F7E9EE] text-[#7A1F3D] border-[#E7C7D1]";
  }
}

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    return {
      title: "News Not Found",
    };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function NewsDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    notFound();
  }

  const relatedArticles = Object.values(articles)
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  return (
    <main className="bg-[#FCFAF7]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#55152B] text-white">
        <div className="absolute inset-0">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-[#55152B]/80" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B] via-[#55152B]/75 to-[#2457C5]/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="max-w-4xl">
            {/* BREADCRUMB */}
            <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/65">
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
                News & Notices
              </Link>

              <span>/</span>

              <span className="text-white/90">
                {article.title}
              </span>
            </div>

            {/* CATEGORY */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.13em] ${getCategoryClasses(
                  article.category,
                )}`}
              >
                {article.category}
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">
              {article.summary}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ArticleMeta
                icon={CalendarDays}
                label={article.date}
              />

              <ArticleMeta
                icon={Clock3}
                label={article.readTime}
              />

              <ArticleMeta
                icon={MapPin}
                label={article.location}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ACTION BAR
      ========================================================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <Link
            href="/resources/news"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2457C5] transition hover:text-[#17439F]"
          >
            <ArrowLeft size={16} />
            Back to News & Notices
          </Link>

          <ShareCampaignButton
            title={article.title}
            text={article.summary}
          />
        </div>
      </section>

      {/* =========================================================
          ARTICLE
      ========================================================= */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            {/* MAIN ARTICLE */}
            <article>
              <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
                <div className="relative aspect-[16/8.5]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 70vw"
                  />
                </div>

                <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
                  <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-6 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {article.date}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={14} />
                      {article.readTime}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Tag size={14} />
                      {article.category}
                    </span>
                  </div>

                  <div className="prose prose-slate mt-8 max-w-none">
                    {article.content.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mb-6 text-base leading-8 text-slate-600 last:mb-0"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* SIDEBAR */}
            <aside className="space-y-5 lg:sticky lg:top-28">
              {/* HIGHLIGHTS */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                    <CheckCircle2 size={18} />
                  </div>

                  <h2 className="font-bold text-[#172033]">
                    Key Highlights
                  </h2>
                </div>

                <div className="mt-6 space-y-4">
                  {article.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7A1F3D]" />

                      <p className="text-sm leading-6 text-slate-600">
                        {highlight}
                      </p>
                    </div>
                  ))}
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

      {/* =========================================================
          GALLERY
      ========================================================= */}
      <section className="section bg-white">
        <div className="container-main">
          <div>
            <SectionLabel>Related Media</SectionLabel>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Images & moments
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {article.gallery.map((image, index) => (
              <div
                key={image}
                className={`group relative overflow-hidden rounded-2xl ${
                  index === 0
                    ? "md:row-span-2 md:min-h-[500px]"
                    : "min-h-[240px]"
                }`}
              >
                <Image
                  src={image}
                  alt={`${article.title} image ${index + 1}`}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/50 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                  <Images size={14} />
                  Related media
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          RESOURCES
      ========================================================= */}
      {article.resources.length > 0 && (
        <section className="section">
          <div className="container-main">
            <div className="max-w-3xl">
              <SectionLabel>Resources</SectionLabel>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Related documents
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Additional documents and materials can be connected here
                through the Lifeline Achham CMS.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {article.resources.map((resource) => (
                <div
                  key={resource.title}
                  className="flex items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                      <FileText size={19} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-[#172033]">
                        {resource.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {resource.type}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="shrink-0 text-sm font-bold text-[#2457C5] transition hover:text-[#17439F]"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          RELATED NEWS
      ========================================================= */}
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
            {relatedArticles.map((item) => (
              <Link
                key={item.slug}
                href={`/resources/news/${item.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#7A1F3D]">
                    {item.category}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CalendarDays size={13} />
                    {item.date}
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-base font-bold leading-6 text-[#172033] transition group-hover:text-[#7A1F3D]">
                    {item.title}
                  </h3>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]">
                    Read more
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
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
