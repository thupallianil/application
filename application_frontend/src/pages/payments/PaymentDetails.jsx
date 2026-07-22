import {
  CreditCard,
  Calendar,
  User,
  IndianRupee,
  FileText,
} from "lucide-react";

export default function PaymentDetails() {

  const payment = {
    id: "PAY-1001",
    invoice: "INV-1001",
    client: "John Doe",
    amount: "₹20,000",
    method: "UPI",
    date: "22 Jul 2026",
    status: "Completed",
  };

  return (
    <div className="bg-white rounded-xl shadow p-8 space-y-8">

      <h1 className="text-3xl font-bold">
        Payment Details
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="flex gap-3">
          <FileText className="text-blue-600" />
          <div>
            <p className="text-gray-500">Payment ID</p>
            <p>{payment.id}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <User className="text-blue-600" />
          <div>
            <p className="text-gray-500">Client</p>
            <p>{payment.client}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <IndianRupee className="text-blue-600" />
          <div>
            <p className="text-gray-500">Amount</p>
            <p>{payment.amount}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <CreditCard className="text-blue-600" />
          <div>
            <p className="text-gray-500">Payment Method</p>
            <p>{payment.method}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Calendar className="text-blue-600" />
          <div>
            <p className="text-gray-500">Payment Date</p>
            <p>{payment.date}</p>
          </div>
        </div>

      </div>

      <div>
        <span className="px-4 py-2 rounded-full bg-green-100 text-green-700">
          {payment.status}
        </span>
      </div>

    </div>
  );
}