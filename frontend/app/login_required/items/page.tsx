import { Metadata } from "next";
import { Suspense } from "react";
import Client from "./ItemsClient";

export const metadata: Metadata = {
  title: "備品",
};

// 備品一覧（Provider とサイドバーは layout.tsx）
const Page = () => {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
};

export default Page;
