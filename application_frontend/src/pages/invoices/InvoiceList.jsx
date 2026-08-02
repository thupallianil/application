import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useRole } from "../../utils/useRole";

export default function InvoiceList() {
  const navigate = useNavigate();
  const role = useRole();

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [clientFilter, setClientFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("All dates");

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const params = role !== "admin" ? { role: "client" } : {};
      const res = await api.get("/invoices/", { params });
      setInvoices(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Unable to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    try {
      await api.delete(`/invoices/${id}/`);
      toast.success("Invoice deleted.");
      loadInvoices();
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleEdit = (id) => navigate(`/invoices/edit/${id}`);
  const handleView = (id) => navigate(`/invoices/${id}`);
  const handleExportCSV = () => {
    // CSV logic
    const headers = ["Invoice", "Client", "Amount", "Status"];
    const rows = invoices.map((i) => [
      i.invoice,
      i.client_name || i.client,
      i.amount,
      i.status,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Invoices.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // derived stats
  const allCount = invoices.length;
  const publishedCount = invoices.length; // assuming all are published in our case
  const cancelledCount = invoices.filter(i => i.status?.toLowerCase() === 'cancelled').length;
  const draftCount = 0;
  const overdueCount = invoices.filter(i => i.status?.toLowerCase() === 'overdue').length;
  const paidCount = invoices.filter(i => i.status?.toLowerCase() === 'paid').length;
  const unpaidCount = invoices.filter(i => i.status?.toLowerCase() === 'pending').length;

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = Object.values(invoice)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    // Status Filter logic - Map display tab to actual status if needed
    let s = invoice.status?.toLowerCase() || '';
    if (s === 'pending') s = 'unpaid';

    const displayFilter = statusFilter.toLowerCase();

    // if 'all', it matches everything except we can refine if we want.
    const matchesStatus = displayFilter === 'all'
      || displayFilter === 'published'
      || s === displayFilter;

    const matchesClient = clientFilter === "" || String(invoice.client) === clientFilter;
    return matchesSearch && matchesStatus && matchesClient;
  });

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE));
  const paginatedData = filteredInvoices.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "paid") return "border-green-500 text-green-600";
    if (s === "overdue") return "border-orange-500 text-orange-600";
    if (s === "pending" || s === "unpaid") return "border-orange-300 text-orange-400";
    if (s === "cancelled") return "border-gray-400 text-gray-500";
    return "border-gray-300 text-gray-600";
  };

  // Quick tabs
  const topTabs = [
    { label: "All", count: allCount, val: "All", color: "text-blue-600" },
    { label: "Published", count: publishedCount, val: "Published" },
    { label: "Cancelled", count: cancelledCount, val: "Cancelled" },
    { label: "Draft", count: draftCount, val: "Draft" },
    { label: "Overdue", count: overdueCount, val: "Overdue", color: "text-orange-500" },
    { label: "Paid", count: paidCount, val: "Paid", color: "text-green-600" },
    { label: "Unpaid", count: unpaidCount, val: "Unpaid", color: "text-orange-400" },
  ];

  return (
    <div className="bg-[#f1f1f1] min-h-screen text-[13px] text-[#2c3338] font-sans p-6 pb-20">

      {/* Title */}
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-[23px] font-normal leading-tight text-[#1d2327]">Invoices</h1>
        {role === "admin" && (
          <NavLink
            to="/invoices/add"
            className="border border-[#2271b1] text-[#2271b1] px-[10px] py-[4px] bg-white hover:bg-[#f6f7f7] text-[13px] rounded-sm transition-colors font-semibold"
          >
            Add New
          </NavLink>
        )}
      </div>

      {/* Top Links & Search */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-3">
        <ul className="flex flex-wrap gap-2 text-[13px] text-[#646970]">
          {topTabs.map((tab, idx) => (
            <li key={tab.val} className="flex space-x-2">
              <span
                className={`cursor-pointer hover:text-[#2271b1] ${statusFilter === tab.val ? "font-semibold text-black" : tab.color || ""}`}
                onClick={() => { setStatusFilter(tab.val); setPage(1); }}
              >
                {tab.label} <span className="text-gray-400">({tab.count})</span>
              </span>
              {idx < topTabs.length - 1 && <span>|</span>}
            </li>
          ))}
        </ul>

        <div className="flex mt-3 lg:mt-0 items-center">
          <input
            type="text"
            className="border border-[#8c8f94] px-3 py-[3px] rounded-sm mr-1 w-48 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-[13px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2c3338] px-3 py-[3px] rounded-sm font-medium transition cursor-pointer">
            Search Invoices
          </button>
        </div>
      </div>

      {/* Filters & Pagination (Top) */}
      <div className="flex flex-wrap justify-between items-center bg-white p-2 border border-[#c3c4c7] -mb-px relative z-10 rounded-t-sm shadow-sm">

        <div className="flex items-center space-x-2 flex-wrap">
          <select className="border border-[#8c8f94] px-2 py-[2px] rounded-sm min-w-[120px] text-[13px] text-[#2c3338]">
            <option>Bulk actions</option>
            <option>Trash</option>
          </select>
          <button className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f3f5f6] px-3 py-[2px] rounded-sm font-medium">Apply</button>

          <select
            className="border border-[#8c8f94] px-2 py-[2px] rounded-sm min-w-[110px] text-[13px] text-[#2c3338]"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="All dates">All dates</option>
          </select>

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="border border-[#8c8f94] px-2 py-[2px] rounded-sm min-w-[150px] text-[13px] text-[#2c3338]"
          >
            <option value="">Choose client</option>
            {[...new Map(invoices.map(i => [i.client, i.client_name || i.client])).entries()].map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          <select className="border border-[#8c8f94] px-2 py-[2px] rounded-sm min-w-[140px] text-[13px] text-[#2c3338]">
            <option>View all statuses</option>
          </select>

          <button className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-3 py-[2px] rounded-sm font-medium text-[#2c3338]">Filter</button>

          <button onClick={handleExportCSV} className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-[3px] rounded-sm font-medium flex items-center gap-1 border border-[#2271b1]">
            Export as CSV
          </button>
        </div>

        {/* Top Pagination */}
        <div className="flex items-center space-x-1 mt-2 md:mt-0 text-[13px] text-[#2c3338]">
          <span className="mr-3">{filteredInvoices.length} items</span>
          <button disabled={page === 1} onClick={() => setPage(1)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] p-[3px] rounded-sm disabled:opacity-50 min-w-[28px] flex items-center justify-center">
            «
          </button>
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] p-[3px] rounded-sm disabled:opacity-50 min-w-[28px] flex items-center justify-center">
            ‹
          </button>
          <span className="mx-1">
            <input type="text" value={page} readOnly className="border border-[#8c8f94] w-8 text-center py-[2px] rounded-sm text-[#2c3338]" /> of {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] p-[3px] rounded-sm disabled:opacity-50 min-w-[28px] flex items-center justify-center">
            ›
          </button>
          <button disabled={page >= totalPages} onClick={() => setPage(totalPages)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] p-[3px] rounded-sm disabled:opacity-50 min-w-[28px] flex items-center justify-center">
            »
          </button>
        </div>

      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#c3c4c7] overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#c3c4c7]">
              <th className="font-semibold p-[10px] w-10 border-r border-[#c3c4c7] text-center">
                <input type="checkbox" className="rounded-sm border-[#8c8f94]" />
              </th>
              <th className="font-semibold p-[10px] flex-1 min-w-[220px]">Title <span className="text-[#a7aaad] text-[10px] ml-1">▲▼</span></th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Number <span className="text-[#a7aaad] text-[10px] ml-1">▲▼</span></th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Client</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Statuses <span className="text-[#a7aaad] text-[10px] ml-1">▲▼</span></th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Created <span className="text-[#a7aaad] text-[10px] ml-1">▲▼</span></th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Total <span className="text-[#a7aaad] text-[10px] ml-1">▲▼</span></th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Actions</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Date <span className="text-[#a7aaad] text-[10px] ml-1">▲▼</span></th>
              <th className="font-semibold p-[10px] text-[#2c3338] text-center w-16">Stats</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="p-10 text-center text-gray-500">Loading...</td></tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((inv, idx) => {
                const s = inv.status || 'Pending';
                const createdDate = inv.invoiceDate || '02/11/2024';
                const dueDate = inv.dueDate || '02/11/2024';

                return (
                  <tr key={inv.id} className={`${idx % 2 !== 0 ? "bg-[#f9f9f9]" : "bg-white"} hover:bg-[#f0f0f1] border-b border-[#f0f0f0] group`}>
                    <td className="p-[10px] text-center">
                      <input type="checkbox" className="rounded-sm border-[#8c8f94]" />
                    </td>
                    <td className="p-[10px] whitespace-normal">
                      <div className="flex flex-col">
                        <span className="text-[#2271b1] font-semibold flex items-center hover:underline cursor-pointer text-[13px]" onClick={() => handleView(inv.id)}>
                          Invoice from {inv.client_name || inv.client || "Client"}
                        </span>
                        <span className="text-[#646970] text-[12px]">{inv.email || "No email"}</span>

                        {/* WordPress-style hover actions */}
                        <div className="invisible group-hover:visible flex gap-[6px] text-[12px] text-[#2271b1] mt-1 mb-[-18px]">
                          {role === "admin" && (
                            <>
                              <button onClick={() => handleEdit(inv.id)} className="hover:text-blue-800 focus:outline-none">Edit</button> <span className="text-gray-300">|</span>
                              <button onClick={() => handleDelete(inv.id)} className="text-[#b32d2e] hover:text-red-800 focus:outline-none">Trash</button> <span className="text-gray-300">|</span>
                            </>
                          )}
                          <button onClick={() => handleView(inv.id)} className="hover:text-blue-800 focus:outline-none">View</button>
                        </div>
                      </div>
                    </td>
                    <td className="p-[10px] text-[#2271b1] text-[12px]">{inv.invoice || `INV-${inv.id}`}</td>
                    <td className="p-[10px] whitespace-normal">
                      <span className="text-[#2271b1] hover:underline cursor-pointer">{inv.client_name || inv.client || "N/A"}</span>
                      {inv.email && <div className="text-gray-500 text-[12px] mt-[2px]">{inv.email}</div>}
                    </td>
                    <td className="p-[10px]">
                      <span className={`inline-block border px-2 py-[2px] text-[11px] uppercase tracking-wide rounded-sm font-semibold bg-white ${getStatusColor(s)}`}>
                        {s}
                      </span>
                    </td>
                    <td className="p-[10px] text-[#646970] text-[12px]">
                      <div className="flex items-center gap-1 mb-1"><Calendar size={13} className="text-[#8c8f94]" /> {createdDate}</div>
                      <div>Due: {dueDate}</div>
                    </td>
                    <td className="p-[10px] text-[#2c3338] text-[12px]">
                      Total: ₹{parseFloat(inv.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-[10px]">
                      <div className="flex gap-2">
                        <button onClick={() => window.open(`/invoices/${inv.id}`, "_blank")} className="border border-[#2271b1] p-[3px] rounded-sm text-[#2271b1] bg-white hover:bg-[#f0f0f1]" title="Print / Download">
                          <FileText size={16} />
                        </button>
                        <button onClick={() => handleView(inv.id)} className="border border-[#2271b1] p-[3px] rounded-sm text-[#2271b1] bg-white hover:bg-[#f0f0f1]" title="View Details">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="p-[10px] text-[#646970] text-[12px]">
                      <div className="font-medium text-[#2c3338]">Published</div>
                      <div>2025/04/11 at 4:46 pm</div>
                    </td>
                    <td className="p-[10px] text-center text-[#2271b1]">
                      <BarChart size={18} className="mx-auto cursor-pointer" onClick={() => handleView(inv.id)} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="10" className="p-8 text-center text-gray-500">No invoices found</td></tr>
            )}
          </tbody>

          {/* Bottom Table Headers (WordPress Style) */}
          <tfoot>
            <tr className="border-t border-[#c3c4c7] bg-white">
              <th className="font-semibold p-[10px] w-10 text-center border-r border-[#c3c4c7]">
                <input type="checkbox" className="rounded-sm border-[#8c8f94]" />
              </th>
              <th className="font-semibold p-[10px] flex-1 min-w-[200px]">Title</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Number</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Client</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Statuses</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Created</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Total</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Actions</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Date</th>
              <th className="font-semibold p-[10px] text-[#2c3338] text-center w-16">Stats</th>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Bottom Actions & Pagination - matching WP precisely and title instructions */}
      <div className="flex flex-wrap justify-between items-center bg-transparent mt-2">

        <div className="flex items-center space-x-2">
          <select className="border border-[#8c8f94] px-2 py-[2px] rounded-sm min-w-[120px] text-[13px] text-[#2c3338] h-[28px]">
            <option>Bulk actions</option>
            <option>Trash</option>
          </select>
          <button className="border border-[#2271b1] text-[#2271b1] bg-[#f6f7f7] hover:bg-[#f3f5f6] px-3 py-[2px] rounded-sm font-medium h-[28px] flex items-center">Apply</button>
        </div>

        {/* BOTTOM RIGHT PAGINATION */}
        <div className="flex items-center space-x-1 mt-2 md:mt-0 text-[13px] text-[#2c3338]">
          <span className="mr-3">{filteredInvoices.length} items</span>
          <button disabled={page === 1} onClick={() => setPage(1)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] p-[3px] rounded-sm disabled:opacity-50 min-w-[28px] h-[28px] flex items-center justify-center">
            «
          </button>
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] p-[3px] rounded-sm disabled:opacity-50 min-w-[28px] h-[28px] flex items-center justify-center">
            ‹
          </button>
          <span className="mx-1 flex items-center gap-1 h-[28px]">
            <input type="text" value={page} readOnly className="border border-[#8c8f94] w-8 text-center py-[2px] rounded-sm h-[28px] text-[#2c3338]" /> <span className="opacity-70">of {totalPages}</span>
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] p-[3px] rounded-sm disabled:opacity-50 min-w-[28px] h-[28px] flex items-center justify-center">
            ›
          </button>
          <button disabled={page >= totalPages} onClick={() => setPage(totalPages)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] p-[3px] rounded-sm disabled:opacity-50 min-w-[28px] h-[28px] flex items-center justify-center">
            »
          </button>
        </div>

      </div>

    </div>
  );
}