"use client";

import {
  ActiveFilters,
  ActiveTag,
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
  SearchInput,
  selectClass,
  Warn,
} from "@/components/admin/AdminParts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useInfiniteTechnologies, useSkilledMember, useTechnologyDetail } from "@/hooks/technology";
import useDebounce from "@/hooks/useDebounce";
import { createTechnology, deleteTechnology, updateTechnology } from "@/lib/features/technologies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

type Technology = { id: number; name: string; description: string };
type Form = { name: string; description: string };
type Errors = Partial<Record<keyof Form, string>>;

const SORTS = ["name", "new"] as const;

const validate = (form: Form) => {
  const errors: Errors = {};
  const name = form.name.trim();
  if (!name) errors.name = "技術名を入力してください";
  else if (name.length > 50) errors.name = "50文字以内で入力してください";
  if (!form.description.trim()) errors.description = "説明を入力してください";
  else if (form.description.length > 255) errors.description = "255文字以内で入力してください";
  return errors;
};

const TechnologyRow = ({
  id,
  name,
  onEdit,
  onDelete,
}: {
  id: number;
  name: string;
  onEdit: (technology: Technology) => void;
  onDelete: (technology: Technology, members: number) => void;
}) => {
  const detail = useTechnologyDetail({ id });
  const skilled = useSkilledMember({ id });
  const description = detail.data?.description ?? "";
  const members = skilled.data?.length ?? 0;

  return (
    <TableRow>
      <TableCell className={`${cellClass} font-semibold`}>{name}</TableCell>
      <TableCell className={`${cellClass} text-muted-foreground`}>
        {detail.isLoading ? <Spinner /> : description}
      </TableCell>
      <TableCell className={cellClass}>
        {skilled.isLoading ? (
          <Spinner />
        ) : members > 0 ? (
          <Badge className={primaryBadgeClass}>{members}人</Badge>
        ) : (
          <Badge variant={"outline"}>0人</Badge>
        )}
      </TableCell>
      <TableCell className={cellClass}>
        <RowActions
          name={name}
          onEdit={() => onEdit({ id, name, description })}
          onDelete={() => onDelete({ id, name, description }, members)}
        />
      </TableCell>
    </TableRow>
  );
};

