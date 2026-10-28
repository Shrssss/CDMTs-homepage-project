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

// バックエンドの ErrorResponse（{ message }）からメッセージを取り出す
export const errorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
};

// 未ログイン（401）・権限なし（403）か
export const isAuthError = (error: unknown) =>
  axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403);
