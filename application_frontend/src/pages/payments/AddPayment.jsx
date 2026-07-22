import { useState } from "react";

export default function AddPayment() {

  const [payment, setPayment] = useState({
    invoice: "",
    client: "",
    amount: "",
    method: "Cash",
    paymentDate: "",
    notes: "",
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

      <h1 className="text-3xl font-bold mb-8">
        Add Payment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          name="invoice"
          placeholder="Invoice Number"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="client"
          placeholder="Client Name"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="amount"
          placeholder="Amount"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <select
          name="method"
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
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <textarea
          rows="4"
          name="notes"
          placeholder="Payment Notes"
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-blue-600 text-white py-3 rounded-lg md:col-span-2 hover:bg-blue-700">
          Save Payment
        </button>

      </form>

    </div>
  );
}