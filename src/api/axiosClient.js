import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

axiosClient.interceptors.request.use((config) => {
  config.headers["X-Store-Id"] = import.meta.env.VITE_STORE_ID || "1";

  let sessionId = sessionStorage.getItem("cart_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("cart_session_id", sessionId);
  }

  config.headers["X-Cart-Session-Id"] = sessionId;

  const token = sessionStorage.getItem("customer_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const uploadsUrl = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000";
  return `${uploadsUrl}/${path}`.replace(/([^:]\/)\/+/g, "$1");
};

export default axiosClient;


// import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
// });

// const CART_SESSION_KEY = "lm_cart_session_id";

// const getCartSessionId = () => {
//   let sessionId = localStorage.getItem(CART_SESSION_KEY);

//   if (!sessionId) {
//     sessionId = `cart_${Date.now()}_${Math.random().toString(36).slice(2)}`;
//     localStorage.setItem(CART_SESSION_KEY, sessionId);
//   }

//   return sessionId;
// };
// axiosClient.interceptors.request.use((config) => {
//   config.headers["X-Store-Id"] = import.meta.env.VITE_STORE_ID || "1";

//   let sessionId = sessionStorage.getItem("cart_session_id");
//   if (!sessionId) {
//     sessionId = crypto.randomUUID();
//     sessionStorage.setItem("cart_session_id", sessionId);
//   }

//   config.headers["X-Cart-Session-Id"] = sessionId;

//   const token = sessionStorage.getItem("customer_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });
// axiosClient.interceptors.request.use((config) => {
//   config.headers["X-Store-Id"] = import.meta.env.VITE_STORE_ID || "1";

//   const url = config.url || "";

//   if (url.includes("/cart")) {
//     config.headers["X-Cart-Session-Id"] = getCartSessionId();
//   }
//   // if (url.startsWith("/cart")) {
//   //   config.headers["X-Cart-Session-Id"] = getCartSessionId();
//   // }

//   return config;
// });

// export const getImageUrl = (path) => {
//   if (!path) return "";
//   if (path.startsWith("http")) return path;

//   const uploadsUrl = import.meta.env.VITE_UPLOADS_URL || "";
//   return `${uploadsUrl}/${path}`.replace(/([^:]\/)\/+/g, "$1");
// };

// export default axiosClient;


// import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
// });

// axiosClient.interceptors.request.use((config) => {
//   config.headers["X-Store-Id"] = import.meta.env.VITE_STORE_ID || "1";
//   return config;
// });

// export const getImageUrl = (path) => {
//   if (!path) return "";
//   if (path.startsWith("http")) return path;
//   return `${import.meta.env.VITE_UPLOADS_URL}/${path}`;
// };

// export default axiosClient;


