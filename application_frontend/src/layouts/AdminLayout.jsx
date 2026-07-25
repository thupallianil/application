import { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Routes that ONLY admins can visit
const ADMIN_ONLY_PATHS = [
  "/clients",
  "/settings",
  "/reports",
  "/system",
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // ── Auth Guard ──────────────────────────────────────────────
  const isLoggedIn = !!localStorage.getItem("auth_token");
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // ── Role Guard ──────────────────────────────────────────────
  // If a client tries to visit an admin-only page, redirect to dashboard
  const userRole = localStorage.getItem("user_role") || "client";
  const isAdminOnly = ADMIN_ONLY_PATHS.some((p) =>
    location.pathname.startsWith(p)
  );
  if (userRole !== "admin" && isAdminOnly) {
    return <Navigate to="/dashboard" replace />;
  }
  // ────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}