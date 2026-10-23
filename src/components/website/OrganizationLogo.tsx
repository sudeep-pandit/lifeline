"use client";

import { useEffect, useState } from "react";

type OrganizationLogoProps = {
  className?: string;
  fallbackClassName?: string;
};

export default function OrganizationLogo({
  className = "h-10 w-10 object-contain",
  fallbackClassName =
    "flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A1F3D] text-sm font-bold text-white",
}: OrganizationLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadLogo() {
      try {
        const response = await fetch(
          "/api/content/public?key=organization_branding",
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(`Logo request failed: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Unable to load organization logo.");
        }

        if (active) {
          const savedLogo = result.data?.imageUrl;

          setLogoUrl(
            typeof savedLogo === "string" && savedLogo.trim()
              ? savedLogo.trim()
              : null,
          );
        }
      } catch (error) {
        console.error("Unable to load organization logo:", error);

        if (active) {
          setLogoUrl(null);
        }
      } finally {
        if (active) {
          setLoaded(true);
        }
      }
    }

    loadLogo();

    return () => {
      active = false;
    };
  }, []);

  if (!loaded || !logoUrl || imageError) {
    const debugMessage = !loaded
      ? "Logo is loading"
      : imageError
        ? `Image failed to load: ${logoUrl}`
        : "No logo URL returned by the API";

    return (
      <span
        className={fallbackClassName}
        role="img"
        aria-label="Lifeline Achham logo"
        title={debugMessage}
      >
        LA
      </span>
    );
  }

  return (
    <img
      src={logoUrl}
      alt="Lifeline Achham logo"
      className={className}
      onLoad={() => {
        console.info("Organization logo loaded:", logoUrl);
      }}
      onError={() => {
        console.error("Organization logo image failed:", logoUrl);
        setImageError(true);
      }}
    />
  );
}