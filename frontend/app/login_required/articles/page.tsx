import { Metadata } from "next";
import { Suspense } from "react";
import Client from "./ArticlesClient";

export const metadata: Metadata = {
  title: "記事",
};

// 記事一覧（Provider とサイドバーは layout.tsx）
const Page = () => {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
};

export default Page;
