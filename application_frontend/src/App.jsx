import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import SettingsLayout from "./layouts/SettingsLayout";

// Authentication
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";

// Settings
import General from "./pages/settings/General";
import Business from "./pages/settings/Business";
import Quotes from "./pages/settings/Quotes";
import Invoices from "./pages/settings/Invoices";
import Payments from "./pages/settings/Payments";
import Tax from "./pages/settings/Tax";
import Emails from "./pages/settings/Emails";
import Pdf from "./pages/settings/Pdf";
import Translate from "./pages/settings/Translate";
import Extras from "./pages/settings/Extras";
import Licenses from "./pages/settings/Licenses";

// Clients
import ClientList from "./pages/clients/ClientList";
import AddClient from "./pages/clients/AddClient";
import EditClient from "./pages/clients/EditClient";
import ViewClient from "./pages/clients/ViewClient";

// Quotations
import QuoteList from "./pages/quotations/QuoteList";
import AddQuote from "./pages/quotations/AddQuote";
import EditQuote from "./pages/quotations/EditQuote";
import QuoteDetails from "./pages/quotations/QuoteDetails";

// Invoices
import InvoiceList from "./pages/invoices/InvoiceList";
import AddInvoice from "./pages/invoices/AddInvoice";
import EditInvoice from "./pages/invoices/EditInvoice";
import InvoiceDetails from "./pages/invoices/InvoiceDetails";

// Payments
import PaymentList from "./pages/payments/PaymentList";
import AddPayment from "./pages/payments/AddPayment";
import EditPayment from "./pages/payments/EditPayment";
import PaymentDetails from "./pages/payments/PaymentDetails";

// Reports
import ReportDashboard from "./pages/reports/ReportDashboard";
import SalesReport from "./pages/reports/SalesReport";
import ExpenseReport from "./pages/reports/ExpenseReport";
import ProfitLoss from "./pages/reports/ProfitLoss";
import TaxReport from "./pages/reports/TaxReport";

// Profile
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";

// System
import System from "./pages/system/System";

// Errors
import NotFound from "./pages/errors/NotFound";
import Unauthorized from "./pages/errors/Unauthorized";
import ServerError from "./pages/errors/ServerError";

// Route Guard
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>

        {/* Public */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Settings - Admin only */}
          <Route element={<SettingsLayout />}>
            <Route path="/settings/general" element={<AdminRoute><General /></AdminRoute>} />
            <Route path="/settings/business" element={<AdminRoute><Business /></AdminRoute>} />
            <Route path="/settings/quotes" element={<AdminRoute><Quotes /></AdminRoute>} />
            <Route path="/settings/invoices" element={<AdminRoute><Invoices /></AdminRoute>} />
            <Route path="/settings/payments" element={<AdminRoute><Payments /></AdminRoute>} />
            <Route path="/settings/tax" element={<AdminRoute><Tax /></AdminRoute>} />
            <Route path="/settings/emails" element={<AdminRoute><Emails /></AdminRoute>} />
            <Route path="/settings/pdf" element={<AdminRoute><Pdf /></AdminRoute>} />
            <Route path="/settings/translate" element={<AdminRoute><Translate /></AdminRoute>} />
            <Route path="/settings/extras" element={<AdminRoute><Extras /></AdminRoute>} />
            <Route path="/settings/licenses" element={<AdminRoute><Licenses /></AdminRoute>} />
          </Route>

          {/* Clients - Admin only */}
          <Route path="/clients" element={<AdminRoute><ClientList /></AdminRoute>} />
          <Route path="/clients/add" element={<AdminRoute><AddClient /></AdminRoute>} />
          <Route path="/clients/:id" element={<AdminRoute><ViewClient /></AdminRoute>} />
          <Route path="/clients/edit/:id" element={<AdminRoute><EditClient /></AdminRoute>} />

          {/* Quotations */}
          <Route path="/quotes" element={<QuoteList />} />
          <Route path="/quotes/add" element={<AddQuote />} />
          <Route path="/quotes/:id" element={<QuoteDetails />} />
          <Route path="/quotes/edit/:id" element={<EditQuote />} />

          {/* Invoices */}
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoices/add" element={<AddInvoice />} />
          <Route path="/invoices/:id" element={<InvoiceDetails />} />
          <Route path="/invoices/edit/:id" element={<EditInvoice />} />

          {/* Payments */}
          <Route path="/payments" element={<PaymentList />} />
          <Route path="/payments/add" element={<AddPayment />} />
          <Route path="/payments/:id" element={<PaymentDetails />} />
          <Route path="/payments/edit/:id" element={<EditPayment />} />

          {/* Reports - Admin only */}
          <Route path="/reports" element={<AdminRoute><ReportDashboard /></AdminRoute>} />
          <Route path="/reports/sales" element={<AdminRoute><SalesReport /></AdminRoute>} />
          <Route path="/reports/expenses" element={<AdminRoute><ExpenseReport /></AdminRoute>} />
          <Route path="/reports/profit-loss" element={<AdminRoute><ProfitLoss /></AdminRoute>} />
          <Route path="/reports/tax" element={<AdminRoute><TaxReport /></AdminRoute>} />

          {/* Profile - Both */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* System - Admin only */}
          <Route path="/system" element={<AdminRoute><System /></AdminRoute>} />

          {/* Error Pages */}
          <Route path="/403" element={<Unauthorized />} />
          <Route path="/500" element={<ServerError />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}