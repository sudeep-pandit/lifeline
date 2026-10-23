
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  Check,
  ExternalLink,
  Eye,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LoaderCircle,
  Megaphone,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type PublicationStatus = "DRAFT" | "PUBLISHED";

type ContentRecord = {
  id: string;
  title: string;
  key: string;
  slug: string | null;
  type: "PAGE" | "SECTION";
  status: PublicationStatus;
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  isHomepage: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

type Milestone = {
  value: string;
  label: string;
};

type HeroSlide = {
  title: string;
  highlight: string;
  image: string;
};

type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

type AboutContent = {
  label: string;
  heading: string;
  introduction: string;
  description: string;
  imageUrl: string;
  timeline: TimelineItem[];
};

type EditorSection = {
  id: string;
  title: string;
  description: string;
  icon: typeof LayoutDashboard;
  available: boolean;
};

/* =========================================================
   DEFAULT CONTENT
========================================================= */

const initialMilestones: Milestone[] = [
  { value: "3+", label: "Year of Services" },
  { value: "444+", label: "Active Donors Inside Achham" },
  { value: "180+", label: "Active Donors Outside Achham" },
  { value: "163+", label: "Donor till Date" },
  { value: "1+", label: "Happy Blood Recipients" },
];

const initialQuote =
  "Every drop of blood given is a symphony of humanity's strength, and every grateful recipient becomes a living melody of our shared dedication.";

const initialHeroSlides: HeroSlide[] = [
  {
    title: "Building healthier",
    highlight: "communities together.",
    image:
      "https://gracesocietynepal.org/wp-content/uploads/2025/02/community.jpg",
  },
  {
    title: "Every contribution",
    highlight: "can save a life.",
    image: "https://risingnepaldaily.com/storage/media/3976/blood.jpg",
  },
  {
    title: "Together we can",
    highlight: "create meaningful change.",
    image:
      "https://giro555.nl/content/uploads/2015/06/ICCO-dekens-820x536.png",
  },
  {
    title: "Stronger communities",
    highlight: "start with action.",
    image:
      "https://creasionorg.wordpress.com/wp-content/uploads/2018/07/37600696_10156701903381617_4832855264845627392_n.jpg",
  },
];

const initialTimeline: TimelineItem[] = [
  {
    year: "2082 B.S.",
    title: "Establishment",
    description:
      "Lifeline Achham was established with a commitment to community health and social development.",
  },
  {
    year: "2083 B.S.",
    title: "Expanding Our Reach",
    description:
      "Strengthening community engagement, awareness, and initiatives to support people in need.",
  },
];

const initialAbout: AboutContent = {
  label: "Who We Are",
  heading:
    "Working with communities for a healthier and stronger future.",
  introduction:
    "Lifeline Achham is a community-focused organization committed to creating meaningful social impact through health, awareness, empowerment and collaborative action.",
  description:
    "We believe lasting change begins by listening to communities, understanding local needs and working together toward practical and sustainable solutions.",
  imageUrl: "",
  timeline: initialTimeline.map((item) => ({ ...item })),
};

const editorSections: EditorSection[] = [
  {
    id: "milestones",
    title: "Milestones Till Now",
    description: "Edit your homepage statistics and quotation.",
    icon: Users,
    available: true,
  },
  {
    id: "hero",
    title: "Hero Slides",
    description: "Manage homepage banner images and text.",
    icon: ImageIcon,
    available: true,
  },
  {
    id: "about",
    title: "Who We Are",
    description: "Edit About content and organizational timeline.",
    icon: FileText,
    available: true,
  },
  {
    id: "programs",
    title: "Programs & Projects",
    description: "Manage homepage program highlights.",
    icon: LayoutDashboard,
    available: false,
  },
  {
    id: "campaigns",
    title: "Campaigns",
    description: "Feature current campaigns.",
    icon: Megaphone,
    available: false,
  },
  {
    id: "partners",
    title: "Partners & Collaborators",
    description: "Manage partner logos and recognition.",
    icon: Users,
    available: false,
  },
];

/* =========================================================
   HELPERS
========================================================= */

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#2457C5] focus:ring-4 focus:ring-[#2457C5]/10";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

function parseMilestones(content: string | null): Milestone[] {
  if (!content?.trim()) {
    return initialMilestones.map((item) => ({ ...item }));
  }

  const parsed = content
    .split(/\r?\n/)
    .map((line) => {
      const separator = line.indexOf("|");

      if (separator === -1) return null;

      const value = line.slice(0, separator).trim();
      const label = line.slice(separator + 1).trim();

      return value && label ? { value, label } : null;
    })
    .filter((item): item is Milestone => item !== null);

  return parsed.length === 5
    ? parsed
    : initialMilestones.map((item) => ({ ...item }));
}

function parseHeroSlides(content: string | null): HeroSlide[] {
  if (!content?.trim()) {
    return initialHeroSlides.map((slide) => ({ ...slide }));
  }

  try {
    const parsed: unknown = JSON.parse(content);

    if (
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      parsed.every(
        (item) =>
          item &&
          typeof item.title === "string" &&
          typeof item.highlight === "string" &&
          typeof item.image === "string",
      )
    ) {
      return parsed as HeroSlide[];
    }
  } catch {
    // Use defaults when saved JSON is invalid.
  }

  return initialHeroSlides.map((slide) => ({ ...slide }));
}

function parseAboutContent(
  content: string | null,
): Partial<AboutContent> {
  if (!content?.trim()) return {};

  try {
    const parsed: unknown = JSON.parse(content);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed as Partial<AboutContent>;
    }
  } catch {
    // Use defaults when saved JSON is invalid.
  }

  return {};
}

