import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import {
  CreditCard, User, IndianRupee, FileText, Calendar,
  Hash, Save, X, ArrowLeft, ChevronUp, ChevronDown, Eye
} from "lucide-react";

const S = {
  page: "min-h-screen bg-[#f0f0f1] p-5 pb-20 font-sans text-[13px] text-[#3c434a]",
  topbar: "flex items-center justify-between mb-4",
  h1: "text-[23px] font-normal text-[#1d2327] flex items-center gap-2",
  layout: "flex gap-5 items-start",
  main: "flex-1 min-w-0 flex flex-col gap-4",
  sidebar: "w-[280px] flex-shrink-0 flex flex-col gap-4",
  panel: "bg-white border border-[#c3c4c7] rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.04)]",
  pHead: "flex items-center justify-between px-3 py-2 border-b border-[#c3c4c7] cursor-pointer select-none",
  pTitle: "text-[14px] font-semibold text-[#1d2327]",
  pBody: "p-3",
  label: "block text-[12px] font-semibold text-[#3c434a] mb-[4px]",
  input: "w-full border border-[#8c8f94] rounded-[4px] px-2 py-[6px] text-[13px] text-[#1d2327] bg-white outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] box-border transition-all",
  field: "mb-3 last:mb-0",
  btn: "inline-flex items-center justify-center gap-[5px] px-3 py-[6px] rounded-[3px] text-[13px] font-normal cursor-pointer border transition-all whitespace-nowrap",
  primary: "bg-[#2271b1] border-[#2271b1] text-white hover:bg-[#135e96] hover:border-[#135e96]",
  outline: "bg-white border-[#8c8f94] text-[#3c434a] hover:bg-[#f0f0f1] hover:border-[#646970]",
  infoRow: "flex justify-between items-center px-3 py-[9px] border-b border-[#f0f0f1] last:border-b-0 text-[13px]",
  infoLbl: "text-[#646970] flex items-center gap-[5px]",
};

function Panel({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={S.panel}>
      <div className={S.pHead} onClick={() => setOpen(o => !o)}>
        <span className={S.pTitle}>{title}</span>
        <button type="button" className="text-[#787c82] hover:bg-[#f0f0f1] p-[2px] rounded-[3px]">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>
      {open && <div className={S.pBody}>{children}</div>}
    </div>
  );
}

