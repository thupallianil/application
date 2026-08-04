import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import {
  User, Mail, Phone, MapPin, Building2, Save, X,
  HelpCircle, Globe, Hash, Bold, Italic, Underline,
  List, ListOrdered, Link, Image, Code, ChevronUp, ChevronDown
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

/* ════════════════════
   Preview Modal
   ════════════════════ */


export default function AddClient() {
  const navigate = useNavigate();

  const [userType, setUserType] = useState("new");
  const [loading, setLoading] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);

  const [formData, setFormData] = useState({
    existingUser: "",
    client: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    address: "",
    extraInfo: "",
    firstName: "",
    lastName: "",
    website: "",
    status: "Active"
  });

  // Load existing Django users so admin can link an existing user as a client
  React.useEffect(() => {
    api.get("/auth/users/").then(res => {
      if (Array.isArray(res.data)) setExistingUsers(res.data);
    }).catch(() => {
      // endpoint may not exist — silently skip
    });
  }, []);

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    // Auto-fill email from existing user selection
    if (e.target.name === "existingUser" && e.target.value) {
      const user = existingUsers.find(u => String(u.id) === String(e.target.value));
      if (user) {
        updated.email = user.email || "";
        updated.client = updated.client || `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "";
      }
    }
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client.trim()) { toast.error("Client name is required"); return; }
    if (!formData.email.trim()) { toast.error("Email is required"); return; }
    if (!formData.phone.trim()) { toast.error("Phone number is required"); return; }

    setLoading(true);
    try {
      await api.post("/clients/", formData);
      const loginMsg = formData.password
        ? `Client added! They can login with email: ${formData.email} and their set password.`
        : `Client added! They can login with email: ${formData.email}. A system password was auto-generated — use Forgot Password to set a new one.`;
      toast.success(loginMsg, { autoClose: 8000 });
      navigate("/clients");
    } catch (err) {
      toast.error(err.message || "Unable to Add Client");
    }
    setLoading(false);
  };

  const showHelp = () =>
    toast.info("Create a new client by filling out their details. The client's email becomes their login — a User account is auto-created for them.", { autoClose: 6000 });

  return (
    <>
      <style>{styles}</style>

      <div className="ai-page">
        <form onSubmit={handleSubmit}>
          <div className="ai-topbar">
            <h1>
              <User size={20} style={{ display: "inline", marginRight: 8, color: "#2271b1" }} />
              Add New Client
            </h1>
            <div className="ai-topbar-actions">
              <button type="button" onClick={() => navigate("/clients")} className="ai-btn ai-btn-outline">
                <X size={14} /> Cancel
              </button>
              <button type="submit" disabled={loading} className="ai-btn ai-btn-primary">
                <Save size={14} /> {loading ? "Saving…" : "Add Client"}
              </button>
            </div>
          </div>

          <div className="ai-layout">
            <div className="ai-main">
              <div className="ai-page-title-wrap">
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="Enter Business / Client Name"
                  className="ai-title-input"
                  required
                />
              </div>

              <div className="ai-panel">
                <div style={{ padding: "16px", background: "#f6f7f7", borderBottom: "1px solid #c3c4c7" }}>
                  <p style={{ fontWeight: 600, marginBottom: "12px", fontSize: "14px" }}>Add new client from:</p>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <label className="ai-check-row">
                      <input
                        type="radio"
                        value="existing"
                        checked={userType === "existing"}
                        onChange={() => setUserType("existing")}
                      />
                      Existing User
                    </label>
                    <label className="ai-check-row">
                      <input
                        type="radio"
                        value="new"
                        checked={userType === "new"}
                        onChange={() => setUserType("new")}
                      />
                      Create New User
                    </label>
                  </div>
                </div>
              </div>

              {userType === "existing" && (
                <>
                  <Panel title="Link Existing System User">
                    <div className="ai-field">
                      <label className="ai-label">Select Existing User *</label>
                      <select
                        name="existingUser"
                        value={formData.existingUser}
                        onChange={handleChange}
                        className="ai-select"
                      >
                        <option value="">— Choose User —</option>
                        {existingUsers.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.first_name || u.last_name ? `${u.first_name} ${u.last_name}`.trim() : u.username} ({u.email})
                          </option>
                        ))}
                      </select>
                      <p style={{ fontSize: 11, color: "#646970", marginTop: 6 }}>
                        Selecting a user will auto-fill their email. They will be able to log in using their existing credentials.
                      </p>
                    </div>
                  </Panel>
                </>
              )}

              {userType === "new" && (
                <>
                  <Panel title="User Account Details">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label className="ai-label"><Mail size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="ai-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="ai-label"><Phone size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />Phone Number *</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="ai-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="ai-label">Username *</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="ai-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="ai-label">Password *</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="ai-input"
                          required
                        />
                      </div>
                    </div>
                  </Panel>
                </>
              )}

              <Panel title="Contact Information">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="ai-label"><User size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="ai-input"
                    />
                  </div>
                  <div>
                    <label className="ai-label"><User size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="ai-input"
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="ai-label"><Globe size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />Website</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="ai-input"
                    />
                  </div>
                </div>
              </Panel>

              <Panel title="Physical Address & Extra Info">
                <div style={{ padding: "0 0 10px 0", marginBottom: 12 }}>
                  <label className="ai-label"><MapPin size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />Address Details</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter full address..."
                    className="ai-input"
                    style={{ minHeight: "80px", resize: "y" }}
                  />
                </div>
                <div>
                  <label className="ai-label">Extra Info / Notes</label>
                  <RichEditor
                    name="extraInfo"
                    value={formData.extraInfo}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Additional information..."
                  />
                </div>
              </Panel>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button type="button" onClick={() => navigate("/clients")} className="ai-btn ai-btn-outline">
                  <X size={14} /> Cancel
                </button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="submit" disabled={loading} className="ai-btn ai-btn-primary">
                    <Save size={14} /> {loading ? "Saving…" : "Add Client"}
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
                  <span className="ai-pub-label">Status</span>
                  <span className={`ai-status-badge status-draft`}>Draft</span>
                </div>
                <div className="ai-pub-actions">
                  <button type="button" className="ai-btn ai-btn-draft">
                    Save Draft
                  </button>
                  <button type="submit" disabled={loading} className="ai-btn ai-btn-primary">
                    <Save size={13} /> {loading ? "…" : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
