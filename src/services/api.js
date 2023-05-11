import axios from "axios";
import config from "../config";
import { getAccessToken, removeAccessToken } from "../utils/cookie";

export const API = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const newConfig = { ...config };
    const token = getAccessToken();
    if (token) {
      newConfig.headers.common.Authorization = token;
    }
    return newConfig;
  },
  (error) => {
    Promise.reject(error);
  }
);

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.status === 401) {
      removeAccessToken();
      window.location.reload();
    }
    return Promise.reject(err);
  }
);
