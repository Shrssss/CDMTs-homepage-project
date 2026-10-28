"use client";

import { errorMessage } from "@/lib/features/api";
import { loginMember } from "@/lib/features/member";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const FIELD_CLASS =
  "h-12 w-full min-w-0 border-2 border-brand-black bg-white px-3 text-base text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-black/40";

const LoginForm = () => {
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: async ({
      identifier,
      password,
    }: {
      identifier: string;
      password: string;
    }) => {
      return await loginMember({
        identifier,
        password,
      });
    },
    onSuccess: () => {
      router.push("/login_required/items");
    },
  });
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const identifier = formData.get("identifier") as string;
        const password = formData.get("password") as string;
        loginMutation.mutate({
          identifier,
          password,
        });
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="identifier" className="font-mono text-xs font-bold tracking-wider">
          IDENTIFIER / 学籍番号 または メールアドレス
        </label>
        <input
          id="identifier"
          type="text"
          name="identifier"
          placeholder="例：01A2345 または example123@example.com"
          required
          autoComplete="username"
          className={FIELD_CLASS}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-mono text-xs font-bold tracking-wider">
          PASSWORD / パスワード
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className={FIELD_CLASS}
        />
      </div>

      {loginMutation.isError && (
        <p
          role="alert"
          className="border-2 border-brand-black bg-brand-black p-3 font-mono text-sm text-brand-beige"
        >
          ✕ {errorMessage(loginMutation.error, "ログインに失敗しました。入力内容を確認してください。")}
        </p>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="flex min-h-13 cursor-pointer items-center justify-center gap-2 bg-brand-black px-7 font-bold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {loginMutation.isPending ? "処理中..." : "ログイン"}
        <ArrowRight className="size-4" />
      </button>
    </form>
  );
};

export default LoginForm;
