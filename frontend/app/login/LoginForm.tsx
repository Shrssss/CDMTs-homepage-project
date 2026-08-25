"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginMember } from "@/lib/features/member";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
      router.push("/items");
    },
  });
  return (
    <form
      className="flex gap-6 flex-col"
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
        <Label htmlFor="identifier">学籍番号 または メールアドレス</Label>
        <Input
          id="identifier"
          type="text"
          name="identifier"
          placeholder="例：01A2345 または example123@example.com"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">パスワード</Label>
        <Input id="password" type="password" name="password" required />
      </div>

      <Button type="submit" size={"lg"}>
        {loginMutation.isPending ? "処理中..." : "ログイン"}
      </Button>
    </form>
  );
};

export default LoginForm;
