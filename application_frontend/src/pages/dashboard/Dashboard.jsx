import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("user_role") || "client";
  const userName = localStorage.getItem("user_name") || "";
  const userEmail = localStorage.getItem("user_email") || "";

  const [data, setData] = useState({
    clients: 0,
    invoices: 0,
    quotes: 0,
    payments: 0,
    revenue: 0,
    pending: 0,
    businessName: "Ultrakey IT Solutions Private Limited",
    recentQuotes: [],
    recentInvoices: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // When in client session, pass ?role=client so backend filters by email
        const clientParams = userRole !== "admin" ? { role: "client" } : {};

        const [clientsRes, invoicesRes, quotesRes, paymentsRes, businessRes] = await Promise.all([
          api.get("/clients/", { params: clientParams }),
          api.get("/invoices/", { params: clientParams }),
          api.get("/quotes/", { params: clientParams }),
          api.get("/payments/", { params: clientParams }),
          api.get("/settings/business/"),
        ]);

        const invoices = invoicesRes.data;
        const quotes = quotesRes.data;
        const payments = paymentsRes.data;

        const totalRevenue = invoices.reduce((acc, inv) => acc + (parseFloat(inv.amount) || 0), 0);

        let pending = 0;
        invoices.forEach(inv => {
          if (inv.status && inv.status.toLowerCase() !== "paid") {
            pending += parseFloat(inv.amount) || 0;
          }
        });

        const recentQuotes = [...quotes].reverse().slice(0, 5);
        const recentInvoices = [...invoices].reverse().slice(0, 5);

        setData({
          clients: clientsRes.data.length,
          invoices: invoices.length,
          quotes: quotes.length,
          payments: payments.length,
          revenue: totalRevenue,
          pending: pending,
          businessName: businessRes.data.businessName || "Ultrakey IT Solutions Private Limited",
          recentQuotes,
          recentInvoices,
        });
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-[#f0f0f1] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-[#f0f0f1] min-h-screen">
      <div className="max-w-6xl">
        <h1 className="text-[23px] font-normal leading-[29px] text-[#1d2327] mb-6">
          Dashboard ({userRole === "admin" ? "Admin" : "Client"})
        </h1>

        {userRole === "admin" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white border border-[#c3c4c7] p-4 shadow-sm">
              <h3 className="text-[#a7aaad] font-semibold text-[13px] uppercase tracking-wider mb-2">Total Revenue</h3>
              <p className="text-2xl font-bold text-[#1d2327]">₹{data.revenue.toFixed(2)}</p>
            </div>
            <div className="bg-white border border-[#c3c4c7] p-4 shadow-sm">
              <h3 className="text-[#a7aaad] font-semibold text-[13px] uppercase tracking-wider mb-2">Invoices</h3>
              <p className="text-2xl font-bold text-[#1d2327]">{data.invoices}</p>
            </div>
            <div className="bg-white border border-[#c3c4c7] p-4 shadow-sm">
              <h3 className="text-[#a7aaad] font-semibold text-[13px] uppercase tracking-wider mb-2">Quotes</h3>
              <p className="text-2xl font-bold text-[#1d2327]">{data.quotes}</p>
            </div>
            <div className="bg-white border border-[#c3c4c7] p-4 shadow-sm">
              <h3 className="text-[#a7aaad] font-semibold text-[13px] uppercase tracking-wider mb-2">Payments</h3>
              <p className="text-2xl font-bold text-[#1d2327]">{data.payments}</p>
            </div>
            <div className="bg-white border border-[#c3c4c7] p-4 shadow-sm">
              <h3 className="text-[#a7aaad] font-semibold text-[13px] uppercase tracking-wider mb-2">Clients</h3>
              <p className="text-2xl font-bold text-[#1d2327]">{data.clients}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-[#c3c4c7] p-4 shadow-sm">
              <h3 className="text-[#a7aaad] font-semibold text-[13px] uppercase tracking-wider mb-2">My Quotations</h3>
              <p className="text-2xl font-bold text-[#1d2327]">{data.quotes}</p>
            </div>
            <div className="bg-white border border-[#c3c4c7] p-4 shadow-sm">
              <h3 className="text-[#a7aaad] font-semibold text-[13px] uppercase tracking-wider mb-2">My Invoices</h3>
              <p className="text-2xl font-bold text-[#1d2327]">{data.invoices}</p>
            </div>
            <div className="bg-white border border-[#c3c4c7] p-4 shadow-sm">
              <h3 className="text-[#a7aaad] font-semibold text-[13px] uppercase tracking-wider mb-2">Payments Made</h3>
              <p className="text-2xl font-bold text-[#1d2327]">{data.payments}</p>
            </div>
            <div className="bg-white border border-[#c3c4c7] p-4 shadow-sm">
              <h3 className="text-[#a7aaad] font-semibold text-[13px] uppercase tracking-wider mb-2">Pending ₹</h3>
              <p className="text-2xl font-bold text-[#d63638]">₹{data.pending.toFixed(2)}</p>
            </div>
          </div>
        )}

        {userRole === "admin" ? (
          <div className="bg-white border border-[#c3c4c7] p-6 shadow-sm min-h-[400px]">
            <h2 className="text-lg font-semibold text-[#1d2327] mb-4">Recent Activity</h2>
            <p className="text-[#2c3338] text-sm">
              Welcome {userName}! You are logged in as an <strong>{userRole}</strong> in the {data.businessName} billing panel.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Recent Quotations */}
            <div className="bg-white border border-[#c3c4c7] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1d2327] mb-4">Recent Quotations</h2>
              {data.recentQuotes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 px-2 text-xs font-semibold text-[#a7aaad] uppercase">Quote No</th>
                        <th className="py-2 px-2 text-xs font-semibold text-[#a7aaad] uppercase">Status</th>
                        <th className="py-2 px-2 text-xs font-semibold text-[#a7aaad] uppercase">Amount</th>
                        <th className="py-2 px-2 text-xs font-semibold text-[#a7aaad] uppercase text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentQuotes.map((q, idx) => (
                        <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-2 text-sm font-medium">{q.quotation_id || `QT-${q.id}`}</td>
                          <td className="py-3 px-2 text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${q.status === "Accepted" ? "bg-green-100 text-green-700" : q.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {q.status || "Pending"}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-sm">₹{parseFloat(q.amount || 0).toFixed(2)}</td>
                          <td className="py-3 px-2 text-sm text-right">
                            <button
                              onClick={() => navigate(`/quotes/${q.id}`)}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No recent quotations found for your account.</p>
              )}
            </div>

            {/* Recent Invoices */}
            <div className="bg-white border border-[#c3c4c7] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1d2327] mb-4">Recent Invoices</h2>
              {data.recentInvoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 px-2 text-xs font-semibold text-[#a7aaad] uppercase">Invoice No</th>
                        <th className="py-2 px-2 text-xs font-semibold text-[#a7aaad] uppercase">Status</th>
                        <th className="py-2 px-2 text-xs font-semibold text-[#a7aaad] uppercase">Amount</th>
                        <th className="py-2 px-2 text-xs font-semibold text-[#a7aaad] uppercase text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentInvoices.map((inv, idx) => (
                        <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-2 text-sm font-medium">{inv.invoice || `INV-${inv.id}`}</td>
                          <td className="py-3 px-2 text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${inv.status?.toLowerCase() === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {inv.status || "Unpaid"}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-sm">₹{parseFloat(inv.amount || 0).toFixed(2)}</td>
                          <td className="py-3 px-2 text-sm text-right">
                            <button
                              onClick={() => navigate(`/invoices/${inv.id}`)}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No recent invoices found for your account.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}