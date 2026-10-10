import { User } from "lucide-react";

type Props = {
  id: number;
  name: string;
  grade: number;
  position: string | null;
};

// メンバーカード
const Member = ({ grade, id, name, position }: Props) => {
  return (
    <div className="flex flex-col gap-3 border-2 border-brand-black bg-white/50 p-3 md:gap-4 md:p-4">
      <div className="flex items-start justify-between">
        <div
          aria-hidden
          className="flex size-12 items-center justify-center bg-brand-black text-brand-beige md:size-16"
        >
          <User className="size-6 md:size-8" strokeWidth={1.5} />
        </div>
        <span className="font-mono text-xs font-bold">No.{String(id).padStart(2, "0")}</span>
      </div>
      <h3 className="text-base font-bold md:text-xl">{name}</h3>
      <div className="flex flex-wrap items-center gap-1.5 text-sm">
        <span className="font-mono">{grade}年</span>
        {position && (
          <span className="border-2 border-brand-black px-1.5 text-xs font-bold">{position}</span>
        )}
      </div>
    </div>
  );
};

export default Member;
