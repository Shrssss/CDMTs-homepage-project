import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Provider from "../QueryClientProvider";
import NewsClient from "./NewsClient";
import { Suspense } from "react";

// 仮文章
const page = () => {
  return (
    <div className="text-gray-900 bg-brand-beige">
      <Header />
      <div className="p-16">
        <h1 className="text-7xl font-bold my-8">NEWS / LOG</h1>
        <h2 className="text-3xl font-bold mt-4">お知らせと活動記録</h2>
      </div>
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
