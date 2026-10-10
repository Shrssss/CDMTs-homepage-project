import Footer from "@/components/Footer";
import Header from "@/components/header";
import SectionMarker from "@/components/brand/SectionMarker";
import Provider from "../QueryClientProvider";
import NewsClient from "./NewsClient";
import { Suspense } from "react";

// 記事一覧ページ
const page = () => {
  return (
    <div className="min-h-screen bg-brand-beige text-gray-900">
      <Header />
      <main className="flex flex-col gap-8 px-4 pt-8 pb-12 md:gap-12 md:p-16">
        <section className="flex flex-col gap-3 md:gap-4">
          <SectionMarker number="01" label="NEWS / LOG" />
          <h1 className="mt-3 text-5xl leading-none font-bold md:mt-4 md:text-8xl">NEWS / LOG</h1>
          <p className="text-xl font-bold md:text-2xl">お知らせと活動記録</p>
        </section>
        <Provider>
          <Suspense>
            <NewsClient />
          </Suspense>
        </Provider>
      </main>
      <Footer />
    </div>
  );
};

export default page;
