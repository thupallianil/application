import React, { useState, useEffect } from "react";
import api from "../../api/config";
import Card from "../../components/Card";
import { TrendingUp, TrendingDown, IndianRupee } from "lucide-react";

export default function ProfitLoss() {
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalPayments: 0,
        netProfit: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invoicesRes, paymentsRes] = await Promise.all([
                    api.get("/invoices/"),
                    api.get("/payments/"),
                ]);

                const totalIncome = invoicesRes.data.reduce(
                    (acc, inv) => acc + (parseFloat(inv.amount) || 0),
                    0
                );

                const totalPayments = paymentsRes.data.reduce(
                    (acc, pay) => acc + (parseFloat(pay.amount) || 0),
                    0
                );

                setStats({
                    totalIncome,
                    totalPayments,
                    netProfit: totalIncome - totalPayments,
                });
            } catch (err) {
                console.error("Error fetching profit/loss data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8">Loading profit & loss report...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Profit & Loss</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <Card
                    title="Total Income (Invoices)"
                    value={`₹${stats.totalIncome.toFixed(2)}`}
                    icon={<TrendingUp size={28} />}
                    color="bg-green-500"
                />
                <Card
                    title="Total Payments"
                    value={`₹${stats.totalPayments.toFixed(2)}`}
                    icon={<TrendingDown size={28} />}
                    color="bg-red-500"
                />
                <Card
                    title="Net Profit"
                    value={`₹${stats.netProfit.toFixed(2)}`}
                    icon={<IndianRupee size={28} />}
                    color="bg-blue-500"
                />
            </div>
        </div>
    );
}
