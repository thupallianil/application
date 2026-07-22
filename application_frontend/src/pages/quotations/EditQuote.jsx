import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EditQuote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [quote_id, setQuoteId] = useState('');
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Draft');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, quoteRes] = await Promise.all([
          axios.get('http://127.0.0.1:8001/api/clients/'),
          axios.get(`http://127.0.0.1:8001/api/quotes/${id}/`)
        ]);

        setClients(clientsRes.data);
        const data = quoteRes.data;
        setQuoteId(data.quote_id || '');
        setClient(data.client || '');
        setAmount(data.amount || '');
        setStatus(data.status || 'Draft');
      } catch (err) {
        console.error(err);
        setError("Failed to fetch quote details.");
        toast.error("Failed to fetch quote details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const quoteData = { quote_id, client, amount, status };

    try {
      await axios.put(`http://127.0.0.1:8001/api/quotes/${id}/`, quoteData);
      toast.success("Quote updated successfully!");
      setTimeout(() => navigate('/quotes'), 1500);
    } catch (err) {
      setSaving(false);
      console.error(err);
      toast.error("Failed to update quote!");
      setError("Failed to update quote.");
    }
  };

  if (loading) return <div className="p-8">Loading quote details...</div>;

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 bg-[#f0f0f1] min-h-screen">
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-normal text-[#1d2327]">Edit Quotation</h1>
      </div>

      {error && <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <form onSubmit={handleSubmit} className="flex-1 w-full space-y-4">
          <input
            type="text"
            required
            value={quote_id}
            onChange={(e) => setQuoteId(e.target.value)}
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
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Accepted">Accepted</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button disabled={saving} type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50">
                {saving ? 'Updating...' : 'Update Quote'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}