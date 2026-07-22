import { useState } from "react";

export default function EditPayment() {
  const [payment, setPayment] = useState({
    invoice: "INV-1001",
    client: "John Doe",
    amount: "20000",
    method: "UPI",
    paymentDate: "2026-07-22",
    status: "Completed",
    notes: "Payment received successfully.",
  });

  const handleChange = (e) => {
    setPayment({
      ...payment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(payment);
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Payment</h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >
        <input
          name="invoice"
          value={payment.invoice}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="client"
          value={payment.client}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="amount"
          value={payment.amount}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <select
          name="method"
          value={payment.method}
          onChange={handleChange}
          className="border rounded-lg p-3"
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Bank Transfer</option>
          <option>Credit Card</option>
        </select>

        <input
          type="date"
          name="paymentDate"
          value={payment.paymentDate}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <select
          name="status"
          value={payment.status}
          onChange={handleChange}
          className="border rounded-lg p-3"
        >
          <option>Pending</option>
          <option>Completed</option>
          <option>Failed</option>
        </select>

        <textarea
          rows="4"
          name="notes"
          value={payment.notes}
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg md:col-span-2">
          Update Payment
        </button>
      </form>
    </div>
  );
}