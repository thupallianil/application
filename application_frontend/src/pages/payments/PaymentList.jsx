import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CreditCard, Search, Download, Plus, Eye, Pencil, Trash2,
  IndianRupee, Calendar, User, ChevronUp, ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useRole } from "../../utils/useRole";

/* ── helpers ── */
const fmtAmt = (v) =>
  `₹${parseFloat(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const fmtDate = (d) => {
  if (!d) return "N/A";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return d; }
};

const METHOD_COLORS = {
  cash: "bg-[#d1e7dd] text-[#0a3622]",
  "bank transfer": "bg-[#cfe2ff] text-[#084298]",
  "credit card": "bg-[#f8d7da] text-[#842029]",
  upi: "bg-[#fff3cd] text-[#664d03]",
};
const methodBadge = (m = "") =>
  METHOD_COLORS[(m || "").toLowerCase()] || "bg-[#e9ecef] text-[#495057]";

const ITEMS_PER_PAGE = 10;

/* ═══════════════════════════════════════════ */
export default function PaymentList() {
  const navigate = useNavigate();
  const role = useRole();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");

  useEffect(() => { loadPayments(); }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params = role !== "admin" ? { role: "client" } : {};
      const res = await api.get("/payments/", { params });
      setPayments(res.data);
    } catch {
      toast.error("Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment?")) return;
    try {
      await api.delete(`/payments/${id}/`);
      toast.success("Payment deleted.");
      loadPayments();
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selected.length === 0) { toast.warning("Select items and choose an action."); return; }
    if (bulkAction === "delete") {
      if (!window.confirm(`Delete ${selected.length} payment(s)?`)) return;
      try {
        await Promise.all(selected.map((id) => api.delete(`/payments/${id}/`)));
        toast.success(`${selected.length} payment(s) deleted.`);
        setSelected([]);
        loadPayments();
      } catch { toast.error("Bulk delete failed."); }
    }
  };

  const handleExportCSV = () => {
    const rows = payments.map((p) => [
      p.payment_id || `PAY-${p.id}`,
      p.client_name || p.client || "",
      p.amount || "",
      p.method || "",
      fmtDate(p.date),
    ]);
    const csv = [["Payment ID", "Client", "Amount", "Method", "Date"], ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), { href: url, download: "payments.csv" }).click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  /* ── sort ── */
  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  /* ── derive ── */
  const methods = ["All", ...new Set(payments.map((p) => p.method).filter(Boolean))];

  const totalAmt = payments.reduce((s, p) => s + parseFloat(p.amount || 0), 0);
  const monthAmt = payments
    .filter((p) => p.date && new Date(p.date).getMonth() === new Date().getMonth())
    .reduce((s, p) => s + parseFloat(p.amount || 0), 0);

  const filtered = payments
    .filter((p) =>
      [p.payment_id, p.client_name, p.client, p.amount, p.method, p.date]
        .join(" ").toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => methodFilter === "All" || p.method === methodFilter)
    .sort((a, b) => {
      const va = String(a[sortKey] || "").toLowerCase();
      const vb = String(b[sortKey] || "").toLowerCase();
      if (sortKey === "amount")
        return sortDir === "asc"
          ? parseFloat(a.amount || 0) - parseFloat(b.amount || 0)
          : parseFloat(b.amount || 0) - parseFloat(a.amount || 0);
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const allSel = paginated.length > 0 && paginated.every((p) => selected.includes(p.id));
  const toggleAll = () =>
    allSel
      ? setSelected((s) => s.filter((id) => !paginated.find((p) => p.id === id)))
      : setSelected((s) => [...new Set([...s, ...paginated.map((p) => p.id)])]);
  const toggleOne = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const SortIcon = ({ k }) =>
    sortKey === k
      ? sortDir === "asc" ? <ChevronUp size={11} className="inline ml-[2px]" /> : <ChevronDown size={11} className="inline ml-[2px]" />
      : <span className="inline-block ml-[2px] opacity-30 text-[9px]">▲▼</span>;

  const PaginationBar = () => (
    <div className="flex items-center gap-1 text-[13px]">
      <span className="text-[#646970] mr-1">{filtered.length} items</span>
      <button disabled={page === 1} onClick={() => setPage(1)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-[6px] py-[2px] rounded-sm disabled:opacity-40 h-[28px]">«</button>
      <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-[6px] py-[2px] rounded-sm disabled:opacity-40 h-[28px]">‹</button>
      <span className="flex items-center gap-1 h-[28px]">
        <input readOnly value={page} className="border border-[#8c8f94] w-8 text-center py-[2px] rounded-sm h-[26px] text-[13px]" />
        <span className="opacity-70">of {totalPages}</span>
      </span>
      <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-[6px] py-[2px] rounded-sm disabled:opacity-40 h-[28px]">›</button>
      <button disabled={page >= totalPages} onClick={() => setPage(totalPages)} className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-[6px] py-[2px] rounded-sm disabled:opacity-40 h-[28px]">»</button>
    </div>
  );

  /* ══════════ RENDER ══════════ */
  return (
    <div className="bg-[#f0f0f1] min-h-screen text-[13px] text-[#2c3338] font-sans p-6 pb-20">

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Payments", val: payments.length, icon: CreditCard, color: "#2271b1" },
          { label: "Total Received", val: fmtAmt(totalAmt), icon: IndianRupee, color: "#00a32a" },
          { label: "This Month", val: fmtAmt(monthAmt), icon: Calendar, color: "#dba617" },
          { label: "This Page", val: paginated.length, icon: User, color: "#7b5ea7" },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-[#c3c4c7] rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.04)] p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: `${card.color}18` }}>
              <card.icon size={17} style={{ color: card.color }} />
            </div>
            <div>
              <div className="text-[11px] text-[#646970] uppercase tracking-wide">{card.label}</div>
              <div className="text-[16px] font-semibold text-[#1d2327]">{card.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Title bar ── */}
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-[23px] font-normal text-[#1d2327] flex items-center gap-2">
          <CreditCard size={22} className="text-[#2271b1]" />
          {role === "admin" ? "Payments" : "My Payments"}
        </h1>
        {role === "admin" && (
          <NavLink to="/payments/add"
            className="border border-[#2271b1] text-[#2271b1] px-[10px] py-[4px] bg-white hover:bg-[#f0f6fc] text-[13px] rounded-sm font-semibold flex items-center gap-1 transition-colors">
            <Plus size={13} /> Add New
          </NavLink>
        )}
      </div>

      {/* ── Filter tabs + search ── */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-3 gap-2">
        <ul className="flex flex-wrap gap-2 text-[13px] text-[#646970]">
          {[{ label: "All", val: "All", count: payments.length }].map((t, i, arr) => (
            <li key={t.val} className="flex items-center gap-2">
              <span className={`cursor-pointer hover:text-[#2271b1] transition-colors ${methodFilter === "All" && t.val === "All" ? "font-semibold text-black" : ""}`}
                onClick={() => { setMethodFilter(t.val); setPage(1); }}>
                {t.label} <span className="text-gray-400">({t.count})</span>
              </span>
              {i < arr.length - 1 && <span className="text-gray-300">|</span>}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <div className="relative">
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#8c8f94]" />
            <input type="text" placeholder="Search payments…"
              className="border border-[#8c8f94] pl-7 pr-3 py-[3px] rounded-sm w-48 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-[13px]"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
            />
          </div>
          <button className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-3 py-[3px] rounded-sm font-medium"
            onClick={() => { setSearch(searchInput); setPage(1); }}>Search</button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap justify-between items-center bg-white px-3 py-2 border border-[#c3c4c7] -mb-px relative z-10 rounded-t-sm shadow-sm gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {role === "admin" && (
            <>
              <select className="border border-[#8c8f94] px-2 py-[2px] rounded-sm text-[13px] h-[28px]"
                value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}>
                <option value="">Bulk actions</option>
                <option value="delete">Delete</option>
              </select>
              <button className="border border-[#2271b1] text-[#2271b1] bg-white hover:bg-[#f0f6fc] px-3 py-[2px] rounded-sm font-medium h-[28px]"
                onClick={handleBulkAction}>Apply</button>
              {selected.length > 0 && <span className="text-[12px] text-[#646970]">{selected.length} selected</span>}
            </>
          )}
          <select className="border border-[#8c8f94] px-2 py-[2px] rounded-sm text-[13px] h-[28px]"
            value={methodFilter} onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}>
            {methods.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-[3px] rounded-sm font-medium flex items-center gap-1 border border-[#2271b1] h-[28px] text-[12px]">
            <Download size={13} /> Export CSV
          </button>
          <PaginationBar />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-[#c3c4c7] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7]">
              {role === "admin" && (
                <th className="p-[10px] w-10 border-r border-[#c3c4c7] text-center">
                  <input type="checkbox" checked={allSel} onChange={toggleAll} className="accent-[#2271b1]" />
                </th>
              )}
              {[
                { label: "Payment ID", key: "payment_id" },
                { label: "Client", key: "client_name" },
                { label: "Amount", key: "amount" },
                { label: "Method", key: "method" },
                { label: "Date", key: "date" },
              ].map(({ label, key }) => (
                <th key={key}
                  className="font-semibold p-[10px] cursor-pointer hover:bg-[#f0f0f1] select-none text-[#2c3338] whitespace-nowrap"
                  onClick={() => toggleSort(key)}>
                  {label} <SortIcon k={key} />
                </th>
              ))}
              <th className="font-semibold p-[10px] text-[#2c3338]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="py-12 text-center text-[#646970]">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
                  Loading payments…
                </div>
              </td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan="7" className="py-12 text-center text-[#646970]">
                <CreditCard size={32} className="mx-auto mb-2 text-[#c3c4c7]" />
                No payments found.{" "}
                {role === "admin" && (
                  <NavLink to="/payments/add" className="text-[#2271b1] hover:underline">Record first payment →</NavLink>
                )}
              </td></tr>
            ) : (
              paginated.map((p, idx) => {
                const payId = p.payment_id || `PAY-${p.id}`;
                const client = p.client_name || p.client || "N/A";
                const method = p.method || "—";
                const isSelected = selected.includes(p.id);
                return (
                  <tr key={p.id}
                    className={`border-b border-[#f0f0f0] hover:bg-[#f0f6fc] group transition-colors
                      ${idx % 2 !== 0 ? "bg-[#f9f9f9]" : "bg-white"}
                      ${isSelected ? "bg-[#e8f0fb]" : ""}`}>
                    {role === "admin" && (
                      <td className="p-[10px] text-center border-r border-[#f0f0f1]">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleOne(p.id)} className="accent-[#2271b1]" />
                      </td>
                    )}

                    {/* Payment ID + hover actions */}
                    <td className="p-[10px] min-w-[160px]">
                      <div className="flex flex-col">
                        <span className="text-[#2271b1] font-semibold hover:underline cursor-pointer text-[13px]"
                          onClick={() => navigate(`/payments/${p.id}`)}>
                          {payId}
                        </span>
                        <div className="invisible group-hover:visible flex gap-[6px] text-[12px] mt-[2px]">
                          <button className="text-[#2271b1] hover:underline" onClick={() => navigate(`/payments/${p.id}`)}>View</button>
                          {role === "admin" && (
                            <>
                              <span className="text-[#c3c4c7]">|</span>
                              <button className="text-[#2271b1] hover:underline" onClick={() => navigate(`/payments/edit/${p.id}`)}>Edit</button>
                              <span className="text-[#c3c4c7]">|</span>
                              <button className="text-[#b32d2e] hover:underline" onClick={() => handleDelete(p.id)}>Trash</button>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="p-[10px]">
                      <span className="text-[#2271b1] hover:underline cursor-pointer text-[12px]">{client}</span>
                    </td>

                    {/* Amount */}
                    <td className="p-[10px]">
                      <span className="text-[#1d2327] font-semibold text-[13px] flex items-center gap-[3px]">
                        <IndianRupee size={12} className="text-[#8c8f94]" />
                        {parseFloat(p.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Method */}
                    <td className="p-[10px]">
                      <span className={`inline-block text-[11px] font-semibold uppercase px-2 py-[2px] rounded-[3px] ${methodBadge(method)}`}>
                        {method}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-[10px] text-[12px] text-[#646970] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#8c8f94]" />
                        {fmtDate(p.date)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-[10px]">
                      <div className="flex gap-[6px]">
                        <button onClick={() => navigate(`/payments/${p.id}`)} title="View"
                          className="border border-[#2271b1] text-[#2271b1] bg-white hover:bg-[#f0f6fc] p-[4px] rounded-sm">
                          <Eye size={14} />
                        </button>
                        {role === "admin" && (
                          <>
                            <button onClick={() => navigate(`/payments/edit/${p.id}`)} title="Edit"
                              className="border border-[#00a32a] text-[#00a32a] bg-white hover:bg-[#f0fdf4] p-[4px] rounded-sm">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => handleDelete(p.id)} title="Delete"
                              className="border border-[#d63638] text-[#d63638] bg-white hover:bg-[#fce7e7] p-[4px] rounded-sm">
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {paginated.length > 0 && (
            <tfoot>
              <tr className="border-t border-[#c3c4c7] bg-[#f6f7f7]">
                {role === "admin" && <th className="p-[10px] w-10 border-r border-[#c3c4c7] text-center"><input type="checkbox" checked={allSel} onChange={toggleAll} className="accent-[#2271b1]" /></th>}
                <th className="font-semibold p-[10px] text-[#2c3338]">Payment ID</th>
                <th className="font-semibold p-[10px] text-[#2c3338]">Client</th>
                <th className="font-semibold p-[10px] text-[#2c3338]">Amount</th>
                <th className="font-semibold p-[10px] text-[#2c3338]">Method</th>
                <th className="font-semibold p-[10px] text-[#2c3338]">Date</th>
                <th className="font-semibold p-[10px] text-[#2c3338]">Actions</th>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex flex-wrap justify-between items-center mt-2 gap-2">
        {role === "admin" ? (
          <div className="flex items-center gap-2">
            <select className="border border-[#8c8f94] px-2 py-[2px] rounded-sm text-[13px] h-[28px]"
              value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}>
              <option value="">Bulk actions</option>
              <option value="delete">Delete</option>
            </select>
            <button className="border border-[#2271b1] text-[#2271b1] bg-white hover:bg-[#f0f6fc] px-3 py-[2px] rounded-sm font-medium h-[28px]"
              onClick={handleBulkAction}>Apply</button>
            <span className="text-[12px] text-[#646970]">
              Page {page} of {totalPages} — {filtered.length} total
            </span>
          </div>
        ) : <div />}
        <PaginationBar />
      </div>
    </div>
  );
}