import React, { useState, useEffect } from "react";
import api from "../../api/config";

export default function Dashboard() {
  const [data, setData] = useState({
    clients: 0,
    invoices: 0,
    quotes: 0,
    payments: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, invoicesRes, quotesRes, paymentsRes] = await Promise.all([
          api.get("/clients/"),
          api.get("/invoices/"),
          api.get("/quotes/"),
          api.get("/payments/"),
        ]);

        const invoices = invoicesRes.data;
        const totalRevenue = invoices.reduce((acc, inv) => {
          const amt = parseFloat(inv.amount) || 0;
          return acc + amt;
        }, 0);

        setData({
          clients: clientsRes.data.length,
          invoices: invoices.length,
          quotes: quotesRes.data.length,
          payments: paymentsRes.data.length,
          revenue: totalRevenue,
        });
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-[#f0f0f1] min-h-screen">
      <div className="max-w-6xl">
        <h1 className="text-[23px] font-normal leading-[29px] text-[#1d2327] mb-6">Dashboard</h1>

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

        <div className="bg-white border border-[#c3c4c7] p-6 shadow-sm min-h-[400px]">
          <h2 className="text-lg font-semibold text-[#1d2327] mb-4">Recent Activity</h2>
          <p className="text-[#2c3338] text-sm">Welcome to Ultrakey IT Solutions Private Limited billing panel. Navigation is available on the left.</p>
        </div>
      </div>
    </div>
  );
}