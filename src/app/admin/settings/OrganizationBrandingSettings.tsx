
"use client";

import {
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type BrandingResponse = {
  success?: boolean;
  message?: string;
  data?: {
    logoUrl?: string | null;
  };
};

type UploadResponse = {
  error?: string;
  media?: {
    url?: string;
  };
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

async function readJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("The server returned an invalid response.");
  }
}

export default function OrganizationBrandingSettings() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const busy = loading || uploading || removing;

  const loadBranding = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/settings/organization-branding",
        { cache: "no-store" },
      );

      const result = await readJson<BrandingResponse>(response);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load organization branding.",
        );
      }

      setLogoUrl(result.data?.logoUrl ?? null);
      setLogoLoadFailed(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load organization branding.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBranding();
  }, [loadBranding]);

  async function uploadLogo(file?: File) {
    if (!file || busy) return;

    setMessage("");
    setError("");

    if (!ALLOWED_TYPES.has(file.type)) {
      setError("Choose a PNG, JPEG, WebP, GIF, or SVG image.");
      return;
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      setError(
        "The image must be greater than 0 bytes and no larger than 10 MB.",
      );
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", "Lifeline Achham organization logo");

      const uploadResponse = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const uploadResult =
        await readJson<UploadResponse>(uploadResponse);

      const newLogoUrl = uploadResult.media?.url;

      if (
        !uploadResponse.ok ||
        typeof newLogoUrl !== "string" ||
        !newLogoUrl.trim()
      ) {
        throw new Error(
          uploadResult.error || "The logo upload failed.",
        );
      }

      const saveResponse = await fetch(
        "/api/settings/organization-branding",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ logoUrl: newLogoUrl }),
        },
      );

      const saveResult =
        await readJson<BrandingResponse>(saveResponse);

      if (!saveResponse.ok || !saveResult.success) {
        throw new Error(
          saveResult.message ||
            "The image uploaded, but the logo setting could not be saved.",
        );
      }

      setLogoUrl(saveResult.data?.logoUrl ?? newLogoUrl);
      setLogoLoadFailed(false);
      setMessage("Organization logo updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload the logo.",
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function removeLogo() {
    if (!logoUrl || busy) return;

    const confirmed = window.confirm(
      "Remove the current organization logo?",
    );

    if (!confirmed) return;

    setRemoving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/settings/organization-branding",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ logoUrl: null }),
        },
      );

      const result = await readJson<BrandingResponse>(response);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to remove the organization logo.",
        );
      }

      setLogoUrl(null);
      setLogoLoadFailed(false);
      setMessage("Organization logo removed successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove the logo.",
      );
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-[#2457C5]">
          ORGANIZATION SETTINGS
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#172033]">
          Organization Branding
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage the official Lifeline Achham logo used across the
          organization&apos;s website and administration panel.
        </p>
      </header>

      {message && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <h3 className="text-lg font-semibold text-[#172033]">
              Official organization logo
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose a high-quality image with a transparent background
              for the best appearance.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1946a7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : logoUrl ? (
                  <RefreshCw size={18} />
                ) : (
                  <ImagePlus size={18} />
                )}

                {uploading
                  ? "Uploading..."
                  : logoUrl
                    ? "Replace logo"
                    : "Upload logo"}
              </button>

              {logoUrl && (
                <button
                  type="button"
                  onClick={() => void removeLogo()}
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {removing ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}

                  {removing ? "Removing..." : "Remove logo"}
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              className="hidden"
              disabled={busy}
              onChange={(event) => {
                void uploadLogo(event.target.files?.[0]);
              }}
            />

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Maximum size: 10 MB. Replacing a logo does not automatically
              delete the old media file.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Live logo preview
            </p>

            <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-[#FCFAF7] p-8">
              {loading ? (
                <LoaderCircle
                  size={28}
                  className="animate-spin text-[#2457C5]"
                />
              ) : logoUrl && !logoLoadFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Lifeline Achham organization logo preview"
                  className="max-h-36 max-w-full object-contain"
                  onError={() => setLogoLoadFailed(true)}
                />
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7A1F3D] text-2xl font-bold text-white">
                    LA
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    {logoUrl
                      ? "Logo preview unavailable"
                      : "No custom logo uploaded"}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {logoUrl
                      ? "Check that the media file exists and is accessible."
                      : "Upload your official logo to replace this fallback."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-sm leading-6 text-slate-600">
        <strong className="text-[#172033]">Display note:</strong>{" "}
        Saving the logo updates the database. The website header, footer,
        and admin sidebar must separately read this saved branding setting
        before they display the new logo.
      </div>
    </div>
  );
}
