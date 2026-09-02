import axios from "axios";

import {
  clearAuthStorage,
  getAccessToken,
} from "../storage/authStorage";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "http://10.223.193.182:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status === 401) {
      await clearAuthStorage();
    }

    return Promise.reject(error);
  }
);

export default api;