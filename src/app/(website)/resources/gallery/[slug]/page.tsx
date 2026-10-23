"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Images,
  Link as LinkIcon,
  Share2,
  X,
} from "lucide-react";

type GalleryImage = {
  id: string;
  title: string;
  image: string;
};

type GalleryAlbum = {
  slug: string;
  title: string;
  year: string;
  category: string;
  description: string;
  cover: string;
  images: GalleryImage[];
};

const albums: Record<string, GalleryAlbum> = {
  "community-events": {
    slug: "community-events",
    title: "Community Events",
    year: "2026",
    category: "Events",
    description:
      "Moments from community gatherings, discussions and activities.",
    cover:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=2200&q=90",
    images: [
      {
        id: "01",
        title: "Community gathering",
        image:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "02",
        title: "Community discussion",
        image:
          "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "03",
        title: "Community collaboration",
        image:
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "04",
        title: "Community participation",
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "05",
        title: "Community activity",
        image:
          "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "06",
        title: "Community engagement",
        image:
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1800&q=90",
      },
    ],
  },

  "health-awareness": {
    slug: "health-awareness",
    title: "Health Awareness",
    year: "2026",
    category: "Campaigns",
    description:
      "Community-focused health awareness activities and outreach moments.",
    cover:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=2200&q=90",
    images: [
      {
        id: "01",
        title: "Health awareness activity",
        image:
          "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "02",
        title: "Community health discussion",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "03",
        title: "Health information session",
        image:
          "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "04",
        title: "Community outreach",
        image:
          "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "05",
        title: "Awareness activity",
        image:
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "06",
        title: "Community wellbeing",
        image:
          "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1800&q=90",
      },
    ],
  },

  "youth-participation": {
    slug: "youth-participation",
    title: "Youth Participation",
    year: "2026",
    category: "Programs",
    description:
      "Young people participating in learning, engagement and community activities.",
    cover:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2200&q=90",
    images: [
      {
        id: "01",
        title: "Youth participation",
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "02",
        title: "Youth learning activity",
        image:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "03",
        title: "Young people collaborating",
        image:
          "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "04",
        title: "Youth community activity",
        image:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "05",
        title: "Learning together",
        image:
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "06",
        title: "Youth engagement",
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=90",
      },
    ],
  },

  "community-engagement": {
    slug: "community-engagement",
    title: "Community Engagement",
    year: "2026",
    category: "Community",
    description:
      "Community conversations, collaboration and local engagement activities.",
    cover:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=2200&q=90",
    images: [
      {
        id: "01",
        title: "Community conversation",
        image:
          "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "02",
        title: "Community meeting",
        image:
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "03",
        title: "Local collaboration",
        image:
          "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "04",
        title: "Community participation",
        image:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "05",
        title: "Community teamwork",
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "06",
        title: "Community activity",
        image:
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1800&q=90",
      },
    ],
  },

  "volunteer-activities": {
    slug: "volunteer-activities",
    title: "Volunteer Activities",
    year: "2025",
    category: "Community",
    description:
      "Moments highlighting volunteer participation and community contribution.",
    cover:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=2200&q=90",
    images: [
      {
        id: "01",
        title: "Volunteer activity",
        image:
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "02",
        title: "Volunteer participation",
        image:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "03",
        title: "Community volunteering",
        image:
          "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "04",
        title: "Working together",
        image:
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "05",
        title: "Community contribution",
        image:
          "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "06",
        title: "Volunteer engagement",
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=90",
      },
    ],
  },

  "community-campaigns": {
    slug: "community-campaigns",
    title: "Community Campaigns",
    year: "2025",
    category: "Campaigns",
    description:
      "Awareness campaigns, outreach activities and public engagement.",
    cover:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2200&q=90",
    images: [
      {
        id: "01",
        title: "Community campaign",
        image:
          "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "02",
        title: "Public awareness",
        image:
          "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "03",
        title: "Community outreach",
        image:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "04",
        title: "Campaign activity",
        image:
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "05",
        title: "Community action",
        image:
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=90",
      },
      {
        id: "06",
        title: "Campaign participation",
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=90",
      },
    ],
  },
};

function getAlbum(slug: string) {
  return albums[slug];
}

