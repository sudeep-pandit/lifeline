import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

export default async function HomepageLayout({
  children,
}: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  if (!hasPermission(user.role, PERMISSIONS.SETTINGS_VIEW, user.customPermissions)) {
    redirect("/admin/forbidden");
  }

  return <>{children}</>;
}