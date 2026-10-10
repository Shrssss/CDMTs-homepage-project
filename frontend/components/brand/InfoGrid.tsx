type Props = {
  items: { label: string; value: string }[];
};

// 活動日・場所などを枠線で区切って並べる（スマホでは縦積み）
const InfoGrid = ({ items }: Props) => {
  return (
    <dl className="grid divide-y-2 divide-brand-black border-2 border-brand-black md:grid-cols-3 md:divide-x-2 md:divide-y-0">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1 p-5 md:p-8">
          <dt className="font-mono text-xs">{item.label}</dt>
          <dd className="text-lg font-bold md:text-xl">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default InfoGrid;
