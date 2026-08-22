import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Provider from "../QueryClientProvider";
import MembersClient from "./MembersClient";
import { Suspense } from "react";

// 仮文章
const Page = () => {
  return (
    <div className="max-w-6xl px-6 mx-auto">
      <Header />
      <h1 className="text-5xl font-bold my-8">メンバー紹介</h1>
      <Provider>
        <Suspense>
          <MembersClient />
        </Suspense>
      </Provider>
      <Footer />
    </div>
  );
};

export default Page;
