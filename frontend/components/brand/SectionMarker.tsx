import { cn } from "@/lib/utils";

type Props = {
  number: string;
  label: string;
  // 黒背景の上に置くときは"dark"
  tone?: "light" | "dark";
  className?: string;
};

// [01] ───── WHAT WE DO の形のセクション見出し
const SectionMarker = ({ number, label, tone = "light", className }: Props) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-mono text-xs font-bold tracking-wider",
        className,
      )}
    >
      <span className={cn(tone === "dark" && "text-lime-300")}>[{number}]</span>
      <span
        aria-hidden
        className={cn(
          "w-full border-t",
          tone === "dark" ? "border-white" : "border-gray-700",
        )}
      ></span>
      <span className="text-nowrap">{label}</span>
    </div>
  );
};

export default SectionMarker;
