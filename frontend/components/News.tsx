import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

type Props = {
  id: number;
  title: string;
  createdAt: Date;
  category: string;
  thumbnailPath: string | null;
};

// サムネイルがない記事用のプレースホルダー
export const Thumbnail = ({ src, alt }: { src: string | null; alt: string }) => {
  if (src) {
    // Next.jsの<Image/>はSSGで使えない
    return <img src={src} alt={alt} className="h-full w-full object-cover" />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-brand-black/8 font-mono text-xs text-brand-black/70">
      NO IMAGE
    </div>
  );
};

export const CategoryLabel = ({ category }: { category: string }) => {
  return (
    <span className="border-2 border-brand-black px-2 py-0.5 text-xs font-bold">{category}</span>
  );
};

// 記事カード
const News = ({ id, title, createdAt, category, thumbnailPath }: Props) => {
  const body = (
    <>
      <div className="aspect-video border-b-2 border-brand-black">
        <Thumbnail src={thumbnailPath} alt="" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <CategoryLabel category={category} />
          <time dateTime={createdAt.toISOString()} className="font-mono text-xs">
            {format(createdAt, "yyyy.MM.dd")}
          </time>
        </div>
        <h3 className="text-lg leading-normal font-bold md:text-xl">{title}</h3>
        <span className="mt-auto flex items-center gap-1.5 pt-4 font-mono text-xs font-bold">
          READ MORE
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </>
  );

  return (
    <Link
      href={`/news-detail?id=${id}`}
      className="flex flex-col border-2 border-brand-black bg-white/50 text-gray-900 hover:bg-white/80"
    >
      {body}
    </Link>
  );
};

// トップページのスマホ表示用のコンパクトな行
export const NewsListItem = ({ id, title, createdAt, category, thumbnailPath }: Props) => {
  const body = (
    <>
      <div className="h-[54px] w-24 flex-none border-2 border-brand-black">
        <Thumbnail src={thumbnailPath} alt="" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-mono text-xs">
          {format(createdAt, "yyyy.MM.dd")} / {category}
        </span>
        <span className="leading-normal font-bold">{title}</span>
      </div>
    </>
  );
  return (
    <Link href={`/news-detail?id=${id}`} className="flex gap-3 border-b-2 border-brand-black py-4 text-gray-900">
      {body}
    </Link>
  );
};

export default News;
