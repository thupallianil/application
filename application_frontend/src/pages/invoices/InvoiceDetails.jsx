import {
  FileText,
  User,
  Calendar,
  IndianRupee,
  CheckCircle,
} from "lucide-react";

export default function InvoiceDetails() {
  const invoice = {
    number: "INV-1001",
    client: "John Doe",
    amount: "₹20,000",
    status: "Paid",
    issueDate: "22 Jul 2026",
    dueDate: "05 Aug 2026",
    notes: "Payment received successfully.",
  };

  return (
    <div className="bg-white rounded-xl shadow p-8 space-y-8">
      <h1 className="text-3xl font-bold">Invoice Details</h1>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="flex gap-3">
          <FileText className="text-blue-600" />
          <div>
            <p className="text-gray-500">Invoice No</p>
            <p className="font-semibold">{invoice.number}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <User className="text-blue-600" />
          <div>
            <p className="text-gray-500">Client</p>
            <p className="font-semibold">{invoice.client}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <IndianRupee className="text-blue-600" />
          <div>
            <p className="text-gray-500">Amount</p>
            <p className="font-semibold">{invoice.amount}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Calendar className="text-blue-600" />
          <div>
            <p className="text-gray-500">Due Date</p>
            <p>{invoice.dueDate}</p>
          </div>
        </div>

      </div>

      <div className="flex items-center gap-3">
        <CheckCircle className="text-green-600" />
        <span className="px-4 py-2 rounded-full bg-green-100 text-green-700">
          {invoice.status}
        </span>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Notes</h2>
        <p>{invoice.notes}</p>
      </div>
    </div>
  );
}