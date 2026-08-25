import { createTechnology, deleteTechnology, getSkilledMember, getTechnologies, getTechnologyDetail, TechnologyCreateRequest, TechnologyUpdateRequest, updateTechnology } from "@/lib/features/technologies";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export const useInfiniteTechnologies=({name}:{name:string})=>{
  return useInfiniteQuery({
    queryKey:["infiniteTechnologies",name],
    queryFn:async({pageParam})=>{
      return await getTechnologies({name,page:pageParam})
    },
    initialPageParam:1,
    getNextPageParam:(lastPage,_,lastPageParam)=>{
      return lastPage.length===0 ? undefined : lastPageParam+1
    }
  })
}

export const useTechnologyDetail=({id}:{id:number})=>{
  return useQuery({
    queryFn:()=>{
      return getTechnologyDetail({
        id
      })
    },
    queryKey:["technologyDetail",id]
  })
}

export const useSkilledMember=({id}:{id:number})=>{
  return useQuery({
    queryFn:()=>{
      return getSkilledMember({id})
    },queryKey:["skilledMember",id]
  })
}

export const useCreateTechnologyMutation=(request:TechnologyCreateRequest)=>{
  return useMutation({
    mutationFn:()=>{
      return createTechnology(request)
    }
  })
}

export const useUpdateTechnologyMutation=({id,request}:{id:number,request:TechnologyUpdateRequest})=>{
  return useMutation({
    mutationFn:()=>{
      return updateTechnology({id,request})
    }
  })
}

export const useDelteTechnologyMutation=({id}:{id:number})=>{
  return useMutation({
    mutationFn:()=>{
      return deleteTechnology({id})
    }
  })
}