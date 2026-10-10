"use client";

import News, { NewsListItem } from "@/components/News";
import { ErrorPanel, LoadingCards } from "@/components/brand/StatusPanels";
import { useNews } from "@/hooks/news";

// トップページの最新記事（3件）
const NewsClient = () => {
  const newsQuery = useNews({});

  if (newsQuery.isLoading) {
    return <LoadingCards count={3} />;
  }
  if (newsQuery.error) {
    return (
      <ErrorPanel
        command="codemates news --latest"
        message="記事を読み込めませんでした"
        onRetry={() => newsQuery.refetch()}
      />
    );
  }

  const latest = (newsQuery.data ?? []).filter((n) => n.isPublished).slice(0, 3);

  if (latest.length === 0) {
    return <p className="border-2 border-dashed border-brand-black p-6">まだ記事はありません。</p>;
  }

  return (
    <>
      {/* スマホではコンパクトな一覧 */}
      <div className="flex flex-col border-t-2 border-brand-black md:hidden">
        {latest.map((n, idx) => (
          <NewsListItem
            key={idx}
            title={n.title}
            category={n.category}
            createdAt={n.createdAt}
            thumbnailPath={n.thumbnailPath}
          />
        ))}
      </div>
      <div className="hidden gap-2 md:grid md:grid-cols-3">
        {latest.map((n, idx) => (
          <News
            key={idx}
            title={n.title}
            category={n.category}
            createdAt={n.createdAt}
            thumbnailPath={n.thumbnailPath}
          />
        ))}
      </div>
    </>
  );
};

export default NewsClient;
