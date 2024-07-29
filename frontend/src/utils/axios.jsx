import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import {
  getAccessToken,
  getRefreshToken,
  getUser,
} from "../hooks/user.actions";

// Create an instance of axios with a custom config
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use environment variable for the base URL
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${getAccessToken()}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => Promise.resolve(res),
  (err) => Promise.reject(err)
);

const refreshAuthLogic = async (failedRequest) => {
  return axios
    .post(
      "/auth/refresh/",
      {
        refresh: getRefreshToken(),
      },
      {
        baseURL: import.meta.env.VITE_API_URL,
      }
    )
    .then((resp) => {
      const { access } = resp.data;
      failedRequest.response.config.headers["Authorization"] =
        "Bearer " + access;
      localStorage.setItem(
        "auth",
        JSON.stringify({ access, refresh: getRefreshToken(), user: getUser() })
      );
    })
    .catch(() => {
      localStorage.removeItem("auth");
    });
};

createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic);

export function fetcher(url) {
  return axiosInstance.get(url).then((res) => res.data);
}

export default axiosInstance;
