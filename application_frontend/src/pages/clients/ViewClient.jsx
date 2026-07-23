import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Mail, Phone, Building2 } from "lucide-react";

export default function ViewClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8001/api/clients/${id}/`)
      .then(res => {
        setClient(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load client details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Loading client details...</div>;
  if (!client) return <div className="p-8 text-red-600">Client not found.</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-2xl mt-4 ml-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Client Details</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/clients/edit/${id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => navigate("/clients")}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium"
          >
            Back
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Building2 className="text-blue-600 shrink-0" />
          <div>
            <h2 className="font-semibold text-gray-500 text-sm">Client Name</h2>
            <p className="text-lg font-medium">{client.client}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Mail className="text-blue-600 shrink-0" />
          <div>
            <h2 className="font-semibold text-gray-500 text-sm">Email</h2>
            <p className="text-lg">{client.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Phone className="text-blue-600 shrink-0" />
          <div>
            <h2 className="font-semibold text-gray-500 text-sm">Phone</h2>
            <p className="text-lg">{client.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}