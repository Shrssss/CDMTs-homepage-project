import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Provider from "../QueryClientProvider";
import NewsClient from "./NewsClient";
import { Suspense } from "react";

// 仮文章
const page = () => {
  return (
    <div className="max-w-6xl px-6 mx-auto">
      <Header />
      <h1 className="text-5xl font-bold my-8">記事一覧</h1>
      <Provider>
        <Suspense>
          <NewsClient />
        </Suspense>
      </Provider>
      <Footer />
    </div>
  );
};

export default page;
