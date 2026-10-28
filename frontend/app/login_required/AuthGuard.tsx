"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentMemberId } from "@/hooks/member";
import { isAuthError } from "@/lib/features/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// ログインしていなければ /login へ移動させる
// セッション切れもウィンドウに戻ったときの再取得で検知する
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const me = useCurrentMemberId();
  const unauthenticated = me.isError && isAuthError(me.error);

  useEffect(() => {
    if (unauthenticated) router.replace("/login");
  }, [unauthenticated, router]);

  if (me.isSuccess) return children;

  if (me.isError && !unauthenticated) {
    return (
      <div role="alert" className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center text-sm">
        <p>ログイン状態を確認できませんでした。通信環境を確認してください。</p>
        <Button variant={"outline"} className="h-11 px-4" onClick={() => me.refetch()}>
          再読み込み
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center" aria-label="ログイン状態を確認中">
      <Spinner />
    </div>
  );
};

export default AuthGuard;
