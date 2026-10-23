import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import ManagementSettings from "./ManagementSettings";

export default async function OrganizationSettingsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  try {
    await requirePermission("settings.view");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      redirect("/login");
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      redirect("/admin/forbidden");
    }

    throw error;
  }

  return <ManagementSettings />;
}