import { TechnologyResponseSchema, TechnologyDetailResponseSchema, MembersResponseSchema } from "../types/api";
import { baseURL, _fetch } from "./helper";
import * as z from "zod"

// GET /api/technologies （全体取得・検索）
export const getTechnologies = async ({ name, page }: { name: string, page: number | null }) => {
  const url = new URLSearchParams(`${baseURL}/api/technologies/`)
  if (page) url.append("name", name)
  if (page) url.append("page", page.toString())
  const data = await _fetch({
    method: "GET",
    body: "",
    url: url.toString()
  })
  return TechnologyResponseSchema.parse(data)
}

// GET /api/technologies/{id} （詳細取得／⼀対⼀）
export const getTechnologyDetail = async ({ id }: { id: number }) => {
  const data = await _fetch({
    url: `${baseURL}/api/technologies/${id}`,
    body: "",
    method: "GET"
  })
  return TechnologyDetailResponseSchema.parse(data)
}

// GET /api/technologies/{id}/members （習得者取得／⼀対多）
export const getSkilledMember = async ({ id }: { id: number }) => {
  const data = await _fetch({
    url: `${baseURL}/api/technologies/${id}/members`,
    body: "",
    method: "GET"
  })
  return MembersResponseSchema.parse(data)
}

// POST /api/technologies （技術作成）
type TechnologyCreateRequest = {
  name: string,
  description: string
}

export const createTechnology = async (request: TechnologyCreateRequest) => {
  const data = await _fetch({
    method: "POST",
    url: `${baseURL}/api/technologies`,
    body: JSON.stringify(request)
  })
  return z.number().parse(data)
}

// PUT /api/technologies/{id} （技術更新）

type TechnologyUpdateRequest = {
  id: number,
  name: string,
  description: string
}

export const updateTechnology = async ({ id, request }: { id: number, request: TechnologyUpdateRequest }) => {
  await _fetch({
    method: "PUT",
    url: `${baseURL}/api/technologies/${id}`,
    body: JSON.stringify(request)
  })
}

// DELETE /api/technologies/{id} （技術消去）
export const deleteTechnologies = async ({ id }: { id: number }) => {
  await _fetch({
    method: "DELETE",
    url: `${baseURL}/api/technologies/${id}`,
    body: ""
  })
}