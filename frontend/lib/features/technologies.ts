import {
  TechnologyResponseSchema,
  TechnologyDetailResponseSchema,
  MembersResponseSchema,
  TechnologiesResponseSchema,
} from "../types/api";
import * as z from "zod";
import { axiosInstance } from "./api";

// GET /technologies （全体取得・検索）
export const getTechnologies = async ({
  name,
  page,
}: {
  name?: string;
  page?: number;
}) => {
  const res = await axiosInstance.get("/technologies", {
    params: {
      name,
      page,
    },
  });
  return TechnologyResponseSchema.parse(res.data);
};

// GET /technologies/{id} （詳細取得／⼀対⼀）
export const getTechnologyDetail = async ({ id }: { id: number }) => {
  const res = await axiosInstance.get(`/technologies/${id}`);
  return TechnologyDetailResponseSchema.parse(res.data);
};

// GET /technologies/{id}/members （習得者取得／⼀対多）
export const getSkilledMember = async ({ id }: { id: number }) => {
  const res = await axiosInstance.get(`/technologies/${id}/members`);
  return MembersResponseSchema.parse(res.data);
};

// POST /technologies （技術作成）
export type TechnologyCreateRequest = {
  name: string;
  description: string;
};

export const createTechnology = async (request: TechnologyCreateRequest) => {
  const res = await axiosInstance.post("/technologies", request);
  return z.number().parse(res.data);
};

// PUT /technologies/{id} （技術更新）

export type TechnologyUpdateRequest = {
  id: number;
  name: string;
  description: string;
};

export const updateTechnology = async ({
  id,
  request,
}: {
  id: number;
  request: TechnologyUpdateRequest;
}) => {
  await axiosInstance.put(`/technologies/${id}`, request);
};

// DELETE /technologies/{id} （技術消去）
export const deleteTechnology = async ({ id }: { id: number }) => {
  await axiosInstance.delete(`/technologies/${id}`);
};
