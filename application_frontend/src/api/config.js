import axios from "axios";

// Change this single value when switching between local dev and production
const API_BASE_URL = "http://127.0.0.1:8001/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export { API_BASE_URL };
export default api;
