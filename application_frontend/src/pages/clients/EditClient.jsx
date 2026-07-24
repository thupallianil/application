import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientData, setClientData] = useState({
    client: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.get(`/clients/${id}/`);
        setClientData({
          client: response.data.client || "",
          email: response.data.email || "",
          phone: response.data.phone || ""
        });
      } catch (err) {
        console.error("Error fetching client", err);
        toast.error("Failed to fetch client details.");
        setError("Failed to fetch client details.");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleChange = (e) => {
    setClientData({
      ...clientData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/clients/${id}/`, clientData);
      toast.success("Client updated successfully!");
      setTimeout(() => navigate('/clients'), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update client!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading client details...</div>;

  return (
    <div className="bg-white rounded-xl shadow p-8 max-w-2xl mt-4 ml-4">
      <h1 className="text-3xl font-bold mb-8">
        Edit Client
      </h1>

      {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">Business/Client Name *</label>
          <input
            required
            name="client"
            value={clientData.client}
            onChange={handleChange}
            placeholder="Enter Client Name"
            className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">E-mail *</label>
          <input
            required
            type="email"
            name="email"
            value={clientData.email}
            onChange={handleChange}
            placeholder="Enter valid email"
            className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
          <input
            required
            name="phone"
            value={clientData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg md:col-span-2 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Updating...' : 'Update Client'}
        </button>
      </form>
    </div>
  );
}