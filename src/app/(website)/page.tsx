
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Droplet,
  HandHeart,
  Heart,
  HeartHandshake,
  Megaphone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/* =========================================================
   TYPES
========================================================= */

type HeroSlide = {
  image: string;
  title: string;
  highlight: string;
};

type Milestone = {
  value: number;
  suffix: string;
  label: string;
  icon: typeof CalendarDays;
};

type PublicContent = {
  id?: string;
  title: string;
  key?: string;
  excerpt: string | null;
  content: string | null;
  imageUrl?: string | null;
};

type PublicContentResponse = {
  success: boolean;
  data: PublicContent | null;
};

/* =========================================================
   DEFAULT HERO SLIDES
========================================================= */

const defaultHeroImages: HeroSlide[] = [
  {
    image:
      "https://gracesocietynepal.org/wp-content/uploads/2025/02/community.jpg",
    title: "Building healthier",
    highlight: "communities together.",
  },
  {
    image: "https://risingnepaldaily.com/storage/media/3976/blood.jpg",
    title: "Every contribution",
    highlight: "can save a life.",
  },
  {
    image:
      "https://giro555.nl/content/uploads/2015/06/ICCO-dekens-820x536.png",
    title: "Together we can",
    highlight: "create meaningful change.",
  },
  {
    image:
      "https://creasionorg.wordpress.com/wp-content/uploads/2018/07/37600696_10156701903381617_4832855264845627392_n.jpg",
    title: "Stronger communities",
    highlight: "start with action.",
  },
];

/* =========================================================
   DEFAULT MILESTONES
========================================================= */

const defaultMilestones: Milestone[] = [
  {
    icon: CalendarDays,
    value: 3,
    suffix: "+",
    label: "Year of Services",
  },
  {
    icon: Users,
    value: 444,
    suffix: "+",
    label: "Active Donors Inside Achham",
  },
  {
    icon: Users,
    value: 180,
    suffix: "+",
    label: "Active Donors Outside Achham",
  },
  {
    icon: Droplet,
    value: 163,
    suffix: "+",
    label: "Donor Till Date",
  },
  {
    icon: HeartHandshake,
    value: 1,
    suffix: "+",
    label: "Happy Blood Recipients",
  },
];

/* =========================================================
   PARSE HERO SLIDES
========================================================= */

function parseHeroSlides(content: string | null): HeroSlide[] {
  if (!content?.trim()) return defaultHeroImages;

  try {
    const parsed: unknown = JSON.parse(content);

    if (!Array.isArray(parsed)) return defaultHeroImages;

    const slides: HeroSlide[] = parsed.filter(
      (item): item is HeroSlide =>
        item !== null &&
        typeof item === "object" &&
        typeof item.image === "string" &&
        item.image.trim().length > 0 &&
        typeof item.title === "string" &&
        typeof item.highlight === "string",
    );

    return slides.length > 0 ? slides : defaultHeroImages;
  } catch {
    console.error("Invalid JSON in homepage hero slides.");
    return defaultHeroImages;
  }
}

/* =========================================================
   PARSE MILESTONES
   CMS format:
   3+ | Year of Services
   444+ | Active Donors Inside Achham
========================================================= */

function parseMilestones(content: string | null): Milestone[] {
  if (!content?.trim()) return defaultMilestones;

  const icons = [
    CalendarDays,
    Users,
    Users,
    Droplet,
    HeartHandshake,
  ];

  const parsed: Milestone[] = [];

  for (const line of content.split(/\r?\n/)) {
    const separator = line.indexOf("|");

    if (separator === -1) continue;

    const rawValue = line.slice(0, separator).trim();
    const label = line.slice(separator + 1).trim();
    const match = rawValue.match(/^([\d,]+)\s*(\+?)$/);

    if (!match || !label) continue;

    const value = Number(match[1].replace(/,/g, ""));

    if (!Number.isSafeInteger(value) || value < 0) continue;

    parsed.push({
      icon: icons[parsed.length % icons.length],
      value,
      suffix: match[2],
      label,
    });
  }

  return parsed.length > 0 ? parsed : defaultMilestones;
}

