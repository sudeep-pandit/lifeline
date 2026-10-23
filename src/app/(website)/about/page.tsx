
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Users,
  HandHeart,
  Stethoscope,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";

const heroImage =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=2000&q=90";

type TimelineItem = {
  year: string;
  title: string;
  description: string;
  side: "left" | "right";
};

type AboutContent = {
  label: string;
  heading: string;
  introduction: string;
  description: string;
  imageUrl: string;
  timeline: TimelineItem[];
};

const defaultTimeline: TimelineItem[] = [
  {
    year: "2082 B.S.",
    title: "Lifeline Achham Begins",
    description:
      "A community-focused initiative dedicated to creating meaningful and sustainable social impact.",
    side: "left",
  },
  {
    year: "2082 B.S.",
    title: "Building Local Connections",
    description:
      "Working alongside people and communities to understand local needs and encourage collective action.",
    side: "right",
  },
  {
    year: "2082–2083 B.S.",
    title: "Expanding Community Work",
    description:
      "Developing initiatives that support awareness, health, empowerment and community wellbeing.",
    side: "left",
  },
  {
    year: "2083 B.S.",
    title: "Mobilizing for Change",
    description:
      "Bringing people together through campaigns, awareness activities and community participation.",
    side: "right",
  },
  {
    year: "2083 B.S. – Present",
    title: "Growing the Impact",
    description:
      "Continuing to build partnerships and create practical opportunities for positive community change.",
    side: "left",
  },
];

const defaultAboutContent: AboutContent = {
  label: "Who We Are",
  heading: "Working with communities, creating possibilities.",
  introduction:
    "Lifeline Achham is a community-focused organization working toward meaningful and sustainable social impact. Our approach is rooted in understanding local realities, listening to people and encouraging communities to participate in solutions that affect their lives.",
  description:
    "We believe meaningful change happens when people, communities and organizations work together. Through awareness, collaboration, community initiatives and purposeful action, we aim to contribute to a stronger and more empowered society.",
  imageUrl: "",
  timeline: defaultTimeline,
};

const focusAreas = [
  {
    icon: Stethoscope,
    title: "Health & Wellbeing",
    description:
      "Promoting awareness and community initiatives that contribute to healthier and safer lives.",
  },
  {
    icon: GraduationCap,
    title: "Education & Awareness",
    description:
      "Supporting knowledge-sharing and awareness activities that help communities make informed decisions.",
  },
  {
    icon: Users,
    title: "Community Empowerment",
    description:
      "Encouraging people to participate, collaborate and take ownership of positive local change.",
  },
  {
    icon: HandHeart,
    title: "Social Support",
    description:
      "Connecting people with meaningful support and opportunities to contribute to their communities.",
  },
];

