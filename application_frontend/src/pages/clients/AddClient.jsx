import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddClient() {
  const [clientType, setClientType] = useState('existing');
  const [client, setClient] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Using the 3 fields available in the backend model
    const clientData = {
      client: client,
      email: email,
      phone: phone
    };

    axios.post('http://127.0.0.1:8001/api/clients/', clientData)
      .then(response => {
        setLoading(false);
        setSuccess(true);
        toast.success("Created successfully!");
        setTimeout(() => {
          navigate('/clients');
        }, 1500);
      })
      .catch(err => {
        setLoading(false);
        console.error("Error adding client", err);
        setError("Failed to add client. Please try again.");
      });
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-2">Add New Client</h1>
      <p className="text-sm text-gray-600 mb-8">
        To create a new client, fill in the details below.
      </p>

      {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
      {success && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">Client added successfully! Redirecting...</div>}

      <div className="max-w-2xl bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Business/Client Name *</label>
              <input required type="text" value={client} onChange={e => setClient(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter Client Name" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">E-mail *</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter valid email" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
              <input required type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Enter phone number" />
            </div>
          </div>

          <div className="pt-4">
            <button disabled={loading} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50">
              {loading ? 'Adding...' : 'Add New Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}