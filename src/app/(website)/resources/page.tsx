import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileBarChart,
  FileText,
  Image as ImageIcon,
  Newspaper,
} from "lucide-react";

const resourceItems = [
  {
    title: "News & Notices",
    description:
      "Read the latest news, announcements, notices and updates from Lifeline Achham.",
    href: "/resources/news",
    icon: Newspaper,
    number: "01",
    accent: "burgundy",
  },
  {
    title: "Gallery",
    description:
      "Explore photographs and visual stories from our programs, campaigns, activities and events.",
    href: "/resources/gallery",
    icon: ImageIcon,
    number: "02",
    accent: "blue",
  },
  {
    title: "Reports",
    description:
      "Access organizational reports, activity reports and documents supporting transparency and accountability.",
    href: "/resources/reports",
    icon: FileBarChart,
    number: "03",
    accent: "burgundy",
  },
  {
    title: "Publications",
    description:
      "Explore publications, educational materials, awareness resources and other useful documents.",
    href: "/resources/publications",
    icon: BookOpen,
    number: "04",
    accent: "blue",
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-[#FCFAF7] text-[#172033]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#F7E9EE] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-[#EEF4FF] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-14 flex items-center gap-2 text-sm"
          >
            <Link
              href="/"
              className="font-medium text-[#64748B] transition hover:text-[#2457C5]"
            >
              Home
            </Link>

            <span className="text-[#CBD5E1]">/</span>

            <span className="font-medium text-[#7A1F3D]">
              Resources
            </span>
          </nav>

          {/* Hero content */}
          <div className="max-w-3xl pb-20 lg:pb-24">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#7A1F3D] shadow-sm">
              <FileText className="h-4 w-4" />
              Resources & Updates
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-[#172033] sm:text-5xl lg:text-6xl">
              Resources for{" "}
              <span className="text-[#7A1F3D]">Our Community</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#475569] sm:text-lg">
              Explore news, visual stories, reports and publications from
              Lifeline Achham. Our resource center brings together useful
              information about our work, activities and community
              engagement.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/resources/news"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#17439F]"
              >
                Latest Updates
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/resources/reports"
                className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#172033] transition hover:border-[#2457C5] hover:text-[#2457C5]"
              >
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          RESOURCE OVERVIEW
      ========================================================= */}
      <section className="bg-[#FCFAF7]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
          {/* Section heading */}
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
              Explore Resources
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Information, Stories & Publications
            </h2>

            <p className="mt-4 text-base leading-7 text-[#475569]">
              Discover different resources that help you stay informed about
              Lifeline Achham and the work we do with communities.
            </p>
          </div>

          {/* Resource grid */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {resourceItems.map((item) => {
              const Icon = item.icon;
              const isBlue = item.accent === "blue";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D7DCE5] hover:shadow-xl sm:p-8"
                >
                  {/* Card decoration */}
                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${
                      isBlue ? "bg-[#EEF4FF]" : "bg-[#F7E9EE]"
                    }`}
                  />

                  <div className="relative">
                    {/* Number + icon */}
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                          isBlue
                            ? "bg-[#EEF4FF] text-[#2457C5]"
                            : "bg-[#F7E9EE] text-[#7A1F3D]"
                        }`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>

                      <span className="text-sm font-bold tracking-widest text-[#CBD5E1]">
                        {item.number}
                      </span>
                    </div>

                    {/* Text */}
                    <h3 className="mt-7 text-xl font-bold text-[#172033] transition-colors group-hover:text-[#7A1F3D]">
                      {item.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-[#64748B]">
                      {item.description}
                    </p>

                    {/* Link */}
                    <div
                      className={`mt-6 inline-flex items-center gap-2 text-sm font-bold ${
                        isBlue ? "text-[#2457C5]" : "text-[#7A1F3D]"
                      }`}
                    >
                      Explore {item.title}

                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED INFORMATION
      ========================================================= */}
      <section className="border-y border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
            {/* Left */}
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#2457C5]">
                Stay Informed
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Follow our latest activities
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-[#475569]">
                From community activities and awareness campaigns to
                organizational updates and publications, our resources help
                keep our community informed and connected.
              </p>

              <div className="mt-8">
                <Link
                  href="/resources/news"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#55152B]"
                >
                  Read Latest News
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right visual panel */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#FCFAF7] p-8 shadow-sm">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#F7E9EE]" />
                <div className="absolute bottom-0 left-0 h-28 w-28 rounded-tr-full bg-[#EEF4FF]" />

                <div className="relative">
                  <div className="flex items-center gap-4 border-b border-[#E5E7EB] pb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D]">
                      <FileText className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#172033]">
                        Lifeline Achham
                      </p>

                      <p className="text-xs text-[#64748B]">
                        Resources Center
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6">
                    <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                      <Newspaper className="h-5 w-5 text-[#2457C5]" />

                      <div>
                        <p className="text-sm font-semibold text-[#172033]">
                          News & Notices
                        </p>
                        <p className="text-xs text-[#64748B]">
                          Latest updates
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                      <ImageIcon className="h-5 w-5 text-[#7A1F3D]" />

                      <div>
                        <p className="text-sm font-semibold text-[#172033]">
                          Gallery
                        </p>
                        <p className="text-xs text-[#64748B]">
                          Visual stories
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                      <FileBarChart className="h-5 w-5 text-[#2457C5]" />

                      <div>
                        <p className="text-sm font-semibold text-[#172033]">
                          Reports
                        </p>
                        <p className="text-xs text-[#64748B]">
                          Organizational information
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                      <BookOpen className="h-5 w-5 text-[#7A1F3D]" />

                      <div>
                        <p className="text-sm font-semibold text-[#172033]">
                          Publications
                        </p>
                        <p className="text-xs text-[#64748B]">
                          Useful resources
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TRANSPARENCY CTA
      ========================================================= */}
      <section className="bg-[#FCFAF7]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-[#55152B] px-7 py-10 sm:px-10 lg:px-14 lg:py-12">
            {/* Decorative shapes */}
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#7A1F3D] opacity-70" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-[#2457C5] opacity-30" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">
                  Transparency
                </span>

                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  Learn more about our work
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
                  Explore organizational information, reports and resources to
                  better understand our work and commitment to meaningful
                  community impact.
                </p>
              </div>

              <Link
                href="/about/transparency"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#55152B] transition hover:bg-[#FCFAF7]"
              >
                View Transparency
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
              Get Involved
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Be part of the journey
            </h2>

            <p className="mt-4 text-base leading-7 text-[#475569]">
              Learn more about Lifeline Achham, explore our work and discover
              ways to stay connected with our community-focused initiatives.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17439F]"
              >
                Explore Our Work
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#172033] transition hover:border-[#7A1F3D] hover:text-[#7A1F3D]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
