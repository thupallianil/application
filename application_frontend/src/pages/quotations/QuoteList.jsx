import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";

const API_URL = "http://127.0.0.1:8001/api/quotes/";

export default function QuoteList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const columns = [
    "Quote No",
    "Client",
    "Amount",
    "Status",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load Quotes");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Quote?")) return;
    try {
      await axios.delete(API_URL + id + "/");
      toast.success("Quote deleted successfully!");
      fetchData(); // Refresh list
    } catch (error) {
      toast.error("Failed to delete Quote");
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/quotes/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/quotes/${id}`);
  };

  // Format data for Table
  const formattedData = data.map(item => ({
    id: item.id, quote: item.quotation_id || `QT-${item.id}`, client: item.client_name || item.client, amount: item.amount || "₹0", status: item.status || "Pending"
  })).filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(formattedData.length / ITEMS_PER_PAGE));
  const paginatedData = formattedData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 bg-[#f0f0f1] min-h-screen p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1d2327]">
          Quotes
        </h1>
        <NavLink to="/quotes/add" className="border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 text-sm rounded cursor-pointer font-medium">
          Add New Quote
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
