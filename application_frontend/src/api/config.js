import axios from "axios";

// Uses VITE_API_URL from .env file (e.g. http://127.0.0.1:8001/api or https://your-render-url/api)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export { API_BASE_URL };
export default api;
