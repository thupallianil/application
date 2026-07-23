import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddQuote() {
  const [clients, setClients] = useState([]);
  const [quotation_id, setQuotationId] = useState('');
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8001/api/clients/')
      .then(res => setClients(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const quoteData = {
      quotation_id,
      client,
      amount,
      status
    };

    axios.post('http://127.0.0.1:8001/api/quotes/', quoteData)
      .then(() => {
        setLoading(false);
        setSuccess(true);
        toast.success("Created successfully!");
        setTimeout(() => navigate('/quotes'), 1500);
      })
      .catch(err => {
        setLoading(false);
        console.error("Error adding quote", err);
        setError("Failed to add quote. Please try again.");
      });
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 bg-[#f0f0f1] min-h-screen">
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-normal text-[#1d2327]">Add Quotation</h1>
      </div>

      {error && <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded">Quote added successfully! Redirecting...</div>}

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <form onSubmit={handleSubmit} className="flex-1 w-full space-y-4">
          <input
            type="text"
            required
            value={quotation_id}
            onChange={(e) => setQuotationId(e.target.value)}
            placeholder="Enter Quote ID (e.g. QTE-1001)"
            className="w-full border border-gray-300 p-2 text-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
          />

          <div className="border border-gray-300 bg-white mb-4 rounded-sm shadow-sm p-4">
            <h3 className="font-bold mb-4">Quotation Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Client *</label>
                <select required value={client} onChange={(e) => setClient(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-blue-500">
                  <option value="">Choose client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.client}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Amount (e.g. ₹500) *</label>
                <input type="text" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-blue-500">
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button disabled={loading} type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm font-medium disabled:opacity-50 transition-colors">
                {loading ? 'Saving...' : 'Save Quote'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}