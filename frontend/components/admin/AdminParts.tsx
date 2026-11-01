"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Pencil, Search, Trash2, TriangleAlert, X } from "lucide-react";

/* 管理ページ（/login_required）で共通して使う部品 */

// フォーム部品の高さ（タップしやすいよう44pxに揃える）
export const controlClass = "h-11 rounded-lg px-3 text-sm";
export const selectClass = "w-full [&_select]:h-11 [&_select]:pl-3 [&_select]:text-sm";

// [01] Members ／ 見出し ／ 説明 ／ 右側に主操作
export const PageHead = ({
  number,
  label,
  title,
  description,
  action,
}: {
  number: string;
  label: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-1 font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
          [{number}] {label}
        </div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
};

export const AdminCard = ({
  className,
  ...props
}: React.ComponentProps<"section">) => {
  return (
    <section
      className={cn("rounded-xl border border-border bg-card text-card-foreground", className)}
      {...props}
    />
  );
};

// 虫眼鏡アイコン付きの検索欄
export const SearchInput = ({ className, ...props }: React.ComponentProps<"input">) => {
  return (
    <div className="relative">
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        className={cn(
          controlClass,
          "w-full min-w-0 border border-input bg-transparent pl-9.5 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        )}
        {...props}
      />
    </div>
  );
};

export type ActiveTag = { label: string; aria: string; onClear: () => void };

// 適用中の条件と「条件をクリア」
export const ActiveFilters = ({
  tags,
  onClearAll,
}: {
  tags: ActiveTag[];
  onClearAll: () => void;
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {tags.length > 0 ? (
          <>
            <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
              適用中
            </span>
            {tags.map((tag) => (
              <span
                key={tag.aria}
                className="inline-flex min-h-8 items-center gap-1 rounded-full bg-secondary py-0 pr-1 pl-3 text-[13px] text-secondary-foreground"
              >
                {tag.label}
                <button
                  type="button"
                  aria-label={tag.aria}
                  onClick={tag.onClear}
                  className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full hover:bg-accent"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </span>
            ))}
          </>
        ) : (
          <span className="text-xs text-muted-foreground">条件を指定すると、ここに表示されます。</span>
        )}
      </div>
      <Button
        variant={"ghost"}
        className="h-11 px-4"
        disabled={tags.length === 0}
        onClick={onClearAll}
      >
        条件をクリア
      </Button>
    </div>
  );
};

// 一覧が0件のとき
export const EmptyRows = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center gap-3 border-t border-border px-5 py-14 text-center">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      {action}
    </div>
  );
};

export const ListFoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3.5 text-[13px] text-muted-foreground">
      {children}
    </div>
  );
};

// 一覧の表のヘッダー・セルに使うクラス
// 行の罫線は既定だと文字色になるため、--border の薄い色を指定する
export const tableClass = "[&_tr]:border-border";
export const headRowClass = "bg-muted hover:bg-muted";
export const headCellClass = "h-11 px-5 text-xs font-medium text-muted-foreground first:pl-5";
export const cellClass = "px-5 py-3 whitespace-normal";

// 薄いオレンジのバッジ（役職・貸出可能など）
export const primaryBadgeClass = "bg-primary/14 text-primary dark:bg-orange-400/14 dark:text-orange-400";

// 削除前の注意書き
export const Warn = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex gap-3 rounded-lg bg-destructive/10 px-3.5 py-3 text-foreground">
      <TriangleAlert aria-hidden className="mt-px size-4.5 flex-none text-destructive" />
      <div>{children}</div>
    </div>
  );
};

// 作成・編集用のダイアログ（ヘッダー／本文／フッターの3段）
export const FormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  isPending,
  onSubmit,
  wide,
  actions,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  isPending: boolean;
  onSubmit: () => void;
  // 記事のように本文が長いフォーム用
  wide?: boolean;
  // 送信ボタンを差し替える（キャンセルは左端に寄せる）
  actions?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 p-0",
          wide ? "max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-220" : "sm:max-w-140",
        )}
        showCloseButton={false}
      >
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <DialogHeader className="flex-row justify-between gap-3 px-6 pt-5">
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
            <DialogClose asChild>
              <Button type="button" variant={"ghost"} size={"icon"} className="size-11" aria-label="閉じる">
                <X className="size-4.5" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col gap-4 px-6 py-5">{children}</div>
          <DialogFooter className="mx-0 mb-0 border-border px-6 py-4">
            <DialogClose asChild>
              <Button type="button" variant={"outline"} className={cn("h-11 px-4", actions && "sm:mr-auto")}>
                キャンセル
              </Button>
            </DialogClose>
            {actions ?? (
              <Button type="submit" className="h-11 px-4" disabled={isPending}>
                {isPending ? "保存中..." : submitLabel}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// 削除の確認ダイアログ
export const DeleteDialog = ({
  open,
  onOpenChange,
  title,
  isPending,
  onConfirm,
  extraAction,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  isPending: boolean;
  onConfirm: () => void;
  // キャンセルと削除の間に置く操作（例：非公開にする）
  extraAction?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-0 p-0 data-[size=default]:max-w-[calc(100%-2rem)] data-[size=default]:sm:max-w-110">
        <AlertDialogHeader className="px-6 pt-5 text-left sm:text-left">
          <AlertDialogTitle className="text-lg font-semibold">{title}</AlertDialogTitle>
          <AlertDialogDescription>この操作は取り消せません。</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4 px-6 py-5">{children}</div>
        <AlertDialogFooter className="mx-0 mb-0 rounded-b-xl border-t border-border bg-muted/50 px-6 py-4">
          <AlertDialogCancel className={cn("h-11 px-4", extraAction && "sm:mr-auto")}>キャンセル</AlertDialogCancel>
          {extraAction}
          <Button
            className="h-11 bg-destructive px-4 text-white hover:bg-destructive/90"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "削除中..." : "削除する"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// 行の編集・削除ボタン
export const RowActions = ({
  name,
  onEdit,
  onDelete,
  children,
}: {
  name: string;
  onEdit: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex justify-end gap-1">
      {children}
      <Button variant={"ghost"} size={"icon"} className="size-11" aria-label={`${name}を編集`} onClick={onEdit}>
        <Pencil className="size-4.5" />
      </Button>
      {onDelete && (
        <Button
          variant={"ghost"}
          size={"icon"}
          className="size-11 text-destructive hover:text-destructive"
          aria-label={`${name}を削除`}
          onClick={onDelete}
        >
          <Trash2 className="size-4.5" />
        </Button>
      )}
    </div>
  );
};
