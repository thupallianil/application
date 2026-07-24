import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CreditCard,
  Calendar,
  User,
  IndianRupee,
  FileText,
  Printer,
  Download,
} from "lucide-react";
import api from "../../services/api";
import { useRole } from "../../utils/useRole";

export default function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useRole();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      const res = await api.get(`/payments/${id}/`);
      setPayment(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payment details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const handleDownloadReceipt = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Payment Receipt - ${payment?.payment_id || id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1d2327; }
            h1 { font-size: 24px; margin-bottom: 4px; }
            .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
            .label { color: #6b7280; font-size: 12px; margin-bottom: 3px; }
            .value { font-weight: 600; font-size: 15px; }
            .badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; background:#dcfce7; color:#15803d; }
            hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
            .receipt-header { display: flex; justify-content: space-between; align-items: flex-start; }
            .receipt-stamp { text-align: right; }
            .stamp-text { font-size: 18px; font-weight: 700; color: #15803d; border: 3px solid #15803d; display: inline-block; padding: 6px 16px; border-radius: 4px; transform: rotate(-10deg); }
          </style>
        </head>
        <body>
          <div class="receipt-header">
            <div>
              <h1>Payment Receipt</h1>
              <p class="subtitle">Receipt ID: ${payment?.payment_id || `PAY-${id}`}</p>
            </div>
            <div class="receipt-stamp">
              <span class="stamp-text">PAID</span>
            </div>
          </div>
          <hr/>
          <div class="grid">
            <div><p class="label">Payment ID</p><p class="value">${payment?.payment_id || "—"}</p></div>
            <div><p class="label">Client</p><p class="value">${payment?.client_name || payment?.client || "—"}</p></div>
            <div><p class="label">Amount</p><p class="value">${payment?.amount || "—"}</p></div>
            <div><p class="label">Payment Method</p><p class="value">${payment?.method || "—"}</p></div>
            <div><p class="label">Payment Date</p><p class="value">${payment?.date || "—"}</p></div>
          </div>
          <hr/>
          <p style="color:#6b7280;font-size:12px;">This is an official payment receipt. Thank you for your payment.</p>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  if (loading) {
    return <div className="p-8">Loading payment details...</div>;
  }

  if (!payment) {
    return <div className="p-8 text-red-600">Payment not found.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-8 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {role !== "admin" ? "Payment Receipt" : "Payment Details"}
        </h1>

        <div className="flex gap-2">

          {/* Admin only: Edit */}
          {role === "admin" && (
            <button
              onClick={() => navigate(`/payments/edit/${id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Edit
            </button>
          )}

          {/* Client only: Print & Download Receipt */}
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
                onClick={handleDownloadReceipt}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
              >
                <Download size={15} />
                Download Receipt
              </button>
            </>
          )}

          <button
            onClick={() => navigate("/payments")}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium"
          >
            Back
          </button>
        </div>
      </div>

      {/* Payment Info */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="flex gap-3">
          <FileText className="text-blue-600 shrink-0" />
          <div>
            <p className="text-gray-500 text-sm">Payment ID</p>
            <p className="font-semibold">{payment.payment_id}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <User className="text-blue-600 shrink-0" />
          <div>
            <p className="text-gray-500 text-sm">Client</p>
            <p className="font-semibold">{payment.client_name || payment.client}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <IndianRupee className="text-blue-600 shrink-0" />
          <div>
            <p className="text-gray-500 text-sm">Amount</p>
            <p className="font-semibold">{payment.amount}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <CreditCard className="text-blue-600 shrink-0" />
          <div>
            <p className="text-gray-500 text-sm">Payment Method</p>
            <p className="font-semibold">{payment.method || "—"}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Calendar className="text-blue-600 shrink-0" />
          <div>
            <p className="text-gray-500 text-sm">Payment Date</p>
            <p className="font-semibold">{payment.date || "N/A"}</p>
          </div>
        </div>

      </div>

      {/* Receipt stamp for client view */}
      {role !== "admin" && (
        <div className="border-t pt-4 flex items-center gap-3">
          <span className="inline-block border-2 border-green-500 text-green-600 px-4 py-1 rounded text-sm font-bold tracking-wider uppercase rotate-[-4deg]">
            PAID
          </span>
          <p className="text-gray-500 text-sm">
            This is an official payment receipt. Thank you for your payment.
          </p>
        </div>
      )}

    </div>
  );
}