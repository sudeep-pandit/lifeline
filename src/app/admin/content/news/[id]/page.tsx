
import { notFound } from "next/navigation";

import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import NewsArticleForm from "@/components/admin/NewsArticleForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditNewsArticlePage({ params }: Props) {
  await requirePermission("content.view");
  await requirePermission("content.edit");

  const { id } = await params;

  const article = await prisma.newsArticle.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!article) notFound();

  return (
    <div className="min-h-full bg-[#FCFAF7] p-4 sm:p-6 lg:p-8">
      <NewsArticleForm articleId={article.id} />
    </div>
  );
}
