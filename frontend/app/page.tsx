import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";

import Header from "@/components/header";
import Footer from "@/components/Footer";
import SectionMarker from "@/components/brand/SectionMarker";
import TerminalWindow from "@/components/brand/TerminalWindow";
import InfoGrid from "@/components/brand/InfoGrid";
import Provider from "./QueryClientProvider";
import NewsClient from "./NewsClient";

const PILLARS = [
  {
    eyebrow: "01 / BUILD",
    title: "チーム開発",
    text: "3〜5人の小さなチームで、企画・設計・実装・公開までを経験。学期ごとにひとつのプロダクトを育てます。",
    keywords: "WEB / APP / CREATIVE CODING",
  },
  {
    eyebrow: "02 / LEARN",
    title: "各種講習会",
    text: "テーマに応じて、不定期に講習会が開催されます。",
    keywords: "TEXT / TEST / FEEDBACK",
  },
  {
    eyebrow: "03 / SHARE",
    title: "オフラインLT会",
    text: "他団体と共同で数か月おきにLT会を企画。",
    keywords: "SHARE / TALK / COMMUNICATION",
  },
];

const Page = () => {
  return (
    <div className="bg-brand-beige text-gray-900">
      <Header />
      <main>
        {/* ファーストビュー */}
        <section className="relative h-[640px] border-b-2 border-brand-black md:h-[calc(100svh-74px)] md:min-h-[560px]">
          <img
            src={"/images/placeholder.jpg"}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-brand-black from-45% to-brand-black/40 md:bg-linear-90 md:from-brand-black md:from-0% md:to-transparent/20"></div>
          <div className="relative flex h-full flex-col justify-end gap-4 p-4 pb-8 text-white md:max-w-3xl md:justify-center md:p-16">
            <span className="font-mono text-xs font-bold tracking-wider">
              HOSEI UNIV. TAMA CAMPUS
            </span>
            {/* TODO: キャッチコピーを確定させる */}
            <h1 className="text-[34px] leading-snug font-bold md:text-6xl md:leading-tight">
              「作ること」と
              <br />
              「楽しむこと」、
              <br />
              どちらも本気で。
            </h1>
            <p className="leading-relaxed text-white/85 md:text-lg">
              法政大学多摩キャンパス、文系学部生だけのプログラミングサークル CODE MATES
            </p>
            <div className="mt-2 flex flex-col gap-2 md:flex-row md:gap-3">
              <Link
                href="/contact"
                className="flex min-h-13 items-center justify-center gap-2 bg-brand-beige px-7 font-bold text-brand-black transition-all hover:scale-105"
              >
                見学・入部の相談をする
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/about"
                className="flex min-h-13 items-center justify-center border-2 border-brand-beige px-7 font-bold text-brand-beige"
              >
                CODE MATESについて
              </Link>
            </div>
          </div>
        </section>

        {/* [01] 活動の3つの柱 */}
        <section className="px-4 pt-10 pb-12 md:p-16">
          <SectionMarker number="01" label="WHAT WE DO" />
          <h2 className="mt-7 mb-4 text-2xl font-bold">活動の3つの柱</h2>
          <div className="grid gap-2 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div key={pillar.eyebrow} className="flex flex-col border-2 border-black bg-white/50 p-4">
                <p className="mb-8 font-mono text-sm md:mb-16">{pillar.eyebrow}</p>
                <p className="mb-3 text-3xl font-extrabold">{pillar.title}</p>
                <p className="text-sm leading-relaxed">{pillar.text}</p>
                <p className="mt-8 font-mono text-sm font-bold md:mt-auto md:pt-16">
                  {pillar.keywords}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* [02] 初心者歓迎 */}
        <section className="grid grid-cols-1 text-brand-beige md:grid-cols-3">
          <div className="flex flex-col gap-4 bg-brand-black px-4 py-10 md:col-span-2 md:p-16">
            <SectionMarker number="02" label="BEGINNER FRIENDLY" tone="dark" />
            <h2 className="mt-2 text-3xl leading-snug font-bold md:text-5xl md:leading-tight">
              「エンジニアになりたい」より
              <br className="hidden md:block" />
              「なにかを作れるようになりたい」
            </h2>
            <p className="leading-loose md:max-w-xl">
              メンバーのほとんどがプログラミング未経験で入部しています。初心者向けの勉強会や先輩の個別サポートで、ゼロから始められます。
            </p>
          </div>
          <div className="flex flex-col justify-center bg-black/60 p-4 py-6 md:p-8">
            <TerminalWindow
              fileName="first-step.sh"
              lines={[
                { text: "$ codemates --philosophy" },
                // TODO: 理念を確定させる
                { text: "[理念]", tone: "output" },
                { text: "$ codemates join --beginner" },
                { text: "✓ joining complete", tone: "success" },
                { text: "Welcome! まずは隣の人に hello" },
                { text: "_", tone: "success" },
              ]}
            />
          </div>
        </section>

        {/* [03] 活動日・場所 */}
        <section className="px-4 pt-12 pb-10 md:p-16">
          <SectionMarker number="03" label="WHEN & WHERE" className="mb-6 md:mb-8" />
          <InfoGrid
            items={[
              { label: "TIME SCHEDULE", value: "月・火　15:30～" },
              { label: "LOCATION", value: "エッグドーム5F" },
              // TODO: そのほかの事項を確定させる
              { label: "OTHERS", value: "[そのほかの事項]" },
            ]}
          />
        </section>

        {/* [04] 最新のお知らせ */}
        <section className="flex flex-col gap-4 px-4 pt-2 pb-14 md:px-16 md:pt-0 md:pb-16">
          <SectionMarker number="04" label="LATEST NEWS" />
          <h2 className="mt-3 text-2xl font-bold">最新のお知らせ</h2>
          <Provider>
            <Suspense>
              <NewsClient />
            </Suspense>
          </Provider>
          <Link
            href="/news"
            className="flex min-h-13 items-center justify-center gap-2 self-stretch bg-brand-black px-7 font-bold text-white md:self-start"
          >
            すべての記事を見る
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
