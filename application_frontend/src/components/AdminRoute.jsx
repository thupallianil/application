import { Navigate } from "react-router-dom";

/**
 * AdminRoute - Wraps a route so only admins can access it.
 * Clients are redirected to /dashboard.
 */
export default function AdminRoute({ children }) {
    const role = localStorage.getItem("user_role") || "client";
    if (role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}
