"use client"

import { useMembers } from "@/hooks/member";

const MemberClient = () => {
  const members=useMembers({
  })
  if(members.isLoading){
    return (<>
      <div className="text-muted-foreground">
        読み込み中...
      </div>
    </>)
  }
  return (<>
    <div>
      {members.data?.map(({name,position,grade})=>{
        return(<>
          <h2>{name}</h2>
          <p>{position}</p>
          {grade}
        </>)
      })}
    </div>
  </>);
};

export default MemberClient;
