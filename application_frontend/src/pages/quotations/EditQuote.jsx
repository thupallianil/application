import { useState } from "react";

export default function EditQuote() {

  const [quote, setQuote] = useState({
    client: "John",
    amount: "15000",
    validTill: "2026-12-31",
    notes: "Quotation Notes",
  });

  const handleChange = (e) => {
    setQuote({
      ...quote,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(quote);
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Edit Quotation
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          name="client"
          value={quote.client}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="amount"
          value={quote.amount}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="date"
          name="validTill"
          value={quote.validTill}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <textarea
          rows="4"
          name="notes"
          value={quote.notes}
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-green-600 text-white py-3 rounded-lg md:col-span-2">
          Update Quote
        </button>

      </form>

    </div>
  );
}