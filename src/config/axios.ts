import axios from "axios";
import apiEndpoint from "./env";
import { store } from "src/store";
import { clearSession } from "src/store/slices/auth";

const client = axios.create({
  baseURL: apiEndpoint,
  timeout: 25_000,
  headers: { Accept: "application/json" },
});

client.interceptors.request.use((config) => {
  const url = config.url ?? "";
  const isAuthRoute =
    url.includes("auth/login") || url.includes("auth/signup");

  if (!isAuthRoute) {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    const isAuthRoute =
      url.includes("auth/login") || url.includes("auth/signup");

    if (error.response?.status === 401 && !isAuthRoute) {
      store.dispatch(clearSession());
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown, fallback: string) {
  const err = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };

  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    fallback
  );
}

export async function apiGet<T>(url: string) {
  const { data } = await client.get<T>(url);
  return data;
}

export async function apiPost<T>(url: string, body?: object) {
  const { data } = await client.post<T>(url, body);
  return data;
}
