import axios from "axios";

// Single source of truth for API base URL — reads from .env (VITE_API_URL)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;