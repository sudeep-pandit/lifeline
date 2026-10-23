"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Home,
  Search,
  HeartPulse,
  Compass,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#FCFAF7] text-[#172033]">
      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Burgundy glow */}
        <motion.div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#F7E9EE] blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Blue glow */}
        <motion.div
          className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-[#EEF4FF] blur-3xl"
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.6, 0.85, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Floating burgundy orb */}
        <motion.div
          className="absolute left-[10%] top-[20%] h-3 w-3 rounded-full bg-[#7A1F3D]"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating blue orb */}
        <motion.div
          className="absolute right-[15%] top-[25%] h-4 w-4 rounded-full bg-[#2457C5]"
          animate={{
            y: [0, 25, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Small decorative dots */}
        <div className="absolute left-[20%] bottom-[20%] h-2 w-2 rounded-full bg-[#2457C5]/30" />
        <div className="absolute right-[25%] bottom-[18%] h-2 w-2 rounded-full bg-[#7A1F3D]/30" />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">

          {/* =====================================================
              BRAND MARK
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              {/* Animated outer ring */}
              <motion.div
                className="absolute inset-[-10px] rounded-full border border-[#7A1F3D]/10"
                animate={{
                  scale: [1, 1.12, 1],
                  opacity: [0.4, 0.1, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7A1F3D] shadow-lg shadow-[#7A1F3D]/20">
                <HeartPulse className="h-8 w-8 text-white" />
              </div>
            </div>
          </motion.div>

          {/* =====================================================
              404 NUMBER
          ===================================================== */}

          <div className="relative mx-auto w-fit">
            {/* Large background number */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="select-none text-[8rem] font-black leading-none tracking-[-0.08em] text-[#F7E9EE] sm:text-[11rem] md:text-[14rem]"
            >
              404
            </motion.div>

            {/* Center badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="rounded-full border border-white/80 bg-white/90 px-5 py-2.5 shadow-xl shadow-[#172033]/5 backdrop-blur-md">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7A1F3D] sm:text-sm">
                  Page Not Found
                </span>
              </div>
            </motion.div>
          </div>

          {/* =====================================================
              MESSAGE
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
          >
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
              Looks like you took a wrong turn.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#64748B] sm:text-lg">
              The page you are looking for doesn&apos;t exist or may have
              moved. Let&apos;s get you back on the right path.
            </p>
          </motion.div>

          {/* =====================================================
              ACTIONS
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.6,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="mt-9 flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2457C5]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#17439F] hover:shadow-xl"
            >
              <Home className="h-4 w-4" />

              Back to Home

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/resources"
              className="group inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-6 py-3.5 text-sm font-bold text-[#172033] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2457C5] hover:text-[#2457C5] hover:shadow-md"
            >
              <Search className="h-4 w-4" />

              Explore Resources

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* =====================================================
              QUICK NAVIGATION
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mx-auto mt-16 max-w-2xl border-t border-[#E5E7EB] pt-8"
          >
            <div className="mb-5 flex items-center justify-center gap-2">
              <Compass className="h-4 w-4 text-[#7A1F3D]" />

              <p className="text-sm font-semibold text-[#64748B]">
                Try one of these destinations
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-7 gap-y-3">
              <QuickLink href="/about" label="About Us" />

              <QuickLink href="/work" label="Our Work" />

              <QuickLink
                href="/resources/news"
                label="Latest News"
              />

              <QuickLink
                href="/blood-donation"
                label="Blood Donation"
              />

              <QuickLink href="/contact" label="Contact" />
            </div>
          </motion.div>

          {/* =====================================================
              BRAND FOOTER
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-12"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-[#7A1F3D]/20" />

              <span className="text-sm font-bold tracking-wide text-[#7A1F3D]">
                Lifeline Achham
              </span>

              <div className="h-px w-8 bg-[#7A1F3D]/20" />
            </div>

            <p className="mt-2 text-xs text-[#94A3B8]">
              Community • Awareness • Empowerment
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

/* ===============================================================
   QUICK LINK COMPONENT
================================================================ */

function QuickLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#475569] transition-colors hover:text-[#7A1F3D]"
    >
      {label}

      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
