import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request (except auth endpoints)
api.interceptors.request.use(
  (config) => {
    const isAuthEndpoint = config.url?.includes("/auth/");
    const token = localStorage.getItem("auth_token");

    if (token && !isAuthEndpoint) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses — auto-logout on invalid/expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    // "Given token not valid for any token type" → stale token → force logout
    if (
      status === 401 &&
      data?.code === "token_not_valid"
    ) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_role");
      // Redirect to login page
      if (!window.location.pathname.includes("/")) {
        window.location.href = "/";
      }
    }


    // Extract DRF field errors
    if (data) {
      if (typeof data === "string") {
         error.message = data;
      } else if (data.detail) {
         error.message = String(data.detail);
      } else if (data.non_field_errors) {
         error.message = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : String(data.non_field_errors);
      } else {
         const firstKey = Object.keys(data)[0];
         if (firstKey && data[firstKey]) {
            const val = data[firstKey];
            error.message = Array.isArray(val) ? val[0] : String(val);
         }
      }
    }
    console.error("API Error:", {
      status,
      data,
      message: error.message,
    });

    return Promise.reject(error);
  }
);

export default api;