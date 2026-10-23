import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

const staticPages = [
  "",
  "/about",
  "/about/mission-vision",
  "/about/team",
  "/about/transparency",

  "/work",
  "/work/programs",
  "/work/projects",
  "/work/campaigns",

  "/resources/news",
  "/resources/gallery",
  "/resources/reports",
  "/resources/publications",

  "/blood-donation",
  "/contact",
  "/terms",
];

const programSlugs = [
  "community-wellbeing",
  "youth-education",
  "health-awareness",
  "community-participation",
];

const projectSlugs = [
  "community-engagement-initiative",
  "youth-learning-initiative",
  "health-awareness-initiative",
  "community-capacity-initiative",
];

const campaignSlugs = [
  "community-awareness-campaign",
  "health-awareness-campaign",
  "youth-participation-campaign",
  "community-action-campaign",
];

const gallerySlugs = [
  "community-events",
  "health-awareness",
  "youth-participation",
  "community-engagement",
  "volunteer-activities",
  "community-campaigns",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency:
      path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/blood-donation" || path === "/contact"
          ? 0.9
          : 0.7,
  }));

  const programs: MetadataRoute.Sitemap =
    programSlugs.map((slug) => ({
      url: `${siteConfig.url}/work/programs/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const projects: MetadataRoute.Sitemap =
    projectSlugs.map((slug) => ({
      url: `${siteConfig.url}/work/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const campaigns: MetadataRoute.Sitemap =
    campaignSlugs.map((slug) => ({
      url: `${siteConfig.url}/work/campaigns/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const gallery: MetadataRoute.Sitemap =
    gallerySlugs.map((slug) => ({
      url: `${siteConfig.url}/resources/gallery/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [
    ...pages,
    ...programs,
    ...projects,
    ...campaigns,
    ...gallery,
  ];
}
