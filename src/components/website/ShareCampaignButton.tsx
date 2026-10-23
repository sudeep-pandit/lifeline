
"use client";

import {
  Check,
  Copy,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  Share2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type ShareCampaignButtonProps = {
  title: string;
  text: string;
};

export default function ShareCampaignButton({
  title,
  text,
}: ShareCampaignButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title} — ${text}`);

  const copyLink = async () => {
    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const textarea = document.createElement("textarea");

      textarea.value = shareUrl;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      document.execCommand("copy");

      document.body.removeChild(textarea);
    }

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const nativeShare = async () => {
    if (!shareUrl || !navigator.share) {
      return;
    }

    try {
      await navigator.share({
        title,
        text,
        url: shareUrl,
      });

      setOpen(false);
    } catch {
      // User cancelled the native share dialog.
    }
  };

  const platforms = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FacebookIcon />,
      className: "bg-[#1877F2] text-white",
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      icon: <MessageCircle size={18} />,
      className: "bg-[#25D366] text-white",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <LinkedInIcon />,
      className: "bg-[#0A66C2] text-white",
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
      icon: <Mail size={18} />,
      className: "bg-[#7A1F3D] text-white",
    },
  ];

  return (
    <>
      {/* SHARE BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-outline"
      >
        <Share2 size={16} />
        Share
      </button>

      {/* SHARE MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172033]/60 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* HEADER */}
            <div className="border-b border-slate-200 px-6 py-5">
              <button
                type="button"
                aria-label="Close share dialog"
                onClick={() => setOpen(false)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
              >
                <X size={17} />
              </button>

              <div className="flex items-center gap-3 pr-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                  <Share2 size={20} />
                </div>

                <div>
                  <h2
                    id="share-dialog-title"
                    className="text-lg font-bold text-[#172033]"
                  >
                    Share this campaign
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Share it with your community
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-6">
              {/* CAMPAIGN TITLE */}
              <div className="rounded-2xl bg-[#FCFAF7] p-4">
                <p className="line-clamp-2 text-sm font-semibold leading-6 text-[#172033]">
                  {title}
                </p>
              </div>

              {/* SOCIAL PLATFORMS */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Share via
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${platform.className}`}
                      >
                        {platform.icon}
                      </span>

                      <span className="text-sm font-semibold text-slate-700">
                        {platform.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* COPY LINK */}
              <div className="mt-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Copy link
                </p>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
                    <LinkIcon
                      size={15}
                      className="shrink-0 text-slate-400"
                    />

                    <span className="truncate text-xs text-slate-500">
                      {shareUrl || "Preparing link..."}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={copyLink}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold text-white transition ${
                      copied
                        ? "bg-[#198754]"
                        : "bg-[#2457C5] hover:bg-[#17439F]"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* NATIVE SHARE */}
{"share" in navigator && (                <button
                  type="button"
                  onClick={nativeShare}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#2457C5] hover:bg-[#EEF4FF] hover:text-[#2457C5]"
                >
                  <Share2 size={16} />
                  More sharing options
                </button>
              )}

              <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
                Share this campaign with people who may find it useful.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   FACEBOOK ICON
========================================================= */

function FacebookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 8h3V4h-3c-3.314 0-5 1.657-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.667.333-1 1-1Z" />
    </svg>
  );
}

/* =========================================================
   LINKEDIN ICON
========================================================= */

function LinkedInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.5 8.5A2.5 2.5 0 1 0 6.5 3a2.5 2.5 0 0 0 0 5.5ZM4 10h5v11H4V10Zm7 0h4.8v1.5h.1c.67-1.15 2.31-2.36 4.75-2.36 5.08 0 6.02 3.34 6.02 7.68V21h-5v-3.71c0-1.77-.03-4.04-2.46-4.04-2.46 0-2.84 1.92-2.84 3.91V21h-5V10Z" />
    </svg>
  );
}
