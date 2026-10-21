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
} from "@/components/admin/AdminParts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useInfiniteItems, useItemDetail } from "@/hooks/item";
import { createItem, ItemCreateRequest, updateItem } from "@/lib/features/items";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

type Form = Omit<ItemCreateRequest, "quantity"> & { quantity: string };
type Errors = Partial<Record<"name" | "storageLocation" | "quantity", string>>;

const BLANK: Form = {
  name: "",
  description: "",
  storageLocation: "",
  quantity: "1",
  isRentable: true,
  isDisposable: false,
};

const validate = (form: Form) => {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "名前を入力してください";
  if (!form.storageLocation.trim()) errors.storageLocation = "保管場所を入力してください";
  if (!/^[0-9]+$/.test(form.quantity)) errors.quantity = "0以上の整数で入力してください";
  return errors;
};

const CheckField = ({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <div className="flex min-h-11 items-center gap-2.5">
      <Checkbox id={id} className="size-4.5" checked={checked} onCheckedChange={(c) => onChange(c === true)} />
      <Label htmlFor={id} className="cursor-pointer font-normal">
        {label}
      </Label>
    </div>
  );
};

const ItemRow = ({
  id,
  name,
  storageLocation,
  isRentable,
  isDisposable,
  onEdit,
}: {
  id: number;
  name: string;
  storageLocation: string;
  isRentable: boolean;
  isDisposable: boolean;
  onEdit: (id: number, form: Form) => void;
}) => {
  const detail = useItemDetail({ id });
  // 貸出可能でも消耗品でもない備品は、誰かが借りている
  const onLoan = !isRentable && !isDisposable;

  return (
    <TableRow>
      <TableCell className={cellClass}>
        <div className="font-semibold">{name}</div>
        <div className="text-xs break-all text-muted-foreground">
          {detail.isLoading ? <Spinner className="size-3" /> : detail.data?.description || "—"}
        </div>
      </TableCell>
      <TableCell className={cellClass}>{storageLocation}</TableCell>
      <TableCell className={`${cellClass} font-mono`}>{detail.data?.quantity ?? "—"}</TableCell>
      <TableCell className={cellClass}>
        <div className="flex flex-wrap gap-1">
          {isRentable && <Badge className={primaryBadgeClass}>貸出可能</Badge>}
          {onLoan && <Badge variant={"outline"}>貸出中</Badge>}
          {isDisposable && <Badge variant={"secondary"}>消耗品</Badge>}
        </div>
      </TableCell>
      <TableCell className={cellClass}>
        <RowActions
          name={name}
          onEdit={() =>
            detail.data &&
            onEdit(id, {
              name: detail.data.name,
              description: detail.data.description,
              storageLocation: detail.data.storageLocation,
              quantity: String(detail.data.quantity),
              isRentable: detail.data.isRentable,
              isDisposable: detail.data.isDisposable,
            })
          }
        />
      </TableCell>
    </TableRow>
  );
};

