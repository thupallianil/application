import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import { FileText, User, IndianRupee, CheckCircle, Printer, Download } from "lucide-react";
import { useRole } from "../../utils/useRole";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useRole();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/invoices/${id}/`)
      .then((res) => {
        setInvoice(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load invoice details.");
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => window.print();

  const handleDownloadPDF = () => {
    const win = window.open("", "_blank");
    const statusColor =
      invoice.status === "Paid"
        ? "background:#dcfce7;color:#15803d"
        : "background:#fef9c3;color:#a16207";

    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoice?.invoice || id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1d2327; }
            h1 { font-size: 24px; margin-bottom: 4px; }
            .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
            .label { color: #6b7280; font-size: 12px; margin-bottom: 3px; }
            .value { font-weight: 600; font-size: 15px; }
            .badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; ${statusColor}; }
            hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
          </style>
        </head>
        <body>
          <h1>Invoice Details</h1>
          <p class="subtitle">Invoice Reference: ${invoice?.invoice || `INV-${id}`}</p>
          <hr/>
          <div class="grid">
            <div><p class="label">Invoice No</p><p class="value">${invoice?.invoice || "—"}</p></div>
            <div><p class="label">Client</p><p class="value">${invoice?.client_name || invoice?.client || "—"}</p></div>
            <div><p class="label">Amount</p><p class="value">${invoice?.amount || "—"}</p></div>
            <div><p class="label">Status</p><span class="badge">${invoice?.status || "—"}</span></div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  if (loading) return <div className="p-8">Loading invoice details...</div>;
  if (!invoice) return <div className="p-8 text-red-600">Invoice not found.</div>;

  const statusColor =
    invoice.status === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="bg-white rounded-xl shadow p-8 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoice Details</h1>
        <div className="flex gap-2">

          {/* Admin only: Edit */}
          {role === "admin" && (
            <button
              onClick={() => navigate(`/invoices/edit/${id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Edit
            </button>
          )}

          {/* Client only: Print & Download PDF */}
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
            onClick={() => navigate("/invoices")}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium"
          >
            Back
          </button>
        </div>
      </div>

      {/* Details */}
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