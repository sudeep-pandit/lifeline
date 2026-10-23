"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  FolderOpen,
  HeartHandshake,
  LockKeyhole,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const heroImage =
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=90";

const principles = [
  {
    icon: ShieldCheck,
    title: "Accountability",
    description:
      "We aim to maintain clear responsibilities, responsible decision-making and a culture of accountability across our work.",
  },
  {
    icon: Scale,
    title: "Responsible Governance",
    description:
      "Good governance helps ensure that organizational decisions remain responsible, considered and aligned with our purpose.",
  },
  {
    icon: FileText,
    title: "Clear Documentation",
    description:
      "Important organizational information, reports and supporting documents can be organized and maintained for appropriate access.",
  },
  {
    icon: HeartHandshake,
    title: "Community Trust",
    description:
      "We value openness and respectful communication because lasting community relationships are built on trust.",
  },
];

const transparencyAreas = [
  {
    number: "01",
    title: "Governance",
    description:
      "Information about organizational leadership, responsibilities and governance structures can be maintained and shared through appropriate channels.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Financial Accountability",
    description:
      "Financial records and supporting information should be maintained responsibly and made available where appropriate and permitted.",
    icon: Scale,
  },
  {
    number: "03",
    title: "Programs & Activities",
    description:
      "Information about programs, projects and community activities can be documented so stakeholders can understand the work being carried out.",
    icon: FolderOpen,
  },
  {
    number: "04",
    title: "Policies & Documents",
    description:
      "Relevant policies, publications and organizational documents can be maintained in a clear and accessible structure.",
    icon: FileText,
  },
];

const documentTypes = [
  "Annual Reports",
  "Financial Reports",
  "Organizational Policies",
  "Project Reports",
  "Publications",
  "Other Official Documents",
];

