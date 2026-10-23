"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  HeartHandshake,
  MapPin,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const projects = [
  {
    id: "01",
    slug: "community-engagement-initiative",
    title: "Community Engagement Initiative",
    category: "Community Development",
    status: "Ongoing",
    location: "Achham, Nepal",
    duration: "Project timeline",
    description:
      "A focused initiative designed to encourage community participation, collaboration and meaningful local action.",
    image:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=90",
    icon: Users,
  },
  {
    id: "02",
    slug: "youth-learning-initiative",
    title: "Youth Learning Initiative",
    category: "Education & Youth",
    status: "Planned",
    location: "Achham, Nepal",
    duration: "Project timeline",
    description:
      "A focused initiative supporting learning opportunities, youth participation and knowledge sharing.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=90",
    icon: Sparkles,
  },
  {
    id: "03",
    slug: "health-awareness-initiative",
    title: "Health Awareness Initiative",
    category: "Health & Awareness",
    status: "Ongoing",
    location: "Achham, Nepal",
    duration: "Project timeline",
    description:
      "A community-focused initiative centered on awareness, responsible information sharing and participation.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=90",
    icon: HeartHandshake,
  },
  {
    id: "04",
    slug: "community-capacity-initiative",
    title: "Community Capacity Initiative",
    category: "Community Development",
    status: "Planned",
    location: "Achham, Nepal",
    duration: "Project timeline",
    description:
      "An initiative focused on strengthening participation, collaboration and opportunities for local capacity development.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=90",
    icon: Target,
  },
];

const projectStages = [
  {
    number: "01",
    title: "Identify",
    description:
      "Understand the issue, opportunity or community need that a project can respond to.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Define objectives, activities, responsibilities, resources and a practical timeline.",
  },
  {
    number: "03",
    title: "Implement",
    description:
      "Turn the plan into action through responsible coordination and community participation.",
  },
  {
    number: "04",
    title: "Learn",
    description:
      "Review progress, document experience and identify opportunities for improvement.",
  },
];

const projectPrinciples = [
  {
    icon: Target,
    title: "Clear Objectives",
    description:
      "Projects are organized around defined objectives and practical areas of action.",
  },
  {
    icon: Users,
    title: "Participation",
    description:
      "Community involvement helps shape projects and keeps the work connected to real needs.",
  },
  {
    icon: CheckCircle2,
    title: "Accountability",
    description:
      "Clear responsibilities and documentation help projects remain organized and transparent.",
  },
];

