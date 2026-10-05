import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { EnvelopeIcon, InstagramLogoIcon } from '@phosphor-icons/react/dist/ssr';

// 仮文章
const Page = () => {
  return (
    <div className="bg-brand-beige text-brand-black">
      <Header />
      <div className="min-h-screen p-8 md:p-16">
        <h1 className="text-4xl font-bold">お問い合わせはこちら</h1>
        <p className="text-muted-foreground my-4">気軽にご連絡ください</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 gap-2 border-2 border-brand-black bg-white/50 flex items-center text-brand-black font-semibold text-xl hover:underline">
            <EnvelopeIcon size={32} />
            <a href="mailto:hosei.codemates@gmail.com">hosei.codemates@gmail.com</a>
          </div>
          <div className="p-2 gap-2 border-2 border-brand-black bg-white/50 flex items-center text-brand-black font-semibold text-xl hover:underline">
            <InstagramLogoIcon size={32} />
              <a
                href="https://www.instagram.com/codemates_hosei/"
                className=""
              >
                Instagram
              </a>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Page