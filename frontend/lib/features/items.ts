import { axiosInstance } from "@/lib/features/api";
import * as z from "zod";
import {
  ItemsResponseSchema,
  ItemDetailResponseSchema,
  ItemRentalHistoriesResponseSchema,
} from "../types/api";

// GET /items （全体取得・検索）
export const getSearchItems = async ({
  name,
  storageLocation,
  isDisposable,
  isRentable,
  page,
}: {
  name?: string;
  storageLocation?: string[];
  isDisposable?: boolean;
  isRentable?: boolean;
  page?: number;
}) => {
  const res = await axiosInstance.get("/items", {
    params: {
      name,
      storageLocation,
      isDisposable,
      isRentable,
      page,
    },
  });
  return ItemsResponseSchema.parse(res.data);
};

// GET /items/{id} （詳細取得／⼀対⼀）
export const getItemDetail = async ({ id }: { id: number }) => {
  const res = await axiosInstance.get(`/items/${id}`);
  return ItemDetailResponseSchema.parse(res.data);
};

// GET /items/{id}/history （貸し出し履歴取得／⼀対多）
export const getItemRentalHistories = async ({
  id,
  page,
}: {
  id: number;
  page?: number;
}) => {
  const res = await axiosInstance.get(`/items/${id}/history`, {
    params: {
      page,
    },
  });
  return ItemRentalHistoriesResponseSchema.parse(res.data);
};

// POST /items （備品作成）
export type ItemCreateRequest = {
  name: string;
  description: string;
  storageLocation: string;
  quantity: number;
  isDisposable: boolean;
  isRentable: boolean;
};

// POST /items （備品作成）
export const createItem = async (request: ItemCreateRequest) => {
  const res = await axiosInstance.post("/items", request);
  return z.number().parse(res.data);
};

export type ItemUpdateRequest = {
  id: number;
  name: string;
  description: string;
  storageLocation: string;
  quantity: number;
  isDisposable: boolean;
  isRentable: boolean;
};

// PUT /items/{id} （備品更新）
export const updateItem = async (request: ItemUpdateRequest) => {
  const { id } = request;
  await axiosInstance.put(`/items/${id}`, request);
};

// PUT /items/rent/{id}/{renterId} （貸し出し）
export const rentItem = async ({
  id,
  renterId,
}: {
  id: number;
  renterId: number;
}) => {
  const res = await axiosInstance.put(`/items/rent/${id}/${renterId}`);
  return z.number().parse(res.data);
};

// PUT /items/return/{id}/{renterId} （返却）
export const returnItem = async ({
  id,
  renterId,
}: {
  id: number;
  renterId: number;
}) => {
  const res = await axiosInstance.put(`/items/return/${id}/${renterId}`);
  return z.number().parse(res.data);
};

// PUT /items/Availability/{id}/{isRentable} （貸出可否の切り替え）
export const toggleIsRentable = async ({
  id,
  isRentable,
}: {
  id: number;
  isRentable: boolean;
}) => {
  const res = await axiosInstance.put(
    `/items/Availability/${id}/${isRentable}`,
  );
  return z.number().parse(res.data);
};
