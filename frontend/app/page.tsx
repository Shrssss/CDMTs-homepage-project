import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Provider from "./QueryClientProvider";
import NewsClient from "./NewsClient";
import Footer from "@/components/Footer";
import { ButtonGroup } from "@/components/ui/button-group";
import MembersClient from "./MembersClient";

const Page = () => {
  // 仮文章
  return (
    <div className="max-w-6xl px-6 mx-auto">
      <Header />
      <h1 className="text-5xl font-bold my-8">キャッチフレーズ</h1>
      <p className="my-6">
        CODE
        MATESは、文系学部の学生だけで活動するプログラミングサークルです。開発もBBQも全力で。プログラミング未経験でも大歓迎です。
      </p>
      <ButtonGroup>
        <Button asChild size={"lg"}>
          <Link href="/about">サークルを知る</Link>
        </Button>
        <Button variant={"outline"} size={"lg"}>
          <Link href="/contact">お問い合わせ</Link>
        </Button>
      </ButtonGroup>
      <div className="aspect-5/2 bg-accent my-4 relative">
        <p className="absolute top-1/2 left-1/2 text-muted-foreground">画像</p>
      </div>
      <h2 className="text-2xl font-bold my-4">
        文系サークルだからこそ、ものづくりも遊びも思いきり
      </h2>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-accent p-2">
          <p className="text-primary">文系でも安心</p>
          <h3 className="font-semibold mt-2 mb-4">未経験でも大丈夫</h3>
          <p className="text-sm">
            メンバーの多くが文系学部からの入部で、プログラミング未経験スタート。先輩がマンツーマンで教えます。
          </p>
        </div>
        <div className="bg-accent p-2">
          <p className="text-primary">文系でも安心</p>
          <h3 className="font-semibold mt-2 mb-4">未経験でも大丈夫</h3>
          <p className="text-sm">
            メンバーの多くが文系学部からの入部で、プログラミング未経験スタート。先輩がマンツーマンで教えます。
          </p>
        </div>
        <div className="bg-accent p-2">
          <p className="text-primary">文系でも安心</p>
          <h3 className="font-semibold mt-2 mb-4">未経験でも大丈夫</h3>
          <p className="text-sm">
            メンバーの多くが文系学部からの入部で、プログラミング未経験スタート。先輩がマンツーマンで教えます。
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold my-4">最近の記事</h2>
        <Button asChild variant={"link"} size={"lg"}>
          <Link href={"/news"}>記事一覧</Link>
        </Button>
      </div>
      <Provider>
        <NewsClient />
      </Provider>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold my-4">メンバー紹介</h2>
        <Button asChild variant={"link"} size={"lg"}>
          <Link href={"/members"}>全員見る</Link>
        </Button>
      </div>
      <Provider>
        <MembersClient />
      </Provider>
      <Footer/>
    </div>
  );
};

export default Page;
