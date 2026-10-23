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
  Download,
  FileText,
  Heart,
  HeartHandshake,
  Images,
  MapPin,
  Megaphone,
  Target,
  Users,
} from "lucide-react";

import ShareCampaignButton from "@/components/website/ShareCampaignButton";

type CampaignStatus = "Active" | "Upcoming" | "Planned" | "Completed";

type Campaign = {
  slug: string;
  title: string;
  category: string;
  status: CampaignStatus;
  location: string;
  period: string;
  summary: string;
  description: string;
  image: string;
  icon: typeof Megaphone;
  objectives: string[];
  activities: string[];
  participation: string[];
  outcomes: string[];
  timeline: {
    title: string;
    description: string;
  }[];
  gallery: string[];
  resources: {
    title: string;
    type: string;
  }[];
};

const campaigns: Record<string, Campaign> = {
  "community-awareness-campaign": {
    slug: "community-awareness-campaign",
    title: "Community Awareness Campaign",
    category: "Awareness",
    status: "Active",
    location: "Achham, Nepal",
    period: "Campaign period",
    summary:
      "A community-focused campaign designed to encourage awareness, dialogue and meaningful participation around important local issues.",
    description:
      "The Community Awareness Campaign provides a structured platform for sharing useful information, encouraging community dialogue and supporting people to participate in issues that affect their communities.",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2000&q=90",
    icon: Megaphone,
    objectives: [
      "Promote awareness around important community issues.",
      "Encourage informed discussion and local participation.",
      "Create accessible opportunities for people to share ideas and concerns.",
      "Support practical community-level action.",
    ],
    activities: [
      "Community awareness sessions",
      "Information and educational activities",
      "Community discussions",
      "Local outreach and engagement",
      "Awareness materials and digital communication",
    ],
    participation: [
      "Community members",
      "Youth groups",
      "Local volunteers",
      "Community organizations",
      "Relevant local stakeholders",
    ],
    outcomes: [
      "Greater awareness and access to useful information.",
      "More opportunities for community dialogue.",
      "Increased participation in local activities.",
      "Stronger connections between community members and local initiatives.",
    ],
    timeline: [
      {
        title: "Preparation",
        description:
          "Understand the local context, identify priorities and prepare campaign activities.",
      },
      {
        title: "Community Engagement",
        description:
          "Connect with community members through discussions, outreach and awareness activities.",
      },
      {
        title: "Action",
        description:
          "Encourage practical participation and community-led activities.",
      },
      {
        title: "Review & Learning",
        description:
          "Review activities, gather feedback and identify opportunities for improvement.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85",
    ],
    resources: [
      {
        title: "Campaign Overview",
        type: "Document",
      },
      {
        title: "Community Awareness Materials",
        type: "Publication",
      },
      {
        title: "Campaign Activity Report",
        type: "Report",
      },
    ],
  },

  "health-awareness-campaign": {
    slug: "health-awareness-campaign",
    title: "Health Awareness Campaign",
    category: "Health",
    status: "Upcoming",
    location: "Achham, Nepal",
    period: "Campaign period",
    summary:
      "An awareness-focused campaign supporting responsible health information sharing and community participation.",
    description:
      "The Health Awareness Campaign is designed to create opportunities for communities to access useful health information, discuss health-related concerns and participate in awareness activities.",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=2000&q=90",
    icon: HeartHandshake,
    objectives: [
      "Improve access to clear and responsible health information.",
      "Encourage health awareness at community level.",
      "Promote participation in health-related awareness activities.",
      "Support collaboration with relevant local stakeholders.",
    ],
    activities: [
      "Health awareness sessions",
      "Community information sharing",
      "Health-focused discussions",
      "Awareness materials",
      "Community outreach activities",
    ],
    participation: [
      "Community members",
      "Youth",
      "Families",
      "Local volunteers",
      "Health-related stakeholders",
    ],
    outcomes: [
      "Improved awareness of important health topics.",
      "Better access to reliable information.",
      "Greater community participation in awareness activities.",
      "Stronger collaboration around community health awareness.",
    ],
    timeline: [
      {
        title: "Planning",
        description:
          "Identify campaign priorities, audiences and suitable awareness activities.",
      },
      {
        title: "Awareness",
        description:
          "Deliver accessible information through community-focused activities.",
      },
      {
        title: "Engagement",
        description:
          "Create opportunities for questions, discussion and participation.",
      },
      {
        title: "Learning",
        description:
          "Gather feedback and document lessons for future activities.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=85",
    ],
    resources: [
      {
        title: "Health Campaign Overview",
        type: "Document",
      },
      {
        title: "Health Awareness Materials",
        type: "Publication",
      },
      {
        title: "Campaign Activity Report",
        type: "Report",
      },
    ],
  },

  "youth-participation-campaign": {
    slug: "youth-participation-campaign",
    title: "Youth Participation Campaign",
    category: "Youth",
    status: "Planned",
    location: "Achham, Nepal",
    period: "Campaign period",
    summary:
      "A campaign framework encouraging young people to participate, share ideas and contribute to community-focused activities.",
    description:
      "The Youth Participation Campaign aims to create meaningful opportunities for young people to contribute ideas, participate in community activities and strengthen their connection with local initiatives.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=90",
    icon: Users,
    objectives: [
      "Encourage meaningful youth participation.",
      "Create platforms for young people to share ideas.",
      "Support youth-led community activities.",
      "Strengthen collaboration between young people and community initiatives.",
    ],
    activities: [
      "Youth dialogue sessions",
      "Participation workshops",
      "Community activities",
      "Youth-led initiatives",
      "Knowledge and idea-sharing sessions",
    ],
    participation: [
      "Young people",
      "Student groups",
      "Youth clubs",
      "Community volunteers",
      "Local organizations",
    ],
    outcomes: [
      "More opportunities for youth participation.",
      "Greater visibility for youth ideas.",
      "Improved collaboration among young people.",
      "Increased involvement in community-focused activities.",
    ],
    timeline: [
      {
        title: "Connect",
        description:
          "Connect with young people and understand their interests, ideas and priorities.",
      },
      {
        title: "Engage",
        description:
          "Create opportunities for discussion, learning and active participation.",
      },
      {
        title: "Act",
        description:
          "Support practical youth-led activities and community engagement.",
      },
      {
        title: "Reflect",
        description:
          "Collect feedback and identify opportunities for continued participation.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85",
    ],
    resources: [
      {
        title: "Youth Campaign Overview",
        type: "Document",
      },
      {
        title: "Youth Participation Guide",
        type: "Publication",
      },
      {
        title: "Campaign Activity Report",
        type: "Report",
      },
    ],
  },

  "community-action-campaign": {
    slug: "community-action-campaign",
    title: "Community Action Campaign",
    category: "Community",
    status: "Planned",
    location: "Achham, Nepal",
    period: "Campaign period",
    summary:
      "A campaign designed to bring people together around practical community participation and local action.",
    description:
      "The Community Action Campaign focuses on encouraging people to work together around practical community priorities and create opportunities for collective participation.",
    image:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=2000&q=90",
    icon: Heart,
    objectives: [
      "Encourage community-led participation.",
      "Support collaborative local action.",
      "Create opportunities for volunteers and community members to contribute.",
      "Strengthen connections between local initiatives and communities.",
    ],
    activities: [
      "Community action sessions",
      "Volunteer engagement",
      "Local discussions",
      "Collaborative activities",
      "Community outreach",
    ],
    participation: [
      "Community members",
      "Volunteers",
      "Youth",
      "Local groups",
      "Community organizations",
    ],
    outcomes: [
      "Increased community participation.",
      "More opportunities for local collaboration.",
      "Stronger volunteer engagement.",
      "Improved connection between people and community initiatives.",
    ],
    timeline: [
      {
        title: "Identify",
        description:
          "Understand local priorities and identify opportunities for collective action.",
      },
      {
        title: "Mobilize",
        description:
          "Bring together community members, volunteers and relevant groups.",
      },
      {
        title: "Act",
        description:
          "Support practical activities based on identified community priorities.",
      },
      {
        title: "Learn",
        description:
          "Review activities, document learning and identify future opportunities.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=85",
    ],
    resources: [
      {
        title: "Community Action Overview",
        type: "Document",
      },
      {
        title: "Community Participation Guide",
        type: "Publication",
      },
      {
        title: "Campaign Activity Report",
        type: "Report",
      },
    ],
  },
};

function getStatusClasses(status: CampaignStatus) {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Upcoming":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "Completed":
      return "bg-slate-100 text-slate-700 border-slate-200";

    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

export async function generateStaticParams() {
  return Object.keys(campaigns).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaign = campaigns[slug];

  if (!campaign) {
    return {
      title: "Campaign Not Found",
    };
  }

  return {
    title: campaign.title,
    description: campaign.summary,
  };
}

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = campaigns[slug];

  if (!campaign) {
    notFound();
  }

  const CampaignIcon = campaign.icon;

  return (
    <main className="bg-[#FCFAF7]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#55152B] text-white">
        <div className="absolute inset-0">
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-[#55152B]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B] via-[#55152B]/75 to-[#2457C5]/35" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="max-w-4xl">
            {/* BREADCRUMB */}
            <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/70">
              <Link
                href="/"
                className="transition hover:text-white"
              >
                Home
              </Link>

              <span>/</span>

              <Link
                href="/work/campaigns"
                className="transition hover:text-white"
              >
                Campaigns
              </Link>

              <span>/</span>

              <span className="text-white/90">
                {campaign.title}
              </span>
            </div>

            {/* CATEGORY */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                {campaign.category}
              </span>

              <span
                className={`rounded-full border px-4 py-1.5 text-xs font-bold ${getStatusClasses(
                  campaign.status,
                )}`}
              >
                {campaign.status}
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {campaign.title}
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-white/80 sm:text-lg">
              {campaign.summary}
            </p>

            {/* META */}
            <div className="mt-9 flex flex-wrap gap-3">
              <CampaignMeta
                icon={MapPin}
                label={campaign.location}
              />

              <CampaignMeta
                icon={CalendarDays}
                label={campaign.period}
              />

              <CampaignMeta
                icon={CampaignIcon}
                label={campaign.category}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRO + SHARE
      ========================================================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <Link
            href="/work/campaigns"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2457C5] transition hover:text-[#17439F]"
          >
            <ArrowLeft size={16} />
            Back to Campaigns
          </Link>

          <ShareCampaignButton
            title={campaign.title}
            text={campaign.summary}
          />
        </div>
      </section>

      {/* =========================================================
          OVERVIEW
      ========================================================= */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <SectionLabel>Campaign Overview</SectionLabel>

              <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#172033] sm:text-4xl">
                Creating space for awareness, participation and action.
              </h2>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
                {campaign.description}
              </p>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
                The campaign approach is designed to remain community-focused,
                accessible and adaptable. Activities can be refined based on
                local context, participation and learning.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[28px] bg-[#F7E9EE] p-7 sm:p-9">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#7A1F3D]/10" />
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#2457C5]/10" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7A1F3D] text-white">
                  <CampaignIcon size={25} />
                </div>

                <h3 className="mt-7 text-xl font-bold text-[#172033]">
                  Campaign Purpose
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Bring people together around useful information, meaningful
                  participation and practical community-focused action.
                </p>

                <div className="mt-7 h-px bg-[#7A1F3D]/10" />

                <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-[#7A1F3D]">
                  <div className="blue-dot" />
                  Community-centered approach
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          OBJECTIVES
      ========================================================= */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="max-w-3xl">
            <SectionLabel>Objectives</SectionLabel>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              What the campaign aims to support
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              The campaign objectives provide a flexible framework that can be
              refined through planning, community feedback and implementation.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {campaign.objectives.map((objective, index) => (
              <div
                key={objective}
                className="card card-hover flex gap-5 p-6 sm:p-7"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                  <span className="text-sm font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#172033]">
                    Objective {index + 1}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {objective}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          ACTIVITIES
      ========================================================= */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <SectionLabel>Campaign Activities</SectionLabel>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#172033] sm:text-4xl">
                How the campaign can come to life
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Activities can be adapted according to campaign priorities,
                available resources and community needs.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {campaign.activities.map((activity, index) => (
                <div
                  key={activity}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7E9EE] text-[#7A1F3D]">
                    <CheckCircle2 size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                      Activity {index + 1}
                    </p>

                    <p className="mt-1.5 text-sm font-semibold leading-6 text-[#172033]">
                      {activity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TIMELINE
      ========================================================= */}
      <section className="section bg-[#172033] text-white">
        <div className="container-main">
          <div className="max-w-3xl">
            <SectionLabel dark>Campaign Flow</SectionLabel>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              From planning to learning
            </h2>

            <p className="mt-5 text-base leading-8 text-white/65">
              A simple framework keeps campaign activities organized while
              leaving room for community feedback and adaptation.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {campaign.timeline.map((item, index) => (
              <div
                key={item.title}
                className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7A1F3D] text-sm font-bold">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/60">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PARTICIPATION
      ========================================================= */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionLabel>Participation</SectionLabel>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#172033] sm:text-4xl">
                Everyone can have a meaningful role.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Campaign participation can include community members,
                volunteers, youth groups, organizations and other relevant
                stakeholders.
              </p>

              <div className="mt-8">
                <Link
                  href="/contact"
                  className="btn-primary"
                >
                  Get Involved
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {campaign.participation.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-[#FCFAF7] p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                    <Users size={18} />
                  </div>

                  <span className="text-sm font-semibold text-[#172033]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          OUTCOMES
      ========================================================= */}
      <section className="section">
        <div className="container-main">
          <div className="max-w-3xl">
            <SectionLabel>Expected Outcomes</SectionLabel>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              What meaningful progress can look like
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {campaign.outcomes.map((outcome, index) => (
              <div
                key={outcome}
                className="card flex gap-5 p-6 sm:p-7"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7A1F3D] text-white">
                  <Target size={19} />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A1F3D]">
                    Outcome {index + 1}
                  </span>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {outcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          GALLERY
      ========================================================= */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>Campaign Gallery</SectionLabel>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Moments from the campaign
              </h2>
            </div>

            <Link
              href="/resources/gallery"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#2457C5] transition hover:text-[#17439F]"
            >
              View full gallery
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {campaign.gallery.map((image, index) => (
              <div
                key={image}
                className={`group relative overflow-hidden rounded-2xl ${
                  index === 0
                    ? "md:row-span-2 md:min-h-[520px]"
                    : "min-h-[250px]"
                }`}
              >
                <Image
                  src={image}
                  alt={`${campaign.title} gallery image ${index + 1}`}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/55 via-transparent to-transparent opacity-70" />

                <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                  <Images size={14} />
                  Campaign moment
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          RESOURCES
      ========================================================= */}
      <section className="section">
        <div className="container-main">
          <div className="max-w-3xl">
            <SectionLabel>Resources</SectionLabel>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Campaign documents and materials
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              These resource entries are structured so they can later be
              connected directly to documents managed through the Lifeline
              Achham CMS.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {campaign.resources.map((resource) => (
              <div
                key={resource.title}
                className="card card-hover p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                    <FileText size={19} />
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    {resource.type}
                  </span>
                </div>

                <h3 className="mt-6 text-base font-bold text-[#172033]">
                  {resource.title}
                </h3>

                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5] transition hover:text-[#17439F]"
                >
                  <Download size={15} />
                  Download
                </button>
              </div>
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
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-white/10" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/80">
                  <HeartHandshake size={14} />
                  Get involved
                </div>

                <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                  Be part of meaningful community action.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                  Connect with Lifeline Achham to learn more about campaigns,
                  participation opportunities and ways to contribute.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#55152B] transition hover:-translate-y-0.5 hover:bg-[#FCFAF7]"
                >
                  Contact Us
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/work/campaigns"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  All Campaigns
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
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] ${
        dark ? "text-white/60" : "text-[#7A1F3D]"
      }`}
    >
      <span
        className={`h-[3px] w-8 rounded-full ${
          dark ? "bg-[#2457C5]" : "bg-[#7A1F3D]"
        }`}
      />

      {children}
    </div>
  );
}

function CampaignMeta({
  icon: Icon,
  label,
}: {
  icon: typeof MapPin;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white/85 backdrop-blur-md">
      <Icon size={15} />
      {label}
    </div>
  );
}
