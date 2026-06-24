import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  config.headers["X-Store-Id"] = import.meta.env.VITE_STORE_ID || "1";
  return config;
});

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_UPLOADS_URL}/${path}`;
};

export default axiosClient;