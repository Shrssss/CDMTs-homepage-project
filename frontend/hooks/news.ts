import {
  createNews,
  getNewsDetail,
  NewsCreateRequest,
  NewsUpdateRequest,
  searchNews,
  updateIsPublishedById,
  updateNews,
  uploadThumbnail,
} from "@/lib/features/news";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export const useNews = ({
  categories,
  keyword,
  page,
}: {
  keyword?: string;
  categories?: string[];
  page?: number;
}) => {
  return useQuery({
    queryKey: ["news", categories, keyword, page],
    queryFn: async () => {
      return await searchNews({
        categories,
        keyword,
        page,
      });
    },
  });
};

export const useInfiniteNews = ({
  categories,
  keyword,
}: {
  keyword?: string;
  categories?: string[];
}) => {
  return useInfiniteQuery({
    queryKey: ["infiniteNews", categories, keyword],
    queryFn: async ({ pageParam }) => {
      return await searchNews({ categories, keyword, page: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.length === 0 ? undefined : lastPageParam + 1;
    },
  });
};

export const useNewsDetail = ({ id }: { id: number }) => {
  return useQuery({
    queryFn: async () => {
      return await getNewsDetail({ id });
    },
    queryKey: ["news-detail", id],
  });
};

export const useCreateNewsMutation = (request: NewsCreateRequest) => {
  return useMutation({
    mutationFn: async () => {
      return createNews(request);
    },
  });
};

export const useUpdateNewsMutation = ({
  request,
  id,
}: {
  id: number;
  request: NewsUpdateRequest;
}) => {
  return useMutation({
    mutationFn: async () => {
      return updateNews({
        id,
        request,
      });
    },
  });
};

export const useUpdateIsPublishedByIdMutation = ({
  id,
  isPublished,
}: {
  id: number;
  isPublished: boolean;
}) => {
  return useMutation({
    mutationFn: async () => {
      return updateIsPublishedById({
        id,
        isPublished,
      });
    },
  });
};

export const useUploadThubnailMutation = (file: File) => {
  return useMutation({
    mutationFn: async () => {
      return uploadThumbnail(file);
    },
  });
};
