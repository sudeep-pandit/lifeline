
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import PublicationsClient from "./PublicationsClient";

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  try {
    await requirePermission("content.view");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      redirect("/login");
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      redirect("/admin/forbidden");
    }

    throw error;
  }

  return <PublicationsClient />;
}