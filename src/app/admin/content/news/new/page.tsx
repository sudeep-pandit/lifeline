
import { requirePermission } from "@/lib/permissions";
import NewsArticleForm from "@/components/admin/NewsArticleForm";

export default async function NewNewsArticlePage() {
  await requirePermission("content.create");

  return (
    <div className="min-h-full bg-[#FCFAF7] p-4 sm:p-6 lg:p-8">
      <NewsArticleForm />
    </div>
  );
}
