import { _fetch, baseURL } from "@/lib/features/helper"
import * as z from "zod"
import { ItemResponseSchema, ItemDetailResponseSchema, ItemRentalHistoriesSchema } from "../types/api"

// GET /api/items （全体取得・検索）
export const getSearchItems = async ({ name, storageLocation, isDisposable, isRentable, page
}: {
  name: string | null,
  storageLocation: string | null,
  isDisposable: boolean | null,
  isRentable: boolean | null,
  page: number
}) => {

  const url = new URLSearchParams(`${baseURL}/api/items`)
  if (name) url.append("name", name)
  if (storageLocation) url.append("storageLocation", storageLocation)
  if (isDisposable) url.append("isDisposable", isDisposable ? "true" : "false")
  if (isRentable) url.append("isRentable", isRentable ? "true" : "false")
  url.append("page", page.toString())
  url.toString()
  const data=await _fetch({
    method:"GET",
    body:"",
    url:url.toString()
  })
  return ItemResponseSchema.parse(await data.json())
  
}

// GET /api/items/{id} （詳細取得／⼀対⼀）
export const getItemDetail = async ({ id }: { id: string }) => {
  const data=await _fetch({
    method:"GET",
    body:"",
    url:`${baseURL}/api/${id}`
  })
  return ItemDetailResponseSchema.parse(data)
}

// GET /api/items/{id}/history （貸し出し履歴取得／⼀対多）
export const getItemRentalHistories = async ({ id, page }: { id: string, page: number | null }) => {
  const url = new URLSearchParams(`${baseURL}/api/items/${id}/history`)
  if (page) {
    url.append("page", page.toString())
  }

  const data=await _fetch({
    method:"GET",
    body:"",
    url:url.toString()
  })
  return ItemRentalHistoriesSchema.parse(data)
}

// POST /api/items （備品作成）
type ItemCreateRequest={
  name:string,
  description:string,
  storageLocaiton:string,
  quantity:number,
  isDisposable:boolean,
  isRentable:boolean
}

// POST /api/items （備品作成）
export const createItem = async ({ name, description,storageLocaiton, quantity, isDisposable, isRentable }: ItemCreateRequest) => {
  const requestBody = {
    name, description, storageLocaiton, quantity, isDisposable, isRentable
  }
  const data=await _fetch({
    method:"POST",
    body:JSON.stringify(requestBody),
    url:`${baseURL}/api/items`
  })
  return z.number().parse(data)
}

// PUT /api/items/{id} （備品更新）
export const updateItem = async ({
  id, name, description, storageLocation, quantity, isDisposable, isRentable
}: { id: number, name: string, description: string, storageLocation: string, quantity: number, isDisposable: boolean, isRentable: boolean }) => {
  const requestBody = { id, name, description, storageLocation, quantity, isDisposable, isRentable }
  await _fetch({
    method:"PUT",
    body:JSON.stringify(requestBody),
    url:`${baseURL}/api/items/${id}`
  })
}

// PUT /api/items/rent （貸し出し時の更新）
export const rentItems=async({
  ids,renterId
}:{
  ids:number[],renterId:number
})=>{
  const url=new URLSearchParams(`${baseURL}/api/items/rent`)
  ids.map(id=>url.append("id",id.toString()))
  url.append("renterId",renterId.toString())
  const data=await _fetch({
    method:"PUT",
    body:"",
    url:url.toString()    
  })
  return z.array(z.number()).parse(data)
}

