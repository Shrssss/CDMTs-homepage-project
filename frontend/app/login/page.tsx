import Footer from "@/components/Footer";
import Header from "@/components/header";
import SectionMarker from "@/components/brand/SectionMarker";
import TerminalWindow from "@/components/brand/TerminalWindow";
import { Metadata } from "next/types";
import LoginForm from "./LoginForm";
import Provider from "../QueryClientProvider";

export const metadata: Metadata = {
  title: "ログイン",
};

const Page = () => {
  return (
    <div className="min-h-screen bg-brand-beige text-brand-black">
      <Header />
      <main className="grid md:grid-cols-5">
        {/* 見出し側 */}
        <section className="flex flex-col gap-4 bg-brand-black px-4 py-10 text-brand-beige md:col-span-2 md:justify-between md:gap-10 md:p-16">
          <div className="flex flex-col gap-4">
            <SectionMarker number="01" label="MEMBERS ONLY" tone="dark" />
            <h1 className="mt-3 text-4xl leading-tight font-bold md:mt-4 md:text-5xl">ログイン</h1>
            <p className="leading-relaxed text-brand-beige/85">
              部員専用ページへようこそ。備品の貸出管理や部員向けの記事は、ログイン後に利用できます。
            </p>
          </div>
          <TerminalWindow
            className="hidden md:block"
            fileName="login.sh"
            lines={[
              { text: "$ codemates login" },
              { text: "学籍番号 / メールアドレス / パスワード", tone: "output" },
              { text: "_", tone: "success" },
            ]}
          />
        </section>

        {/* フォーム側 */}
        <section className="flex flex-col gap-6 px-4 pt-10 pb-14 md:col-span-3 md:justify-center md:p-16">
          <SectionMarker number="02" label="SIGN IN" />
          <div className="border-2 border-brand-black bg-white/50 p-4 md:max-w-xl md:p-8">
            <Provider>
              <LoginForm />
            </Provider>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default Page;
