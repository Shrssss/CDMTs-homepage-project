import {
  TechnologyResponseSchema,
  TechnologyDetailResponseSchema,
  MembersResponseSchema,
  TechnologiesResponseSchema,
} from "../types/api";
import * as z from "zod";
import { axiosInstance } from "./helper";

// GET /api/technologies （全体取得・検索）
export const getTechnologies = async ({
  name,
  page,
}: {
  name: string;
  page: number | null;
}) => {
  const res = await axiosInstance.get("/api/technologies", {
    params: {
      name,
      page,
    },
  });
  return TechnologyResponseSchema.parse(res.data);
};

// GET /api/technologies/{id} （詳細取得／⼀対⼀）
export const getTechnologyDetail = async ({ id }: { id: number }) => {
  const res = await axiosInstance.get(`/api/technologies/${id}`);
  return TechnologyDetailResponseSchema.parse(res.data);
};

// GET /api/technologies/{id}/members （習得者取得／⼀対多）
export const getSkilledMember = async ({ id }: { id: number }) => {
  const res = await axiosInstance.get(`/api/technologies/${id}/members`);
  return MembersResponseSchema.parse(res.data);
};

// POST /api/technologies （技術作成）
type TechnologyCreateRequest = {
  name: string;
  description: string;
};

export const createTechnology = async (request: TechnologyCreateRequest) => {
  const res = await axiosInstance.post("/api/technologies", request);
  return z.number().parse(res.data);
};

// PUT /api/technologies/{id} （技術更新）

type TechnologyUpdateRequest = {
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
  await axiosInstance.put(`/api/technologies/${id}`, request);
};

// DELETE /api/technologies/{id} （技術消去）
export const deleteTechnologies = async ({ id }: { id: number }) => {
  await axiosInstance.delete(`/api/technologies/${id}`);
};
