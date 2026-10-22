"use client";

import {
  ActiveFilters,
  ActiveTag,
  AdminCard,
  cellClass,
  controlClass,
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
} from "@/components/admin/AdminParts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemberDetail, useMembers } from "@/hooks/member";
import { useInfiniteTechnologies } from "@/hooks/technology";
import useDebounce from "@/hooks/useDebounce";
import { createMember, updateMember } from "@/lib/features/member";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

// バックエンドの PAGE_SIZE と合わせる
const PAGE_SIZE = 20;
const GRADES = [1, 2, 3, 4];
const POSITIONS = ["代表", "副代表", "会計","レク班長","企画班長","教育班長"];

type Form = {
  name: string;
  studentId: string;
  email: string;
  grade: string;
  position: string;
  password: string;
  technologyIds: number[];
};
type Errors = Partial<Record<"name" | "studentId" | "email" | "password", string>>;

const BLANK: Form = { name: "", studentId: "", email: "", grade: "1", position: "", password: "", technologyIds: [] };

const validate = (form: Form, isCreate: boolean) => {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "名前を入力してください";
  else if (form.name.length > 50) errors.name = "50文字以内で入力してください";
  if (!/^[0-9]{2}[A-Z][0-9]{4}$/.test(form.studentId)) errors.studentId = "12A3456 の形式で入力してください";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = "メールアドレスの形式が正しくありません";
  if (isCreate && (form.password.length < 10 || form.password.length > 72))
    errors.password = "10〜72文字で入力してください";
  return errors;
};

// 技術の選択チップ
const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center rounded-full border border-input px-3.5 outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50",
        on && "border-primary bg-primary/14 font-semibold text-primary hover:bg-primary/20 dark:border-orange-400 dark:text-orange-400",
      )}
    >
      {children}
    </button>
  );
};

