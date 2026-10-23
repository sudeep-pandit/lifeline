"use client";

import OrganizationLogo from "@/components/website/OrganizationLogo";
import Link from "next/link";
import {
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  // Explicit colors ensure every desktop link uses the same styling.
  const navLinkClass = scrolled
    ? " !text-[#55152B] hover:!text-[#2457C5] hover:!bg-[#F7E9EE]"
    : " !text-white hover:!text-white hover:!bg-white/15";

  const navItemClass =
    "inline-flex min-h-10 items-center justify-center gap-1 rounded-lg px-3 xl:px-4 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457C5] focus-visible:ring-offset-2" +
    navLinkClass;

  const mobileLinkClass = scrolled
    ? "text-[#55152B] hover:bg-[#F7E9EE] hover:text-[#2457C5]"
    : "text-white hover:bg-white/10 hover:text-white";

  const contactTextClass = scrolled
    ? "text-slate-600"
    : "text-white/90";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-white shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      {/* TOP CONTACT BAR */}
      <div className="hidden bg-[#55152B] text-white lg:block">
        <div className="container-main flex h-9 items-center justify-between gap-5">
          <div className="flex min-w-0 items-center text-[11px]">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex shrink-0 items-center gap-2 pr-4 text-white/90 transition-colors hover:text-white"
            >
              <Mail size={13} className="shrink-0 text-[#F2B8CB]" />
              <span>{siteConfig.contact.email}</span>
            </a>

            <span className="h-4 w-px shrink-0 bg-white/25" />

            {siteConfig.contact.phone ? (
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex shrink-0 items-center gap-2 px-4 text-white/90 transition-colors hover:text-white"
              >
                <Phone size={13} className="shrink-0 text-[#F2B8CB]" />
                <span>{siteConfig.contact.phone}</span>
              </a>
            ) : (
              <span className="flex shrink-0 items-center gap-2 px-4 text-white/90">
                <Phone size={13} className="shrink-0 text-[#F2B8CB]" />
                Contact us
              </span>
            )}

            <span className="h-4 w-px shrink-0 bg-white/25" />

            <span className="flex min-w-0 items-center gap-2 pl-4 text-white/90">
              <MapPin size={13} className="shrink-0 text-[#F2B8CB]" />
              <span className="truncate">{siteConfig.contact.address}</span>
            </span>
          </div>

          <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">
            Serving communities with purpose
          </p>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <div
        className={`border-b transition-colors duration-300 ${
          scrolled
            ? "border-slate-200 bg-white"
            : "border-white/15 bg-[#55152B]/20 backdrop-blur-md"
        }`}
      >
        <div className="container-main">
          <div className="flex h-[76px] items-center justify-between gap-3">
            {/* BRAND */}
            <Link
              href="/"
              aria-label="Lifeline Achham home"
              onClick={() => setMobileOpen(false)}
              className="flex shrink-0 items-center gap-3"
            >
              <OrganizationLogo className="h-11 w-11 shrink-0 rounded-xl object-contain" />

              <div className="leading-none">
                <div
                  className={`text-base font-bold tracking-tight ${
                    scrolled ? "text-[#55152B]" : "text-white"
                  }`}
                >
                  Lifeline
                </div>

                <div
                  className={`mt-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                    scrolled ? "text-[#2457C5]" : "text-white/85"
                  }`}
                >
                  Achham
                </div>
              </div>
            </Link>

            {/* DESKTOP NAV LINKS */}
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-0.5 lg:flex"
            >
              {navigation.map((item) => {
               if (!item.children?.length) {
            if (!item.href) {
              return (
                <span key={item.label} className={navItemClass}>
                  {item.label}
                </span>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                      className={navItemClass}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div key={item.label} className="group relative">
                    <button
                      type="button"
                      aria-haspopup="true"
                      className={navItemClass}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={15}
                        className="shrink-0 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                      />
                    </button>

                    <div className="invisible absolute left-0 top-full z-50 w-60 translate-y-2 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#55152B] transition-colors hover:bg-[#F7E9EE] hover:text-[#2457C5] focus-visible:bg-[#F7E9EE] focus-visible:outline-none"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* LOGIN AND MOBILE TOGGLE */}
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/login"
                className="hidden min-h-10 items-center justify-center rounded-lg bg-[#2457C5] px-5 py-2.5 text-sm font-bold !text-white transition-colors hover:bg-[#17439F] sm:inline-flex"
              >
                Login
              </Link>

              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
                className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors lg:hidden ${
                  scrolled
                    ? "border-slate-200 bg-white text-[#55152B] hover:bg-[#F7E9EE]"
                    : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {mobileOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {mobileOpen && (
            <div
              className={`max-h-[calc(100dvh-76px)] overflow-y-auto border-t py-4 lg:hidden ${
                scrolled
                  ? "border-slate-200 bg-white"
                  : "border-white/15 bg-[#55152B]"
              }`}
            >
              {/* MOBILE CONTACT DETAILS */}
              <div
                className={`mb-4 space-y-3 border-b px-3 pb-4 ${
                  scrolled ? "border-slate-200" : "border-white/20"
                }`}
              >
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className={`flex min-w-0 items-center gap-2 text-xs ${contactTextClass}`}
                >
                  <Mail size={15} className="shrink-0 text-[#2457C5]" />
                  <span className="break-all">{siteConfig.contact.email}</span>
                </a>

                {siteConfig.contact.phone && (
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className={`flex items-center gap-2 text-xs ${contactTextClass}`}
                  >
                    <Phone size={15} className="shrink-0 text-[#2457C5]" />
                    <span>{siteConfig.contact.phone}</span>
                  </a>
                )}

                <div className={`flex items-start gap-2 text-xs ${contactTextClass}`}>
                  <MapPin size={15} className="mt-0.5 shrink-0 text-[#2457C5]" />
                  <span>{siteConfig.contact.address}</span>
                </div>

                <p
                  className={`pt-1 text-[10px] font-semibold uppercase tracking-wider ${
                    scrolled ? "text-[#2457C5]" : "text-white/80"
                  }`}
                >
                  Serving communities with purpose
                </p>
              </div>

              {/* MOBILE NAV LINKS */}
              <nav aria-label="Mobile navigation" className="space-y-1">
                {navigation.map((item) => {
             if (!item.children?.length) {
              if (!item.href) {
                return (
                  <span key={item.label} className={navItemClass}>
                    {item.label}
                  </span>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${mobileLinkClass}`}
                      >
                        {item.label}
                      </Link>
                    );
                  }

                  return (
                    <div key={item.label} className="pt-2">
                      <div
                        className={`px-3 pb-2 text-[11px] font-bold uppercase tracking-wider ${
                          scrolled ? "text-[#2457C5]" : "text-[#F2B8CB]"
                        }`}
                      >
                        {item.label}
                      </div>

                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block rounded-lg px-5 py-3 text-sm font-medium transition-colors ${
                            scrolled
                              ? "text-[#55152B] hover:bg-[#F7E9EE] hover:text-[#2457C5]"
                              : "text-white/90 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  );
                })}

                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 flex min-h-11 items-center justify-center rounded-lg bg-[#2457C5] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17439F]"
                >
                  Login
                </Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}