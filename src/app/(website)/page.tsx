"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Droplet,
  HandHeart,
  Heart,
  HeartHandshake,
  Megaphone,
  Users,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";

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
  icon: ComponentType<{ size?: number; className?: string }>;
};

type PublicContent = {
  id: string;
  title: string;
  key: string;
  slug?: string | null;
  type?: string;
  excerpt: string | null;
  content: string | null;
  imageUrl?: string | null;
  isHomepage?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
};

type PublicContentResponse = {
  success: boolean;
  data: PublicContent | PublicContent[] | null;
  message?: string;
};

type HomepageProgramsProjectsSettings = {
  displayMode: "both" | "programs" | "projects";
  featuredIds: string[];
  limit: number;
  layout: "grid" | "carousel";
  columns: 2 | 3 | 4;
  showImages: boolean;
  showProgress: boolean;
  ctaLabel: string;
  ctaHref: string;
};

type PublicGalleryPhoto = {
  id: string;
  title: string;
  image: string;
  alt: string;
};

type PublicGalleryAlbum = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  year: string;
  isFeatured: boolean;
  cover: string | null;
  coverAlt: string;
  imageCount: number;
  images: PublicGalleryPhoto[];
};

type PublicGalleryResponse = {
  albums?: PublicGalleryAlbum[];
  error?: string;
};

type Campaign = {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  href: string;
};

type NewsItem = {
  date: string;
  category: string;
  title: string;
  description: string;
};

type Partner = {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
};

/* =========================================================
   DEFAULT CONTENT
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

const defaultProgramsProjectsSettings: HomepageProgramsProjectsSettings = {
  displayMode: "both",
  featuredIds: [],
  limit: 6,
  layout: "grid",
  columns: 3,
  showImages: true,
  showProgress: true,
  ctaLabel: "See all programs",
  ctaHref: "/work/programs",
};

const campaigns: Campaign[] = [
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

const newsItems: NewsItem[] = [
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

/* =========================================================
   HELPERS
========================================================= */

