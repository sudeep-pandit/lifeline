"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Heart,
  HeartHandshake,
  Megaphone,
  MapPin,
  Share2,
  Target,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const campaigns = [
  {
    id: "01",
    slug: "community-awareness-campaign",
    title: "Community Awareness Campaign",
    category: "Awareness",
    status: "Active",
    location: "Achham, Nepal",
    description:
      "A community-focused campaign designed to encourage awareness, dialogue and meaningful participation around important local issues.",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=90",
    icon: Megaphone,
  },
  {
    id: "02",
    slug: "health-awareness-campaign",
    title: "Health Awareness Campaign",
    category: "Health",
    status: "Upcoming",
    location: "Achham, Nepal",
    description:
      "An awareness-focused campaign supporting responsible health information sharing and community participation.",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=90",
    icon: HeartHandshake,
  },
  {
    id: "03",
    slug: "youth-participation-campaign",
    title: "Youth Participation Campaign",
    category: "Youth",
    status: "Planned",
    location: "Achham, Nepal",
    description:
      "A campaign framework encouraging young people to participate, share ideas and contribute to community-focused activities.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=90",
    icon: Users,
  },
  {
    id: "04",
    slug: "community-action-campaign",
    title: "Community Action Campaign",
    category: "Community",
    status: "Planned",
    location: "Achham, Nepal",
    description:
      "A campaign designed to bring people together around practical community participation and local action.",
    image:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1400&q=90",
    icon: Heart,
  },
];

const campaignPrinciples = [
  {
    number: "01",
    title: "Raise Awareness",
    description:
      "Make important information easier to understand, access and share within communities.",
    icon: Megaphone,
  },
  {
    number: "02",
    title: "Bring People Together",
    description:
      "Create opportunities for people, groups and communities to participate around shared priorities.",
    icon: Users,
  },
  {
    number: "03",
    title: "Encourage Action",
    description:
      "Turn awareness and participation into practical, responsible and meaningful community action.",
    icon: Target,
  },
];

const campaignFlow = [
  {
    step: "01",
    title: "Understand",
    description:
      "Identify the issue, audience and context that the campaign is designed to address.",
  },
  {
    step: "02",
    title: "Connect",
    description:
      "Develop messages and activities that connect with people and encourage participation.",
  },
  {
    step: "03",
    title: "Act",
    description:
      "Deliver campaign activities through appropriate community-focused channels.",
  },
  {
    step: "04",
    title: "Reflect",
    description:
      "Review participation, document learning and improve future campaigns.",
  },
];

