import Footer from "@/components/Footer";
import Header from "@/components/Header";

// 仮文章
const Page = () => {
  return (
    <div className="max-w-6xl px-6 mx-auto">
      <Header />
      <h1 className="text-5xl font-bold my-8">CODE MATEとは</h1>
      <p className="my-4">
        CODE
        MATESは法政大学多摩キャンパスの文系学部生だけで活動するプログラミングサークルです。「開発」と「レクリエーション」の両方に本気で取り組んでいます。
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <h2 className="text-2xl font-bold my-4">私たちについて</h2>
          <p className="">
            経済・法・経営・国際文化など、文系学部生だけで構成されているのが最大の特徴です。プログラミング未経験で入部するメンバーがほとんどで、「エンジニアになりたい」というより「なにかを作れるようになりたい」という気持ちで集まっています。
          </p>
          <p className="mt-4">週1回の活動日には、初心者向けの勉強会やチーム開発の進行、先輩による個別サポートなどを実施。学年やスキルに関係なくフラットに交流できる雰囲気を大切にしています。</p>
          <p className="mt-4">また、プログラミング活動だけに留まらず、BBQ・ボードゲーム会・文化祭出展といったレクリエーションも定期的に開催。「作ること」と「楽しむこと」、どちらも本気で取り組んでいます。</p>
        </div>
        <div className="bg-accent aspect-2/3" >画像</div>
      </div>
      <h2 className="text-2xl font-bold my-4">活動内容</h2>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-accent p-2">
          <p className="text-primary text-sm">開発</p>
          <h3 className="font-semibold">Webアプリ・LINE Bot・ゲーム制作</h3>
          <p className="text-muted-foreground">チームで企画からリリースまでを経験。GitHubでの共同開発や勉強会も定期的に実施します。</p>
        </div>
        <div className="bg-accent p-2">
          <p className="text-primary text-sm">開発</p>
          <h3 className="font-semibold">Webアプリ・LINE Bot・ゲーム制作</h3>
          <p className="text-muted-foreground">チームで企画からリリースまでを経験。GitHubでの共同開発や勉強会も定期的に実施します。</p>
        </div>
        <div className="bg-accent p-2">
          <p className="text-primary text-sm">開発</p>
          <h3 className="font-semibold">Webアプリ・LINE Bot・ゲーム制作</h3>
          <p className="text-muted-foreground">チームで企画からリリースまでを経験。GitHubでの共同開発や勉強会も定期的に実施します。</p>
        </div>
        <div className="bg-accent p-2">
          <p className="text-primary text-sm">開発</p>
          <h3 className="font-semibold">Webアプリ・LINE Bot・ゲーム制作</h3>
          <p className="text-muted-foreground">チームで企画からリリースまでを経験。GitHubでの共同開発や勉強会も定期的に実施します。</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
