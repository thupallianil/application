import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import api from "../../services/api";

export default function InvoiceList() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const columns = [
    "Invoice No",
    "Client",
    "Amount",
    "Status",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/invoices/");
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load Invoices");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Invoice?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/invoices/${id}/`);

      toast.success("Invoice deleted successfully!");

      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete Invoice");
    }
  };

  const handleEdit = (id) => {
    navigate(`/invoices/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/invoices/${id}`);
  };

  const formattedData = data
    .map((item) => ({
      id: item.id,
      invoice: item.invoice || `INV-${item.id}`,
      client: item.client_name || item.client || "N/A",
      amount: item.amount || "₹0",
      status: item.status || "Pending",
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
          Invoices
        </h1>

        <NavLink
          to="/invoices/add"
          className="border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 text-sm rounded font-medium"
        >
          Add New Invoice
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