
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Images,
  LoaderCircle,
  MapPin,
  Maximize2,
  Search,
  Share2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type GalleryPhoto = {
  id: string;
  title?: string | null;
  image: string;
  alt?: string | null;
  caption?: string | null;
  createdAt?: string | null;
};

type GalleryAlbum = {
  id: string;
  slug?: string | null;
  title: string;
  description?: string | null;
  category?: string | null;
  year?: string | number | null;
  isFeatured?: boolean;
  cover?: string | null;
  coverAlt?: string | null;
  imageCount?: number;
  images: GalleryPhoto[];
};

type GalleryApiResponse = {
  albums?: GalleryAlbum[];
};

const COLORS = {
  burgundy: "#7A1F3D",
  burgundyDark: "#55152B",
  cobalt: "#2457C5",
  navy: "#172033",
  cream: "#FCFAF7",
  pink: "#F7E9EE",
  blue: "#EEF4FF",
  muted: "#667085",
  border: "#E8E3E1",
  white: "#FFFFFF",
};

function getImageSource(
  value: string | null | undefined
): string | null {
  if (!value || typeof value !== "string") return null;

  const source = value.trim();

  if (!source) return null;

  if (
    source.startsWith("/") ||
    source.startsWith("https://") ||
    source.startsWith("http://") ||
    source.startsWith("data:image/")
  ) {
    return source;
  }

  return `/${source}`;
}

function getAlbumCover(
  album: GalleryAlbum
): string | null {
  return (
    getImageSource(album.cover) ||
    getImageSource(album.images?.[0]?.image)
  );
}

function getPhotoAlt(
  photo: GalleryPhoto,
  album: GalleryAlbum
): string {
  return (
    photo.alt?.trim() ||
    photo.title?.trim() ||
    `${album.title} gallery photograph`
  );
}

function getAlbumYear(album: GalleryAlbum): string {
  if (album.year !== null && album.year !== undefined) {
    return String(album.year);
  }

  const firstPhoto = album.images?.find(
    (photo) => photo.createdAt
  );

  if (firstPhoto?.createdAt) {
    const date = new Date(firstPhoto.createdAt);

    if (!Number.isNaN(date.getTime())) {
      return String(date.getFullYear());
    }
  }

  return "Other";
}

