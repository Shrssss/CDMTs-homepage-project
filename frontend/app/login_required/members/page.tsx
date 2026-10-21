import { Metadata } from "next";
import { Suspense } from "react";
import Client from "./MemberClient";

export const metadata: Metadata = {
  title: "メンバー",
};

// サークルメンバー一覧（Provider とサイドバーは layout.tsx）
const Page = () => {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
};

export default Page;
