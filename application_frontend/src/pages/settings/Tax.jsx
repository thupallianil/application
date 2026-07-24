import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import api from '../../services/api';

const API_ENDPOINT = '/settings/tax/';

export default function Tax() {

  const [tax, setTax] = useState({
    taxName: "GST",
    taxRate: "18",
    taxNumber: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get(API_ENDPOINT);
      const fetched = {};
      for (const key in res.data) {
        if (res.data[key] !== null) fetched[key] = res.data[key];
      }
      setTax(prev => ({ ...prev, ...fetched }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.put(API_ENDPOINT, tax);
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings!");
    }
  };


  const handleChange = (e) => {
    setTax({
      ...tax,
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
        Tax Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          name="taxName"
          value={tax.taxName}
          onChange={handleChange}
          placeholder="Tax Name"
          className="border rounded-lg p-3"
        />

        <input
          name="taxRate"
          value={tax.taxRate}
          onChange={handleChange}
          placeholder="Tax Rate (%)"
          className="border rounded-lg p-3"
        />

        <input
          name="taxNumber"
          value={tax.taxNumber}
          onChange={handleChange}
          placeholder="GST Registration Number"
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-blue-600 text-white rounded-lg py-3 md:col-span-2">
          Save Tax Settings
        </button>

      </form>

    </div>
  );
}