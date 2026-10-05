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
        keyword:keyword ? keyword : undefined,
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
    <div className="">
      {news.data?.map((item,idx)=>{
        return<div key={idx}>
          <p className="border-brand-black">{item.category}</p>
          <img src={item.thumbnailPath} alt="" />
          <h2>{item.title}</h2>
          <p>{item.createdAt.toLocaleDateString()}</p>
        </div>
      })}
    </div>
  );
};

export default NewsClient;
