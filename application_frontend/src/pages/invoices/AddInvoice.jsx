import { useState } from "react";

export default function AddInvoice() {
  const [invoice, setInvoice] = useState({
    client: "",
    amount: "",
    dueDate: "",
    status: "Pending",
    notes: "",
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
        Create Invoice
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >
        <input
          name="client"
          placeholder="Client Name"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="amount"
          placeholder="Amount"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="date"
          name="dueDate"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <select
          name="status"
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
          placeholder="Notes"
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-blue-600 text-white rounded-lg py-3 md:col-span-2">
          Create Invoice
        </button>
      </form>
    </div>
  );
}