"use client";

import News from "@/components/News";
import { searchNews } from "@/lib/features/news";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const NewsClient = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const keyword = searchParams.get("keyword");
  const news = useQuery({
    queryKey: ["news", page, keyword],
    queryFn: async () => {
      return await searchNews({
        page: page ? parseInt(page) : 1,
        categories: [],
        keyword,
      });
    },
  });
  if (news.isLoading) {
    return (
      <div className="bg-accent p-2 text-muted-foreground">読み込み中</div>
    );
  }
  if (news.error) {
    return (
      <div className="bg-accent p-2 text-muted-foreground">
        エラーが発生しました
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-2">
      {news.data?.map((n, idx) => {
        return (
          <News
            thumnailPath={n.thumbnailPath}
            category={n.category}
            createdAt={n.createdAt}
            key={idx}
            title={n.title}
          />
        );
      })}
    </div>
  );
};

export default NewsClient;
