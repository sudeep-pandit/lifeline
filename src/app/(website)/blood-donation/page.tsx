"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Droplets,
  HeartHandshake,
  HelpCircle,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";

const bloodGroups = [
  { group: "A+", description: "A positive blood type." },
  { group: "A−", description: "A negative blood type." },
  { group: "B+", description: "B positive blood type." },
  { group: "B−", description: "B negative blood type." },
  { group: "AB+", description: "AB positive blood type." },
  { group: "AB−", description: "AB negative blood type." },
  { group: "O+", description: "O positive blood type." },
  { group: "O−", description: "O negative blood type." },
];

const donationSteps = [
  {
    number: "01",
    title: "Register",
    description:
      "Share your basic information with the authorized blood donation team or blood service.",
    icon: UserRound,
  },
  {
    number: "02",
    title: "Screening",
    description:
      "A qualified health professional checks whether you are currently suitable to donate.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Donate",
    description:
      "The donation is carried out safely by trained health professionals using appropriate procedures.",
    icon: Droplets,
  },
  {
    number: "04",
    title: "Recover",
    description:
      "Rest, hydrate and follow the guidance provided by the healthcare team after donation.",
    icon: HeartHandshake,
  },
];

const eligibilityPoints = [
  "Eligibility is determined by an authorized blood service or qualified health professional.",
  "Your current health, medical history and other factors may affect whether you can donate.",
  "Requirements can vary according to local blood-service policies and health guidance.",
  "If you are unsure, contact an authorized blood bank or healthcare professional before donating.",
];

const faqs = [
  {
    question: "Who can donate blood?",
    answer:
      "Blood donation eligibility depends on your health, medical history and the requirements of the authorized blood service. Please confirm your eligibility with a qualified healthcare professional or blood bank before donating.",
  },
  {
    question: "What should I do before donating?",
    answer:
      "Follow the preparation guidance provided by the blood service. Generally, donors should arrive prepared, hydrated and ready to provide accurate health information during screening.",
  },
  {
    question: "What happens after donation?",
    answer:
      "The healthcare team will provide after-donation guidance. You should take time to rest and follow their recommendations regarding hydration, food and physical activity.",
  },
  {
    question: "Can I request blood through Lifeline Achham?",
    answer:
      "The website can be used to submit a blood-related request or contact the organization. Actual blood availability, matching and transfusion arrangements must be confirmed through an authorized blood service or healthcare facility.",
  },
  {
    question: "Is registering as a donor a guarantee that I will donate?",
    answer:
      "No. Registration expresses your willingness to help. Whether you can donate at a particular time depends on your eligibility and the requirements of the authorized blood service.",
  },
];

