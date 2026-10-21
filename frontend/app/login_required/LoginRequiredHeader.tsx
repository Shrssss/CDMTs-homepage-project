"use client";

import { Button } from "@/components/ui/button";
import { logoutMember } from "@/lib/features/member";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { Code, LogOut, Package, Users } from "lucide-react";

const NAV = [
  { href: "/login_required/items", label: "備品", Icon: Package },
  { href: "/login_required/members", label: "メンバー", Icon: Users },
  { href: "/login_required/technologies", label: "技術", Icon: Code },
];

// 管理ページのサイドバー（スマホでは上部に横並び）
const LoginRequiredHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useMutation({
    mutationFn: logoutMember,
    onSettled: () => {
      router.push("/");
    },
  });
  return (
    <aside className="flex flex-col gap-4 border-b border-sidebar-border bg-sidebar p-4 md:sticky md:top-0 md:h-svh md:w-58 md:flex-none md:gap-7 md:border-r md:border-b-0 md:px-4 md:py-5">
      <div className="flex flex-col gap-0.5 px-2">
        <span className="text-2xl font-bold">CODE MATES</span>
        <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Members only
        </span>
      </div>
      <nav aria-label="管理メニュー" className="flex flex-wrap gap-1 md:grow md:flex-col">
        {NAV.map(({ href, label, Icon }) => {
          const current = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-2.5 rounded-lg px-3 font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                current ? "bg-primary text-primary-foreground" : "hover:bg-accent",
              )}
            >
              <Icon className="size-4.5" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <Button
        variant={"outline"}
        className="h-11 gap-2 px-4"
        onClick={() => {
          logout.mutate();
        }}
      >
        <LogOut className="size-4.5" aria-hidden />
        {logout.isPending ? "ログアウト中..." : "ログアウト"}
      </Button>
    </aside>
  );
};

export default LoginRequiredHeader;
