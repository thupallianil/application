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

// Global print styles injected once — hides sidebar/navbar/footer on print
const PRINT_STYLES = `
@media print {
  [data-print-hide] { display: none !important; }
  .admin-layout-root { display: block !important; }
  .admin-layout-main { display: block !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
  @page { margin: 10mm; size: A4; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // ── Auth Guard ──────────────────────────────────────────────
  const isLoggedIn = !!localStorage.getItem("auth_token");
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // ── Role Guard ──────────────────────────────────────────────
  const userRole = localStorage.getItem("user_role") || "client";
  const isAdminOnly = ADMIN_ONLY_PATHS.some((p) =>
    location.pathname.startsWith(p)
  );
  if (userRole !== "admin" && isAdminOnly) {
    return <Navigate to="/dashboard" replace />;
  }
  // ────────────────────────────────────────────────────────────

  return (
    <>
      {/* Inject print-hiding styles once */}
      <style>{PRINT_STYLES}</style>

      <div className="admin-layout-root flex min-h-screen bg-gray-100">
        <div data-print-hide>
          <Sidebar isOpen={isSidebarOpen} />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div data-print-hide>
            <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>
          <main className="admin-layout-main flex-1 p-6">
            <Outlet />
          </main>
          <div data-print-hide>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}