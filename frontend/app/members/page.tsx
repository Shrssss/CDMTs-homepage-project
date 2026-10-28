import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/header";
import SectionMarker from "@/components/brand/SectionMarker";
import Provider from "../QueryClientProvider";
import MembersClient from "./MembersClient";
import { Metadata } from "next/types";

export const metadata:Metadata={
  title:"メンバー"
}

// メンバー一覧ページ
const Page = () => {
  return (
    <div className="min-h-screen bg-brand-beige text-gray-900">
      <Header />
      <main className="flex flex-col gap-8 px-4 pt-8 md:gap-10 md:p-16">
        <section className="flex flex-col gap-3 md:gap-4">
          <SectionMarker number="01" label="MEMBERS" />
          <h1 className="mt-3 text-4xl leading-tight font-bold md:mt-4 md:text-6xl">メンバー紹介</h1>
          <p className="leading-relaxed md:max-w-xl">
            学年もスキルもばらばら。だからこそフラットに教え合える、CODE MATES の仲間たちです。
          </p>
        </section>
        <Provider>
          <Suspense>
            <MembersClient />
          </Suspense>
        </Provider>

        <section className="-mx-4 mt-4 flex flex-col gap-3 border-b-2 border-brand-beige/30 bg-brand-black px-4 py-10 text-brand-beige md:mx-0 md:mt-0 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-6 md:border-b-0 md:p-10">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs font-bold tracking-wider text-lime-300">[02] JOIN US</span>
            <p className="text-[26px] leading-snug font-bold md:text-4xl">
              一緒に作る仲間を
              <br className="md:hidden" />
              募集しています
            </p>
            <p className="text-brand-beige/80">プログラミング未経験でも大丈夫。まずは見学から。</p>
          </div>
          <Link
            href="/contact"
            className="mt-2 flex min-h-13 items-center justify-center gap-2 bg-brand-beige px-7 font-bold text-brand-black transition-all hover:scale-105 md:mt-0"
          >
            お問い合わせ
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
