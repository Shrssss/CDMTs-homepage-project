import * as z from "zod";
import {
  NewsResponseSchema,
  NewsDetailResponseSchema,
  ThumbnailUploadResponseSchema,
} from "../types/api";
import { axiosInstance } from "./api";

// TODO: 実際に運用するカテゴリに合わせる
export const NEWS_CATEGORIES = ["お知らせ", "活動報告", "イベント", "LT会"];

// GET /news （全体取得・検索）
export const searchNews = async ({
  keyword,
  categories,
  page,
}: {
  keyword?: string ;
  categories?: string[] ;
  page?: number ;
}) => {
  const res = await axiosInstance.get("/news", {
    params: {
      keyword,
      categories,
      page,
    },
  });
  return NewsResponseSchema.parse(res.data);
};

// GET /news/{id} （詳細取得／⼀対⼀）
export const getNewsDetail = async ({ id }: { id: number }) => {
  const res = await axiosInstance.get(`/news/${id}`);
  return NewsDetailResponseSchema.parse(res.data);
};

// POST /news （記事作成）
export type NewsCreateRequest = {
  title: string;
  content: string;
  thumbnailPath?: string | null;
  category: string;
  isPublished: boolean;
};

export const createNews = async (request: NewsCreateRequest) => {
  const res = await axiosInstance.post("/news", request);
  return z.number().parse(res.data);
};

// PUT /news/{id} （記事更新）
export type NewsUpdateRequest = {
  id: number;
  title: string;
  content: string;
  // null（省略）で送ると画像が解除される。維持する場合は既存の値を送る
  thumbnailPath?: string | null;
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
  await axiosInstance.put(`/news/${id}`, request);
};

// PATCH /news/{id}/published （公開状態更新）
export const updateIsPublishedById = async ({
  id,
  isPublished,
}: {
  id: number;
  isPublished: boolean;
}) => {
  await axiosInstance.patch(
    `/news/${id}/published`,
    {},
    {
      params: { isPublished },
    },
  );
};

// POST /api/news/thumbnail （サムネイル画像アップロード）
export const uploadThumbnail = async (file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await axiosInstance.postForm("/news/thumbnail", fd);
  return ThumbnailUploadResponseSchema.parse(res.data).thumbnailPath;
};

// DELETE /news/{id} （記事削除）
export const deleteNews = async ({ id }: { id: number }) => {
  await axiosInstance.delete(`/news/${id}`);
};
