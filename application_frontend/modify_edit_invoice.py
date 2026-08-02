import re
import os

add_invoice_path = r"c:\Users\Gutha Gowthami\Desktop\anil\application\application_frontend\src\pages\invoices\AddInvoice.jsx"
edit_invoice_path = r"c:\Users\Gutha Gowthami\Desktop\anil\application\application_frontend\src\pages\invoices\EditInvoice.jsx"

with open(add_invoice_path, "r", encoding="utf-8") as f:
    add_invoice_content = f.read()

# Extract styles
styles_match = re.search(r"const styles = `([\s\S]*?)`;", add_invoice_content)
styles = styles_match.group(1)

# Extract components (applyFormat, RichEditor, Panel, PreviewModal)
components_match = re.search(r"(function applyFormat[\s\S]*?)export default function AddInvoice", add_invoice_content)
components = components_match.group(1)

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

export default function EditInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pricesWithTax, setPricesWithTax] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState({
    bank: true,
    cash: true,
    upi: false,
    card: false,
  });

  const [invoice, setInvoice] = useState({
    title: "",
    client: "",
    status: "Pending",
    invoiceDate: "",
    dueDate: "",
    currency: "INR",
    discount: 0,
    taxRate: 18,
    notes: "",
    terms: "Payment is due within 14 days from date of invoice.\\n\\nPayment Methods:\\nUPI: [add your UPI here]",
    invoiceNumber: "",
    orderNumber: "",
    _clientName: "",
  });

  const [items, setItems] = useState([
    { item: "", itemTitle: "", qty: 1, price: 0, tax: 18, total: 0 },
  ]);

  const [payments, setPayments] = useState([
    { amount: "", method: "", reference: "", date: "", status: "Pending", note: "" },
  ]);

  useEffect(() => {
    loadClients();
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const res = await api.get(`/invoices/${id}/`);
      const data = res.data;
      
      setInvoice({
        title: data.title || data.invoice || "",
        client: data.client || "",
        status: data.status || "Pending",
        invoiceDate: data.invoiceDate || "",
        dueDate: data.dueDate || "",
        currency: data.currency || "INR",
        discount: data.discount || 0,
        taxRate: data.taxRate || 18,
        notes: data.notes || "",
        terms: data.terms || "",
        invoiceNumber: data.invoiceNumber || data.id,
        orderNumber: data.orderNumber || "",
        _clientName: "", // will be set dynamically via clients 
      });
      
      if (data.items && data.items.length > 0) {
        setItems(data.items.map(item => ({
            ...item,
            tax: item.tax ?? 18
        })));
      }
      if (data.payments && data.payments.length > 0) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load invoice details.");
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
  
  // Update _clientName whenever clients or invoice.client changes
  useEffect(() => {
    if (clients.length > 0 && invoice.client) {
      const found = clients.find((c) => String(c.id) === String(invoice.client));
      if (found) {
        setInvoice((prev) => ({ ...prev, _clientName: found.client || found.name }));
      }
    }
  }, [clients, invoice.client]);

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => {
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
    const price = Number(copy[index].price || copy[index].rate || 0); // backwards compat rate/price
    const tax = Number(copy[index].tax) || 0;
    copy[index].total = qty * price + (qty * price * tax) / 100;
    setItems(copy);
  };
  
  const addItem = () => setItems([...items, { item: "", itemTitle: "", qty: 1, price: 0, tax: 18, total: 0 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const moveItem = (index, dir) => {
    const copy = [...items], target = index + dir;
    if (target < 0 || target >= copy.length) return;
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setItems(copy);
  };

  const addPayment = () => setPayments([...payments, { amount: "", method: "", reference: "", date: "", status: "Pending", note: "" }]);
  const removePayment = (i) => setPayments(payments.filter((_, idx) => idx !== i));
  const updatePayment = (i, field, value) => {
    const copy = [...payments];
    copy[i][field] = value;
    setPayments(copy);
  };

  const subtotal = items.reduce((s, i) => s + (Number(i.qty)||0) * (Number(i.price || i.rate)||0), 0);
  const taxAmount = items.reduce((s, i) => s + ((Number(i.qty)||0) * (Number(i.price || i.rate)||0) * (Number(i.tax)||0)) / 100, 0);
  const discountAmt = Number(invoice.discount);
  const grandTotal = subtotal + taxAmount - discountAmt;

  const currencySymbol = invoice.currency === "INR" ? "₹" : invoice.currency === "USD" ? "$" : "€";
  const fmt = (v) => `${currencySymbol}${Number(v).toFixed(2)}`;

  const statusBadgeClass = {
    Pending: "status-pending", Paid: "status-paid",
    Overdue: "status-overdue", Cancelled: "status-draft", Draft: "status-draft",
  }[invoice.status] || "status-draft";

  const submitInvoice = async (e) => {
    e.preventDefault();
    if (!invoice.title.trim()) { toast.error("Invoice title is required"); return; }
    if (!invoice.client) { toast.error("Please select a client"); return; }
    
    setLoading(true);
    try {
      await api.put(`/invoices/${id}/`, { ...invoice, items, payments, subtotal, taxAmount, grandTotal });
      toast.success("Invoice Updated successfully!");
      navigate("/invoices");
    } catch {
      toast.error("Unable to update invoice");
    }
    setLoading(false);
  };

  const saveDraft = async () => {
    setLoading(true);
    try {
      const payload = { ...invoice, items, payments, subtotal, taxAmount, grandTotal, status: "Draft" };
      await api.put(`/invoices/${id}/`, payload);
      toast.success("Draft updated successfully!");
      navigate("/invoices");
    } catch {
      toast.error("Unable to update draft");
    }
    setLoading(false);
  };

  const showHelp = () =>
    toast.info("Update invoice details, line items, or payments and click 'Update Invoice'.", { autoClose: 6000 });

  return (
    <>
      <style>{styles}</style>

      {showPreview && (
        <PreviewModal
          invoice={invoice}
          items={items}
          payments={payments}
          subtotal={subtotal}
          taxAmount={taxAmount}
          discountAmt={discountAmt}
          grandTotal={grandTotal}
          currencySymbol={currencySymbol}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="ai-page">
        <form onSubmit={submitInvoice}>
          <div className="ai-topbar">
            <h1>
              <FileText size={20} style={{ display: "inline", marginRight: 8, color: "#2271b1" }} />
              Edit Invoice
              {invoice.title && <span style={{fontSize:16, color:"#646970", marginLeft: 8}}>— {invoice.title}</span>}
            </h1>
            <div className="ai-topbar-actions">
              <button type="button" onClick={() => navigate("/invoices")} className="ai-btn ai-btn-outline">
                <X size={14} /> Cancel
              </button>
              <button type="button" onClick={() => setShowPreview(true)} className="ai-btn ai-btn-outline">
                <Eye size={14} /> Preview
              </button>
              <button type="button" onClick={saveDraft} disabled={loading} className="ai-btn ai-btn-draft">
                <FileCheck size={14} /> Save Draft
              </button>
              <button type="submit" disabled={loading} className="ai-btn ai-btn-primary">
                <Save size={14} /> {loading ? "Saving…" : "Update Invoice"}
              </button>
            </div>
          </div>

          <div className="ai-layout">
            <div className="ai-main">
              <div className="ai-page-title-wrap">
                <input
                  type="text"
                  name="title"
                  value={invoice.title}
                  onChange={handleInvoiceChange}
                  placeholder="Enter Invoice Title"
                  className="ai-title-input"
                />
              </div>

              <Panel title="Description">
                <RichEditor
                  name="notes"
                  value={invoice.notes}
                  onChange={handleInvoiceChange}
                  rows={5}
                  placeholder="Invoice description / notes…"
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
                              value={row.itemTitle || row.description || ""}
                              onChange={(e) => updateItem(idx, "itemTitle", e.target.value)}
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
                              value={row.price || row.rate || 0}
                              onChange={(e) => updateItem(idx, "price", e.target.value)}
                            />
                          </td>
                          <td className="ai-item-total">{fmt(row.total || ((row.qty||0)*(row.price||row.rate||0)*(1 + (row.tax||0)/100)))}</td>
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

                    <span className="label">GST ({invoice.taxRate}%)</span>
                    <span className="value">{fmt(taxAmount)}</span>

                    <span className="label">Discount ({currencySymbol})</span>
                    <span className="value" style={{ display: "flex", justifyContent: "flex-end" }}>
                      <input
                        type="number" name="discount" min="0"
                        value={invoice.discount}
                        onChange={handleInvoiceChange}
                        className="ai-input-sm"
                      />
                    </span>

                    <div className="ai-totals-divider" />
                    <span className="grand label font-bold">Total Due</span>
                    <span className="grand value">{fmt(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="ai-panel">
                <div className="ai-line-items-header">
                  <h2>Payments</h2>
                  <button type="button" onClick={addPayment} className="ai-btn ai-btn-success ai-btn-sm">
                    <Plus size={13} /> Add Payment
                  </button>
                </div>
                <div style={{ padding: 12 }}>
                  {payments.map((pmt, idx) => (
                    <div key={idx} className="ai-payment-card">
                      <div className="ai-payment-card-header">
                        <span>
                          <CreditCard size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />
                          Payment {idx + 1}
                        </span>
                        <button type="button" className="ai-del-btn" onClick={() => removePayment(idx)} title="Remove payment">
                          <X size={13} />
                        </button>
                      </div>
                      <div className="ai-payment-card-body">
                        <div>
                          <label className="ai-label">Date</label>
                          <input type="date" className="ai-input" value={pmt.date}
                            onChange={(e) => updatePayment(idx, "date", e.target.value)} />
                        </div>
                        <div>
                          <label className="ai-label">Amount ({currencySymbol})</label>
                          <input type="number" placeholder="0.00" className="ai-input" value={pmt.amount}
                            onChange={(e) => updatePayment(idx, "amount", e.target.value)} />
                        </div>
                        <div>
                          <label className="ai-label">Payment Method</label>
                          <select className="ai-select" value={pmt.method}
                            onChange={(e) => updatePayment(idx, "method", e.target.value)}>
                            <option value="">Select…</option>
                            <option>Bank Transfer</option>
                            <option>Cash</option>
                            <option>UPI</option>
                            <option>Credit Card</option>
                            <option>Cheque</option>
                          </select>
                        </div>
                        <div>
                          <label className="ai-label">Payment ID / Reference</label>
                          <input placeholder="Transaction / Ref ID" className="ai-input" value={pmt.reference}
                            onChange={(e) => updatePayment(idx, "reference", e.target.value)} />
                        </div>
                        <div>
                          <label className="ai-label">Status</label>
                          <select className="ai-select" value={pmt.status}
                            onChange={(e) => updatePayment(idx, "status", e.target.value)}>
                            <option>Pending</option>
                            <option>Completed</option>
                            <option>Failed</option>
                          </select>
                        </div>
                        <div>
                          <label className="ai-label">Note</label>
                          <input
                            placeholder="Optional note…"
                            className="ai-input"
                            value={pmt.note}
                            onChange={(e) => updatePayment(idx, "note", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Panel title="Terms & Conditions">
                <RichEditor
                  name="terms"
                  value={invoice.terms}
                  onChange={handleInvoiceChange}
                  rows={6}
                  placeholder="Enter terms and conditions…"
                />
              </Panel>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button type="button" onClick={() => navigate("/invoices")} className="ai-btn ai-btn-outline">
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
                    <Save size={14} /> {loading ? "Saving…" : "Update Invoice"}
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
                  <span className={`ai-status-badge ${statusBadgeClass}`}>{invoice.status}</span>
                </div>
                <div className="ai-pub-row">
                  <span className="ai-pub-label"><Hash size={13} /> Number</span>
                  <span className="ai-pub-value" style={{ fontSize: 12 }}>{invoice.invoiceNumber}</span>
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

              <Panel title="Invoice Details">
                <div className="ai-field">
                  <label className="ai-label"><User size={12} style={{ marginRight: 4 }} />Client</label>
                  <select name="client" value={invoice.client} onChange={handleInvoiceChange} className="ai-select">
                    <option value="">— Select Client —</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.client || c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="ai-field">
                  <label className="ai-label"><Tag size={12} style={{ marginRight: 4 }} />Status</label>
                  <select name="status" value={invoice.status} onChange={handleInvoiceChange} className="ai-select">
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                    <option>Cancelled</option>
                    <option>Draft</option>
                  </select>
                </div>
                <div className="ai-field">
                  <label className="ai-label"><Hash size={12} style={{ marginRight: 4 }} />Invoice Number</label>
                  <input name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleInvoiceChange} className="ai-input" />
                </div>
                <div className="ai-field">
                  <label className="ai-label">Order Number</label>
                  <input name="orderNumber" value={invoice.orderNumber} onChange={handleInvoiceChange} placeholder="Optional" className="ai-input" />
                </div>
                <div className="ai-field">
                  <label className="ai-label"><Calendar size={12} style={{ marginRight: 4 }} />Created Date</label>
                  <input type="date" name="invoiceDate" value={invoice.invoiceDate} onChange={handleInvoiceChange} className="ai-input" />
                </div>
                <div className="ai-field">
                  <label className="ai-label"><Calendar size={12} style={{ marginRight: 4 }} />Due Date</label>
                  <input type="date" name="dueDate" value={invoice.dueDate} onChange={handleInvoiceChange} className="ai-input" />
                </div>
              </Panel>

              <Panel title="Payment Settings">
                <div className="ai-field">
                  <label className="ai-label">Currency</label>
                  <select name="currency" value={invoice.currency} onChange={handleInvoiceChange} className="ai-select">
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
                  <h2>Invoice Totals</h2>
                </div>
                <div className="ai-totals-row"><span>Sub Total</span><span className="val">{fmt(subtotal)}</span></div>
                <div className="ai-totals-row"><span>GST ({invoice.taxRate}%)</span><span className="val">{fmt(taxAmount)}</span></div>
                <div className="ai-totals-row red-val"><span>Discount</span><span className="val">− {fmt(discountAmt)}</span></div>
                <div className="ai-totals-row grand-row"><span>Total Due</span><span className="val">{fmt(grandTotal)}</span></div>
              </div>

              <Panel title="Payment Methods">
                {[
                  { key: "bank", label: "Bank Transfer" },
                  { key: "cash", label: "Cash" },
                  { key: "upi", label: "UPI" },
                  { key: "card", label: "Credit / Debit Card" },
                ].map(({ key, label }) => (
                  <div key={key} className="ai-check-row">
                    <input
                      type="checkbox"
                      id={`pm-${key}`}
                      checked={paymentMethods[key]}
                      onChange={(e) => setPaymentMethods((prev) => ({ ...prev, [key]: e.target.checked }))}
                    />
                    <label htmlFor={`pm-${key}`}>{label}</label>
                  </div>
                ))}
              </Panel>

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
                    value={invoice.taxRate}
                    onChange={handleInvoiceChange}
                    className="ai-input"
                  />
                </div>
                {pricesWithTax && (
                  <div style={{ fontSize: 11, color: "#646970", marginTop: 6, padding: "6px 8px", background: "#fff3cd", borderRadius: 3 }}>
                    ℹ️ Tax is included in item prices — totals will be shown as tax-inclusive.
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

with open(edit_invoice_path, "w", encoding="utf-8") as f:
    f.write(new_content)
