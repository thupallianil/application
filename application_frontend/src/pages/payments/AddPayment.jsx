import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddPayment() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [payment, setPayment] = useState({
    payment_id: "",
    client: "",
    amount: "",
    method: "Cash",
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/api/clients/')
      .then(res => setClients(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setPayment({
      ...payment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    axios.post('http://127.0.0.1:8001/api/payments/', payment)
      .then(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => navigate('/payments'), 1500);
      })
      .catch(err => {
        setLoading(false);
        console.error("Error adding payment", err);
        setError("Failed to add payment. Please try again.");
      });
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Add Payment
      </h1>

      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
      {success && <div className="mb-4 text-green-600 font-medium">Payment saved successfully! Redirecting...</div>}

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          required
          name="payment_id"
          placeholder="Payment ID (e.g. PAY-1001)"
          onChange={handleChange}
          value={payment.payment_id}
          className="border rounded-lg p-3"
        />

        <select
          required
          name="client"
          onChange={handleChange}
          value={payment.client}
          className="border rounded-lg p-3"
        >
          <option value="">Select Client</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.client}</option>)}
        </select>

        <input
          required
          name="amount"
          placeholder="Amount"
          onChange={handleChange}
          value={payment.amount}
          className="border rounded-lg p-3"
        />

        <select
          required
          name="method"
          onChange={handleChange}
          value={payment.method}
          className="border rounded-lg p-3"
        >
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Credit Card">Credit Card</option>
        </select>

        <button disabled={loading} className="bg-blue-600 text-white py-3 rounded-lg md:col-span-2 hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Payment'}
        </button>

      </form>

    </div>
  );
}