export default function GalleryAlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    params.then((value) => {
      setSlug(value.slug);
    });
  }, [params]);

  useEffect(() => {
    if (selectedIndex === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null
            ? 0
            : (current + 1) % (album?.images.length ?? 1),
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null
            ? 0
            : (current - 1 + (album?.images.length ?? 1)) %
              (album?.images.length ?? 1),
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  const album = slug ? getAlbum(slug) : undefined;

  if (!album) {
    return (
      <main className="min-h-[70vh] bg-[#FCFAF7]">
        <section className="section">
          <div className="container-main text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7E9EE] text-[#7A1F3D]">
              <Images size={28} />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-[#172033] sm:text-4xl">
              Gallery album not found
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
              The gallery album you are looking for could not be found.
            </p>

            <Link
              href="/resources/gallery"
              className="btn-primary mt-7"
            >
              <ArrowLeft size={16} />
              Back to Gallery
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const selectedImage =
    selectedIndex !== null
      ? album.images[selectedIndex]
      : null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: album.title,
          text: album.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled native share.
      }

      return;
    }

    await handleCopyLink();
  };

  const handleDownload = async (
    imageUrl: string,
    title: string,
  ) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = `${album.slug}-${title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}.jpg`;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <main className="bg-[#FCFAF7]">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden">
        <div className="relative h-[500px] sm:h-[540px] lg:h-[580px]">
          <Image
            src={album.cover}
            alt={album.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-[#55152B]/78" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#7A1F3D]/65 to-[#2457C5]/20" />

          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />

          <div className="absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full border border-white/10" />

          <div className="absolute right-[18%] top-24 h-20 w-20 rotate-12 rounded-2xl border border-white/10" />

          <div className="absolute bottom-24 left-[32%] h-2 w-2 rounded-full bg-white/30" />

          <div className="absolute right-[30%] top-28 h-1.5 w-1.5 rounded-full bg-white/30" />

          <div className="relative mx-auto flex h-full max-w-7xl items-start px-5 pt-32 sm:px-8 sm:pt-36 lg:px-10 lg:pt-40">
            <div className="max-w-3xl text-white">
              {/* Breadcrumb */}
              <nav
                aria-label="Breadcrumb"
                className="mb-7 flex flex-wrap items-center gap-2 text-sm"
              >
                <Link
                  href="/"
                  className="text-white/60 transition hover:text-white"
                >
                  Home
                </Link>

                <ChevronRight
                  size={15}
                  className="text-white/40"
                />

                <Link
                  href="/resources/gallery"
                  className="text-white/60 transition hover:text-white"
                >
                  Resources
                </Link>

                <ChevronRight
                  size={15}
                  className="text-white/40"
                />

                <Link
                  href="/resources/gallery"
                  className="text-white/60 transition hover:text-white"
                >
                  Gallery
                </Link>

                <ChevronRight
                  size={15}
                  className="text-white/40"
                />

                <span className="font-medium text-white">
                  {album.title}
                </span>
              </nav>

              {/* Label */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm">
                <Images size={14} />
                {album.category}
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {album.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                {album.description}
              </p>

              {/* Metadata */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur-sm">
                  <CalendarDays size={15} />
                  {album.year}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur-sm">
                  <Images size={15} />
                  {album.images.length} photos
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ALBUM TOOLBAR
      ========================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="container-main flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/resources/gallery"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#172033] transition hover:text-[#7A1F3D]"
          >
            <ArrowLeft size={16} />
            Back to Gallery
          </Link>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="btn-outline"
            >
              <Share2 size={16} />
              Share Album
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="btn-outline"
            >
              <LinkIcon size={16} />
              {copied ? "Link Copied" : "Copy Link"}
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
    PHOTO GRID
========================================================= */}

<section className="section">
  <div className="container-main">
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
          <span className="h-[3px] w-8 rounded-full bg-[#7A1F3D]" />
          Album Collection
        </div>

        <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
          {album.title}
        </h2>
      </div>

      <span className="text-sm font-medium text-slate-400">
        {album.images.length} photos
      </span>
    </div>

    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {album.images.map((image, index) => (
        <button
          key={image.id}
          type="button"
          onClick={() => setSelectedIndex(index)}
          aria-label={`Open image ${index + 1}`}
          className="group relative overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/20 hover:shadow-xl"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={image.image}
              alt={album.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            <div className="absolute inset-0 bg-[#172033]/0 transition duration-300 group-hover:bg-[#172033]/15" />

            <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2457C5] opacity-0 shadow-lg backdrop-blur-sm transition duration-300 group-hover:opacity-100">
              <ArrowUpRight size={17} />
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
</section>
      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="section-sm">
        <div className="container-main">
          <div className="relative overflow-hidden rounded-[30px] bg-[#7A1F3D] px-7 py-14 text-white sm:px-10 sm:py-16 lg:px-16">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />

            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-[#2457C5]/30" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                  <Images size={14} />
                  Lifeline Achham Gallery
                </div>

                <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                  Explore more moments from our work.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
                  Browse other collections to discover more community
                  activities, campaigns, programs and events.
                </p>
              </div>

              <Link
                href="/resources/gallery"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#7A1F3D] transition hover:-translate-y-0.5 hover:bg-[#FCFAF7]"
              >
                View All Albums
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          LIGHTBOX
      ========================================================= */}

      {selectedImage && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07101f]/95 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${album.title} photo viewer`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedIndex(null);
            }
          }}
        >
          {/* Top controls */}
          <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">
            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur-md">
              {selectedIndex + 1} / {album.images.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleDownload(
                    selectedImage.image,
                    selectedImage.title,
                  )
                }
                aria-label="Download image"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white hover:text-[#172033]"
              >
                <Download size={18} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share album"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white hover:text-[#172033]"
              >
                <Share2 size={18} />
              </button>

              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Close image viewer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white hover:text-[#172033]"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Previous */}
          <button
            type="button"
            onClick={() =>
              setSelectedIndex(
                (selectedIndex - 1 + album.images.length) %
                  album.images.length,
              )
            }
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-[#172033] sm:left-7 sm:h-12 sm:w-12"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Image */}
          <div className="relative flex h-[75vh] w-full max-w-6xl items-center justify-center">
            <Image
              src={selectedImage.image}
              alt={selectedImage.title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={() =>
              setSelectedIndex(
                (selectedIndex + 1) % album.images.length,
              )
            }
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-[#172033] sm:right-7 sm:h-12 sm:w-12"
          >
            <ChevronRight size={22} />
          </button>

          {/* Caption */}
          <div className="absolute bottom-5 left-1/2 w-[calc(100%-40px)] max-w-2xl -translate-x-1/2 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center backdrop-blur-md sm:bottom-8">
            <p className="text-sm font-bold text-white">
              {selectedImage.title}
            </p>

            <p className="mt-1 text-xs text-white/55">
              {album.title} · {album.year}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
