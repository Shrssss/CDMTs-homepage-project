import * as z from "zod";
import {
  MembersResponseSchema,
  MemberDetailResponseSchema,
} from "../types/api";
import { axiosInstance } from "./api";

// GET /members （全体取得・検索）
export const searchMember = async ({
  grades,
  name,
  page,
  positions,
}: {
  name?: string;
  grades?: number[];
  positions?: string[];
  page?: number;
}) => {
  const res = await axiosInstance.get("/members", {
    params: {
      grades,
      name,
      page,
      positions,
    },
  });
  return MembersResponseSchema.parse(res.data);
};

// GET /members/{id} （詳細取得／⼀対⼀）
export const getMemberDetail = async ({ id }: { id: number }) => {
  const res = await axiosInstance.get(`/members/${id}`);
  return MemberDetailResponseSchema.parse(res.data);
};

// POST /auth （メンバー作成）
export type MemberCreateRequest = {
  studentId: string;
  email: string;
  password: string;
  name:string;
  grade:number;
};

export const createMember = async (request: MemberCreateRequest) => {
  const res = await axiosInstance.post("/auth", request);
  return z.number().parse(res.data);
};

// POST /auth/login （メンバーログイン）

export type MemberLoginRequest = {
  identifier: string;
  password: string;
};

export const loginMember = async (request: MemberLoginRequest) => {
  const res = await axiosInstance.post("/auth/login", request);
  return z.number().parse(res.data);
};

// POST /auth/logout
export const logoutMember=async()=>{
  await axiosInstance.post("/auth/logout")
}

// PUT /members/{id} （メンバー更新）

export type MemberUpdateRequest = {
  id: number;
  name: string;
  email: string;
  studentId: string;
  grade: number;
  position?: string | null;
  technologyIds?: number[];
};

export const updateMember = async (request: MemberUpdateRequest) => {
  const { id } = request;
  await axiosInstance.put(`/members/${id}`, request);
};

// POST /auth/{id}/passUpdate パスワード更新
export type UpdatePasswordRequest = {
  id: number;
  oldPassword: string;
  newPassword: string;
};

export const updatePassword = async (request: UpdatePasswordRequest) => {
  const { id, oldPassword, newPassword } = request;
  // oldPassword / newPassword はクエリパラメータで送る仕様
  const res = await axiosInstance.post(`/auth/${id}/passUpdate`, undefined, {
    params: { oldPassword, newPassword },
  });
  return z.number().parse(res.data);
};

// GET /auth/me （ログイン中のメンバーID）
export const getCurrentMemberId = async () => {
  const res = await axiosInstance.get("/auth/me");
  return z.number().parse(res.data);
};

// GET /auth （未承認メンバーの一覧・管理者のみ）
export const getUnapprovedMembers = async () => {
  const res = await axiosInstance.get("/auth");
  return MembersResponseSchema.parse(res.data);
};

// PATCH /auth/{id}/approve （メンバーの承認・管理者のみ）
export const approveMember = async ({ id }: { id: number }) => {
  const res = await axiosInstance.patch(`/auth/${id}/approve`);
  return z.number().parse(res.data);
};

// PATCH /auth/admin/{id}?role= （ロールの変更・管理者のみ）
export const MEMBER_ROLES = ["MEMBER", "ADMIN"] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export const updateMemberRole = async ({ id, role }: { id: number; role: MemberRole }) => {
  const res = await axiosInstance.patch(`/auth/admin/${id}`, undefined, {
    params: { role },
  });
  return z.number().parse(res.data);
};
