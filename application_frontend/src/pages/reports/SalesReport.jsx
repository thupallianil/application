import React, { useState, useEffect } from "react";
import api from "../../api/config";
import Table from "../../components/Table";

export default function SalesReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = ["Invoice", "Client", "Amount", "Status"];

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get("/invoices/");
        const formatted = res.data.map((inv) => ({
          id: inv.id,
          invoice: inv.invoice || `INV-${inv.id}`,
          client: inv.client_name || inv.client,
          amount: inv.amount || "₹0",
          status: inv.status || "Pending",
        }));
        setData(formatted);
      } catch (err) {
        console.error("Error fetching sales data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  if (loading) return <div className="p-8">Loading sales report...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sales Report</h1>
      <Table columns={columns} data={data} />
    </div>
  );
}