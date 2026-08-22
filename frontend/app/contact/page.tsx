import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EnvelopeIcon, InstagramLogoIcon } from '@phosphor-icons/react/dist/ssr';

// 仮文章
const Page = () => {
  return (
    <div className="max-w-6xl px-6 mx-auto">
      <Header />
      <h1 className="text-4xl font-bold my-6">お問い合わせはこちら</h1>
      <p className="text-muted-foreground my-4">気軽にご連絡ください</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-accent p-2">
          <EnvelopeIcon size={32} />
          hosei.codemates@gmail.com
        </div>
        <div className="bg-accent p-2">
          <InstagramLogoIcon size={32} />
          <Button asChild variant={"link"}>
            <a href="https://www.instagram.com/codemates_hosei/">Instagram</a>
          </Button>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Page