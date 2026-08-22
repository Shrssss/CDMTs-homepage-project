"use client";

import Member from "@/components/Member";
import { searchMember } from "@/lib/features/member";
import { useQuery } from "@tanstack/react-query";

const MembersClient = () => {
  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      return await searchMember({
        grades: [],
        name: null,
        page: null,
        positions: [],
      });
    },
  });
  if (membersQuery.isLoading) {
    return (
      <div className="grid grid-cols-1">
        <div className="bg-accent p-2">
          <p className="text-sm">読み込み中</p>
        </div>
      </div>
    );
  }
  if (membersQuery.error) {
    return (
      <div className="grid grid-cols-1">
        <div className="bg-accent p-2">
          <p className="text-sm">エラーが発生しました</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid col-span-4 gap-2">
      {membersQuery.data
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
