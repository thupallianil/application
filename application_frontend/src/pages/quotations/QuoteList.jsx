import React, { useState, useEffect } from "react";
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
  Eye,
  Printer
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useRole } from "../../utils/useRole";

export default function QuoteList() {
  const navigate = useNavigate();
  const role = useRole();

  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [clientFilter, setClientFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("All dates");

  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [bulkActionBottom, setBulkActionBottom] = useState("");

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(paginatedData.map(i => i.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id, checked) => {
    if (checked) setSelectedIds(prev => [...prev, id]);
    else setSelectedIds(prev => prev.filter(x => x !== id));
  };

  const handleBulkApply = async (actionPosition) => {
    const action = actionPosition === "bottom" ? bulkActionBottom : bulkAction;
    if (action === "trash" && selectedIds.length > 0) {
      if (!window.confirm(`Move ${selectedIds.length} items to trash?`)) return;
      try {
        await Promise.all(selectedIds.map(id => api.delete(`/quotes/${id}/`)));
        toast.success("Items deleted.");
        setSelectedIds([]);
        loadQuotes();
      } catch (err) {
        toast.error(err.message || "Bulk delete failed.");
      }
    } else if (action === "trash" && selectedIds.length === 0) {
      toast.warning("Please select items first.");
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const params = role !== "admin" ? { role: "client" } : {};
      const res = await api.get("/quotes/", { params });
      setQuotes(res.data);
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Unable to load quotes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Move this quote to trash?")) return;
    try {
      await api.delete(`/quotes/${id}/`);
      toast.success("Quote deleted.");
      loadQuotes();
    } catch (err) {
      toast.error(err.message || "Delete failed.");
    }
  };

  const handleEdit = (id) => navigate(`/quotes/edit/${id}`);
  const handleView = (id) => navigate(`/quotes/${id}`);
  const handleExportCSV = () => {
    const headers = ["Title", "Number", "Client", "Amount", "Status"];
    const rows = quotes.map((q) => [
      q.quote || `Quote ${q.id}`,
      q.quotation_id || `AKEYQ-${q.id}`,
      q.client_name || q.client,
      q.amount,
      q.status,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Quotes.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // derived stats
  const allCount = quotes.length;
  const publishedCount = quotes.length;
  const acceptedCount = quotes.filter(q => q.status?.toLowerCase() === 'accepted').length;
  const cancelledCount = quotes.filter(q => q.status?.toLowerCase() === 'cancelled').length;
  const declinedCount = quotes.filter(q => q.status?.toLowerCase() === 'declined' || q.status?.toLowerCase() === 'rejected').length;
  const draftCount = quotes.filter(q => q.status?.toLowerCase() === 'draft').length;
  const expiredCount = quotes.filter(q => q.status?.toLowerCase() === 'expired').length;
  const sentCount = 0;

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch = Object.values(quote)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    let matchesDate = true;
    if (dateFilter !== "All dates") {
      const qDate = quote.quoteDate || quote.created_at || "";
      matchesDate = qDate.includes(dateFilter) || qDate === dateFilter;
    }

    let s = quote.status?.toLowerCase() || '';

    const displayFilter = statusFilter.toLowerCase();
    const matchesStatus = displayFilter === 'all'
      || displayFilter === 'published'
      || s === displayFilter
      || (displayFilter === 'declined' && s === 'rejected');

    const matchesClient = clientFilter === "" || String(quote.client) === clientFilter;
    return matchesSearch && matchesStatus && matchesClient && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / ITEMS_PER_PAGE));
  const paginatedData = filteredQuotes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "accepted") return "border-green-500 text-green-600";
    if (s === "expired") return "border-orange-500 text-orange-600";
    if (s === "draft") return "border-gray-400 text-gray-500";
    if (s === "declined" || s === "rejected") return "border-red-400 text-red-500";
    if (s === "cancelled") return "border-gray-500 text-gray-600";
    return "border-gray-300 text-gray-600";
  };

  const topTabs = [
    { label: "All", count: allCount, val: "All", color: "text-blue-600" },
    { label: "Published", count: publishedCount, val: "Published", color: "text-blue-600" },
    { label: "Accepted", count: acceptedCount, val: "Accepted", color: "text-blue-600" },
    { label: "Cancelled", count: cancelledCount, val: "Cancelled", color: "text-blue-600" },
    { label: "Declined", count: declinedCount, val: "Declined", color: "text-blue-600" },
    { label: "Draft", count: draftCount, val: "Draft", color: "text-blue-600" },
    { label: "Expired", count: expiredCount, val: "Expired", color: "text-blue-600" },
    { label: "Sent", count: sentCount, val: "Sent", color: "text-blue-600" },
  ];

  return (
    <div className="bg-[#f1f1f1] min-h-screen text-[13px] text-[#2c3338] font-sans p-6 pb-20">

      {/* Title */}
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-[23px] font-normal leading-tight text-[#1d2327]">Quotes</h1>
        {role === "admin" && (
          <NavLink
            to="/quotes/add"
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
            Search Quotes
          </button>
        </div>
      </div>

      {/* Filters & Pagination (Top) */}
      <div className="flex flex-wrap justify-between items-center bg-white p-2 border border-[#c3c4c7] -mb-px relative z-10 rounded-t-sm shadow-sm">
        <div className="flex items-center space-x-2 flex-wrap">
          <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} className="border border-[#8c8f94] px-2 py-[2px] rounded-sm min-w-[120px] text-[13px] text-[#2c3338]">
            <option value="">Bulk actions</option>
            <option value="trash">Trash</option>
          </select>
          <button onClick={() => handleBulkApply('top')} className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f3f5f6] px-3 py-[2px] rounded-sm font-medium">Apply</button>

          <select
            className="border border-[#8c8f94] px-2 py-[2px] rounded-sm min-w-[110px] text-[13px] text-[#2c3338]"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="All dates">All dates</option>
            {[...new Set(quotes.map(q => {
              const dStr = q.quoteDate || q.created_at;
              if (!dStr) return null;
              const parts = dStr.split('/');
              if (parts.length === 3) return `${parts[1]}/${parts[2]}`;
              const partsDash = dStr.split('-');
              if (partsDash.length === 3) return `${partsDash[1]}-${partsDash[0]}`; // YYYY-MM
              return dStr;
            }).filter(Boolean))].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="border border-[#8c8f94] px-2 py-[2px] rounded-sm min-w-[150px] text-[13px] text-[#2c3338]"
          >
            <option value="">Choose client</option>
            {[...new Map(quotes.map(q => [q.client, q.client_name || q.client])).entries()].map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="border border-[#8c8f94] px-2 py-[2px] rounded-sm min-w-[140px] text-[13px] text-[#2c3338]">
            {topTabs.map(t => <option key={t.val} value={t.val}>{t.val === 'All' ? 'View all statuses' : t.label}</option>)}
          </select>

          <select className="border border-[#8c8f94] px-2 py-[2px] rounded-sm min-w-[110px] text-[13px] text-[#2c3338] hidden xl:inline-block">
            <option>All SEO Scores</option>
          </select>

          <button onClick={() => setPage(1)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-3 py-[2px] rounded-sm font-medium text-[#2c3338]">Filter</button>

          <button onClick={handleExportCSV} className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-[3px] rounded-sm font-medium flex items-center gap-1 border border-[#2271b1] xl:ml-2">
            Export as CSV
          </button>
        </div>

        {/* Top Pagination */}
        <div className="flex items-center space-x-1 mt-2 md:mt-0 text-[13px] text-[#2c3338]">
          <span className="mr-3">{filteredQuotes.length} items</span>
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
                <input type="checkbox" onChange={handleSelectAll} checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length} className="rounded-sm border-[#8c8f94]" />
              </th>
              <th className="font-semibold p-[10px] flex-[2] min-w-[220px]">Title <span className="text-[#a7aaad] text-[10px] ml-1">▲▼</span></th>
              <th className="font-semibold p-[10px] text-[#2271b1]">Number <span className="text-[#a7aaad] text-[10px] ml-1">▲▼</span></th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Client</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Statuses <span className="text-[#a7aaad] text-[10px] ml-1">▲▼</span></th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Created <span className="text-[#a7aaad] text-[10px] ml-1">▲▼</span></th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Total <span className="text-[#a7aaad] text-[10px] ml-1">▲▼</span></th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Actions</th>
              <th className="font-semibold p-[10px] text-[#2271b1]">Date <span className="text-[#a7aaad] text-[10px] ml-1">▲▼</span></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" className="p-10 text-center text-gray-500">Loading Quotes...</td></tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((q, idx) => {
                const s = q.status || 'Draft';
                const createdDate = q.quoteDate || '02/11/2024';
                const validUntil = q.validUntil || '02/11/2024';
                const quoteIdStr = q.quotation_id || `AKEYQ-${q.id.toString().padStart(2, '0')}`;

                // Mocks from image for blank data
                const titleStr = q.description ? q.description.substring(0, 40) + "..." : "Quote for Design / Hosting";
                const clientName = q.client_name || q.client || "Client Name";

                return (
                  <tr key={q.id} className={`${idx % 2 !== 0 ? "bg-[#f9f9f9]" : "bg-white"} hover:bg-[#f0f0f1] border-b border-[#f0f0f0] group`}>
                    <td className="p-[10px] text-center">
                      <input type="checkbox" checked={selectedIds.includes(q.id)} onChange={(e) => handleSelectOne(q.id, e.target.checked)} className="rounded-sm border-[#8c8f94]" />
                    </td>
                    <td className="p-[10px] whitespace-normal">
                      <div className="flex flex-col">
                        <span className="text-[#2271b1] font-semibold flex items-center hover:underline cursor-pointer text-[13px]" onClick={() => handleView(q.id)}>
                          {titleStr}
                        </span>

                        {/* WordPress-style hover actions */}
                        <div className="invisible group-hover:visible flex gap-[6px] text-[12px] text-[#2271b1] mt-1 mb-[-18px]">
                          {role === "admin" && (
                            <>
                              <button onClick={() => handleEdit(q.id)} className="hover:text-blue-800 focus:outline-none">Edit</button> <span className="text-gray-300">|</span>
                              <button onClick={() => handleDelete(q.id)} className="text-[#b32d2e] hover:text-red-800 focus:outline-none">Trash</button> <span className="text-gray-300">|</span>
                            </>
                          )}
                          <button onClick={() => handleView(q.id)} className="hover:text-blue-800 focus:outline-none">View</button>
                        </div>
                      </div>
                    </td>
                    <td className="p-[10px] text-[#2c3338] text-[13px]">{quoteIdStr}</td>
                    <td className="p-[10px] whitespace-normal">
                      <span className="text-[#2271b1] hover:underline cursor-pointer font-medium">{clientName}</span>
                      <div className="text-[#646970] text-[12px] mt-[2px]">{q.email || "accounts@client.com"}</div>
                    </td>
                    <td className="p-[10px]">
                      <span className={`inline-block border px-2 py-[1px] text-[11px] uppercase tracking-wide rounded font-semibold bg-white ${getStatusColor(s)}`}>
                        {s}
                      </span>
                    </td>
                    <td className="p-[10px] text-[#646970] text-[12px]">
                      <div className="flex items-center gap-1 mb-[2px]"><Calendar size={13} className="text-[#8c8f94]" /> {createdDate}</div>
                      <div>Valid: {validUntil}</div>
                    </td>
                    <td className="p-[10px] text-[#2c3338] text-[12px]">
                      Total: ₹{parseFloat(q.amount || q.grand_total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-[10px]">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/quotes/${q.id}`)}
                          className="border border-[#2271b1] p-[3px] rounded-sm text-[#2271b1] bg-white hover:bg-[#f0f0f1]"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/quotes/${q.id}?action=print`)}
                          className="border border-[#8c8f94] p-[3px] rounded-sm text-[#3c434a] bg-white hover:bg-[#f0f0f1]"
                          title="Print Quote"
                        >
                          <Printer size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/quotes/${q.id}?action=download`)}
                          className="border border-[#00a32a] p-[3px] rounded-sm text-[#00a32a] bg-white hover:bg-[#f0f0f1]"
                          title="Download PDF"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="p-[10px] text-[#646970] text-[12px]">
                      <div className="font-medium text-[#2c3338]">Published</div>
                      <div>2024/05/16 at 5:52 pm</div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="9" className="p-8 text-center text-gray-500">No quotes found</td></tr>
            )}
          </tbody>

          {/* Bottom Table Headers (WordPress Style) */}
          <tfoot>
            <tr className="border-t border-[#c3c4c7] bg-white">
              <th className="font-semibold p-[10px] w-10 text-center border-r border-[#c3c4c7]">
                <input type="checkbox" onChange={handleSelectAll} checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length} className="rounded-sm border-[#8c8f94]" />
              </th>
              <th className="font-semibold p-[10px] flex-1 min-w-[200px]">Title</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Number</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Client</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Statuses</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Created</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Total</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Actions</th>
              <th className="font-semibold p-[10px] text-[#2c3338]">Date</th>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Bottom Actions & Pagination */}
      <div className="flex flex-wrap justify-between items-center bg-transparent mt-2">
        <div className="flex items-center space-x-2">
          <select value={bulkActionBottom} onChange={(e) => setBulkActionBottom(e.target.value)} className="border border-[#8c8f94] px-2 py-[2px] rounded-sm min-w-[120px] text-[13px] text-[#2c3338] h-[28px]">
            <option value="">Bulk actions</option>
            <option value="trash">Trash</option>
          </select>
          <button onClick={() => handleBulkApply('bottom')} className="border border-[#2271b1] text-[#2271b1] bg-[#f6f7f7] hover:bg-[#f3f5f6] px-3 py-[2px] rounded-sm font-medium h-[28px] flex items-center">Apply</button>
        </div>

        {/* BOTTOM RIGHT PAGINATION */}
        <div className="flex items-center space-x-1 mt-2 md:mt-0 text-[13px] text-[#2c3338]">
          <span className="mr-3">{filteredQuotes.length} items</span>
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