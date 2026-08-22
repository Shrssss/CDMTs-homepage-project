import * as z from "zod";
import {
  MembersResponseSchema,
  MemberDetailResponseSchema,
} from "../types/api";
import { axiosInstance } from "./helper";

// GET /api/members （全体取得・検索）
export const searchMember = async ({
  grades,
  name,
  page,
  positions,
}: {
  name: string|null;
  grades: number[];
  positions: string[];
  page: number | null;
}) => {
  const res = await axiosInstance.get("/api/members", {
    params: {
      grades,
      name,
      page,
      positions,
    },
  });
  return MembersResponseSchema.parse(res.data);
};

// GET /api/members/{id} （詳細取得／⼀対⼀）
export const getMemberDetail = async ({ id }: { id: number }) => {
  const res = await axiosInstance.get(`/api/members/${id}`);
  return MemberDetailResponseSchema.parse(res.data);
};

// POST /api/auth （メンバー作成）
type MemberCreateRequest = {
  studentId: string;
  email: string;
  password: number;
};

export const createMember = async (request: MemberCreateRequest) => {
  const res = await axiosInstance.post("/api/auth", request);
  return z.number().parse(res.data);
};

// POST /api/auth/login （メンバーログイン）

type MemberLoginRequest = {
  identifier: string;
  password: string;
};

export const loginMember = async (request: MemberLoginRequest) => {
  const res = await axiosInstance.post("/api/auth/login", request);
  return z.number().parse(res.data);
};

// PUT /api/members/{id} （メンバー更新）

type MemberUpdateRequest = {
  id: number;
  name: string;
  email: string;
  studentId: string;
  grade: number;
  position: number;
  password: string;
  technologyIds: number[];
};

export const updateMember = async (request: MemberUpdateRequest) => {
  const { id } = request;
  await axiosInstance.post(`/api/members/${id}`, request);
};

// POST /api/auth/{id}/passUpdate パスワード更新
type UpdatePasswordRequest = {
  id: number;
  oldPassword: string;
  newPassword: string;
};

export const updatePassword = async (request: UpdatePasswordRequest) => {
  const { id } = request;
  const res = await axiosInstance.post(`/api/auth/${id}/passUpdate`, request);
  return z.number().parse(res.data);
};
