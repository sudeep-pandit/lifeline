"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";

export default function OrganizationBrandingSettings() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    async function loadBranding() {
      try {
        const response = await fetch(
          "/api/settings/organization-branding",
          { cache: "no-store" },
        );
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load settings.");
        }

        if (active) setLogoUrl(result.data.logoUrl);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Unable to load settings.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBranding();

    return () => {
      active = false;
    };
  }, []);

  async function uploadLogo(file?: File) {
    if (!file) return;

    setMessage("");
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("The logo must be smaller than 10 MB.");
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
      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.media?.url) {
        throw new Error(uploadResult.error || "Logo upload failed.");
      }

      const newLogoUrl = uploadResult.media.url as string;

      const saveResponse = await fetch(
        "/api/settings/organization-branding",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logoUrl: newLogoUrl }),
        },
      );
      const saveResult = await saveResponse.json();

      if (!saveResponse.ok || !saveResult.success) {
        throw new Error(
          saveResult.message || "The logo uploaded but could not be saved.",
        );
      }

      setLogoUrl(newLogoUrl);
      setMessage("Organization logo updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to upload the logo.",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function removeLogo() {
    if (!logoUrl) return;

    if (!window.confirm("Remove the current organization logo?")) return;

    setRemoving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/settings/organization-branding",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logoUrl: null }),
        },
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to remove the logo.");
      }

      setLogoUrl(null);
      setMessage("Organization logo removed successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to remove the logo.",
      );
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#2457C5]">
          ORGANIZATION SETTINGS
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#172033]">
          Organization Branding
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage the official Lifeline Achham logo displayed throughout
          your website and administration panel.
        </p>
      </div>

      {message && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#172033]">
              Official organization logo
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Upload a transparent PNG or high-quality SVG for the cleanest
              appearance. JPG, WebP and GIF are also supported.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || uploading || removing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1946a7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : logoUrl ? (
                  <RefreshCw size={18} />
                ) : (
                  <ImagePlus size={18} />
                )}
                {uploading ? "Uploading..." : logoUrl ? "Replace logo" : "Upload logo"}
              </button>

              {logoUrl && (
                <button
                  type="button"
                  onClick={removeLogo}
                  disabled={uploading || removing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
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
              onChange={(event) => void uploadLogo(event.target.files?.[0])}
            />

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Maximum file size: 10 MB. The previous media file is not
              automatically deleted when replacing the logo.
            </p>
          </div>

          <div className="w-full lg:w-80">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Live logo preview
            </p>
            <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-[#FCFAF7] p-8">
              {loading ? (
                <LoaderCircle size={28} className="animate-spin text-[#2457C5]" />
              ) : logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Lifeline Achham organization logo preview"
                  className="max-h-36 max-w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7A1F3D] text-2xl font-bold text-white">
                    LA
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    No custom logo uploaded
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Upload your official logo to replace this fallback.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-sm leading-6 text-slate-600">
        <strong className="text-[#172033]">Where it will appear:</strong>{" "}
        the public website navigation, website footer and admin sidebar once
        those shared components are connected to the saved branding.
      </div>
    </div>
  );
}
