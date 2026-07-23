import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function AddClient() {
  const [client, setClient] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(false);

    const clientData = {
      client,
      email,
      phone,
    };

    try {
      await api.post("/clients/", clientData);

      setLoading(false);
      setSuccess(true);

      toast.success("Client created successfully!");

      setTimeout(() => {
        navigate("/clients");
      }, 1500);
    } catch (err) {
      setLoading(false);
      console.error(err);

      setError("Failed to add client. Please try again.");
      toast.error("Failed to add client.");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-2">
        Add New Client
      </h1>

      <p className="text-sm text-gray-600 mb-8">
        To create a new client, fill in the details below.
      </p>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Client added successfully! Redirecting...
        </div>
      )}

      <div className="max-w-2xl bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Business / Client Name *
            </label>

            <input
              type="text"
              required
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Enter Client Name"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Email *
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Phone *
            </label>

            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter Phone Number"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add New Client"}
          </button>

        </form>
      </div>
    </div>
  );
}