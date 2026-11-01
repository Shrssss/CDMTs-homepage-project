import { cn } from "@/lib/utils";

export type TerminalLine = {
  text: string;
  // prompt: 入力行 / output: 出力 / success: 成功表示(ライム)
  tone?: "prompt" | "output" | "success";
};

type Props = {
  fileName: string;
  lines: TerminalLine[];
  className?: string;
};

// ターミナル風の装飾ウィンドウ
const TerminalWindow = ({ fileName, lines, className }: Props) => {
  return (
    <div className={cn("font-mono", className)}>
      <div className="flex items-center gap-2 bg-brand-beige p-4 text-brand-black">
        <span aria-hidden className="size-3 rounded-full bg-black"></span>
        <span aria-hidden className="size-3 rounded-full bg-black/30"></span>
        <span aria-hidden className="size-3 rounded-full bg-lime-400"></span>
        <p>{fileName}</p>
      </div>
      <div className="bg-black p-4 text-sm leading-loose text-brand-beige/70 md:text-base">
        {lines.map((line, idx) => (
          <p
            key={idx}
            className={cn(
              line.tone === "output" && "text-brand-beige",
              line.tone === "success" && "text-lime-400",
            )}
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default TerminalWindow;
