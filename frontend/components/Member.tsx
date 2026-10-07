type Props = {
  id: number;
  name: string;
  grade: number;
  position: string | null;
};

const Member = ({ grade, id, name, position }: Props) => {
  return (
    <div key={id} className="bg-accent">
      <h3>{name}</h3>
      <p>
        {grade}{position && `・${position}`}
      </p>
    </div>
  );
};

export default Member;
