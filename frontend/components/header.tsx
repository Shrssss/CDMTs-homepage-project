"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/news", label: "記事" },
  { href: "/members", label: "メンバー" },
  { href: "/about", label: "CODE MATESとは" },
  { href: "/contact", label: "お問い合わせ" },
];

// ヘッダーコンポーネント
const Header = () => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b-2 border-brand-black bg-white/20 p-4 backdrop-blur-2xl">
      <Link href="/" className="py-2 text-2xl font-bold text-brand-black">
        CODE MATES
      </Link>

      {/* 768px以上ではリンクを横に並べる */}
      <nav aria-label="メイン" className="hidden items-center gap-5 text-sm font-bold md:flex">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={cn(
              "py-3 text-brand-black underline-offset-6 hover:underline",
              isActive(item.href) && "underline decoration-2",
            )}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/login"
          className="bg-brand-black px-6 py-3.5 text-white transition-all hover:scale-105"
        >
          メンバーログイン
        </Link>
      </nav>

      {/* 768px未満の場合ハンバーガーメニューを表示する */}
      <Sheet>
        <SheetTrigger
          aria-label="メニューを開く"
          className="flex size-11 items-center justify-center border-2 border-brand-black text-brand-black md:hidden"
        >
          <Menu className="size-6" />
        </SheetTrigger>
        <SheetContent
          showCloseButton={false}
          className="w-full gap-0 border-l-2 border-brand-black bg-brand-beige p-0 text-brand-black sm:max-w-sm"
        >
          <div className="flex h-[74px] flex-none items-center justify-between border-b-2 border-brand-black px-4">
            <SheetTitle className="text-[22px] font-bold text-brand-black">CODE MATES</SheetTitle>
            <SheetClose
              aria-label="メニューを閉じる"
              className="flex size-11 items-center justify-center border-2 border-brand-black bg-brand-black text-brand-beige"
            >
              <X className="size-6" />
            </SheetClose>
          </div>
          <SheetDescription className="sr-only">サイト内の各ページへのリンク</SheetDescription>

          <nav aria-label="メイン" className="flex flex-col px-4 pt-2">
            <span className="pt-4 pb-2 font-mono text-xs font-bold tracking-wider">MENU</span>
            {[{ href: "/", label: "ホーム" }, ...NAV_ITEMS].map((item, idx) => (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-17 items-center gap-4 border-b-2 border-brand-black"
                >
                  <span className="w-7 font-mono text-sm">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-[22px] font-bold">{item.label}</span>
                  <ArrowRight className="size-5" />
                </Link>
              </SheetClose>
            ))}
          </nav>

          <div className="px-4 pt-6">
            <Link
              href="/login"
              className="flex min-h-14 items-center justify-center bg-brand-black font-bold text-white"
            >
              メンバーログイン
            </Link>
          </div>

          <div className="mt-auto bg-brand-black p-4 py-6 font-mono text-sm leading-loose text-brand-beige/70">
            <p>$ codemates --where</p>
            <p className="text-brand-beige">月・火 15:30～ / エッグドーム5F</p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
