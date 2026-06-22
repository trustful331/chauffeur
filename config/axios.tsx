import store from "../store";
import axios, { type InternalAxiosRequestConfig } from "axios";
import apiEndpoint from "./environment";
import { autoLogout } from "src/utils/session-manager";

type AuthRootState = {
  auth?: {
    token?: string;
  };
};

const axiosClient = axios.create();

const authHeader = (config: InternalAxiosRequestConfig) => {
  const state = store.getState() as AuthRootState;
  const storageToken = localStorage.getItem("STORAGE_TOKEN");
  const token = state.auth?.token || storageToken;

  config.headers = config.headers || {};
  config.headers.set("Authorization", `Bearer ${token}`);
  config.headers.set("Accept", "application/json");
  config.headers.set("Content-Type", "multipart/form-data");

  return config;
};

axiosClient.defaults.baseURL = apiEndpoint;
axiosClient.interceptors.request.use(authHeader);

// Response interceptor for 401 handling
axiosClient.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx causes this function to trigger
    if (error.response?.status === 401) {
      console.log("401 Unauthorized - Auto-logging out");
      autoLogout();
    }
    return Promise.reject(error);
  },
);

export async function getRequest(URL: string) {
  return axiosClient.get(`/${URL}`).then((response) => response.data);
}

export async function postRequest(URL: string, payload: string | FormData) {
  return axiosClient.post(`/${URL}`, payload).then((response) => response.data);
}

export async function patchRequest(URL: string, payload: string | FormData) {
  return axiosClient
    .patch(`/${URL}`, payload)
    .then((response) => response.data);
}

export async function putRequest(URL: string, payload?: string) {
  return axiosClient.put(`/${URL}`, payload).then((response) => response.data);
}

export async function deleteRequest(URL: string) {
  return axiosClient.delete(`/${URL}`).then((response) => response.data);
}
