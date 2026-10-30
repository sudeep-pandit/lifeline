
import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center";
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  description,
  align = "left",
  children,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>

      {(subtitle || description) && (
        <p className="mt-4 text-base leading-7 text-slate-600">
          {subtitle || description}
        </p>
      )}

      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
