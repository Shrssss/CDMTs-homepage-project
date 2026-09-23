"use client"

import { Button } from "@/components/ui/button";
import { useInfiniteTechnologies } from "@/hooks/technology";

const TechnologiesClient = () => {
  const technologies=useInfiniteTechnologies({
    name:null
  })
  
  return (
    <div>
      {technologies.data?.pages.flat(1).map(technology=>{
        return(<>
          <div key={technology.id}>
            {technology.name}
          </div>
        </>)
      })}
      <Button onClick={()=>{
        technologies.fetchNextPage()
      }}>さらに読み込み</Button>
    </div>
  )
}

export default TechnologiesClient