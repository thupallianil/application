import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CreditCard, Calendar, User, IndianRupee, FileText,
  Printer, Download, Pencil, Trash2, ArrowLeft,
  Hash, ChevronUp, ChevronDown, Plus,
} from "lucide-react";
import api from "../../services/api";
import { useRole } from "../../utils/useRole";

/* ── shared tokens ── */
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
  btn: "inline-flex items-center gap-[5px] px-3 py-[6px] rounded-[3px] text-[13px] border transition-all cursor-pointer whitespace-nowrap",
  primary: "bg-[#2271b1] border-[#2271b1] text-white hover:bg-[#135e96]",
  outline: "bg-white border-[#8c8f94] text-[#3c434a] hover:bg-[#f0f0f1]",
  success: "bg-[#00a32a] border-[#00a32a] text-white hover:bg-[#007017]",
  danger: "bg-white border-[#d63638] text-[#d63638] hover:bg-[#fce7e7]",
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
        <button type="button" className="text-[#787c82] p-[2px] rounded-[3px] hover:bg-[#f0f0f1]">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}

/* ── helpers ── */
const fmtDate = (d) => {
  if (!d) return "N/A";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }); }
  catch { return d; }
};
const fmtAmt = (v) =>
  `₹${parseFloat(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const METHOD_COLORS = {
  cash: "bg-[#d1e7dd] text-[#0a3622]",
  "bank transfer": "bg-[#cfe2ff] text-[#084298]",
  "credit card": "bg-[#f8d7da] text-[#842029]",
  upi: "bg-[#fff3cd] text-[#664d03]",
};
const methodBadge = (m = "") => METHOD_COLORS[(m || "").toLowerCase()] || "bg-[#e9ecef] text-[#495057]";

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 px-4 py-[10px] border-b border-[#f0f0f1] last:border-b-0">
      <div className="w-8 h-8 rounded-full bg-[#f0f6fc] flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-[#2271b1]" />
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] text-[#646970] font-semibold uppercase tracking-wide">{label}</span>
        <span className="text-[13px] font-medium text-[#1d2327]">{value || <span className="text-[#b4b9be] italic">Not provided</span>}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
export default function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useRole();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPayment(); }, [id]);

  const fetchPayment = async () => {
    try {
      const { data } = await api.get(`/payments/${id}/`);
      setPayment(data);
    } catch {
      toast.error("Failed to load payment details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this payment?")) return;
    try {
      await api.delete(`/payments/${id}/`);
      toast.success("Payment deleted.");
      navigate("/payments");
    } catch { toast.error("Delete failed."); }
  };

  const handlePrint = () => window.print();

  const handleDownloadReceipt = () => {
    const win = window.open("", "_blank");
    const payId = payment?.payment_id || `PAY-${id}`;
    win.document.write(`
      <html>
        <head>
          <title>Receipt – ${payId}</title>
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family: Arial, sans-serif; padding: 48px; color:#1d2327; }
            .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
            h1 { font-size:26px; font-weight:700; }
            .sub { color:#646970; font-size:13px; margin-top:4px; }
            .stamp { font-size:22px; font-weight:900; color:#00a32a; border:3px solid #00a32a; padding:6px 18px; border-radius:4px; transform:rotate(-8deg); display:inline-block; }
            hr { border:none; border-top:1px solid #e2e8f0; margin:24px 0; }
            .grid { display:grid; grid-template-columns:1fr 1fr; gap:16px 32px; margin-top:16px; }
            .field label { font-size:11px; color:#646970; text-transform:uppercase; letter-spacing:.05em; }
            .field p { font-size:15px; font-weight:600; margin-top:3px; }
            .badge { display:inline-block; background:#d1e7dd; color:#0a3622; font-size:12px; font-weight:700; padding:3px 10px; border-radius:3px; }
            .footer { margin-top:32px; font-size:12px; color:#646970; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Payment Receipt</h1>
              <p class="sub">Receipt ID: ${payId}</p>
            </div>
            <div class="stamp">PAID</div>
          </div>
          <hr/>
          <div class="grid">
            <div class="field"><label>Payment ID</label><p>${payment?.payment_id || "—"}</p></div>
            <div class="field"><label>Client</label><p>${payment?.client_name || payment?.client || "—"}</p></div>
            <div class="field"><label>Amount</label><p>₹${parseFloat(payment?.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p></div>
            <div class="field"><label>Method</label><p>${payment?.method || "—"}</p></div>
            <div class="field"><label>Date</label><p>${fmtDate(payment?.date)}</p></div>
            <div class="field"><label>Status</label><p><span class="badge">PAID</span></p></div>
          </div>
          <hr/>
          <p class="footer">This is an official payment receipt. Thank you for your payment.</p>
          <script>window.onload=()=>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  /* ── states ── */
  if (loading)
    return (
      <div className={S.page}>
        <div className="flex items-center justify-center h-48 gap-3 text-[#646970]">
          <div className="w-5 h-5 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
          Loading payment details…
        </div>
      </div>
    );

  if (!payment)
    return (
      <div className={S.page}>
        <div className="bg-[#fce7e7] border border-[#d63638] text-[#d63638] px-4 py-3 rounded-[4px]">
          Payment not found.
        </div>
      </div>
    );

  const payId = payment.payment_id || `PAY-${id}`;
  const client = payment.client_name || payment.client || "N/A";
  const method = payment.method || "—";

  /* ══════════ RENDER ══════════ */
  return (
    <div className={S.page}>

      {/* ── Top bar ── */}
      <div className={S.topbar}>
        <h1 className={S.h1}>
          <CreditCard size={20} style={{ color: "#2271b1" }} />
          {role !== "admin" ? "Payment Receipt" : "Payment Details"}
          <span className="text-[16px] text-[#646970] font-normal ml-1">— {payId}</span>
        </h1>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => navigate("/payments")} className={`${S.btn} ${S.outline}`}>
            <ArrowLeft size={13} /> Back
          </button>
          {role !== "admin" && (
            <>
              <button onClick={handlePrint} className={`${S.btn} ${S.outline}`}>
                <Printer size={13} /> Print
              </button>
              <button onClick={handleDownloadReceipt} className={`${S.btn} ${S.success}`}>
                <Download size={13} /> Download Receipt
              </button>
            </>
          )}
          {role === "admin" && (
            <>
              <button onClick={handleDownloadReceipt} className={`${S.btn} ${S.outline}`}>
                <Download size={13} /> Receipt
              </button>
              <button onClick={() => navigate(`/payments/edit/${id}`)} className={`${S.btn} ${S.primary}`}>
                <Pencil size={13} /> Edit
              </button>
              <button onClick={handleDelete} className={`${S.btn} ${S.danger}`}>
                <Trash2 size={13} /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div className="text-[12px] text-[#646970] mb-4 flex items-center gap-1">
        <span className="cursor-pointer hover:text-[#2271b1]" onClick={() => navigate("/payments")}>Payments</span>
        <span>›</span>
        <span className="text-[#2c3338] font-medium">{payId}</span>
      </div>

      {/* ── Layout ── */}
      <div className={S.layout}>

        {/* ══ LEFT MAIN ══ */}
        <div className={S.main}>

          {/* Hero receipt card */}
          <div className={S.panel}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] text-[#646970] uppercase tracking-wide mb-1">Payment ID</div>
                  <div className="text-[22px] font-bold text-[#1d2327]">{payId}</div>
                  <div className="text-[13px] text-[#646970] mt-1">{client}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-[28px] font-bold text-[#1d2327]">{fmtAmt(payment.amount)}</div>
                  <span className={`inline-block text-[11px] font-bold uppercase px-3 py-[3px] rounded-[3px] ${methodBadge(method)}`}>
                    {method}
                  </span>
                  {role !== "admin" && (
                    <span className="inline-block border-2 border-[#00a32a] text-[#00a32a] text-[13px] font-bold tracking-widest uppercase px-3 py-1 rounded rotate-[-5deg]">
                      PAID
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="px-5 py-2 border-t border-[#f0f0f1] flex gap-2 flex-wrap">
              {role !== "admin" ? (
                <>
                  <button onClick={handlePrint} className={`${S.btn} ${S.outline}`}><Printer size={12} /> Print</button>
                  <button onClick={handleDownloadReceipt} className={`${S.btn} ${S.success}`}><Download size={12} /> Download</button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate(`/payments/edit/${id}`)} className={`${S.btn} ${S.primary}`}><Pencil size={12} /> Edit</button>
                  <button onClick={handleDownloadReceipt} className={`${S.btn} ${S.outline}`}><Download size={12} /> Receipt</button>
                  <button onClick={handleDelete} className={`${S.btn} ${S.danger}`}><Trash2 size={12} /> Delete</button>
                </>
              )}
            </div>
          </div>

          {/* Payment details panel */}
          <Panel title="Payment Details">
            <DetailRow icon={Hash} label="Payment ID" value={payId} />
            <DetailRow icon={User} label="Client" value={client} />
            <DetailRow icon={IndianRupee} label="Amount" value={fmtAmt(payment.amount)} />
            <DetailRow icon={CreditCard} label="Payment Method" value={method} />
            <DetailRow icon={Calendar} label="Payment Date" value={fmtDate(payment.date)} />
            {payment.notes && (
              <DetailRow icon={FileText} label="Notes" value={payment.notes} />
            )}
          </Panel>

          {/* Receipt notice for clients */}
          {role !== "admin" && (
            <div className="bg-[#d1e7dd] border border-[#a3cfbb] rounded-[4px] px-4 py-3 flex items-center gap-3">
              <span className="inline-block border-2 border-[#0a3622] text-[#0a3622] text-[11px] font-bold tracking-widest uppercase px-2 py-[2px] rounded rotate-[-4deg]">
                PAID
              </span>
              <p className="text-[13px] text-[#0a3622]">
                This is an official payment receipt confirming your payment. Thank you!
              </p>
            </div>
          )}
        </div>
        {/* END MAIN */}

        {/* ══ SIDEBAR ══ */}
        <div className={S.sidebar}>

          {/* Meta info */}
          <div className={S.panel}>
            <div className={S.pHead} style={{ cursor: "default" }}>
              <h2 className={S.pTitle}>Payment Info</h2>
            </div>
            <div className={S.sRow}>
              <span className={S.sLbl}><Hash size={12} />Record ID</span>
              <span className="font-semibold text-[12px]">#{payment.id}</span>
            </div>
            <div className={S.sRow}>
              <span className={S.sLbl}><CreditCard size={12} />Status</span>
              <span className="bg-[#d1e7dd] text-[#0a3622] text-[11px] font-bold uppercase px-2 py-[1px] rounded-[3px]">Paid</span>
            </div>
            <div className={S.sRow}>
              <span className={S.sLbl}><Calendar size={12} />Date</span>
              <span className="text-[12px]">{fmtDate(payment.date)}</span>
            </div>
            <div className={S.sRow}>
              <span className={S.sLbl}><IndianRupee size={12} />Amount</span>
              <span className="font-semibold text-[13px] text-[#00a32a]">{fmtAmt(payment.amount)}</span>
            </div>
          </div>

          {/* Quick actions */}
          <div className={S.panel}>
            <div className={S.pHead} style={{ cursor: "default" }}>
              <h2 className={S.pTitle}>Quick Actions</h2>
            </div>
            <div className="p-2 flex flex-col gap-[6px]">
              {role !== "admin" ? (
                <>
                  <button onClick={handlePrint} className={`${S.btn} ${S.outline} w-full justify-center`}><Printer size={13} /> Print Receipt</button>
                  <button onClick={handleDownloadReceipt} className={`${S.btn} ${S.success} w-full justify-center`}><Download size={13} /> Download</button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate(`/payments/edit/${id}`)} className={`${S.btn} ${S.primary} w-full justify-center`}><Pencil size={13} /> Edit Payment</button>
                  <button onClick={handleDownloadReceipt} className={`${S.btn} ${S.outline} w-full justify-center`}><Download size={13} /> Print Receipt</button>
                  <button onClick={() => navigate("/payments/add")} className={`${S.btn} ${S.success} w-full justify-center`}><Plus size={13} /> New Payment</button>
                  <button onClick={handleDelete} className={`${S.btn} ${S.danger} w-full justify-center`}><Trash2 size={13} /> Delete</button>
                </>
              )}
              <button onClick={() => navigate("/payments")} className={`${S.btn} ${S.outline} w-full justify-center`}><ArrowLeft size={13} /> All Payments</button>
            </div>
          </div>

        </div>
        {/* END SIDEBAR */}
      </div>
    </div>
  );
}