
import sanitizeHtml from "sanitize-html";

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sanitizeNewsHtml(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "figure",
      "figcaption",
      "hr",
      "pre",
      "code",
      "sub",
      "sup",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
    },
  });
}

export function getNewsCategory(value: unknown) {
  const allowed = ["NEWS", "NOTICE", "ANNOUNCEMENT", "UPDATES"];

  if (typeof value !== "string" || !allowed.includes(value)) {
    return null;
  }

  return value as "NEWS" | "NOTICE" | "ANNOUNCEMENT" | "UPDATES";
}

export function getContentStatus(value: unknown) {
  if (value === "DRAFT" || value === "PUBLISHED") {
    return value;
  }

  return null;
}