function formatDate(value?: string | null): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [activeAlbum, setActiveAlbum] =
    useState<GalleryAlbum | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showAllAlbums, setShowAllAlbums] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGallery() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch("/api/gallery/public", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            "The gallery could not be loaded right now."
          );
        }

        const data =
          (await response.json()) as GalleryApiResponse;

        const publishedAlbums = Array.isArray(data.albums)
          ? data.albums
          : [];

        const normalizedAlbums = publishedAlbums.map(
          (album) => ({
            ...album,
            images: Array.isArray(album.images)
              ? album.images.filter(
                  (photo) =>
                    Boolean(
                      photo &&
                        typeof photo.image === "string" &&
                        photo.image.trim()
                    )
                )
              : [],
          })
        );

        setAlbums(normalizedAlbums);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Unable to load gallery:", error);

        setLoadError(
          "We couldn't load the gallery at the moment. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadGallery();

    return () => controller.abort();
  }, []);

  const categories = useMemo(() => {
    const values = albums
      .map((album) => album.category?.trim())
      .filter((value): value is string => Boolean(value));

    return [
      "All",
      ...Array.from(new Set(values)).sort(),
    ];
  }, [albums]);

  const years = useMemo(() => {
    const values = albums
      .map(getAlbumYear)
      .filter((year) => year !== "Other");

    return [
      "All",
      ...Array.from(new Set(values)).sort((a, b) =>
        b.localeCompare(a, undefined, {
          numeric: true,
        })
      ),
    ];
  }, [albums]);

  const filteredAlbums = useMemo(() => {
    const query = search.trim().toLowerCase();

    return albums.filter((album) => {
      const matchesCategory =
        selectedCategory === "All" ||
        album.category?.trim() === selectedCategory;

      const matchesYear =
        selectedYear === "All" ||
        getAlbumYear(album) === selectedYear;

      const matchesSearch =
        !query ||
        [
          album.title,
          album.description,
          album.category,
          getAlbumYear(album),
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      return (
        matchesCategory &&
        matchesYear &&
        matchesSearch
      );
    });
  }, [
    albums,
    search,
    selectedCategory,
    selectedYear,
  ]);

  const featuredAlbum = useMemo(
    () =>
      albums.find(
        (album) =>
          album.isFeatured && getAlbumCover(album)
      ) ||
      albums.find((album) => getAlbumCover(album)) ||
      null,
    [albums]
  );

  const heroImage = featuredAlbum
    ? getAlbumCover(featuredAlbum)
    : null;

  const totalPhotos = useMemo(
    () =>
      albums.reduce(
        (total, album) => total + album.images.length,
        0
      ),
    [albums]
  );

  const visibleAlbums = showAllAlbums
    ? filteredAlbums
    : filteredAlbums.slice(0, 9);

  const currentPhoto =
    activeAlbum?.images[activePhotoIndex] ?? null;

  const closeLightbox = useCallback(() => {
    setActiveAlbum(null);
    setActivePhotoIndex(0);
    setCopied(false);
  }, []);

  const openAlbum = useCallback(
    (album: GalleryAlbum, photoIndex = 0) => {
      if (!album.images.length) return;

      setActiveAlbum(album);
      setActivePhotoIndex(
        Math.max(
          0,
          Math.min(photoIndex, album.images.length - 1)
        )
      );
      setCopied(false);
    },
    []
  );

  const showPreviousPhoto = useCallback(() => {
    setActivePhotoIndex((current) => {
      if (!activeAlbum?.images.length) return 0;

      return (
        current - 1 + activeAlbum.images.length
      ) % activeAlbum.images.length;
    });
  }, [activeAlbum]);

  const showNextPhoto = useCallback(() => {
    setActivePhotoIndex((current) => {
      if (!activeAlbum?.images.length) return 0;

      return (
        current + 1
      ) % activeAlbum.images.length;
    });
  }, [activeAlbum]);

  useEffect(() => {
    if (!activeAlbum) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();

      if (event.key === "ArrowLeft") {
        showPreviousPhoto();
      }

      if (event.key === "ArrowRight") {
        showNextPhoto();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = previousOverflow;
    };
  }, [
    activeAlbum,
    closeLightbox,
    showNextPhoto,
    showPreviousPhoto,
  ]);

  async function handleShare() {
    if (!currentPhoto || !activeAlbum) return;

    const imageUrl = getImageSource(currentPhoto.image);
    const shareUrl = window.location.href;

    const shareData = {
      title: currentPhoto.title || activeAlbum.title,
      text:
        currentPhoto.caption ||
        `Explore ${activeAlbum.title} from Lifeline Achham.`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (!navigator.clipboard?.writeText) {
        throw new Error(
          "Clipboard access is unavailable in this browser."
        );
      }

      await navigator.clipboard.writeText(
        imageUrl
          ? `${shareData.text}\n${imageUrl}`
          : shareUrl
      );

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error("Unable to share photo:", error);
    }
  }

  function resetFilters() {
    setSearch("");
    setSelectedCategory("All");
    setSelectedYear("All");
    setShowAllAlbums(false);
  }

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: COLORS.cream,
        color: COLORS.navy,
      }}
    >
      {/* HERO */}
      <section
        className="relative isolate overflow-hidden"
        style={{
          background: `linear-gradient(120deg, ${COLORS.burgundyDark} 0%, ${COLORS.burgundy} 55%, #8E3150 100%)`,
        }}
      >
        <div
          className="absolute inset-0 -z-20"
          style={{
            background: `linear-gradient(120deg, ${COLORS.burgundyDark} 0%, ${COLORS.burgundy} 55%, #8E3150 100%)`,
          }}
        />

        {heroImage && (
          <div className="absolute inset-0 -z-10">
            <Image
              src={heroImage}
              alt={
                featuredAlbum?.coverAlt ||
                featuredAlbum?.title ||
                "Lifeline Achham community activities"
              }
              fill
              priority
              sizes="100vw"
              unoptimized
              className="object-cover"
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(45,9,24,0.94) 0%, rgba(85,21,43,0.86) 48%, rgba(85,21,43,0.48) 100%)",
              }}
            />
          </div>
        )}

        <div className="absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-8 -top-12 -z-10 h-56 w-56 rounded-full border border-white/10" />

        
{/* BREADCRUMB — BELOW MAIN NAVBAR */}
<nav
  aria-label="Breadcrumb"
  className="relative z-10 pt-24 sm:pt-28"
