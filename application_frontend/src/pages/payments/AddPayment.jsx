import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function AddPayment() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);

  const [payment, setPayment] = useState({
    payment_id: "",
    client: "",
    amount: "",
    method: "Cash",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients/");
      setClients(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load clients.");
    }
  };

  const handleChange = (e) => {
    setPayment({
      ...payment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post("/payments/", payment);

      setLoading(false);
      setSuccess(true);

      toast.success("Payment created successfully!");

      setTimeout(() => {
        navigate("/payments");
      }, 1500);
    } catch (err) {
      console.error(err);

      setLoading(false);

      setError("Failed to add payment.");
      toast.error("Failed to add payment.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Add Payment
      </h1>

      {error && (
        <div className="mb-4 text-red-600 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 text-green-600 font-medium">
          Payment saved successfully! Redirecting...
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          required
          name="payment_id"
          value={payment.payment_id}
          onChange={handleChange}
          placeholder="Payment ID (e.g. PAY-1001)"
          className="border rounded-lg p-3"
        />

        <select
          required
          name="client"
          value={payment.client}
          onChange={handleChange}
          className="border rounded-lg p-3"
        >
          <option value="">Select Client</option>

          {clients.map((client) => (
            <option
              key={client.id}
              value={client.id}
            >
              {client.client}
            </option>
          ))}
        </select>

        <input
          required
          name="amount"
          value={payment.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="border rounded-lg p-3"
        />

        <select
          required
          name="method"
          value={payment.method}
          onChange={handleChange}
          className="border rounded-lg p-3"
        >
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Credit Card">Credit Card</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg md:col-span-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Payment"}
        </button>

      </form>

    </div>
  );
}