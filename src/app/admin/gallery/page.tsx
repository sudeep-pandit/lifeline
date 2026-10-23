
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  try {
    await requirePermission("gallery.view");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      redirect("/login");
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      redirect("/admin/forbidden");
    }

    throw error;
  }

  return <GalleryClient />;
}
