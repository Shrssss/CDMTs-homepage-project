import axios from "axios";

export const baseURL = "https://example.com";

export const axiosInstance = axios.create({
  url: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});