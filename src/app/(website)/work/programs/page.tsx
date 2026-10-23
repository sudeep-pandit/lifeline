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
} from "lucide-react";
import { motion } from "framer-motion";

const heroImage =
  "https://images.unsplash.com/photo-1494386346843-e12284507169?auto=format&fit=crop&w=2000&q=90";

const programs = [
  {
    id: "01",
    title: "Community Wellbeing",
    category: "Community Development",
    description:
      "A flexible program area focused on supporting healthier, safer and more connected communities.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=90",
    icon: HeartHandshake,
  },
  {
    id: "02",
    title: "Youth & Education",
    category: "Education & Youth",
    description:
      "Supporting opportunities that encourage learning, participation, confidence and positive development among young people.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=90",
    icon: Lightbulb,
  },
  {
    id: "03",
    title: "Health & Awareness",
    category: "Health",
    description:
      "Community-focused activities that promote awareness, participation and access to health-related information.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=90",
    icon: ShieldCheck,
  },
  {
    id: "04",
    title: "Community Participation",
    category: "Participation",
    description:
      "Creating opportunities for people to contribute, collaborate and take part in initiatives that matter to their communities.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=90",
    icon: Users,
  },
];

const focusAreas = [
  {
    number: "01",
    title: "People",
    description:
      "Keeping people, participation and community needs at the center of our work.",
  },
  {
    number: "02",
    title: "Opportunity",
    description:
      "Supporting opportunities that can strengthen knowledge, confidence and local capacity.",
  },
  {
    number: "03",
    title: "Wellbeing",
    description:
      "Encouraging healthier, safer and more supportive community environments.",
  },
  {
    number: "04",
    title: "Partnership",
    description:
      "Building cooperation with people and organizations around shared objectives.",
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
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

export default function ProgramsPage() {
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
              alt="Community program"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-[#55152B]/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#55152B]/60 to-transparent" />

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
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-3xl"
            >
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mb-5 flex items-center gap-3"
              >
                <span className="h-2 w-2 rounded-full bg-[#2457C5]" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E9B6C7]">
                  Our Work
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Programs
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg"
              >
                Structured areas of work designed to support community needs,
                participation and meaningful long-term progress.
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
                  href="/work"
                  className="text-white/60 transition hover:text-white"
                >
                  Our Work
                </Link>

                <span className="text-white/30">/</span>

                <span className="text-white/50">Programs</span>
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
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              variants={stagger}
            >
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mb-5 flex items-center gap-3"
              >
                <span className="brand-line" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                  Our Programs
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
              >
                Organized around
                <span className="text-[#7A1F3D]"> community needs.</span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mt-6 text-sm leading-8 text-slate-500 sm:text-base"
              >
                Our programs provide a structure for organizing sustained work
                around areas that can contribute to stronger and more
                supportive communities.
              </motion.p>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mt-4 text-sm leading-8 text-slate-500 sm:text-base"
              >
                Each program can bring together activities, projects,
                partnerships and campaigns under a clear area of focus.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
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
              className="relative"
            >
              <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="relative h-[330px] overflow-hidden rounded-2xl sm:h-[390px]">
                  <Image
                    src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=90"
                    alt="People participating in a community activity"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/60 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="rounded-2xl border border-white/20 bg-white/90 p-5 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2457C5] text-white">
                          <Users size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#172033]">
                            People at the center
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Participation guides meaningful work.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-5 -left-5 h-20 w-20 rounded-full border border-[#7A1F3D]/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PROGRAM DIRECTORY
      ========================================================= */}

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
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
                Program Areas
              </span>

              <span className="blue-dot" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              Explore our
              <span className="text-[#2457C5]"> programs.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 text-sm leading-7 text-slate-500 sm:text-base"
            >
              These program areas are structured to be expanded and managed
              through the Lifeline Achham CMS.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.1,
            }}
            variants={stagger}
            className="mt-12 grid gap-6 md:grid-cols-2"
          >
            {programs.map((program) => {
              const Icon = program.icon;

              return (
                <motion.article
                  key={program.id}
                  variants={fadeUp}
                  transition={{ duration: 0.65 }}
                  whileHover={{
                    y: -5,
                    transition: {
                      duration: 0.25,
                    },
                  }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#FCFAF7] shadow-sm transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="grid sm:grid-cols-[0.85fr_1fr]">
                    <div className="relative h-[250px] overflow-hidden sm:h-full sm:min-h-[310px]">
                      <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 42vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/65 via-transparent to-transparent" />

                      <div className="absolute left-5 top-5">
                        <span className="rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7A1F3D] shadow-sm backdrop-blur">
                          {program.category}
                        </span>
                      </div>

                      <div className="absolute bottom-5 left-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2457C5] text-white">
                        <Icon size={18} />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center p-7">
                      <span className="text-[10px] font-bold tracking-[0.18em] text-slate-400">
                        PROGRAM {program.id}
                      </span>

                      <h3 className="mt-3 text-xl font-bold text-[#172033]">
                        {program.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-500">
                        {program.description}
                      </p>

                      <Link
                        href={`/work/programs/${program.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "")}`}
                        className="group/link mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-[#2457C5]"
                      >
                        View program

                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover/link:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          FOCUS AREAS
      ========================================================= */}

      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1fr] lg:gap-20">
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
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
                  Program Focus
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                What shapes our
                <span className="text-[#7A1F3D]"> programs?</span>
              </h2>

              <p className="mt-5 text-sm leading-8 text-slate-500 sm:text-base">
                While individual programs may have different objectives, our
                broader approach remains centered around people, opportunity,
                wellbeing and collaboration.
              </p>

              <Link
                href="/about/mission-vision"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]"
              >
                Learn about our mission

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              variants={stagger}
              className="grid gap-4 sm:grid-cols-2"
            >
              {focusAreas.map((area) => (
                <motion.div
                  key={area.number}
                  variants={fadeUp}
                  transition={{ duration: 0.55 }}
                  whileHover={{
                    y: -4,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7E9EE] text-xs font-bold text-[#7A1F3D]">
                      {area.number}
                    </span>

                    <span className="h-1.5 w-1.5 rounded-full bg-[#2457C5]" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#172033]">
                    {area.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    {area.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CMS READY SECTION
      ========================================================= */}

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
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
                <span className="blue-dot" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2457C5]">
                  Built for Growth
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Ready for a
                <span className="text-[#2457C5]"> living CMS.</span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-500 sm:text-base">
                The program structure is intentionally designed so that
                administrators can later add, edit, publish and organize
                programs without changing the frontend layout.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Program title & category",
                  "Featured image",
                  "Description & objectives",
                  "Status & visibility",
                  "Program detail page",
                  "Related projects & campaigns",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#FCFAF7] px-4 py-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2457C5]">
                      ✓
                    </span>

                    <span className="text-xs font-medium text-slate-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
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
              className="rounded-3xl bg-[#55152B] p-8 sm:p-10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                <Lightbulb size={22} />
              </div>

              <h3 className="mt-7 text-2xl font-bold text-white">
                One structure.
                <br />
                Many possibilities.
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/65">
                As the organization grows, the CMS can connect each program
                with projects, campaigns, news, gallery items and reports.
              </p>

              <div className="mt-8 h-px bg-white/10" />

              <div className="mt-6 flex items-center justify-between text-xs">
                <span className="text-white/45">
                  Future CMS architecture
                </span>

                <span className="font-bold text-[#E9B6C7]">
                  Flexible
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="bg-[#FCFAF7] pb-24 sm:pb-28 lg:pb-32">
        <div className="container-main">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#55152B] px-7 py-14 text-center sm:px-12 sm:py-16 lg:px-16 lg:py-20"
          >
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
                Be part of meaningful community work.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Connect with Lifeline Achham to learn more about our work,
                explore collaboration opportunities or find a meaningful way
                to contribute.
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
                  href="/work"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Back to Our Work

                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
