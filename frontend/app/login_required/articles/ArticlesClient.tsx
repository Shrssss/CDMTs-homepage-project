"use client";

import {
  AdminCard,
  cellClass,
  controlClass,
  DeleteDialog,
  EmptyRows,
  FormDialog,
  headCellClass,
  tableClass,
  headRowClass,
  ListFoot,
  PageHead,
  primaryBadgeClass,
  RowActions,
  selectClass,
  Warn,
} from "@/components/admin/AdminParts";
import { Thumbnail } from "@/components/News";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useInfiniteAllNews } from "@/hooks/news";
import {
  createNews,
  deleteNews,
  getNewsDetail,
  NEWS_CATEGORIES,
  updateIsPublishedById,
  updateNews,
  uploadThumbnail,
} from "@/lib/features/news";
import { cn } from "@/lib/utils";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, EyeOff, Plus, Upload } from "lucide-react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

type Form = {
  title: string;
  category: string;
  content: string;
  thumbnailPath: string | null;
  isPublished: boolean;
};
type Errors = Partial<Record<"title" | "content", string>>;

const BLANK: Form = {
  title: "",
  category: NEWS_CATEGORIES[0],
  content: "",
  thumbnailPath: null,
  isPublished: false,
};

const SORTS = ["new", "old", "updated"] as const;
const STATUSES = ["published", "draft"] as const;
type Status = (typeof STATUSES)[number];

const validate = (form: Form) => {
  const errors: Errors = {};
  const title = form.title.trim();
  if (!title) errors.title = "タイトルを入力してください";
  else if (title.length > 100) errors.title = "100文字以内で入力してください";
  if (form.isPublished && !form.content.trim()) errors.content = "公開するには本文が必要です";
  return errors;
};

const formatDate = (date: Date) => format(date, "yyyy.MM.dd");

// 公開状態のバッジ（色だけに頼らないよう点と文字を添える）
const StatusBadge = ({ isPublished }: { isPublished: boolean }) => {
  return isPublished ? (
    <Badge className="gap-1.5 bg-green-600/15 text-green-700 dark:text-green-400">
      <span aria-hidden className="size-2 rounded-full bg-current" />
      公開中
    </Badge>
  ) : (
    <Badge variant={"secondary"} className="gap-1.5">
      <span aria-hidden className="size-2 rounded-full bg-current" />
      下書き
    </Badge>
  );
};

