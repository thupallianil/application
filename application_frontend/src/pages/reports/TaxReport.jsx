import React, { useState, useEffect } from "react";
import api from "../../api/config";
import Table from "../../components/Table";

export default function TaxReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTax, setTotalTax] = useState(0);

  const columns = ["Invoice", "Client", "Amount", "GST (18%)", "Tax Amount"];

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const res = await api.get("/invoices/");
        let taxSum = 0;
        const formatted = res.data.map((inv) => {
          const amt = parseFloat(inv.amount) || 0;
          const taxAmt = amt * 0.18;
          taxSum += taxAmt;
          return {
            id: inv.id,
            invoice: inv.invoice || `INV-${inv.id}`,
            client: inv.client_name || inv.client,
            amount: `₹${amt.toFixed(2)}`,
            gstRate: "18%",
            taxAmount: `₹${taxAmt.toFixed(2)}`,
          };
        });
        setData(formatted);
        setTotalTax(taxSum);
      } catch (err) {
        console.error("Error fetching tax data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxData();
  }, []);

  if (loading) return <div className="p-8">Loading tax report...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tax Report</h1>

      <div className="bg-white border border-gray-200 p-4 rounded shadow-sm max-w-xs">
        <h3 className="text-gray-500 font-bold mb-1">Total Tax (GST 18%)</h3>
        <p className="text-2xl text-blue-600 font-bold">₹{totalTax.toFixed(2)}</p>
      </div>

      <Table columns={columns} data={data} />
    </div>
  );
}