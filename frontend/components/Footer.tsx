import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col bg-brand-black px-4 py-10 text-brand-beige md:p-16">
      <p className="text-3xl leading-snug font-bold md:text-5xl">
        なにかを、
        <br className="md:hidden" />
        作れるようになろう。
      </p>
      <p className="mt-4 text-sm leading-relaxed md:mt-6 md:text-base">
        法政大学多摩キャンパス、
        <br className="md:hidden" />
        文系学部生のプログラミングサークル
      </p>
      <nav
        aria-label="フッター"
        className="mt-6 grid grid-cols-2 gap-x-4 text-sm font-bold md:mt-10 md:flex md:flex-wrap md:gap-x-6"
      >
        <Link href="/news" className="py-3 underline">記事</Link>
        <Link href="/members" className="py-3 underline">メンバー</Link>
        <Link href="/about" className="py-3 underline">CODE MATESとは</Link>
        <Link href="/contact" className="py-3 underline">お問い合わせ</Link>
      </nav>
      <div className="mt-8 mb-5 w-full border-t-2 border-brand-beige/30 md:mb-8"></div>
      <p className="font-mono text-sm text-brand-beige/70">©2026 CODE MATES</p>
    </footer>
  );
};

export default Footer;
