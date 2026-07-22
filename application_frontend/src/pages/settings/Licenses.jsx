import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = 'http://127.0.0.1:8001/api/settings/licenses/';

export default function Licenses() {

  const [license, setLicense] = useState({
    company: "",
    purchaseCode: "",
    licenseKey: "",
    expiry: "",
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
      setLicense(prev => ({ ...prev, ...fetched }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await axios.put(API_URL, license);
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings!");
    }
  };


  const handleChange = (e) => {
    setLicense({
      ...license,
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
        License Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          name="company"
          value={license.company}
          placeholder="Company Name"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="purchaseCode"
          value={license.purchaseCode}
          placeholder="Purchase Code"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="licenseKey"
          value={license.licenseKey}
          placeholder="License Key"
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <input
          type="date"
          name="expiry"
          value={license.expiry}
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg md:col-span-2">
          Save License
        </button>

      </form>

    </div>
  );
}