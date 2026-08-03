import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Pencil,
  Trash2,
  ArrowLeft,
  Hash,
  Calendar,
  FileText,
  ChevronUp,
  ChevronDown,
  Plus,
} from "lucide-react";

/* ── shared style tokens ── */
const S = {
  page: "min-h-screen bg-[#f0f0f1] p-5 pb-20 font-sans text-[13px] text-[#3c434a]",
  topbar: "flex items-center justify-between mb-4",
  h1: "text-[23px] font-normal text-[#1d2327] flex items-center gap-2",
  layout: "flex gap-5 items-start",
  main: "flex-1 min-w-0 flex flex-col gap-4",
  sidebar: "w-[280px] flex-shrink-0 flex flex-col gap-4",
  panel: "bg-white border border-[#c3c4c7] rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.04)]",
  pHead: "flex items-center justify-between px-3 py-2 border-b border-[#c3c4c7] cursor-pointer select-none",
  pTitle: "text-[14px] font-semibold text-[#1d2327] m-0",
  pBody: "p-0",
  btn: "inline-flex items-center gap-[5px] px-3 py-[6px] rounded-[3px] text-[13px] font-normal cursor-pointer border transition-all whitespace-nowrap",
  primary: "bg-[#2271b1] border-[#2271b1] text-white hover:bg-[#135e96] hover:border-[#135e96]",
  outline: "bg-white border-[#8c8f94] text-[#3c434a] hover:bg-[#f0f0f1] hover:border-[#646970]",
  success: "bg-[#00a32a] border-[#00a32a] text-white hover:bg-[#007017]",
  danger: "bg-white border-[#d63638] text-[#d63638] hover:bg-[#fce7e7]",
  infoRow: "flex items-start gap-4 px-4 py-[10px] border-b border-[#f0f0f1] last:border-b-0",
  sRow: "flex justify-between items-center px-3 py-[9px] border-b border-[#f0f0f1] last:border-b-0 text-[13px]",
  sLbl: "text-[#646970] flex items-center gap-[5px]",
};

/* ── Collapsible Panel ── */
function Panel({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={S.panel}>
      <div className={S.pHead} onClick={() => setOpen(o => !o)}>
        <h2 className={S.pTitle}>{title}</h2>
        <button type="button" className="text-[#787c82] hover:bg-[#f0f0f1] p-[2px] rounded-[3px]">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>
      {open && <div className={S.pBody}>{children}</div>}
    </div>
  );
}

/* ── Avatar helpers ── */
const COLORS = ["#2271b1", "#00a32a", "#d63638", "#dba617", "#7b5ea7", "#00b4d8", "#e07b39"];
const avatarBg = (n = "") => COLORS[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
const getInitials = (n = "") => n.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");

const fmtDate = (d) => {
  if (!d) return "N/A";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }); }
  catch { return d; }
};

