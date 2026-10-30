
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  MapPin,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ProjectRecord = {
  id: string;
  title: string;
  slug: string | null;
  key: string;
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  updatedAt: Date;
};

function getProjectSlug(project: ProjectRecord) {
  return project.slug?.trim() || project.key.replace(/^project[_-]?/i, "");
}

function getProjectStatus(project: ProjectRecord) {
  const content = `${project.excerpt ?? ""} ${project.content ?? ""}`;

  if (/\bcompleted\b/i.test(content)) return "Completed";
  if (/\bplanned\b/i.test(content)) return "Planned";

  return "Project";
}

function getProjectDescription(project: ProjectRecord) {
  const text = project.excerpt?.trim() || project.content?.trim();

  if (!text) {
    return "Learn more about this initiative and Lifeline Achham's work with communities.";
  }

  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function ProjectImage({
  src,
  title,
}: {
  src: string | null;
  title: string;
}) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#55152B] to-[#2457C5]">
        <FolderKanban className="h-14 w-14 text-white/70" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={title}
      fill
      unoptimized
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover transition duration-700 group-hover:scale-105"
    />
  );
}

export default async function ProjectsPage() {
  let projects: ProjectRecord[] = [];
  let loadFailed = false;

  try {
    projects = await prisma.contentItem.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { key: { startsWith: "project_" } },
          { key: { startsWith: "project-" } },
        ],
      },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        key: true,
        excerpt: true,
        content: true,
        imageUrl: true,
        isFeatured: true,
        sortOrder: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Unable to load public projects:", error);
    loadFailed = true;
  }

  const featuredProject = projects.find((project) => project.isFeatured);
  const featuredSlug = featuredProject
    ? getProjectSlug(featuredProject)
    : "";

  return (
    <main className="overflow-hidden bg-[#FCFAF7]">
      <section className="relative overflow-hidden bg-[#55152B] pt-[112px]">
        <div className="relative flex min-h-[390px] items-center py-16 sm:min-h-[450px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#55152B] via-[#55152B] to-[#2457C5]/60" />
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[45px] border-white/[0.04]" />

          <div className="container-main relative z-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E9B6C7]">
                Our Work
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Projects
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/75 sm:text-base lg:text-lg">
              Discover the initiatives, activities, and community-focused work
              published by Lifeline Achham.
            </p>

            <nav
              aria-label="Breadcrumb"
              className="mt-7 flex items-center gap-3 text-xs"
            >
              <Link href="/" className="text-white/60 hover:text-white">
                Home
              </Link>
              <span className="text-white/30">/</span>
              <Link href="/work" className="text-white/60 hover:text-white">
                Our Work
              </Link>
              <span className="text-white/30">/</span>
              <span className="text-white/90">Projects</span>
            </nav>
          </div>
        </div>
      </section>

      {featuredProject && (
        <section className="section">
          <div className="container-main">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Featured Project
              </span>
            </div>

            <article className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
              <div className="group relative min-h-[280px] overflow-hidden sm:min-h-[400px]">
                <ProjectImage
                  src={featuredProject.imageUrl}
                  title={featuredProject.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/50 to-transparent" />
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <span className="w-fit rounded-full bg-[#F7E9EE] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7A1F3D]">
                  Featured
                </span>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                  {featuredProject.title}
                </h2>

                <p className="mt-4 line-clamp-5 text-sm leading-8 text-slate-500">
                  {getProjectDescription(featuredProject)}
                </p>

                <Link
                  href={`/work/projects/${featuredSlug}`}
                  className="group/link mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17439F]"
                >
                  Explore project
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover/link:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2457C5]">
                Project Directory
              </span>
              <span className="h-2 w-2 rounded-full bg-[#2457C5]" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Our work in
              <span className="text-[#2457C5]"> action.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Browse projects published by our team. Each project page provides
              further information where available.
            </p>
          </div>

          {loadFailed ? (
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-7 text-center">
              <h3 className="font-bold text-[#172033]">
                Projects are temporarily unavailable
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Please try again later.
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-slate-200 bg-[#FCFAF7] px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#2457C5]">
                <FolderKanban size={25} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#172033]">
                Projects are coming soon
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                Our team is preparing project information. Please check back
                for updates from Lifeline Achham.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-7 md:grid-cols-2">
              {projects.map((project, index) => {
                const slug = getProjectSlug(project);
                const status = getProjectStatus(project);

                return (
                  <article
                    key={project.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#FCFAF7] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-[260px] overflow-hidden">
                      <ProjectImage src={project.imageUrl} title={project.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/70 via-transparent to-transparent" />

                      <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#7A1F3D]">
                          Project
                        </span>
                        {project.isFeatured && (
                          <span className="rounded-full bg-[#2457C5] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white">
                            Featured
                          </span>
                        )}
                      </div>

                      <span className="absolute bottom-5 right-5 text-xs font-bold tracking-[0.18em] text-white/80">
                        PROJECT {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="p-6 sm:p-7">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#7A1F3D]">
                        <CheckCircle2 size={14} />
                        {status}
                      </div>

                      <h3 className="mt-3 text-xl font-bold text-[#172033]">
                        {project.title}
                      </h3>

                      <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-500">
                        {getProjectDescription(project)}
                      </p>

                      <div className="mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
                        <CalendarDays size={14} className="text-[#2457C5]" />
                        <span>
                          Updated{" "}
                          {new Intl.DateTimeFormat("en", {
                            month: "short",
                            year: "numeric",
                          }).format(project.updatedAt)}
                        </span>
                      </div>

                      <Link
                        href={`/work/projects/${slug}`}
                        className="group/link mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5] hover:text-[#17439F]"
                      >
                        View project
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover/link:translate-x-1"
                        />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container-main">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#55152B] px-7 py-14 text-center sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.045]" />
            <div className="pointer-events-none absolute -bottom-24 left-1/4 h-52 w-52 rounded-full bg-[#2457C5]/20 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <div className="mb-5 flex items-center justify-center gap-2">
                <Users size={16} className="text-[#E9B6C7]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
                  Get Involved
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Have an idea worth turning into action?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                Connect with Lifeline Achham to discuss collaboration,
                participation, or opportunities to support community initiatives.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#17439F]"
                >
                  Contact Us <ArrowUpRight size={17} />
                </Link>

                <Link
                  href="/work/campaigns"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Campaigns <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
