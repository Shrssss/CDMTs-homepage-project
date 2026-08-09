import { _fetch, baseURL } from "@/lib/features/helper";
import * as z from "zod"
import { NewsResponseSchema, NewsDetailResponseSchema } from "../types/api";

// GET /api/news （全体取得・検索）
export const searchNews=async({keyword,categories,page}:{keyword:string|null,categories:string[]|null,page:number|null})=>{
  const url=new URLSearchParams(`${baseURL}/api/news`)
  if(keyword) url.append("keyword",keyword)
  if(categories) categories.map(c=>url.append("categories",c))
  if(page) url.append("page",page.toString())
    
  const data=await _fetch({
    method:"GET",
    body:"",
    url:url.toString()
  })
  return NewsResponseSchema.parse(data)
}

// GET /api/news/{id} （詳細取得／⼀対⼀）
export const getNewsDetail=async ({id}:{id:number})=>{
  const data=await _fetch({
    url:`${baseURL}/api/news/${id}`,
    method:"GET",
    body:""
  })
  return NewsDetailResponseSchema.parse(data)
}

// POST /api/news （記事作成）
type NewsCreateRequest={
  title:string,
  content:string,
  thumbnailPath:string,
  category:string,
  isPublished:boolean
}

export const createNews=async(request:NewsCreateRequest)=>{
  const data=_fetch({
    method:"POST",
    body:JSON.stringify(request),
    url:`${baseURL}/api/news`
  })
  return z.number().parse(data)
}

// PUT /api/news/{id} （記事更新）
type NewsUpdateRequest={
  id:number,
  title:string,
  content:string,
  thumbnailPath:string,
  category:string,
  isPublished:boolean
}

export const updateNews=async({id,request}:{id:number,request:NewsUpdateRequest})=>{
  await _fetch({
    method:"PUT",
    body:JSON.stringify(request),
    url:`${baseURL}/api/new/${id}`
  })
}

// PATCH /api/news/{id}/published （公開状態更新）
export const updateIsPublshedById=async({id,isPublished}:{id:number,isPublished:boolean})=>{
  const url=new URLSearchParams(`${baseURL}/api/news/${id}/published`)
  url.append("isPublished",isPublished ? "true":"false")
  await _fetch({
    method:"PATCH",
    body:"",
    url:url.toString()
  })
}