/* ── Detail row component ── */
function DetailRow({ icon: Icon, label, value, href, linkClass = "" }) {
  return (
    <div className={S.infoRow}>
      <div className="w-8 h-8 rounded-full bg-[#f0f6fc] flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-[#2271b1]" />
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] text-[#646970] font-semibold uppercase tracking-wide">{label}</span>
        {href ? (
          <a href={href} className={`text-[13px] font-medium text-[#2271b1] hover:underline ${linkClass}`}>
            {value || "—"}
          </a>
        ) : (
          <span className="text-[13px] font-medium text-[#1d2327]">{value || <span className="text-[#b4b9be] italic">Not provided</span>}</span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
export default function ViewClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/clients/${id}/`)
      .then(({ data }) => { setClient(data); setLoading(false); })
      .catch(() => {
        toast.error("Failed to load client details.");
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await api.delete(`/clients/${id}/`);
      toast.success("Client deleted.");
      navigate("/clients");
    } catch (err) {
      toast.error(err.message || "Failed to delete client.");
    }
  };

  /* ── states ── */
  if (loading)
    return (
      <div className={S.page}>
        <div className="flex items-center justify-center h-48 gap-3 text-[#646970]">
          <div className="w-5 h-5 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
          Loading client details…
        </div>
      </div>
    );

  if (!client)
    return (
      <div className={S.page}>
        <div className="bg-[#fce7e7] border border-[#d63638] text-[#d63638] px-4 py-3 rounded-[4px]">
          Client not found.
        </div>
      </div>
    );

  const name = client.client || client.name || "Unknown";

  /* ══════════ RENDER ══════════ */
  return (
    <div className={S.page}>

      {/* ── Top bar ── */}
      <div className={S.topbar}>
        <h1 className={S.h1}>
          <User size={20} style={{ color: "#2271b1" }} />
          Client Details
          <span className="text-[16px] text-[#646970] font-normal ml-1">— {name}</span>
        </h1>
        <div className="flex gap-2">
          <button onClick={() => navigate("/clients")} className={`${S.btn} ${S.outline}`}>
            <ArrowLeft size={13} /> Back
          </button>
          <button onClick={() => navigate(`/clients/edit/${id}`)} className={`${S.btn} ${S.primary}`}>
            <Pencil size={13} /> Edit
          </button>
          <button onClick={handleDelete} className={`${S.btn} ${S.danger}`}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div className="text-[12px] text-[#646970] mb-4 flex items-center gap-1">
        <span className="cursor-pointer hover:text-[#2271b1]" onClick={() => navigate("/clients")}>Clients</span>
        <span>›</span>
        <span className="text-[#2c3338] font-medium">{name}</span>
      </div>

      {/* ── Layout ── */}
      <div className={S.layout}>

        {/* ══ LEFT / MAIN ══ */}
        <div className={S.main}>

          {/* Profile hero card */}
          <div className={S.panel}>
            <div className="p-5 flex items-center gap-5 border-b border-[#f0f0f1]">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-[22px] font-bold flex-shrink-0"
                style={{ background: avatarBg(name) }}
              >
                {getInitials(name)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[18px] font-semibold text-[#1d2327] leading-tight">{name}</h2>
                {client.company && (
                  <p className="text-[13px] text-[#646970] mt-[2px]">{client.company}</p>
                )}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {client.email && (
                    <a href={`mailto:${client.email}`}
                      className="text-[12px] text-[#2271b1] hover:underline flex items-center gap-1">
                      <Mail size={12} />{client.email}
                    </a>
                  )}
                  {client.phone && (
                    <a href={`tel:${client.phone}`}
                      className="text-[12px] text-[#2c3338] hover:text-[#2271b1] flex items-center gap-1">
                      <Phone size={12} />{client.phone}
                    </a>
                  )}
                </div>
              </div>
              <span className="bg-[#d1e7dd] text-[#0a3622] text-[11px] font-semibold uppercase px-2 py-[2px] rounded-[3px]">
                Active
              </span>
            </div>
            {/* Quick action strip */}
            <div className="px-4 py-2 flex gap-2 flex-wrap">
              <button onClick={() => navigate(`/clients/edit/${id}`)} className={`${S.btn} ${S.primary}`}>
                <Pencil size={12} /> Edit Client
              </button>
              <button onClick={() => navigate("/invoices/add")} className={`${S.btn} ${S.success}`}>
                <Plus size={12} /> Create Invoice
              </button>
              <button onClick={handleDelete} className={`${S.btn} ${S.danger}`}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>

          {/* Contact details panel */}
          <Panel title="Contact Details">
            <DetailRow icon={Mail} label="Email" value={client.email} href={client.email ? `mailto:${client.email}` : null} />
            <DetailRow icon={Phone} label="Phone" value={client.phone} href={client.phone ? `tel:${client.phone}` : null} />
            <DetailRow icon={Building2} label="Company" value={client.company} />
            <DetailRow icon={MapPin} label="Address" value={client.address} />
          </Panel>

          {/* Notes */}
          {client.notes && (
            <Panel title="Notes">
              <div className="px-4 py-3 text-[13px] text-[#3c434a] whitespace-pre-wrap leading-relaxed">
                {client.notes}
              </div>
            </Panel>
          )}
        </div>
        {/* END MAIN */}

        {/* ══ SIDEBAR ══ */}
        <div className={S.sidebar}>

          {/* Meta info card */}
          <div className={S.panel}>
            <div className={S.pHead} style={{ cursor: "default" }}>
              <h2 className={S.pTitle}>Client Info</h2>
            </div>
            <div className={S.sRow}>
              <span className={S.sLbl}><Hash size={12} />Client ID</span>
              <span className="font-semibold text-[12px]">#{client.id}</span>
            </div>
            <div className={S.sRow}>
              <span className={S.sLbl}><User size={12} />Status</span>
              <span className="bg-[#d1e7dd] text-[#0a3622] text-[11px] font-semibold uppercase px-2 py-[1px] rounded-[3px]">Active</span>
            </div>
            <div className={S.sRow}>
              <span className={S.sLbl}><Calendar size={12} />Created</span>
              <span className="text-[12px]">{fmtDate(client.created_at || client.created)}</span>
            </div>
            {client.updated_at && (
              <div className={S.sRow}>
                <span className={S.sLbl}><Calendar size={12} />Updated</span>
                <span className="text-[12px]">{fmtDate(client.updated_at)}</span>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className={S.panel}>
            <div className={S.pHead} style={{ cursor: "default" }}>
              <h2 className={S.pTitle}>Quick Actions</h2>
            </div>
            <div className="p-2 flex flex-col gap-[6px]">
              <button onClick={() => navigate(`/clients/edit/${id}`)}
                className={`${S.btn} ${S.primary} w-full justify-center`}>
                <Pencil size={13} /> Edit Client
              </button>
              <button onClick={() => navigate("/invoices/add")}
                className={`${S.btn} ${S.success} w-full justify-center`}>
                <FileText size={13} /> + New Invoice
              </button>
              <button onClick={() => navigate("/quotations/add")}
                className={`${S.btn} ${S.outline} w-full justify-center`}>
                <FileText size={13} /> + New Quote
              </button>
              <button onClick={() => navigate("/clients")}
                className={`${S.btn} ${S.outline} w-full justify-center`}>
                <ArrowLeft size={13} /> All Clients
              </button>
              <button onClick={handleDelete}
                className={`${S.btn} ${S.danger} w-full justify-center`}>
                <Trash2 size={13} /> Delete Client
              </button>
            </div>
          </div>

        </div>
        {/* END SIDEBAR */}
      </div>
    </div>
  );
}