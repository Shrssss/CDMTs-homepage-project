import useDebounce from '@/app/hooks/useDebounce';
import { getSearchItems } from '@/lib/features/items';
import { useInfiniteQuery } from '@tanstack/react-query';


const useInfiniteItems = ({name,isDisposable,isRentable,storageLocation}:{
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

export default useInfiniteItems