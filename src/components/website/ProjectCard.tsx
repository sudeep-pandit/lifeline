
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Project = {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  coverImage?: string | null;
  featuredImage?: string | null;
  progress?: number | null;
  [key: string]: unknown;
};

type ProjectCardProps = {
  project: Project;
  showImage?: boolean;
  showProgress?: boolean;
};

export function ProjectCard({
  project,
  showImage = true,
  showProgress = false,
}: ProjectCardProps) {
  const image =
    project.imageUrl ??
    project.coverImage ??
    project.featuredImage;

  const href = project.slug
    ? `/work/projects/${project.slug}`
    : "/work/projects";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {showImage && (
        image ? (
          <div className="aspect-[16/9] overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={project.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center bg-[#FCFAF7]">
            <span className="text-sm font-semibold text-[#7A1F3D]">
              Lifeline Achham
            </span>
          </div>
        )
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900">
          {project.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {project.excerpt ?? project.description ?? ""}
        </p>

        {showProgress &&
          typeof project.progress === "number" && (
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-xs text-slate-500">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#7A1F3D]"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, project.progress),
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2457C5] hover:gap-3"
        >
          View project <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
