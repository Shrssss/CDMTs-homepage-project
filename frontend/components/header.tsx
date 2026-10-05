"use client";

import Link from "next/link";
import { Button } from "./ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

// ヘッダーコンポーネント
const Header = () => {
  return (
    <header className="p-4 flex justify-between gap-2 border-black border-b-2 items-center sticky top-0 backdrop-blur-2xl z-10 bg-white/20">
      <Button
        variant="link"
        asChild
        size={"lg"}
        className="font-bold text-black text-2xl"
      >
        <Link href={"/"}>CODE MATES</Link>
      </Button>

      <div className="gap-2 items-center hidden md:flex">
        <Button asChild variant={"link"} className="text-black font-bold">
          <Link href="/news">記事</Link>
        </Button>
        <Button asChild variant={"link"} className="text-black font-bold">
          <Link href="/contact">お問い合わせ</Link>
        </Button>
        <Button
          asChild
          variant={"default"}
          className="text-white font-bold bg-brand-black rounded-none p-6 hover:bg-brand-black transition-all hover:scale-105"
        >
          <Link href={"/login"}>メンバーログイン</Link>
        </Button>
      </div>

      {/* 768px未満の場合ハンバーガーメニューを表示する */}
      <Sheet>
        <SheetTrigger className="md:hidden" asChild>
          <Button
            className="border-2 border-black rounded-none bg-transparent text-black hover:bg-transparent size-10"
          >
            <Menu className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-transparent backdrop-blur-2xl border-l-2">
          <SheetHeader>
            <SheetTitle>各種リンク</SheetTitle>
            {/* <SheetDescription>description</SheetDescription> */}
          </SheetHeader>
          <div className="p-4 flex flex-col items-end">
            <Button asChild variant={"link"} className="text-black font-bold">
              <Link href="/">ホーム</Link>
            </Button>
            <Button asChild variant={"link"} className="text-black font-bold">
              <Link href="/news">記事</Link>
            </Button>
            <Button asChild variant={"link"} className="text-black font-bold">
              <Link href="/contact">お問い合わせ</Link>
            </Button>
            <Button
              asChild
              variant={"link"}
              className="text-white font-bold bg-black rounded-none p-6 hover:bg-black hover:underline"
            >
              <Link href={"/login"}>メンバーログイン</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
