import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/header";
import SectionMarker from "@/components/brand/SectionMarker";
import TerminalWindow from "@/components/brand/TerminalWindow";

const ACTIVITIES = [
  {
    eyebrow: "01 / DEVELOP",
    title: "開発",
    text: "Webアプリ・LINE Bot・ゲーム制作。チームで企画からリリースまでを経験し、GitHubでの共同開発も行います。",
    keywords: "WEB / LINE BOT / GAME",
  },
  {
    eyebrow: "02 / LEARN",
    title: "勉強会",
    text: "初心者向けの勉強会や、先輩による個別サポート。学年やスキルに関係なくフラットに教え合います。",
    keywords: "BEGINNER / SUPPORT",
  },
  {
    eyebrow: "03 / PLAY",
    title: "レクリエーション",
    text: "BBQやボードゲーム会を定期的に開催。「作ること」と同じくらい「楽しむこと」も大切にしています。",
    keywords: "BBQ / BOARD GAMES",
  },
  {
    eyebrow: "04 / SHOWCASE",
    title: "文化祭出展",
    text: "チームで作った作品を文化祭で展示。実際に人に触ってもらう経験を積みます。",
    keywords: "EXHIBIT / DEMO",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-brand-beige text-gray-900">
      <Header />
      <main>
        {/* [01] CODE MATESとは */}
        <section className="flex flex-col gap-4 px-4 py-8 md:gap-6 md:px-16 md:pt-16 md:pb-12">
          <SectionMarker number="01" label="ABOUT US" />
          <h1 className="mt-3 text-[40px] leading-tight font-bold md:mt-4 md:text-7xl">
            CODE MATES
            <br className="md:hidden" />
            とは
          </h1>
          <p className="leading-loose md:max-w-3xl md:text-lg">
            CODE MATESは法政大学多摩キャンパスの文系学部生だけで活動するプログラミングサークルです。「開発」と「レクリエーション」の両方に本気で取り組んでいます。
          </p>
          <p className="font-mono text-sm font-bold md:text-base">DEVELOP / LEARN / PLAY</p>
        </section>

        <section className="grid items-start md:grid-cols-2 md:gap-12 md:px-16 md:pb-20">
          {/* TODO: 活動風景の写真に差し替える */}
          <div className="aspect-4/3 border-y-2 border-brand-black md:order-last md:aspect-4/5 md:border-2">
            <img src="/placeholder.jpg" alt="活動の様子" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-4 px-4 pt-8 pb-12 leading-loose md:p-0">
            <h2 className="text-[22px] leading-normal font-bold md:text-3xl">
              「エンジニアになりたい」より
              <br />
              「なにかを作れるようになりたい」
            </h2>
            <p>
              経済・法・経営・国際文化など、文系学部生だけで構成されているのが最大の特徴です。プログラミング未経験で入部するメンバーがほとんどで、「エンジニアになりたい」というより「なにかを作れるようになりたい」という気持ちで集まっています。
            </p>
            <p>
              週1回の活動日には、初心者向けの勉強会やチーム開発の進行、先輩による個別サポートなどを実施。学年やスキルに関係なくフラットに交流できる雰囲気を大切にしています。
            </p>
            <p>
              また、プログラミング活動だけに留まらず、BBQ・ボードゲーム会・文化祭出展といったレクリエーションも定期的に開催。「作ること」と「楽しむこと」、どちらも本気で取り組んでいます。
            </p>
          </div>
        </section>

        {/* [02] 活動内容 */}
        <section className="flex flex-col gap-4 px-4 pb-12 md:px-16 md:pb-20">
          <SectionMarker number="02" label="ACTIVITIES" />
          <h2 className="mt-3 text-[26px] font-bold md:text-3xl">活動内容</h2>
          <div className="grid gap-2 md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
            {ACTIVITIES.map((activity) => (
              <div key={activity.eyebrow} className="flex flex-col border-2 border-brand-black bg-white/50 p-4">
                <p className="mb-6 font-mono text-sm md:mb-12">{activity.eyebrow}</p>
                <h3 className="mb-2 text-2xl font-extrabold md:mb-3">{activity.title}</h3>
                <p className="text-sm leading-relaxed">{activity.text}</p>
                <p className="mt-6 font-mono text-sm font-bold md:mt-auto md:pt-12">{activity.keywords}</p>
              </div>
            ))}
          </div>
        </section>

        {/* [03] 入部案内 */}
        <section className="flex flex-col text-brand-beige md:flex-row">
          <div className="flex flex-col gap-4 bg-brand-black px-4 py-10 md:flex-2 md:p-16">
            <SectionMarker number="03" label="JOIN US" tone="dark" />
            <h2 className="mt-2 text-4xl leading-tight font-bold md:text-6xl">
              未経験から、
              <br />
              はじめよう。
            </h2>
            <p className="leading-loose md:max-w-xl">
              メンバーのほとんどがプログラミング未経験で入部しています。まずは活動日に見学に来てみてください。
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
                href="/members"
                className="flex min-h-13 items-center justify-center border-2 border-brand-beige px-7 font-bold"
              >
                メンバーを見る
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-black/60 px-4 py-6 md:flex-1 md:p-8">
            <TerminalWindow
              fileName="about.sh"
              lines={[
                { text: "$ codemates --about" },
                { text: "文系 × プログラミング", tone: "output" },
                { text: "$ codemates join --beginner" },
                { text: "✓ joining complete", tone: "success" },
                { text: "Welcome! まずは隣の人に hello" },
                { text: "_", tone: "success" },
              ]}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