>
  <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
    <ol className="flex flex-wrap items-center gap-2 text-sm">
     <li>
      <Link
        href="/"
        className="font-medium text-white transition hover:underline"
      >
        Home
      </Link>
    </li>

    <li aria-hidden="true">
      <ChevronRight size={15} className="text-white/70" />
    </li>

    <li>
      <span
        aria-current="page"
        className="font-semibold text-white"
      >
        Gallery
      </span>
    </li>
    </ol>
  </div>
</nav>


        {/* HERO CONTENT: CORRECT TWO-COLUMN STRUCTURE */}
        <div className="relative z-10 mx-auto grid min-h-[440px] max-w-7xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:pb-20">
          {/* LEFT COLUMN */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              <Camera size={16} />
              <span>Our stories in pictures</span>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Moments That
              <span className="block text-white/85">
                Matter.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
              Every photograph tells a story of people,
              communities, and change. Explore moments from
              Lifeline Achham&apos;s work and the communities
              we are proud to serve.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#gallery"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  backgroundColor: COLORS.white,
                  color: COLORS.burgundyDark,
                }}
              >
                Explore Gallery
                <ArrowRight size={17} />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Get in Touch
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
              <span className="inline-flex items-center gap-2">
                <MapPin size={15} />
                Achham, Nepal
              </span>

              <span className="h-1 w-1 rounded-full bg-white/60" />

              <span className="inline-flex items-center gap-2">
                <Images size={15} />
                Community stories and activities
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="hidden lg:block">
            <div className="ml-auto max-w-sm rounded-3xl border border-white/20 bg-white/10 p-7 text-white shadow-2xl backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Camera size={24} />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Our work, our people
              </p>

              <p className="mt-3 text-3xl font-bold">
                Real moments.
                <span className="mt-1 block text-white/80">
                  Lasting impact.
                </span>
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-extrabold">
                    {albums.length}
                  </p>
                  <p className="mt-1 text-xs text-white/75">
                    Photo albums
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-extrabold">
                    {totalPhotos}
                  </p>
                  <p className="mt-1 text-xs text-white/75">
                    Photographs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY INTRO */}
      <section
        id="gallery"
        className="scroll-mt-8 px-5 pb-8 pt-16 sm:px-8 lg:px-12 lg:pt-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div
                className="mb-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em]"
                style={{ color: COLORS.burgundy }}
              >
                <span
                  className="h-0.5 w-8 rounded-full"
                  style={{ backgroundColor: COLORS.cobalt }}
                />
                Life at Lifeline Achham
              </div>

              <h2
                className="text-3xl font-extrabold tracking-tight sm:text-4xl"
                style={{ color: COLORS.navy }}
              >
                Explore Our Gallery
              </h2>

              <p
                className="mt-4 max-w-2xl text-base leading-7"
                style={{ color: COLORS.muted }}
              >
                Discover our programs, field activities,
                community gatherings, and the people behind
                our mission.
              </p>
            </div>

            <div
              className="flex flex-wrap gap-3 text-sm"
              style={{ color: COLORS.navy }}
            >
              <div
                className="flex items-center gap-2 rounded-xl border px-4 py-3"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.white,
                }}
              >
                <Images
                  size={18}
                  style={{ color: COLORS.burgundy }}
                />
                <span>
                  <strong>{albums.length}</strong>{" "}
                  {albums.length === 1 ? "album" : "albums"}
                </span>
              </div>

              <div
                className="flex items-center gap-2 rounded-xl border px-4 py-3"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.white,
                }}
              >
                <Camera
                  size={18}
                  style={{ color: COLORS.cobalt }}
                />
                <span>
                  <strong>{totalPhotos}</strong>{" "}
                  {totalPhotos === 1 ? "photo" : "photos"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="px-5 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div
            className="rounded-2xl border p-4 sm:p-5"
            style={{
              borderColor: COLORS.border,
              backgroundColor: COLORS.white,
              boxShadow: "0 8px 28px rgba(23,32,51,0.035)",
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_0.8fr_auto]">
              <label className="relative block">
                <span className="sr-only">Search gallery</span>

                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: COLORS.muted }}
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search albums..."
                  className="w-full rounded-xl border py-3.5 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.cream,
                    color: COLORS.navy,
                  }}
                />
              </label>

              <label className="relative block">
                <span className="sr-only">
                  Filter by category
                </span>

                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border px-4 py-3.5 pr-10 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.cream,
                    color: COLORS.navy,
                  }}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All"
                        ? "All Categories"
                        : category}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: COLORS.muted }}
                />
              </label>

              <label className="relative block">
                <span className="sr-only">Filter by year</span>

                <select
                  value={selectedYear}
                  onChange={(event) =>
                    setSelectedYear(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border px-4 py-3.5 pr-10 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.cream,
                    color: COLORS.navy,
                  }}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year === "All" ? "All Years" : year}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: COLORS.muted }}
                />
              </label>

              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border px-5 py-3 text-sm font-bold transition hover:bg-gray-50"
                style={{
                  borderColor: COLORS.border,
                  color: COLORS.burgundy,
                }}
              >
                Reset filters
              </button>
            </div>

            <div
              className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm"
              style={{
                borderColor: COLORS.border,
                color: COLORS.muted,
              }}
            >
              <p>
                Showing{" "}
                <strong style={{ color: COLORS.navy }}>
                  {filteredAlbums.length}
                </strong>{" "}
                {filteredAlbums.length === 1
                  ? "album"
                  : "albums"}
              </p>

              {(search ||
                selectedCategory !== "All" ||
                selectedYear !== "All") && (
                <p>
                  Filters are active.{" "}
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="font-bold underline underline-offset-4"
                    style={{ color: COLORS.cobalt }}
                  >
                    Clear all
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ALBUM GRID */}
      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-4">
              <LoaderCircle
                size={34}
                className="animate-spin"
                style={{ color: COLORS.burgundy }}
              />

              <p
                className="text-sm font-medium"
                style={{ color: COLORS.muted }}
              >
                Loading gallery albums...
              </p>
            </div>
          ) : loadError ? (
            <div
              className="rounded-2xl border px-6 py-14 text-center"
              style={{
                borderColor: COLORS.border,
                backgroundColor: COLORS.white,
              }}
            >
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: COLORS.pink,
                  color: COLORS.burgundy,
                }}
              >
                <Camera size={25} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Gallery temporarily unavailable
              </h3>

              <p
                className="mx-auto mt-2 max-w-lg text-sm leading-6"
                style={{ color: COLORS.muted }}
              >
                {loadError}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 rounded-xl px-5 py-3 text-sm font-bold text-white"
                style={{
                  backgroundColor: COLORS.burgundy,
                }}
              >
                Try again
              </button>
            </div>
          ) : filteredAlbums.length === 0 ? (
            <div
              className="rounded-2xl border px-6 py-16 text-center"
              style={{
                borderColor: COLORS.border,
                backgroundColor: COLORS.white,
              }}
            >
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: COLORS.blue,
                  color: COLORS.cobalt,
                }}
              >
                <Search size={28} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No albums found
              </h3>

              <p
                className="mt-2 text-sm"
                style={{ color: COLORS.muted }}
              >
                Try a different search term or change your
                filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-xl px-5 py-3 text-sm font-bold text-white"
                style={{
                  backgroundColor: COLORS.burgundy,
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleAlbums.map((album, index) => {
                  const cover = getAlbumCover(album);
                  const photoCount = album.images.length;
                  const year = getAlbumYear(album);

                  return (
                    <article
                      key={album.id}
                      className="group overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      style={{
                        borderColor: COLORS.border,
                        backgroundColor: COLORS.white,
                        boxShadow:
                          "0 5px 20px rgba(23,32,51,0.035)",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => openAlbum(album)}
                        disabled={photoCount === 0}
                        className="block w-full text-left disabled:cursor-default"
                        aria-label={`Open ${album.title} album`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {cover ? (
                            <Image
                              src={cover}
                              alt={
                                album.coverAlt ||
                                `${album.title} cover`
                              }
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              unoptimized
                              className="object-cover transition duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div
                              className="absolute inset-0 flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.blue})`,
                                color: COLORS.burgundy,
                              }}
                            >
                              <Camera size={42} />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-90" />

                          {album.category && (
                            <span
                              className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold"
                              style={{
                                backgroundColor: COLORS.white,
                                color: COLORS.burgundy,
                              }}
                            >
                              {album.category}
                            </span>
                          )}

                          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                            <Camera size={14} />
                            {photoCount}{" "}
                            {photoCount === 1 ? "photo" : "photos"}
                          </span>

                          <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 opacity-0 shadow-lg transition group-hover:opacity-100">
                            <Maximize2 size={17} />
                          </span>
                        </div>

                        <div className="p-5 sm:p-6">
                          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium">
                            {year !== "Other" && (
                              <span
                                className="inline-flex items-center gap-1.5"
                                style={{
                                  color: COLORS.cobalt,
                                }}
                              >
                                <CalendarDays size={14} />
                                {year}
                              </span>
                            )}

                            {album.isFeatured && (
                              <span
                                className="rounded-full px-2.5 py-1 font-bold"
                                style={{
                                  backgroundColor: COLORS.pink,
                                  color: COLORS.burgundy,
                                }}
                              >
                                Featured
                              </span>
                            )}
                          </div>

                          <h3
                            className="line-clamp-2 text-xl font-bold leading-snug transition group-hover:underline group-hover:underline-offset-4"
                            style={{ color: COLORS.navy }}
                          >
                            {album.title}
                          </h3>

                          <p
                            className="mt-3 line-clamp-2 min-h-12 text-sm leading-6"
                            style={{ color: COLORS.muted }}
                          >
                            {album.description ||
                              "Explore moments, activities, and stories from Lifeline Achham."}
                          </p>

                          <div
                            className="mt-5 flex items-center justify-between border-t pt-4"
                            style={{
                              borderColor: COLORS.border,
                            }}
                          >
                            <span
                              className="text-xs font-medium"
                              style={{ color: COLORS.muted }}
                            >
                              View album
                            </span>

                            <span
                              className="flex h-9 w-9 items-center justify-center rounded-full transition group-hover:translate-x-1"
                              style={{
                                backgroundColor:
                                  index % 2 === 0
                                    ? COLORS.pink
                                    : COLORS.blue,
                                color:
                                  index % 2 === 0
                                    ? COLORS.burgundy
                                    : COLORS.cobalt,
                              }}
                            >
                              <ArrowRight size={17} />
                            </span>
                          </div>
                        </div>
                      </button>
                    </article>
                  );
                })}
              </div>

              {filteredAlbums.length > 9 && (
                <div className="mt-12 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllAlbums((current) => !current)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition hover:-translate-y-0.5"
                    style={{
                      borderColor: COLORS.burgundy,
                      backgroundColor: showAllAlbums
                        ? COLORS.burgundy
                        : COLORS.white,
                      color: showAllAlbums
                        ? COLORS.white
                        : COLORS.burgundy,
                    }}
                  >
                    {showAllAlbums
                      ? "Show fewer albums"
                      : "Explore all albums"}

                    <ChevronDown
                      size={17}
                      className={
                        showAllAlbums ? "rotate-180" : ""
                      }
                    />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* COMMUNITY CTA */}
      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-12 sm:px-10 sm:py-14 lg:px-14"
            style={{
              background: `linear-gradient(120deg, ${COLORS.burgundyDark}, ${COLORS.burgundy})`,
            }}
          >
            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -right-2 -top-10 h-44 w-44 rounded-full border border-white/10" />

            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-white/70">
                  <Camera size={15} />
                  Be part of the story
                </span>

                <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                  Together, we can create
                  <span className="block text-white/80">
                    more meaningful moments.
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                  Connect with Lifeline Achham to learn about
                  our work, collaborate on community initiatives,
                  or support our mission.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition hover:-translate-y-0.5"
                  style={{
                    backgroundColor: COLORS.white,
                    color: COLORS.burgundyDark,
                  }}
                >
                  Contact Us
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO LIGHTBOX */}
      {activeAlbum && currentPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery photo viewer"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <div className="flex h-full max-h-[950px] w-full max-w-7xl flex-col">
            <div className="flex shrink-0 items-center justify-between gap-4 py-3 text-white sm:py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold sm:text-base">
                  {activeAlbum.title}
                </p>

                <p className="mt-1 text-xs text-white/60">
                  Photo {activePhotoIndex + 1} of{" "}
                  {activeAlbum.images.length}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/15"
                  aria-label="Share photo"
                  title={copied ? "Copied" : "Share photo"}
                >
                  {copied ? (
                    <Check size={19} />
                  ) : (
                    <Share2 size={19} />
                  )}
                </button>

                <a
                  href={
                    getImageSource(currentPhoto.image) || "#"
                  }
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/15"
                  aria-label="Download photo"
                  title="Download photo"
                >
                  <ArrowDownToLine size={20} />
                </a>

                <button
                  type="button"
                  onClick={closeLightbox}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/15"
                  aria-label="Close photo viewer"
                  title="Close"
                >
                  <X size={23} />
                </button>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              {activeAlbum.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousPhoto}
                    className="absolute left-1 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-3 sm:h-12 sm:w-12"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={27} />
                  </button>

                  <button
                    type="button"
                    onClick={showNextPhoto}
                    className="absolute right-1 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-3 sm:h-12 sm:w-12"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={27} />
                  </button>
                </>
              )}

              <div className="relative h-full w-full">
                <Image
                  key={currentPhoto.id}
                  src={
                    getImageSource(currentPhoto.image) || ""
                  }
                  alt={getPhotoAlt(currentPhoto, activeAlbum)}
                  fill
                  sizes="100vw"
                  unoptimized
                  priority
                  className="object-contain"
                />
              </div>
            </div>

            <div className="shrink-0 py-4 text-center text-white">
              <p className="text-sm font-semibold sm:text-base">
                {currentPhoto.title ||
                  getPhotoAlt(currentPhoto, activeAlbum)}
              </p>

              {currentPhoto.caption && (
                <p className="mx-auto mt-1 max-w-2xl text-xs leading-5 text-white/65 sm:text-sm">
                  {currentPhoto.caption}
                </p>
              )}

              {currentPhoto.createdAt &&
                formatDate(currentPhoto.createdAt) && (
                  <p className="mt-2 text-xs text-white/50">
                    {formatDate(currentPhoto.createdAt)}
                  </p>
                )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
