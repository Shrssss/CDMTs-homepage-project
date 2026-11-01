"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

import { Spinner } from "@/components/ui/spinner";
import { CategoryLabel, Thumbnail } from "@/components/News";
import { ErrorPanel } from "@/components/brand/StatusPanels";
import { useNewsDetail } from "@/hooks/news";

const BackLink = () => {
  return (
    <Link
      href="/news"
      className="flex min-h-13 items-center justify-center gap-2 bg-brand-black px-6 font-bold text-white md:inline-flex md:min-h-12"
    >
      <ArrowLeft className="size-4" />
      記事一覧へ戻る
    </Link>
  );
};

const NewsDetailClient = () => {
  // クエリパラメータから対象の記事を取ってくる
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const parsed = id ? parseInt(id) : -1;

  const newsDetail = useNewsDetail({ id: parsed });

  if (newsDetail.isLoading) {
    // 読み込み中UI
    return (
      <div role="status" aria-label="読み込み中" className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="h-6 w-24 animate-pulse bg-brand-black/15"></div>
        <div className="h-10 animate-pulse bg-brand-black/15"></div>
        <div className="-mx-4 flex aspect-video items-center justify-center bg-brand-black text-brand-beige md:mx-0">
          <Spinner className="size-8" />
        </div>
        <div className="flex animate-pulse flex-col gap-3">
          <p className="h-5 bg-brand-black/15"></p>
          <p className="h-5 bg-brand-black/15"></p>
          <p className="h-5 w-2/3 bg-brand-black/15"></p>
        </div>
      </div>
    );
  }

  if (newsDetail.error || !newsDetail.data) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <ErrorPanel
          command={`codemates news --id ${id ?? ""}`}
          message="記事を読み込めませんでした"
          onRetry={() => newsDetail.refetch()}
        />
        <BackLink />
      </div>
    );
  }

  const news = newsDetail.data;

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6 md:gap-8">
      <title>{newsDetail.data.title}</title>
      <nav
        aria-label="パンくず"
        className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider"
      >
        <Link href="/news" className="py-3 underline">
          NEWS / LOG
        </Link>
        <span aria-hidden>/</span>
        <span>{news.category}</span>
      </nav>

      <div className="flex flex-col gap-4 md:gap-5">
        <div className="flex items-center gap-3">
          <CategoryLabel category={news.category} />
          <time dateTime={news.createdAt.toISOString()} className="font-mono text-sm">
            {format(news.createdAt, "yyyy.MM.dd")}
          </time>
        </div>
        <h1 className="text-[26px] leading-snug font-bold md:text-4xl">{news.title}</h1>
      </div>

      {news.thumbnailPath && (
        <div className="-mx-4 aspect-video border-y-2 border-brand-black md:mx-0 md:border-2">
          <Thumbnail src={news.thumbnailPath} alt="" />
        </div>
      )}

      {/* 本文はプレーンテキストとして扱い、改行で段落を区切る */}
      <div className="leading-loose whitespace-pre-line md:text-[17px]">{news.content}</div>

      <div className="flex flex-col gap-4 border-t-2 border-brand-black pt-6 md:flex-row md:items-center md:justify-between">
        <span className="hidden font-mono text-xs font-bold tracking-wider md:block">END OF POST</span>
        <BackLink />
      </div>
    </article>
  );
};

export default NewsDetailClient;
