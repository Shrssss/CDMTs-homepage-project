import { createItem, getItemDetail, getItemRentalHistories, getSearchItems, ItemCreateRequest, ItemUpdateRequest, rentItems, updateItem } from "@/lib/features/items";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import useDebounce from "./useDebounce";

export const useCreateItemMutation = (request:ItemCreateRequest) => {
  return useMutation({
    mutationFn:async()=>{
      return await createItem(request)
    }
  })
}

export const useInfiniteItemRentalHistories = ({ id }: { id: number }) => {
  return useInfiniteQuery({
    queryFn: async ({ pageParam }) => {
      return await getItemRentalHistories({
        id,
        page: pageParam,
      });
    },
    initialPageParam: 1,
    queryKey: ["itemRentalHistories",id],
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.length === 0 ? undefined : lastPageParam + 1;
    },
  });
};

export const useInfiniteItems = ({name,isDisposable,isRentable,storageLocation}:{
  name:string|null,isDisposable:boolean,isRentable:boolean,storageLocation:string|null
}) => {
  const debouncedName=useDebounce(name,500)
  const debouncedStorageLocation=useDebounce(storageLocation,500)
  return useInfiniteQuery({
    queryKey: ["items", name, isDisposable, isRentable, storageLocation],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await getSearchItems({
        name: debouncedName,
        isDisposable,
        isRentable,
        storageLocation: debouncedStorageLocation,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.length === 0 ? undefined : lastPageParam + 1;
    },
  });
}

export const useItemDetail = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ["itemDetail", id],
    queryFn: async () => {
      return await getItemDetail({
        id,
      });
    },
  });
};

export const useRentItemMutation = ({ids,renterId}:{ids:number[],renterId:number}) => {
  return useMutation({
    mutationFn:async()=>{
      await rentItems({
        ids,renterId
      })
    }
  })
}


export const useUpdateItemMutation = (request:ItemUpdateRequest) => {
  return useMutation({
    mutationFn:async()=>{
      return await updateItem(request)
    }
  })
}