const ArticlesClient = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useQueryState("status", parseAsStringLiteral(STATUSES));
  const [sort, setSort] = useQueryState("sort", parseAsStringLiteral(SORTS).withDefault("new"));
  // 管理画面では非公開（下書き）の記事も含めて取得する
  const news = useInfiniteAllNews();
  const list = news.data?.pages.flat(1) ?? [];

  // 本文と更新日は詳細APIにしかないので、行ごとに取得する
  const details = useQueries({
    queries: list.map((n) => ({
      queryKey: ["news-detail", n.id],
      queryFn: () => getNewsDetail({ id: n.id }),
    })),
  });
  const articles = list.map((n, i) => ({ ...n, detail: details[i]?.data }));

  const counts = {
    all: articles.length,
    published: articles.filter((a) => a.isPublished).length,
    draft: articles.filter((a) => !a.isPublished).length,
  };
  const rows = articles
    .filter((a) => (status === "published" ? a.isPublished : status === "draft" ? !a.isPublished : true))
    .sort((a, b) => {
      if (sort === "updated") {
        return (b.detail?.updatedAt.getTime() ?? 0) - (a.detail?.updatedAt.getTime() ?? 0);
      }
      const diff = b.createdAt.getTime() - a.createdAt.getTime();
      return sort === "old" ? -diff : diff;
    });

  // 作成・編集ダイアログ（editingId が null なら作成）
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(BLANK);
  const [errors, setErrors] = useState<Errors>({});
  const [tab, setTab] = useState("edit");
  const [deleting, setDeleting] = useState<{ id: number; title: string; isPublished: boolean } | null>(null);

  const openForm = (id: number | null, initial: Form = BLANK, initialErrors: Errors = {}) => {
    setEditingId(id);
    setForm(initial);
    setErrors(initialErrors);
    setTab("edit");
    setFormOpen(true);
  };

  const invalidate = (id?: number) => {
    queryClient.invalidateQueries({ queryKey: ["infiniteAllNews"] });
    queryClient.invalidateQueries({ queryKey: ["infiniteNews"] });
    queryClient.invalidateQueries({ queryKey: ["news"] });
    if (id) queryClient.invalidateQueries({ queryKey: ["news-detail", id] });
  };

  const save = useMutation({
    mutationFn: async (f: Form) => {
      const request = { ...f, title: f.title.trim() };
      if (editingId) {
        await updateNews({ id: editingId, request: { id: editingId, ...request } });
      } else {
        await createNews(request);
      }
    },
    onSuccess: (_, f) => {
      invalidate(editingId ?? undefined);
      setFormOpen(false);
      toast.success(f.isPublished ? "記事を公開しました" : "下書きを保存しました");
    },
    onError: () => {
      toast.error("保存できませんでした。もう一度お試しください。");
    },
  });

  const submit = (isPublished: boolean) => {
    const f = { ...form, isPublished };
    const errs = validate(f);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setTab("edit");
      return;
    }
    save.mutate(f);
  };

  const publish = useMutation({
    mutationFn: updateIsPublishedById,
    onSuccess: (_, { id, isPublished }) => {
      invalidate(id);
      setDeleting(null);
      toast.success(isPublished ? "記事を公開しました" : "記事を非公開にしました");
    },
    onError: () => {
      toast.error("公開状態を変更できませんでした。もう一度お試しください。");
    },
  });

  const remove = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      invalidate();
      setDeleting(null);
      toast.success("記事を削除しました");
    },
    onError: () => {
      toast.error("削除できませんでした。もう一度お試しください。");
    },
  });

  const upload = useMutation({
    mutationFn: uploadThumbnail,
    onSuccess: (thumbnailPath) => {
      setForm((f) => ({ ...f, thumbnailPath }));
    },
    onError: () => {
      toast.error("画像をアップロードできませんでした。");
    },
  });

  const statusChips: { label: string; value: Status | null; count: number }[] = [
    { label: "すべて", value: null, count: counts.all },
    { label: "公開中", value: "published", count: counts.published },
    { label: "下書き", value: "draft", count: counts.draft },
  ];

  return (
    <>
      <PageHead
        number="04"
        label="Articles"
        title="記事"
        description="ホームページの活動報告・お知らせを書いて、公開・編集・削除できます。"
        action={
          <Button className="h-11 gap-2 px-4" onClick={() => openForm(null)}>
            <Plus className="size-4.5" aria-hidden />
            記事を書く
          </Button>
        }
      />

      <AdminCard aria-label="表示条件" className="flex flex-col gap-4 p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Field className="gap-1.5">
            <FieldLabel htmlFor="sort">並び順</FieldLabel>
            <NativeSelect
              id="sort"
              className={selectClass}
              value={sort}
              onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
            >
              <NativeSelectOption value="new">投稿日が新しい順</NativeSelectOption>
              <NativeSelectOption value="old">投稿日が古い順</NativeSelectOption>
              <NativeSelectOption value="updated">更新日が新しい順</NativeSelectOption>
            </NativeSelect>
          </Field>
        </div>
        <Field className="gap-1.5">
          <FieldTitle id="statusLabel">公開状態</FieldTitle>
          <div role="group" aria-labelledby="statusLabel" className="flex flex-wrap gap-2">
            {statusChips.map((chip) => {
              const selected = chip.value === status;
              return (
                <button
                  key={chip.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setStatus(chip.value)}
                  className={cn(
                    "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    selected
                      ? `${primaryBadgeClass} border-primary font-semibold dark:border-orange-400`
                      : "border-input hover:bg-accent",
                  )}
                >
                  {chip.label}
                  <span className="font-mono text-xs">{chip.count}</span>
                </button>
              );
            })}
          </div>
        </Field>
      </AdminCard>

      <AdminCard aria-label="記事一覧">
        <Table className={`min-w-250 ${tableClass}`}>
          <TableHeader>
            <TableRow className={headRowClass}>
              <TableHead className={`${headCellClass} rounded-tl-xl`}>タイトル</TableHead>
              <TableHead className={`${headCellClass} w-28`}>カテゴリ</TableHead>
              <TableHead className={`${headCellClass} w-26`}>状態</TableHead>
              <TableHead className={`${headCellClass} w-28`}>投稿日</TableHead>
              <TableHead className={`${headCellClass} w-28`}>更新日</TableHead>
              <TableHead className={`${headCellClass} w-40 rounded-tr-xl text-right`}>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((article) => {
              const { detail } = article;
              const excerpt = detail?.content.replace(/\s+/g, " ").trim();
              const toggleLabel = article.isPublished
                ? `${article.title}を非公開にする`
                : `${article.title}を公開する`;
              const toEdit = (): Form | undefined =>
                detail && {
                  title: detail.title,
                  category: detail.category,
                  content: detail.content,
                  thumbnailPath: detail.thumbnailPath,
                  isPublished: detail.isPublished,
                };
              return (
                <TableRow key={article.id}>
                  <TableCell className={cellClass}>
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div className="h-13.5 w-24 flex-none overflow-hidden rounded-md border border-border [&>div]:bg-muted [&>div]:text-[10px] [&>div]:text-muted-foreground">
                        <Thumbnail src={article.thumbnailPath} alt="" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold">{article.title}</div>
                        <div className="line-clamp-1 text-xs break-all text-muted-foreground">
                          {!detail ? <Spinner className="size-3" /> : excerpt || "本文はまだありません"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={cellClass}>
                    <Badge variant={"outline"}>{article.category}</Badge>
                  </TableCell>
                  <TableCell className={cellClass}>
                    <StatusBadge isPublished={article.isPublished} />
                  </TableCell>
                  <TableCell className={`${cellClass} font-mono`}>{formatDate(article.createdAt)}</TableCell>
                  <TableCell className={`${cellClass} font-mono text-muted-foreground`}>
                    {detail ? formatDate(detail.updatedAt) : "—"}
                  </TableCell>
                  <TableCell className={cellClass}>
                    <RowActions
                      name={article.title}
                      onEdit={() => {
                        const initial = toEdit();
                        if (initial) openForm(article.id, initial);
                      }}
                      onDelete={() => setDeleting(article)}
                    >
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="size-11"
                        aria-label={toggleLabel}
                        title={toggleLabel}
                        disabled={!detail || publish.isPending}
                        onClick={() => {
                          // 本文のない下書きは公開できないので、編集画面で本文を書いてもらう
                          const initial = toEdit();
                          if (!article.isPublished && initial && !initial.content.trim()) {
                            openForm(article.id, initial, { content: "公開するには本文が必要です" });
                            return;
                          }
                          publish.mutate({ id: article.id, isPublished: !article.isPublished });
                        }}
                      >
                        {article.isPublished ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                      </Button>
                    </RowActions>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {news.isLoading && (
          <div className="flex justify-center border-t border-border py-10">
            <Spinner />
          </div>
        )}
        {news.isFetched && rows.length === 0 && (
          <EmptyRows
            title="条件に合う記事がありません"
            description="条件を変えるか、新しく記事を書いてください。"
            action={
              <Button variant={"outline"} className="h-11 px-4" onClick={() => setStatus(null)}>
                条件をクリア
              </Button>
            }
          />
        )}
        <ListFoot>
          <span className="text-sm">
            <b className="font-bold text-foreground">{counts.all}</b> 件中{" "}
            <b className="font-bold text-foreground">{rows.length}</b> 件を表示
          </span>
          {news.hasNextPage ? (
            <Button
              variant={"outline"}
              className="h-11 px-4"
              disabled={news.isFetchingNextPage}
              onClick={() => news.fetchNextPage()}
            >
              {news.isFetchingNextPage ? <Spinner /> : "さらに読み込み"}
            </Button>
          ) : (
            <span className="font-mono">GET /api/news/allNews</span>
          )}
        </ListFoot>
      </AdminCard>

      <FormDialog
        wide
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingId ? "記事を編集" : "記事を書く"}
        description={
          !editingId
            ? "下書きで保存しておき、あとから公開することもできます。"
            : form.isPublished
              ? "公開中の記事です。保存するとすぐに反映されます。"
              : "下書きの記事です。"
        }
        submitLabel=""
        isPending={save.isPending}
        onSubmit={() => submit(form.isPublished)}
        actions={
          form.isPublished ? (
            <Button type="submit" className="h-11 px-4" disabled={save.isPending || upload.isPending}>
              {save.isPending ? "保存中..." : editingId ? "保存して反映" : "公開する"}
            </Button>
          ) : (
            <>
              <Button
                type="submit"
                variant={"outline"}
                className="h-11 px-4"
                disabled={save.isPending || upload.isPending}
              >
                下書き保存
              </Button>
              <Button
                type="button"
                className="h-11 px-4"
                disabled={save.isPending || upload.isPending}
                onClick={() => submit(true)}
              >
                {save.isPending ? "保存中..." : "保存して公開"}
              </Button>
            </>
          )
        }
      >
        <Field className="gap-1.5" data-invalid={!!errors.title}>
          <FieldLabel htmlFor="fTitle">タイトル</FieldLabel>
          <Input
            id="fTitle"
            className={controlClass}
            aria-invalid={!!errors.title}
            placeholder="例）秋のハッカソンを開催しました"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="flex gap-2">
            {errors.title && <FieldError className="text-xs">{errors.title}</FieldError>}
            <span className="ml-auto text-xs text-muted-foreground">{form.title.length} / 100</span>
          </div>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field className="gap-1.5">
            <FieldLabel htmlFor="fCategory">カテゴリ</FieldLabel>
            <NativeSelect
              id="fCategory"
              className={selectClass}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {NEWS_CATEGORIES.map((c) => (
                <NativeSelectOption key={c} value={c}>
                  {c}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field className="gap-1.5">
            <FieldTitle id="publishLabel">公開状態</FieldTitle>
            <div
              role="radiogroup"
              aria-labelledby="publishLabel"
              className="inline-flex w-fit overflow-hidden rounded-lg border border-input"
            >
              {[
                { label: "下書き", value: false },
                { label: "公開", value: true },
              ].map((option) => (
                <label
                  key={option.label}
                  className="flex min-h-11 cursor-pointer items-center gap-2 px-3.5 not-first:border-l not-first:border-input has-checked:bg-accent"
                >
                  <input
                    type="radio"
                    name="isPublished"
                    className="accent-primary"
                    checked={form.isPublished === option.value}
                    onChange={() => setForm({ ...form, isPublished: option.value })}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </Field>
        </div>
        <Field className="gap-1.5">
          <FieldTitle>サムネイル</FieldTitle>
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-input p-3">
            <div className="h-22.5 w-40 flex-none overflow-hidden rounded-md border border-border [&>div]:bg-muted [&>div]:text-muted-foreground">
              {upload.isPending ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <Thumbnail src={form.thumbnailPath} alt={form.thumbnailPath ? "サムネイルのプレビュー" : ""} />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <Button asChild variant={"outline"} className="h-11 gap-2 px-4">
                  <label htmlFor="fThumbnail" className="cursor-pointer">
                    <Upload className="size-4.5" aria-hidden />
                    画像を選択
                  </label>
                </Button>
                <input
                  id="fThumbnail"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) upload.mutate(file);
                    e.target.value = "";
                  }}
                />
                {form.thumbnailPath && (
                  <Button
                    type="button"
                    variant={"ghost"}
                    className="h-11 px-4"
                    onClick={() => setForm({ ...form, thumbnailPath: null })}
                  >
                    画像を外す
                  </Button>
                )}
              </div>
              <FieldDescription className="text-xs">
                16:9 推奨・JPG / PNG / WebP。なしでも公開できます（NO IMAGE 表示）。
              </FieldDescription>
            </div>
          </div>
        </Field>
        <Field className="gap-1.5" data-invalid={!!errors.content}>
          <Tabs value={tab} onValueChange={setTab} className="gap-1.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <FieldLabel htmlFor="fContent">本文</FieldLabel>
              <TabsList aria-label="本文の表示" className="h-auto rounded-lg p-1 group-data-horizontal/tabs:h-auto">
                <TabsTrigger value="edit" className="min-h-9 px-3.5">
                  編集
                </TabsTrigger>
                <TabsTrigger value="preview" className="min-h-9 px-3.5">
                  プレビュー
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="edit">
              <Textarea
                id="fContent"
                className="min-h-60 rounded-lg px-3 py-2.5"
                aria-invalid={!!errors.content}
                placeholder="活動の様子、参加人数、次回の予定など"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="min-h-60 rounded-lg border border-border p-4 text-[15px] leading-6 whitespace-pre-wrap">
                <h3 className="mb-2 text-xl font-bold">{form.title || "（タイトル未入力）"}</h3>
                {form.content || "（本文未入力）"}
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex gap-2">
            {errors.content && <FieldError className="text-xs">{errors.content}</FieldError>}
            <span className="ml-auto text-xs text-muted-foreground">{form.content.length} 文字</span>
          </div>
        </Field>
      </FormDialog>

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="記事を削除しますか？"
        isPending={remove.isPending}
        onConfirm={() => deleting && remove.mutate({ id: deleting.id })}
        extraAction={
          deleting?.isPublished && (
            <Button
              variant={"outline"}
              className="h-11 px-4"
              disabled={publish.isPending}
              onClick={() => publish.mutate({ id: deleting.id, isPublished: false })}
            >
              非公開にする
            </Button>
          )
        }
      >
        <p className="font-bold">{deleting?.title}</p>
        {deleting?.isPublished && (
          <Warn>
            この記事は<b>公開中</b>です。削除するとホームページから見えなくなり、共有されたリンクも開けなくなります。残しておくなら「非公開にする」を選んでください。
          </Warn>
        )}
      </DeleteDialog>
    </>
  );
};

export default ArticlesClient;
