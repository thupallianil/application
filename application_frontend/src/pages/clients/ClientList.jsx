import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Download,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";

/* ─── tiny helpers ─────────────────────────── */
const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const AVATAR_COLORS = [
  "#2271b1", "#00a32a", "#d63638", "#dba617", "#7b5ea7",
  "#00b4d8", "#e07b39", "#2ec4b6", "#ff6b6b", "#3a86ff",
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[
  [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length
  ];

const fmtDate = (d) => {
  if (!d) return "N/A";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return d; }
};

const ITEMS_PER_PAGE = 10;

/* ─── component ────────────────────────────── */
export default function ClientList() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("All");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [bulkAction, setBulkAction] = useState("");

  /* ── load ── */
  useEffect(() => { loadClients(); }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clients/");
      setClients(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  /* ── actions ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client?")) return;
    try {
      await api.delete(`/clients/${id}/`);
      toast.success("Client deleted.");
      loadClients();
    } catch (err) {
      toast.error(err.message || "Delete failed.");
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selected.length === 0) {
      toast.warning("Select items and choose an action.");
      return;
    }
    if (bulkAction === "delete") {
      if (!window.confirm(`Delete ${selected.length} client(s)?`)) return;
      try {
        await Promise.all(selected.map((id) => api.delete(`/clients/${id}/`)));
        toast.success(`${selected.length} client(s) deleted.`);
        setSelected([]);
        loadClients();
      } catch (err) {
        toast.error(err.message || "Bulk delete failed.");
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Created"];
    const rows = clients.map((c) => [
      c.client || c.name || "",
      c.email || "",
      c.phone || "",
      fmtDate(c.created_at || c.created),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "clients.csv" });
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  /* ── sort toggle ── */
  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  /* ── derive rows ── */
  const formatted = clients.map((c) => ({
    id: c.id,
    name: c.client || c.name || "Unknown",
    email: c.email || "",
    phone: c.phone || "",
    address: c.address || "",
    date: c.created_at || c.created || null,
  }));

  const searched = formatted.filter((c) =>
    [c.name, c.email, c.phone, c.address]
      .join(" ").toLowerCase()
      .includes(search.toLowerCase())
  );

  const sorted = [...searched].sort((a, b) => {
    const va = (a[sortKey] || "").toString().toLowerCase();
    const vb = (b[sortKey] || "").toString().toLowerCase();
    return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  /* ── select helpers ── */
  const allOnPageSelected = paginated.length > 0 && paginated.every((c) => selected.includes(c.id));
  const toggleAll = () =>
    allOnPageSelected
      ? setSelected((s) => s.filter((id) => !paginated.find((c) => c.id === id)))
      : setSelected((s) => [...new Set([...s, ...paginated.map((c) => c.id)])]);
  const toggleOne = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  /* ── sort icon ── */
  const SortIcon = ({ k }) =>
    sortKey === k ? (
      sortDir === "asc" ? <ChevronUp size={11} className="inline ml-[2px]" /> : <ChevronDown size={11} className="inline ml-[2px]" />
    ) : (
      <span className="inline-block ml-[2px] opacity-30 text-[9px]">▲▼</span>
    );

  /* ── tabs ── */
  const tabs = [
    { label: "All", val: "All", count: clients.length },
  ];

  /* ══════════ RENDER ══════════ */
  return (
    <div className="bg-[#f0f0f1] min-h-screen text-[13px] text-[#2c3338] font-sans p-6 pb-20">

      {/* ── Page title ── */}
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-[23px] font-normal leading-tight text-[#1d2327] flex items-center gap-2">
          <Users size={22} className="text-[#2271b1]" /> Clients
        </h1>
        <NavLink
          to="/clients/add"
          className="border border-[#2271b1] text-[#2271b1] px-[10px] py-[4px] bg-white hover:bg-[#f0f6fc] text-[13px] rounded-sm transition-colors font-semibold flex items-center gap-1"
        >
          <Plus size={13} /> Add New
        </NavLink>
      </div>

      {/* ── Tab bar + Search ── */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-3 gap-2">
        <ul className="flex flex-wrap gap-2 text-[13px] text-[#646970]">
          {tabs.map((t, i) => (
            <li key={t.val} className="flex items-center gap-2">
              <span
                className={`cursor-pointer hover:text-[#2271b1] transition-colors ${tab === t.val ? "font-semibold text-black" : ""}`}
                onClick={() => { setTab(t.val); setPage(1); }}
              >
                {t.label} <span className="text-gray-400">({t.count})</span>
              </span>
              {i < tabs.length - 1 && <span className="text-gray-300">|</span>}
            </li>
          ))}
        </ul>

        {/* Search */}
        <div className="flex items-center gap-1">
          <div className="relative">
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#8c8f94]" />
            <input
              type="text"
              placeholder="Search clients…"
              className="border border-[#8c8f94] pl-7 pr-3 py-[3px] rounded-sm w-48 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-[13px]"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
            />
          </div>
          <button
            className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-3 py-[3px] rounded-sm font-medium transition cursor-pointer"
            onClick={() => { setSearch(searchInput); setPage(1); }}
          >
            Search
          </button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap justify-between items-center bg-white px-3 py-2 border border-[#c3c4c7] -mb-px relative z-10 rounded-t-sm shadow-sm gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <select
            className="border border-[#8c8f94] px-2 py-[2px] rounded-sm text-[13px] h-[28px]"
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
          >
            <option value="">Bulk actions</option>
            <option value="delete">Delete</option>
          </select>
          <button
            className="border border-[#2271b1] text-[#2271b1] bg-white hover:bg-[#f0f6fc] px-3 py-[2px] rounded-sm font-medium h-[28px]"
            onClick={handleBulkAction}
          >
            Apply
          </button>
          {selected.length > 0 && (
            <span className="text-[12px] text-[#646970]">{selected.length} selected</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-[3px] rounded-sm font-medium flex items-center gap-1 border border-[#2271b1] h-[28px] text-[12px]"
          >
            <Download size={13} /> Export CSV
          </button>

          {/* Pagination top */}
          <div className="flex items-center gap-1 text-[13px]">
            <span className="text-[#646970] mr-1">{sorted.length} items</span>
            <button disabled={page === 1} onClick={() => setPage(1)}
              className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-[6px] py-[2px] rounded-sm disabled:opacity-40 h-[28px]">«</button>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-[6px] py-[2px] rounded-sm disabled:opacity-40 h-[28px]">‹</button>
            <span className="flex items-center gap-1 h-[28px]">
              <input readOnly value={page}
                className="border border-[#8c8f94] w-8 text-center py-[2px] rounded-sm h-[26px] text-[13px]" />
              <span className="opacity-70">of {totalPages}</span>
            </span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
              className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-[6px] py-[2px] rounded-sm disabled:opacity-40 h-[28px]">›</button>
            <button disabled={page >= totalPages} onClick={() => setPage(totalPages)}
              className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-[6px] py-[2px] rounded-sm disabled:opacity-40 h-[28px]">»</button>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-[#c3c4c7] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7]">
              <th className="p-[10px] w-10 border-r border-[#c3c4c7] text-center">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={toggleAll}
                  className="accent-[#2271b1]"
                />
              </th>
              {[
                { label: "Client", key: "name" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" },
                { label: "Date", key: "date" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="font-semibold p-[10px] cursor-pointer hover:bg-[#f0f0f1] select-none text-[#2c3338] whitespace-nowrap"
                  onClick={() => toggleSort(key)}
                >
                  {label} <SortIcon k={key} />
                </th>
              ))}
              <th className="font-semibold p-[10px] text-[#2c3338]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="py-12 text-center text-[#646970]">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
                  Loading clients…
                </div>
              </td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan="6" className="py-12 text-center text-[#646970]">
                <Users size={32} className="mx-auto mb-2 text-[#c3c4c7]" />
                No clients found.{" "}
                <NavLink to="/clients/add" className="text-[#2271b1] hover:underline">Add your first client →</NavLink>
              </td></tr>
            ) : (
              paginated.map((c, idx) => (
                <tr
                  key={c.id}
                  className={`border-b border-[#f0f0f0] hover:bg-[#f0f6fc] group transition-colors ${idx % 2 !== 0 ? "bg-[#f9f9f9]" : "bg-white"
                    } ${selected.includes(c.id) ? "bg-[#e8f0fb]" : ""}`}
                >
                  {/* Checkbox */}
                  <td className="p-[10px] text-center border-r border-[#f0f0f1]">
                    <input
                      type="checkbox"
                      checked={selected.includes(c.id)}
                      onChange={() => toggleOne(c.id)}
                      className="accent-[#2271b1]"
                    />
                  </td>

                  {/* Client name + avatar + hover actions */}
                  <td className="p-[10px] min-w-[200px]">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[12px] flex-shrink-0 mt-[1px]"
                        style={{ background: avatarColor(c.name) }}
                        title={c.name}
                      >
                        {initials(c.name)}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className="text-[#2271b1] font-semibold hover:underline cursor-pointer text-[13px] leading-snug"
                          onClick={() => navigate(`/clients/${c.id}`)}
                        >
                          {c.name}
                        </span>
                        {c.address && (
                          <span className="text-[#646970] text-[11px] mt-[1px]">{c.address}</span>
                        )}
                        {/* Hover row actions */}
                        <div className="invisible group-hover:visible flex gap-[6px] text-[12px] mt-[3px]">
                          <button
                            className="text-[#2271b1] hover:text-[#135e96] hover:underline"
                            onClick={() => navigate(`/clients/${c.id}`)}
                          >View</button>
                          <span className="text-[#c3c4c7]">|</span>
                          <button
                            className="text-[#2271b1] hover:text-[#135e96] hover:underline"
                            onClick={() => navigate(`/clients/edit/${c.id}`)}
                          >Edit</button>
                          <span className="text-[#c3c4c7]">|</span>
                          <button
                            className="text-[#b32d2e] hover:text-red-800 hover:underline"
                            onClick={() => handleDelete(c.id)}
                          >Trash</button>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="p-[10px]">
                    {c.email ? (
                      <a
                        href={`mailto:${c.email}`}
                        className="text-[#2271b1] hover:underline flex items-center gap-1 text-[12px]"
                      >
                        <Mail size={12} className="text-[#8c8f94]" />
                        {c.email}
                      </a>
                    ) : (
                      <span className="text-[#646970] text-[12px]">—</span>
                    )}
                  </td>

                  {/* Phone */}
                  <td className="p-[10px]">
                    {c.phone ? (
                      <a
                        href={`tel:${c.phone}`}
                        className="text-[#2c3338] hover:text-[#2271b1] flex items-center gap-1 text-[12px]"
                      >
                        <Phone size={12} className="text-[#8c8f94]" />
                        {c.phone}
                      </a>
                    ) : (
                      <span className="text-[#646970] text-[12px]">—</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="p-[10px] text-[12px] text-[#646970] whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#8c8f94]" />
                      {fmtDate(c.date)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-[10px]">
                    <div className="flex gap-[6px]">
                      <button
                        onClick={() => navigate(`/clients/${c.id}`)}
                        title="View"
                        className="border border-[#2271b1] text-[#2271b1] bg-white hover:bg-[#f0f6fc] p-[4px] rounded-sm transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => navigate(`/clients/edit/${c.id}`)}
                        title="Edit"
                        className="border border-[#00a32a] text-[#00a32a] bg-white hover:bg-[#f0fdf4] p-[4px] rounded-sm transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        title="Delete"
                        className="border border-[#d63638] text-[#d63638] bg-white hover:bg-[#fce7e7] p-[4px] rounded-sm transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* tfoot mirrors thead */}
          {paginated.length > 0 && (
            <tfoot>
              <tr className="border-t border-[#c3c4c7] bg-[#f6f7f7]">
                <th className="p-[10px] w-10 border-r border-[#c3c4c7] text-center">
                  <input type="checkbox" checked={allOnPageSelected} onChange={toggleAll} className="accent-[#2271b1]" />
                </th>
                <th className="font-semibold p-[10px] text-[#2c3338]">Client</th>
                <th className="font-semibold p-[10px] text-[#2c3338]">Email</th>
                <th className="font-semibold p-[10px] text-[#2c3338]">Phone</th>
                <th className="font-semibold p-[10px] text-[#2c3338]">Date</th>
                <th className="font-semibold p-[10px] text-[#2c3338]">Actions</th>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex flex-wrap justify-between items-center bg-transparent mt-2 gap-2">
        <div className="flex items-center gap-2">
          <select
            className="border border-[#8c8f94] px-2 py-[2px] rounded-sm text-[13px] h-[28px]"
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
          >
            <option value="">Bulk actions</option>
            <option value="delete">Delete</option>
          </select>
          <button
            className="border border-[#2271b1] text-[#2271b1] bg-white hover:bg-[#f0f6fc] px-3 py-[2px] rounded-sm font-medium h-[28px]"
            onClick={handleBulkAction}
          >
            Apply
          </button>
          <span className="text-[12px] text-[#646970]">
            Page {page} of {totalPages} — {sorted.length} total client{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Bottom Pagination */}
        <div className="flex items-center gap-1 text-[13px]">
          <button disabled={page === 1} onClick={() => setPage(1)}
            className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-[6px] py-[2px] rounded-sm disabled:opacity-40 h-[28px]">«</button>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-[6px] py-[2px] rounded-sm disabled:opacity-40 h-[28px]">‹</button>
          <span className="flex items-center gap-1 h-[28px]">
            <input readOnly value={page}
              className="border border-[#8c8f94] w-8 text-center py-[2px] rounded-sm h-[26px] text-[13px]" />
            <span className="opacity-70">of {totalPages}</span>
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-[6px] py-[2px] rounded-sm disabled:opacity-40 h-[28px]">›</button>
          <button disabled={page >= totalPages} onClick={() => setPage(totalPages)}
            className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] px-[6px] py-[2px] rounded-sm disabled:opacity-40 h-[28px]">»</button>
        </div>
      </div>

    </div>
  );
}