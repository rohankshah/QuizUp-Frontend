import axios from "axios";
import { getCookieValue } from "./utils";

export const apiClient = axios.create({
  baseURL: "http://localhost:3001",
});

export const apiClientProtected = axios.create({
  baseURL: "http://localhost:3001",
});

apiClientProtected.interceptors.request.use((config) => {
  const token = getCookieValue("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
