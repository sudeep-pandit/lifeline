
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  HeartHandshake,
  Megaphone,
  MoveRight,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const heroImage =
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=2000&q=90";

const workAreas = [
  {
    number: "01",
    title: "Programs",
    shortTitle: "Long-term Work",
    description:
      "Structured areas of work designed to address community needs and support meaningful, sustainable progress.",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba02c7f7c8?auto=format&fit=crop&w=1200&q=90",
    icon: Target,
    href: "/work/programs",
  },
  {
    number: "02",
    title: "Projects",
    shortTitle: "Focused Initiatives",
    description:
      "Specific initiatives developed around defined objectives, activities and community-focused outcomes.",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=90",
    icon: BarChart3,
    href: "/work/projects",
  },
  {
    number: "03",
    title: "Campaigns",
    shortTitle: "Collective Action",
    description:
      "Community campaigns that bring people together around awareness, participation and meaningful action.",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=90",
    icon: Megaphone,
    href: "/work/campaigns",
  },
];

const approach = [
  {
    number: "01",
    title: "Listen",
    description:
      "Understanding communities, their experiences and the needs that matter to them.",
  },
  {
    number: "02",
    title: "Collaborate",
    description:
      "Working with people, local stakeholders and partners to develop meaningful responses.",
  },
  {
    number: "03",
    title: "Act",
    description:
      "Turning ideas into practical initiatives, programs and community activities.",
  },
  {
    number: "04",
    title: "Learn",
    description:
      "Reflecting on our work and using experience to improve what we do next.",
  },
];

