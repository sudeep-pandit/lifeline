
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderKanban,
  MapPin,
  Target,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getProject(slug: string) {
  const project = await prisma.contentItem.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      OR: [
        { key: { startsWith: "project_" } },
        { key: { startsWith: "project-" } },
      ],
    },
    select: {
      id: true,
      title: true,
      slug: true,
      key: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      seoTitle: true,
      seoDescription: true,
      updatedAt: true,
    },
  });

  return project;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found | Lifeline Achham" };
  }

  return {
    title: project.seoTitle || `${project.title} | Lifeline Achham`,
    description:
      project.seoDescription ||
      project.excerpt ||
      `Learn more about ${project.title} and the work of Lifeline Achham.`,
    openGraph: {
      title: project.seoTitle || project.title,
      description:
        project.seoDescription || project.excerpt || project.title,
      images: project.imageUrl ? [project.imageUrl] : [],
    },
  };
}

function cleanContent(value: string | null) {
  return (value || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const description = cleanContent(project.content);
  const summary =
    project.excerpt?.trim() ||
    description ||
    `Learn more about ${project.title} and the work of Lifeline Achham.`;

  return (
    <main className="overflow-hidden bg-[#FCFAF7]">
      <section className="relative overflow-hidden bg-[#55152B] pt-[112px]">
        <div className="relative min-h-[440px]">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#55152B] to-[#2457C5]" />
          )}

          <div className="absolute inset-0 bg-[#55152B]/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#55152B]/70 to-[#55152B]/20" />

          <div className="container-main relative z-10 flex min-h-[440px] items-center py-16 sm:py-20">
            <div className="max-w-4xl">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  Project
                </span>
                <span className="rounded-full bg-[#2457C5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  Published
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>

              <p className="mt-6 max-w-3xl text-sm leading-8 text-white/75 sm:text-base lg:text-lg">
                {summary}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/70">
                <span className="flex items-center gap-2">
                  <FolderKanban size={15} /> Lifeline Achham Project
                </span>
                <span className="flex items-center gap-2">
                  <CalendarDays size={15} />
                  Updated{" "}
                  {new Intl.DateTimeFormat("en", {
                    month: "long",
                    year: "numeric",
                  }).format(project.updatedAt)}
                </span>
              </div>

              <nav
                aria-label="Breadcrumb"
                className="mt-8 flex flex-wrap items-center gap-3 text-xs"
              >
                <Link href="/" className="text-white/60 hover:text-white">
                  Home
                </Link>
                <span className="text-white/30">/</span>
                <Link
                  href="/work/projects"
                  className="text-white/60 hover:text-white"
                >
                  Projects
                </Link>
                <span className="text-white/30">/</span>
                <span className="max-w-[240px] truncate text-white/90">
                  {project.title}
                </span>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="container-main grid gap-0 sm:grid-cols-3">
          <ProjectMeta
            icon={FolderKanban}
            label="Content type"
            value="Project"
          />
          <ProjectMeta
            icon={CheckCircle2}
            label="Publication"
            value="Published"
          />
          <ProjectMeta
            icon={CalendarDays}
            label="Last updated"
            value={new Intl.DateTimeFormat("en", {
              month: "short",
              year: "numeric",
            }).format(project.updatedAt)}
          />
        </div>
      </section>

      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr] lg:gap-20">
            <article>
              <SectionLabel label="Project Overview" />

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                About this
                <span className="text-[#7A1F3D]"> project.</span>
              </h2>

              {description ? (
                <div className="mt-6 whitespace-pre-line text-sm leading-8 text-slate-600 sm:text-base">
                  {description}
                </div>
              ) : (
                <p className="mt-6 text-sm leading-8 text-slate-500 sm:text-base">
                  More information about this project will be published as
                  details become available.
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/work/projects"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-[#2457C5]/30 hover:bg-[#EEF4FF] hover:text-[#2457C5]"
                >
                  <ArrowLeft size={16} /> All Projects
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17439F]"
                >
                  Ask About This Project <ArrowUpRight size={16} />
                </Link>
              </div>
            </article>

            <aside className="h-fit rounded-3xl bg-[#F7E9EE] p-7 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7A1F3D] text-white">
                <Target size={21} />
              </div>

              <h2 className="mt-6 text-xl font-bold text-[#172033]">
                Project information
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                This project information is maintained by Lifeline Achham.
                Published updates will appear here as the project develops.
              </p>

              <div className="mt-6 border-t border-[#7A1F3D]/10 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7A1F3D]">
                  Last updated
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {new Intl.DateTimeFormat("en", {
                    dateStyle: "long",
                  }).format(project.updatedAt)}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
              <FileText size={22} />
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
              Interested in this project?
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Contact Lifeline Achham to ask questions, explore collaboration,
              or learn about opportunities to support our work.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#17439F]"
              >
                Contact Us <ArrowUpRight size={16} />
              </Link>

              <Link
                href="/work/projects"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-[#FCFAF7]"
              >
                Browse More Projects <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-1 w-8 rounded-full bg-[#7A1F3D]" />
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
        {label}
      </span>
    </div>
  );
}

function ProjectMeta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-200 px-5 py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:px-7 sm:last:border-r-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-[#172033]">
          {value}
        </p>
      </div>
    </div>
  );
}
