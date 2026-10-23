import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  HeartHandshake,
  Lightbulb,
  Mail,
  Target,
  Users,
} from "lucide-react";

const programs = {
  "community-wellbeing": {
    title: "Community Wellbeing",
    category: "Community Development",
    number: "01",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=2000&q=90",
    shortDescription:
      "A community-focused area of work supporting healthier, safer and more connected communities.",
    overview:
      "Community wellbeing is about creating environments where people can participate, connect and access opportunities that contribute to a stronger community. This program area provides a framework for initiatives that respond to locally relevant needs.",
    objectives: [
      "Support community-centered initiatives.",
      "Encourage meaningful participation and collaboration.",
      "Promote awareness around community wellbeing.",
      "Create opportunities for local engagement.",
    ],
  },

  "youth-education": {
    title: "Youth & Education",
    category: "Education & Youth",
    number: "02",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=90",
    shortDescription:
      "Supporting opportunities that encourage learning, participation, confidence and positive development among young people.",
    overview:
      "Youth and education initiatives can create opportunities for learning, participation and personal development. This program area provides a structure for activities designed to support young people and encourage positive community participation.",
    objectives: [
      "Encourage learning and knowledge sharing.",
      "Create opportunities for youth participation.",
      "Support confidence and personal development.",
      "Encourage constructive community engagement.",
    ],
  },

  "health-awareness": {
    title: "Health & Awareness",
    category: "Health",
    number: "03",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=90",
    shortDescription:
      "Community-focused activities that promote awareness, participation and access to health-related information.",
    overview:
      "Health awareness depends on accessible information, community participation and responsible communication. This program area provides a framework for initiatives that encourage awareness and engagement around health-related issues.",
    objectives: [
      "Promote health-related awareness.",
      "Encourage informed community participation.",
      "Support accessible information sharing.",
      "Connect people with relevant community initiatives.",
    ],
  },

  "community-participation": {
    title: "Community Participation",
    category: "Participation",
    number: "04",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=90",
    shortDescription:
      "Creating opportunities for people to contribute, collaborate and take part in initiatives that matter to their communities.",
    overview:
      "Strong communities are built through participation. This program area focuses on creating opportunities for people to contribute ideas, collaborate with others and take part in activities that support shared community objectives.",
    objectives: [
      "Encourage inclusive participation.",
      "Create opportunities for collaboration.",
      "Support community-led ideas and activities.",
      "Strengthen connections between people and initiatives.",
    ],
  },
};

type ProgramSlug = keyof typeof programs;

const relatedAreas = [
  {
    icon: Target,
    title: "Clear Objectives",
    description:
      "Every program can be organized around clear goals and practical areas of action.",
  },
  {
    icon: Users,
    title: "Community Participation",
    description:
      "People remain central to the planning, implementation and learning process.",
  },
  {
    icon: HeartHandshake,
    title: "Collaboration",
    description:
      "Partnership and cooperation can help turn shared objectives into meaningful action.",
  },
];

function isProgramSlug(slug: string): slug is ProgramSlug {
  return slug in programs;
}