const values = [
  {
    icon: HeartHandshake,
    title: "Community First",
    description:
      "We listen to communities and place their needs, dignity and participation at the center of our work.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "We value transparency, responsibility and trust in every relationship and activity.",
  },
  {
    icon: Lightbulb,
    title: "Purposeful Action",
    description:
      "We focus on practical initiatives that can create meaningful and sustainable outcomes.",
  },
  {
    icon: Sparkles,
    title: "Continuous Improvement",
    description:
      "We learn from experience and continuously look for better ways to serve communities.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function AboutPage() {
  const [about, setAbout] = useState<AboutContent>(defaultAboutContent);

  useEffect(() => {
    let cancelled = false;

    async function loadAboutContent() {
      try {
        const response = await fetch(
          "/api/content/public?key=home_about",
          {
            cache: "no-store",
          },
        );

        if (!response.ok) return;

        const result = await response.json();

        if (cancelled || !result.success || !result.data) return;

        const record = result.data;

        let savedContent: Record<string, unknown> = {};

        if (typeof record.content === "string") {
          try {
            const parsed: unknown = JSON.parse(record.content);

            if (
              parsed &&
              typeof parsed === "object" &&
              !Array.isArray(parsed)
            ) {
              savedContent = parsed as Record<string, unknown>;
            }
          } catch {
            // Use fallback text if the saved content is invalid JSON.
          }
        } else if (
          record.content &&
          typeof record.content === "object" &&
          !Array.isArray(record.content)
        ) {
          savedContent = record.content as Record<string, unknown>;
        }

        const timelineFromCms = Array.isArray(savedContent.timeline)
          ? savedContent.timeline
              .filter(
                (item): item is Record<string, unknown> =>
                  !!item &&
                  typeof item === "object" &&
                  !Array.isArray(item) &&
                  typeof item.year === "string" &&
                  typeof item.title === "string" &&
                  typeof item.description === "string",
              )
              .map((item, index): TimelineItem => ({
                year: item.year as string,
                title: item.title as string,
                description: item.description as string,
                side: index % 2 === 0 ? "left" : "right",
              }))
          : null;

        if (cancelled) return;

        setAbout({
          label:
            typeof record.excerpt === "string" && record.excerpt.trim()
              ? record.excerpt
              : defaultAboutContent.label,

          heading:
            typeof record.title === "string" && record.title.trim()
              ? record.title
              : defaultAboutContent.heading,

          introduction:
            typeof savedContent.introduction === "string"
              ? savedContent.introduction
              : defaultAboutContent.introduction,

          description:
            typeof savedContent.description === "string"
              ? savedContent.description
              : defaultAboutContent.description,

          imageUrl:
            typeof record.imageUrl === "string" ? record.imageUrl : "",

          timeline:
            timelineFromCms && timelineFromCms.length > 0
              ? timelineFromCms
              : defaultTimeline,
        });
      } catch (error) {
        console.error("Failed to load Who We Are content:", error);
      }
    }

    void loadAboutContent();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="overflow-hidden bg-[#FCFAF7]">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-[#55152B] pt-[112px]">
        <div className="relative h-[390px] w-full overflow-hidden sm:h-[430px] lg:h-[470px]">
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0"
          >
            <Image
              src={heroImage}
              alt="Community members working together"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-[#55152B]/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#55152B]/65 to-transparent" />

          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -right-24 -top-24 hidden h-80 w-80 rounded-full border-[45px] border-white/[0.045] lg:block"
          />

          <div className="container-main relative z-10 flex h-full items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mb-5 flex items-center gap-3"
              >
                <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E9B6C7]">
                  About Lifeline Achham
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Who We Are
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg"
              >
                Working alongside communities to promote health, awareness,
                empowerment and meaningful social impact.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mt-7 flex items-center gap-3 text-xs"
              >
                <Link
                  href="/"
                  className="text-white/60 transition hover:text-white"
                >
                  Home
                </Link>

                <span className="text-white/30">/</span>

                <Link
                  href="/about"
                  className="text-white/80 transition hover:text-white"
                >
                  About
                </Link>

                <span className="text-white/30">/</span>
                <span className="text-white/50">Who We Are</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION - CONNECTED TO home_about CMS */}
      <section className="section">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="mb-5 flex items-center gap-3">
                <span className="brand-line" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                  {about.label}
                </span>
              </div>

              <h2 className="max-w-xl text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                {about.heading}
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8 }}
              className="space-y-5"
            >
              {about.imageUrl.trim() && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {/* Supports CMS image URLs without requiring next.config remote domains. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={about.imageUrl}
                    alt={about.label || "Lifeline Achham community"}
                    className="max-h-80 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <p className="text-base leading-8 text-slate-600">
                {about.introduction}
              </p>

              <p className="text-base leading-8 text-slate-600">
                {about.description}
              </p>

              <div className="flex items-center gap-3 pt-3">
                <CheckCircle2
                  size={18}
                  className="shrink-0 text-[#2457C5]"
                />
                <span className="text-sm font-semibold text-[#172033]">
                  Community-centered. Purpose-driven. Future-focused.
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid gap-10 lg:grid-cols-[1fr_1.2fr]"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="mb-5 flex items-center gap-3">
                <span className="blue-dot" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2457C5]">
                  Our Approach
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Change begins with
                <span className="text-[#2457C5]"> participation.</span>
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-200 bg-[#FCFAF7] p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:p-9"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D]">
                <Users size={23} />
              </div>

              <h3 className="text-xl font-bold text-[#172033]">
                Community-centered action
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                We aim to work with people rather than simply work for them.
                By encouraging participation, collaboration and shared
                responsibility, we can help develop initiatives that are
                relevant to local communities and capable of creating lasting
                value.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  "Listen to communities",
                  "Understand local needs",
                  "Build meaningful partnerships",
                  "Create practical solutions",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2457C5]">
                      <CheckCircle2 size={14} />
                    </span>
                    <span className="text-sm font-medium text-slate-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* OUR JOURNEY - CONNECTED TO CMS TIMELINE */}
      <section className="section">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mb-4 flex items-center justify-center gap-3"
            >
              <span className="brand-line" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Our Journey
              </span>
              <span className="brand-line" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              Growing through
              <span className="text-[#7A1F3D]"> every step.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 text-sm leading-7 text-slate-500 sm:text-base"
            >
              Our journey continues through community initiatives,
              partnerships, learning and action.
            </motion.p>
          </motion.div>

          <div className="relative mx-auto mt-16 max-w-5xl">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 1.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: "top" }}
              className="absolute bottom-0 left-1/2 top-0 hidden w-px bg-gradient-to-b from-transparent via-[#7A1F3D]/30 to-transparent md:block"
            />

            <div className="space-y-7 md:space-y-0">
              {about.timeline.map((item, index) => {
                const isLeft = item.side === "left";

                return (
                  <motion.div
                    key={`${item.year}-${item.title}-${index}`}
                    initial={{
                      opacity: 0,
                      x: isLeft ? -50 : 50,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative md:grid md:min-h-[190px] md:grid-cols-2 md:items-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.08 + 0.15,
                      }}
                      className="absolute left-1/2 top-8 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-[#FCFAF7] bg-[#2457C5] shadow-[0_0_0_5px_rgba(36,87,197,0.08)] md:block"
                    />

                    <div
                      className={
                        isLeft
                          ? "md:col-start-1 md:pr-14"
                          : "md:col-start-2 md:pl-14"
                      }
                    >
                      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/20 hover:shadow-xl sm:p-7">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#7A1F3D]/15 bg-[#F7E9EE] px-3 py-2 text-xs font-extrabold tracking-wide text-[#7A1F3D] sm:text-sm">
                            <CalendarDays
                              size={15}
                              className="shrink-0"
                              aria-hidden="true"
                            />
                            <span>{item.year}</span>
                          </span>

                          <span className="text-xs font-semibold tracking-widest text-slate-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-[#172033] sm:text-xl">
                          {item.title}
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* AREAS WE CARE ABOUT */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="max-w-3xl"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mb-4 flex items-center gap-3"
            >
              <span className="blue-dot" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2457C5]">
                Areas We Care About
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              Focusing on what
              <span className="text-[#2457C5]"> matters.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base"
            >
              Our work is shaped around areas where collective action,
              awareness and community participation can create meaningful
              outcomes.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {focusAreas.map((area) => {
              const Icon = area.icon;

              return (
                <motion.div
                  key={area.title}
                  variants={fadeUp}
                  transition={{ duration: 0.6 }}
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.25 },
                  }}
                  className="group rounded-2xl border border-slate-200 bg-[#FCFAF7] p-6 transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5] transition group-hover:bg-[#2457C5] group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-[#172033]">
                    {area.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {area.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2457C5] opacity-0 transition group-hover:opacity-100">
                    Learn more
                    <ArrowRight size={13} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mb-4 flex items-center justify-center gap-3"
            >
              <span className="brand-line" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Our Values
              </span>
              <span className="brand-line" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              Principles that guide
              <span className="text-[#7A1F3D]"> our work.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 text-sm leading-7 text-slate-500 sm:text-base"
            >
              The way we work matters just as much as the work itself.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  variants={fadeUp}
                  transition={{ duration: 0.6 }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.25 },
                  }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-[#172033]">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="pb-20">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-2xl bg-[#55152B] px-7 py-12 sm:px-10 lg:px-14"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.05]" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[#2457C5]/20 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                    Be Part of the Change
                  </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Stronger communities begin with people who care.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">
                  Connect with Lifeline Achham, support our work or explore
                  opportunities to contribute to meaningful community
                  initiatives.
                </p>
              </div>

              <Link
                href="/contact"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-black/10 transition hover:bg-[#17439F]"
              >
                Get Involved
                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
