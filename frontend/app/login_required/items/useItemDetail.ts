import { getItemDetail } from "@/lib/features/items";
import { useQuery } from "@tanstack/react-query";

const useItems = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ["itemDetail", id],
    queryFn: async () => {
      return await getItemDetail({
        id,
      });
    },
  });
};

export default useItems;
