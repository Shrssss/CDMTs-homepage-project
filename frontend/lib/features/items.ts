import { axiosInstance } from "@/lib/features/helper";
import * as z from "zod";
import {
  ItemResponseSchema,
  ItemDetailResponseSchema,
  ItemRentalHistoriesSchema,
} from "../types/api";

// GET /api/items （全体取得・検索）
export const getSearchItems = async ({
  name,
  storageLocation,
  isDisposable,
  isRentable,
  page,
}: {
  name: string | null;
  storageLocation: string | null;
  isDisposable: boolean | null;
  isRentable: boolean | null;
  page: number;
}) => {
  const res = await axiosInstance.get("/api/items", {
    params: {
      name,
      storageLocation,
      isDisposable,
      isRentable,
      page,
    },
  });
  return ItemResponseSchema.parse(res.data);
};

// GET /api/items/{id} （詳細取得／⼀対⼀）
export const getItemDetail = async ({ id }: { id: string }) => {
  const res = await axiosInstance.get(`/api/items/${id}`);
  return ItemDetailResponseSchema.parse(res.data);
};

// GET /api/items/{id}/history （貸し出し履歴取得／⼀対多）
export const getItemRentalHistories = async ({
  id,
  page,
}: {
  id: string;
  page: number | null;
}) => {
  const res = await axiosInstance.get(`/api/items/${id}/history`, {
    params: {
      id,
      page,
    },
  });
  return ItemRentalHistoriesSchema.parse(res.data);
};

// POST /api/items （備品作成）
type ItemCreateRequest = {
  name: string;
  description: string;
  storageLocaiton: string;
  quantity: number;
  isDisposable: boolean;
  isRentable: boolean;
};

// POST /api/items （備品作成）
export const createItem = async (request: ItemCreateRequest) => {
  const res = await axiosInstance.post("/api/items", request);
  return z.number().parse(res.data);
};

type ItemUpdateRequest = {
  id: number;
  name: string;
  description: string;
  storageLocation: string;
  quantity: number;
  isDisposable: boolean;
  isRentable: boolean;
};

// PUT /api/items/{id} （備品更新）
export const updateItem = async (request: ItemUpdateRequest) => {
  const { id } = request;
  await axiosInstance.put(`/api/items/${id}`, request);
};

// PUT /api/items/rent （貸し出し時の更新）
export const rentItems = async ({
  ids,
  renterId,
}: {
  ids: number[];
  renterId: number;
}) => {
  const res = await axiosInstance.put(
    "/api/items/rent",
    {},
    {
      params: { ids, renterId },
    },
  );
  return z.number().parse(res.data);
};
