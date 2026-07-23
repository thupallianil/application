import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import api from "../../services/api";

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
      const res = await api.get("/clients/");
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load Clients");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Client?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/clients/${id}/`);

      toast.success("Client deleted successfully!");

      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete Client");
    }
  };

  const handleEdit = (id) => {
    navigate(`/clients/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/clients/${id}`);
  };

  const formattedData = data
    .map((item) => ({
      id: item.id,
      name: item.client || item.name || "Unknown",
      email: item.email || "N/A",
      phone: item.phone || "N/A",
      date: item.created_at || item.created || "N/A",
    }))
    .filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );

  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.max(
    1,
    Math.ceil(formattedData.length / ITEMS_PER_PAGE)
  );

  const paginatedData = formattedData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 bg-[#f0f0f1] min-h-screen p-4 md:p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1d2327]">
          Clients
        </h1>

        <NavLink
          to="/clients/add"
          className="border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 text-sm rounded font-medium"
        >
          Add New Client
        </NavLink>
      </div>

      <div className="flex justify-end bg-white p-4 shadow-sm border border-[#c3c4c7] rounded-t">

        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <Table
        columns={columns}
        data={paginatedData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

    </div>
  );
}