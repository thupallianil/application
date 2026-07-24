import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FileText, User, IndianRupee, Printer, Download } from "lucide-react";
import api from "../../services/api";
import { useRole } from "../../utils/useRole";

export default function QuoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useRole();

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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Trigger browser print dialog (user can Save as PDF)
    const printContents = document.getElementById("quote-print-area").innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Quotation - ${quote?.quotation_id || id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1d2327; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            .label { color: #6b7280; font-size: 13px; margin-bottom: 2px; }
            .value { font-weight: 600; font-size: 15px; margin-bottom: 16px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; }
            .green { background: #dcfce7; color: #15803d; }
            .yellow { background: #fef9c3; color: #a16207; }
            .red { background: #fee2e2; color: #b91c1c; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  if (loading) {
    return <div className="p-8">Loading quotation details...</div>;
  }

  if (!quote) {
    return <div className="p-8 text-red-600">Quote not found.</div>;
  }

  const statusColorMap = {
    Accepted: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };
  const statusColor = statusColorMap[quote.status] || "bg-gray-100 text-gray-700";

  return (
    <div className="bg-white p-8 rounded-xl shadow space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quotation Details</h1>

        <div className="flex gap-2">
          {/* Admin: Edit button */}
          {role === "admin" && (
            <button
              onClick={() => navigate(`/quotes/edit/${id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Edit
            </button>
          )}

          {/* Client: Print & Download PDF */}
          {role !== "admin" && (
            <>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium"
              >
                <Printer size={15} />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
              >
                <Download size={15} />
                Download PDF
              </button>
            </>
          )}

          <button
            onClick={() => navigate("/quotes")}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium"
          >
            Back
          </button>
        </div>
      </div>

      {/* Printable Content */}
      <div id="quote-print-area">
        <div className="grid md:grid-cols-2 gap-6">

          <div className="flex items-center gap-3">
            <FileText className="text-blue-600 shrink-0" />
            <div>
              <p className="text-gray-500 text-sm label">Quote Number</p>
              <p className="font-semibold value">{quote.quotation_id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="text-blue-600 shrink-0" />
            <div>
              <p className="text-gray-500 text-sm label">Client</p>
              <p className="font-semibold value">{quote.client_name || quote.client}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IndianRupee className="text-blue-600 shrink-0" />
            <div>
              <p className="text-gray-500 text-sm label">Amount</p>
              <p className="font-semibold value">{quote.amount}</p>
            </div>
          </div>

        </div>

        <div className="mt-4">
          <h2 className="font-semibold mb-2">Status</h2>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColor}`}>
            {quote.status}
          </span>
        </div>
      </div>

    </div>
  );
}