const workPrinciples = [
  {
    icon: Users,
    title: "Community Centered",
    description:
      "We keep community needs and participation at the heart of our approach.",
  },
  {
    icon: HeartHandshake,
    title: "Collaborative",
    description:
      "We value cooperation and believe stronger outcomes come from working together.",
  },
  {
    icon: Sparkles,
    title: "Purpose Driven",
    description:
      "We focus our efforts on work that can contribute to meaningful and positive change.",
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
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

export default function OurWorkPage() {
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
              alt="Community members working together"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-[#55152B]/70" />

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
                  What We Do
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Our Work
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg"
              >
                Working with communities through programs, projects and
                campaigns designed to support meaningful and sustainable
                change.
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

                <span className="text-white/50">Our Work</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRODUCTION
      ========================================================= */}

      <section className="section">
        <div className="container-main">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
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
                  Our Approach
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
              >
                Turning purpose into
                <span className="text-[#7A1F3D]"> action.</span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mt-6 text-sm leading-8 text-slate-500 sm:text-base"
              >
                Our work is shaped around practical community needs. We aim to
                support initiatives that encourage participation, strengthen
                local capacity and contribute to positive social outcomes.
              </motion.p>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mt-4 text-sm leading-8 text-slate-500 sm:text-base"
              >
                Programs, projects and campaigns give us different ways to
                organize our efforts while keeping our overall purpose at the
                center.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mt-8"
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-sm font-bold text-[#2457C5] transition hover:text-[#17439F]"
                >
                  Work with us

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
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
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="relative h-[350px] overflow-hidden rounded-2xl sm:h-[410px]">
                  <Image
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=90"
                    alt="People collaborating on community work"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/65 via-transparent to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="rounded-2xl border border-white/20 bg-white/90 p-5 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A1F3D] text-white">
                          <HeartHandshake size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#172033]">
                            Community-focused work
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            People, purpose and practical action.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-5 -left-5 h-20 w-20 rounded-full border border-[#7A1F3D]/10" />

              <div className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-2xl border border-[#2457C5]/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WORK AREAS
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
                Areas of Work
              </span>

              <span className="blue-dot" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              Three ways we turn ideas into
              <span className="text-[#2457C5]"> action.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 text-sm leading-7 text-slate-500 sm:text-base"
            >
              Explore the main ways Lifeline Achham can organize and deliver
              community-focused work.
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
            className="mt-12 grid gap-6 lg:grid-cols-3"
          >
            {workAreas.map((area) => {
              const Icon = area.icon;

              return (
                <motion.article
                  key={area.number}
                  variants={fadeUp}
                  transition={{ duration: 0.65 }}
                  whileHover={{
                    y: -6,
                    transition: {
                      duration: 0.25,
                    },
                  }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#FCFAF7] shadow-sm transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="relative h-[250px] overflow-hidden">
                    <Image
                      src={area.image}
                      alt={area.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/70 via-[#172033]/10 to-transparent" />

                    <div className="absolute left-5 top-5 flex items-center gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7A1F3D] shadow-sm backdrop-blur">
                        {area.shortTitle}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#2457C5] text-white shadow-lg">
                      <Icon size={19} />
                    </div>

                    <span className="absolute bottom-5 right-5 text-xs font-bold tracking-[0.18em] text-white/60">
                      {area.number}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#172033]">
                      {area.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {area.description}
                    </p>

                    <Link
                      href={area.href}
                      className="group/link mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]"
                    >
                      Explore {area.title}

                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          HOW WE WORK
      ========================================================= */}

      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
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
              className="lg:sticky lg:top-32 lg:self-start"
            >
              <div className="rounded-3xl bg-[#55152B] p-8 sm:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                  <Target size={22} />
                </div>

                <h2 className="mt-7 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  A thoughtful approach to community work.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/65">
                  Meaningful work begins with understanding. We aim to listen,
                  collaborate, act responsibly and learn from every experience.
                </p>

                <div className="mt-8 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#2457C5]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                    Listen • Collaborate • Act • Learn
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              variants={stagger}
            >
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                  How We Work
                </span>

                <h3 className="mt-3 text-2xl font-bold text-[#172033]">
                  From understanding to action.
                </h3>
              </motion.div>

              <div className="relative space-y-5">
                <div className="absolute bottom-8 left-[22px] top-8 hidden w-px bg-slate-200 sm:block" />

                {approach.map((item) => (
                  <motion.div
                    key={item.number}
                    variants={fadeUp}
                    transition={{ duration: 0.55 }}
                    className="relative flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                  >
                    <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7E9EE] text-sm font-bold text-[#7A1F3D]">
                      {item.number}
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-[#172033]">
                        {item.title}
                      </h4>

                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WORK PRINCIPLES
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
              <span className="brand-line" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                What Guides Us
              </span>

              <span className="brand-line" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              Work grounded in
              <span className="text-[#7A1F3D]"> purpose.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            variants={stagger}
            className="mt-12 grid gap-5 md:grid-cols-3"
          >
            {workPrinciples.map((principle) => {
              const Icon = principle.icon;

              return (
                <motion.article
                  key={principle.title}
                  variants={fadeUp}
                  transition={{ duration: 0.6 }}
                  whileHover={{
                    y: -5,
                    transition: {
                      duration: 0.25,
                    },
                  }}
                  className="rounded-2xl border border-slate-200 bg-[#FCFAF7] p-7 text-center"
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
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          FEATURED WORK PLACEHOLDER
      ========================================================= */}

      <section className="section">
        <div className="container-main">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
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
              className="relative order-2 lg:order-1"
            >
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="relative h-[330px] overflow-hidden rounded-2xl sm:h-[400px]">
                  <Image
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=90"
                    alt="Community-focused initiative"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#55152B]/65 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="rounded-2xl border border-white/20 bg-white/90 p-4 backdrop-blur-md">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7A1F3D]">
                        Featured Work
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#172033]">
                        Community initiative
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              variants={stagger}
              className="order-1 lg:order-2"
            >
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mb-5 flex items-center gap-3"
              >
                <span className="brand-line" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                  Featured Work
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
              >
                Explore what we are
                <span className="text-[#7A1F3D]"> working on.</span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mt-5 text-sm leading-8 text-slate-500 sm:text-base"
              >
                This space can highlight current or featured initiatives,
                allowing visitors to quickly discover the work that is most
                relevant at a particular time.
              </motion.p>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mt-4 text-sm leading-8 text-slate-500 sm:text-base"
              >
                Once the CMS is connected, this section can automatically
                display selected programs, projects or campaigns.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mt-7"
              >
                <Link
                  href="/work/projects"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#2457C5]/15 transition hover:bg-[#17439F]"
                >
                  Explore Our Work

                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.div>
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

            <div className="pointer-events-none absolute left-[22%] top-12 h-2 w-2 rounded-full bg-[#2457C5]/60" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <div className="mb-5 flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#2457C5]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                  Get Involved
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[42px]">
                Meaningful work starts with people.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Whether you want to volunteer, collaborate, support an
                initiative or simply learn more about our work, there is a way
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
                  href="/blood-donation"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Blood Donation

                  <MoveRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
