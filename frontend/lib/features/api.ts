import axios from "axios";

export const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  // 配列を grades=1&grades=2 の形式で送る（Spring の List<…> にバインドさせるため）
  paramsSerializer: {
    indexes: null,
  },
});
