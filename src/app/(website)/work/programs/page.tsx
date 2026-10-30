
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Users,
  BookOpen,
  HandHeart,
  Leaf,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Target,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

type CMSProgram = {
  id: string;
  title: string;
  key: string;
  slug: string | null;
  type: "PAGE" | "SECTION";
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type PublicContentResponse = {
  success?: boolean;
  data?: CMSProgram[] | CMSProgram | null;
  message?: string;
};

const heroImage =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=2000&q=85";

const focusAreas = [
  {
    number: "01",
    title: "Community Wellbeing",
    description:
      "Strengthening communities through inclusive support, awareness, and locally driven development.",
    icon: HeartHandshake,
  },
  {
    number: "02",
    title: "Education & Awareness",
    description:
      "Encouraging learning, informed decisions, and opportunities for children and young people.",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Health & Human Dignity",
    description:
      "Promoting health awareness, mutual care, and access to community-based support.",
    icon: HandHeart,
  },
  {
    number: "04",
    title: "Sustainable Development",
    description:
      "Supporting practical, locally relevant initiatives that help communities build a stronger future.",
    icon: Leaf,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function getProgramDescription(program: CMSProgram) {
  return (
    program.excerpt?.trim() ||
    program.content?.trim() ||
    "Discover how Lifeline Achham works alongside communities to create meaningful and sustainable change."
  );
}

function getProgramHref(program: CMSProgram) {
  if (program.slug?.trim()) {
    return `/work/programs/${program.slug}`;
  }

  return null;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<CMSProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPrograms = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/content/public", {
        method: "GET",
        cache: "no-store",
        signal,
        headers: {
          Accept: "application/json",
        },
      });

      const result: PublicContentResponse = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to load programs at this time.",
        );
      }

      const items = Array.isArray(result.data) ? result.data : [];

      const publishedPrograms = items
        .filter(
          (item) =>
            typeof item.key === "string" &&
            item.key.startsWith("program_"),
        )
        .sort((a, b) => a.sortOrder - b.sortOrder);

      if (!signal?.aborted) {
        setPrograms(publishedPrograms);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      if (!signal?.aborted) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading programs.",
        );
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void loadPrograms(controller.signal);

    return () => controller.abort();
  }, [loadPrograms]);

  return (
    <main className="overflow-hidden bg-[#FCFAF7] text-[#172033]">
      {/* HERO */}
      <section className="relative isolate min-h-[570px] overflow-hidden bg-[#55152B] sm:min-h-[640px] lg:min-h-[700px]">
        <Image
          src={heroImage}
          alt="Community members working together"
          fill
          priority
          sizes="100vw"
          unoptimized
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#310B1B]/95 via-[#55152B]/80 to-[#55152B]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#310B1B]/60 via-transparent to-[#310B1B]/10" />

        <div className="relative mx-auto flex min-h-[570px] max-w-7xl items-center px-5 py-24 sm:min-h-[640px] sm:px-8 lg:min-h-[700px] lg:px-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div
              variants={fadeUp}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md sm:text-sm"
            >
              <span className="h-2 w-2 rounded-full bg-[#F4B7C9]" />
              Our Work · Programs
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Turning community needs into{" "}
              <span className="text-[#F4B7C9]">lasting impact.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg sm:leading-9"
            >
              Lifeline Achham works with communities to advance wellbeing,
              opportunity, and sustainable development through meaningful,
              people-centred initiatives.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#program-directory"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#55152B] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#FCFAF7]"
              >
                Explore our programs
                <ArrowRight size={17} />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Work with us
                <ArrowUpRight size={17} />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/20 pt-6 text-sm text-white/75"
            >
              <span className="inline-flex items-center gap-2">
                <Users size={17} />
                Community-centred
              </span>
              <span className="inline-flex items-center gap-2">
                <Target size={17} />
                Impact-focused
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={17} />
                Accountability-driven
              </span>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#7A1F3D] via-[#F4B7C9] to-[#2457C5]" />
      </section>

      {/* INTRODUCTION */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]"
            >
              What guides our work
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#172033] sm:text-4xl lg:text-5xl"
            >
              Practical action.
              <span className="block text-[#7A1F3D]">
                Meaningful change.
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="space-y-5"
          >
            <motion.p
              variants={fadeUp}
              className="text-base leading-8 text-slate-600 sm:text-lg"
            >
              We believe sustainable progress begins when communities are
              listened to, included in decisions, and supported with practical
              opportunities to shape their own future.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-base leading-8 text-slate-600"
            >
              Our programs provide a framework for turning that belief into
              action. Each initiative is designed around community priorities,
              collaboration, responsible implementation, and learning from
              experience.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex items-start gap-4 rounded-2xl border border-[#7A1F3D]/10 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7A1F3D]/10 text-[#7A1F3D]">
                <Lightbulb size={23} />
              </div>
              <div>
                <h3 className="font-bold text-[#172033]">
                  Designed around people
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  We value local knowledge, inclusive participation, and
                  solutions shaped by the communities they serve.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PROGRAM DIRECTORY */}
      <section
        id="program-directory"
        className="scroll-mt-24 border-y border-slate-200/70 bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"
          >
            <div className="max-w-2xl">
              <motion.p
                variants={fadeUp}
                className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]"
              >
                Our program directory
              </motion.p>

              <motion.h2
                variants={fadeUp}
                className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl lg:text-5xl"
              >
                Where our work begins
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-xl text-base leading-7 text-slate-600"
              >
                Explore our published programs and learn more about the
                initiatives we share with our communities.
              </motion.p>
            </div>

            <motion.div
              variants={fadeUp}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-[#FCFAF7] px-4 py-3 text-sm font-medium text-slate-600"
            >
              <Sparkles size={17} className="text-[#7A1F3D]" />
              <span>
                {loading
                  ? "Loading programs"
                  : `${programs.length} published ${
                      programs.length === 1 ? "program" : "programs"
                    }`}
              </span>
            </motion.div>
          </motion.div>

          {/* Loading state */}
          {loading && (
            <div
              role="status"
              aria-live="polite"
              className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-[#FCFAF7] px-6 py-12 text-center"
            >
              <LoaderCircle
                size={34}
                className="animate-spin text-[#7A1F3D]"
              />
              <p className="mt-4 font-semibold text-[#172033]">
                Loading our programs
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Please wait while we retrieve the latest published content.
              </p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div
              role="alert"
              className="rounded-3xl border border-red-200 bg-red-50 p-6 sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                  <AlertCircle size={22} />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-red-900">
                    We could not load the programs
                  </h3>
                  <p className="mt-2 break-words text-sm leading-6 text-red-800">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() => void loadPrograms()}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#55152B]"
                  >
                    <RefreshCw size={16} />
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && programs.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-[#FCFAF7] px-6 py-14 text-center sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7A1F3D]/10 text-[#7A1F3D]">
                <HeartHandshake size={30} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#172033]">
                Our programs are being prepared
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600">
                Program information will appear here once it has been
                published through the Lifeline Achham content management
                system.
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#55152B]"
              >
                Contact Lifeline Achham
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* Published program cards */}
          {!loading && !error && programs.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
              {programs.map((program, index) => {
                const href = getProgramHref(program);

                return (
                  <motion.article
                    key={program.id}
                    variants={fadeUp}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#7A1F3D]/25 hover:shadow-xl hover:shadow-[#55152B]/5"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#FCFAF7]">
                      {program.imageUrl ? (
                        <img
                          src={program.imageUrl}
                          alt={program.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#7A1F3D]/10 via-[#FCFAF7] to-[#2457C5]/10">
                          <HeartHandshake
                            size={43}
                            strokeWidth={1.4}
                            className="text-[#7A1F3D]/60"
                          />
                          <span className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Lifeline Achham
                          </span>
                        </div>
                      )}

                      <div className="absolute left-4 top-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A1F3D] shadow-sm backdrop-blur-md">
                          {program.isFeatured && (
                            <Sparkles size={12} />
                          )}
                          {program.isFeatured
                            ? "Featured program"
                            : "Our program"}
                        </span>
                      </div>

                      <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/90 text-xs font-bold text-[#7A1F3D] shadow-sm backdrop-blur-md">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7A1F3D]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#7A1F3D]" />
                        Community program
                      </div>

                      <h3 className="text-xl font-bold leading-snug text-[#172033] transition-colors group-hover:text-[#7A1F3D]">
                        {program.title}
                      </h3>

                      <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-7 text-slate-600">
                        {getProgramDescription(program)}
                      </p>

                      <div className="mt-6 border-t border-slate-100 pt-4">
                        {href ? (
                          <Link
                            href={href}
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#7A1F3D] transition hover:gap-3"
                          >
                            Explore program
                            <ArrowRight size={16} />
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400">
                            <CalendarDays size={15} />
                            Program information
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}

          {!loading && !error && programs.length > 0 && (
            <p className="mt-8 text-center text-xs leading-6 text-slate-500">
              Showing published programs managed by Lifeline Achham.
            </p>
          )}
        </div>
      </section>

      {/* FOCUS AREAS */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]"
            >
              Our areas of focus
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              Guided by community priorities
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-7 text-slate-600"
            >
              Our approach centres on inclusion, collaboration, responsible
              action, and the long-term wellbeing of the communities we serve.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {focusAreas.map((area) => {
              const Icon = area.icon;

              return (
                <motion.article
                  key={area.number}
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#7A1F3D]/20 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7A1F3D]/10 text-[#7A1F3D]">
                      <Icon size={23} />
                    </div>
                    <span className="text-sm font-bold text-slate-300">
                      {area.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-[#172033]">
                    {area.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {area.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CMS INFORMATION */}
      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#172033]">
          <div className="grid lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="p-7 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80">
                <Sparkles size={14} className="text-[#F4B7C9]" />
                Community-led approach
              </div>

              <h2 className="mt-5 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl">
                Every program starts with understanding what matters to people.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                We aim to work transparently, listen to local voices, and
                continuously improve our initiatives through collaboration
                and learning.
              </p>
            </div>

            <div className="border-t border-white/10 p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#F4B7C9]">
                <ShieldCheck size={28} />
              </div>

              <p className="mt-5 text-sm font-semibold text-white">
                Transparency & accountability
              </p>

              <p className="mt-2 max-w-xs text-sm leading-6 text-white/60">
                Clear information, responsible implementation, and a focus on
                meaningful community outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="relative overflow-hidden bg-[#7A1F3D] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-5 -top-12 h-52 w-52 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-36 left-[15%] h-72 w-72 rounded-full bg-white/[0.04] blur-2xl" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-center"
        >
          <div className="max-w-2xl">
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-[0.2em] text-white/70"
            >
              Be part of the change
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Let&apos;s create a stronger future, together.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-base leading-8 text-white/80"
            >
              Have an idea, want to collaborate, or looking for ways to
              support our work? We would love to hear from you.
            </motion.p>
          </div>

          <motion.div
            variants={fadeUp}
            className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#55152B] transition hover:-translate-y-0.5 hover:bg-[#FCFAF7]"
            >
              Get in touch
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              About Lifeline Achham
              <ArrowUpRight size={17} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
