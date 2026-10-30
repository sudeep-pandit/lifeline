
import { notFound, redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

import ContentClient from "../ContentClient";

const sections = ["programs", "projects", "campaigns"] as const;

type Section = (typeof sections)[number];

export default async function ContentSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!sections.includes(section as Section)) {
    notFound();
  }

  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  try {
    await requirePermission("content.view");
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      redirect("/login");
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      redirect("/admin/forbidden");
    }

    throw error;
  }

  return <ContentClient section={section as Section} />;
}
