/**
 * useRole - Returns the current user role from localStorage.
 * Returns "admin" or "client".
 */
export function useRole() {
    return localStorage.getItem("user_role") || "client";
}

export function isAdmin() {
    return (localStorage.getItem("user_role") || "client") === "admin";
}
