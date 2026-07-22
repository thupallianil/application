import { useState } from "react";

export default function AddQuote() {

  const [quote, setQuote] = useState({
    client: "",
    amount: "",
    validTill: "",
    notes: "",
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
        Add Quotation
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
          name="validTill"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <textarea
          rows="4"
          name="notes"
          placeholder="Notes"
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-blue-600 text-white py-3 rounded-lg md:col-span-2">
          Save Quote
        </button>

      </form>

    </div>
  );
}