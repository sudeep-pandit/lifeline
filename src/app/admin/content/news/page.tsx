
import { requirePermission } from "@/lib/permissions";
import NewsArticlesList from "@/components/admin/NewsArticlesList";

export default async function NewsAdminPage() {
  await requirePermission("content.view");

  return (
    <div className="min-h-full bg-[#FCFAF7] p-4 sm:p-6 lg:p-8">
      <NewsArticlesList />
    </div>
  );
}
