import Card from "../../components/Card";
import {
  IndianRupee,
  FileText,
  CreditCard,
  Users,
} from "lucide-react";

export default function ReportDashboard() {
  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">
        Reports Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card
          title="Total Revenue"
          value="₹12,50,000"
          icon={<IndianRupee size={28} />}
        />

        <Card
          title="Invoices"
          value="245"
          icon={<FileText size={28} />}
        />

        <Card
          title="Payments"
          value="220"
          icon={<CreditCard size={28} />}
        />

        <Card
          title="Clients"
          value="96"
          icon={<Users size={28} />}
        />

      </div>
    </div>
  );
}