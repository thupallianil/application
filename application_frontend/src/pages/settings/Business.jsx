import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const InfoIcon = () => (
  <svg className="w-5 h-5 mr-3 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

const API_ENDPOINT = '/settings/business/';

export default function Business() {
  const [formData, setFormData] = useState({
    logoUrl: 'https://ultrakeyit.com/wp-content/uploads/2024...',
    businessName: 'Ultrakey IT Solutions Private Limited',
    address: 'Flat No: 204, 2nd Floor, Cyber Residency\nIndira Nagar, Gachibowli,\nHyderabad, Telangana, India-500032\nsupport@ultrakeyit.com',
    extraInfo: '<br>\n<b>GST No:</b> 36AADC05062A1ZU',
    website: 'https://ultrakeyit.com'
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
      await api.put(API_ENDPOINT, formData);
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings!");
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Business Settings</h2>

      <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 flex items-start mb-8 border border-gray-200">
        <InfoIcon />
        <span>All of the Business Details below will be displayed on the Quotes & Invoices.</span>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4 border-b border-gray-100 pb-6">
          <label className="text-sm font-bold text-gray-700 md:w-1/4 pt-2">Logo</label>
          <div className="md:w-3/4">
            <div className="flex items-center gap-3">
              <input type="text" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className="border border-gray-300 rounded p-2 text-sm w-full max-w-md focus:ring-blue-500 focus:border-blue-500" />
              <button className="border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm whitespace-nowrap">Add or upload File</button>
            </div>
            <span className="text-xs text-gray-500 italic mt-2 block">Logo of your business. If no logo is added, the name of your business will be used instead.</span>
            <div className="mt-4 p-2 border border-gray-200 inline-block bg-gray-100/50">
              <div className="w-56 h-16 flex items-center justify-center font-bold text-xl text-blue-900" style={{ backgroundImage: 'radial-gradient(#ccc 1px, transparent 0)', backgroundSize: '10px 10px' }}>
                <span className="bg-white/80 px-2 rounded">Ultrakey</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-4 border-b border-gray-100 pb-6">
          <label className="text-sm font-bold text-gray-700 md:w-1/4 pt-2">Business Name</label>
          <div className="md:w-3/4">
            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="border border-gray-300 rounded p-2 text-sm w-full max-w-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-4 border-b border-gray-100 pb-6">
          <label className="text-sm font-bold text-gray-700 md:w-1/4 pt-2">Address</label>
          <div className="md:w-3/4">
            <textarea name="address" rows="4" value={formData.address} onChange={handleChange} className="border border-gray-300 rounded p-2 w-full max-w-md text-sm focus:ring-blue-500 focus:border-blue-500" />
            <span className="text-xs text-gray-500 italic mt-2 block">Add your full address and format it anyway you like. Basic HTML is allowed.</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-4 border-b border-gray-100 pb-6">
          <label className="text-sm font-bold text-gray-700 md:w-1/4 pt-2">Extra Business Info</label>
          <div className="md:w-3/4">
            <textarea name="extraInfo" rows="3" value={formData.extraInfo} onChange={handleChange} className="border border-gray-300 rounded p-2 w-full max-w-md text-sm focus:ring-blue-500 focus:border-blue-500 font-mono" />
            <span className="text-xs text-gray-500 italic mt-2 block">Extra business info such as Business Number, phone number or email address and format it anyway you like. Basic HTML is allowed.<br />You can add your VAT number or ABN here.</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-4 pb-6">
          <label className="text-sm font-bold text-gray-700 md:w-1/4 pt-2">Website</label>
          <div className="md:w-3/4">
            <input type="text" name="website" value={formData.website} onChange={handleChange} className="border border-gray-300 rounded p-2 text-sm w-full max-w-md focus:ring-blue-500 focus:border-blue-500" />
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
}