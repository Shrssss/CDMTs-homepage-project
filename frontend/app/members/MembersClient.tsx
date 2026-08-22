"use client";

import Member from "@/components/Member";
import { searchMember } from "@/lib/features/member";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const MembersClient = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const page = searchParams.get("page");

  const members = useQuery({
    queryFn: async () => {
      return await searchMember({
        grades: [],
        name,
        page: parseInt(page ? page : "1"),
        positions: [],
      });
    },
    queryKey: ["members", page, name],
  });
  if (members.isLoading) {
    return (
      <div className="bg-accent p-2 text-muted-foreground">読み込み中</div>
    );
  }
  if (members.error) {
    return (
      <div className="bg-accent p-2 text-muted-foreground">
        エラーが発生しました
      </div>
    );
  }
  return (
    <div className="grid grid-cols-4 gap-2">
      {members.data
        ?.sort((m) => m.id)
        .map((m) => {
          return (
            <Member
              grade={m.grade}
              id={m.id}
              name={m.name}
              position={m.position}
              key={m.id}
            />
          );
        })}
    </div>
  );
};

export default MembersClient;
