import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8001/api/settings/invoices/';

export default function Invoices() {
  const [invoice, setInvoice] = useState({
    prefix: "INV",
    nextNumber: "1001",
    dueDays: "30",
    footer: "",
    notes: "",
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
      setInvoice(prev => ({ ...prev, ...fetched }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await axios.put(API_URL, invoice);
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings!");
    }
  };


  const handleChange = (e) => {
    setInvoice({
      ...invoice,
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