
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
  LoaderCircle,
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

type ProgramsProjectsContent = {
  displayMode: "programs" | "projects" | "both";
  featuredIds: string[];
  limit: number;
  layout: "grid" | "carousel";
  columns: 2 | 3 | 4;
  showImages: boolean;
  showProgress: boolean;
  ctaLabel: string;
  ctaHref: string;
};

type PickableItem = {
  id: string;
  title: string;
  key: string;
  slug: string | null;
  status: PublicationStatus;
};

type Partner = {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
};

type EditorSection = {
  id: string;
  title: string;
  description: string;
  icon: typeof Users;
};

type ApiResult<T> = {
  success?: boolean;
  data?: T;
  message?: string;
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
  heading: "Working with communities for a healthier and stronger future.",
  introduction:
    "Lifeline Achham is a community-focused organization committed to creating meaningful social impact through health, awareness, empowerment and collaborative action.",
  description:
    "We believe lasting change begins by listening to communities, understanding local needs and working together toward practical and sustainable solutions.",
  imageUrl: "",
  timeline: initialTimeline.map((item) => ({ ...item })),
};

const initialProgramsProjects: ProgramsProjectsContent = {
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

const initialPartnersDescription =
  "Organizations working with us to create meaningful community impact.";

const editorSections: EditorSection[] = [
  {
    id: "milestones",
    title: "Milestones Till Now",
    description: "Edit your homepage statistics and quotation.",
    icon: Users,
  },
  {
    id: "hero",
    title: "Hero Slides",
    description: "Manage homepage banner images and text.",
    icon: ImageIcon,
  },
  {
    id: "about",
    title: "Who We Are",
    description: "Edit About content and organizational timeline.",
    icon: FileText,
  },
  {
    id: "partners",
    title: "Partners & Collaborators",
    description: "Manage partner logos, websites, and publication.",
    icon: Users,
  },
];

/* =========================================================
   STYLES
========================================================= */

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#2457C5] focus:ring-4 focus:ring-[#2457C5]/10";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

/* =========================================================
   PARSERS AND HELPERS
========================================================= */

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

  return parsed.length > 0
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
    // Fall through to defaults.
  }

  return initialHeroSlides.map((slide) => ({ ...slide }));
}

function parseAboutContent(content: string | null): Partial<AboutContent> {
  if (!content?.trim()) return {};

  try {
    const parsed: unknown = JSON.parse(content);

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Partial<AboutContent>;
    }
  } catch {
    // Use defaults.
  }

  return {};
}

function parseTimeline(value: unknown): TimelineItem[] {
  if (!Array.isArray(value)) {
    return initialTimeline.map((item) => ({ ...item }));
  }

  return value.filter(
    (item): item is TimelineItem =>
      !!item &&
      typeof item.year === "string" &&
      typeof item.title === "string" &&
      typeof item.description === "string",
  );
}

function parseProgramsProjects(
  content: string | null,
): ProgramsProjectsContent {
  if (!content?.trim()) return { ...initialProgramsProjects };

  try {
    const parsed: unknown = JSON.parse(content);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...initialProgramsProjects };
    }

    const p = parsed as Partial<ProgramsProjectsContent>;

    return {
      displayMode:
        p.displayMode === "programs" ||
        p.displayMode === "projects" ||
        p.displayMode === "both"
          ? p.displayMode
          : "both",
      featuredIds: Array.isArray(p.featuredIds)
        ? p.featuredIds.filter((value): value is string =>
            typeof value === "string",
          )
        : [],
      limit:
        typeof p.limit === "number" && p.limit >= 1 && p.limit <= 12
          ? Math.floor(p.limit)
          : 6,
      layout: p.layout === "carousel" ? "carousel" : "grid",
      columns:
        p.columns === 2 || p.columns === 3 || p.columns === 4
          ? p.columns
          : 3,
      showImages: typeof p.showImages === "boolean" ? p.showImages : true,
      showProgress: typeof p.showProgress === "boolean" ? p.showProgress : true,
      ctaLabel: typeof p.ctaLabel === "string" ? p.ctaLabel : "",
      ctaHref: typeof p.ctaHref === "string" ? p.ctaHref : "",
    };
  } catch {
    return { ...initialProgramsProjects };
  }
}

function parsePartners(content: string | null): Partner[] {
  if (!content?.trim()) return [];

  try {
    const parsed: unknown = JSON.parse(content);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is Partial<Partner> =>
          !!item &&
          typeof item === "object" &&
          typeof item.name === "string",
      )
      .map((item, index) => ({
        id:
          typeof item.id === "string"
            ? item.id
            : `partner-${index + 1}`,
        name: item.name ?? "",
        logo: typeof item.logo === "string" ? item.logo : "",
        website: typeof item.website === "string" ? item.website : "",
        description:
          typeof item.description === "string"
            ? item.description
            : "",
      }));
  } catch {
    return [];
  }
}

