import { cn } from "@/lib/utils";

type Props<T extends string | number> = {
  label: string;
  options: { label: string; value: T | null }[];
  value: T | null;
  onChange: (value: T | null) => void;
};

// 絞り込み用のトグルボタン列（スマホでは横スクロール）
const FilterChips = <T extends string | number>({
  label,
  options,
  value,
  onChange,
}: Props<T>) => {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="font-mono text-xs font-bold tracking-wider">{label}</span>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "min-h-11 flex-none cursor-pointer border-2 border-brand-black px-4 text-sm font-bold whitespace-nowrap",
                selected
                  ? "bg-brand-black text-brand-beige"
                  : "bg-transparent text-brand-black hover:bg-brand-black/10",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterChips;
