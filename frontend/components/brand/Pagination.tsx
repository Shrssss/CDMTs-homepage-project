import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  hasNext: boolean;
  onChange: (page: number) => void;
};

const base =
  "flex size-11 items-center justify-center border-2 border-brand-black font-mono font-bold";

// APIが総件数を返さないため、前後移動と現在ページのみ表示する
const Pagination = ({ page, hasNext, onChange }: Props) => {
  if (page <= 1 && !hasNext) return null;

  return (
    <nav aria-label="ページ" className="flex justify-center gap-2">
      <button
        type="button"
        aria-label="前のページ"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={cn(base, "cursor-pointer disabled:cursor-not-allowed disabled:opacity-30")}
      >
        <ChevronLeft className="size-5" />
      </button>
      <span aria-current="page" className={cn(base, "bg-brand-black text-brand-beige")}>
        {page}
      </span>
      <button
        type="button"
        aria-label="次のページ"
        disabled={!hasNext}
        onClick={() => onChange(page + 1)}
        className={cn(base, "cursor-pointer disabled:cursor-not-allowed disabled:opacity-30")}
      >
        <ChevronRight className="size-5" />
      </button>
    </nav>
  );
};

export default Pagination;
