import { FileText, User, Calendar, IndianRupee } from "lucide-react";

export default function QuoteDetails() {
  const quote = {
    number: "QT-1001",
    client: "John Doe",
    amount: "₹25,000",
    status: "Pending",
    date: "22 Jul 2026",
    validTill: "21 Aug 2026",
    notes: "Thank you for your business.",
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow space-y-6">
      <h1 className="text-3xl font-bold">Quotation Details</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <FileText className="text-blue-600" />
          <div>
            <p className="text-gray-500">Quote No</p>
            <p className="font-semibold">{quote.number}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <User className="text-blue-600" />
          <div>
            <p className="text-gray-500">Client</p>
            <p className="font-semibold">{quote.client}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <IndianRupee className="text-blue-600" />
          <div>
            <p className="text-gray-500">Amount</p>
            <p className="font-semibold">{quote.amount}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="text-blue-600" />
          <div>
            <p className="text-gray-500">Valid Till</p>
            <p className="font-semibold">{quote.validTill}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Status</h2>
        <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700">
          {quote.status}
        </span>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Notes</h2>
        <p>{quote.notes}</p>
      </div>
    </div>
  );
}