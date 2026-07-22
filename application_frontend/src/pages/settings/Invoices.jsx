import { useState } from "react";

export default function Invoices() {
  const [invoice, setInvoice] = useState({
    prefix: "INV",
    nextNumber: "1001",
    dueDays: "30",
    footer: "",
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
        Invoice Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          name="prefix"
          value={invoice.prefix}
          onChange={handleChange}
          placeholder="Invoice Prefix"
          className="border p-3 rounded-lg"
        />

        <input
          name="nextNumber"
          value={invoice.nextNumber}
          onChange={handleChange}
          placeholder="Next Invoice Number"
          className="border p-3 rounded-lg"
        />

        <input
          name="dueDays"
          value={invoice.dueDays}
          onChange={handleChange}
          placeholder="Due Days"
          className="border p-3 rounded-lg"
        />

        <textarea
          name="footer"
          rows="4"
          onChange={handleChange}
          placeholder="Invoice Footer"
          className="border rounded-lg p-3 md:col-span-2"
        />

        <textarea
          name="notes"
          rows="4"
          onChange={handleChange}
          placeholder="Notes"
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-blue-600 text-white rounded-lg py-3 md:col-span-2">
          Save Invoice Settings
        </button>

      </form>

    </div>
  );
}