export default function ProjectsPage() {
  return (
    <main className="overflow-hidden bg-[#FCFAF7]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#55152B] pt-[112px]">
        <div className="relative h-[390px] w-full sm:h-[430px] lg:h-[470px]">
          <Image
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=2000&q=90"
            alt="Community project activity"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#55152B]/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#55152B]/60 to-transparent" />

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
                Projects
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg">
                Focused initiatives with defined objectives, activities and
                opportunities to create meaningful community outcomes.
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

                <span className="text-white/50">Projects</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="section">
        <div className="container-main">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.82fr] lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="brand-line" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                  Our Projects
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                From ideas to
                <span className="text-[#7A1F3D]"> focused action.</span>
              </h2>

              <p className="mt-6 text-sm leading-8 text-slate-500 sm:text-base">
                Projects provide a practical structure for turning an idea,
                need or opportunity into a focused initiative with clear
                objectives and activities.
              </p>

              <p className="mt-4 text-sm leading-8 text-slate-500 sm:text-base">
                Each project can have its own timeline, location, team,
                activities, documentation and outcomes while remaining
                connected to the organization&apos;s wider programs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="relative h-[340px] overflow-hidden rounded-2xl sm:h-[400px]">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=90"
                  alt="People collaborating on a project"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/65 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="rounded-2xl border border-white/20 bg-white/90 p-5 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2457C5] text-white">
                        <FolderKanban size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#172033]">
                          Focused initiatives
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Clear objectives. Practical action.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROJECT DIRECTORY */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="blue-dot" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2457C5]">
                Project Directory
              </span>

              <span className="blue-dot" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Explore our
              <span className="text-[#2457C5]"> projects.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Project information can later be managed, filtered and published
              directly from the Lifeline Achham CMS.
            </p>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-2">
            {projects.map((project) => {
              const Icon = project.icon;

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ y: -5 }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#FCFAF7] shadow-sm transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="relative h-[260px] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/75 via-[#172033]/10 to-transparent" />

                    <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7A1F3D] shadow-sm backdrop-blur">
                        {project.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
                          project.status === "Ongoing"
                            ? "bg-[#198754]/90 text-white"
                            : "bg-white/90 text-slate-600"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#2457C5] text-white shadow-lg">
                      <Icon size={19} />
                    </div>

                    <span className="absolute bottom-5 right-5 text-xs font-bold tracking-[0.18em] text-white/55">
                      PROJECT {project.id}
                    </span>
                  </div>

                  <div className="p-7">
                    <h3 className="text-xl font-bold text-[#172033]">
                      {project.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {project.description}
                    </p>

                    <div className="mt-5 grid gap-3 border-y border-slate-200 py-4 sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin
                          size={14}
                          className="shrink-0 text-[#7A1F3D]"
                        />
                        <span>{project.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays
                          size={14}
                          className="shrink-0 text-[#2457C5]"
                        />
                        <span>{project.duration}</span>
                      </div>
                    </div>

                    <Link
                      href={`/work/projects/${project.slug}`}
                      className="group/link mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]"
                    >
                      View project

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

      {/* PROJECT LIFECYCLE */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-3xl bg-[#55152B] p-8 sm:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                  <FolderKanban size={22} />
                </div>

                <h2 className="mt-7 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  A project is a journey from an idea to action.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/65">
                  A clear project lifecycle helps organize objectives,
                  activities, responsibilities and learning throughout the
                  initiative.
                </p>

                <div className="mt-8 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#2457C5]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                    Identify • Plan • Implement • Learn
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                  Project Lifecycle
                </span>

                <h3 className="mt-3 text-2xl font-bold text-[#172033]">
                  A structured way of working.
                </h3>
              </div>

              <div className="space-y-5">
                {projectStages.map((stage) => (
                  <div
                    key={stage.number}
                    className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7E9EE] text-sm font-bold text-[#7A1F3D]">
                      {stage.number}
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-[#172033]">
                        {stage.title}
                      </h4>

                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="brand-line" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                What Matters
              </span>

              <span className="brand-line" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Principles behind our
              <span className="text-[#7A1F3D]"> projects.</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {projectPrinciples.map((principle) => {
              const Icon = principle.icon;

              return (
                <div
                  key={principle.title}
                  className="rounded-2xl border border-slate-200 bg-[#FCFAF7] p-7 text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#172033]">
                    {principle.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {principle.description}
                  </p>
                </div>
              );
            })}
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
                Designed for structured
                <span className="text-[#7A1F3D]"> project management.</span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-500 sm:text-base">
                When the custom CMS is connected, administrators will be able
                to manage project information without editing the frontend
                code.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Project title & category",
                  "Featured image",
                  "Project status",
                  "Start & end dates",
                  "Location",
                  "Objectives & outcomes",
                  "Project team",
                  "Reports & documents",
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

            <div className="rounded-3xl bg-[#55152B] p-8 sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                <Clock3 size={22} />
              </div>

              <h3 className="mt-7 text-2xl font-bold text-white">
                Track the journey.
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/65">
                Project status, timelines and outcomes can be presented clearly
                so visitors and administrators can understand where an
                initiative stands.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <span className="text-xs text-white/55">Planned</span>
                  <span className="text-xs font-bold text-white/80">
                    Ready
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <span className="text-xs text-white/55">Ongoing</span>
                  <span className="text-xs font-bold text-white/80">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <span className="text-xs text-white/55">Completed</span>
                  <span className="text-xs font-bold text-white/80">
                    Documented
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
                Have an idea worth turning into action?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Connect with Lifeline Achham to discuss collaboration,
                participation or opportunities to support community-focused
                initiatives.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:bg-[#17439F]"
                >
                  Contact Us

                  <ArrowUpRight
                    size={17}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

                <Link
                  href="/work/campaigns"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Explore Campaigns

                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