const MemberRow = ({
  id,
  name,
  grade,
  position,
  onEdit,
}: {
  id: number;
  name: string;
  grade: number;
  position: string | null;
  onEdit: (id: number, form: Form) => void;
}) => {
  const detail = useMemberDetail({ id });
  const technologies = detail.data?.technologies ?? [];

  return (
    <TableRow>
      <TableCell className={`${cellClass} font-semibold`}>{name}</TableCell>
      <TableCell className={cellClass}>{grade}年</TableCell>
      <TableCell className={cellClass}>
        {position ? <Badge className={primaryBadgeClass}>{position}</Badge> : <span className="text-muted-foreground">—</span>}
      </TableCell>
      <TableCell className={cellClass}>
        <div className="flex flex-wrap gap-1">
          {detail.isLoading ? (
            <Spinner />
          ) : technologies.length > 0 ? (
            technologies.map((t) => (
              <Badge key={t.id} variant={"secondary"}>
                {t.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      </TableCell>
      <TableCell className={cellClass}>
        <RowActions
          name={name}
          onEdit={() =>
            onEdit(id, {
              ...BLANK,
              name,
              grade: String(grade),
              position: position ?? "",
              technologyIds: technologies.map((t) => t.id),
            })
          }
        />
      </TableCell>
    </TableRow>
  );
};

const MemberClient = () => {
  const queryClient = useQueryClient();
  const [q, setQ] = useQueryState("q", { defaultValue: "" });
  const [grade, setGrade] = useQueryState("grade", parseAsInteger);
  const [position, setPosition] = useQueryState("position");
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const debouncedQ = useDebounce(q.trim(), 500);
  const members = useMembers({
    name: debouncedQ || undefined,
    grades: grade ? [grade] : undefined,
    positions: position ? [position] : undefined,
    page,
  });
  const rows = members.data ?? [];
  const technologies = useInfiniteTechnologies({});
  const allTechnologies = technologies.data?.pages.flat(1) ?? [];

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(BLANK);
  const [errors, setErrors] = useState<Errors>({});

  const openForm = (id: number | null, initial: Form = BLANK) => {
    setEditingId(id);
    setForm(initial);
    setErrors({});
    setFormOpen(true);
  };

  const save = useMutation({
    mutationFn: async (f: Form) => {
      const base = { name: f.name.trim(), studentId: f.studentId, email: f.email, grade: Number(f.grade) };
      if (editingId) {
        await updateMember({ id: editingId, ...base, position: f.position || null, technologyIds: f.technologyIds });
      } else {
        await createMember({ ...base, password: f.password });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["searchMember"] });
      if (editingId) queryClient.invalidateQueries({ queryKey: ["memberDetail", editingId] });
      setFormOpen(false);
      toast.success(editingId ? "変更を保存しました" : "メンバーを追加しました");
    },
    onError: () => {
      toast.error("保存できませんでした。もう一度お試しください。");
    },
  });

  // 条件を変えたら1ページ目に戻す
  const filter = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(null);
  };
  const clearAll = () => {
    setQ(null);
    setGrade(null);
    setPosition(null);
    setPage(null);
  };
  const tags: ActiveTag[] = [];
  if (q.trim()) tags.push({ label: `「${q.trim()}」`, aria: "キーワードを外す", onClear: () => filter(setQ)(null) });
  if (grade) tags.push({ label: `${grade}年`, aria: "学年を外す", onClear: () => filter(setGrade)(null) });
  if (position) tags.push({ label: position, aria: "役職を外す", onClear: () => filter(setPosition)(null) });

  const hasNext = rows.length === PAGE_SIZE;
  const isCreate = editingId === null;

  return (
    <>
      <PageHead
        number="01"
        label="Members"
        title="メンバー"
        description="条件を絞って検索し、メンバーの追加・編集ができます。"
        action={
          <Button className="h-11 gap-2 px-4" onClick={() => openForm(null)}>
            <Plus className="size-4.5" aria-hidden />
            メンバーを追加
          </Button>
        }
      />

      <AdminCard aria-label="検索条件" className="flex flex-col gap-4 p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Field className="gap-1.5 md:col-span-2">
            <FieldLabel htmlFor="q">キーワード</FieldLabel>
            <SearchInput id="q" placeholder="名前" value={q} onChange={(e) => filter(setQ)(e.target.value || null)} />
          </Field>
          <Field className="gap-1.5">
            <FieldLabel htmlFor="grade">学年</FieldLabel>
            <NativeSelect
              id="grade"
              className={selectClass}
              value={grade ?? ""}
              onChange={(e) => filter(setGrade)(e.target.value ? Number(e.target.value) : null)}
            >
              <NativeSelectOption value="">すべて</NativeSelectOption>
              {GRADES.map((g) => (
                <NativeSelectOption key={g} value={g}>
                  {g}年
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field className="gap-1.5">
            <FieldLabel htmlFor="position">役職</FieldLabel>
            <NativeSelect
              id="position"
              className={selectClass}
              value={position ?? ""}
              onChange={(e) => filter(setPosition)(e.target.value || null)}
            >
              <NativeSelectOption value="">すべて</NativeSelectOption>
              {POSITIONS.map((p) => (
                <NativeSelectOption key={p} value={p}>
                  {p}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
        </div>
        <ActiveFilters tags={tags} onClearAll={clearAll} />
      </AdminCard>

      <AdminCard aria-label="メンバー一覧">
        <Table className={`min-w-190 ${tableClass}`}>
          <TableHeader>
            <TableRow className={headRowClass}>
              <TableHead className={`${headCellClass} w-[26%] rounded-tl-xl`}>名前</TableHead>
              <TableHead className={`${headCellClass} w-20`}>学年</TableHead>
              <TableHead className={`${headCellClass} w-28`}>役職</TableHead>
              <TableHead className={headCellClass}>使える技術</TableHead>
              <TableHead className={`${headCellClass} w-24 rounded-tr-xl text-right`}>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((member) => (
              <MemberRow key={member.id} {...member} onEdit={openForm} />
            ))}
          </TableBody>
        </Table>
        {members.isLoading && (
          <div className="flex justify-center border-t border-border py-10">
            <Spinner />
          </div>
        )}
        {members.isFetched && rows.length === 0 && (
          <EmptyRows
            title="条件に合うメンバーがいません"
            description="条件を変えるか、クリアして探し直してください。"
            action={
              <Button variant={"outline"} className="h-11 px-4" onClick={clearAll}>
                条件をクリア
              </Button>
            }
          />
        )}
        <ListFoot>
          <span className="text-sm">
            <b className="font-bold text-foreground">{rows.length}</b> 人を表示
          </span>
          {page > 1 || hasNext ? (
            <nav aria-label="ページ" className="flex items-center gap-1">
              <Button variant={"ghost"} size={"icon"} className="size-11" aria-label="前のページ" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="size-4.5" />
              </Button>
              <span aria-current="page" className="min-w-8 text-center font-mono font-bold text-foreground">
                {page}
              </span>
              <Button variant={"ghost"} size={"icon"} className="size-11" aria-label="次のページ" disabled={!hasNext} onClick={() => setPage(page + 1)}>
                <ChevronRight className="size-4.5" />
              </Button>
            </nav>
          ) : (
            <span className="font-mono">GET /api/members</span>
          )}
        </ListFoot>
      </AdminCard>

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={isCreate ? "メンバーを追加" : "メンバーを編集"}
        description={isCreate ? "新しいメンバーのアカウントを作成します。" : "登録内容を変更します。"}
        submitLabel={isCreate ? "追加する" : "保存する"}
        isPending={save.isPending}
        onSubmit={() => {
          const errs = validate(form, isCreate);
          setErrors(errs);
          if (Object.keys(errs).length === 0) save.mutate(form);
        }}
      >
        <Field className="gap-1.5" data-invalid={!!errors.name}>
          <FieldLabel htmlFor="fName">名前</FieldLabel>
          <Input
            id="fName"
            className={controlClass}
            aria-invalid={!!errors.name}
            placeholder="例）佐藤 陽菜"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <FieldError className="text-xs">{errors.name}</FieldError>}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field className="gap-1.5" data-invalid={!!errors.studentId}>
            <FieldLabel htmlFor="fSid">学籍番号</FieldLabel>
            <Input
              id="fSid"
              className={`${controlClass} font-mono`}
              aria-invalid={!!errors.studentId}
              placeholder="12A3456"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            />
            {errors.studentId ? (
              <FieldError className="text-xs">{errors.studentId}</FieldError>
            ) : (
              <FieldDescription className="text-xs">数字2桁・英大文字1字・数字4桁</FieldDescription>
            )}
          </Field>
          <Field className="gap-1.5" data-invalid={!!errors.email}>
            <FieldLabel htmlFor="fMail">メールアドレス</FieldLabel>
            <Input
              id="fMail"
              type="email"
              className={controlClass}
              aria-invalid={!!errors.email}
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <FieldError className="text-xs">{errors.email}</FieldError>}
          </Field>
        </div>
        {!isCreate && (
          // 一覧・詳細APIが学籍番号とメールアドレスを返さないため、編集時も入力してもらう
          <FieldDescription className="-mt-2 text-xs">
            学籍番号とメールアドレスは、変更しない場合も現在の値を入力してください。
          </FieldDescription>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field className="gap-1.5">
            <FieldLabel htmlFor="fGrade">学年</FieldLabel>
            <NativeSelect
              id="fGrade"
              className={selectClass}
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
            >
              {GRADES.map((g) => (
                <NativeSelectOption key={g} value={g}>
                  {g}年
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          {!isCreate && (
            <Field className="gap-1.5">
              <FieldLabel htmlFor="fPos">役職</FieldLabel>
              <NativeSelect
                id="fPos"
                className={selectClass}
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              >
                <NativeSelectOption value="">なし</NativeSelectOption>
                {POSITIONS.map((p) => (
                  <NativeSelectOption key={p} value={p}>
                    {p}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          )}
        </div>
        {!isCreate && (
          <Field className="gap-1.5">
            <FieldTitle id="fTechLabel">使える技術</FieldTitle>
            <div role="group" aria-labelledby="fTechLabel" className="flex flex-wrap gap-2">
              {allTechnologies.map((t) => {
                const on = form.technologyIds.includes(t.id);
                return (
                  <Chip
                    key={t.id}
                    on={on}
                    onClick={() =>
                      setForm({
                        ...form,
                        technologyIds: on ? form.technologyIds.filter((x) => x !== t.id) : [...form.technologyIds, t.id],
                      })
                    }
                  >
                    {t.name}
                  </Chip>
                );
              })}
            </div>
          </Field>
        )}
        {isCreate && (
          <Field className="gap-1.5" data-invalid={!!errors.password}>
            <FieldLabel htmlFor="fPw">初期パスワード</FieldLabel>
            <Input
              id="fPw"
              type="password"
              autoComplete="new-password"
              className={controlClass}
              aria-invalid={!!errors.password}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password ? (
              <FieldError className="text-xs">{errors.password}</FieldError>
            ) : (
              <FieldDescription className="text-xs">10〜72文字。本人に初回ログイン後の変更を案内してください。</FieldDescription>
            )}
          </Field>
        )}
      </FormDialog>
    </>
  );
};

export default MemberClient;
