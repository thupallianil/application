import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CreditCard,
  Calendar,
  User,
  IndianRupee,
  FileText,
} from "lucide-react";
import api from "../../services/api";

export default function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="p-8">
        Loading payment details...
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-8 text-red-600">
        Payment not found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-8 space-y-8">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          Payment Details
        </h1>

        <div className="flex gap-2">

          <button
            onClick={() => navigate(`/payments/edit/${id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Edit
          </button>

          <button
            onClick={() => navigate("/payments")}
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
            <p className="text-gray-500 text-sm">
              Payment ID
            </p>

            <p className="font-semibold">
              {payment.payment_id}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <User className="text-blue-600 shrink-0" />

          <div>
            <p className="text-gray-500 text-sm">
              Client
            </p>

            <p className="font-semibold">
              {payment.client_name || payment.client}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <IndianRupee className="text-blue-600 shrink-0" />

          <div>
            <p className="text-gray-500 text-sm">
              Amount
            </p>

            <p className="font-semibold">
              {payment.amount}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <CreditCard className="text-blue-600 shrink-0" />

          <div>
            <p className="text-gray-500 text-sm">
              Payment Method
            </p>

            <p className="font-semibold">
              {payment.method}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Calendar className="text-blue-600 shrink-0" />

          <div>
            <p className="text-gray-500 text-sm">
              Payment Date
            </p>

            <p className="font-semibold">
              {payment.date || "N/A"}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}