
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Mail,
  ShieldCheck,
} from "lucide-react";

const sections = [
  {
    id: "website-use",
    number: "01",
    title: "Website Use",
    description:
      "This website provides information about Lifeline Achham, its programs, projects, campaigns, publications and community initiatives.",
  },
  {
    id: "information",
    number: "02",
    title: "Information",
    description:
      "We make reasonable efforts to keep information on this website accurate and up to date. However, information may change without prior notice.",
  },
  {
    id: "donations",
    number: "03",
    title: "Donations & Participation",
    description:
      "Participation in programs, campaigns and blood donation activities may be subject to additional requirements, verification and applicable policies.",
  },
  {
    id: "intellectual-property",
    number: "04",
    title: "Intellectual Property",
    description:
      "Unless otherwise stated, content published on this website belongs to Lifeline Achham and should not be reproduced without appropriate permission.",
  },
  {
    id: "contact",
    number: "05",
    title: "Contact",
    description:
      "If you have questions regarding these terms, please contact Lifeline Achham using the official contact information provided on this website.",
  },
];

const principles = [
  {
    icon: ShieldCheck,
    title: "Responsible Use",
    description:
      "Use this website responsibly and respect the information, resources and services provided through it.",
  },
  {
    icon: FileText,
    title: "Clear Information",
    description:
      "Website information is provided to help visitors understand Lifeline Achham and its community-focused work.",
  },
  {
    icon: CheckCircle2,
    title: "Participation",
    description:
      "Specific activities may have additional requirements, verification processes or applicable policies.",
  },
];

export default function TermsPage() {
  return (
    <main className="bg-[#FCFAF7]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#55152B] text-white">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#7A1F3D]/60 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#2457C5]/25 blur-3xl" />
          <div className="absolute right-[12%] top-[18%] h-32 w-32 rounded-full border border-white/10" />
          <div className="absolute bottom-[12%] left-[18%] h-20 w-20 rotate-12 border border-white/10" />
        </div>

        <div className="relative mx-auto flex min-h-[430px] w-[min(1180px,calc(100%-40px))] items-end pb-16 pt-32 sm:min-h-[480px] sm:pb-20">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-2 text-sm text-white/70">
              <Link
                href="/"
                className="transition-colors hover:text-white"
              >
                Home
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span className="text-white">Terms & Conditions</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-5 h-1 w-12 rounded-full bg-[#2457C5]" />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                Legal
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Terms & Conditions
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                Please read these terms carefully before using the Lifeline
                Achham website and its services.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="brand-line" />

                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
                    Website Terms
                  </span>
                </div>

                <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                  Important information about using our website.
                </h2>

                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
                  These Terms & Conditions provide general guidance for using
                  the Lifeline Achham website and understanding the information
                  shared through it. By using this website, visitors are
                  expected to use its content and resources responsibly.
                </p>
              </motion.div>

              {/* Principles */}
              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {principles.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.08,
                      }}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D]">
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="mt-5 text-base font-bold text-[#172033]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        {item.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Legal Sections */}
              <div className="mt-14 space-y-5">
                {sections.map((section, index) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.04,
                    }}
                    className="scroll-mt-32 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                  >
                    <div className="flex gap-5">
                      <div className="hidden shrink-0 sm:block">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7E9EE] text-sm font-bold text-[#7A1F3D]">
                          {section.number}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-3 sm:hidden">
                          <span className="text-xs font-bold tracking-[0.15em] text-[#2457C5]">
                            {section.number}
                          </span>

                          <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <h2 className="mt-3 text-xl font-bold text-[#172033] sm:mt-0">
                          {section.title}
                        </h2>

                        <p className="mt-3 text-sm leading-8 text-slate-600">
                          {section.description}

                          {section.id === "contact" && (
                            <>
                              {" "}
                              You can reach us at{" "}
                              <a
                                href="mailto:lifelineachham@gmail.com"
                                className="font-semibold text-[#2457C5] transition-colors hover:text-[#17439F] hover:underline"
                              >
                                lifelineachham@gmail.com
                              </a>
                              .
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.section>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#172033]">
                      On this page
                    </p>

                    <p className="text-xs text-slate-500">
                      Terms overview
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 transition hover:bg-[#F7E9EE] hover:text-[#7A1F3D]"
                    >
                      <span className="text-xs font-bold text-[#2457C5]">
                        {section.number}
                      </span>

                      <span className="flex-1">{section.title}</span>

                      <ChevronRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-[#55152B] p-6 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Mail className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Have a question?
                </h3>

                <p className="mt-2 text-sm leading-7 text-white/70">
                  If you need clarification regarding these terms, our team
                  can be contacted through the official email address.
                </p>

                <a
                  href="mailto:lifelineachham@gmail.com"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-white/80"
                >
                  Contact us
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-sm border-t border-slate-200 bg-white">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-3xl bg-[#55152B] px-7 py-10 text-white sm:px-10 sm:py-12"
          >
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#2457C5]/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#7A1F3D]/70 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 h-1 w-10 rounded-full bg-[#2457C5]" />

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                  Need More Information?
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  We are happy to help clarify any questions.
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base">
                  For questions about website information, participation or
                  these Terms & Conditions, please get in touch with Lifeline
                  Achham.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-[#17439F]"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
