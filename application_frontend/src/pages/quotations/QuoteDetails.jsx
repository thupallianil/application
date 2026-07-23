import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FileText, User, IndianRupee } from "lucide-react";
import api from "../../services/api";

export default function QuoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuote();
  }, [id]);

  const fetchQuote = async () => {
    try {
      const res = await api.get(`/quotes/${id}/`);
      setQuote(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load quotation details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading quotation details...
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-8 text-red-600">
        Quote not found.
      </div>
    );
  }

  const statusColorMap = {
    Accepted: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  const statusColor =
    statusColorMap[quote.status] ||
    "bg-gray-100 text-gray-700";

  return (
    <div className="bg-white p-8 rounded-xl shadow space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          Quotation Details
        </h1>

        <div className="flex gap-2">

          <button
            onClick={() => navigate(`/quotes/edit/${id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Edit
          </button>

          <button
            onClick={() => navigate("/quotes")}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium"
          >
            Back
          </button>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="flex items-center gap-3">

          <FileText className="text-blue-600 shrink-0" />

          <div>
            <p className="text-gray-500 text-sm">
              Quote Number
            </p>

            <p className="font-semibold">
              {quote.quotation_id}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <User className="text-blue-600 shrink-0" />

          <div>
            <p className="text-gray-500 text-sm">
              Client
            </p>

            <p className="font-semibold">
              {quote.client_name || quote.client}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <IndianRupee className="text-blue-600 shrink-0" />

          <div>
            <p className="text-gray-500 text-sm">
              Amount
            </p>

            <p className="font-semibold">
              {quote.amount}
            </p>
          </div>

        </div>

      </div>

      <div>

        <h2 className="font-semibold mb-2">
          Status
        </h2>

        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${statusColor}`}
        >
          {quote.status}
        </span>

      </div>

    </div>
  );
}