const commitments = [
  "Maintain responsible organizational records.",
  "Communicate information clearly and respectfully.",
  "Document programs, activities and organizational decisions appropriately.",
  "Protect confidential and sensitive information.",
  "Make relevant public information easier to access.",
  "Continue improving transparency and accountability practices.",
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

export default function TransparencyPage() {
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
              alt="Documents representing transparency and accountability"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-[#55152B]/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#55152B]/70 to-transparent" />

          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 4, 0],
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
                Transparency
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg"
              >
                Openness, accountability and responsible governance are
                important foundations for meaningful community work.
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

                <span className="text-white/50">Transparency</span>
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
                  Our Commitment
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
              >
                Building trust through
                <span className="text-[#7A1F3D]"> openness.</span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mt-6 text-sm leading-8 text-slate-500 sm:text-base"
              >
                Transparency is an important part of responsible
                organizational practice. We believe stakeholders should be
                able to understand our purpose, activities, governance and
                approach to accountability.
              </motion.p>

              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mt-4 text-sm leading-8 text-slate-500 sm:text-base"
              >
                As Lifeline Achham develops its programs and systems, relevant
                information can be organized and published through appropriate
                channels while respecting privacy, confidentiality and
                applicable requirements.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="mt-8 flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D]">
                  <LockKeyhole size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#172033]">
                    Responsible information sharing
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Openness while respecting privacy and confidentiality.
                  </p>
                </div>
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
                <div className="relative h-[360px] overflow-hidden rounded-2xl sm:h-[420px]">
                  <Image
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=90"
                    alt="Financial and organizational documentation"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/65 via-transparent to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="rounded-2xl border border-white/20 bg-white/90 p-5 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2457C5] text-white">
                          <FileText size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#172033]">
                            Information & Records
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Organized for clarity and accountability.
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
          PRINCIPLES
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
                Our Principles
              </span>

              <span className="blue-dot" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              Accountability in
              <span className="text-[#2457C5]"> practice.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 text-sm leading-7 text-slate-500 sm:text-base"
            >
              The principles that guide how we organize information, work with
              stakeholders and approach our responsibilities.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            variants={stagger}
            className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          >
            {principles.map((principle) => {
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
                  className="rounded-2xl border border-slate-200 bg-[#FCFAF7] p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                    <Icon size={20} />
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
          TRANSPARENCY AREAS
      ========================================================= */}

      <section className="section">
        <div className="container-main">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mb-4 flex items-center gap-3"
            >
              <span className="brand-line" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Transparency Areas
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              Information that helps
              <span className="text-[#7A1F3D]"> build confidence.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base"
            >
              Our transparency framework can cover the areas that matter most
              to stakeholders, partners, volunteers and the communities we
              serve.
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
            className="mt-12 grid gap-5 md:grid-cols-2"
          >
            {transparencyAreas.map((area) => {
              const Icon = area.icon;

              return (
                <motion.article
                  key={area.number}
                  variants={fadeUp}
                  transition={{ duration: 0.6 }}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#2457C5]/20 hover:shadow-xl hover:shadow-slate-900/[0.04]"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D] transition-colors group-hover:bg-[#7A1F3D] group-hover:text-white">
                      <Icon size={19} />
                    </div>

                    <span className="text-xs font-bold tracking-[0.15em] text-slate-300">
                      {area.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#172033]">
                    {area.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {area.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#2457C5]">
                    <span>Learn more</span>
                    <ArrowRight size={14} />
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          DOCUMENTS
      ========================================================= */}

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:gap-20">
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
                  Reports & Documents
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                A clear place for
                <span className="text-[#2457C5]"> important records.</span>
              </h2>

              <p className="mt-5 text-sm leading-8 text-slate-500 sm:text-base">
                As organizational documents become available, they can be
                presented here in a structured and accessible format. This
                section is designed to connect directly with the future CMS.
              </p>

              <Link
                href="/resources/reports"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5] transition hover:text-[#17439F]"
              >
                View reports and resources

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
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
              className="grid gap-3 sm:grid-cols-2"
            >
              {documentTypes.map((document, index) => (
                <div
                  key={document}
                  className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-[#FCFAF7] p-4 transition hover:border-[#2457C5]/20 hover:bg-[#EEF4FF]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#7A1F3D] shadow-sm">
                    <FileText size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#172033]">
                      {document}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-slate-400">
                      {String(index + 1).padStart(2, "0")} • Resource
                    </p>
                  </div>

                  <ArrowUpRight
                    size={15}
                    className="ml-auto shrink-0 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#2457C5]"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COMMITMENTS
      ========================================================= */}

      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
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
              transition={{ duration: 0.8 }}
              className="lg:sticky lg:top-32 lg:self-start"
            >
              <div className="rounded-3xl bg-[#55152B] p-8 sm:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                  <ShieldCheck size={22} />
                </div>

                <h2 className="mt-7 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Our commitment to responsible practice.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/65">
                  Transparency is an ongoing process. We aim to continuously
                  strengthen the way information is documented, managed and
                  communicated.
                </p>

                <div className="mt-8 h-px bg-white/10" />

                <div className="mt-6 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#2457C5]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                    Lifeline Achham
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
                className="mb-7"
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                  Our Commitments
                </span>

                <h3 className="mt-3 text-2xl font-bold text-[#172033]">
                  What responsible practice means to us.
                </h3>
              </motion.div>

              <div className="space-y-3">
                {commitments.map((commitment, index) => (
                  <motion.div
                    key={commitment}
                    variants={fadeUp}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.04,
                    }}
                    className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-[#2457C5]"
                    />

                    <p className="text-sm leading-6 text-slate-600">
                      {commitment}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT CTA
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
            transition={{ duration: 0.8 }}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#55152B] px-7 py-14 text-center sm:px-12 sm:py-16 lg:px-16 lg:py-20"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.045]" />

            <div className="pointer-events-none absolute -bottom-24 left-1/4 h-52 w-52 rounded-full bg-[#2457C5]/15 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <div className="mb-5 flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#2457C5]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                  Questions & Information
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Looking for more information?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                If you need information about our organization, activities or
                available documents, please get in touch with our team.
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
                  Send an Email
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
