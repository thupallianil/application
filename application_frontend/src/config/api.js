// ============================================================
// Centralized API configuration
// All API calls must use this base URL — never hardcode it.
// ============================================================

export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const ENDPOINTS = {
    clients: `${API_BASE}/clients/`,
    invoices: `${API_BASE}/invoices/`,
    payments: `${API_BASE}/payments/`,
    quotes: `${API_BASE}/quotes/`,
    settings: {
        general: `${API_BASE}/settings/general/`,
        business: `${API_BASE}/settings/business/`,
        system: `${API_BASE}/settings/system/`,
    },
};
