import { useState } from "react";

export default function Quotes() {

  const [quote, setQuote] = useState({
    prefix: "QT",
    nextNumber: "1001",
    validity: "30",
    terms: "",
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
        Quotation Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <div>

          <label className="font-medium">
            Quote Prefix
          </label>

          <input
            name="prefix"
            value={quote.prefix}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full mt-2"
          />

        </div>

        <div>

          <label className="font-medium">
            Next Quote Number
          </label>

          <input
            name="nextNumber"
            value={quote.nextNumber}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full mt-2"
          />

        </div>

        <div>

          <label className="font-medium">
            Validity (Days)
          </label>

          <input
            name="validity"
            value={quote.validity}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full mt-2"
          />

        </div>

        <div className="md:col-span-2">

          <label className="font-medium">
            Terms & Conditions
          </label>

          <textarea
            rows="5"
            name="terms"
            onChange={handleChange}
            className="border rounded-lg p-3 w-full mt-2"
          />

        </div>

        <div className="md:col-span-2">

          <label className="font-medium">
            Notes
          </label>

          <textarea
            rows="4"
            name="notes"
            onChange={handleChange}
            className="border rounded-lg p-3 w-full mt-2"
          />

        </div>

        <button className="bg-blue-600 text-white py-3 rounded-lg md:col-span-2 hover:bg-blue-700">
          Save Quote Settings
        </button>

      </form>

    </div>
  );
}