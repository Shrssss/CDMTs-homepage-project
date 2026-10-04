import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Page = () => {
  // 仮文章
  return (
    <div className="text-gray-900 bg-brand-beige">
      <Header />
      <div className="">
        <div className="h-screen relative">
          <div className="w-full h-full absolute bg-linear-90 from-brand-black to-transparent/20">
          </div>
            <div className="absolute text-white p-4 md:p-16">
              <h1 className="text-4xl font-bold leading-normal">
                キャッチフレーズ
                <br />
                キャッチフレーズ
              </h1>
              <h2 className="text-3xl font-bold my-6">キャッチフレーズ</h2>
            </div>
          <img
            src={"/placeholder.jpg"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center p-4 gap-2 font-mono">
          <div className="font-bold text-xs">[01]</div>
          <div className="border-t border-t-gray-700 w-full"></div>
          <div className="font-bold text-xs text-nowrap">WHAT WE DO</div>
        </div>

        <div className="px-4 pb-4 md:px-16 md:mb-16">
          <h2 className="text-2xl font-bold my-4">活動の3つの柱</h2>
          <div className="grid md:grid-cols-3 gap-2">

            <div className="border-black border-2 p-4 bg-white/50">
              <p className="text-sm font-mono mb-16">01 / BUILD</p>
              <p className="font-extrabold text-3xl my-4">チーム開発</p>
              <p className="text-sm">
                3〜5人の小さなチームで、企画・設計・実装・公開までを経験。学期ごとにひとつのプロダクトを育てます。
              </p>
              <p className="mt-16 font-mono font-bold">WEB / APP / CREATIVE CODING</p>
            </div>

            <div className="border-black border-2 p-4 bg-white/50">
              <p className="text-sm font-mono mb-16">02 / LEARN</p>
              <p className="font-extrabold text-3xl my-4">各種講習会</p>
              <p className="text-sm">
                テーマに応じて、不定期に講習会が開催されます。
              </p>
              <p className="mt-16 font-mono font-bold">Text / Test / FeedBack</p>
            </div>

            <div className="border-black border-2 p-4 bg-white/50">
              <p className="text-sm font-mono mb-16">03 / SHARE</p>
              <p className="font-extrabold text-3xl my-4">オフラインLT会</p>
              <p className="text-sm">
                他団体と共同で数か月おきにLT会を企画。
              </p>
              <p className="mt-16 font-mono font-bold">Share / Talk Communication</p>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 text-brand-beige">
          <div className="col-span-2 p-8 bg-brand-black">
            <div className="flex items-center text-white justify-between text-xs gap-2 font-mono">
              <div className="text-lime-300">[02]</div>
              <div className="border-t border-t-white w-full"></div>
              <div className="text-nowrap font-bold">
                BEGINNER FRIENDLY
              </div>
            </div>
            <h2 className=" font-bold text-6xl mt-2">
              なにからしらの文言
            </h2>
            <p className="mt-4">ああああああ</p>
          </div>
          <div className="bg-black/60 p-8 text-brand-black">
            <div className="bg-brand-beige flex items-center gap-2 p-4 font-mono">
              <div className="size-3 bg-black rounded-full"></div>
              <div className="size-3 bg-black/30 rounded-full"></div>
              <div className="size-3 bg-lime-400 rounded-full"></div>
              <p>first-step.sh</p>
            </div>
            <div className="bg-black p-4 text-brand-beige/50 font-mono leading-loose">
              <p>$codemates -philosophy</p>
              <p className="text-brand-beige">理念など</p>
              <p>$codemates join --beginner</p>
              <p className="text-lime-400">✓ joining complete</p>
              <p>Welcome! まずは隣の人に hello 👍</p>
              <p className="text-lime-400">-</p>
            </div>
          </div>
        </div>

        <div className="p-16">
          <div className="flex items-center p-4 gap-2 font-mono">
            <div className="font-bold text-xs">[03]</div>
            <div className="border-t border-t-gray-700 w-full"></div>
            <div className="font-bold text-xs text-nowrap">WHEN & WHERE</div>
          </div>
          <div className="grid md:grid-cols-3 border-black border-2 divide-x-2 mt-8">
            <div className="p-8">
              <p className="text-xs">Time Schedule</p>
              <p className="text-xl font-bold">月・火　15:30～</p>
            </div>
            <div className="p-8">
              <p className="text-xs">LOCATION</p>
              <p className="text-xl font-bold">エッグドーム5F</p>
            </div>
            <div className="p-8">
              <p className="text-xs">そのほかの事項</p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Page;
