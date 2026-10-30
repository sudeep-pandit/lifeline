
import { redirect } from "next/navigation";

import { requirePermission } from "@/lib/permissions";
import DonorsClient from "./DonorsClient";

export const dynamic = "force-dynamic";

export default async function DonorsPage() {
  try {
    await requirePermission("bloodDonation.view");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      redirect("/login");
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      redirect("/admin/dashboard");
    }

    throw error;
  }

  return <DonorsClient />;
}
