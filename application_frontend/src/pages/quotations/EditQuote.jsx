import React, { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { fetchMultipleSettings, formatAmount, getCurrencySymbol } from "../../services/settingsService";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import DocumentPreviewModal from "../../components/documents/DocumentPreviewModal";
import {
  Plus, Trash2, Save, ChevronUp, ChevronDown, FileText, CreditCard,
  User, Calendar, Hash, Tag, X, Eye, Bold, Italic, Underline,
  List, ListOrdered, Link, Image, Code, HelpCircle, FileCheck, Printer,
} from "lucide-react";

/* ─────────────────────────────── styles ─────────────────────────────── */
const styles = `
  .ai-page {
    min-height: 100vh;
    background: #f0f0f1;
    padding: 20px 20px 40px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, sans-serif;
    font-size: 13px;
    color: #3c434a;
  }
  .ai-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .ai-topbar h1 {
    font-size: 23px;
    font-weight: 400;
    color: #1d2327;
    margin: 0;
    line-height: 1.3;
  }
  .ai-topbar-actions { display: flex; gap: 8px; }
  .ai-layout { display: flex; gap: 20px; align-items: flex-start; }
  .ai-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
  .ai-sidebar { width: 282px; flex-shrink: 0; display: flex; flex-direction: column; gap: 16px; }
  .ai-panel {
    background: #fff;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0,0,0,.04);
  }
  .ai-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: #fff;
    border-bottom: 1px solid #c3c4c7;
    border-radius: 4px 4px 0 0;
    cursor: pointer;
    user-select: none;
  }
  .ai-panel-header h2 { font-size: 14px; font-weight: 600; color: #1d2327; margin: 0; }
  .ai-panel-header-actions { display: flex; align-items: center; gap: 6px; }
  .ai-toggle-btn {
    background: none; border: none; cursor: pointer; padding: 2px 4px;
    color: #787c82; display: flex; align-items: center; border-radius: 3px;
  }
  .ai-toggle-btn:hover { background: #f0f0f1; }
  .ai-panel-body { padding: 12px; }
  .ai-title-input {
    width: 100%; font-size: 1.4em; font-weight: 300; color: #1d2327;
    border: 1px solid #8c8f94; border-radius: 4px; padding: 10px 12px;
    box-sizing: border-box; outline: none; transition: border-color .15s;
  }
  .ai-title-input:focus { border-color: #2271b1; box-shadow: 0 0 0 1px #2271b1; }
  .ai-title-input::placeholder { color: #b4b9be; font-style: italic; }
  .ai-editor-toolbar {
    display: flex; flex-wrap: wrap; gap: 2px; padding: 4px 6px;
    background: #f0f0f1; border: 1px solid #c3c4c7;
    border-radius: 4px 4px 0 0; border-bottom: none;
  }
  .ai-toolbar-btn {
    background: none; border: 1px solid transparent; border-radius: 3px;
    padding: 3px 7px; cursor: pointer; font-size: 12px; font-weight: 600;
    color: #3c434a; transition: all .12s; display:inline-flex; align-items:center; gap:3px;
  }
  .ai-toolbar-btn:hover { background: #fff; border-color: #c3c4c7; }
  .ai-toolbar-btn.active { background: #fff; border-color: #2271b1; color: #2271b1; }
  .ai-toolbar-sep { width: 1px; background: #c3c4c7; margin: 2px 4px; align-self: stretch; }
  .ai-editor-area {
    width: 100%; min-height: 120px; border: 1px solid #c3c4c7;
    border-radius: 0 0 4px 4px; padding: 10px 12px; font-size: 13px;
    resize: vertical; box-sizing: border-box; outline: none;
    font-family: inherit; color: #3c434a; transition: border-color .15s;
  }
  .ai-editor-area:focus { border-color: #2271b1; box-shadow: 0 0 0 1px #2271b1; }
  .ai-label { display: block; font-size: 12px; font-weight: 600; color: #3c434a; margin-bottom: 4px; }
  .ai-input, .ai-select {
    width: 100%; border: 1px solid #8c8f94; border-radius: 4px;
    padding: 6px 8px; font-size: 13px; font-family: inherit; color: #1d2327;
    box-sizing: border-box; outline: none; background: #fff; transition: border-color .15s;
  }
  .ai-input:focus, .ai-select:focus { border-color: #2271b1; box-shadow: 0 0 0 1px #2271b1; }
  .ai-input-sm {
    width: 80px; border: 1px solid #8c8f94; border-radius: 4px;
    padding: 5px 7px; font-size: 13px; font-family: inherit; color: #1d2327;
    box-sizing: border-box; outline: none; background: #fff; text-align: right;
  }
  .ai-input-sm:focus { border-color: #2271b1; box-shadow: 0 0 0 1px #2271b1; }
  .ai-field { margin-bottom: 12px; }
  .ai-field:last-child { margin-bottom: 0; }
  .ai-line-items-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 12px; background: #fff; border-bottom: 1px solid #c3c4c7;
    border-radius: 4px 4px 0 0;
  }
  .ai-line-items-header h2 { font-size: 14px; font-weight: 600; color: #1d2327; margin: 0; }
  .ai-items-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .ai-items-table thead tr { background: #f6f7f7; border-bottom: 1px solid #e2e4e7; }
  .ai-items-table th {
    padding: 7px 10px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .04em; color: #646970; text-align: left;
  }
  .ai-items-table th.right { text-align: right; }
  .ai-items-table tbody tr { border-bottom: 1px solid #e2e4e7; }
  .ai-items-table tbody tr:last-child { border-bottom: none; }
  .ai-items-table td { padding: 8px 10px; vertical-align: top; }
  .ai-item-name-input {
    width: 100%; border: 1px solid #c3c4c7; border-radius: 3px;
    padding: 5px 8px; font-size: 13px; font-family: inherit; outline: none;
    box-sizing: border-box; background: #fff; transition: border-color .15s;
  }
  .ai-item-name-input:focus { border-color: #2271b1; box-shadow: 0 0 0 1px #2271b1; }
  .ai-item-desc {
    width: 100%; margin-top: 4px; font-size: 12px; color: #646970;
    border: 1px solid #c3c4c7; border-radius: 3px; padding: 4px 8px;
    font-family: inherit; outline: none; resize: none; box-sizing: border-box;
    transition: border-color .15s;
  }
  .ai-item-desc:focus { border-color: #2271b1; }
  .ai-item-total { font-weight: 600; color: #1d2327; text-align: right; }
  .ai-del-btn {
    background: none; border: none; cursor: pointer; padding: 4px; color: #d63638;
    border-radius: 3px; display: flex; align-items: center; transition: background .12s;
  }
  .ai-del-btn:hover { background: #fce7e7; }
  .ai-totals { padding: 12px 16px; border-top: 1px solid #e2e4e7; display: flex; justify-content: flex-end; }
  .ai-totals-grid {
    width: 300px; display: grid; grid-template-columns: 1fr auto;
    gap: 6px 16px; align-items: center;
  }
  .ai-totals-grid .label { font-size: 13px; color: #646970; }
  .ai-totals-grid .value { font-size: 13px; color: #1d2327; font-weight: 500; text-align: right; }
  .ai-totals-grid .grand { font-size: 15px; font-weight: 700; color: #1d2327; }
  .ai-totals-divider { grid-column: 1 / -1; height: 1px; background: #e2e4e7; margin: 4px 0; }
  .ai-add-item-footer { padding: 10px 12px; border-top: 1px solid #e2e4e7; display: flex; gap: 8px; }
  .ai-payment-card { border: 1px solid #c3c4c7; border-radius: 4px; margin-bottom: 12px; overflow: hidden; }
  .ai-payment-card:last-of-type { margin-bottom: 0; }
  .ai-payment-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 7px 12px; background: #f6f7f7; border-bottom: 1px solid #c3c4c7;
    font-size: 13px; font-weight: 600; color: #3c434a;
  }
  .ai-payment-card-body { padding: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .ai-payment-card-body .full { grid-column: 1 / -1; }
  .ai-btn {
    display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px;
    border-radius: 3px; font-size: 13px; font-weight: 400; cursor: pointer;
    border: 1px solid transparent; text-decoration: none; transition: all .12s;
    line-height: 1.4; white-space: nowrap;
  }
  .ai-btn-primary { background: #2271b1; border-color: #2271b1; color: #fff; }
  .ai-btn-primary:hover { background: #135e96; border-color: #135e96; }
  .ai-btn-primary:disabled { opacity: .6; cursor: not-allowed; }
  .ai-btn-secondary { background: #fff; border-color: #2271b1; color: #2271b1; }
  .ai-btn-secondary:hover { background: #f0f6fc; }
  .ai-btn-outline { background: #fff; border-color: #8c8f94; color: #3c434a; }
  .ai-btn-outline:hover { background: #f0f0f1; border-color: #646970; }
  .ai-btn-success { background: #00a32a; border-color: #00a32a; color: #fff; }
  .ai-btn-success:hover { background: #007017; }
  .ai-btn-draft { background: #f6f7f7; border-color: #8c8f94; color: #3c434a; }
  .ai-btn-draft:hover { background: #e9e9e9; }
  .ai-btn-sm { padding: 4px 8px; font-size: 12px; }
  .ai-btn-w-full { width: 100%; justify-content: center; }
  .ai-sidebar-publish .ai-panel-body { padding: 0; }
  .ai-pub-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #f0f0f1; }
  .ai-pub-row:last-child { border-bottom: none; }
  .ai-pub-label { font-size: 13px; color: #646970; display: flex; align-items: center; gap: 6px; }
  .ai-pub-value { font-weight: 600; font-size: 13px; }
  .ai-pub-actions { padding: 10px 12px; border-top: 1px solid #c3c4c7; display: flex; gap: 8px; flex-wrap: wrap; }
  .ai-pub-actions .ai-btn { flex: 1; justify-content: center; }
  .ai-status-badge {
    display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 3px;
    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em;
  }
  .status-pending { background: #fff3cd; color: #856404; }
  .status-paid    { background: #d1e7dd; color: #0a3622; }
  .status-overdue { background: #f8d7da; color: #842029; }
  .status-draft   { background: #e2e3e5; color: #41464b; }
  .ai-totals-sidebar .ai-panel-body { padding: 0; }
  .ai-totals-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 12px; border-bottom: 1px solid #f0f0f1; font-size: 13px;
  }
  .ai-totals-row:last-child { border-bottom: none; }
  .ai-totals-row.grand-row {
    font-weight: 700; font-size: 15px; background: #f6f7f7; border-top: 2px solid #c3c4c7;
  }
  .ai-totals-row.red-val .val { color: #d63638; }
  .ai-totals-row .val { font-weight: 600; }
  .ai-check-row {
    display: flex; align-items: center; gap: 8px; padding: 6px 0;
    font-size: 13px; color: #3c434a; border-bottom: 1px solid #f0f0f1; cursor: pointer;
  }
  .ai-check-row:last-child { border-bottom: none; }
  .ai-check-row input[type=checkbox] { accent-color: #2271b1; cursor: pointer; }
  .ai-check-row label { cursor: pointer; flex: 1; }
  .ai-page-title-wrap {
    background: #fff; border: 1px solid #c3c4c7; border-radius: 4px;
    padding: 12px; box-shadow: 0 1px 1px rgba(0,0,0,.04);
  }
  /* ── Preview Modal ── */
  .ai-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 9999;
    display: flex; align-items: flex-start; justify-content: center;
    padding: 40px 20px; overflow-y: auto;
  }
  .ai-modal {
    background: #fff; border-radius: 6px; width: 100%; max-width: 700px;
    box-shadow: 0 8px 32px rgba(0,0,0,.25); overflow: hidden;
  }
  .ai-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; border-bottom: 1px solid #c3c4c7; background: #f6f7f7;
  }
  .ai-modal-header h3 { margin: 0; font-size: 16px; color: #1d2327; }
  .ai-modal-body { padding: 24px; }
  .ai-preview-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
  .ai-preview-title { font-size: 22px; font-weight: 700; color: #1d2327; }
  .ai-preview-meta { font-size: 12px; color: #646970; margin-top: 4px; }
  .ai-preview-table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
  .ai-preview-table th { padding: 7px 10px; background: #f6f7f7; border: 1px solid #e2e4e7; font-weight: 600; text-align: left; }
  .ai-preview-table td { padding: 7px 10px; border: 1px solid #e2e4e7; }
  .ai-preview-totals { margin-left: auto; width: 260px; }
  .ai-preview-totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
  .ai-preview-totals-row.grand { font-weight: 700; font-size: 15px; border-top: 2px solid #c3c4c7; margin-top: 6px; padding-top: 8px; }
  .ai-preview-notes { margin-top: 20px; font-size: 12px; color: #646970; white-space: pre-wrap; border-top: 1px solid #e2e4e7; padding-top: 12px; }
  .ai-modal-footer { padding: 12px 20px; border-top: 1px solid #c3c4c7; display: flex; gap: 8px; justify-content: flex-end; }
  /* ── Help tooltip area ── */
  .ai-help-link { background: none; border: none; cursor: pointer; color: #2271b1; font-size: 12px; display:flex; align-items:center; gap:3px; padding: 2px 4px; border-radius: 3px; }
  .ai-help-link:hover { background: #f0f6fc; text-decoration: underline; }
  /* misc */
  .font-bold { font-weight: 700; }
`;

function applyFormat(textareaRef, stateSetter, stateValue, tag) {
  const el = textareaRef.current;
  if (!el) return;
  el.focus();

  const start = el.selectionStart;
  const end = el.selectionEnd;
  const sel = stateValue.substring(start, end);
  const before = stateValue.substring(0, start);
  const after = stateValue.substring(end);

  let newText = stateValue;
  let newCursorStart = start;
  let newCursorEnd = end;

  switch (tag) {
    case "bold": newText = `${before}**${sel || "bold text"}**${after}`; newCursorEnd = start + 2 + (sel || "bold text").length; break;
    case "italic": newText = `${before}_${sel || "italic text"}_${after}`; newCursorEnd = start + 1 + (sel || "italic text").length; break;
    case "underline": newText = `${before}<u>${sel || "underlined"}</u>${after}`; newCursorEnd = start + 3 + (sel || "underlined").length; break;
    case "ul": newText = `${before}\n- ${sel || "List item"}\n${after}`; newCursorEnd = start + 3 + (sel || "List item").length; break;
    case "ol": newText = `${before}\n1. ${sel || "List item"}\n${after}`; newCursorEnd = start + 4 + (sel || "List item").length; break;
    case "link": {
      const url = window.prompt("Enter URL:", "https://");
      if (!url) return;
      const linkText = sel || "link text";
      newText = `${before}[${linkText}](${url})${after}`;
      newCursorEnd = start + linkText.length + url.length + 4;
      break;
    }
    case "code": newText = `${before}\`${sel || "code"}\`${after}`; newCursorEnd = start + 1 + (sel || "code").length; break;
    default: return;
  }

  stateSetter(newText);
  // restore cursor after setState (needs setTimeout)
  setTimeout(() => {
    el.selectionStart = newCursorStart;
    el.selectionEnd = newCursorEnd;
    el.focus();
  }, 0);
}

/* ════════════════════════════════════════════
   RichEditor component – toolbar + textarea
   ════════════════════════════════════════════ */
function RichEditor({ value, onChange, name, rows = 5, placeholder }) {
  const ref = useRef(null);
  const set = (newVal) => onChange({ target: { name, value: newVal } });
  const fmt = (tag) => applyFormat(ref, set, value, tag);

  return (
    <div>
      <div className="ai-editor-toolbar">
        <button type="button" className="ai-toolbar-btn" title="Bold (wraps selection with **)" onClick={() => fmt("bold")}>
          <Bold size={13} />
        </button>
        <button type="button" className="ai-toolbar-btn" title="Italic (wraps selection with _)" onClick={() => fmt("italic")}>
          <Italic size={13} />
        </button>
        <button type="button" className="ai-toolbar-btn" title="Underline (wraps with <u>)" onClick={() => fmt("underline")}>
          <Underline size={13} />
        </button>
        <div className="ai-toolbar-sep" />
        <button type="button" className="ai-toolbar-btn" title="Bullet list" onClick={() => fmt("ul")}>
          <List size={13} />
        </button>
        <button type="button" className="ai-toolbar-btn" title="Numbered list" onClick={() => fmt("ol")}>
          <ListOrdered size={13} />
        </button>
        <div className="ai-toolbar-sep" />
        <button type="button" className="ai-toolbar-btn" title="Insert link [text](url)" onClick={() => fmt("link")}>
          <Link size={13} />
        </button>
        <button type="button" className="ai-toolbar-btn" title="Inline code (`code`)" onClick={() => fmt("code")}>
          <Code size={13} />
        </button>
      </div>
      <textarea
        ref={ref}
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="ai-editor-area"
        style={{ borderRadius: "0 0 4px 4px" }}
      />
    </div>
  );
}

/* ════════════════════
   Collapsible Panel
   ════════════════════ */
function Panel({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="ai-panel">
      <div className="ai-panel-header" onClick={() => setOpen((o) => !o)}>
        <h2>{title}</h2>
        <button type="button" className="ai-toggle-btn" onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {open && <div className="ai-panel-body">{children}</div>}
    </div>
  );
}




export default function EditQuote() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pricesWithTax, setPricesWithTax] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState({});

  const [quote, setQuote] = useState({
    title: "",
    quotation_id: "",
    client: "",
    status: "Pending",
    quoteDate: "",
    validUntil: "",
    currency: "INR",
    discount: 0,
    taxRate: 18,
    description: "",
    terms: "Quotation is valid for 30 days.",
    _clientName: "",
    template: "Template 1",
  });

  const [items, setItems] = useState([
    { item: "", description: "", qty: 1, rate: 0, tax: 18, total: 0 },
  ]);

  useEffect(() => {
    loadClients();
    loadQuote();

    fetchMultipleSettings(['quotes', 'payments']).then(res => {
      if (res.payments) setPaymentSettings(res.payments);
      if (res.quotes && res.quotes.template) {
        setQuote(prev => ({
          ...prev,
          template: prev.template && prev.template !== "Template 1" ? prev.template : res.quotes.template,
          customCss: res.quotes.customCss || ""
        }));
      }
    });
  }, [id]);

  const loadQuote = async () => {
    try {
      const res = await api.get(`/quotes/${id}/`);
      const data = res.data;

      setQuote({
        title: data.title || "",
        quotation_id: data.quotation_id || "",
        client: data.client || "",
        status: data.status || "Draft",
        quoteDate: data.quoteDate || "",
        validUntil: data.validUntil || "",
        currency: data.currency || "INR",
        discount: data.discount || 0,
        taxRate: data.taxRate || 18,
        description: data.description || "",
        terms: data.terms || "",
        _clientName: "",
      });

      if (data.items && data.items.length > 0) {
        setItems(data.items.map(item => ({
          ...item,
          tax: item.tax ?? 18
        })));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load quotation details.");
    }
  };

  const loadClients = async () => {
    try {
      const res = await api.get("/clients/");
      setClients(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (clients.length > 0 && quote.client) {
      const found = clients.find((c) => String(c.id) === String(quote.client));
      if (found) {
        setQuote((prev) => ({ ...prev, _clientName: found.client || found.name }));
      }
    }
  }, [clients, quote.client]);

  const handleQuoteChange = (e) => {
    const { name, value } = e.target;
    setQuote((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "client") {
        const found = clients.find((c) => String(c.id) === String(value));
        updated._clientName = found ? (found.client || found.name) : "";
      }
      return updated;
    });
  };

  const updateItem = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    const qty = Number(copy[index].qty) || 0;
    const rate = Number(copy[index].rate || copy[index].price || 0);
    const tax = Number(copy[index].tax) || 0;
    copy[index].total = qty * rate + (qty * rate * tax) / 100;
    setItems(copy);
  };

  const addItem = () => setItems([...items, { item: "", description: "", qty: 1, rate: 0, tax: 18, total: 0 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const moveItem = (index, dir) => {
    const copy = [...items], target = index + dir;
    if (target < 0 || target >= copy.length) return;
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setItems(copy);
  };

  const subtotal = items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.rate || i.price) || 0), 0);
  const taxAmount = items.reduce((s, i) => s + ((Number(i.qty) || 0) * (Number(i.rate || i.price) || 0) * (Number(i.tax) || 0)) / 100, 0);
  const discountAmt = Number(quote.discount);
  const grandTotal = subtotal + taxAmount - discountAmt;

  const currencySymbol = getCurrencySymbol(paymentSettings) || (quote.currency === "INR" ? "₹" : quote.currency === "USD" ? "$" : "€");
  const fmt = (v) => formatAmount(v, paymentSettings);

  const statusBadgeClass = {
    Pending: "status-pending", Accepted: "status-paid",
    Rejected: "status-overdue", Cancelled: "status-draft", Draft: "status-draft",
  }[quote.status] || "status-draft";

  const submitQuote = async (e) => {
    e.preventDefault();
    if (!quote.quotation_id?.trim()) { toast.error("Quote number is required"); return; }
    if (!quote.client) { toast.error("Please select a client"); return; }

    setLoading(true);
    try {
      await api.put(`/quotes/${id}/`, { ...quote, items, subtotal, tax: taxAmount, grand_total: grandTotal, amount: grandTotal });
      toast.success("Quote Updated successfully!");
      navigate("/quotes");
    } catch (err) {
      toast.error(err.message || "Unable to update quote");
    }
    setLoading(false);
  };

  const saveDraft = async () => {
    setLoading(true);
    try {
      const payload = { ...quote, items, subtotal, tax: taxAmount, grand_total: grandTotal, amount: grandTotal, status: "Draft" };
      await api.put(`/quotes/${id}/`, payload);
      toast.success("Draft updated successfully!");
      navigate("/quotes");
    } catch (err) {
      toast.error(err.message || "Unable to update draft");
    }
    setLoading(false);
  };

  const showHelp = () =>
    toast.info("Update quote details, line items, and click 'Update Quote'.", { autoClose: 6000 });

  return (
    <>
      <style>{styles}</style>

      {showPreview && (
        <DocumentPreviewModal
          type="quote"
          data={{ ...quote, _clientName: clients.find(c => String(c.id) === String(quote.client))?.name || clients.find(c => String(c.id) === String(quote.client))?.client }}
          items={items}
          subtotal={subtotal}
          taxAmount={taxAmount}
          discountAmt={discountAmt}
          grandTotal={grandTotal}
          currencySymbol={currencySymbol}
          customCss={quote.customCss}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="ai-page">
        <form onSubmit={submitQuote}>
          <div className="ai-topbar">
            <h1>
              <FileText size={20} style={{ display: "inline", marginRight: 8, color: "#2271b1" }} />
              Edit Quote
              {quote.title && <span style={{ fontSize: 16, color: "#646970", marginLeft: 8 }}>— {quote.title}</span>}
              {!quote.title && quote.quotation_id && <span style={{ fontSize: 16, color: "#646970", marginLeft: 8 }}>— {quote.quotation_id}</span>}
            </h1>
            <div className="ai-topbar-actions">
              <button type="button" onClick={() => navigate("/quotes")} className="ai-btn ai-btn-outline">
                <X size={14} /> Cancel
              </button>
              <button type="button" onClick={() => setShowPreview(true)} className="ai-btn ai-btn-outline">
                <Eye size={14} /> Preview
              </button>
              <button type="button" onClick={saveDraft} disabled={loading} className="ai-btn ai-btn-draft">
                <FileCheck size={14} /> Save Draft
              </button>
              <button type="submit" disabled={loading} className="ai-btn ai-btn-primary">
                <Save size={14} /> {loading ? "Saving…" : "Update Quote"}
              </button>
            </div>
          </div>

          <div className="ai-layout">
            <div className="ai-main">
              <div className="ai-page-title-wrap" style={{ display: 'none' }}>
                <input
                  type="text"
                  name="title"
                  value={quote.title}
                  onChange={handleQuoteChange}
                  placeholder="Enter Quote Title (Internal)"
                  className="ai-title-input"
                />
              </div>

              <Panel title="Description">
                <RichEditor
                  name="description"
                  value={quote.description}
                  onChange={handleQuoteChange}
                  rows={5}
                  placeholder="Quote description / notes..."
                />
              </Panel>

              <div className="ai-panel">
                <div className="ai-line-items-header">
                  <h2>Line Items</h2>
                  <button type="button" onClick={addItem} className="ai-btn ai-btn-primary ai-btn-sm">
                    <Plus size={13} /> Add Line Item
                  </button>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table className="ai-items-table">
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}>#</th>
                        <th>Item / Title</th>
                        <th className="right" style={{ width: 80 }}>Qty</th>
                        <th className="right" style={{ width: 100 }}>Rate ({currencySymbol})</th>
                        <th className="right" style={{ width: 90 }}>Amount</th>
                        <th style={{ width: 36 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((row, idx) => (
                        <tr key={idx}>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                              <button
                                type="button"
                                className="ai-toggle-btn"
                                onClick={() => moveItem(idx, -1)}
                                disabled={idx === 0}
                                title="Move up"
                                style={{ opacity: idx === 0 ? 0.35 : 1 }}
                              >
                                <ChevronUp size={13} />
                              </button>
                              <span style={{ fontSize: 11, color: "#646970" }}>{idx + 1}</span>
                              <button
                                type="button"
                                className="ai-toggle-btn"
                                onClick={() => moveItem(idx, 1)}
                                disabled={idx === items.length - 1}
                                title="Move down"
                                style={{ opacity: idx === items.length - 1 ? 0.35 : 1 }}
                              >
                                <ChevronDown size={13} />
                              </button>
                            </div>
                          </td>
                          <td>
                            <input
                              className="ai-item-name-input"
                              placeholder="Item name"
                              value={row.item}
                              onChange={(e) => updateItem(idx, "item", e.target.value)}
                            />
                            <textarea
                              rows={2}
                              className="ai-item-desc"
                              placeholder="Optional description…"
                              value={row.description}
                              onChange={(e) => updateItem(idx, "description", e.target.value)}
                            />
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <input
                              type="number" min="0"
                              className="ai-input-sm"
                              value={row.qty}
                              onChange={(e) => updateItem(idx, "qty", e.target.value)}
                            />
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <input
                              type="number" min="0"
                              className="ai-input-sm"
                              value={row.rate || row.price || 0}
                              onChange={(e) => updateItem(idx, "rate", e.target.value)}
                            />
                          </td>
                          <td className="ai-item-total">{fmt(row.total || ((row.qty || 0) * (row.rate || row.price || 0) * (1 + (row.tax || 0) / 100)))}</td>
                          <td>
                            {items.length > 1 && (
                              <button type="button" className="ai-del-btn" onClick={() => removeItem(idx)} title="Remove item">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="ai-add-item-footer">
                  <button type="button" onClick={addItem} className="ai-btn ai-btn-secondary ai-btn-sm">
                    <Plus size={13} /> Add Line Item
                  </button>
                </div>

                <div className="ai-totals">
                  <div className="ai-totals-grid">
                    <span className="label">Sub Total</span>
                    <span className="value">{fmt(subtotal)}</span>

                    <span className="label">GST ({quote.taxRate}%)</span>
                    <span className="value">{fmt(taxAmount)}</span>

                    <span className="label">Discount ({currencySymbol})</span>
                    <span className="value" style={{ display: "flex", justifyContent: "flex-end" }}>
                      <input
                        type="number" name="discount" min="0"
                        value={quote.discount}
                        onChange={handleQuoteChange}
                        className="ai-input-sm"
                      />
                    </span>

                    <div className="ai-totals-divider" />
                    <span className="grand label font-bold">Total Due</span>
                    <span className="grand value">{fmt(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <Panel title="Terms & Conditions">
                <RichEditor
                  name="terms"
                  value={quote.terms}
                  onChange={handleQuoteChange}
                  rows={6}
                  placeholder="Enter terms and conditions…"
                />
              </Panel>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button type="button" onClick={() => navigate("/quotes")} className="ai-btn ai-btn-outline">
                  <X size={14} /> Cancel
                </button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => setShowPreview(true)} className="ai-btn ai-btn-outline">
                    <Eye size={14} /> Preview
                  </button>
                  <button type="button" onClick={saveDraft} disabled={loading} className="ai-btn ai-btn-draft">
                    <FileCheck size={14} /> Save Draft
                  </button>
                  <button type="submit" disabled={loading} className="ai-btn ai-btn-primary">
                    <Save size={14} /> {loading ? "Saving…" : "Update Quote"}
                  </button>
                </div>
              </div>
            </div>

            <div className="ai-sidebar">
              <div className="ai-panel ai-sidebar-publish">
                <div className="ai-panel-header">
                  <h2>Publish</h2>
                  <button type="button" className="ai-help-link" onClick={showHelp} title="Help">
                    <HelpCircle size={14} /> Help
                  </button>
                </div>
                <div className="ai-pub-row">
                  <span className="ai-pub-label"><Tag size={13} /> Status</span>
                  <span className={`ai-status-badge ${statusBadgeClass}`}>{quote.status}</span>
                </div>
                <div className="ai-pub-row">
                  <span className="ai-pub-label"><Hash size={13} /> Number</span>
                  <span className="ai-pub-value" style={{ fontSize: 12 }}>{quote.quotation_id}</span>
                </div>
                <div className="ai-pub-actions">
                  <button type="button" onClick={saveDraft} disabled={loading} className="ai-btn ai-btn-draft">
                    <FileCheck size={13} /> Save Draft
                  </button>
                  <button type="submit" disabled={loading} className="ai-btn ai-btn-primary">
                    <Save size={13} /> {loading ? "…" : "Update"}
                  </button>
                </div>
              </div>

              <Panel title="Quote Details">
                <div className="ai-field">
                  <label className="ai-label"><User size={12} style={{ marginRight: 4 }} />Client</label>
                  <select name="client" value={quote.client} onChange={handleQuoteChange} className="ai-select">
                    <option value="">— Select Client —</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.client || c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="ai-field">
                  <label className="ai-label"><Tag size={12} style={{ marginRight: 4 }} />Status</label>
                  <select name="status" value={quote.status} onChange={handleQuoteChange} className="ai-select">
                    <option>Draft</option>
                    <option>Pending</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div className="ai-field">
                  <label className="ai-label"><Hash size={12} style={{ marginRight: 4 }} />Quote Number / ID</label>
                  <input name="quotation_id" value={quote.quotation_id} onChange={handleQuoteChange} className="ai-input" />
                </div>
                <div className="ai-field">
                  <label className="ai-label"><Calendar size={12} style={{ marginRight: 4 }} />Created Date</label>
                  <input type="date" name="quoteDate" value={quote.quoteDate} onChange={handleQuoteChange} className="ai-input" />
                </div>
                <div className="ai-field">
                  <label className="ai-label"><Calendar size={12} style={{ marginRight: 4 }} />Valid Until</label>
                  <input type="date" name="validUntil" value={quote.validUntil} onChange={handleQuoteChange} className="ai-input" />
                </div>
              </Panel>

              <Panel title="Payment Settings">
                <div className="ai-field">
                  <label className="ai-label">Currency</label>
                  <select name="currency" value={quote.currency} onChange={handleQuoteChange} className="ai-select">
                    <option value="INR">₹ Indian Rupee (INR)</option>
                    <option value="USD">$ US Dollar (USD)</option>
                    <option value="EUR">€ Euro (EUR)</option>
                  </select>
                </div>
                <div className="ai-field">
                  <label className="ai-label">Currency Symbol</label>
                  <input value={currencySymbol} readOnly className="ai-input" style={{ background: "#f6f7f7", color: "#646970" }} />
                </div>
              </Panel>

              <div className="ai-panel ai-totals-sidebar">
                <div className="ai-panel-header" style={{ cursor: "default" }}>
                  <h2>Quote Totals</h2>
                </div>
                <div className="ai-totals-row"><span>Sub Total</span><span className="val">{fmt(subtotal)}</span></div>
                <div className="ai-totals-row"><span>GST ({quote.taxRate}%)</span><span className="val">{fmt(taxAmount)}</span></div>
                <div className="ai-totals-row red-val"><span>Discount</span><span className="val">− {fmt(discountAmt)}</span></div>
                <div className="ai-totals-row grand-row"><span>Total Due</span><span className="val">{fmt(grandTotal)}</span></div>
              </div>

              <Panel title="Tax Settings" defaultOpen={false}>
                <div className="ai-field">
                  <div className="ai-check-row" style={{ marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      id="prices-with-tax"
                      checked={pricesWithTax}
                      onChange={(e) => setPricesWithTax(e.target.checked)}
                    />
                    <label htmlFor="prices-with-tax">Prices entered with tax</label>
                  </div>
                </div>
                <div className="ai-field">
                  <label className="ai-label">Tax Rate (%)</label>
                  <input
                    type="number" name="taxRate" min="0" max="100"
                    value={quote.taxRate}
                    onChange={handleQuoteChange}
                    className="ai-input"
                  />
                </div>
                {pricesWithTax && (
                  <div style={{ fontSize: 11, color: "#646970", marginTop: 6, padding: "6px 8px", background: "#fff3cd", borderRadius: 3 }}>
                    ℹ️ Tax is included in item rates — totals will be shown as tax-inclusive.
                  </div>
                )}
              </Panel>

            </div>
          </div>
        </form>
      </div>
    </>
  );
}
