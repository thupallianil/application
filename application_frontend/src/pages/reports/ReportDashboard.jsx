import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function ReportDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    invoices: 0,
    payments: 0,
    clients: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [invoicesRes, paymentsRes, clientsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8001/api/invoices/'),
          axios.get('http://127.0.0.1:8001/api/payments/'),
          axios.get('http://127.0.0.1:8001/api/clients/')
        ]);

        const invoices = invoicesRes.data;
        const totalRevenue = invoices.reduce((acc, inv) => {
          return acc + (parseFloat(inv.amount) || 0);
        }, 0);

        setStats({
          revenue: totalRevenue,
          invoices: invoices.length,
          payments: paymentsRes.data.length,
          clients: clientsRes.data.length
        });
      } catch (err) {
        console.error("Error fetching report stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-[#f0f0f1] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[23px] font-normal leading-[29px] text-[#1d2327]">Reports</h1>
      </div>

      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden mb-8 max-w-6xl">
        <div className="p-4 border-b border-[#c3c4c7]">
          <p className="text-sm text-gray-700">Detailed reporting view.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-gray-200 bg-[#f9f9f9] p-4 text-center">
              <h3 className="text-gray-500 font-bold mb-1">Total Revenue</h3>
              <p className="text-2xl text-blue-600 font-bold">₹{stats.revenue.toFixed(2)}</p>
            </div>
            <div className="border border-gray-200 bg-[#f9f9f9] p-4 text-center">
              <h3 className="text-gray-500 font-bold mb-1">Invoices</h3>
              <p className="text-2xl text-blue-600 font-bold">{stats.invoices}</p>
            </div>
            <div className="border border-gray-200 bg-[#f9f9f9] p-4 text-center">
              <h3 className="text-gray-500 font-bold mb-1">Payments</h3>
              <p className="text-2xl text-blue-600 font-bold">{stats.payments}</p>
            </div>
            <div className="border border-gray-200 bg-[#f9f9f9] p-4 text-center">
              <h3 className="text-gray-500 font-bold mb-1">Clients</h3>
              <p className="text-2xl text-blue-600 font-bold">{stats.clients}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}