export default function EditPayment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [payment, setPayment] = useState({
    payment_id: "",
    client: "",
    amount: "",
    method: "Bank Transfer",
    date: "",
    notes: "",
  });

  const [original, setOriginal] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/clients/"),
      api.get(`/payments/${id}/`)
    ]).then(([clientsRes, paymentRes]) => {
      setClients(clientsRes.data);
      const data = paymentRes.data;
      const mapped = {
        payment_id: data.payment_id || "",
        client: data.client || "",
        amount: data.amount || "",
        method: data.method || "Bank Transfer",
        date: data.date || "",
        notes: data.notes || "",
      };
      setPayment(mapped);
      setOriginal(mapped);
      setLoading(false);
    }).catch(() => {
      toast.error("Failed to load details.");
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => setPayment({ ...payment, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!payment.client) { toast.error("Please select a client."); return; }

    setSaving(true);
    try {
      await api.put(`/payments/${id}/`, payment);
      toast.success("Payment updated successfully!");
      navigate("/payments");
    } catch (err) {
      toast.error(err.message || "Failed to update payment.");
    } finally {
      setSaving(false);
    }
  };

  const isDirty = JSON.stringify(payment) !== JSON.stringify(original);

  if (loading) return (
    <div className={S.page}>
      <div className="flex items-center justify-center h-48 gap-3 text-[#646970]">
        <div className="w-5 h-5 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
        Loading payment details…
      </div>
    </div>
  );

  return (
    <div className={S.page}>
      <form onSubmit={handleSubmit}>

        {/* Top bar */}
        <div className={S.topbar}>
          <h1 className={S.h1}>
            <CreditCard size={20} className="text-[#2271b1]" />
            Edit Payment
            <span className="text-[16px] text-[#646970] font-normal ml-1">— {payment.payment_id}</span>
          </h1>
          <div className="flex gap-2">
            <button type="button" onClick={() => navigate("/payments")} className={`${S.btn} ${S.outline}`}>
              <ArrowLeft size={13} /> Cancel
            </button>
            <button type="button" onClick={() => navigate(`/payments/${id}`)} className={`${S.btn} ${S.outline}`}>
              <Eye size={13} /> View
            </button>
            <button type="submit" disabled={saving} className={`${S.btn} ${S.primary} disabled:opacity-60`}>
              <Save size={13} /> {saving ? "Saving…" : "Update"}
            </button>
          </div>
        </div>

        <div className={S.layout}>

          {/* MAIN */}
          <div className={S.main}>

            {/* Payment ID title style */}
            <div className={`${S.panel} p-3`}>
              <input
                required
                name="payment_id"
                value={payment.payment_id}
                onChange={handleChange}
                placeholder="Payment ID (e.g., PAY-1001)"
                className="w-full text-[22px] font-light text-[#1d2327] border border-[#8c8f94] rounded-[4px] px-3 py-[9px] outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] transition-all placeholder:text-[#b4b9be] placeholder:italic"
              />
            </div>

            {/* Core Details */}
            <Panel title="Payment Details">
              <div className="grid grid-cols-2 gap-4">
                <div className={S.field}>
                  <label className={S.label}><User size={11} className="inline mr-1" />Client *</label>
                  <select required name="client" value={payment.client} onChange={handleChange} className={S.input}>
                    <option value="">Select a client…</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.client || c.name}</option>)}
                  </select>
                </div>

                <div className={S.field}>
                  <label className={S.label}><IndianRupee size={11} className="inline mr-1" />Amount *</label>
                  <input required type="number" step="0.01" name="amount" value={payment.amount} onChange={handleChange} placeholder="0.00" className={S.input} />
                </div>

                <div className={S.field}>
                  <label className={S.label}><CreditCard size={11} className="inline mr-1" />Payment Method</label>
                  <select name="method" value={payment.method} onChange={handleChange} className={S.input}>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>

                <div className={S.field}>
                  <label className={S.label}><Calendar size={11} className="inline mr-1" />Date Received</label>
                  <input type="date" name="date" value={payment.date} onChange={handleChange} className={S.input} />
                </div>
              </div>
            </Panel>

            {/* Optional Notes */}
            <Panel title="Notes (Optional)">
              <div className={S.field}>
                <textarea
                  rows="3"
                  name="notes"
                  value={payment.notes}
                  onChange={handleChange}
                  placeholder="Enter details like reference numbers, check numbers, etc."
                  className={`${S.input} resize-vertical`}
                />
              </div>
            </Panel>

          </div>

          {/* SIDEBAR */}
          <div className={S.sidebar}>

            <div className={S.panel}>
              <div className={S.pHead} style={{ cursor: "default" }}>
                <span className={S.pTitle}>Update</span>
                {isDirty && (
                  <span className="text-[11px] text-[#dba617] font-medium bg-[#fff3cd] px-2 py-[1px] rounded-[3px]">
                    Unsaved
                  </span>
                )}
              </div>
              <div className={S.infoRow}>
                <span className={S.infoLbl}><Hash size={12} />Record ID</span>
                <span className="font-semibold text-[12px]">#{id}</span>
              </div>
              <div className="px-3 py-[9px] border-t border-[#c3c4c7] flex gap-2">
                <button type="button" onClick={() => navigate("/payments")} className={`${S.btn} ${S.outline} flex-1`}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={`${S.btn} ${S.primary} flex-1 disabled:opacity-60`}>
                  <Save size={13} /> {saving ? "Saving…" : "Update"}
                </button>
              </div>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
}