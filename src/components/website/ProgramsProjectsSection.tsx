import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProgramCard } from "./ProgramCard";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

/* =========================================================
   TYPES
========================================================= */

type ProgramsProjectsConfig = {
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

const DEFAULT_CONFIG: ProgramsProjectsConfig = {
  displayMode: "both",
  featuredIds: [],
  limit: 6,
  layout: "grid",
  columns: 3,
  showImages: true,
  showProgress: true,
  ctaLabel: "",
  ctaHref: "",
};

/* =========================================================
   PARSER
========================================================= */

function parseConfig(content: string | null): ProgramsProjectsConfig {
  if (!content?.trim()) return { ...DEFAULT_CONFIG };

  try {
    const parsed: unknown = JSON.parse(content);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...DEFAULT_CONFIG };
    }
    const p = parsed as Partial<ProgramsProjectsConfig>;

    return {
      displayMode:
        p.displayMode === "programs" ||
        p.displayMode === "projects" ||
        p.displayMode === "both"
          ? p.displayMode
          : DEFAULT_CONFIG.displayMode,
      featuredIds: Array.isArray(p.featuredIds)
        ? p.featuredIds.filter((v): v is string => typeof v === "string")
        : [],
      limit:
        typeof p.limit === "number" && p.limit >= 1 && p.limit <= 12
          ? Math.floor(p.limit)
          : DEFAULT_CONFIG.limit,
      layout: p.layout === "carousel" ? "carousel" : "grid",
      columns:
        p.columns === 2 || p.columns === 3 || p.columns === 4
          ? p.columns
          : DEFAULT_CONFIG.columns,
      showImages:
        typeof p.showImages === "boolean" ? p.showImages : DEFAULT_CONFIG.showImages,
      showProgress:
        typeof p.showProgress === "boolean"
          ? p.showProgress
          : DEFAULT_CONFIG.showProgress,
      ctaLabel: typeof p.ctaLabel === "string" ? p.ctaLabel : "",
      ctaHref: typeof p.ctaHref === "string" ? p.ctaHref : "",
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/* =========================================================
   SECTION
========================================================= */

export async function ProgramsProjectsSection() {
  /* ---------------------------------------------------------
     1. Load the homepage section record
  --------------------------------------------------------- */

  const record = await prisma.contentItem.findFirst({
    where: {
      key: "home_programs_projects",
      status: "PUBLISHED",
      isHomepage: true,
    },
  });

  if (!record) return null;

  const cfg = parseConfig(record.content);
  if (cfg.featuredIds.length === 0) return null;

  /* ---------------------------------------------------------
     2. Load the featured program/project records in a single
        query, then reorder to match the editor's selection order
  --------------------------------------------------------- */

  const rows = await prisma.contentItem.findMany({
    where: {
      id: { in: cfg.featuredIds },
      status: "PUBLISHED",
    },
    select: {
      id: true,
      key: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      imageUrl: true,
    },
  });

  const byId = new Map(rows.map((r) => [r.id, r]));

  const ordered = cfg.featuredIds
    .map((id) => byId.get(id))
    .filter((r): r is NonNullable<typeof r> => !!r)
    .slice(0, cfg.limit);

  if (ordered.length === 0) return null;

  /* ---------------------------------------------------------
     3. Grid layout classes
  --------------------------------------------------------- */

  const gridClasses =
    cfg.columns === 2
      ? "grid grid-cols-1 gap-6 md:grid-cols-2"
      : cfg.columns === 4
        ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3";

  /* ---------------------------------------------------------
     4. Render
  --------------------------------------------------------- */

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={record.title}
          subtitle={record.excerpt ?? ""}
          align="center"
        />

        {cfg.layout === "carousel" ? (
          <div className="mt-10 -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {ordered.map((item) => (
              <div
                key={item.id}
                className="w-[85%] shrink-0 snap-start sm:w-[60%] md:w-[45%] lg:w-[32%]"
              >
                <FeaturedCard item={item} cfg={cfg} />
              </div>
            ))}
          </div>
        ) : (
          <div className={`mt-10 ${gridClasses}`}>
            {ordered.map((item) => (
              <FeaturedCard key={item.id} item={item} cfg={cfg} />
            ))}
          </div>
        )}

        {cfg.ctaHref && (
          <div className="mt-12 text-center">
            <Link
              href={cfg.ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#7A1F3D] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#641832]"
            >
              {cfg.ctaLabel || "See more"}
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   ITEM ROUTER — program or project?
========================================================= */

type Item = {
  id: string;
  key: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
};

function FeaturedCard({
  item,
  cfg,
}: {
  item: Item;
  cfg: ProgramsProjectsConfig;
}) {
  const isProgram = item.key.startsWith("program_");

  return isProgram ? (
    <ProgramCard
      program={item as any}
      showImage={cfg.showImages}
    />
  ) : (
    <ProjectCard
      project={item as any}
      showImage={cfg.showImages}
      showProgress={cfg.showProgress}
    />
  );
}