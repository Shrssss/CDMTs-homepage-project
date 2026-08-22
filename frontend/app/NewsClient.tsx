"use client";

import News from "@/components/News";
import { searchNews } from "@/lib/features/news";
import { useQuery } from "@tanstack/react-query";

const NewsClient = () => {
  const newsQuery = useQuery({
    queryFn: async () => {
      return await searchNews({
        categories: null,
        keyword: null,
        page: null,
      });
    },
    queryKey: ["news"],
  });
  if (newsQuery.isLoading) {
    return (
      <div className="grid grid-cols-1">
        <div className="bg-accent p-2">
          <p className="text-sm">読み込み中</p>
        </div>
      </div>
    );
  }
  if(newsQuery.error){
    return (
      <div className="grid grid-cols-1">
        <div className="bg-accent p-2">
          <p className="text-sm">エラーが発生しました</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-2">
      {newsQuery.data?.filter((n) => n.isPublished).map((n, idx) => {
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
