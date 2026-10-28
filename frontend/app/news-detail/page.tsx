import Footer from "@/components/Footer";
import Header from "@/components/header";
import { Suspense } from "react";
import NewsDetailClient from "./NewsDetailClient";
import Provider from "../QueryClientProvider";

// 各記事
const Page = () => {
  return (
    <div className="min-h-screen bg-brand-beige text-gray-900">
      <Header />
      <main className="px-4 pt-6 pb-12 md:px-16 md:pt-12 md:pb-20">
        <Suspense>
          <Provider>
            <NewsDetailClient />
          </Provider>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
