
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
  Heart,
  HeartHandshake,
  Megaphone,
  MapPin,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import ShareCampaignButton from "@/components/website/ShareCampaignButton";

type CampaignRecord = {
  id: string;
  key: string;
  slug: string | null;
  title: string;
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2000&q=90";

async function getCampaign(slug: string): Promise<CampaignRecord | null> {
  const campaign = await prisma.contentItem.findFirst({
    where: {
      slug,
      key: {
        startsWith: "campaign_",
      },
      status: "PUBLISHED",
    },
    select: {
      id: true,
      key: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      isFeatured: true,
    },
  });

  return campaign;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaign(slug);

  if (!campaign) {
    return {
      title: "Campaign Not Found | Lifeline Achham",
      description: "The requested campaign could not be found.",
    };
  }

  return {
    title: `${campaign.title} | Lifeline Achham`,
    description:
      campaign.excerpt ||
      `Learn more about ${campaign.title} and Lifeline Achham's community work.`,
    openGraph: {
      title: campaign.title,
      description: campaign.excerpt || undefined,
      images: campaign.imageUrl ? [campaign.imageUrl] : [fallbackImage],
      type: "article",
    },
  };
}

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await getCampaign(slug);

  if (!campaign) {
    notFound();
  }

  const image = campaign.imageUrl || fallbackImage;

  return (
    <main className="overflow-hidden bg-[#FCFAF7]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#55152B] text-white">
        <div className="absolute inset-0 -z-10">
          <Image
            src={image}
            alt={campaign.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#55152B]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B] via-[#55152B]/75 to-[#2457C5]/35" />
        </div>

        <div className="container-main relative py-28 sm:py-32 lg:py-40">
          <div className="max-w-4xl">
            {/* BREADCRUMB */}
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/70"
            >
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/work"
                className="transition hover:text-white"
              >
                Our Work
              </Link>
              <span>/</span>
              <Link
                href="/work/campaigns"
                className="transition hover:text-white"
              >
                Campaigns
              </Link>
              <span>/</span>
              <span className="text-white/90">{campaign.title}</span>
            </nav>

            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                Campaign
              </span>

              {campaign.isFeatured && (
                <span className="rounded-full bg-[#2457C5] px-4 py-1.5 text-xs font-bold text-white">
                  Featured
                </span>
              )}

              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/85 backdrop-blur-md">
                <CheckCircle2 size={14} />
                Published
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {campaign.title}
            </h1>

            {campaign.excerpt && (
              <p className="mt-7 max-w-3xl text-base leading-8 text-white/80 sm:text-lg">
                {campaign.excerpt}
              </p>
            )}

            <div className="mt-9 flex flex-wrap gap-3">
              <CampaignMeta icon={MapPin} label="Achham, Nepal" />
              <CampaignMeta icon={CalendarDays} label="Campaign information" />
              <CampaignMeta icon={Megaphone} label="Community initiative" />
            </div>
          </div>
        </div>
      </section>

      {/* BACK LINK + SHARE */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-main flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/work/campaigns"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2457C5] transition hover:text-[#17439F]"
          >
            <ArrowLeft size={16} />
            Back to Campaigns
          </Link>

          <ShareCampaignButton
            title={campaign.title}
            text={
              campaign.excerpt ||
              `Learn more about ${campaign.title} from Lifeline Achham.`
            }
          />
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <article>
              <SectionLabel>Campaign Overview</SectionLabel>

              <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#172033] sm:text-4xl">
                Creating space for awareness, participation and action.
              </h2>

              {campaign.content ? (
                <div className="mt-6 whitespace-pre-line break-words text-base leading-8 text-slate-600">
                  {campaign.content}
                </div>
              ) : (
                <p className="mt-6 text-base leading-8 text-slate-600">
                  {campaign.excerpt ||
                    "Learn about this campaign and its purpose through Lifeline Achham."}
                </p>
              )}
            </article>

            <aside className="relative overflow-hidden rounded-[28px] bg-[#F7E9EE] p-7 sm:p-9">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#7A1F3D]/10" />
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#2457C5]/10" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7A1F3D] text-white">
                  <Megaphone size={25} />
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
                  <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
                  Community-centered approach
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CAMPAIGN IMAGE */}
      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-main">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>Campaign Image</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                A closer look at the campaign
              </h2>
            </div>

            <Link
              href="/resources/gallery"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#2457C5] transition hover:text-[#17439F]"
            >
              Explore gallery
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="relative mt-10 h-[280px] overflow-hidden rounded-3xl bg-[#F7E9EE] sm:h-[420px] lg:h-[540px]">
            <Image
              src={image}
              alt={campaign.title}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/45 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
              <Heart size={14} />
              Lifeline Achham
            </div>
          </div>
        </div>
      </section>

      {/* GET INVOLVED */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionLabel>Participation</SectionLabel>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#172033] sm:text-4xl">
                Everyone can have a meaningful role.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Community members, volunteers, young people and partner
                organizations can help build awareness and support community
                initiatives. Contact Lifeline Achham to learn about relevant
                opportunities to participate.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 text-sm font-bold text-white transition hover:bg-[#17439F]"
                >
                  Get Involved
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/blood-donation"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-[#7A1F3D] transition hover:bg-[#F7E9EE]"
                >
                  Blood Donation
                  <HeartHandshake size={17} />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Community members",
                "Local volunteers",
                "Youth groups",
                "Community organizations",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                    <HeartHandshake size={18} />
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

      {/* CTA */}
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
                  Connect with Lifeline Achham to learn more about this
                  campaign and ways to contribute to community-focused work.
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

/* HELPERS */

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