const TechnologiesClient = () => {
  const queryClient = useQueryClient();
  const [q, setQ] = useQueryState("q", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", parseAsStringLiteral(SORTS).withDefault("name"));
  const debouncedQ = useDebounce(q.trim(), 500);
  const technologies = useInfiniteTechnologies({ name: debouncedQ || undefined });

  const rows = [...(technologies.data?.pages.flat(1) ?? [])].sort((a, b) =>
    sort === "name" ? a.name.localeCompare(b.name) : b.id - a.id,
  );

  // 作成・編集ダイアログ（editing が null なら作成）
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Technology | null>(null);
  const [form, setForm] = useState<Form>({ name: "", description: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [deleting, setDeleting] = useState<(Technology & { members: number }) | null>(null);

  const openForm = (technology: Technology | null) => {
    setEditing(technology);
    setForm(technology ? { name: technology.name, description: technology.description } : { name: "", description: "" });
    setErrors({});
    setFormOpen(true);
  };

  const invalidate = (id?: number) => {
    queryClient.invalidateQueries({ queryKey: ["infiniteTechnologies"] });
    if (id) queryClient.invalidateQueries({ queryKey: ["technologyDetail", id] });
  };

  const save = useMutation({
    mutationFn: async (request: Form) => {
      const body = { name: request.name.trim(), description: request.description.trim() };
      if (editing) {
        await updateTechnology({ id: editing.id, request: { id: editing.id, ...body } });
      } else {
        await createTechnology(body);
      }
    },
    onSuccess: () => {
      invalidate(editing?.id);
      setFormOpen(false);
      toast.success(editing ? "変更を保存しました" : "技術を追加しました");
    },
    onError: () => {
      toast.error("保存できませんでした。もう一度お試しください。");
    },
  });

  const remove = useMutation({
    mutationFn: deleteTechnology,
    onSuccess: () => {
      invalidate();
      setDeleting(null);
      toast.success("技術を削除しました");
    },
    onError: () => {
      toast.error("削除できませんでした。もう一度お試しください。");
    },
  });

  const tags: ActiveTag[] = [];
  if (q.trim()) tags.push({ label: `「${q.trim()}」`, aria: "キーワードを外す", onClear: () => setQ(null) });

  const createButton = (
    <Button className="h-11 gap-2 px-4" onClick={() => openForm(null)}>
      <Plus className="size-4.5" aria-hidden />
      技術を追加
    </Button>
  );

  return (
    <>
      <PageHead
        number="02"
        label="Technologies"
        title="技術"
        description="サークルで扱う技術を検索・追加・編集・削除できます。"
        action={createButton}
      />

      <AdminCard aria-label="検索条件" className="flex flex-col gap-4 p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Field className="gap-1.5 md:col-span-2">
            <FieldLabel htmlFor="q">キーワード</FieldLabel>
            <SearchInput
              id="q"
              placeholder="技術名"
              value={q}
              onChange={(e) => setQ(e.target.value || null)}
            />
          </Field>
          <Field className="gap-1.5">
            <FieldLabel htmlFor="sort">並び順</FieldLabel>
            <NativeSelect
              id="sort"
              className={selectClass}
              value={sort}
              onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
            >
              <NativeSelectOption value="name">名前順</NativeSelectOption>
              <NativeSelectOption value="new">新しく追加した順</NativeSelectOption>
            </NativeSelect>
          </Field>
        </div>
        <ActiveFilters tags={tags} onClearAll={() => setQ(null)} />
      </AdminCard>

      <AdminCard aria-label="技術一覧">
        <Table className={`min-w-190 ${tableClass}`}>
          <TableHeader>
            <TableRow className={headRowClass}>
              <TableHead className={`${headCellClass} w-[22%] rounded-tl-xl`}>技術名</TableHead>
              <TableHead className={headCellClass}>説明</TableHead>
              <TableHead className={`${headCellClass} w-28`}>使っている人</TableHead>
              <TableHead className={`${headCellClass} w-28 rounded-tr-xl text-right`}>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((technology) => (
              <TechnologyRow
                key={technology.id}
                id={technology.id}
                name={technology.name}
                onEdit={openForm}
                onDelete={(t, members) => setDeleting({ ...t, members })}
              />
            ))}
          </TableBody>
        </Table>
        {technologies.isLoading && (
          <div className="flex justify-center border-t border-border py-10">
            <Spinner />
          </div>
        )}
        {technologies.isFetched && rows.length === 0 && (
          <EmptyRows
            title="条件に合う技術がありません"
            description="見つからない技術は、そのまま追加できます。"
            action={
              <Button variant={"outline"} className="h-11 px-4" onClick={() => openForm(null)}>
                技術を追加
              </Button>
            }
          />
        )}
        <ListFoot>
          <span className="text-sm">
            <b className="font-bold text-foreground">{rows.length}</b> 件を表示
          </span>
          {technologies.hasNextPage ? (
            <Button
              variant={"outline"}
              className="h-11 px-4"
              disabled={technologies.isFetchingNextPage}
              onClick={() => technologies.fetchNextPage()}
            >
              {technologies.isFetchingNextPage ? <Spinner /> : "さらに読み込み"}
            </Button>
          ) : (
            <span className="font-mono">GET /api/technologies</span>
          )}
        </ListFoot>
      </AdminCard>

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editing ? "技術を編集" : "技術を追加"}
        description={editing ? "名前と説明を変更します。" : "メンバーが「使える技術」として選べるようになります。"}
        submitLabel={editing ? "保存する" : "追加する"}
        isPending={save.isPending}
        onSubmit={() => {
          const errs = validate(form);
          setErrors(errs);
          if (Object.keys(errs).length === 0) save.mutate(form);
        }}
      >
        <Field className="gap-1.5" data-invalid={!!errors.name}>
          <FieldLabel htmlFor="fName">技術名</FieldLabel>
          <Input
            id="fName"
            className={controlClass}
            aria-invalid={!!errors.name}
            placeholder="例）Next.js"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name ? (
            <FieldError className="text-xs">{errors.name}</FieldError>
          ) : (
            <FieldDescription className="text-xs">50文字以内。同じ名前の技術は登録できません。</FieldDescription>
          )}
        </Field>
        <Field className="gap-1.5" data-invalid={!!errors.description}>
          <FieldLabel htmlFor="fDesc">説明</FieldLabel>
          <Textarea
            id="fDesc"
            className="min-h-22 rounded-lg px-3 py-2.5"
            aria-invalid={!!errors.description}
            placeholder="どんな技術か、サークルでの使いどころ"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-2">
            {errors.description && <FieldError className="text-xs">{errors.description}</FieldError>}
            <span className="ml-auto text-xs text-muted-foreground">{form.description.length} / 255</span>
          </div>
        </Field>
      </FormDialog>

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`「${deleting?.name ?? ""}」を削除しますか？`}
        isPending={remove.isPending}
        onConfirm={() => deleting && remove.mutate({ id: deleting.id })}
      >
        {deleting && deleting.members > 0 ? (
          <Warn>
            <b>{deleting.members}人</b>のメンバーがこの技術を登録しています。削除すると、そのメンバーからも外れます。
          </Warn>
        ) : (
          <p className="text-muted-foreground">この技術を登録しているメンバーはいません。</p>
        )}
      </DeleteDialog>
    </>
  );
};

export default TechnologiesClient;
