"use client";

import { parseAsInteger, useQueryState } from "nuqs";

import News from "@/components/News";
import FilterChips from "@/components/brand/FilterChips";
import SearchField from "@/components/brand/SearchField";
import Pagination from "@/components/brand/Pagination";
import { EmptyPanel, ErrorPanel, LoadingCards } from "@/components/brand/StatusPanels";
import { useNews } from "@/hooks/news";
import { NEWS_CATEGORIES } from "@/lib/features/news";

// バックエンドのNewsService.PAGE_SIZEと合わせる
const PAGE_SIZE = 20;

const NewsClient = () => {
  const [category, setCategory] = useQueryState("category");
  const [keyword, setKeyword] = useQueryState("keyword");
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const news = useNews({
    page,
    categories: category ? [category] : [],
    keyword: keyword ?? undefined,
  });

  const clear = () => {
    setCategory(null);
    setKeyword(null);
    setPage(null);
  };

  const published = (news.data ?? []).filter((n) => n.isPublished);

  return (
    <>
      <section
        aria-label="絞り込み"
        className="flex flex-col gap-5 border-2 border-brand-black bg-white/50 p-4 md:flex-row-reverse md:flex-wrap md:items-end md:justify-between md:gap-6 md:p-6"
      >
        <SearchField
          key={keyword ?? ""}
          id="news-keyword"
          label="KEYWORD"
          placeholder="記事を検索"
          defaultValue={keyword ?? ""}
          onSubmit={(value) => {
            setKeyword(value || null);
            setPage(null);
          }}
        />
        <FilterChips
          label="CATEGORY"
          options={[
            { label: "すべて", value: null },
            ...NEWS_CATEGORIES.map((c) => ({ label: c, value: c })),
          ]}
          value={category}
          onChange={(value) => {
            setCategory(value);
            setPage(null);
          }}
        />
      </section>

      {news.isLoading ? (
        <LoadingCards count={6} />
      ) : news.error ? (
        <ErrorPanel
          command="codemates news --list"
          message="記事を読み込めませんでした"
          onRetry={() => news.refetch()}
        />
      ) : published.length === 0 ? (
        <EmptyPanel
          unit="POSTS"
          message={keyword ? `「${keyword}」に一致する記事は見つかりませんでした` : "該当する記事はありません"}
          onClear={category || keyword ? clear : undefined}
        />
      ) : (
        <section aria-label="記事" className="grid grid-cols-1 gap-3 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] md:gap-2">
          {published.map((item, idx) => (
            <News
              key={idx}
              title={item.title}
              category={item.category}
              createdAt={item.createdAt}
              thumbnailPath={item.thumbnailPath}
            />
          ))}
        </section>
      )}

      <Pagination
        page={page}
        hasNext={(news.data?.length ?? 0) >= PAGE_SIZE}
        onChange={(p) => setPage(p === 1 ? null : p)}
      />
    </>
  );
};

export default NewsClient;