export default function BloodDonationPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-[#FCFAF7] text-[#172033]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden">
        <div className="relative h-[500px] sm:h-[540px] lg:h-[580px]">
          <Image
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=2200&q=90"
            alt="Blood donation and community health support"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-[#55152B]/80" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#7A1F3D]/70 to-[#2457C5]/25" />

          <div className="relative mx-auto flex h-full max-w-7xl items-start px-5 pt-28 sm:px-8 sm:pt-32 lg:px-10 lg:pt-36">
            <div className="w-full max-w-4xl text-white">
              {/* BREADCRUMB */}
              <div className="mb-8 flex items-center gap-2 text-sm text-white/70">
                <Link
                  href="/"
                  className="transition hover:text-white"
                >
                  Home
                </Link>

                <span className="text-white/40">/</span>

                <span className="font-medium text-white">
                  Blood Donation
                </span>
              </div>

              {/* LABEL */}
              <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                <span className="h-[3px] w-9 rounded-full bg-white" />
                Blood Donation
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                One donation can become someone&apos;s lifeline.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                Blood donation connects people in moments when timely support
                matters most. Learn about donation, register your interest and
                help strengthen community readiness.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {/* PRIMARY — COBALT */}
                <Link
                  href="#donate"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[10px] bg-[#2457C5] px-6 text-sm font-bold text-white shadow-lg shadow-[#2457C5]/30 transition duration-200 hover:-translate-y-0.5 hover:bg-[#17439F] hover:shadow-xl"
                >
                  Become a Donor
                  <ArrowRight size={17} />
                </Link>

                {/* SECONDARY */}
                <Link
                  href="#request"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition duration-200 hover:bg-white/20"
                >
                  Need Blood Support
                  <Droplets size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================= */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
                <span className="brand-line" />
                Why Blood Donation Matters
              </div>

              <h2 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#172033] sm:text-4xl">
                A stronger community starts with people willing to help.
              </h2>

              <p className="mt-6 max-w-2xl text-[15px] leading-8 text-slate-600">
                Blood and blood products may be needed during medical
                emergencies, surgeries, treatment and other healthcare
                situations. Community participation can help make timely
                support more accessible when it is needed.
              </p>

              <p className="mt-4 max-w-2xl text-[15px] leading-8 text-slate-600">
                Lifeline Achham can help connect people with information and
                community participation, while actual collection, screening,
                storage and transfusion should always be handled by authorized
                health and blood-service professionals.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-full border border-[#7A1F3D]/10 bg-[#F7E9EE] px-4 py-2 text-sm font-semibold text-[#7A1F3D]">
                  Community Support
                </div>

                <div className="rounded-full border border-[#2457C5]/10 bg-[#EEF4FF] px-4 py-2 text-sm font-semibold text-[#2457C5]">
                  Health Awareness
                </div>

                <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
                  Volunteer Participation
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1600&q=90"
                  alt="Healthcare professional supporting blood donation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/90 p-5 shadow-lg backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7A1F3D] text-white">
                    <Droplets size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#172033]">
                      Donate responsibly
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Always follow the guidance of an authorized blood service
                      or qualified healthcare professional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ELIGIBILITY
      ========================================================= */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#2457C5]">
                <span className="h-[3px] w-8 rounded-full bg-[#2457C5]" />
                Before You Donate
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Check your eligibility first.
              </h2>

              <p className="mt-5 text-[15px] leading-8 text-slate-600">
                Blood donation requirements can differ depending on the blood
                service, local guidance and your individual circumstances.
                Screening by an authorized service is the final decision.
              </p>

              <div className="mt-7 rounded-2xl border border-[#2457C5]/10 bg-[#EEF4FF] p-5">
                <div className="flex gap-3">
                  <HelpCircle
                    className="mt-0.5 shrink-0 text-[#2457C5]"
                    size={21}
                  />

                  <div>
                    <p className="text-sm font-bold text-[#172033]">
                      Important health guidance
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      This page provides general information only. Please
                      confirm current eligibility with an authorized blood bank
                      or healthcare professional.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {eligibilityPoints.map((item) => (
                <div
                  key={item}
                  className="card card-hover p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7E9EE] text-[#7A1F3D]">
                      <CheckCircle2 size={18} />
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOOD GROUPS
      ========================================================= */}
      <section className="section">
        <div className="container-main">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
              <span className="brand-line" />
              Blood Groups
              <span className="brand-line" />
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Every blood group can matter.
            </h2>

            <p className="mt-5 text-[15px] leading-8 text-slate-600">
              Blood groups are commonly identified using the ABO and Rh
              systems. Availability and compatibility decisions must be
              confirmed by qualified medical professionals.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {bloodGroups.map((blood) => (
              <div
                key={blood.group}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#7A1F3D]/20 hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F7E9EE] text-lg font-extrabold text-[#7A1F3D] transition group-hover:bg-[#7A1F3D] group-hover:text-white">
                  {blood.group}
                </div>

                <p className="mt-3 text-[11px] font-medium leading-4 text-slate-400">
                  {blood.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          DONATION PROCESS
      ========================================================= */}
      <section className="section bg-[#172033] text-white">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                <span className="h-[3px] w-8 rounded-full bg-[#2457C5]" />
                Donation Process
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                What to expect.
              </h2>

              <p className="mt-5 max-w-lg text-[15px] leading-8 text-white/60">
                The exact process may vary between blood services, but
                authorized professionals will guide you through each stage.
              </p>

              <div className="mt-8 flex items-center gap-3 text-sm text-white/70">
                <Clock3 size={18} className="text-[#2457C5]" />
                <span>
                  Follow the instructions given by the blood service.
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {donationSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="rounded-[22px] border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2457C5] text-white">
                        <Icon size={20} />
                      </div>

                      <span className="text-sm font-bold text-white/25">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-6 text-lg font-bold">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/55">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          DONOR CTA
      ========================================================= */}
      <section id="donate" className="section">
        <div className="container-main">
          <div className="relative overflow-hidden rounded-[30px] bg-[#7A1F3D] px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[40px] border-white/5" />

            <div className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full border-[32px] border-[#2457C5]/30" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/65">
                  <span className="h-[3px] w-8 rounded-full bg-white" />
                  Become a Donor
                </div>

                <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                  Your willingness to help can make a difference.
                </h2>

                <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
                  Register your interest in supporting blood donation
                  activities and stay connected with community health
                  initiatives.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 text-sm font-bold text-white shadow-lg shadow-black/15 transition hover:-translate-y-1 hover:bg-[#17439F]"
              >
                Register Your Interest
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOOD REQUEST
      ========================================================= */}
      <section id="request" className="section bg-white">
        <div className="container-main">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[26px] border border-[#7A1F3D]/10 bg-[#F7E9EE] p-7 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7A1F3D] text-white">
                <Droplets size={21} />
              </div>

              <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#172033]">
                Looking for blood support?
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                If you need blood-related support, contact the relevant
                authorized blood service or healthcare facility first. You can
                also contact Lifeline Achham to share your request or ask
                about available community support channels.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] bg-[#2457C5] px-5 text-sm font-bold text-white transition hover:bg-[#17439F]"
                >
                  Contact Lifeline
                  <ArrowRight size={17} />
                </Link>

                <a
                  href="mailto:lifelineachham@gmail.com"
                  className="btn-outline"
                >
                  Send Email
                </a>
              </div>
            </div>

            <div className="rounded-[26px] border border-[#2457C5]/10 bg-[#EEF4FF] p-7 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2457C5] text-white">
                <Phone size={21} />
              </div>

              <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#172033]">
                For urgent medical situations
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Blood donation coordination should not replace emergency
                medical care. For an urgent situation, contact the appropriate
                emergency service, hospital or authorized blood bank directly.
              </p>

              <div className="mt-7 flex items-center gap-3 rounded-xl border border-white/80 bg-white/70 p-4">
                <MessageCircle
                  size={19}
                  className="text-[#2457C5]"
                />

                <span className="text-sm font-semibold text-[#172033]">
                  Seek professional medical assistance when needed.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ
      ========================================================= */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
                <span className="brand-line" />
                Frequently Asked Questions
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Questions about blood donation?
              </h2>

              <p className="mt-5 text-[15px] leading-8 text-slate-600">
                Here are some general answers. For personal medical advice or
                current eligibility requirements, always speak with an
                authorized healthcare professional.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={faq.question}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(isOpen ? null : index)
                      }
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-bold leading-6 text-[#172033]">
                        {faq.question}
                      </span>

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                          isOpen
                            ? "bg-[#7A1F3D] text-white"
                            : "bg-[#F7E9EE] text-[#7A1F3D]"
                        }`}
                      >
                        <ChevronDown
                          size={17}
                          className={`transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                        <p className="text-sm leading-7 text-slate-600">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT CTA
      ========================================================= */}
      <section className="section-sm">
        <div className="container-main">
          <div className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#2457C5]">
                  <MapPin size={16} />
                  Lifeline Achham
                </div>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                  Stay connected with community health initiatives.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  For general information, partnership opportunities or
                  community participation, reach out to our team.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] bg-[#2457C5] px-5 text-sm font-bold text-white transition hover:bg-[#17439F]"
              >
                Contact Us
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
