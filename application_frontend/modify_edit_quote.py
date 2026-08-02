import re
import os

add_invoice_path = r"c:\Users\Gutha Gowthami\Desktop\anil\application\application_frontend\src\pages\invoices\AddInvoice.jsx"
edit_quote_path = r"c:\Users\Gutha Gowthami\Desktop\anil\application\application_frontend\src\pages\quotations\EditQuote.jsx"

with open(add_invoice_path, "r", encoding="utf-8") as f:
    add_invoice_content = f.read()

styles_match = re.search(r"const styles = `([\s\S]*?)`;", add_invoice_content)
styles = styles_match.group(1)

components_match = re.search(r"(function applyFormat[\s\S]*?)(?:function PreviewModal|export default function AddInvoice)", add_invoice_content)
components = components_match.group(1)

components = components + """
/* ════════════════════
   Quote Preview Modal (Simplified)
   ════════════════════ */
function PreviewModal({ quote, items, subtotal, taxAmount, discountAmt, grandTotal, currencySymbol, onClose }) {
  const fmt = (v) => `${currencySymbol}${Number(v).toFixed(2)}`;
  const handlePrint = () => { window.print(); };

  return (
    <div className="ai-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ai-modal">
        <div className="ai-modal-header">
          <h3><Eye size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />Quote Preview</h3>
          <button type="button" className="ai-del-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="ai-modal-body">
          <div className="ai-preview-header">
            <div>
              <div className="ai-preview-title">{quote.title || quote.quotation_id || "Untitled Quote"}</div>
              <div className="ai-preview-meta">Quote # {quote.quotation_id}</div>
              <div className="ai-preview-meta">Client: <b>{quote._clientName || "—"}</b></div>
            </div>
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
              <div style={{ fontSize: 12, color: "#646970" }}>Date: {quote.quoteDate}</div>
              <div style={{ fontSize: 12, color: "#646970" }}>Valid Until: {quote.validUntil}</div>
              <span className={`ai-status-badge status-${quote.status?.toLowerCase()}`} style={{ marginTop: 6, display: "inline-flex" }}>
                {quote.status}
              </span>
            </div>
          </div>

          <table className="ai-preview-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th style={{ textAlign: "right" }}>Qty</th>
                <th style={{ textAlign: "right" }}>Rate</th>
                <th style={{ textAlign: "right" }}>Tax %</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{row.item || "—"}</div>
                    {row.description && <div style={{ fontSize: 11, color: "#646970" }}>{row.description}</div>}
                  </td>
                  <td style={{ textAlign: "right" }}>{row.qty}</td>
                  <td style={{ textAlign: "right" }}>{fmt(row.price || row.rate)}</td>
                  <td style={{ textAlign: "right" }}>{row.tax}%</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(row.total || ((row.qty||0)*(row.price||row.rate||0)*(1 + (row.tax||0)/100)))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div className="ai-preview-totals" style={{ marginTop: "16px" }}>
              <div className="ai-preview-totals-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className="ai-preview-totals-row"><span>Tax</span><span>{fmt(taxAmount)}</span></div>
              {discountAmt > 0 && <div className="ai-preview-totals-row" style={{ color: "#d63638" }}><span>Discount</span><span>− {fmt(discountAmt)}</span></div>}
              <div className="ai-preview-totals-row grand"><span>Total Due</span><span>{fmt(grandTotal)}</span></div>
            </div>
          </div>

          {(quote.description || quote.terms) && (
            <div className="ai-preview-notes">
              {quote.description && <><b>Description:</b>{"\\n"}{quote.description}{"\\n\\n"}</>}
              {quote.terms && <><b>Terms & Conditions:</b>{"\\n"}{quote.terms}</>}
            </div>
          )}
        </div>
        <div className="ai-modal-footer">
          <button type="button" className="ai-btn ai-btn-outline" onClick={onClose}><X size={14} /> Close</button>
          <button type="button" className="ai-btn ai-btn-outline" onClick={handlePrint}><Printer size={14} /> Print</button>
        </div>
      </div>
    </div>
  );
}
"""

new_content = """import React, { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus, Trash2, Save, ChevronUp, ChevronDown, FileText, CreditCard,
  User, Calendar, Hash, Tag, X, Eye, Bold, Italic, Underline,
  List, ListOrdered, Link, Image, Code, HelpCircle, FileCheck, Printer,
} from "lucide-react";

/* ─────────────────────────────── styles ─────────────────────────────── */
const styles = `""" + styles + """`;

""" + components + """

export default function EditQuote() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pricesWithTax, setPricesWithTax] = useState(false);

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
  });

  const [items, setItems] = useState([
    { item: "", description: "", qty: 1, rate: 0, tax: 18, total: 0 },
  ]);

  useEffect(() => {
    loadClients();
    loadQuote();
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
      toast.error("Failed to load quotation details.");
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

  const subtotal = items.reduce((s, i) => s + (Number(i.qty)||0) * (Number(i.rate || i.price)||0), 0);
  const taxAmount = items.reduce((s, i) => s + ((Number(i.qty)||0) * (Number(i.rate || i.price)||0) * (Number(i.tax)||0)) / 100, 0);
  const discountAmt = Number(quote.discount);
  const grandTotal = subtotal + taxAmount - discountAmt;

  const currencySymbol = quote.currency === "INR" ? "₹" : quote.currency === "USD" ? "$" : "€";
  const fmt = (v) => `${currencySymbol}${Number(v).toFixed(2)}`;

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
    } catch {
      toast.error("Unable to update quote");
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
    } catch {
      toast.error("Unable to update draft");
    }
    setLoading(false);
  };

  const showHelp = () =>
    toast.info("Update quote details, line items, and click 'Update Quote'.", { autoClose: 6000 });

  return (
    <>
      <style>{styles}</style>

      {showPreview && (
        <PreviewModal
          quote={quote}
          items={items}
          subtotal={subtotal}
          taxAmount={taxAmount}
          discountAmt={discountAmt}
          grandTotal={grandTotal}
          currencySymbol={currencySymbol}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="ai-page">
        <form onSubmit={submitQuote}>
          <div className="ai-topbar">
            <h1>
              <FileText size={20} style={{ display: "inline", marginRight: 8, color: "#2271b1" }} />
              Edit Quote
              {quote.title && <span style={{fontSize:16, color:"#646970", marginLeft: 8}}>— {quote.title}</span>}
              {!quote.title && quote.quotation_id && <span style={{fontSize:16, color:"#646970", marginLeft: 8}}>— {quote.quotation_id}</span>}
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
                          <td className="ai-item-total">{fmt(row.total || ((row.qty||0)*(row.rate||row.price||0)*(1 + (row.tax||0)/100)))}</td>
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
"""

with open(edit_quote_path, "w", encoding="utf-8") as f:
    f.write(new_content)
