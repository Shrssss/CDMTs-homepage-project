import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr";

import Footer from "@/components/Footer";
import Header from "@/components/header";
import SectionMarker from "@/components/brand/SectionMarker";
import InfoGrid from "@/components/brand/InfoGrid";

const CONTACTS = [
  {
    href: "mailto:hosei.codemates@gmail.com",
    eyebrow: "01 / MAIL",
    caption: "メールで問い合わせる",
    value: "hosei.codemates@gmail.com",
    action: "SEND MAIL",
    icon: <Mail className="size-6 md:size-8" strokeWidth={1.75} />,
    external: false,
  },
  {
    href: "https://www.instagram.com/codemates_hosei/",
    eyebrow: "02 / INSTAGRAM",
    caption: "DMで問い合わせる・活動の様子を見る",
    value: "@codemates_hosei",
    action: "OPEN INSTAGRAM",
    icon: <InstagramLogoIcon className="size-6 md:size-8" />,
    external: true,
  },
];

// TODO: 「[ ]」の回答を確定させる
const FAQ = [
  {
    q: "プログラミング未経験でも参加できますか？",
    a: "はい。メンバーのほとんどが未経験で入部しています。初心者向けの勉強会や先輩の個別サポートがあるので、ゼロから始められます。",
  },
  { q: "見学はできますか？", a: "[見学の受付方法を記入]" },
  { q: "途中からでも入部できますか？", a: "[入部受付の時期を記入]" },
  { q: "パソコンは必要ですか？", a: "[必要な機材・貸出の有無を記入]" },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-brand-beige text-gray-900">
      <Header />
      <main className="flex flex-col gap-12 px-4 pt-8 pb-14 md:gap-18 md:p-16 md:pb-20">
        {/* [01] 連絡先 */}
        <section className="flex flex-col gap-4 md:gap-6">
          <SectionMarker number="01" label="CONTACT" />
          <h1 className="mt-3 text-4xl leading-tight font-bold md:mt-4 md:text-6xl">お問い合わせ</h1>
          <p className="leading-relaxed md:text-lg">
            見学・入部の相談、他団体とのコラボのご相談など、気軽にご連絡ください。
          </p>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {CONTACTS.map((contact) => (
              <a
                key={contact.href}
                href={contact.href}
                {...(contact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-4 border-2 border-brand-black bg-white/50 p-4 text-brand-black hover:bg-white/80 md:flex-col md:items-stretch md:gap-10 md:p-6"
              >
                {/* スマホ: アイコン・テキスト・矢印の横並び / PC: 縦に大きく */}
                <div className="flex size-12 flex-none items-center justify-center bg-brand-black text-brand-beige md:hidden">
                  {contact.icon}
                </div>
                <div className="hidden items-center justify-between md:flex">
                  <span className="font-mono text-sm">{contact.eyebrow}</span>
                  {contact.icon}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 md:gap-2">
                  <span className="font-mono text-xs font-bold md:hidden">
                    {contact.eyebrow.split(" / ")[1]}
                  </span>
                  <span className="hidden text-sm md:block">{contact.caption}</span>
                  <span className="font-bold break-all md:text-2xl">{contact.value}</span>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-xs font-bold">
                  <span className="hidden md:inline">{contact.action}</span>
                  {contact.external ? (
                    <ArrowUpRight className="size-4.5 md:size-3.5" />
                  ) : (
                    <ArrowRight className="size-4.5 md:size-3.5" />
                  )}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* [02] 活動日・場所 */}
        <section className="flex flex-col gap-6">
          <SectionMarker number="02" label="WHEN & WHERE" />
          <InfoGrid
            items={[
              { label: "TIME SCHEDULE", value: "月・火　15:30～" },
              { label: "LOCATION", value: "エッグドーム5F" },
              { label: "FOR", value: "多摩キャンパスの文系学部生" },
            ]}
          />
        </section>

        {/* [03] よくある質問 */}
        <section className="flex flex-col gap-4">
          <SectionMarker number="03" label="FAQ" />
          <h2 className="mt-3 text-[26px] font-bold md:text-3xl">よくある質問</h2>
          <div className="flex flex-col divide-y-2 divide-brand-black border-2 border-brand-black bg-white/50">
            {FAQ.map((item, idx) => (
              <details key={item.q} open={idx === 0} className="group">
                <summary className="flex min-h-11 cursor-pointer list-none items-start gap-3 p-4 text-base leading-relaxed font-bold md:items-center md:gap-4 md:px-6 md:py-5 md:text-lg [&::-webkit-details-marker]:hidden">
                  <span className="flex-none pt-0.5 font-mono text-sm md:pt-0">
                    Q.{String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{item.q}</span>
                  <span aria-hidden className="font-mono text-lg group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="px-4 pb-5 pl-15 text-sm leading-loose md:pr-6 md:pl-20 md:text-base">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
