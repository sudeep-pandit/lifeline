
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Program = {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  coverImage?: string | null;
  featuredImage?: string | null;
  [key: string]: unknown;
};

type ProgramCardProps = {
  program: Program;
  showImage?: boolean;
};

export function ProgramCard({
  program,
  showImage = true,
}: ProgramCardProps) {
  const image =
    program.imageUrl ??
    program.coverImage ??
    program.featuredImage;

  const href = program.slug
    ? `/work/programs/${program.slug}`
    : "/work/programs";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {showImage && (
        image ? (
          <div className="aspect-[16/9] overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={program.title}
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
          {program.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {program.excerpt ?? program.description ?? ""}
        </p>

        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7A1F3D] hover:gap-3"
        >
          Learn more <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
