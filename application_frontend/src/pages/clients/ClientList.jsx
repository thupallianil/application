import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";

const API_URL = "http://127.0.0.1:8001/api/clients/";

export default function ClientList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const columns = [
    "Client Name",
    "Email",
    "Phone",
    "Date",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load Clients");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Client?")) return;
    try {
      await axios.delete(API_URL + id + "/");
      toast.success("Client deleted successfully!");
      fetchData(); // Refresh list
    } catch (error) {
      toast.error("Failed to delete Client");
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/clients/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/clients/${id}`);
  };

  // Format data for Table
  const formattedData = data.map(item => ({
    id: item.id, name: item.name || item.client || "Unknown", email: item.email || "N/A", phone: item.phone || "N/A", date: item.created_at || item.created || "N/A"
  })).filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 bg-[#f0f0f1] min-h-screen p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1d2327]">
          Clients
        </h1>
        <NavLink to="/clients/add" className="border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 text-sm rounded cursor-pointer font-medium">
          Add New Client
        </NavLink>
      </div>

      <div className="flex justify-end bg-white p-4 items-center shadow-sm border border-[#c3c4c7] rounded-t">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        data={formattedData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={page}
        totalPages={5}
        onPageChange={setPage}
      />

    </div>
  );
}
