import { Spinner } from "@/components/ui/spinner";

// 読み込み中のスケルトンカード
export const LoadingCards = ({ count = 3 }: { count?: number }) => {
  return (
    <div role="status" aria-label="読み込み中" className="grid gap-2 md:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col border-2 border-brand-black bg-white/50">
          <div className="flex aspect-video items-center justify-center gap-2 bg-brand-black font-mono text-sm text-brand-beige">
            <Spinner className="size-5" />
            loading...
          </div>
          <div className="flex animate-pulse flex-col gap-3 p-4">
            <div className="flex justify-between">
              <div className="h-6 w-18 bg-brand-black/15"></div>
              <div className="h-4 w-22 bg-brand-black/15"></div>
            </div>
            <div className="h-5 bg-brand-black/15"></div>
            <div className="h-5 w-2/3 bg-brand-black/15"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 取得失敗時の表示
export const ErrorPanel = ({
  command,
  message,
  onRetry,
}: {
  command: string;
  message: string;
  onRetry?: () => void;
}) => {
  return (
    <div role="alert" className="flex flex-col border-2 border-brand-black bg-brand-black text-brand-beige">
      <div className="flex items-center gap-2 bg-brand-beige px-4 py-3 font-mono text-sm text-brand-black">
        <span aria-hidden className="size-3 rounded-full bg-black"></span>
        <span aria-hidden className="size-3 rounded-full bg-black/30"></span>
        <span aria-hidden className="size-3 rounded-full bg-black/30"></span>
        <span>error.log</span>
      </div>
      <div className="flex flex-col gap-1 px-4 py-5 font-mono text-sm leading-loose text-brand-beige/70">
        <p>$ {command}</p>
        <p className="text-brand-beige">✕ {message}</p>
        <p>通信状況を確認して、もう一度お試しください。</p>
      </div>
      {onRetry && (
        <div className="p-4 pt-0">
          <button
            type="button"
            onClick={onRetry}
            className="min-h-12 cursor-pointer bg-brand-beige px-6 font-bold text-brand-black"
          >
            再読み込み
          </button>
        </div>
      )}
    </div>
  );
};

// 検索結果が0件のときの表示
export const EmptyPanel = ({
  unit,
  message,
  onClear,
}: {
  unit: string;
  message: string;
  onClear?: () => void;
}) => {
  return (
    <div className="flex flex-col items-start gap-4 border-2 border-dashed border-brand-black p-6">
      <span className="font-mono text-4xl leading-none font-bold">0 {unit}</span>
      <p className="text-lg leading-relaxed font-bold">{message}</p>
      {onClear && (
        <>
          <p className="text-sm">キーワードを変えるか、絞り込みを外してみてください。</p>
          <button
            type="button"
            onClick={onClear}
            className="min-h-12 cursor-pointer border-2 border-brand-black px-6 font-bold hover:bg-brand-black/10"
          >
            条件をクリア
          </button>
        </>
      )}
    </div>
  );
};
