import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import ClientLayout from "../layouts/ClientLayout";

// Auth
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Dashboard
import Dashboard from "../pages/dashboard/Dashboard";

// Settings
import General from "../pages/settings/General";
import Business from "../pages/settings/Business";
import Quotes from "../pages/settings/Quotes";
import Invoices from "../pages/settings/Invoices";
import Payments from "../pages/settings/Payments";
import Tax from "../pages/settings/Tax";
import Emails from "../pages/settings/Emails";
import Pdf from "../pages/settings/Pdf";
import Translate from "../pages/settings/Translate";
import Extras from "../pages/settings/Extras";
import Licenses from "../pages/settings/Licenses";

// Clients
import ClientList from "../pages/clients/ClientList";
import AddClient from "../pages/clients/AddClient";
import EditClient from "../pages/clients/EditClient";
import ViewClient from "../pages/clients/ViewClient";

// Quotations
import QuoteList from "../pages/quotations/QuoteList";
import AddQuote from "../pages/quotations/AddQuote";
import EditQuote from "../pages/quotations/EditQuote";
import QuoteDetails from "../pages/quotations/QuoteDetails";

// Invoices
import InvoiceList from "../pages/invoices/InvoiceList";
import AddInvoice from "../pages/invoices/AddInvoice";
import EditInvoice from "../pages/invoices/EditInvoice";
import InvoiceDetails from "../pages/invoices/InvoiceDetails";

// Payments
import PaymentList from "../pages/payments/PaymentList";
import AddPayment from "../pages/payments/AddPayment";
import EditPayment from "../pages/payments/EditPayment";
import PaymentDetails from "../pages/payments/PaymentDetails";

// Reports
import ReportDashboard from "../pages/reports/ReportDashboard";
import SalesReport from "../pages/reports/SalesReport";
import ExpenseReport from "../pages/reports/ExpenseReport";
import ProfitLoss from "../pages/reports/ProfitLoss";
import TaxReport from "../pages/reports/TaxReport";

// Profile
import Profile from "../pages/profile/Profile";
import ChangePassword from "../pages/profile/ChangePassword";

// Errors
import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";
import ServerError from "../pages/errors/ServerError";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected/Admin Routes */}
        <Route element={<AdminLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          {/* Settings */}
          <Route path="/settings/general" element={<General />} />
          <Route path="/settings/business" element={<Business />} />
          <Route path="/settings/quotes" element={<Quotes />} />
          <Route path="/settings/invoices" element={<Invoices />} />
          <Route path="/settings/payments" element={<Payments />} />
          <Route path="/settings/tax" element={<Tax />} />
          <Route path="/settings/emails" element={<Emails />} />
          <Route path="/settings/pdf" element={<Pdf />} />
          <Route path="/settings/translate" element={<Translate />} />
          <Route path="/settings/extras" element={<Extras />} />
          <Route path="/settings/licenses" element={<Licenses />} />

          {/* Clients */}
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/add" element={<AddClient />} />
          <Route path="/clients/:id" element={<ViewClient />} />
          <Route path="/clients/edit/:id" element={<EditClient />} />

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

          {/* Reports */}
          <Route path="/reports" element={<ReportDashboard />} />
          <Route path="/reports/sales" element={<SalesReport />} />
          <Route path="/reports/expenses" element={<ExpenseReport />} />
          <Route path="/reports/profit-loss" element={<ProfitLoss />} />
          <Route path="/reports/tax" element={<TaxReport />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />

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