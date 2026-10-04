"use client";

import { Spinner } from "@/components/ui/spinner";
import { getNewsDetail } from "@/lib/features/news";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const NewsDetailClient = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id")
  const parsed=id ? parseInt(id) : -1

  const newsDetail = useQuery({
    queryKey: ["news", id],
    queryFn: async() => {
      const newsDetail = await getNewsDetail({ id:parsed });
      return newsDetail;
    },
  });
  
  if(newsDetail.isLoading){
    // 読み込み中UI
    return <div className="min-h-screen">
      <div className="m-16">
        <span className="border-2 border-brand-black p-1">読み込み中</span>
        <div className="aspect-video bg-brand-black text-brand-beige flex items-center animate-pulse mt-2">
          <Spinner className="size-8 mx-auto"/>
        </div>
        <div className="">
          <p className="bg-brand-black/20 h-6 rounded-md my-2"></p>
          <p className="bg-brand-black/20 h-6 rounded-md my-2"></p>
          <p className="bg-brand-black/20 h-6 rounded-md my-2"></p>
          <p className="bg-brand-black/20 h-6 rounded-md my-2"></p>
        </div>
      </div>
    </div>
  }
  if(newsDetail.data){
    return (<div className="min-h-screen">
    <div className="m-16">
      <span className="border-2 border-brand-black p-1 mt-2">{newsDetail.data.category}</span>
      <div className="aspect-video">
        <img src={newsDetail.data.thumbnailPath} className="w-full h-full object-cover" />
      </div>
      <div>
        <h1 className="text-2xl">{newsDetail.data.title}</h1>
        <p>{newsDetail.data.content}</p>
      </div>
    </div>
  </div>)
  }
  if(newsDetail.error){
    return <div className="min-h-screen">
      <div className="text-2xl font-thin m-16">
        読み込みに失敗しました
      </div>
    </div>
  }
};

export default NewsDetailClient;
