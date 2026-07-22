import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8001/api/settings/general/';

const General = () => {
  const [formData, setFormData] = useState({
    yearStart: '01 Apr',
    yearEnd: '31 Mar',
    preDefinedLineItems: '',
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
      setFormData(prev => ({ ...prev, ...fetched }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await axios.put(API_URL, formData);
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings!");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">General Settings</h2>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4 border-b border-gray-100 pb-6">
          <label className="text-sm font-bold text-gray-700 md:w-1/4 pt-2">Financial Year Start</label>
          <div className="md:w-3/4">
            <input type="text" name="yearStart" value={formData.yearStart} onChange={handleChange} className="border border-gray-300 rounded p-2 text-sm w-full max-w-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-4 border-b border-gray-100 pb-6">
          <label className="text-sm font-bold text-gray-700 md:w-1/4 pt-2">Financial Year End</label>
          <div className="md:w-3/4">
            <input type="text" name="yearEnd" value={formData.yearEnd} onChange={handleChange} className="border border-gray-300 rounded p-2 text-sm w-full max-w-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-4 border-b border-gray-100 pb-6">
          <label className="text-sm font-bold text-gray-700 md:w-1/4 pt-2">Pre-defined Line Items</label>
          <div className="md:w-3/4">
            <textarea name="preDefinedLineItems" rows="5" value={formData.preDefinedLineItems} onChange={handleChange} className="border border-gray-300 rounded p-2 w-full max-w-md text-sm focus:ring-blue-500 focus:border-blue-500" />
            <span className="text-xs text-gray-500 italic mt-2 block">Item 1, Item 2 etc</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium transition-colors">
          Save
        </button>
      </div>
    </div>
  );
};

export default General;
