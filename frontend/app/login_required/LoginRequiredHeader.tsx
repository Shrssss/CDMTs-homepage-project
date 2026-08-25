"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { logoutMember } from "@/lib/features/member";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const LoginRequiredHeader = () => {
  const router = useRouter();
  const logout = useMutation({
    mutationFn: logoutMember,
    onSettled: () => {
      router.push("/");
    },
  });
  return (
    <header>
      <ButtonGroup>
        <Button asChild variant={"outline"}>
          <Link href={"/login_required/items"}>備品</Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link href={"/login_required/members"}>メンバー</Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link href={"/login_required/technologies"}>技術</Link>
        </Button>
        <Button
          onClick={() => {
            logout.mutate();
          }}
        >
          {logout.isPending ? "ログアウト中..." : "ログアウト"}
        </Button>
      </ButtonGroup>
    </header>
  );
};

export default LoginRequiredHeader;