function parseHeroSlides(content: string | null): HeroSlide[] {
  if (!content?.trim()) return defaultHeroImages;

  try {
    const parsed: unknown = JSON.parse(content);

    if (!Array.isArray(parsed)) return defaultHeroImages;

    const slides = parsed.filter(
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

function parseMilestones(content: string | null): Milestone[] {
  if (!content?.trim()) return defaultMilestones;

  const icons = [CalendarDays, Users, Users, Droplet, HeartHandshake];
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

function parseProgramsProjectsSettings(
  content: string | null | undefined,
): HomepageProgramsProjectsSettings {
  if (!content?.trim()) return defaultProgramsProjectsSettings;

  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;

    const displayMode =
      parsed.displayMode === "programs" || parsed.displayMode === "projects"
        ? parsed.displayMode
        : "both";

    const limit =
      typeof parsed.limit === "number" && Number.isFinite(parsed.limit)
        ? Math.min(12, Math.max(1, Math.floor(parsed.limit)))
        : 6;

    const columns =
      parsed.columns === 2 || parsed.columns === 4 ? parsed.columns : 3;

    const layout = parsed.layout === "carousel" ? "carousel" : "grid";

    const featuredIds = Array.isArray(parsed.featuredIds)
      ? parsed.featuredIds.filter(
          (id): id is string => typeof id === "string",
        )
      : [];

    return {
      displayMode,
      featuredIds,
      limit,
      layout,
      columns,
      showImages: parsed.showImages !== false,
      showProgress: parsed.showProgress !== false,
      ctaLabel:
        typeof parsed.ctaLabel === "string" && parsed.ctaLabel.trim()
          ? parsed.ctaLabel.trim()
          : "See all programs",
      ctaHref:
        typeof parsed.ctaHref === "string" && parsed.ctaHref.startsWith("/")
          ? parsed.ctaHref
          : "/work/programs",
    };
  } catch {
    console.error("Invalid home_programs_projects settings JSON.");
    return defaultProgramsProjectsSettings;
  }
}

function parsePartners(content: string | null | undefined): Partner[] {
  if (!content?.trim()) return [];

  try {
    const parsed: unknown = JSON.parse(content);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is Record<string, unknown> =>
          item !== null && typeof item === "object",
      )
      .map((item, index) => ({
        id:
          typeof item.id === "string" && item.id.trim()
            ? item.id.trim()
            : `partner-${index + 1}`,
        name:
          typeof item.name === "string" ? item.name.trim() : "",
        logo:
          typeof item.logo === "string" ? item.logo.trim() : "",
        website:
          typeof item.website === "string" ? item.website.trim() : "",
        description:
          typeof item.description === "string"
            ? item.description.trim()
            : "",
      }))
      .filter((partner) => partner.name && partner.logo);
  } catch {
    console.error("Invalid JSON in home_partners CMS content.");
    return [];
  }
}

function getItemDescription(item: PublicContent): string {
  const description = item.excerpt?.trim() || item.content?.trim() || "";

  if (!description) {
    return "Learn more about this initiative and how it supports our communities.";
  }

  return description.length > 180
    ? `${description.slice(0, 177).trimEnd()}...`
    : description;
}

function getProgramHref(item: PublicContent): string {
  return item.slug
    ? `/work/programs/${encodeURIComponent(item.slug)}`
    : "/work/programs";
}

function getProjectHref(item: PublicContent): string {
  return item.slug
    ? `/work/projects/${encodeURIComponent(item.slug)}`
    : "/work/projects";
}

function getGridClass(columns: 2 | 3 | 4): string {
  switch (columns) {
    case 2:
      return "sm:grid-cols-2";
    case 4:
      return "sm:grid-cols-2 xl:grid-cols-4";
    default:
      return "sm:grid-cols-2 lg:grid-cols-3";
  }
}

function isSafeExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
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
      const progress = Math.min((currentTime - startTime) / duration, 1);
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
   SHARED SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="brand-line mb-5" />
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   HOMEPAGE
========================================================= */

export default function HomePage() {
  const [activeHero, setActiveHero] = useState(0);

  const [heroContent, setHeroContent] = useState<PublicContent | null>(null);
  const [milestonesContent, setMilestonesContent] =
    useState<PublicContent | null>(null);

  const [homepageContent, setHomepageContent] = useState<PublicContent[]>([]);
  const [programsProjectsContent, setProgramsProjectsContent] =
    useState<PublicContent | null>(null);
  const [homepageContentLoading, setHomepageContentLoading] = useState(true);

  const [galleryAlbums, setGalleryAlbums] = useState<PublicGalleryAlbum[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState(false);

  /* Partners & Collaborators CMS state */
  const [partnersContent, setPartnersContent] =
    useState<PublicContent | null>(null);
  const [partnersLoading, setPartnersLoading] = useState(true);

  const milestonesRef = useRef<HTMLElement>(null);
  const [milestonesVisible, setMilestonesVisible] = useState(false);

  const heroImages = parseHeroSlides(heroContent?.content ?? null);
  const currentHero = heroImages[activeHero] ?? heroImages[0];
  const milestones = parseMilestones(milestonesContent?.content ?? null);

  /* Load one published CMS content item by key. */

  const loadPublicContent = useCallback(
    async (
      key: string,
      setter: (content: PublicContent | null) => void,
      signal: AbortSignal,
    ) => {
      try {
        const response = await fetch(
          `/api/content/public?key=${encodeURIComponent(key)}`,
          { cache: "no-store", signal },
        );

        if (!response.ok) {
          throw new Error(`Failed to load ${key}: HTTP ${response.status}`);
        }

        const result = (await response.json()) as PublicContentResponse;

        if (result.success && result.data && !Array.isArray(result.data)) {
          setter(result.data);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(`Failed to load CMS content (${key}):`, error);
        }
      }
    },
    [],
  );

  /* Load homepage CMS content. */

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

    /* Load the published partners record. */
    void (async () => {
      try {
        await loadPublicContent(
          "home_partners",
          (content) => {
            if (!controller.signal.aborted) {
              setPartnersContent(content);
            }
          },
          controller.signal,
        );
      } finally {
        if (!controller.signal.aborted) {
          setPartnersLoading(false);
        }
      }
    })();

    async function loadHomepageProgramsProjects() {
      try {
        const [contentResponse, settingsResponse] = await Promise.all([
          fetch("/api/content/public", {
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch(
            `/api/content/public?key=${encodeURIComponent("home_programs_projects")}`,
            {
              cache: "no-store",
              signal: controller.signal,
            },
          ),
        ]);

        if (contentResponse.ok) {
          const result =
            (await contentResponse.json()) as PublicContentResponse;

          if (result.success && Array.isArray(result.data)) {
            setHomepageContent(result.data);
          }
        } else {
          console.error(
            "Failed to load homepage content:",
            contentResponse.status,
          );
        }

        if (settingsResponse.ok) {
          const result =
            (await settingsResponse.json()) as PublicContentResponse;

          if (result.success && result.data && !Array.isArray(result.data)) {
            setProgramsProjectsContent(result.data);
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to load homepage programs and projects:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setHomepageContentLoading(false);
        }
      }
    }

    void loadHomepageProgramsProjects();

    return () => controller.abort();
  }, [loadPublicContent]);

  /* Load published gallery albums from the public API. */

  const loadGallery = useCallback(async (signal?: AbortSignal) => {
    try {
      setGalleryError(false);
      setGalleryLoading(true);

      const response = await fetch("/api/gallery/public", {
        method: "GET",
        cache: "no-store",
        signal,
      });

      if (!response.ok) {
        throw new Error(`Gallery request failed: HTTP ${response.status}`);
      }

      const result = (await response.json()) as PublicGalleryResponse;
      const albums = Array.isArray(result.albums) ? result.albums : [];

      setGalleryAlbums(
        albums.filter(
          (album) =>
            Boolean(album.cover) ||
            (Array.isArray(album.images) && album.images.length > 0),
        ),
      );
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;

      console.error("Failed to load public gallery:", error);
      setGalleryError(true);
      setGalleryAlbums([]);
    } finally {
      if (!signal?.aborted) {
        setGalleryLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void loadGallery(controller.signal);

    return () => controller.abort();
  }, [loadGallery]);

  /* Automatically rotate hero slides. */

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

  useEffect(() => {
    setActiveHero((current) =>
      current >= heroImages.length ? 0 : current,
    );
  }, [heroImages.length]);

  /* Animate milestones when they enter the viewport. */

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

  /* Resolve CMS display settings and selected content. */

  const settings = parseProgramsProjectsSettings(
    programsProjectsContent?.content,
  );

  const orderedContent = [...homepageContent].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  const selectedContent =
    settings.featuredIds.length > 0
      ? settings.featuredIds
          .map((id) => orderedContent.find((item) => item.id === id))
          .filter((item): item is PublicContent => Boolean(item))
      : orderedContent.filter((item) => item.isHomepage === true);

  const programs = selectedContent
    .filter((item) => item.key?.startsWith("program_"))
    .slice(0, settings.limit);

  const projects = selectedContent
    .filter((item) => item.key?.startsWith("project_"))
    .slice(0, settings.limit);

  const showPrograms =
    settings.displayMode === "both" || settings.displayMode === "programs";

  const showProjects =
    settings.displayMode === "both" || settings.displayMode === "projects";

  const contentGridClass =
    settings.layout === "carousel"
      ? "flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
      : `grid gap-5 ${getGridClass(settings.columns)}`;

  /* Resolve partners CMS content. */

  const partners = parsePartners(partnersContent?.content ?? null);

  const partnerSectionTitle =
    partnersContent?.title?.trim() ||
    "Our Valuable Partners & Collaborators";

  const partnerSectionDescription =
    partnersContent?.excerpt?.trim() ||
    "We are grateful to the organizations, institutions and collaborators who work alongside us to create meaningful and sustainable impact in our communities.";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="overflow-hidden bg-[#FCFAF7]">
      {/* HERO */}

      <section className="relative flex min-h-[85vh] items-center overflow-hidden sm:min-h-screen">
        {heroImages.map((hero, index) => (
          <div
            key={`${hero.image}-${index}`}
            aria-hidden={activeHero !== index}
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

        <div className="container-main relative z-10 py-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                Lifeline Achham
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {currentHero.title}
              <span className="mt-2 block text-[#E9B6C7]">
                {currentHero.highlight}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Working alongside communities to promote health, awareness,
              empowerment and meaningful social impact across Achham and beyond.
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

            {heroImages.length > 1 && (
              <div className="mt-8 flex items-center gap-2">
                {heroImages.map((slide, index) => (
                  <button
                    key={`${slide.image}-dot`}
                    type="button"
                    aria-label={`Show hero slide ${index + 1}`}
                    aria-pressed={activeHero === index}
                    onClick={() => setActiveHero(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeHero === index
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 sm:block">
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

      {/* MILESTONES */}

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

      {showPrograms && (
        <section className="section bg-[#FCFAF7]">
          <div className="container-main">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="What We Do"
                title="Our Programs"
                description="Our programs focus on practical community needs and creating opportunities for people to participate in positive change."
              />

              <Link
                href="/work/programs"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#2457C5]"
              >
                View all programs
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {homepageContentLoading ? (
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white"
                  />
                ))}
              </div>
            ) : programs.length > 0 ? (
              <div className={`mt-12 ${contentGridClass}`}>
                {programs.map((program, index) => (
                  <Link
                    href={getProgramHref(program)}
                    key={program.id}
                    className={`group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/25 hover:shadow-xl hover:shadow-slate-900/5 ${
                      settings.layout === "carousel"
                        ? "w-[82%] min-w-[280px] shrink-0 snap-start sm:w-[46%] lg:w-[32%]"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                        <HeartHandshake size={22} />
                      </div>
                      <span className="text-xs font-bold text-slate-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-[#172033]">
                      {program.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {getItemDescription(program)}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2457C5]">
                      Explore program
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center">
                <HeartHandshake className="mx-auto text-[#7A1F3D]" size={30} />
                <h3 className="mt-4 text-lg font-bold text-[#172033]">
                  Programs coming soon
                </h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  Published programs selected for the homepage will appear here.
                  You can manage them from the homepage editor.
                </p>
                <Link
                  href="/work/programs"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]"
                >
                  Browse programs
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* PROJECTS */}

      {showProjects && (
        <section className="section bg-white">
          <div className="container-main">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Our Work"
                title="Featured Projects"
                description="Explore the initiatives through which collaboration and community participation turn ideas into meaningful action."
              />

              <Link
                href="/work/projects"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#2457C5]"
              >
                View all projects
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {homepageContentLoading ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-[#FCFAF7]"
                  />
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className={`mt-12 ${contentGridClass}`}>
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 ${
                      settings.layout === "carousel"
                        ? "w-[82%] min-w-[280px] shrink-0 snap-start sm:w-[46%] lg:w-[32%]"
                        : ""
                    }`}
                  >
                    {settings.showImages && project.imageUrl ? (
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#FCFAF7]">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/55 via-transparent to-transparent" />
                        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7A1F3D] backdrop-blur-sm">
                          Project
                        </span>
                      </div>
                    ) : (
                      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-[#F7E9EE] to-[#EEF4FF]">
                        <HandHeart size={38} className="text-[#7A1F3D]" />
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[#172033]">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {getItemDescription(project)}
                      </p>
                      <Link
                        href={getProjectHref(project)}
                        className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2457C5]"
                      >
                        Explore project
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-[#FCFAF7] px-6 py-10 text-center">
                <HandHeart className="mx-auto text-[#7A1F3D]" size={30} />
                <h3 className="mt-4 text-lg font-bold text-[#172033]">
                  Projects coming soon
                </h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  Published projects selected for the homepage will appear here.
                  Manage project visibility from your CMS homepage editor.
                </p>
                <Link
                  href="/work/projects"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]"
                >
                  Browse projects
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* HOMEPAGE CONTENT CTA */}

      <section className="bg-white pb-16">
        <div className="container-main">
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-[#FCFAF7] p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
                Discover More
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#172033]">
                Learn more about our work
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Explore our initiatives, community programs and projects.
              </p>
            </div>
            <Link
              href={settings.ctaHref}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17439F]"
            >
              {settings.ctaLabel}
              <ArrowRight size={16} />
            </Link>
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
            <SectionHeading
              eyebrow="Moments & Stories"
              title="From Our Gallery"
              description="A glimpse into community activities, campaigns and moments of collaboration."
            />

            <Link
              href="/resources/gallery"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#2457C5]"
            >
              View full gallery
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {galleryLoading ? (
            <div
              className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              aria-label="Loading gallery"
              aria-busy="true"
            >
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : galleryError ? (
            <div className="mt-12 rounded-2xl border border-slate-200 bg-[#FCFAF7] px-6 py-12 text-center">
              <Camera className="mx-auto text-[#7A1F3D]" size={32} />
              <h3 className="mt-4 text-lg font-bold text-[#172033]">
                Gallery temporarily unavailable
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                We couldn&apos;t load the gallery right now. Please try again.
              </p>
              <button
                type="button"
                onClick={() => void loadGallery()}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17439F]"
              >
                Try again
                <ArrowRight size={16} />
              </button>
            </div>
          ) : galleryAlbums.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-[#FCFAF7] px-6 py-12 text-center">
              <Camera className="mx-auto text-[#7A1F3D]" size={32} />
              <h3 className="mt-4 text-lg font-bold text-[#172033]">
                Our gallery is growing
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Photos from our community activities and campaigns will appear
                here as albums are published.
              </p>
              <Link
                href="/resources/gallery"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5]"
              >
                Visit the gallery
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {galleryAlbums.slice(0, 4).map((album) => {
                const imageSrc = album.cover || album.images?.[0]?.image;
                const photoCount =
                  typeof album.imageCount === "number"
                    ? album.imageCount
                    : album.images?.length ?? 0;

                if (!imageSrc) return null;

                return (
                  <Link
                    href="/resources/gallery"
                    key={album.id}
                    aria-label={`View gallery album: ${album.title}`}
                    className="group relative isolate overflow-hidden rounded-2xl bg-[#172033]"
                  >
                    <div className="aspect-[4/5]">
                      <img
                        src={imageSrc}
                        alt={album.coverAlt || album.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/90 via-[#172033]/15 to-transparent transition-colors duration-300 group-hover:from-[#172033]/95" />

                    {album.isFeatured && (
                      <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7A1F3D] backdrop-blur-md">
                        Featured
                      </span>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#E9B6C7]">
                        <span>{album.category || "Community"}</span>
                        {album.year && (
                          <>
                            <span aria-hidden="true">•</span>
                            <span>{album.year}</span>
                          </>
                        )}
                      </div>

                      <h3 className="mt-2 line-clamp-2 text-base font-bold text-white">
                        {album.title}
                      </h3>

                      {album.description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/75">
                          {album.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
                        <span className="text-xs font-medium text-white/80">
                          {photoCount} {photoCount === 1 ? "photo" : "photos"}
                        </span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white transition group-hover:border-white group-hover:bg-white group-hover:text-[#7A1F3D]">
                          <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* NEWS */}

      <section className="section bg-[#FCFAF7]">
        <div className="container-main">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Stay Connected"
              title="Latest Updates"
              description="Keep up with our latest news, announcements, campaigns and community activities."
            />
            <Link
              href="/resources/news"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#2457C5]"
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

      {/* BLOOD DONATION CTA */}

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

      {/* PARTNERS & COLLABORATORS — LIVE CMS CONTENT */}

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
              {partnerSectionTitle}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              {partnerSectionDescription}
            </p>
          </div>
        </div>

        {partnersLoading ? (
          <div
            className="container-main mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            aria-label="Loading partners"
            aria-busy="true"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex h-36 animate-pulse items-center justify-center rounded-2xl border border-slate-200 bg-[#FCFAF7]"
              >
                <div className="h-12 w-24 rounded-lg bg-slate-200" />
              </div>
            ))}
          </div>
        ) : partners.length === 0 ? (
          <div className="container-main mt-12">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#FCFAF7] px-6 py-10 text-center">
              <Users className="mx-auto text-[#7A1F3D]" size={32} />

              <h3 className="mt-4 text-lg font-bold text-[#172033]">
                Our partnerships are growing
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Our partners and collaborators will appear here when their
                information has been published from the website CMS.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative mt-12 overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-12 bg-gradient-to-r from-white to-transparent sm:w-32" />
            <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-12 bg-gradient-to-l from-white to-transparent sm:w-32" />

            <div
              className={`partner-marquee flex w-max ${
                partners.length < 2 ? "partner-marquee-static" : ""
              }`}
            >
              {[
                ...partners,
                ...(partners.length > 1 ? partners : []),
              ].map((partner, index) => {
                const cardContent = (
                  <>
                    <div className="flex h-20 w-full items-center justify-center">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        loading="lazy"
                        className="max-h-16 max-w-full object-contain grayscale opacity-75 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                      />
                    </div>

                    <div className="mt-3 text-center text-xs font-semibold text-slate-600">
                      {partner.name}
                    </div>

                    {partner.description && (
                      <p className="mt-1 line-clamp-2 text-center text-[11px] leading-4 text-slate-400">
                        {partner.description}
                      </p>
                    )}
                  </>
                );

                const hasExternalWebsite =
                  Boolean(partner.website) &&
                  isSafeExternalUrl(partner.website!);

                return (
                  <div
                    key={`${partner.id}-${index}`}
                    className="group mx-3 flex min-h-36 w-56 shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-5 transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/25 hover:shadow-xl hover:shadow-slate-900/5"
                  >
                    {hasExternalWebsite ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${partner.name} website`}
                        className="flex w-full flex-col items-center"
                      >
                        {cardContent}
                      </a>
                    ) : (
                      cardContent
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <style jsx>{`
          .partner-marquee {
            animation: partner-scroll 35s linear infinite;
          }

          .partner-marquee:hover {
            animation-play-state: paused;
          }

          .partner-marquee-static {
            animation: none;
            justify-content: center;
            width: 100%;
            flex-wrap: wrap;
            padding: 0 1rem;
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