export default function CampaignsPage() {
  return (
    <main className="overflow-hidden bg-[#FCFAF7]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#55152B] pt-[112px]">
        <div className="relative h-[390px] w-full sm:h-[430px] lg:h-[470px]">
          <Image
            src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2000&q=90"
            alt="Community campaign activity"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#55152B]/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#55152B]/65 to-transparent" />

          <div className="container-main relative z-10 flex h-full items-center">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#2457C5]" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E9B6C7]">
                  Our Work
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Campaigns
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg">
                Community-focused campaigns that turn awareness, participation
                and shared purpose into meaningful action.
              </p>

              <div className="mt-7 flex items-center gap-3 text-xs">
                <Link
                  href="/"
                  className="text-white/60 transition hover:text-white"
                >
                  Home
                </Link>

                <span className="text-white/30">/</span>

                <Link
                  href="/work"
                  className="text-white/60 transition hover:text-white"
                >
                  Our Work
                </Link>

                <span className="text-white/30">/</span>

                <span className="text-white/50">Campaigns</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="section">
        <div className="container-main">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1"
            >
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="relative h-[360px] overflow-hidden rounded-2xl sm:h-[430px]">
                  <Image
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=90"
                    alt="People participating in a community activity"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/70 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="rounded-2xl border border-white/20 bg-white/90 p-5 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A1F3D] text-white">
                          <Megaphone size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#172033]">
                            Awareness into action
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Connect • Engage • Act
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="brand-line" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                  Campaigns
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Create awareness.
                <span className="text-[#7A1F3D]"> Inspire action.</span>
              </h2>

              <p className="mt-6 text-sm leading-8 text-slate-500 sm:text-base">
                Campaigns provide a focused way to communicate important
                messages, encourage participation and bring people together
                around a shared purpose.
              </p>

              <p className="mt-4 text-sm leading-8 text-slate-500 sm:text-base">
                Each campaign can have its own audience, message, activities,
                timeline, media and resources while remaining connected to
                Lifeline Achham&apos;s wider work.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#F7E9EE] px-4 py-2 text-xs font-semibold text-[#7A1F3D]">
                  Awareness
                </span>

                <span className="rounded-full bg-[#EEF4FF] px-4 py-2 text-xs font-semibold text-[#2457C5]">
                  Participation
                </span>

                <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
                  Community Action
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED CAMPAIGNS */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="blue-dot" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2457C5]">
                Campaign Directory
              </span>

              <span className="blue-dot" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Explore our
              <span className="text-[#2457C5]"> campaigns.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Explore campaign themes and initiatives. Detailed campaign
              information can be managed through the future CMS.
            </p>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-2">
            {campaigns.map((campaign) => {
              const Icon = campaign.icon;

              return (
                <motion.article
                  key={campaign.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ y: -5 }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#FCFAF7] shadow-sm transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="relative h-[270px] overflow-hidden">
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/80 via-[#172033]/10 to-transparent" />

                    <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7A1F3D] shadow-sm backdrop-blur">
                        {campaign.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
                          campaign.status === "Active"
                            ? "bg-[#198754] text-white"
                            : campaign.status === "Upcoming"
                              ? "bg-[#2457C5] text-white"
                              : "bg-white/90 text-slate-600"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#7A1F3D] text-white shadow-lg">
                      <Icon size={19} />
                    </div>

                    <span className="absolute bottom-5 right-5 text-xs font-bold tracking-[0.18em] text-white/55">
                      CAMPAIGN {campaign.id}
                    </span>
                  </div>

                  <div className="p-7">
                    <h3 className="text-xl font-bold text-[#172033]">
                      {campaign.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {campaign.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-4 border-y border-slate-200 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin
                          size={14}
                          className="shrink-0 text-[#7A1F3D]"
                        />

                        <span>{campaign.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays
                          size={14}
                          className="shrink-0 text-[#2457C5]"
                        />

                        <span>Campaign timeline</span>
                      </div>
                    </div>

                    <Link
                      href={`/work/campaigns/${campaign.slug}`}
                      className="group/link mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]"
                    >
                      View campaign

                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CAMPAIGNS */}
      <section className="section">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="brand-line" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Our Approach
              </span>

              <span className="brand-line" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Campaigns built around
              <span className="text-[#7A1F3D]"> purpose.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              A campaign is more than a message. It is an opportunity to
              connect people with information, participation and action.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {campaignPrinciples.map((principle) => {
              const Icon = principle.icon;

              return (
                <motion.div
                  key={principle.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D] transition group-hover:bg-[#7A1F3D] group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <div className="mt-5 text-[10px] font-bold tracking-[0.18em] text-slate-300">
                    {principle.number}
                  </div>

                  <h3 className="mt-2 text-lg font-bold text-[#172033]">
                    {principle.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {principle.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAMPAIGN FLOW */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-3xl bg-[#55152B] p-8 sm:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                  <Share2 size={22} />
                </div>

                <h2 className="mt-7 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  From message to movement.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/60">
                  A structured campaign approach helps transform an important
                  message into meaningful participation and action.
                </p>

                <div className="mt-8 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#2457C5]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                    Understand • Connect • Act • Reflect
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                  Campaign Flow
                </span>

                <h3 className="mt-3 text-2xl font-bold text-[#172033]">
                  A clear path from purpose to action.
                </h3>
              </div>

              <div className="space-y-5">
                {campaignFlow.map((item) => (
                  <div
                    key={item.step}
                    className="flex gap-5 rounded-2xl border border-slate-200 bg-[#FCFAF7] p-5 sm:p-6"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-sm font-bold text-[#2457C5]">
                      {item.step}
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-[#172033]">
                        {item.title}
                      </h4>

                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CMS READY */}
      <section className="section">
        <div className="container-main">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.75fr] lg:gap-20">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="brand-line" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                  CMS Ready
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Every campaign can have its own
                <span className="text-[#2457C5]"> story.</span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-500 sm:text-base">
                The future custom CMS will allow administrators to create,
                update and publish campaign information without changing the
                frontend code.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Campaign title & category",
                  "Campaign status",
                  "Featured image",
                  "Campaign dates",
                  "Location",
                  "Campaign description",
                  "Objectives & activities",
                  "Gallery & resources",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-xs font-bold text-[#2457C5]">
                      ✓
                    </span>

                    <span className="text-xs font-medium text-slate-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[#F7E9EE] p-8 sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7A1F3D] text-white">
                <Heart size={21} />
              </div>

              <h3 className="mt-7 text-2xl font-bold text-[#172033]">
                Built for community participation.
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Campaign pages can eventually include participation options,
                campaign resources, updates, media and calls to action.
              </p>

              <div className="mt-7 rounded-2xl border border-[#7A1F3D]/10 bg-white/70 p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-[#198754]"
                  />

                  <span className="text-xs font-semibold text-slate-600">
                    Structured for future CMS management
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FCFAF7] pb-24 sm:pb-28 lg:pb-32">
        <div className="container-main">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#55152B] px-7 py-14 text-center sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.045]" />

            <div className="pointer-events-none absolute -bottom-24 left-1/4 h-52 w-52 rounded-full bg-[#2457C5]/15 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <div className="mb-5 flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#2457C5]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                  Get Involved
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Be part of meaningful action.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Whether you want to volunteer, collaborate, share a campaign
                or support community-focused work, there is always a meaningful
                way to contribute.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:bg-[#17439F]"
                >
                  Get Involved

                  <ArrowUpRight
                    size={17}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

                <Link
                  href="/blood-donation"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Blood Donation

                  <HeartHandshake size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
