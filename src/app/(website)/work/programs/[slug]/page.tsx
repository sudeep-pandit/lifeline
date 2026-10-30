
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  HeartHandshake,
  Target,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getProgram(slug: string) {
  return prisma.contentItem.findFirst({
    where: {
      slug,
      key: { startsWith: "program_" },
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      isFeatured: true,
      sortOrder: true,
    },
  });
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const program = await getProgram(slug);

  if (!program) {
    return { title: "Program Not Found | Lifeline Achham" };
  }

  return {
    title: `${program.title} | Lifeline Achham`,
    description:
      program.excerpt?.trim() ||
      `Learn about ${program.title} and the work of Lifeline Achham.`,
  };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = await getProgram(slug);

  if (!program) {
    notFound();
  }

  const description =
    program.excerpt?.trim() ||
    `Learn more about ${program.title} and the work of Lifeline Achham.`;

  const body = program.content?.trim();

  return (
    <main className="min-h-screen overflow-hidden bg-[#FCFAF7] text-[#172033]">
      {/* Program hero */}
      <section className="relative isolate overflow-hidden bg-[#55152B]">
        {program.imageUrl ? (
          <Image
            src={program.imageUrl}
            alt={program.title}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#55152B] via-[#7A1F3D] to-[#172033]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#310B1B]/95 via-[#55152B]/80 to-[#55152B]/45" />

        <div className="relative mx-auto flex min-h-[440px] max-w-7xl items-center px-5 py-24 sm:px-8 lg:min-h-[520px] lg:px-12">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              <HeartHandshake size={15} />
              {program.isFeatured ? "Featured program" : "Our programs"}
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {program.title}
            </h1>

            <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-8 text-white/80 sm:text-lg">
              {description}
            </p>

            <nav
              aria-label="Breadcrumb"
              className="mt-8 flex flex-wrap items-center gap-2 text-sm text-white/65"
            >
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <span>/</span>
              <Link href="/work" className="transition hover:text-white">
                Our Work
              </Link>
              <span>/</span>
              <Link
                href="/work/programs"
                className="transition hover:text-white"
              >
                Programs
              </Link>
              <span>/</span>
              <span className="text-white">{program.title}</span>
            </nav>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#7A1F3D] via-[#F4B7C9] to-[#2457C5]" />
      </section>

      {/* Program information */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.65fr] lg:gap-20">
          <article>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-1 w-10 rounded-full bg-[#7A1F3D]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
                Program Overview
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Turning community priorities into meaningful action.
            </h2>

            <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">
              {body || description}
            </p>

            <div className="mt-8 rounded-2xl border border-[#7A1F3D]/10 bg-white p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7A1F3D]/10 text-[#7A1F3D]">
                  <Target size={21} />
                </div>
                <div>
                  <h3 className="font-bold">Community-centred approach</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Lifeline Achham works toward inclusive participation,
                    collaboration, and practical initiatives shaped by
                    community needs.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7A1F3D]/10 text-[#7A1F3D]">
              <CheckCircle2 size={23} />
            </div>

            <h2 className="mt-5 text-xl font-bold">Program at a glance</h2>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Program name
              </p>
              <p className="mt-2 font-semibold">{program.title}</p>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Publication
              </p>
              <p className="mt-2 font-semibold text-[#7A1F3D]">
                Published
              </p>
            </div>

            <Link
              href="/contact"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#55152B]"
            >
              Ask About This Program
              <ArrowUpRight size={17} />
            </Link>
          </aside>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-y border-slate-200 bg-white px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Interested in this area of work?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Contact Lifeline Achham to learn more, discuss collaboration,
              or explore how you can contribute.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#17439F]"
          >
            Contact Us
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <div className="bg-[#FCFAF7] px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/work/programs"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#7A1F3D]"
          >
            <ArrowLeft size={16} />
            Back to all programs
          </Link>
        </div>
      </div>
    </main>
  );
}
