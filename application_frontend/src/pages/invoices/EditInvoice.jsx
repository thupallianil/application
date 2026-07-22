import { useState } from "react";

export default function EditInvoice() {
  const [invoice, setInvoice] = useState({
    client: "John Doe",
    amount: "20000",
    dueDate: "2026-08-15",
    status: "Pending",
    notes: "Invoice remarks",
  });

  const handleChange = (e) => {
    setInvoice({
      ...invoice,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(invoice);
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Edit Invoice
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >
        <input
          name="client"
          value={invoice.client}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="amount"
          value={invoice.amount}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="date"
          name="dueDate"
          value={invoice.dueDate}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <select
          name="status"
          value={invoice.status}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option>Pending</option>
          <option>Paid</option>
          <option>Overdue</option>
        </select>

        <textarea
          rows="4"
          name="notes"
          value={invoice.notes}
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 md:col-span-2">
          Update Invoice
        </button>
      </form>
    </div>
  );
}