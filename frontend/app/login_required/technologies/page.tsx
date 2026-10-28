import { Metadata } from "next";
import { Suspense } from "react";
import Client from "./TechnologiesClient";

export const metadata: Metadata = {
  title: "技術",
};

// 技術一覧（Provider とサイドバーは layout.tsx）
const Page = () => {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
};

export default Page;