function createPartner(): Partner {
  return {
    id: crypto.randomUUID(),
    name: "",
    logo: "",
    website: "",
    description: "",
  };
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/* =========================================================
   HOMEPAGE EDITOR
========================================================= */

export default function HomepageEditor() {
  const [records, setRecords] = useState<ContentRecord[]>([]);

  const [milestoneRecord, setMilestoneRecord] =
    useState<ContentRecord | null>(null);
  const [heroRecord, setHeroRecord] = useState<ContentRecord | null>(null);
  const [aboutRecord, setAboutRecord] = useState<ContentRecord | null>(null);
  const [programsRecord, setProgramsRecord] =
    useState<ContentRecord | null>(null);
  const [partnersRecord, setPartnersRecord] =
    useState<ContentRecord | null>(null);

  const [title, setTitle] = useState("Milestones Till Now");
  const [quote, setQuote] = useState(initialQuote);
  const [milestones, setMilestones] = useState<Milestone[]>(
    initialMilestones.map((item) => ({ ...item })),
  );
  const [status, setStatus] = useState<PublicationStatus>("DRAFT");

  const [heroTitle, setHeroTitle] = useState("Homepage Hero Slides");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(
    initialHeroSlides.map((slide) => ({ ...slide })),
  );
  const [heroStatus, setHeroStatus] = useState<PublicationStatus>("DRAFT");

  const [about, setAbout] = useState<AboutContent>({
    ...initialAbout,
    timeline: initialTimeline.map((item) => ({ ...item })),
  });
  const [aboutStatus, setAboutStatus] = useState<PublicationStatus>("DRAFT");

  const [programsTitle, setProgramsTitle] = useState("Programs & Projects");
  const [programsSubheading, setProgramsSubheading] = useState("");
  const [programs, setPrograms] = useState<ProgramsProjectsContent>({
    ...initialProgramsProjects,
  });
  const [programsStatus, setProgramsStatus] =
    useState<PublicationStatus>("DRAFT");
  const [programOptions, setProgramOptions] = useState<PickableItem[]>([]);
  const [projectOptions, setProjectOptions] = useState<PickableItem[]>([]);

  const [partnersTitle, setPartnersTitle] = useState(
    "Partners & Collaborators",
  );
  const [partnersDescription, setPartnersDescription] = useState(
    initialPartnersDescription,
  );
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnersStatus, setPartnersStatus] =
    useState<PublicationStatus>("DRAFT");
  const [uploadingPartnerId, setUploadingPartnerId] = useState<string | null>(
    null,
  );

  const [activeSection, setActiveSection] = useState("milestones");
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

      const result: ApiResult<ContentRecord[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load homepage content.");
      }

      const items = result.data ?? [];
      setRecords(items);

      const existingMilestones =
        items.find((item) => item.key === "home_milestones") ?? null;
      const existingHero =
        items.find((item) => item.key === "home_hero_slides") ?? null;
      const existingAbout =
        items.find((item) => item.key === "home_about") ?? null;
      const existingPrograms =
        items.find((item) => item.key === "home_programs_projects") ?? null;
      const existingPartners =
        items.find((item) => item.key === "home_partners") ?? null;

      /* Milestones */
      setMilestoneRecord(existingMilestones);

      if (existingMilestones) {
        setTitle(existingMilestones.title);
        setQuote(existingMilestones.excerpt || "");
        setMilestones(parseMilestones(existingMilestones.content));
        setStatus(existingMilestones.status);
      } else {
        setTitle("Milestones Till Now");
        setQuote(initialQuote);
        setMilestones(initialMilestones.map((item) => ({ ...item })));
        setStatus("DRAFT");
      }

      /* Hero */
      setHeroRecord(existingHero);

      if (existingHero) {
        setHeroTitle(existingHero.title);
        setHeroDescription(existingHero.excerpt || "");
        setHeroSlides(parseHeroSlides(existingHero.content));
        setHeroStatus(existingHero.status);
      } else {
        setHeroTitle("Homepage Hero Slides");
        setHeroDescription("");
        setHeroSlides(initialHeroSlides.map((slide) => ({ ...slide })));
        setHeroStatus("DRAFT");
      }

      /* About */
      setAboutRecord(existingAbout);

      if (existingAbout) {
        const saved = parseAboutContent(existingAbout.content);

        setAbout({
          label: existingAbout.excerpt || initialAbout.label,
          heading: existingAbout.title || initialAbout.heading,
          introduction:
            typeof saved.introduction === "string"
              ? saved.introduction
              : initialAbout.introduction,
          description:
            typeof saved.description === "string"
              ? saved.description
              : initialAbout.description,
          imageUrl: existingAbout.imageUrl || "",
          timeline:
            saved.timeline === undefined
              ? initialTimeline.map((item) => ({ ...item }))
              : parseTimeline(saved.timeline),
        });

        setAboutStatus(existingAbout.status);
      } else {
        setAbout({
          ...initialAbout,
          timeline: initialTimeline.map((item) => ({ ...item })),
        });
        setAboutStatus("DRAFT");
      }

      /* Programs & Projects */
      setProgramsRecord(existingPrograms);

      if (existingPrograms) {
        setProgramsTitle(existingPrograms.title);
        setProgramsSubheading(existingPrograms.excerpt || "");
        setPrograms(parseProgramsProjects(existingPrograms.content));
        setProgramsStatus(existingPrograms.status);
      } else {
        setProgramsTitle("Programs & Projects");
        setProgramsSubheading("");
        setPrograms({ ...initialProgramsProjects });
        setProgramsStatus("DRAFT");
      }

      /* Partners */
      setPartnersRecord(existingPartners);

      if (existingPartners) {
        setPartnersTitle(existingPartners.title);
        setPartnersDescription(
          existingPartners.excerpt || initialPartnersDescription,
        );
        setPartners(parsePartners(existingPartners.content));
        setPartnersStatus(existingPartners.status);
      } else {
        setPartnersTitle("Partners & Collaborators");
        setPartnersDescription(initialPartnersDescription);
        setPartners([]);
        setPartnersStatus("DRAFT");
      }

      /* Feature picker */
      setProgramOptions(
        items
          .filter(
            (item) =>
              item.type === "SECTION" &&
              item.key.startsWith("program_") &&
              item.status === "PUBLISHED",
          )
          .map((item) => ({
            id: item.id,
            title: item.title,
            key: item.key,
            slug: item.slug,
            status: item.status,
          })),
      );

      setProjectOptions(
        items
          .filter(
            (item) =>
              item.type === "SECTION" &&
              item.key.startsWith("project_") &&
              item.status === "PUBLISHED",
          )
          .map((item) => ({
            id: item.id,
            title: item.title,
            key: item.key,
            slug: item.slug,
            status: item.status,
          })),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
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
  const isPrograms = activeSection === "programs";
  const isPartners = activeSection === "partners";

  const currentRecord = isHero
    ? heroRecord
    : isAbout
      ? aboutRecord
      : isPrograms
        ? programsRecord
        : isPartners
          ? partnersRecord
          : milestoneRecord;

  const currentStatus = isHero
    ? heroStatus
    : isAbout
      ? aboutStatus
      : isPrograms
        ? programsStatus
        : isPartners
          ? partnersStatus
          : status;

  const currentSection = editorSections.find(
    (section) => section.id === activeSection,
  );

  const currentItemCount = isHero
    ? heroSlides.length
    : isAbout
      ? about.timeline.length
      : isPrograms
        ? programs.featuredIds.length
        : isPartners
          ? partners.length
          : milestones.length;

  const currentItemLabel = isHero
    ? "Hero Slides"
    : isAbout
      ? "Timeline Entries"
      : isPrograms
        ? "Featured Items"
        : isPartners
          ? "Partners"
          : "Milestones";

  /* -------------------------------------------------------
     SHARED REORDER HELPER
  ------------------------------------------------------- */

  function moveItem<T>(
    items: T[],
    index: number,
    direction: -1 | 1,
  ): T[] {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= items.length) {
      return items;
    }

    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

    return next;
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
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
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
      current.map((slide, i) =>
        i === index ? { ...slide, [field]: value } : slide,
      ),
    );
  }

  function addHeroSlide() {
    setHeroSlides((current) => [
      ...current,
      { title: "", highlight: "", image: "" },
    ]);
  }

  function removeHeroSlide(index: number) {
    setHeroSlides((current) => {
      if (current.length <= 1) {
        setError("Keep at least one hero slide.");
        return current;
      }

      return current.filter((_, i) => i !== index);
    });
  }

  /* -------------------------------------------------------
     ABOUT AND TIMELINE EDITING
  ------------------------------------------------------- */

  function updateAbout(
    field: keyof Omit<AboutContent, "timeline">,
    value: string,
  ) {
    setAbout((current) => ({ ...current, [field]: value }));
  }

  function updateTimeline(
    index: number,
    field: keyof TimelineItem,
    value: string,
  ) {
    setAbout((current) => ({
      ...current,
      timeline: current.timeline.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addTimelineItem() {
    setAbout((current) => ({
      ...current,
      timeline: [
        ...current.timeline,
        { year: "", title: "", description: "" },
      ],
    }));
  }

  function removeTimelineItem(index: number) {
    setAbout((current) => ({
      ...current,
      timeline: current.timeline.filter((_, i) => i !== index),
    }));
  }

  /* -------------------------------------------------------
     PROGRAMS & PROJECTS EDITING
  ------------------------------------------------------- */

  function toggleProgramsFeatured(id: string) {
    setPrograms((current) => {
      if (current.featuredIds.includes(id)) {
        return {
          ...current,
          featuredIds: current.featuredIds.filter((value) => value !== id),
        };
      }

      if (current.featuredIds.length >= current.limit) {
        return current;
      }

      return {
        ...current,
        featuredIds: [...current.featuredIds, id],
      };
    });
  }

  /* -------------------------------------------------------
     PARTNER EDITING
  ------------------------------------------------------- */

  function updatePartner(
    id: string,
    field: keyof Omit<Partner, "id">,
    value: string,
  ) {
    setPartners((current) =>
      current.map((partner) =>
        partner.id === id ? { ...partner, [field]: value } : partner,
      ),
    );
  }

  function addPartner() {
    setPartners((current) => [...current, createPartner()]);
  }

  function removePartner(id: string) {
    setPartners((current) =>
      current.filter((partner) => partner.id !== id),
    );
  }

  async function uploadPartnerLogo(id: string, file: File) {
    setError("");
    setMessage("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPG, PNG, WebP, GIF, or SVG image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("The logo must be 10 MB or smaller.");
      return;
    }

    setUploadingPartnerId(id);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", "Partner organization logo");

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.media?.url) {
        throw new Error(result.error || "Logo upload failed.");
      }

      updatePartner(id, "logo", result.media.url);
      setMessage("Logo uploaded. Save the Partners section to keep your changes.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to upload logo.",
      );
    } finally {
      setUploadingPartnerId(null);
    }
  }

  /* -------------------------------------------------------
     SAVE CONTENT
  ------------------------------------------------------- */

  async function saveContent() {
    if (saving) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      /* Validation */
      if (isHero) {
        if (!heroTitle.trim()) {
          throw new Error("Please enter a hero section title.");
        }

        if (
          heroSlides.length === 0 ||
          heroSlides.some(
            (slide) =>
              !slide.title.trim() ||
              !slide.highlight.trim() ||
              !slide.image.trim(),
          )
        ) {
          throw new Error(
            "Complete the heading, highlighted text, and image URL for every hero slide.",
          );
        }
      } else if (isAbout) {
        if (!about.label.trim() || !about.heading.trim()) {
          throw new Error("Enter the About section label and heading.");
        }

        if (!about.introduction.trim() || !about.description.trim()) {
          throw new Error("Complete both About paragraphs.");
        }

        if (
          about.timeline.some(
            (item) =>
              !item.year.trim() ||
              !item.title.trim() ||
              !item.description.trim(),
          )
        ) {
          throw new Error(
            "Complete every timeline entry or remove any empty entry.",
          );
        }

        if (
          about.imageUrl.trim() &&
          !isValidHttpUrl(about.imageUrl.trim()) &&
          !about.imageUrl.trim().startsWith("/uploads/")
        ) {
          throw new Error(
            "Enter a valid image URL or a local /uploads/ image path.",
          );
        }
      } else if (isPrograms) {
        if (!programsTitle.trim()) {
          throw new Error("Please enter a section title.");
        }

        if (programs.featuredIds.length === 0) {
          throw new Error("Select at least one program or project to feature.");
        }

        if (programs.featuredIds.length > programs.limit) {
          throw new Error(`Select ${programs.limit} or fewer featured items.`);
        }

        if (
          programs.ctaHref.trim() &&
          !programs.ctaHref.startsWith("/") &&
          !isValidHttpUrl(programs.ctaHref.trim())
        ) {
          throw new Error("CTA link must start with / or http(s)://.");
        }
      } else if (isPartners) {
        if (!partnersTitle.trim()) {
          throw new Error("Please enter a Partners section title.");
        }

        if (uploadingPartnerId) {
          throw new Error("Wait for the current logo upload to finish.");
        }

        if (
          partners.some(
            (partner) => !partner.name.trim() || !partner.logo.trim(),
          )
        ) {
          throw new Error("Every partner must have a name and logo.");
        }

        if (
          partners.some(
            (partner) =>
              partner.website.trim() &&
              !isValidHttpUrl(partner.website.trim()),
          )
        ) {
          throw new Error(
            "Partner website links must use a valid http:// or https:// URL.",
          );
        }
      } else {
        if (!title.trim()) {
          throw new Error("Please enter a section title.");
        }

        if (
          milestones.some(
            (item) => !item.value.trim() || !item.label.trim(),
          )
        ) {
          throw new Error("Please complete every milestone statistic.");
        }
      }

      const commonFields = {
        type: "SECTION" as const,
        isHomepage: true,
      };

      let payload: Record<string, unknown>;

      if (isHero) {
        payload = {
          ...commonFields,
          title: heroTitle.trim(),
          key: "home_hero_slides",
          slug: heroRecord?.slug || "homepage-hero-slides",
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
        };
      } else if (isAbout) {
        payload = {
          ...commonFields,
          title: about.heading.trim(),
          key: "home_about",
          slug: aboutRecord?.slug || "homepage-about-lifeline-achham",
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
        };
      } else if (isPrograms) {
        payload = {
          ...commonFields,
          title: programsTitle.trim(),
          key: "home_programs_projects",
          slug: programsRecord?.slug || "homepage-programs-projects",
          status: programsStatus,
          excerpt: programsSubheading.trim(),
          content: JSON.stringify({
            displayMode: programs.displayMode,
            featuredIds: programs.featuredIds,
            limit: programs.limit,
            layout: programs.layout,
            columns: programs.columns,
            showImages: programs.showImages,
            showProgress: programs.showProgress,
            ctaLabel: programs.ctaLabel.trim(),
            ctaHref: programs.ctaHref.trim(),
          }),
          imageUrl: programsRecord?.imageUrl || "",
          seoTitle: programsRecord?.seoTitle || "",
          seoDescription: programsRecord?.seoDescription || "",
          seoKeywords: programsRecord?.seoKeywords || "",
          isFeatured: programsRecord?.isFeatured ?? false,
          sortOrder: programsRecord?.sortOrder ?? 2,
        };
      } else if (isPartners) {
        payload = {
          ...commonFields,
          title: partnersTitle.trim(),
          key: "home_partners",
          slug: partnersRecord?.slug || "homepage-partners",
          status: partnersStatus,
          excerpt: partnersDescription.trim(),
          content: JSON.stringify(
            partners.map((partner) => ({
              id: partner.id,
              name: partner.name.trim(),
              logo: partner.logo.trim(),
              website: partner.website.trim(),
              description: partner.description.trim(),
            })),
          ),
          imageUrl: partnersRecord?.imageUrl || "",
          seoTitle: partnersRecord?.seoTitle || "",
          seoDescription: partnersRecord?.seoDescription || "",
          seoKeywords: partnersRecord?.seoKeywords || "",
          isFeatured: partnersRecord?.isFeatured ?? false,
          sortOrder: partnersRecord?.sortOrder ?? 3,
        };
      } else {
        payload = {
          ...commonFields,
          title: title.trim(),
          key: "home_milestones",
          slug: milestoneRecord?.slug || "milestones-till-now",
          status,
          excerpt: quote.trim(),
          content: milestones
            .map(
              (item) => `${item.value.trim()} | ${item.label.trim()}`,
            )
            .join("\n"),
          imageUrl: milestoneRecord?.imageUrl || "",
          seoTitle: milestoneRecord?.seoTitle || "",
          seoDescription: milestoneRecord?.seoDescription || "",
          seoKeywords: milestoneRecord?.seoKeywords || "",
          isFeatured: milestoneRecord?.isFeatured ?? false,
          sortOrder: milestoneRecord?.sortOrder ?? 0,
        };
      }

      const response = await fetch(
        currentRecord ? `/api/content/${currentRecord.id}` : "/api/content",
        {
          method: currentRecord ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result: ApiResult<ContentRecord> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save changes.");
      }

      setMessage(
        currentStatus === "PUBLISHED"
          ? "Changes saved and published successfully."
          : "Changes saved as a draft. They are not visible publicly.",
      );

      await loadContent();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
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
        <LoaderCircle className="animate-spin text-[#7A1F3D]" size={27} />
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
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
          className={`${buttonClass} h-10 border border-slate-200 bg-white text-slate-700 hover:border-[#2457C5] hover:text-[#2457C5]`}
        >
          <Eye size={17} />
          View Website
          <ExternalLink size={14} />
        </Link>
      </header>

      {/* FEEDBACK */}

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

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Homepage Sections
          </p>
          <p className="mt-2 text-2xl font-bold text-[#172033]">
            {editorSections.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Available homepage content areas.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {currentItemLabel}
          </p>
          <p className="mt-2 text-2xl font-bold text-[#2457C5]">
            {currentItemCount}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {isPartners
              ? "Partner organizations configured."
              : isHero
                ? "Slides configured in the editor."
                : isAbout
                  ? "Entries in your organizational journey."
                  : isPrograms
                    ? `Selected out of a limit of ${programs.limit}.`
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

      {/* EDITOR LAYOUT */}

      <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
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
                    setActiveSection(section.id);
                    setError("");
                    setMessage("");
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    active
                      ? "bg-[#F7E9EE] text-[#7A1F3D]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {section.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 opacity-75">
                      Manage section
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

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

            {/* HERO EDITOR */}

            {isHero ? (
              <div className="space-y-5 p-5 sm:p-7">
                <div>
                  <label htmlFor="hero-title" className={labelClass}>
                    CMS record title
                  </label>
                  <input
                    id="hero-title"
                    value={heroTitle}
                    onChange={(event) => setHeroTitle(event.target.value)}
                    maxLength={120}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="hero-description" className={labelClass}>
                    Section description
                  </label>
                  <textarea
                    id="hero-description"
                    value={heroDescription}
                    onChange={(event) => setHeroDescription(event.target.value)}
                    rows={2}
                    maxLength={2000}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#172033]">Hero Slides</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Each slide needs a heading, highlighted text, and image URL.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addHeroSlide}
                    className={`${buttonClass} bg-[#2457C5] text-white hover:bg-blue-800`}
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
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#172033]">
                        Slide {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setHeroSlides((current) =>
                              moveItem(current, index, -1),
                            )
                          }
                          disabled={index === 0}
                          aria-label="Move slide up"
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setHeroSlides((current) =>
                              moveItem(current, index, 1),
                            )
                          }
                          disabled={index === heroSlides.length - 1}
                          aria-label="Move slide down"
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
                        >
                          <ArrowDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeHeroSlide(index)}
                          aria-label="Remove slide"
                          className="rounded-lg border border-red-100 bg-white p-2 text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor={`hero-title-${index}`} className={labelClass}>
                          Main heading
                        </label>
                        <input
                          id={`hero-title-${index}`}
                          value={slide.title}
                          onChange={(event) =>
                            updateHeroSlide(index, "title", event.target.value)
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
                      <label htmlFor={`hero-image-${index}`} className={labelClass}>
                        Background image URL
                      </label>
                      <input
                        id={`hero-image-${index}`}
                        type="url"
                        value={slide.image}
                        onChange={(event) =>
                          updateHeroSlide(index, "image", event.target.value)
                        }
                        className={inputClass}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {slide.image.trim() && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slide.image}
                          alt={`Hero slide ${index + 1}`}
                          className="h-40 w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : isAbout ? (
              /* ABOUT AND TIMELINE EDITOR */

              <div className="space-y-7 p-5 sm:p-7">
                <div>
                  <label htmlFor="about-label" className={labelClass}>
                    Section label
                  </label>
                  <input
                    id="about-label"
                    value={about.label}
                    onChange={(event) => updateAbout("label", event.target.value)}
                    maxLength={120}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="about-heading" className={labelClass}>
                    Main heading
                  </label>
                  <textarea
                    id="about-heading"
                    value={about.heading}
                    onChange={(event) => updateAbout("heading", event.target.value)}
                    rows={2}
                    maxLength={300}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="about-introduction" className={labelClass}>
                    Introduction paragraph
                  </label>
                  <textarea
                    id="about-introduction"
                    value={about.introduction}
                    onChange={(event) =>
                      updateAbout("introduction", event.target.value)
                    }
                    rows={4}
                    maxLength={5000}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="about-description" className={labelClass}>
                    Additional description
                  </label>
                  <textarea
                    id="about-description"
                    value={about.description}
                    onChange={(event) =>
                      updateAbout("description", event.target.value)
                    }
                    rows={4}
                    maxLength={5000}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="about-image" className={labelClass}>
                    About image URL (optional)
                  </label>
                  <input
                    id="about-image"
                    value={about.imageUrl}
                    onChange={(event) => updateAbout("imageUrl", event.target.value)}
                    className={inputClass}
                    placeholder="https://example.com/about.jpg"
                  />
                </div>

                {about.imageUrl.trim() && (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={about.imageUrl}
                      alt="About section preview"
                      className="max-h-80 w-full object-cover"
                    />
                  </div>
                )}

                <div className="border-t border-slate-100 pt-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-[#172033]">
                        Organizational History
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Add important events in your organization&apos;s history.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addTimelineItem}
                      className={`${buttonClass} bg-[#2457C5] text-white`}
                    >
                      <Plus size={16} />
                      Add Entry
                    </button>
                  </div>

                  {about.timeline.map((item, index) => (
                    <div
                      key={index}
                      className="mb-4 rounded-2xl border border-slate-200 bg-[#FCFAF7] p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-bold">
                          Timeline Entry {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTimelineItem(index)}
                          className="rounded-lg border border-red-100 bg-white p-2 text-red-600"
                          aria-label="Remove timeline entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor={`timeline-year-${index}`}
                            className={labelClass}
                          >
                            Year / date
                          </label>
                          <input
                            id={`timeline-year-${index}`}
                            value={item.year}
                            onChange={(event) =>
                              updateTimeline(index, "year", event.target.value)
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`timeline-title-${index}`}
                            className={labelClass}
                          >
                            Title
                          </label>
                          <input
                            id={`timeline-title-${index}`}
                            value={item.title}
                            onChange={(event) =>
                              updateTimeline(index, "title", event.target.value)
                            }
                            className={inputClass}
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
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : isPrograms ? (
              /* PROGRAMS AND PROJECTS EDITOR */

              <div className="space-y-6 p-5 sm:p-7">
                <div>
                  <label htmlFor="programs-title" className={labelClass}>
                    CMS record title
                  </label>
                  <input
                    id="programs-title"
                    value={programsTitle}
                    onChange={(event) => setProgramsTitle(event.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="programs-subheading" className={labelClass}>
                    Section subheading
                  </label>
                  <input
                    id="programs-subheading"
                    value={programsSubheading}
                    onChange={(event) =>
                      setProgramsSubheading(event.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="programs-mode" className={labelClass}>
                      Content to show
                    </label>
                    <select
                      id="programs-mode"
                      value={programs.displayMode}
                      onChange={(event) =>
                        setPrograms((current) => ({
                          ...current,
                          displayMode: event.target
                            .value as ProgramsProjectsContent["displayMode"],
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="both">Programs and projects</option>
                      <option value="programs">Programs only</option>
                      <option value="projects">Projects only</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="programs-limit" className={labelClass}>
                      Maximum items
                    </label>
                    <input
                      id="programs-limit"
                      type="number"
                      min={1}
                      max={12}
                      value={programs.limit}
                      onChange={(event) => {
                        const limit = Math.max(
                          1,
                          Math.min(12, Number(event.target.value) || 1),
                        );
                        setPrograms((current) => ({
                          ...current,
                          limit,
                          featuredIds: current.featuredIds.slice(0, limit),
                        }));
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#172033]">Featured Items</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Select up to {programs.limit} published records.
                  </p>

                  <div className="mt-3 max-h-80 space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-[#FCFAF7] p-2">
                    {[
                      ...(programs.displayMode !== "projects"
                        ? programOptions
                        : []),
                      ...(programs.displayMode !== "programs"
                        ? projectOptions
                        : []),
                    ].map((option) => {
                      const checked = programs.featuredIds.includes(option.id);
                      const disabled =
                        !checked &&
                        programs.featuredIds.length >= programs.limit;

                      return (
                        <label
                          key={option.id}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                            checked ? "bg-white ring-1 ring-[#2457C5]" : ""
                          } ${disabled ? "opacity-50" : "cursor-pointer hover:bg-white"}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => toggleProgramsFeatured(option.id)}
                            className="h-4 w-4"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold">
                              {option.title}
                            </span>
                            <span className="block truncate text-xs text-slate-500">
                              {option.key}
                            </span>
                          </span>
                        </label>
                      );
                    })}

                    {programOptions.length === 0 &&
                      projectOptions.length === 0 && (
                        <p className="p-6 text-center text-sm text-slate-500">
                          No published programs or projects found.
                        </p>
                      )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="programs-layout" className={labelClass}>
                      Layout
                    </label>
                    <select
                      id="programs-layout"
                      value={programs.layout}
                      onChange={(event) =>
                        setPrograms((current) => ({
                          ...current,
                          layout: event.target
                            .value as ProgramsProjectsContent["layout"],
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="grid">Grid</option>
                      <option value="carousel">Carousel</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="programs-columns" className={labelClass}>
                      Columns
                    </label>
                    <select
                      id="programs-columns"
                      value={String(programs.columns)}
                      onChange={(event) =>
                        setPrograms((current) => ({
                          ...current,
                          columns: Number(event.target.value) as 2 | 3 | 4,
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="2">2 columns</option>
                      <option value="3">3 columns</option>
                      <option value="4">4 columns</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold">
                    Show images
                    <input
                      type="checkbox"
                      checked={programs.showImages}
                      onChange={(event) =>
                        setPrograms((current) => ({
                          ...current,
                          showImages: event.target.checked,
                        }))
                      }
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold">
                    Show progress
                    <input
                      type="checkbox"
                      checked={programs.showProgress}
                      onChange={(event) =>
                        setPrograms((current) => ({
                          ...current,
                          showProgress: event.target.checked,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="programs-cta-label" className={labelClass}>
                      CTA label
                    </label>
                    <input
                      id="programs-cta-label"
                      value={programs.ctaLabel}
                      onChange={(event) =>
                        setPrograms((current) => ({
                          ...current,
                          ctaLabel: event.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="programs-cta-href" className={labelClass}>
                      CTA link
                    </label>
                    <input
                      id="programs-cta-href"
                      value={programs.ctaHref}
                      onChange={(event) =>
                        setPrograms((current) => ({
                          ...current,
                          ctaHref: event.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ) : isPartners ? (
              /* PARTNERS AND COLLABORATORS EDITOR */

              <div className="space-y-6 p-5 sm:p-7">
                <div>
                  <label htmlFor="partners-title" className={labelClass}>
                    Section title
                  </label>
                  <input
                    id="partners-title"
                    value={partnersTitle}
                    onChange={(event) => setPartnersTitle(event.target.value)}
                    maxLength={120}
                    className={inputClass}
                    placeholder="Partners & Collaborators"
                  />
                </div>

                <div>
                  <label
                    htmlFor="partners-description"
                    className={labelClass}
                  >
                    Section introduction
                  </label>
                  <textarea
                    id="partners-description"
                    value={partnersDescription}
                    onChange={(event) =>
                      setPartnersDescription(event.target.value)
                    }
                    rows={3}
                    maxLength={1000}
                    className={inputClass}
                    placeholder="Organizations working with us..."
                  />
                </div>

                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-bold text-[#172033]">
                      Partner Organizations
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Add logos, organization names, descriptions, and websites.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addPartner}
                    className={`${buttonClass} bg-[#2457C5] text-white hover:bg-blue-800`}
                  >
                    <Plus size={17} />
                    Add Partner
                  </button>
                </div>

                {partners.map((partner, index) => (
                  <div
                    key={partner.id}
                    className="rounded-2xl border border-slate-200 bg-[#FCFAF7] p-4 sm:p-5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-[#172033]">
                        Partner {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setPartners((current) =>
                              moveItem(current, index, -1),
                            )
                          }
                          disabled={index === 0}
                          aria-label={`Move partner ${index + 1} up`}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
                        >
                          <ArrowUp size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setPartners((current) =>
                              moveItem(current, index, 1),
                            )
                          }
                          disabled={index === partners.length - 1}
                          aria-label={`Move partner ${index + 1} down`}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
                        >
                          <ArrowDown size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => removePartner(partner.id)}
                          aria-label={`Remove partner ${index + 1}`}
                          className="rounded-lg border border-red-100 bg-white p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`partner-name-${partner.id}`}
                          className={labelClass}
                        >
                          Organization name *
                        </label>
                        <input
                          id={`partner-name-${partner.id}`}
                          value={partner.name}
                          onChange={(event) =>
                            updatePartner(partner.id, "name", event.target.value)
                          }
                          maxLength={160}
                          className={inputClass}
                          placeholder="Organization name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`partner-website-${partner.id}`}
                          className={labelClass}
                        >
                          Website URL (optional)
                        </label>
                        <input
                          id={`partner-website-${partner.id}`}
                          type="url"
                          value={partner.website}
                          onChange={(event) =>
                            updatePartner(
                              partner.id,
                              "website",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                          placeholder="https://example.org"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor={`partner-description-${partner.id}`}
                        className={labelClass}
                      >
                        Short description (optional)
                      </label>
                      <textarea
                        id={`partner-description-${partner.id}`}
                        value={partner.description}
                        onChange={(event) =>
                          updatePartner(
                            partner.id,
                            "description",
                            event.target.value,
                          )
                        }
                        rows={2}
                        maxLength={500}
                        className={inputClass}
                        placeholder="Describe the collaboration..."
                      />
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor={`partner-logo-${partner.id}`}
                        className={labelClass}
                      >
                        Upload logo *
                      </label>

                      <input
                        id={`partner-logo-${partner.id}`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        disabled={uploadingPartnerId === partner.id}
                        onChange={(event) => {
                          const file = event.target.files?.[0];

                          if (file) {
                            void uploadPartnerLogo(partner.id, file);
                          }

                          event.currentTarget.value = "";
                        }}
                        className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#F7E9EE] file:px-3 file:py-2 file:font-semibold file:text-[#7A1F3D]"
                      />

                      <p className="mt-1.5 text-xs text-slate-400">
                        JPG, PNG, WebP, GIF or SVG. Maximum 10 MB.
                      </p>

                      {uploadingPartnerId === partner.id && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-[#2457C5]">
                          <LoaderCircle size={15} className="animate-spin" />
                          Uploading logo...
                        </p>
                      )}

                      {partner.logo && (
                        <div className="mt-3 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={partner.logo}
                            alt={`${partner.name || "Partner"} logo preview`}
                            className="h-20 w-32 object-contain"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[#172033]">
                              {partner.name || "Unnamed organization"}
                            </p>
                            <p className="mt-1 break-all text-xs text-slate-400">
                              {partner.logo}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                updatePartner(partner.id, "logo", "")
                              }
                              className="mt-2 text-xs font-semibold text-red-600 hover:underline"
                            >
                              Remove logo
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {partners.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                    <Users
                      size={30}
                      className="mx-auto text-slate-400"
                    />
                    <p className="mt-3 font-semibold text-[#172033]">
                      No partners added yet
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Add an organization to display its logo on your homepage.
                    </p>
                    <button
                      type="button"
                      onClick={addPartner}
                      className={`${buttonClass} mt-4 bg-[#2457C5] text-white`}
                    >
                      <Plus size={16} />
                      Add Your First Partner
                    </button>
                  </div>
                )}

                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                  <h3 className="text-sm font-bold text-[#172033]">
                    How this works
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Partner information is stored in the existing{" "}
                    <code className="rounded bg-white px-1.5 py-0.5">
                      home_partners
                    </code>{" "}
                    content record. Logos use your existing media upload API.
                    Save as a draft while preparing your content, or publish it
                    when you are ready.
                  </p>
                </div>
              </div>
            ) : (
              /* MILESTONES EDITOR */

              <div className="space-y-5 p-5 sm:p-7">
                <div>
                  <label htmlFor="milestone-title" className={labelClass}>
                    Section title
                  </label>
                  <input
                    id="milestone-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={120}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="milestone-quote" className={labelClass}>
                    Introduction / quotation
                  </label>
                  <textarea
                    id="milestone-quote"
                    value={quote}
                    onChange={(event) => setQuote(event.target.value)}
                    rows={4}
                    maxLength={2000}
                    className={inputClass}
                  />
                </div>

                <div>
                  <h3 className="font-bold text-[#172033]">
                    Milestone Statistics
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Update the statistics displayed on your homepage.
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
                          Milestone {String(index + 1).padStart(2, "0")}
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
                          updateMilestone(index, "value", event.target.value)
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
                          updateMilestone(index, "label", event.target.value)
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
                    Draft records are not publicly visible. Publish when your
                    content is ready.
                  </p>
                </div>
              </div>

              <div className="sm:min-w-52">
                <label htmlFor="content-status" className={labelClass}>
                  Content status
                </label>
                <select
                  id="content-status"
                  value={currentStatus}
                  onChange={(event) => {
                    const next = event.target.value as PublicationStatus;

                    if (isHero) setHeroStatus(next);
                    else if (isAbout) setAboutStatus(next);
                    else if (isPrograms) setProgramsStatus(next);
                    else if (isPartners) setPartnersStatus(next);
                    else setStatus(next);
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
                ? `Editing the existing ${currentSection?.title.toLowerCase()} record.`
                : `A new ${currentSection?.title.toLowerCase()} record will be created when saved.`}
            </p>

            <button
              type="button"
              onClick={() => void saveContent()}
              disabled={saving || uploadingPartnerId !== null}
              className={`${buttonClass} h-11 bg-[#7A1F3D] px-6 text-white shadow-sm hover:bg-[#641832]`}
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
