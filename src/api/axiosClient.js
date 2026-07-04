import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  config.headers["X-Store-Id"] = import.meta.env.VITE_STORE_ID || "1";

  let sessionId = sessionStorage.getItem("cart_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("cart_session_id", sessionId);
  }

  config.headers["X-Cart-Session-Id"] = sessionId;

  // const token = sessionStorage.getItem("customer_token");
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  return config;
});

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const uploadsUrl = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000";
  return `${uploadsUrl}/${path}`.replace(/([^:]\/)\/+/g, "$1");
};

export default axiosClient;
