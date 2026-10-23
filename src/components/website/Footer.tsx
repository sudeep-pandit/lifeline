import OrganizationLogo from "@/components/website/OrganizationLogo";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-slate-200 bg-white">
      {/* DECORATIVE BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 -z-10 h-72 w-72 rounded-full bg-[#7A1F3D]/[0.045] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 -z-10 h-80 w-80 rounded-full bg-[#2457C5]/[0.045] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-150px] left-1/2 -z-10 h-72 w-[600px] max-w-full -translate-x-1/2 rounded-full bg-[#2457C5]/[0.025] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[5%] top-20 -z-10 hidden h-44 w-44 rounded-full border border-[#2457C5]/[0.08] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[7%] top-28 -z-10 hidden h-28 w-28 rounded-full border border-[#7A1F3D]/[0.07] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 bottom-32 -z-10 hidden h-40 w-40 rounded-full border border-[#7A1F3D]/[0.06] lg:block"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(#172033 1px, transparent 1px), linear-gradient(90deg, #172033 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* MAIN FOOTER */}
      <div className="container-main relative py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4 lg:gap-10 xl:gap-12">
          {/* BRAND */}
          <div className="min-w-0">
            <Link
              href="/"
              aria-label="Lifeline Achham home"
              className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457C5] focus-visible:ring-offset-4"
            >
              <OrganizationLogo
                className="h-12 w-12 shrink-0 rounded-xl object-contain"
                fallbackClassName="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7A1F3D] text-sm font-bold text-white shadow-lg shadow-[#7A1F3D]/15"
              />

              <span>
                <span className="block text-base font-bold tracking-tight text-[#55152B]">
                  Lifeline
                </span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Achham
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600">
              Working with communities to create meaningful, sustainable and
              lasting social impact.
            </p>

            {/* SOCIAL LINKS */}
            <div className="mt-6 flex items-center gap-3">
              <SocialLink
                href={siteConfig.social.facebook}
                label="Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.2Z" />
                </svg>
              </SocialLink>

              <SocialLink
                href={siteConfig.social.instagram}
                label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </SocialLink>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-px w-8 shrink-0 bg-[#7A1F3D]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Lifeline Achham
              </span>
            </div>
          </div>

          {/* ORGANIZATION — VERTICAL LIST */}
          <div className="min-w-0">
            <FooterHeading>Organization</FooterHeading>

            <ul className="mt-5 space-y-3">
              <li>
                <FooterLink href="/about" label="Who We Are" />
              </li>
              <li>
                <FooterLink
                  href="/about/mission-vision"
                  label="Mission & Vision"
                />
              </li>
              <li>
                <FooterLink href="/about/team" label="Our Team" />
              </li>
              <li>
                <FooterLink
                  href="/about/transparency"
                  label="Transparency"
                />
              </li>
            </ul>
          </div>

          {/* EXPLORE — VERTICAL LIST */}
          <div className="min-w-0">
            <FooterHeading>Explore</FooterHeading>

            <ul className="mt-5 space-y-3">
              <li>
                <FooterLink href="/work/programs" label="Programs" />
              </li>
              <li>
                <FooterLink href="/work/projects" label="Projects" />
              </li>
              <li>
                <FooterLink href="/work/campaigns" label="Campaigns" />
              </li>
              <li>
                <FooterLink
                  href="/resources/news"
                  label="News & Notices"
                />
              </li>
              <li>
                <FooterLink href="/resources/gallery" label="Gallery" />
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="min-w-0">
            <FooterHeading>Contact</FooterHeading>

            <div className="mt-5 space-y-4">
              <div className="flex min-w-0 items-start gap-3">
                <ContactIcon color="burgundy">
                  <MapPin size={16} />
                </ContactIcon>
                <span className="min-w-0 break-words pt-1 text-sm leading-6 text-slate-600">
                  {siteConfig.contact.address}
                </span>
              </div>

              <div className="flex min-w-0 items-start gap-3">
                <ContactIcon color="blue">
                  <Mail size={16} />
                </ContactIcon>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="min-w-0 break-all pt-1 text-sm leading-6 text-slate-600 transition-colors hover:text-[#2457C5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457C5]"
                >
                  {siteConfig.contact.email}
                </a>
              </div>

              {siteConfig.contact.phone && (
                <div className="flex min-w-0 items-start gap-3">
                  <ContactIcon color="burgundy">
                    <Phone size={16} />
                  </ContactIcon>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="min-w-0 break-words pt-1 text-sm leading-6 text-slate-600 transition-colors hover:text-[#2457C5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457C5]"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg text-xs font-bold uppercase tracking-[0.12em] text-[#55152B] transition-colors hover:text-[#2457C5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457C5] focus-visible:ring-offset-4"
            >
              Contact us
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* COPYRIGHT AND DEVELOPER CREDIT */}
      <div className="relative border-t border-slate-200">
        <div className="container-main flex flex-col gap-4 py-5 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs leading-5 text-slate-600">
            © {new Date().getFullYear()} Lifeline Achham. All rights reserved.
          </p>

          <div className="flex flex-col items-start gap-3 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
            <Link
              href="/terms"
              className="inline-flex min-h-8 items-center text-slate-600 transition-colors hover:text-[#2457C5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457C5]"
            >
              Terms & Conditions
            </Link>

            <span className="hidden h-3 w-px bg-slate-300 sm:block" />

            <p className="leading-5 text-slate-600">
              Designed & Developed by{" "}
              <a
                href="https://sudeeppandit.com.np"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#7A1F3D] transition-colors hover:text-[#2457C5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457C5]"
              >
                Sudeep Pandit
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* FOOTER SECTION HEADING */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#172033]">
      {children}
    </h3>
  );
}

/* FOOTER LIST LINK */
function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-8 max-w-full items-center gap-2 rounded-sm text-sm text-slate-600 transition-colors duration-200 hover:text-[#2457C5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457C5]"
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7A1F3D]/60 transition-colors duration-200 group-hover:bg-[#2457C5]"
      />
      <span>{label}</span>
    </Link>
  );
}

/* SOCIAL LINK */
function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const configured =
    typeof href === "string" && /^https?:\/\//i.test(href);

  if (!configured) {
    return (
      <span
        aria-label={`${label} link not configured`}
        title={`${label} link not configured`}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400"
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit Lifeline Achham on ${label}`}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#2457C5]/30 hover:bg-[#EEF4FF] hover:text-[#2457C5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457C5] focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}

/* CONTACT ICON */
function ContactIcon({
  color,
  children,
}: {
  color: "burgundy" | "blue";
  children: React.ReactNode;
}) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
        color === "burgundy"
          ? "bg-[#F7E9EE] text-[#7A1F3D]"
          : "bg-[#EEF4FF] text-[#2457C5]"
      }`}
    >
      {children}
    </span>
  );
}