const ItemsClient = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useQueryState("name", { defaultValue: "" });
  const [storageLocation, setStorageLocation] = useQueryState("storageLocation", { defaultValue: "" });
  const [isRentable, setIsRentable] = useQueryState("isRentable", parseAsBoolean.withDefault(false));
  const [isDisposable, setIsDisposable] = useQueryState("isDisposable", parseAsBoolean.withDefault(false));
  // チェックしたときだけ絞り込む（false を送ると「貸出不可のみ」になってしまう）
  const { data, fetchNextPage, isFetchingNextPage, isFetched, isLoading, hasNextPage } = useInfiniteItems({
    name: name.trim(),
    storageLocation: storageLocation.trim(),
    isRentable: isRentable || undefined,
    isDisposable: isDisposable || undefined,
  });
  const rows = data?.pages.flat(1) ?? [];
  const locations = [...new Set(rows.map((item) => item.storageLocation))];

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
      const request = {
        ...f,
        name: f.name.trim(),
        storageLocation: f.storageLocation.trim(),
        quantity: Number(f.quantity),
      };
      if (editingId) {
        await updateItem({ id: editingId, ...request });
      } else {
        await createItem(request);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      if (editingId) queryClient.invalidateQueries({ queryKey: ["itemDetail", editingId] });
      setFormOpen(false);
      toast.success(editingId ? "変更を保存しました" : "備品を追加しました");
    },
    onError: () => {
      toast.error("保存できませんでした。もう一度お試しください。");
    },
  });

  const clearAll = () => {
    setName(null);
    setStorageLocation(null);
    setIsRentable(null);
    setIsDisposable(null);
  };
  const tags: ActiveTag[] = [];
  if (name.trim()) tags.push({ label: `「${name.trim()}」`, aria: "名前の条件を外す", onClear: () => setName(null) });
  if (storageLocation.trim())
    tags.push({ label: storageLocation.trim(), aria: "保管場所を外す", onClear: () => setStorageLocation(null) });
  if (isRentable) tags.push({ label: "貸出可能", aria: "貸出可能を外す", onClear: () => setIsRentable(null) });
  if (isDisposable) tags.push({ label: "消耗品", aria: "消耗品を外す", onClear: () => setIsDisposable(null) });

  return (
    <>
      <PageHead
        number="03"
        label="Items"
        title="備品"
        description="部室の備品を検索・追加・編集できます。"
        action={
          <Button className="h-11 gap-2 px-4" onClick={() => openForm(null)}>
            <Plus className="size-4.5" aria-hidden />
            備品を追加
          </Button>
        }
      />

      <AdminCard aria-label="検索条件" className="flex flex-col gap-4 p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Field className="gap-1.5">
            <FieldLabel htmlFor="name">名前</FieldLabel>
            <SearchInput
              id="name"
              placeholder="例）HDMIケーブル"
              value={name}
              onChange={(e) => setName(e.target.value || null)}
            />
          </Field>
          <Field className="gap-1.5">
            <FieldLabel htmlFor="storageLocation">保管場所</FieldLabel>
            <Input
              id="storageLocation"
              className={controlClass}
              list="locationList"
              placeholder="すべて"
              value={storageLocation}
              onChange={(e) => setStorageLocation(e.target.value || null)}
            />
          </Field>
          <Field className="gap-1.5">
            <FieldTitle>種類・状態</FieldTitle>
            <div className="flex flex-wrap gap-x-5">
              <CheckField id="isRentable" label="貸出可能のみ" checked={isRentable} onChange={(c) => setIsRentable(c || null)} />
              <CheckField id="isDisposable" label="消耗品のみ" checked={isDisposable} onChange={(c) => setIsDisposable(c || null)} />
            </div>
          </Field>
        </div>
        <ActiveFilters tags={tags} onClearAll={clearAll} />
      </AdminCard>

      <datalist id="locationList">
        {locations.map((location) => (
          <option key={location} value={location} />
        ))}
      </datalist>

      <AdminCard aria-label="備品一覧">
        <Table className={`min-w-215 ${tableClass}`}>
          <TableHeader>
            <TableRow className={headRowClass}>
              <TableHead className={`${headCellClass} rounded-tl-xl`}>名前</TableHead>
              <TableHead className={`${headCellClass} w-[16%]`}>保管場所</TableHead>
              <TableHead className={`${headCellClass} w-20`}>数量</TableHead>
              <TableHead className={`${headCellClass} w-[18%]`}>状態</TableHead>
              <TableHead className={`${headCellClass} w-28 rounded-tr-xl text-right`}>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((item) => (
              <ItemRow key={item.id} {...item} onEdit={openForm} />
            ))}
          </TableBody>
        </Table>
        {isLoading && (
          <div className="flex justify-center border-t border-border py-10">
            <Spinner />
          </div>
        )}
        {isFetched && rows.length === 0 && (
          <EmptyRows
            title="条件に合う備品がありません"
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
            <b className="font-bold text-foreground">{rows.length}</b> 件を表示
          </span>
          {hasNextPage ? (
            <Button variant={"outline"} className="h-11 px-4" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? <Spinner /> : "さらに読み込み"}
            </Button>
          ) : (
            isFetched && rows.length > 0 && <span>最後の備品です</span>
          )}
        </ListFoot>
      </AdminCard>

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingId ? "備品を編集" : "備品を追加"}
        description={editingId ? "登録内容を変更します。" : "部室に新しく置いた備品を登録します。"}
        submitLabel={editingId ? "保存する" : "追加する"}
        isPending={save.isPending}
        onSubmit={() => {
          const errs = validate(form);
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
            placeholder="例）HDMIケーブル 2m"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <FieldError className="text-xs">{errors.name}</FieldError>}
        </Field>
        <Field className="gap-1.5">
          <FieldLabel htmlFor="fDesc">説明</FieldLabel>
          <Textarea
            id="fDesc"
            className="min-h-22 rounded-lg px-3 py-2.5"
            placeholder="型番や使い方のメモ"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field className="gap-1.5" data-invalid={!!errors.storageLocation}>
            <FieldLabel htmlFor="fLoc">保管場所</FieldLabel>
            <Input
              id="fLoc"
              className={controlClass}
              list="locationList"
              aria-invalid={!!errors.storageLocation}
              placeholder="例）部室A棚"
              value={form.storageLocation}
              onChange={(e) => setForm({ ...form, storageLocation: e.target.value })}
            />
            {errors.storageLocation && <FieldError className="text-xs">{errors.storageLocation}</FieldError>}
          </Field>
          <Field className="gap-1.5" data-invalid={!!errors.quantity}>
            <FieldLabel htmlFor="fQty">数量</FieldLabel>
            <Input
              id="fQty"
              type="number"
              min={0}
              className={`${controlClass} font-mono`}
              aria-invalid={!!errors.quantity}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
            {errors.quantity && <FieldError className="text-xs">{errors.quantity}</FieldError>}
          </Field>
        </div>
        <div className="flex flex-wrap gap-x-6">
          <CheckField
            id="fRentable"
            label="貸出可能にする"
            checked={form.isRentable}
            onChange={(c) => setForm({ ...form, isRentable: c })}
          />
          <CheckField
            id="fDisposable"
            label="消耗品"
            checked={form.isDisposable}
            onChange={(c) => setForm({ ...form, isDisposable: c })}
          />
        </div>
      </FormDialog>
    </>
  );
};

export default ItemsClient;
