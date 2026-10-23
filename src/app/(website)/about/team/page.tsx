
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=90";

const DEPARTMENTS = [
  {
    name: "Executive Board",
    description:
      "Providing leadership, direction and organizational oversight.",
  },
  {
    name: "Advisory Council",
    description:
      "Offering experience, guidance and strategic perspectives.",
  },
  {
    name: "Technical Team",
    description:
      "Supporting technology, communication and digital initiatives.",
  },
];

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Working Together",
    description:
      "We bring different skills, ideas and experiences together to support meaningful community work.",
  },
  {
    icon: ShieldCheck,
    title: "Shared Responsibility",
    description:
      "We value trust, accountability and the contribution each person makes to our mission.",
  },
  {
    icon: Sparkles,
    title: "Purpose Driven",
    description:
      "Our shared commitment inspires us to create positive and lasting change in our communities.",
  },
];

type TeamMember = {
  id: string;
  name: string;
  slug: string;
  designation: string;
  department: string | null;
  bio: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  image: {
    id: string;
    url: string;
    alt: string | null;
    originalName: string;
  } | null;
};

type TeamApiResponse = {
  members?: TeamMember[];
  message?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMembers = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/team/public", {
        method: "GET",
        cache: "no-store",
        signal,
      });

      const result = (await response.json()) as TeamApiResponse;

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to load team members."
        );
      }

      const activeMembers = Array.isArray(result.members)
        ? result.members.filter((member) => member.isActive)
        : [];

      activeMembers.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) {
          return a.isFeatured ? -1 : 1;
        }

        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }

        return a.name.localeCompare(b.name);
      });

      setMembers(activeMembers);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load team members."
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void fetchMembers(controller.signal);

    return () => controller.abort();
  }, [fetchMembers]);

  const featuredMember = useMemo(
    () => members.find((member) => member.isFeatured) ?? members[0] ?? null,
    [members]
  );

  return (
    <main className="overflow-hidden bg-[#FCFAF7]">
      {/* HERO */}
      <section className="relative bg-[#55152B] pt-[112px]">
        <div className="relative h-[370px] overflow-hidden sm:h-[420px] lg:h-[470px]">
          <Image
            src={HERO_IMAGE}
            alt="Community members working together"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#55152B]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/90 via-[#55152B]/55 to-transparent" />

          <div className="container-main relative z-10 flex h-full items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-3xl"
            >
              <motion.div
                variants={fadeUp}
                className="mb-5 flex items-center gap-3"
              >
                <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                  About Lifeline Achham
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Our Team
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg"
              >
                Meet the people contributing their time, skills and dedication
                to the work of Lifeline Achham.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-7 flex items-center gap-3 text-xs"
              >
                <Link href="/" className="text-white/60 hover:text-white">
                  Home
                </Link>
                <span className="text-white/30">/</span>
                <Link
                  href="/about"
                  className="text-white/60 hover:text-white"
                >
                  About
                </Link>
                <span className="text-white/30">/</span>
                <span className="text-white">Our Team</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="py-20 sm:py-24">
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
              className="mb-5 flex items-center justify-center gap-3"
            >
              <span className="h-px w-8 bg-[#7A1F3D]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                The People Behind the Work
              </span>
              <span className="h-px w-8 bg-[#7A1F3D]" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
            >
              People united by{" "}
              <span className="text-[#7A1F3D]">purpose.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-sm leading-8 text-slate-500 sm:text-base"
            >
              Lifeline Achham brings together people with different skills,
              responsibilities and experiences. Together, we support community
              initiatives and work toward meaningful, positive change.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* DATABASE-DRIVEN LEADERSHIP */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <SectionHeading
            eyebrow="Leadership"
            title="Guiding the"
            accent=" journey."
          />

          {loading ? (
            <StatusPanel loading message="Loading our team..." />
          ) : error ? (
            <ErrorPanel
              message={error}
              onRetry={() => void fetchMembers()}
            />
          ) : featuredMember ? (
            <motion.article
              key={featuredMember.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mt-10 grid overflow-hidden rounded-2xl border border-slate-200 bg-[#FCFAF7] lg:grid-cols-[360px_1fr]"
            >
              <div className="relative min-h-[300px] bg-slate-100 sm:min-h-[380px]">
                {featuredMember.image?.url ? (
                  <Image
                    src={featuredMember.image.url}
                    alt={
                      featuredMember.image.alt?.trim() ||
                      featuredMember.name
                    }
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[300px] items-center justify-center">
                    <Users className="h-16 w-16 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
                  <Star size={15} />
                  {featuredMember.isFeatured
                    ? "Featured Team Member"
                    : "Meet Our Team"}
                </span>

                <h3 className="mt-4 text-2xl font-bold text-[#172033] sm:text-3xl">
                  {featuredMember.name}
                </h3>

                <p className="mt-2 font-semibold text-[#2457C5]">
                  {featuredMember.designation}
                </p>

                <p className="mt-5 whitespace-pre-line text-sm leading-8 text-slate-500">
                  {featuredMember.bio ||
                    `${featuredMember.name} contributes to Lifeline Achham as ${featuredMember.designation}.`}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <span className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600">
                    {featuredMember.department || "Lifeline Achham"}
                  </span>

                  <a
                    href="mailto:lifelineachham@gmail.com"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#2457C5] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#17439F]"
                  >
                    <Mail size={14} />
                    Contact Lifeline Achham
                  </a>
                </div>
              </div>
            </motion.article>
          ) : (
            <EmptyPanel message="Active team profiles will appear here once they are added in the admin panel." />
          )}
        </div>
      </section>

      {/* TEAM DIRECTORY */}
      <section className="py-20 sm:py-24">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#7A1F3D]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Our People
              </span>
              <span className="h-px w-8 bg-[#7A1F3D]" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              A team working{" "}
              <span className="text-[#7A1F3D]">together.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Explore the people behind our work, organized by department.
            </p>
          </div>

          <TeamDirectory
            members={members}
            loading={loading}
            error={error}
            onRetry={() => void fetchMembers()}
          />
        </div>
      </section>

      {/* VALUES */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <SectionHeading
            eyebrow="How We Work"
            title="More than individual roles,"
            accent=" one team."
            centered
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="mt-12 grid gap-5 md:grid-cols-3"
          >
            {VALUES.map((value) => {
              const Icon = value.icon;

              return (
                <motion.article
                  key={value.title}
                  variants={fadeUp}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-slate-200 bg-[#FCFAF7] p-7 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D]">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 font-bold text-[#172033]">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {value.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* GET INVOLVED */}
      <section className="bg-[#FCFAF7] py-20 sm:py-28">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#55152B] px-7 py-14 text-center sm:px-12 sm:py-16 lg:px-16 lg:py-20"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-[42px] border-white/[0.05]" />
            <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-[#2457C5]/15 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <div className="mb-5 flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/65">
                  Join the Movement
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Want to contribute to meaningful change?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                Volunteer, collaborate or support a community initiative.
                There are many ways to contribute to the work of Lifeline
                Achham.
              </p>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#17439F]"
                >
                  Get Involved
                  <ArrowUpRight
                    size={17}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  accent,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  centered?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger}
      className={centered ? "text-center" : ""}
    >
      <motion.div
        variants={fadeUp}
        className={`mb-4 flex items-center gap-3 ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2457C5]">
          {eyebrow}
        </span>
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl"
      >
        {title}
        <span className="text-[#2457C5]">{accent}</span>
      </motion.h2>
    </motion.div>
  );
}

function TeamDirectory({
  members,
  loading,
  error,
  onRetry,
}: {
  members: TeamMember[];
  loading: boolean;
  error: string;
  onRetry: () => void;
}) {
  const [activeDepartment, setActiveDepartment] =
    useState("Executive Board");

  const groupedMembers = useMemo(() => {
    const groups = new Map<string, TeamMember[]>();

    for (const member of members) {
      const department =
        member.department?.trim() || "Other Team Members";

      const current = groups.get(department) ?? [];
      current.push(member);
      groups.set(department, current);
    }

    return groups;
  }, [members]);

  const availableDepartments = useMemo(() => {
    const configured = DEPARTMENTS.filter((department) =>
      groupedMembers.has(department.name)
    );

    const additional = [...groupedMembers.keys()]
      .filter(
        (name) => !DEPARTMENTS.some((department) => department.name === name)
      )
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        name,
        description: `Meet the people contributing to Lifeline Achham's ${name.toLowerCase()} team.`,
      }));

    return [...configured, ...additional];
  }, [groupedMembers]);

  useEffect(() => {
    if (
      availableDepartments.length > 0 &&
      !availableDepartments.some(
        (department) => department.name === activeDepartment
      )
    ) {
      setActiveDepartment(availableDepartments[0].name);
    }
  }, [availableDepartments, activeDepartment]);

  const currentMembers = groupedMembers.get(activeDepartment) ?? [];

  if (loading) {
    return (
      <div className="mt-10">
        <StatusPanel loading message="Loading team members..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10">
        <ErrorPanel message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="mt-10">
        <EmptyPanel message="No active team members are available yet. Active profiles added through the admin panel will appear here." />
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-5">
        {availableDepartments.map((department) => {
          const active = department.name === activeDepartment;

          return (
            <button
              key={department.name}
              type="button"
              onClick={() => setActiveDepartment(department.name)}
              aria-pressed={active}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition sm:px-5 ${
                active
                  ? "bg-[#7A1F3D] text-white shadow-lg shadow-[#7A1F3D]/15"
                  : "bg-white text-slate-500 hover:bg-[#F7E9EE] hover:text-[#7A1F3D]"
              }`}
            >
              {department.name}
              <span className="ml-2 text-xs opacity-75">
                {groupedMembers.get(department.name)?.length ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeDepartment}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto mt-8 max-w-2xl text-center"
      >
        <h3 className="text-xl font-bold text-[#172033]">
          {activeDepartment}
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          {availableDepartments.find(
            (department) => department.name === activeDepartment
          )?.description}
        </p>
      </motion.div>

      {currentMembers.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">
          No active members in this department.
        </p>
      ) : (
        <motion.div
          key={`directory-${activeDepartment}`}
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6"
        >
          {currentMembers.map((member) => (
            <motion.article
              key={member.id}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className="group rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-xl sm:p-3"
            >
              <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-xl bg-slate-100">
                {member.image?.url ? (
                  <Image
                    src={member.image.url}
                    alt={member.image.alt?.trim() || member.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 240px"
                    className="object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Users className="h-12 w-12 text-slate-300" />
                  </div>
                )}

                {member.isFeatured && (
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-[#2457C5] px-2.5 py-1 text-[9px] font-bold text-white shadow">
                    <Star size={10} />
                    Featured
                  </span>
                )}
              </div>

              <div className="px-2 pb-2 pt-3 sm:px-2.5">
                <h4 className="text-sm font-bold text-[#172033] sm:text-base">
                  {member.name}
                </h4>

                <p className="mt-1 text-xs font-semibold leading-5 text-[#2457C5] sm:text-sm">
                  {member.designation}
                </p>

                {member.bio && (
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
                    {member.bio}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2457C5]" />
                  <span className="truncate text-[9px] font-semibold uppercase tracking-wider text-slate-400 sm:text-[10px]">
                    {activeDepartment}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function StatusPanel({
  loading,
  message,
}: {
  loading: boolean;
  message: string;
}) {
  return (
    <div
      role="status"
      className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center"
    >
      {loading && (
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2457C5]" />
      )}
      <p className="mt-4 text-sm text-slate-500">{message}</p>
    </div>
  );
}

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
    >
      <p className="font-semibold text-red-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#7A1F3D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#55152B]"
      >
        <ArrowRight size={14} />
        Try again
      </button>
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
      <Users className="mx-auto h-10 w-10 text-[#2457C5]" />
      <h3 className="mt-4 text-lg font-bold text-[#172033]">
        Our team is growing
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
        {message}
      </p>
    </div>
  );
}
