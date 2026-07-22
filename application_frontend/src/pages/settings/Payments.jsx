import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = 'http://127.0.0.1:8001/api/settings/payments/';

export default function Payments() {

  const [payment, setPayment] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",
    upi: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(API_URL);
      const fetched = {};
      for (const key in res.data) {
        if (res.data[key] !== null) fetched[key] = res.data[key];
      }
      setPayment(prev => ({ ...prev, ...fetched }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await axios.put(API_URL, payment);
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings!");
    }
  };


  const handleChange = (e) => {
    setPayment({
      ...payment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(e);
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
          value={payment.bankName}
          placeholder="Bank Name"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="accountName"
          value={payment.accountName}
          placeholder="Account Holder"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="accountNumber"
          value={payment.accountNumber}
          placeholder="Account Number"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="ifsc"
          value={payment.ifsc}
          placeholder="IFSC Code"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="upi"
          value={payment.upi}
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