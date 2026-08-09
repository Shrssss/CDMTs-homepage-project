import { baseURL } from "@/lib/features/helper"
import * as z from "zod"
import { _fetch } from "@/lib/features/helper"
import { MembersResponseSchema, MemberDetailResponseSchema } from "../types/api"

// GET /api/members （全体取得・検索）
export const searchMember = async ({ grades, name, page, positions }: { name: string, grades: number[], positions: string[], page: number | null }) => {
  const url = new URLSearchParams(`${baseURL}/api/members`)
  url.append("name", name)
  grades.map(grade => url.append("grade", grade.toString()))
  positions.map(position => url.append("position", position))
  if (page) url.append("page", page.toString())
  const data = await _fetch({
    method: "GET",
    body: "",
    url: url.toString()
  })
  return MembersResponseSchema.parse(data)
}


// GET /api/members/{id} （詳細取得／⼀対⼀）
export const getMemberDetail = async ({ id }: { id: number }) => {
  const data=_fetch({
    method:"GET",
    body:"",
    url:`${baseURL}/api/members/${id}`
  })

  return MemberDetailResponseSchema.parse(data)
}

// POST /api/members （メンバー作成）
type MemberCreateRequest = {
  studentId: string,
  email: string,
  password: number
}

export const createMember = async (request: MemberCreateRequest) => {
  const data=await _fetch({
    method:"POST",
    body:JSON.stringify(request),
    url:`${baseURL}/api/members`
  })
  return z.number().parse(data)
}

// POST /api/members/login （メンバーログイン）

type MemberLoginRequest = {
  identifier: string,
  password: string
}

export const loginMember = async (request: MemberLoginRequest) => {
  const data= await _fetch({
    body:JSON.stringify(request),
    method:"POST",
    url:`${baseURL}/api/members/login`
  })
  return z.number().parse(data)
}


// PUT /api/members/{id} （メンバー更新）

type MemberUpdateRequest = {
  id: number,
  name: string,
  email: string,
  studentId: string,
  grade: number,
  position: number,
  password: string,
  technologyIds: number[]
}

export const updateMember = async (request: MemberUpdateRequest) => {
  const { id } = request
  await _fetch({
    method:"PUT",
    body:JSON.stringify(request),
    url:`${baseURL}/api/members/${id}`
  })
}