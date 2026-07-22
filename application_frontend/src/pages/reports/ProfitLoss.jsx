import Card from "../../components/Card";
import { TrendingUp, TrendingDown, IndianRupee } from "lucide-react";

export default function ProfitLoss() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Profit & Loss</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <Card
                    title="Total Income"
                    value="₹15,00,000"
                    icon={<TrendingUp size={28} />}
                    color="bg-green-500"
                />
                <Card
                    title="Total Expenses"
                    value="₹5,00,000"
                    icon={<TrendingDown size={28} />}
                    color="bg-red-500"
                />
                <Card
                    title="Net Profit"
                    value="₹10,00,000"
                    icon={<IndianRupee size={28} />}
                    color="bg-blue-500"
                />
            </div>
        </div>
    );
}