function parseTimeline(value: unknown): TimelineItem[] {
  if (!Array.isArray(value)) {
    return initialTimeline.map((item) => ({ ...item }));
  }

  const parsed = value.filter(
    (item): item is TimelineItem =>
      !!item &&
      typeof item.year === "string" &&
      typeof item.title === "string" &&
      typeof item.description === "string",
  );

  return parsed;
}

/* =========================================================
   HOMEPAGE EDITOR
========================================================= */

export default function HomepageEditor() {
  const [milestoneRecord, setMilestoneRecord] =
    useState<ContentRecord | null>(null);

  const [heroRecord, setHeroRecord] =
    useState<ContentRecord | null>(null);

  const [aboutRecord, setAboutRecord] =
    useState<ContentRecord | null>(null);

  const [title, setTitle] = useState("Milestones Till Now");
  const [quote, setQuote] = useState(initialQuote);
  const [milestones, setMilestones] = useState<Milestone[]>(
    initialMilestones.map((item) => ({ ...item })),
  );
  const [status, setStatus] =
    useState<PublicationStatus>("DRAFT");

  const [heroTitle, setHeroTitle] =
    useState("Homepage Hero Slides");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(
    initialHeroSlides.map((slide) => ({ ...slide })),
  );
  const [heroStatus, setHeroStatus] =
    useState<PublicationStatus>("DRAFT");

  const [about, setAbout] = useState<AboutContent>({
    ...initialAbout,
    timeline: initialTimeline.map((item) => ({ ...item })),
  });
  const [aboutStatus, setAboutStatus] =
    useState<PublicationStatus>("DRAFT");

  const [activeSection, setActiveSection] =
    useState("milestones");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* -------------------------------------------------------
     LOAD CONTENT
  ------------------------------------------------------- */

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/content", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not load homepage content.",
        );
      }

      const items: ContentRecord[] = result.data ?? [];

      const existingMilestones = items.find(
        (item) => item.key === "home_milestones",
      );

      const existingHero = items.find(
        (item) => item.key === "home_hero_slides",
      );

      const existingAbout = items.find(
        (item) => item.key === "home_about",
      );

      /* Milestones */

      setMilestoneRecord(existingMilestones ?? null);

      if (existingMilestones) {
        setTitle(existingMilestones.title);
        setQuote(existingMilestones.excerpt || "");
        setMilestones(parseMilestones(existingMilestones.content));
        setStatus(existingMilestones.status);
      } else {
        setTitle("Milestones Till Now");
        setQuote(initialQuote);
        setMilestones(
          initialMilestones.map((item) => ({ ...item })),
        );
        setStatus("DRAFT");
      }

      /* Hero slides */

      setHeroRecord(existingHero ?? null);

      if (existingHero) {
        setHeroTitle(existingHero.title);
        setHeroDescription(existingHero.excerpt || "");
        setHeroSlides(parseHeroSlides(existingHero.content));
        setHeroStatus(existingHero.status);
      } else {
        setHeroTitle("Homepage Hero Slides");
        setHeroDescription("");
        setHeroSlides(
          initialHeroSlides.map((slide) => ({ ...slide })),
        );
        setHeroStatus("DRAFT");
      }

      /* About content and timeline */

      setAboutRecord(existingAbout ?? null);

      if (existingAbout) {
        const savedAbout = parseAboutContent(
          existingAbout.content,
        );

        setAbout({
          label: existingAbout.excerpt || initialAbout.label,
          heading: existingAbout.title || initialAbout.heading,
          introduction:
            typeof savedAbout.introduction === "string"
              ? savedAbout.introduction
              : initialAbout.introduction,
          description:
            typeof savedAbout.description === "string"
              ? savedAbout.description
              : initialAbout.description,
          imageUrl: existingAbout.imageUrl || "",
          timeline:
            savedAbout.timeline === undefined
              ? initialTimeline.map((item) => ({ ...item }))
              : parseTimeline(savedAbout.timeline),
        });

        setAboutStatus(existingAbout.status);
      } else {
        setAbout({
          ...initialAbout,
          timeline: initialTimeline.map((item) => ({ ...item })),
        });
        setAboutStatus("DRAFT");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  /* -------------------------------------------------------
     CURRENT SECTION
  ------------------------------------------------------- */

  const isHero = activeSection === "hero";
  const isAbout = activeSection === "about";

  const currentRecord = isHero
    ? heroRecord
    : isAbout
      ? aboutRecord
      : milestoneRecord;

  const currentStatus = isHero
    ? heroStatus
    : isAbout
      ? aboutStatus
      : status;

  const currentSection = editorSections.find(
    (section) => section.id === activeSection,
  );

  /* -------------------------------------------------------
     ABOUT EDITING
  ------------------------------------------------------- */

  function updateAbout(
    field: keyof Omit<AboutContent, "timeline">,
    value: string,
  ) {
    setAbout((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateTimeline(
    index: number,
    field: keyof TimelineItem,
    value: string,
  ) {
    setAbout((current) => ({
      ...current,
      timeline: current.timeline.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item,
      ),
    }));
  }

  function addTimelineItem() {
    setAbout((current) => ({
      ...current,
      timeline: [
        ...current.timeline,
        {
          year: "",
          title: "",
          description: "",
        },
      ],
    }));
  }

  function removeTimelineItem(index: number) {
    setAbout((current) => ({
      ...current,
      timeline: current.timeline.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  function moveTimelineItem(
    index: number,
    direction: -1 | 1,
  ) {
    setAbout((current) => {
      const targetIndex = index + direction;

      if (
        targetIndex < 0 ||
        targetIndex >= current.timeline.length
      ) {
        return current;
      }

      const timeline = [...current.timeline];

      [timeline[index], timeline[targetIndex]] = [
        timeline[targetIndex],
        timeline[index],
      ];

      return { ...current, timeline };
    });
  }

  /* -------------------------------------------------------
     MILESTONE EDITING
  ------------------------------------------------------- */

  function updateMilestone(
    index: number,
    field: keyof Milestone,
    value: string,
  ) {
    setMilestones((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item,
      ),
    );
  }

  /* -------------------------------------------------------
     HERO EDITING
  ------------------------------------------------------- */

  function updateHeroSlide(
    index: number,
    field: keyof HeroSlide,
    value: string,
  ) {
    setHeroSlides((current) =>
      current.map((slide, slideIndex) =>
        slideIndex === index
          ? { ...slide, [field]: value }
          : slide,
      ),
    );
  }

  function moveHeroSlide(
    index: number,
    direction: -1 | 1,
  ) {
    setHeroSlides((current) => {
      const targetIndex = index + direction;

      if (
        targetIndex < 0 ||
        targetIndex >= current.length
      ) {
        return current;
      }

      const next = [...current];

      [next[index], next[targetIndex]] = [
        next[targetIndex],
        next[index],
      ];

      return next;
    });
  }

  function addHeroSlide() {
    setHeroSlides((current) => [
      ...current,
      {
        title: "Your new heading",
        highlight: "Your highlighted text.",
        image: "",
      },
    ]);
  }

  function removeHeroSlide(index: number) {
    if (heroSlides.length <= 1) {
      setError("Keep at least one hero slide.");
      return;
    }

    setHeroSlides((current) =>
      current.filter((_, slideIndex) => slideIndex !== index),
    );

    setError("");
  }

  /* -------------------------------------------------------
     SAVE CONTENT
  ------------------------------------------------------- */

  async function saveContent() {
    setSaving(true);
    setError("");
    setMessage("");

    if (isHero) {
      if (!heroTitle.trim()) {
        setError("Please enter a hero section title.");
        setSaving(false);
        return;
      }

      if (
        heroSlides.some(
          (slide) =>
            !slide.title.trim() ||
            !slide.highlight.trim() ||
            !slide.image.trim(),
        )
      ) {
        setError(
          "Complete the heading, highlighted text, and image URL for every slide.",
        );
        setSaving(false);
        return;
      }
    } else if (isAbout) {
      if (!about.label.trim() || !about.heading.trim()) {
        setError(
          "Please enter the About section label and heading.",
        );
        setSaving(false);
        return;
      }

      if (
        !about.introduction.trim() ||
        !about.description.trim()
      ) {
        setError("Please complete both About paragraphs.");
        setSaving(false);
        return;
      }

      if (
        about.timeline.some(
          (item) =>
            !item.year.trim() ||
            !item.title.trim() ||
            !item.description.trim(),
        )
      ) {
        setError(
          "Complete every timeline entry or remove any empty entry.",
        );
        setSaving(false);
        return;
      }

      if (
        about.imageUrl.trim() &&
        !/^https?:\/\/\S+$/i.test(about.imageUrl.trim())
      ) {
        setError(
          "Please enter a valid image URL beginning with http:// or https://.",
        );
        setSaving(false);
        return;
      }
    } else {
      if (!title.trim()) {
        setError("Please enter a section title.");
        setSaving(false);
        return;
      }

      if (
        milestones.some(
          (item) => !item.value.trim() || !item.label.trim(),
        )
      ) {
        setError("Please complete all five statistics.");
        setSaving(false);
        return;
      }
    }

    const commonFields = {
      type: "SECTION",
      isHomepage: true,
    };

    const payload = isHero
      ? {
          ...commonFields,
          title: heroTitle.trim(),
          key: "home_hero_slides",
          slug:
            heroRecord?.slug || "homepage-hero-slides",
          status: heroStatus,
          excerpt: heroDescription.trim(),
          content: JSON.stringify(
            heroSlides.map((slide) => ({
              title: slide.title.trim(),
              highlight: slide.highlight.trim(),
              image: slide.image.trim(),
            })),
          ),
          imageUrl: heroRecord?.imageUrl || "",
          seoTitle: heroRecord?.seoTitle || "",
          seoDescription: heroRecord?.seoDescription || "",
          seoKeywords: heroRecord?.seoKeywords || "",
          isFeatured: heroRecord?.isFeatured ?? true,
          sortOrder: heroRecord?.sortOrder ?? 0,
        }
      : isAbout
        ? {
            ...commonFields,
            title: about.heading.trim(),
            key: "home_about",
            slug:
              aboutRecord?.slug ||
              "homepage-about-lifeline-achham",
            status: aboutStatus,
            excerpt: about.label.trim(),
            content: JSON.stringify({
              introduction: about.introduction.trim(),
              description: about.description.trim(),
              timeline: about.timeline.map((item) => ({
                year: item.year.trim(),
                title: item.title.trim(),
                description: item.description.trim(),
              })),
            }),
            imageUrl: about.imageUrl.trim(),
            seoTitle: aboutRecord?.seoTitle || "",
            seoDescription: aboutRecord?.seoDescription || "",
            seoKeywords: aboutRecord?.seoKeywords || "",
            isFeatured: aboutRecord?.isFeatured ?? false,
            sortOrder: aboutRecord?.sortOrder ?? 1,
          }
        : {
            ...commonFields,
            title: title.trim(),
            key: "home_milestones",
            slug:
              milestoneRecord?.slug || "milestones-till-now",
            status,
            excerpt: quote.trim(),
            content: milestones
              .map(
                (item) =>
                  `${item.value.trim()} | ${item.label.trim()}`,
              )
              .join("\n"),
            imageUrl: milestoneRecord?.imageUrl || "",
            seoTitle: milestoneRecord?.seoTitle || "",
            seoDescription:
              milestoneRecord?.seoDescription || "",
            seoKeywords: milestoneRecord?.seoKeywords || "",
            isFeatured: milestoneRecord?.isFeatured ?? false,
            sortOrder: milestoneRecord?.sortOrder ?? 0,
          };

    try {
      const response = await fetch(
        currentRecord
          ? `/api/content/${currentRecord.id}`
          : "/api/content",
        {
          method: currentRecord ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save changes.",
        );
      }

      setMessage(
        currentStatus === "PUBLISHED"
          ? "Changes saved and published successfully."
          : "Changes saved as a draft. They are not visible publicly.",
      );

      await loadContent();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* -------------------------------------------------------
     LOADING STATE
  ------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center gap-3">
        <LoaderCircle
          className="animate-spin text-[#7A1F3D]"
          size={27}
        />
        <span className="text-sm text-slate-500">
          Loading homepage editor...
        </span>
      </div>
    );
  }

  /* -------------------------------------------------------
     USER INTERFACE
  ------------------------------------------------------- */

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/admin/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#7A1F3D]"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
            Homepage Editor
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage the content displayed on your public homepage.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-[#2457C5] hover:text-[#2457C5]"
        >
          <Eye size={17} />
          View Website
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* Feedback */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <Check size={18} className="mt-0.5 shrink-0" />
          {message}
        </div>
      )}

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Homepage Sections
          </p>
          <p className="mt-2 text-2xl font-bold text-[#172033]">
            {editorSections.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Available and planned content areas.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isHero
              ? "Hero Slides"
              : isAbout
                ? "Timeline Entries"
                : "Milestones"}
          </p>
          <p className="mt-2 text-2xl font-bold text-[#2457C5]">
            {isHero
              ? heroSlides.length
              : isAbout
                ? about.timeline.length
                : milestones.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {isHero
              ? "Slides configured in the editor."
              : isAbout
                ? "Editable entries in your organizational journey."
                : "Statistics configured for your homepage."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Publication Status
          </p>
          <p className="mt-2 font-bold text-[#172033]">
            {currentStatus === "PUBLISHED" ? "Published" : "Draft"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {currentStatus === "PUBLISHED"
              ? "This content record is published."
              : "This content record is not publicly published."}
          </p>
        </div>
      </div>

      {/* Editor layout */}

      <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar */}

        <aside className="rounded-2xl border border-slate-200 bg-white p-3">
          <div className="px-3 pb-3 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Homepage Sections
            </h2>
          </div>

          <nav aria-label="Homepage sections" className="space-y-1">
            {editorSections.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => {
                    if (section.available) {
                      setActiveSection(section.id);
                      setError("");
                      setMessage("");
                    }
                  }}
                  disabled={!section.available}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    active
                      ? "bg-[#F7E9EE] text-[#7A1F3D]"
                      : section.available
                        ? "text-slate-600 hover:bg-slate-50"
                        : "cursor-not-allowed text-slate-400"
                  }`}
                >
                  <Icon size={18} className="shrink-0" />

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {section.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 opacity-75">
                      {section.available
                        ? "Manage section"
                        : "Coming next"}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main editor */}

        <div className="min-w-0 space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#2457C5]">
                Homepage Content
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#172033]">
                {currentSection?.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {currentSection?.description}
              </p>
            </div>

            {/* HERO SLIDES EDITOR */}

            {isHero ? (
              <div className="space-y-5 p-5 sm:p-7">
                <div>
                  <label
                    htmlFor="hero-section-title"
                    className={labelClass}
                  >
                    CMS record title
                  </label>
                  <input
                    id="hero-section-title"
                    value={heroTitle}
                    onChange={(event) =>
                      setHeroTitle(event.target.value)
                    }
                    maxLength={120}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="hero-description"
                    className={labelClass}
                  >
                    Section description (optional)
                  </label>
                  <textarea
                    id="hero-description"
                    value={heroDescription}
                    onChange={(event) =>
                      setHeroDescription(event.target.value)
                    }
                    rows={2}
                    maxLength={2000}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-bold text-[#172033]">
                      Hero Slides
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Use publicly accessible image URLs.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addHeroSlide}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Plus size={17} />
                    Add Slide
                  </button>
                </div>

                {heroSlides.map((slide, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-[#FCFAF7] p-4 sm:p-5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-[#172033]">
                        Slide {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveHeroSlide(index, -1)}
                          disabled={index === 0}
                          aria-label={`Move slide ${index + 1} up`}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
                        >
                          <ArrowUp size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => moveHeroSlide(index, 1)}
                          disabled={index === heroSlides.length - 1}
                          aria-label={`Move slide ${index + 1} down`}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
                        >
                          <ArrowDown size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeHeroSlide(index)}
                          aria-label={`Remove slide ${index + 1}`}
                          className="rounded-lg border border-red-100 bg-white p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`hero-heading-${index}`}
                          className={labelClass}
                        >
                          Main heading
                        </label>
                        <input
                          id={`hero-heading-${index}`}
                          value={slide.title}
                          onChange={(event) =>
                            updateHeroSlide(
                              index,
                              "title",
                              event.target.value,
                            )
                          }
                          maxLength={160}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`hero-highlight-${index}`}
                          className={labelClass}
                        >
                          Highlighted text
                        </label>
                        <input
                          id={`hero-highlight-${index}`}
                          value={slide.highlight}
                          onChange={(event) =>
                            updateHeroSlide(
                              index,
                              "highlight",
                              event.target.value,
                            )
                          }
                          maxLength={160}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor={`hero-image-${index}`}
                        className={labelClass}
                      >
                        Background image URL
                      </label>
                      <input
                        id={`hero-image-${index}`}
                        type="url"
                        value={slide.image}
                        onChange={(event) =>
                          updateHeroSlide(
                            index,
                            "image",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                        placeholder="https://example.com/hero-image.jpg"
                      />
                    </div>

                    {slide.image.trim() && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slide.image}
                          alt={`Hero slide ${index + 1} preview`}
                          className="h-40 w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                          }}
                          onLoad={(event) => {
                            event.currentTarget.style.visibility = "visible";
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : isAbout ? (
              /* WHO WE ARE AND TIMELINE EDITOR */

              <div className="space-y-7 p-5 sm:p-7">
                <div className="space-y-5">
                  <div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#7A1F3D]">
                      About Section
                    </p>

                    <label
                      htmlFor="about-label"
                      className={labelClass}
                    >
                      Section label
                    </label>
                    <input
                      id="about-label"
                      value={about.label}
                      onChange={(event) =>
                        updateAbout("label", event.target.value)
                      }
                      maxLength={120}
                      className={inputClass}
                      placeholder="Who We Are"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="about-heading"
                      className={labelClass}
                    >
                      Main heading
                    </label>
                    <textarea
                      id="about-heading"
                      value={about.heading}
                      onChange={(event) =>
                        updateAbout("heading", event.target.value)
                      }
                      rows={2}
                      maxLength={300}
                      className={`${inputClass} resize-y`}
                      placeholder="Working with communities for a healthier future."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="about-introduction"
                      className={labelClass}
                    >
                      Introduction paragraph
                    </label>
                    <textarea
                      id="about-introduction"
                      value={about.introduction}
                      onChange={(event) =>
                        updateAbout("introduction", event.target.value)
                      }
                      rows={5}
                      maxLength={5000}
                      className={`${inputClass} resize-y leading-7`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="about-description"
                      className={labelClass}
                    >
                      Additional description
                    </label>
                    <textarea
                      id="about-description"
                      value={about.description}
                      onChange={(event) =>
                        updateAbout("description", event.target.value)
                      }
                      rows={5}
                      maxLength={5000}
                      className={`${inputClass} resize-y leading-7`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="about-image"
                      className={labelClass}
                    >
                      About image URL (optional)
                    </label>
                    <input
                      id="about-image"
                      type="url"
                      value={about.imageUrl}
                      onChange={(event) =>
                        updateAbout("imageUrl", event.target.value)
                      }
                      className={inputClass}
                      placeholder="https://example.com/about-image.jpg"
                    />
                    <p className="mt-1.5 text-xs text-slate-400">
                      Enter a publicly accessible image URL.
                    </p>
                  </div>

                  {about.imageUrl.trim() &&
                    /^https?:\/\/\S+$/i.test(about.imageUrl.trim()) && (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#FCFAF7]">
                        <div className="border-b border-slate-100 px-4 py-3">
                          <p className="text-sm font-semibold text-[#172033]">
                            Image preview
                          </p>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={about.imageUrl}
                          alt="About section preview"
                          className="max-h-80 w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                          }}
                          onLoad={(event) => {
                            event.currentTarget.style.visibility = "visible";
                          }}
                        />
                      </div>
                    )}
                </div>

                {/* TIMELINE EDITOR */}

                <div className="space-y-5 border-t border-slate-100 pt-7">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#7A1F3D]">
                        Organizational History
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-[#172033]">
                        Our Journey Timeline
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Add the important events in your organization&apos;s
                        history.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addTimelineItem}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                    >
                      <Plus size={16} />
                      Add Timeline Entry
                    </button>
                  </div>

                  {about.timeline.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-[#FCFAF7] p-4 sm:p-5"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-[#172033]">
                          Timeline Entry{" "}
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              moveTimelineItem(index, -1)
                            }
                            disabled={index === 0}
                            aria-label={`Move timeline entry ${index + 1} up`}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
                          >
                            <ArrowUp size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveTimelineItem(index, 1)
                            }
                            disabled={
                              index === about.timeline.length - 1
                            }
                            aria-label={`Move timeline entry ${index + 1} down`}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
                          >
                            <ArrowDown size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeTimelineItem(index)}
                            aria-label={`Remove timeline entry ${index + 1}`}
                            className="rounded-lg border border-red-100 bg-white p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor={`timeline-year-${index}`}
                            className={labelClass}
                          >
                            Year / Date
                          </label>
                          <input
                            id={`timeline-year-${index}`}
                            value={item.year}
                            onChange={(event) =>
                              updateTimeline(
                                index,
                                "year",
                                event.target.value,
                              )
                            }
                            maxLength={80}
                            className={inputClass}
                            placeholder="2082 B.S."
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`timeline-title-${index}`}
                            className={labelClass}
                          >
                            Milestone title
                          </label>
                          <input
                            id={`timeline-title-${index}`}
                            value={item.title}
                            onChange={(event) =>
                              updateTimeline(
                                index,
                                "title",
                                event.target.value,
                              )
                            }
                            maxLength={200}
                            className={inputClass}
                            placeholder="Our Beginning"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`timeline-description-${index}`}
                            className={labelClass}
                          >
                            Description
                          </label>
                          <textarea
                            id={`timeline-description-${index}`}
                            value={item.description}
                            onChange={(event) =>
                              updateTimeline(
                                index,
                                "description",
                                event.target.value,
                              )
                            }
                            rows={3}
                            maxLength={3000}
                            className={`${inputClass} resize-y leading-6`}
                            placeholder="Describe this milestone..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {about.timeline.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-7 text-center">
                      <FileText
                        size={28}
                        className="mx-auto text-slate-400"
                      />
                      <p className="mt-3 text-sm font-semibold text-[#172033]">
                        No timeline entries yet
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Add your first organizational milestone.
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                  <h3 className="text-sm font-bold text-[#172033]">
                    How this content is stored
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    The About heading, paragraphs and timeline are stored
                    together in the existing{" "}
                    <code className="rounded bg-white px-1.5 py-0.5">
                      home_about
                    </code>{" "}
                    CMS record. No new database columns are needed.
                  </p>
                </div>
              </div>
            ) : (
              /* MILESTONES EDITOR */

              <div className="space-y-5 p-5 sm:p-7">
                <div>
                  <label
                    htmlFor="milestone-title"
                    className={labelClass}
                  >
                    Section title
                  </label>
                  <input
                    id="milestone-title"
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value)
                    }
                    maxLength={120}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="milestone-quote"
                    className={labelClass}
                  >
                    Introduction / quotation
                  </label>
                  <textarea
                    id="milestone-quote"
                    value={quote}
                    onChange={(event) =>
                      setQuote(event.target.value)
                    }
                    rows={4}
                    maxLength={2000}
                    className={`${inputClass} resize-y leading-6`}
                  />
                </div>

                <div>
                  <h3 className="font-bold text-[#172033]">
                    Milestone Statistics
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Update the five statistics displayed on your homepage.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {milestones.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-[#FCFAF7] p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Milestone{" "}
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Users size={18} className="text-[#7A1F3D]" />
                      </div>

                      <label
                        htmlFor={`milestone-value-${index}`}
                        className={labelClass}
                      >
                        Number / value
                      </label>
                      <input
                        id={`milestone-value-${index}`}
                        value={item.value}
                        onChange={(event) =>
                          updateMilestone(
                            index,
                            "value",
                            event.target.value,
                          )
                        }
                        maxLength={30}
                        className={`${inputClass} mb-4 text-lg font-bold text-[#2457C5]`}
                      />

                      <label
                        htmlFor={`milestone-label-${index}`}
                        className={labelClass}
                      >
                        Label
                      </label>
                      <input
                        id={`milestone-label-${index}`}
                        value={item.label}
                        onChange={(event) =>
                          updateMilestone(
                            index,
                            "label",
                            event.target.value,
                          )
                        }
                        maxLength={150}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* PUBLICATION SETTINGS */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2457C5]">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-[#172033]">
                    Publication Settings
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Draft records are not publicly visible. Publish when
                    your content is ready.
                  </p>
                </div>
              </div>

              <div className="sm:min-w-52">
                <label
                  htmlFor="content-status"
                  className={labelClass}
                >
                  Content status
                </label>

                <select
                  id="content-status"
                  value={currentStatus}
                  onChange={(event) => {
                    const nextStatus = event.target
                      .value as PublicationStatus;

                    if (isHero) {
                      setHeroStatus(nextStatus);
                    } else if (isAbout) {
                      setAboutStatus(nextStatus);
                    } else {
                      setStatus(nextStatus);
                    }
                  }}
                  className={inputClass}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>
          </section>

          {/* SAVE */}

          <div className="sticky bottom-4 z-20 flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:px-6">
            <p className="text-xs leading-5 text-slate-500">
              {currentRecord
                ? `Editing existing ${
                    isHero
                      ? "hero slides"
                      : isAbout
                        ? "Who We Are and timeline"
                        : "milestone"
                  } record.`
                : `A new ${
                    isHero
                      ? "hero slides"
                      : isAbout
                        ? "Who We Are and timeline"
                        : "milestone"
                  } record will be created when saved.`}
            </p>

            <button
              type="button"
              onClick={saveContent}
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#641832] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving changes..." : "Save Section"}
              {!saving && <ArrowUpRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
