import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import api from "../../services/api";
import { useRole } from "../../utils/useRole";

export default function PaymentList() {
  const navigate = useNavigate();
  const role = useRole();
  const userName = localStorage.getItem("user_name") || "";
  const userEmail = localStorage.getItem("user_email") || "";

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const columns = ["Payment ID", "Client", "Amount", "Date"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/payments/");
      let payments = res.data;

      // Filter to client's own records if not admin
      if (role !== "admin") {
        payments = payments.filter((p) => {
          const name = (p.client_name || p.client || "").toLowerCase();
          const email = (p.client_email || "").toLowerCase();
          return (
            name === userName.toLowerCase() ||
            email === userEmail.toLowerCase() ||
            (userName && name.includes(userName.split(" ")[0].toLowerCase()))
          );
        });
      }

      setData(payments);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load Payments");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Payment?")) return;
    try {
      await api.delete(`/payments/${id}/`);
      toast.success("Payment deleted successfully!");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete Payment");
    }
  };

  const handleEdit = (id) => navigate(`/payments/edit/${id}`);
  const handleView = (id) => navigate(`/payments/${id}`);
  // Download receipt: open detail page in new tab for print/save
  const handleDownload = (id) => window.open(`/payments/${id}`, "_blank");

  const formattedData = data
    .map((item) => ({
      id: item.id,
      payment: item.payment_id || `PAY-${item.id}`,
      client: item.client_name || item.client || "N/A",
      amount: item.amount || "₹0",
      date: item.date || "N/A",
    }))
    .filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(formattedData.length / ITEMS_PER_PAGE));
  const paginatedData = formattedData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 bg-[#f0f0f1] min-h-screen p-4 md:p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1d2327]">
          {role === "admin" ? "Payments" : "My Payments"}
        </h1>

        {role === "admin" && (
          <NavLink
            to="/payments/add"
            className="border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 text-sm rounded font-medium"
          >
            Add New Payment
          </NavLink>
        )}
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
        onEdit={role === "admin" ? handleEdit : null}
        onDelete={role === "admin" ? handleDelete : null}
        onDownload={role !== "admin" ? handleDownload : null}
        clientMode={role !== "admin"}
        clientViewLabel="View Receipt"
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

    </div>
  );
}