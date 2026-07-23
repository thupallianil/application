import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function EditPayment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [payment_id, setPaymentId] = useState("");
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayment();
  }, []);

  const fetchPayment = async () => {
    try {
      const [clientsRes, paymentRes] = await Promise.all([
        api.get("/clients/"),
        api.get(`/payments/${id}/`)
      ]);

      setClients(clientsRes.data);

      const data = paymentRes.data;

      setPaymentId(data.payment_id || "");
      setClient(data.client || "");
      setAmount(data.amount || "");
      setMethod(data.method || "Bank Transfer");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch payment details.");
      setError("Failed to fetch payment details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      await api.put(`/payments/${id}/`, {
        payment_id,
        client,
        amount,
        method,
      });

      toast.success("Payment updated successfully!");

      setTimeout(() => {
        navigate("/payments");
      }, 1500);

    } catch (err) {
      console.error(err);

      setSaving(false);

      toast.error("Failed to update payment.");
      setError("Failed to update payment.");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading payment details...
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 bg-[#f0f0f1] min-h-screen">

      <h1 className="text-2xl font-normal text-[#1d2327] mb-6">
        Edit Payment
      </h1>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-5"
      >

        <div>
          <label className="block mb-2 font-medium">
            Payment ID
          </label>

          <input
            type="text"
            value={payment_id}
            onChange={(e) => setPaymentId(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Client
          </label>

          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Client</option>

            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.client}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Amount
          </label>

          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Payment Method
          </label>

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Payment"}
        </button>

      </form>

    </div>
  );
}