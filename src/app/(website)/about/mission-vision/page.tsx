"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Target,
  Users,
  Compass,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const heroImage =
  "https://images.unsplash.com/photo-1509099836639-18ba02c7f7c8?auto=format&fit=crop&w=2000&q=90";

const objectives = [
  {
    icon: Users,
    title: "Community Participation",
    description:
      "Encourage people and communities to actively participate in identifying needs and developing practical solutions.",
  },
  {
    icon: HeartHandshake,
    title: "Inclusive Support",
    description:
      "Promote initiatives that value dignity, inclusion, collaboration and equal opportunities.",
  },
  {
    icon: Lightbulb,
    title: "Awareness & Learning",
    description:
      "Create opportunities for knowledge-sharing, awareness and learning around issues affecting communities.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible Action",
    description:
      "Work with transparency, accountability and responsibility while delivering meaningful community initiatives.",
  },
];

const principles = [
  "People and communities at the center",
  "Respect, dignity and inclusion",
  "Collaboration over isolation",
  "Practical and purposeful action",
  "Transparency and accountability",
  "Learning and continuous improvement",
];

const commitments = [
  {
    number: "01",
    title: "Listen",
    description:
      "Understand community perspectives, experiences and priorities before taking action.",
  },
  {
    number: "02",
    title: "Collaborate",
    description:
      "Build meaningful relationships with people, organizations and community stakeholders.",
  },
  {
    number: "03",
    title: "Act",
    description:
      "Turn ideas into practical initiatives that respond to genuine community needs.",
  },
  {
    number: "04",
    title: "Learn",
    description:
      "Reflect on our work, learn from experience and continuously improve our approach.",
  },
];

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

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function MissionVisionPage() {
  return (
    <main className="overflow-hidden bg-[#FCFAF7]">
      {/* =========================================================
          HERO
      ========================================================= */}

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
              alt="People coming together for community development"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-[#55152B]/65" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#55152B]/65 to-transparent" />

          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 3, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -right-24 -top-24 hidden h-80 w-80 rounded-full border-[45px] border-white/[0.045] lg:block"
          />

          <div className="container-main relative z-10 flex h-full items-center">
            <motion.div
              variants={stagger}
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
                Mission & Vision
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg"
              >
                The purpose that guides our work and the future we aspire to
                help create.
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

                <span className="text-white/50">Mission & Vision</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================= */}

      <section className="section">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mb-5 flex items-center justify-center gap-3"
            >
              <span className="brand-line" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Our Direction
              </span>

              <span className="brand-line" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              Purpose that guides
              <span className="text-[#7A1F3D]"> our action.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-5 text-sm leading-8 text-slate-500 sm:text-base"
            >
              Our mission and vision provide a clear direction for the way we
              work with communities, partners and people who share our
              commitment to positive social change.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          MISSION + VISION
      ========================================================= */}

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Mission */}
            <motion.div
              initial={{
                opacity: 0,
                x: -45,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-[#7A1F3D]/10 bg-[#F7E9EE] p-8 sm:p-10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border-[25px] border-[#7A1F3D]/[0.06]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7A1F3D] text-white shadow-lg shadow-[#7A1F3D]/15">
                    <Target size={25} />
                  </div>

                  <span className="text-6xl font-black text-[#7A1F3D]/[0.08]">
                    01
                  </span>
                </div>

                <div className="mt-10">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                    Our Mission
                  </span>

                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                    Creating meaningful change through community action.
                  </h3>

                  <p className="mt-5 text-sm leading-8 text-slate-600">
                    Our mission is to work alongside communities to encourage
                    participation, promote awareness, support wellbeing and
                    develop practical initiatives that contribute to positive
                    and sustainable social impact.
                  </p>
                </div>

                <div className="mt-8 h-px w-full bg-[#7A1F3D]/10" />

                <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-[#7A1F3D]">
                  <CheckCircle2 size={18} />

                  <span>Purpose-driven community action</span>
                </div>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{
                opacity: 0,
                x: 45,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-[#2457C5]/10 bg-[#EEF4FF] p-8 sm:p-10"
            >
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full border-[25px] border-[#2457C5]/[0.06]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2457C5] text-white shadow-lg shadow-[#2457C5]/15">
                    <Eye size={25} />
                  </div>

                  <span className="text-6xl font-black text-[#2457C5]/[0.08]">
                    02
                  </span>
                </div>

                <div className="mt-10">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2457C5]">
                    Our Vision
                  </span>

                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                    Stronger, healthier and empowered communities.
                  </h3>

                  <p className="mt-5 text-sm leading-8 text-slate-600">
                    We envision communities where people have the awareness,
                    opportunities, support and confidence to participate in
                    shaping a healthier, safer and more empowered future.
                  </p>
                </div>

                <div className="mt-8 h-px w-full bg-[#2457C5]/10" />

                <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-[#2457C5]">
                  <CheckCircle2 size={18} />

                  <span>A future shaped through collaboration</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          OBJECTIVES
      ========================================================= */}

      <section className="section">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mb-4 flex items-center gap-3"
            >
              <span className="blue-dot" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2457C5]">
                Our Objectives
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              Turning purpose into
              <span className="text-[#2457C5]"> action.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base"
            >
              Our objectives help translate our broader mission into practical
              areas of work and community engagement.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {objectives.map((objective) => {
              const Icon = objective.icon;

              return (
                <motion.div
                  key={objective.title}
                  variants={fadeUp}
                  transition={{ duration: 0.6 }}
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.25 },
                  }}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5] transition group-hover:bg-[#2457C5] group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-[#172033]">
                    {objective.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {objective.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2457C5] opacity-0 transition group-hover:opacity-100">
                    Our focus
                    <ArrowRight size={13} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          PRINCIPLES
      ========================================================= */}

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="brand-line" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                  Our Principles
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                How we turn our
                <span className="text-[#7A1F3D]"> values into practice.</span>
              </h2>

              <p className="mt-5 text-sm leading-8 text-slate-500 sm:text-base">
                Our principles influence the decisions we make, the
                relationships we build and the way we approach every
                initiative.
              </p>

              <div className="mt-8">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]"
                >
                  Learn more about us
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="grid gap-3 sm:grid-cols-2"
            >
              {principles.map((principle, index) => (
                <motion.div
                  key={principle}
                  variants={fadeUp}
                  transition={{ duration: 0.55 }}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-[#FCFAF7] p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F7E9EE] text-[#7A1F3D]">
                    <CheckCircle2 size={15} />
                  </span>

                  <div>
                    <span className="text-[10px] font-bold text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="mt-1 text-sm font-semibold leading-6 text-[#172033]">
                      {principle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COMMITMENT / PROCESS
      ========================================================= */}

      <section className="section">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mb-4 flex items-center justify-center gap-3"
            >
              <span className="blue-dot" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2457C5]">
                Our Commitment
              </span>

              <span className="blue-dot" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              Listen. Collaborate.
              <span className="text-[#2457C5]"> Act. Learn.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 text-sm leading-7 text-slate-500 sm:text-base"
            >
              A simple approach that keeps our work connected to the people
              and communities we aim to serve.
            </motion.p>
          </motion.div>

          <div className="relative mt-14">
            {/* Connecting line */}
            <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-slate-200 lg:block" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {commitments.map((item) => (
                <motion.div
                  key={item.number}
                  variants={fadeUp}
                  transition={{ duration: 0.6 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#FCFAF7] bg-[#2457C5] text-sm font-bold text-white shadow-lg shadow-[#2457C5]/15">
                    {item.number}
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-[#172033]">
                    {item.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-slate-500">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="pb-20">
        <div className="container-main">
          <motion.div
            initial={{
              opacity: 0,
              y: 35,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-2xl bg-[#55152B] px-7 py-12 sm:px-10 lg:px-14"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.05]" />

            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[#2457C5]/20 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles
                    size={15}
                    className="text-[#2457C5]"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                    Be Part of the Journey
                  </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Let&apos;s build stronger communities together.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">
                  Whether through collaboration, volunteering, community
                  participation or support, every meaningful contribution can
                  help move our shared vision forward.
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