export async function generateStaticParams() {
  return Object.keys(programs).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isProgramSlug(slug)) {
    return {
      title: "Program",
    };
  }

  return {
    title: programs[slug].title,
    description: programs[slug].shortDescription,
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isProgramSlug(slug)) {
    return (
      <main className="min-h-screen bg-[#FCFAF7] pt-[112px]">
        <div className="container-main flex min-h-[60vh] items-center justify-center py-20">
          <div className="max-w-xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7E9EE] text-[#7A1F3D]">
              <Target size={24} />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-[#172033]">
              Program not found
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              The program you are looking for could not be found.
            </p>

            <Link
              href="/work/programs"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17439F]"
            >
              <ArrowLeft size={16} />
              Back to Programs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const program = programs[slug];

  return (
    <main className="overflow-hidden bg-[#FCFAF7]">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#55152B] pt-[112px]">
        <div className="relative h-[430px] w-full overflow-hidden sm:h-[470px] lg:h-[520px]">
          <Image
            src={program.image}
            alt={program.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#55152B]/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#55152B]/65 to-transparent" />

          <div className="pointer-events-none absolute -right-24 -top-24 hidden h-80 w-80 rounded-full border-[45px] border-white/[0.045] lg:block" />

          <div className="container-main relative z-10 flex h-full items-center">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#2457C5]" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E9B6C7]">
                  {program.category}
                </span>
              </div>

              <div className="mb-4 text-xs font-bold tracking-[0.2em] text-white/40">
                PROGRAM {program.number}
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {program.title}
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg">
                {program.shortDescription}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3 text-xs">
                <Link
                  href="/"
                  className="text-white/55 transition hover:text-white"
                >
                  Home
                </Link>

                <span className="text-white/25">/</span>

                <Link
                  href="/work"
                  className="text-white/55 transition hover:text-white"
                >
                  Our Work
                </Link>

                <span className="text-white/25">/</span>

                <Link
                  href="/work/programs"
                  className="text-white/55 transition hover:text-white"
                >
                  Programs
                </Link>

                <span className="text-white/25">/</span>

                <span className="text-white/45">
                  {program.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          OVERVIEW
      ========================================================= */}

      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:gap-20">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="brand-line" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                  Program Overview
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Building a practical path toward
                <span className="text-[#7A1F3D]"> meaningful action.</span>
              </h2>

              <p className="mt-6 text-sm leading-8 text-slate-500 sm:text-base">
                {program.overview}
              </p>

              <p className="mt-5 text-sm leading-8 text-slate-500 sm:text-base">
                The detailed content of this section can later be managed
                through the Lifeline Achham CMS, allowing the organization to
                update program information without changing the website
                structure.
              </p>

              <Link
                href="/contact"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17439F]"
              >
                Ask About This Program

                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D]">
                <Target size={20} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#172033]">
                Program at a glance
              </h3>

              <div className="mt-6 space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Area
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {program.category}
                  </p>
                </div>

                <div className="border-b border-slate-100 pb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Program
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {program.title}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Focus
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Community-centered planning, participation and action.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          OBJECTIVES
      ========================================================= */}

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="blue-dot" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2457C5]">
                  Objectives
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                What this program
                <span className="text-[#2457C5]"> aims to support.</span>
              </h2>

              <p className="mt-5 text-sm leading-8 text-slate-500 sm:text-base">
                Program objectives can be updated from the CMS as the
                organization defines specific priorities and activities.
              </p>
            </div>

            <div className="space-y-4">
              {program.objectives.map((objective, index) => (
                <div
                  key={objective}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-[#FCFAF7] p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400">
                      OBJECTIVE {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="mt-1 text-sm leading-7 font-medium text-slate-700">
                      {objective}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PROGRAM APPROACH
      ========================================================= */}

      <section className="section">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="brand-line" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Our Approach
              </span>

              <span className="brand-line" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Programs built around
              <span className="text-[#7A1F3D]"> people and purpose.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Our program structure can bring together people, activities and
              partnerships around a shared area of work.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {relatedAreas.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#172033]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          RELATED CONTENT
      ========================================================= */}

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/work/projects"
              className="group rounded-2xl border border-slate-200 bg-[#FCFAF7] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/20 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                  <Target size={19} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#2457C5]"
                />
              </div>

              <h3 className="mt-6 text-lg font-bold text-[#172033]">
                Projects
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                Explore focused initiatives connected to our wider areas of
                work.
              </p>
            </Link>

            <Link
              href="/work/campaigns"
              className="group rounded-2xl border border-slate-200 bg-[#FCFAF7] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/20 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D]">
                  <HeartHandshake size={19} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#2457C5]"
                />
              </div>

              <h3 className="mt-6 text-lg font-bold text-[#172033]">
                Campaigns
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                Discover community campaigns and opportunities for collective
                action.
              </p>
            </Link>

            <Link
              href="/resources/news"
              className="group rounded-2xl border border-slate-200 bg-[#FCFAF7] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/20 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                  <Lightbulb size={19} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#2457C5]"
                />
              </div>

              <h3 className="mt-6 text-lg font-bold text-[#172033]">
                Latest Updates
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                Follow news, notices and updates connected with our work.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT CTA
      ========================================================= */}

      <section className="bg-[#FCFAF7] py-24 sm:py-28 lg:py-32">
        <div className="container-main">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#55152B] px-7 py-14 text-center sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.045]" />

            <div className="pointer-events-none absolute -bottom-24 left-1/4 h-52 w-52 rounded-full bg-[#2457C5]/15 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <div className="mb-5 flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#2457C5]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                  Connect With Us
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Interested in this area of work?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Contact Lifeline Achham to learn more, discuss collaboration or
                explore how you can contribute.
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

                <a
                  href="mailto:lifelineachham@gmail.com"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <Mail size={16} />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BACK TO PROGRAMS
      ========================================================= */}

      <div className="border-t border-slate-200 bg-white">
        <div className="container-main py-6">
          <Link
            href="/work/programs"
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#2457C5]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />

            Back to all programs
          </Link>
        </div>
      </div>
    </main>
  );
}
