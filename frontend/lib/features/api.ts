import axios from "axios";

export const baseURL = "https://example.com/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});