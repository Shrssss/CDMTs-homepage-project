import {
  createNews,
  getNewsDetail,
  NewsCreateRequest,
  NewsUpdateRequest,
  searchNews,
  updateIsPublshedById,
  updateNews,
  uploadThumbnail,
} from "@/lib/features/news";
import { useMutation, useQuery } from "@tanstack/react-query";

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
      return updateIsPublshedById({
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
