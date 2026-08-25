import Link from "next/link";
import { Button } from "./ui/button";

// ヘッダーコンポーネント
const Header = () => {
  return (
    <header className="mx-auto p-4 flex justify-between gap-2">
      <Button variant={"default"} asChild size={"lg"}>
        <Link href={"/"}>CODE MATES</Link>
      </Button>
      <div className="flex gap-2 text-muted-foreground">
        <Button asChild variant={"link"}>
          <Link href="/about">概要</Link>
        </Button>
        <Button asChild variant={"link"}>
          <Link href="/news">記事</Link>
        </Button>
        <Button asChild variant={"link"}>
          <Link href="/members">メンバー紹介</Link>
        </Button>
        <Button asChild variant={"link"}>
          <Link href="/contact">お問い合わせ</Link>
        </Button>
        <Button asChild variant={"default"}>
          <Link href={"/login"}>メンバーログイン</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
