import axios, { type InternalAxiosRequestConfig } from "axios";
import apiEndpoint from "./env";
import { store } from "src/store";
import { clearEmptyStatesLogout } from "src/store/actions/empty/empty.actions";

const axiosClient = axios.create({
  baseURL: apiEndpoint,
  timeout: 25_000,
});

export { apiEndpoint };

function isPublicAuthRoute(url: string) {
  const path = url.replace(/^\//, "");
  return path === "auth/login" || path === "auth/signup";
}

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const url = config.url ?? "";

  config.headers = config.headers ?? {};

  const state = store.getState();
  const storageToken = localStorage.getItem("STORAGE_TOKEN");
  const token = state.auth.token || storageToken;

  config.headers.set("Accept", "application/json");

  if (!isPublicAuthRoute(url) && token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(config.data instanceof FormData)) {
    config.headers.set("Content-Type", "application/json");
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    if (error.response?.status === 401 && !isPublicAuthRoute(url)) {
      store.dispatch(clearEmptyStatesLogout());
      // if (window.location.pathname !== "/signin") {
      //   window.location.assign(
      //     `/signin?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`,
      //   );
      // }
    }
    return Promise.reject(error);
  },
);

export async function getRequest<T = unknown>(url: string): Promise<T> {
  const response = await axiosClient.get<T>(`/${url.replace(/^\//, "")}`);
  return response.data;
}

export async function postRequest<T = unknown>(
  url: string,
  payload: FormData | Record<string, unknown> | string,
): Promise<T> {
  const response = await axiosClient.post<T>(
    `/${url.replace(/^\//, "")}`,
    payload,
  );
  return response.data;
}

export async function patchRequest<T = unknown>(
  url: string,
  payload: FormData | Record<string, unknown> | string,
): Promise<T> {
  const response = await axiosClient.patch<T>(
    `/${url.replace(/^\//, "")}`,
    payload,
  );
  return response.data;
}

export async function putRequest<T = unknown>(
  url: string,
  payload?: FormData | Record<string, unknown> | string,
): Promise<T> {
  const response = await axiosClient.put<T>(
    `/${url.replace(/^\//, "")}`,
    payload,
  );
  return response.data;
}

export async function deleteRequest<T = unknown>(url: string): Promise<T> {
  const response = await axiosClient.delete<T>(`/${url.replace(/^\//, "")}`);
  return response.data;
}
