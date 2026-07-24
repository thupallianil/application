import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ── Auth Guard ──────────────────────────────────────────────
  // If no token is stored, redirect to login page
  const isLoggedIn = !!localStorage.getItem("auth_token");
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
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