import { useState } from "react";

export default function Payments() {

  const [payment, setPayment] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",
    upi: "",
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
        Payment Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          name="bankName"
          placeholder="Bank Name"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="accountName"
          placeholder="Account Holder"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="accountNumber"
          placeholder="Account Number"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="ifsc"
          placeholder="IFSC Code"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="upi"
          placeholder="UPI ID"
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-blue-600 text-white rounded-lg py-3 md:col-span-2">
          Save Payment Details
        </button>

      </form>

    </div>
  );
}