/* =========================================================
   ANIMATED COUNTER
========================================================= */

function AnimatedCounter({
  value,
  suffix = "+",
  duration = 1800,
  active,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  active: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(value);
      return;
    }

    let frameId = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1,
      );

      const easedProgress = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(easedProgress * value));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [active, value, duration]);

  return (
    <span>
      {count.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

/* =========================================================
   STATIC HOMEPAGE CONTENT
========================================================= */

const programs = [
  {
    icon: HeartHandshake,
    number: "01",
    title: "Community Health",
    description:
      "Promoting awareness, healthy practices and access to community-focused health initiatives.",
    href: "/work/programs",
  },
  {
    icon: Users,
    number: "02",
    title: "Community Empowerment",
    description:
      "Supporting people and communities to participate, collaborate and build stronger futures.",
    href: "/work/programs",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Awareness & Education",
    description:
      "Creating awareness and sharing knowledge around issues that affect community wellbeing.",
    href: "/work/programs",
  },
];

const projects = [
  {
    image:
      "https://www.volunteerworld.com/images/volunteer-programs/nepal-community-construction-rebuilding.jpg",
    category: "Community Development",
    title: "Community Development Initiative",
    description:
      "Working together with communities to support practical local development and participation.",
  },
  {
    image:
      "https://japan-forward.com/blog-i-am-what-i-am-today-because-of-my-volunteer-work-in-nepal/%E6%96%87%E6%96%87-nepal-7/",
    category: "Community Outreach",
    title: "Community Awareness Program",
    description:
      "Connecting volunteers and communities through awareness, learning and collaborative activities.",
  },
  {
    image:
      "https://assets-api.kathmandupost.com/thumb.php?height=601&src=https%3A%2F%2Fassets-cdn.kathmandupost.com%2Fuploads%2Fsource%2Fnews%2F2026%2Fopinion%2FLEADPostFilePhoto3-1787239402.jpg&w=900",
    category: "Education",
    title: "Education & Youth Support",
    description:
      "Supporting learning opportunities and encouraging young people to participate in community development.",
  },
];

const campaigns = [
  {
    icon: Heart,
    title: "Blood Donation",
    description:
      "Encouraging voluntary blood donation and building awareness around the importance of giving blood.",
    href: "/blood-donation",
  },
  {
    icon: Megaphone,
    title: "Community Awareness",
    description:
      "Creating conversations around health, wellbeing, inclusion and important community issues.",
    href: "/work/campaigns",
  },
  {
    icon: HandHeart,
    title: "Volunteer Together",
    description:
      "Bringing people together to contribute their time, skills and energy to meaningful initiatives.",
    href: "/work/campaigns",
  },
];

const galleryItems = [
  {
    image: "https://risingnepaldaily.com/storage/media/3976/blood.jpg",
    title: "Blood Donation Campaign",
    category: "Health",
  },
  {
    image:
      "https://japan-forward.com/blog-i-am-what-i-am-today-because-of-my-volunteer-work-in-nepal/%E6%96%87%E6%96%87-nepal-7/",
    title: "Community Outreach",
    category: "Community",
  },
  {
    image:
      "https://www.volunteerworld.com/images/volunteer-programs/nepal-community-construction-rebuilding.jpg",
    title: "Community Development",
    category: "Projects",
  },
  {
    image:
      "https://assets-api.kathmandupost.com/thumb.php?height=601&src=https%3A%2F%2Fassets-cdn.kathmandupost.com%2Fuploads%2Fsource%2Fnews%2F2026%2Fopinion%2FLEADPostFilePhoto3-1787239402.jpg&w=900",
    title: "Education Support",
    category: "Education",
  },
];

const newsItems = [
  {
    date: "Recent",
    category: "News",
    title: "Lifeline Achham community initiatives and updates",
    description:
      "Follow our latest activities, announcements and stories from the communities we work with.",
  },
  {
    date: "Updates",
    category: "Campaign",
    title: "Join our blood donation initiative",
    description:
      "Learn how you can become a donor and contribute to a stronger emergency blood support network.",
  },
  {
    date: "Community",
    category: "Notice",
    title: "Community participation and volunteer opportunities",
    description:
      "Stay connected with upcoming activities and opportunities to contribute your time and skills.",
  },
];

const partners = [
  {
    name: "Partner Organization 01",
    logo: "/images/partners/partner-01.png",
  },
  {
    name: "Partner Organization 02",
    logo: "/images/partners/partner-02.png",
  },
  {
    name: "Partner Organization 03",
    logo: "/images/partners/partner-03.png",
  },
  {
    name: "Partner Organization 04",
    logo: "/images/partners/partner-04.png",
  },
  {
    name: "Partner Organization 05",
    logo: "/images/partners/partner-05.png",
  },
  {
    name: "Partner Organization 06",
    logo: "/images/partners/partner-06.png",
  },
];

/* =========================================================
   HOMEPAGE
========================================================= */

export default function HomePage() {
  const [activeHero, setActiveHero] = useState(0);

  const [heroContent, setHeroContent] =
    useState<PublicContent | null>(null);

  const [milestonesContent, setMilestonesContent] =
    useState<PublicContent | null>(null);

  const milestonesRef = useRef<HTMLElement>(null);
  const [milestonesVisible, setMilestonesVisible] = useState(false);

  const heroImages = parseHeroSlides(heroContent?.content ?? null);
  const currentHero = heroImages[activeHero] ?? heroImages[0];

  const milestones = parseMilestones(
    milestonesContent?.content ?? null,
  );

  /* Load published content from the public CMS API */

  const loadPublicContent = useCallback(
    async (
      key: string,
      setter: (content: PublicContent | null) => void,
      signal: AbortSignal,
    ) => {
      try {
        const response = await fetch(
          `/api/content/public?key=${encodeURIComponent(key)}`,
          {
            cache: "no-store",
            signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load ${key}: HTTP ${response.status}`,
          );
        }

        const result =
          (await response.json()) as PublicContentResponse;

        if (result.success && result.data) {
          setter(result.data);
        } else {
          console.warn(
            `No published CMS content found for "${key}". Using defaults.`,
          );
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(
            `Failed to load CMS content (${key}):`,
            error,
          );
        }
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    void loadPublicContent(
      "home_hero_slides",
      setHeroContent,
      controller.signal,
    );

    void loadPublicContent(
      "home_milestones",
      setMilestonesContent,
      controller.signal,
    );

    return () => controller.abort();
  }, [loadPublicContent]);

  /* Rotate hero slides every six seconds */

  useEffect(() => {
    if (heroImages.length <= 1) {
      setActiveHero(0);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % heroImages.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [heroImages.length]);

  /* Keep the current slide within bounds */

  useEffect(() => {
    setActiveHero((current) =>
      current >= heroImages.length ? 0 : current,
    );
  }, [heroImages.length]);

  /* Animate milestones when they enter the viewport */

  useEffect(() => {
    const section = milestonesRef.current;

    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMilestonesVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMilestonesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-hidden bg-[#FCFAF7]">
      {/* HERO */}

      <section className="relative flex min-h-screen items-center overflow-hidden">
        {heroImages.map((hero, index) => (
          <div
            key={`${hero.image}-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              activeHero === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={hero.image}
              alt=""
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#172033]/55" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/80 via-[#172033]/45 to-transparent" />
          </div>
        ))}

        <div className="container-main relative z-10 pt-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                Lifeline Achham
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {currentHero.title}
              <span className="mt-2 block text-[#E9B6C7]">
                {currentHero.highlight}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Working alongside communities to promote health, awareness,
              empowerment and meaningful social impact across Achham and
              beyond.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/work"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-black/10 transition hover:bg-[#17439F]"
              >
                Explore Our Work
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/blood-donation"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Blood Donation
                <Heart size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3 text-white/60">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
              Scroll to explore
            </span>
            <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/30 p-1.5">
              <span className="h-2 w-1 animate-bounce rounded-full bg-white/70" />
            </div>
          </div>
        </div>
      </section>

      {/* MILESTONES TILL NOW — CMS: home_milestones */}

      <section
        ref={milestonesRef}
        className="relative overflow-hidden border-y border-slate-200 bg-[#FCFAF7] py-16 sm:py-20"
      >
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#7A1F3D]/[0.04] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#2457C5]/[0.05] blur-3xl" />

        <div className="container-main relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="brand-line mx-auto mb-5" />

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              {milestonesContent?.title || "Milestones Till Now"}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              {milestonesContent?.excerpt ||
                "Every milestone represents our commitment to community service, voluntary blood donation, and making a meaningful difference."}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;

              return (
                <div
                  key={`${milestone.label}-${index}`}
                  className={`group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-700 hover:-translate-y-1 hover:border-[#2457C5]/25 hover:shadow-xl hover:shadow-slate-900/5 ${
                    milestonesVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                  style={{
                    transitionDelay: milestonesVisible
                      ? `${index * 120}ms`
                      : "0ms",
                  }}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D] transition-colors duration-300 group-hover:bg-[#7A1F3D] group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <p className="mt-5 text-3xl font-bold tracking-tight text-[#2457C5] sm:text-4xl">
                    <AnimatedCounter
                      value={milestone.value}
                      suffix={milestone.suffix}
                      active={milestonesVisible}
                    />
                  </p>

                  <h3 className="mx-auto mt-3 max-w-[190px] text-sm font-semibold leading-6 text-slate-600">
                    {milestone.label}
                  </h3>

                  <div className="mx-auto mt-5 h-1 w-10 rounded-full bg-[#7A1F3D]/20 transition-all duration-300 group-hover:w-16 group-hover:bg-[#2457C5]" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* IMPACT STRIP */}

      <section className="border-y border-slate-200 bg-[#FCFAF7]">
        <div className="container-main">
          <div className="grid divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-5 py-8 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
                Our Approach
              </p>
              <p className="mt-2 text-sm font-semibold text-[#172033]">
                Listen. Understand. Act.
              </p>
            </div>

            <div className="px-5 py-8 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2457C5]">
                Our Focus
              </p>
              <p className="mt-2 text-sm font-semibold text-[#172033]">
                Health, awareness &amp; empowerment
              </p>
            </div>

            <div className="px-5 py-8 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
                Our Belief
              </p>
              <p className="mt-2 text-sm font-semibold text-[#172033]">
                Change is stronger together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}

      <section className="section bg-[#FCFAF7]">
        <div className="container-main">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="brand-line mb-5" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                What We Do
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Our Programs
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                Our programs focus on practical community needs and creating
                opportunities for people to participate in positive change.
              </p>
            </div>

            <Link
              href="/work/programs"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]"
            >
              View all programs
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {programs.map((program) => {
              const Icon = program.icon;

              return (
                <Link
                  href={program.href}
                  key={program.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/25 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-bold text-slate-300">
                      {program.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-[#172033]">
                    {program.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {program.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2457C5]">
                    Explore
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROJECTS */}

      <section className="section bg-white">
        <div className="container-main">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="brand-line mb-5" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Our Work
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Featured Projects
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                Explore some of the areas where collaboration and community
                participation can turn ideas into meaningful action.
              </p>
            </div>

            <Link
              href="/work/projects"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]"
            >
              View all projects
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/55 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7A1F3D] backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#172033]">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {project.description}
                  </p>
                  <Link
                    href="/work/projects"
                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2457C5]"
                  >
                    Explore project
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CAMPAIGNS */}

      <section className="section bg-[#FCFAF7]">
        <div className="container-main">
          <div className="mx-auto max-w-2xl text-center">
            <div className="brand-line mx-auto mb-5" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
              Get Involved
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Campaigns That Bring People Together
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Small actions can create meaningful change when people come
              together with a shared purpose.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {campaigns.map((campaign) => {
              const Icon = campaign.icon;

              return (
                <Link
                  key={campaign.title}
                  href={campaign.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 text-center transition duration-300 hover:-translate-y-1 hover:border-[#7A1F3D]/20 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7E9EE] text-[#7A1F3D]">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[#172033]">
                    {campaign.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {campaign.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2457C5]">
                    Learn more
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALLERY */}

      <section className="section bg-white">
        <div className="container-main">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="brand-line mb-5" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Moments &amp; Stories
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                From Our Gallery
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                A glimpse into community activities, campaigns and moments of
                collaboration.
              </p>
            </div>

            <Link
              href="/resources/gallery"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]"
            >
              View full gallery
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((item) => (
              <Link
                href="/resources/gallery"
                key={item.title}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="aspect-[4/5]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/75 via-[#172033]/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E9B6C7]">
                    {item.category}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-white">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}

      <section className="section bg-[#FCFAF7]">
        <div className="container-main">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="brand-line mb-5" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Stay Connected
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Latest Updates
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                Keep up with our latest news, announcements, campaigns and
                community activities.
              </p>
            </div>

            <Link
              href="/resources/news"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]"
            >
              View all updates
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {newsItems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#EEF4FF] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#2457C5]">
                    {item.category}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {item.date}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold leading-7 text-[#172033]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
                <Link
                  href="/resources/news"
                  className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2457C5]"
                >
                  Read more
                  <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BLOOD DONATION */}

      <section className="relative overflow-hidden bg-[#55152B] py-20">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[45px] border-white/[0.04]" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#2457C5]/10 blur-3xl" />

        <div className="container-main relative">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2">
                <Heart size={17} className="text-[#E9B6C7]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E9B6C7]">
                  Blood Donation
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your one decision could help save a life.
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
                Voluntary blood donation can make a critical difference when
                someone needs urgent support. Join the initiative and help
                build a stronger community blood support network.
              </p>
            </div>

            <Link
              href="/blood-donation"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-black/10 transition hover:bg-[#17439F]"
            >
              Become a Donor
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* PARTNERS & COLLABORATORS */}

      <section className="relative overflow-hidden border-t border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7A1F3D]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Together for Impact
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#2457C5]" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Our Valuable Partners &amp; Collaborators
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              We are grateful to the organizations, institutions and
              collaborators who work alongside us to create meaningful and
              sustainable impact in our communities.
            </p>
          </div>
        </div>

        <div className="relative mt-12 overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-20 bg-gradient-to-r from-white to-transparent sm:w-32" />
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-20 bg-gradient-to-l from-white to-transparent sm:w-32" />

          <div className="partner-marquee flex w-max">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="mx-3 flex h-36 w-56 shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/25 hover:shadow-xl hover:shadow-slate-900/5"
              >
                <div className="flex h-20 w-full items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={150}
                    height={70}
                    className="max-h-16 w-auto object-contain grayscale opacity-70 transition duration-300 hover:grayscale-0 hover:opacity-100"
                  />
                </div>
                <div className="mt-3 text-center text-xs font-semibold text-slate-600">
                  {partner.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .partner-marquee {
            animation: partner-scroll 35s linear infinite;
          }

          .partner-marquee:hover {
            animation-play-state: paused;
          }

          @keyframes partner-scroll {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-50%);
            }
          }

          @media (max-width: 640px) {
            .partner-marquee {
              animation-duration: 28s;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .partner-marquee {
              animation: none !important;
            }
          }
        `}</style>
      </section>

      {/* GET INVOLVED */}

      <section className="section bg-white">
        <div className="container-main">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[#FCFAF7] px-7 py-12 sm:px-10 lg:px-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-[#2457C5]/[0.04]" />
            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#7A1F3D]/[0.035] blur-3xl" />

            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2457C5]">
                    Get Involved
                  </span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                  Be part of something meaningful.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  Whether you volunteer your time, support a campaign, partner
                  with us or simply help spread awareness, your contribution
                  matters.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#17439F]"
                >
                  Get Involved
                  <ArrowRight size={17} />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-[#172033] transition hover:border-[#2457C5]/25 hover:bg-[#EEF4FF] hover:text-[#2457C5]"
                >
                  Learn About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
