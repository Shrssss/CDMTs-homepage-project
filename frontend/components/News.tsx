import { Badge } from "./ui/badge";

type Props = {
  key: number;
  title: string;
  createdAt: Date;
  category:string;
  thumnailPath:string;
};

const News = ({ thumnailPath,key, title, createdAt,category }: Props) => {
  return (
    <div className="bg-accent p-2" key={key}>
      <Badge variant={"default"}>{category}</Badge>
      <img src={thumnailPath} alt={title} />
      <h3 className="font-semibold mt-2 mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground">
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default News;
