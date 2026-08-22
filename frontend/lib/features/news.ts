import * as z from "zod";
import { NewsResponseSchema, NewsDetailResponseSchema } from "../types/api";
import { axiosInstance } from "./helper";

// GET /api/news （全体取得・検索）
export const searchNews = async ({
  keyword,
  categories,
  page,
}: {
  keyword: string | null;
  categories: string[] | null;
  page: number | null;
}) => {
  const res = await axiosInstance.get("/api/news", {
    params: {
      keyword,
      categories,
      page,
    },
  });
  return NewsResponseSchema.parse(res.data);
};

// GET /api/news/{id} （詳細取得／⼀対⼀）
export const getNewsDetail = async ({ id }: { id: number }) => {
  const res = await axiosInstance.get(`/api/news/${id}`);
  return NewsDetailResponseSchema.parse(res.data);
};

// POST /api/news （記事作成）
type NewsCreateRequest = {
  title: string;
  content: string;
  thumbnailPath: string;
  category: string;
  isPublished: boolean;
};

export const createNews = async (request: NewsCreateRequest) => {
  const res = await axiosInstance.post("/api/news", request);
  return z.number().parse(res.data);
};

// PUT /api/news/{id} （記事更新）
type NewsUpdateRequest = {
  id: number;
  title: string;
  content: string;
  thumbnailPath: string;
  category: string;
  isPublished: boolean;
};

export const updateNews = async ({
  id,
  request,
}: {
  id: number;
  request: NewsUpdateRequest;
}) => {
  await axiosInstance.put(`/api/news/${id}`, request);
};

// PATCH /api/news/{id}/published （公開状態更新）
export const updateIsPublshedById = async ({
  id,
  isPublished,
}: {
  id: number;
  isPublished: boolean;
}) => {
  await axiosInstance.patch(
    `/api/news/${id}/published`,
    {},
    {
      params: { isPublished },
    },
  );
};
