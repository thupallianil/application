import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../services/api';
import { toast } from "react-toastify";
import { FileText, User, IndianRupee, CheckCircle } from "lucide-react";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/invoices/${id}/`)
      .then(res => {
        setInvoice(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load invoice details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Loading invoice details...</div>;
  if (!invoice) return <div className="p-8 text-red-600">Invoice not found.</div>;

  const statusColor = invoice.status === "Paid"
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700";

  return (
    <div className="bg-white rounded-xl shadow p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoice Details</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/invoices/edit/${id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => navigate("/invoices")}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium"
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex gap-3">
          <FileText className="text-blue-600 shrink-0" />
          <div>
            <p className="text-gray-500 text-sm">Invoice No</p>
            <p className="font-semibold">{invoice.invoice}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <User className="text-blue-600 shrink-0" />
          <div>
            <p className="text-gray-500 text-sm">Client</p>
            <p className="font-semibold">{invoice.client_name || invoice.client}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <IndianRupee className="text-blue-600 shrink-0" />
          <div>
            <p className="text-gray-500 text-sm">Amount</p>
            <p className="font-semibold">{invoice.amount}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <CheckCircle className="text-blue-600 shrink-0" />
          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
              {invoice.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}