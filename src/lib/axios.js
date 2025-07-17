import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

console.log("API Base URL:", API_BASE_URL);

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error(
      "Response error:",
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);
