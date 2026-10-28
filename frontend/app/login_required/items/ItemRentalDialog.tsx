"use client";

import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useInfiniteItemRentalHistories, useItemDetail } from "@/hooks/item";
import { errorMessage } from "@/lib/features/api";
import { returnItem, toggleIsRentable } from "@/lib/features/items";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { X } from "lucide-react";
import { toast } from "sonner";

const formatDate = (date: Date) => format(date, "yyyy.MM.dd HH:mm");

// 備品の貸出状況（貸出可否の切り替え・返却・貸出履歴）
const ItemRentalDialog = ({ id, onOpenChange }: { id: number | null; onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={id !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-140" showCloseButton={false}>
        {id !== null && <Body id={id} />}
      </DialogContent>
    </Dialog>
  );
};

const Body = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const detail = useItemDetail({ id });
  const histories = useInfiniteItemRentalHistories({ id });
  const rows = histories.data?.pages.flat(1) ?? [];
  // 返却前の記録。返せるのは借りた本人だけなので、本人かどうかはバックエンドが判定する
  const active = rows.filter((h) => h.returnedAt === null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["items"] });
    queryClient.invalidateQueries({ queryKey: ["itemDetail", id] });
    queryClient.invalidateQueries({ queryKey: ["itemRentalHistories", id] });
  };

  const toggle = useMutation({
    mutationFn: toggleIsRentable,
    onSuccess: (_, { isRentable }) => {
      refresh();
      toast.success(isRentable ? "貸出を受け付けるようにしました" : "貸出を停止しました");
    },
    onError: (e) => {
      toast.error(errorMessage(e, "切り替えられませんでした。もう一度お試しください。"));
    },
  });

  const giveBack = useMutation({
    mutationFn: returnItem,
    onSuccess: () => {
      refresh();
      toast.success("返却しました");
    },
    onError: (e) => {
      toast.error(errorMessage(e, "返却できませんでした。もう一度お試しください。"));
    },
  });

  return (
    <>
      <DialogHeader className="flex-row justify-between gap-3 px-6 pt-5">
        <div className="flex flex-col gap-0.5">
          <DialogTitle className="text-lg font-semibold">{detail.data?.name ?? "備品"}の貸出状況</DialogTitle>
          <DialogDescription>
            {detail.data ? `${detail.data.storageLocation}・残り ${detail.data.quantity} 個` : "読み込み中..."}
          </DialogDescription>
        </div>
        <DialogClose asChild>
          <Button type="button" variant={"ghost"} size={"icon"} className="size-11" aria-label="閉じる">
            <X className="size-4.5" />
          </Button>
        </DialogClose>
      </DialogHeader>

      <div className="flex flex-col gap-5 px-6 py-5">
        {detail.data && !detail.data.isDisposable && (
          <div className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-border px-3.5">
            <Label htmlFor="rentable" className="cursor-pointer font-normal">
              貸出を受け付ける
            </Label>
            <Switch
              id="rentable"
              checked={detail.data.isRentable}
              disabled={toggle.isPending}
              onCheckedChange={(c) => toggle.mutate({ id, isRentable: c })}
            />
          </div>
        )}

        {active.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-primary/10 px-3.5 py-3">
            <span>
              貸出中：{active.map((h) => `${h.renterName}（${formatDate(h.rentedAt)}〜）`).join("、")}
            </span>
            <Button className="h-11 px-4" disabled={giveBack.isPending} onClick={() => giveBack.mutate({ id })}>
              {giveBack.isPending ? "返却中..." : "返却する"}
            </Button>
          </div>
        )}

        <section aria-labelledby="historyTitle" className="flex flex-col gap-2">
          <h3 id="historyTitle" className="font-semibold">
            貸出履歴
          </h3>
          {histories.isLoading ? (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          ) : histories.isError ? (
            <p className="text-muted-foreground">履歴を読み込めませんでした。</p>
          ) : rows.length === 0 ? (
            <p className="text-muted-foreground">まだ貸し出されたことはありません。</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {rows.map((h) => (
                <li key={h.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3.5 py-2.5">
                  <span className="font-medium">{h.renterName}</span>
                  <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    {formatDate(h.rentedAt)} 〜 {h.returnedAt ? formatDate(h.returnedAt) : <Badge variant={"outline"}>貸出中</Badge>}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {histories.hasNextPage && (
            <Button
              variant={"outline"}
              className="h-11 self-center px-4"
              disabled={histories.isFetchingNextPage}
              onClick={() => histories.fetchNextPage()}
            >
              {histories.isFetchingNextPage ? <Spinner /> : "さらに読み込み"}
            </Button>
          )}
        </section>
      </div>

      <DialogFooter className="mx-0 mb-0 border-border px-6 py-4">
        <DialogClose asChild>
          <Button type="button" variant={"outline"} className="h-11 px-4">
            閉じる
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};

export default ItemRentalDialog;
