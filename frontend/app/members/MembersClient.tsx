"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";

import Member from "@/components/Member";
import FilterChips from "@/components/brand/FilterChips";
import SearchField from "@/components/brand/SearchField";
import Pagination from "@/components/brand/Pagination";
import { EmptyPanel, ErrorPanel } from "@/components/brand/StatusPanels";
import { searchMember } from "@/lib/features/member";

// バックエンドの1ページあたりの件数と合わせる
const PAGE_SIZE = 20;

const MembersClient = () => {
  const [name, setName] = useQueryState("name");
  const [grade, setGrade] = useQueryState("grade", parseAsInteger);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const members = useQuery({
    queryFn: async () => {
      return await searchMember({
        grades: grade ? [grade] : [],
        name: name ?? undefined,
        page,
        positions: [],
      });
    },
    queryKey: ["members", page, name, grade],
  });

  const clear = () => {
    setName(null);
    setGrade(null);
    setPage(null);
  };

  return (
    <>
      <section
        aria-label="絞り込み"
        className="flex flex-col gap-5 border-2 border-brand-black bg-white/50 p-4 md:flex-row-reverse md:flex-wrap md:items-end md:justify-between md:gap-6 md:p-6"
      >
        <SearchField
          key={name ?? ""}
          id="member-name"
          label="NAME"
          placeholder="名前で検索"
          defaultValue={name ?? ""}
          onSubmit={(value) => {
            setName(value || null);
            setPage(null);
          }}
        />
        <FilterChips
          label="GRADE"
          options={[
            { label: "すべて", value: null },
            ...[1, 2, 3, 4].map((g) => ({ label: `${g}年`, value: g })),
          ]}
          value={grade}
          onChange={(value) => {
            setGrade(value);
            setPage(null);
          }}
        />
      </section>

      {members.isLoading ? (
        <div role="status" aria-label="読み込み中" className="grid grid-cols-2 gap-2 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-36 animate-pulse border-2 border-brand-black bg-brand-black/10 md:h-44"></div>
          ))}
        </div>
      ) : members.error ? (
        <ErrorPanel
          command="codemates members --list"
          message="メンバーを読み込めませんでした"
          onRetry={() => members.refetch()}
        />
      ) : (members.data ?? []).length === 0 ? (
        <EmptyPanel
          unit="MEMBERS"
          message={name ? `「${name}」に一致するメンバーは見つかりませんでした` : "該当するメンバーはいません"}
          onClear={name || grade ? clear : undefined}
        />
      ) : (
        <section aria-label="メンバー" className="grid grid-cols-2 gap-2 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {[...(members.data ?? [])]
            .sort((a, b) => a.id - b.id)
            .map((m) => (
              <Member grade={m.grade} id={m.id} name={m.name} position={m.position} key={m.id} />
            ))}
        </section>
      )}

      <Pagination
        page={page}
        hasNext={(members.data?.length ?? 0) >= PAGE_SIZE}
        onChange={(p) => setPage(p === 1 ? null : p)}
      />
    </>
  );
};

export default MembersClient;
