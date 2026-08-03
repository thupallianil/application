import React from 'react';
import { X, Printer, Eye, Download } from 'lucide-react';
import { downloadAsPDF } from '../../utils/downloadPDF';

// Removed custom print popup function as we are now using data-print-hide on elements.

export default function DocumentPreviewModal({
    type = 'invoice', // 'invoice' or 'quote'
    data, // invoice or quote object
    items, // line items
    payments = [], // payments if invoice
    subtotal,
    taxAmount,
    discountAmt,
    grandTotal,
    currencySymbol,
    customCss = '',
    onClose
}) {
    const tpl = data.template || 'Template 1';
    const fmt = (v) => `${currencySymbol}${Number(v).toFixed(2)}`;
    const title = type === 'invoice' ? (data.title || "Untitled Invoice") : (data.title || data.quotation_id || "Untitled Quote");
    const docNumber = type === 'invoice' ? data.invoiceNumber : data.quotation_id;
    const clientName = data._clientName || "—";
    const dateField = type === 'invoice' ? data.invoiceDate : data.quoteDate;
    const dateLabel = type === 'invoice' ? 'Date' : 'Quote Date';
    const dueDateField = type === 'invoice' ? data.dueDate : data.validUntil;
    const dueDateLabel = type === 'invoice' ? 'Due Date' : 'Valid Until';

    return (
        <div className="ai-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="ai-modal custom-document-preview-modal" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                {customCss && <style>{`.custom-document-preview-modal { ${customCss} }`}</style>}
                <div data-print-hide className="ai-modal-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', background: '#f6f7f7', borderBottom: '1px solid #c3c4c7', flexShrink: 0 }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', fontSize: '16px', color: '#1d2327' }}>
                        <Eye size={16} style={{ marginRight: 6 }} /> {type === 'invoice' ? 'Invoice Preview' : 'Quote Preview'} ({tpl})
                    </h3>
                    <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d63638', padding: '4px' }}><X size={18} /></button>
                </div>

                <div className="ai-modal-body" style={{ padding: '0', background: '#fff', flexGrow: 1, overflowY: 'auto' }}>
                    <div id="doc-print-area" className="document-template-wrapper" style={{ padding: '40px' }}>

                        {/* TEMPLATE 1: Clean & Modern */}
                        {tpl === 'Template 1' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '2px solid #f0f0f1', paddingBottom: '20px' }}>
                                    <div>
                                        <h1 style={{ margin: 0, fontSize: '32px', color: '#1d2327', fontWeight: '300' }}>{type === 'invoice' ? 'INVOICE' : 'QUOTE'}</h1>
                                        <p style={{ margin: '5px 0 0', color: '#646970' }}>#{docNumber}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <h2 style={{ margin: 0, fontSize: '18px', color: '#1d2327' }}>{title}</h2>
                                        <div style={{ marginTop: '10px', fontSize: '13px', color: '#3c434a' }}>
                                            <div><strong>{dateLabel}:</strong> {dateField}</div>
                                            <div><strong>{dueDateLabel}:</strong> {dueDateField}</div>
                                            <div style={{ marginTop: '5px' }}>
                                                <span style={{ padding: '3px 8px', background: '#f0f0f1', borderRadius: '4px', fontSize: '12px' }}>{data.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#646970', textTransform: 'uppercase' }}>Billed To:</h3>
                                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1d2327' }}>{clientName}</p>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '14px', color: '#3c434a' }}>
                                    <thead>
                                        <tr style={{ background: '#f6f7f7', borderBottom: '1px solid #c3c4c7' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Item</th>
                                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Qty</th>
                                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Rate</th>
                                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Tax</th>
                                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((row, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #f0f0f1' }}>
                                                <td style={{ padding: '12px' }}>
                                                    <strong style={{ display: 'block', color: '#1d2327' }}>{row.item || '—'}</strong>
                                                    {(row.description || row.itemTitle) && <span style={{ fontSize: '12px', color: '#646970' }}>{row.description || row.itemTitle}</span>}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'right' }}>{row.qty}</td>
                                                <td style={{ padding: '12px', textAlign: 'right' }}>{fmt(row.price || row.rate)}</td>
                                                <td style={{ padding: '12px', textAlign: 'right' }}>{row.tax}%</td>
                                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>{fmt(row.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px', color: '#3c434a' }}>
                                    <div style={{ width: '300px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f1' }}>
                                            <span>Subtotal:</span><strong>{fmt(subtotal)}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f1' }}>
                                            <span>Tax:</span><strong>{fmt(taxAmount)}</strong>
                                        </div>
                                        {discountAmt > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f1', color: '#d63638' }}>
                                                <span>Discount:</span><strong>-{fmt(discountAmt)}</strong>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '2px solid #1d2327', fontSize: '18px', color: '#1d2327' }}>
                                            <strong>Total:</strong><strong>{fmt(grandTotal)}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TEMPLATE 2: Dark Header / Bold */}
                        {tpl === 'Template 2' && (
                            <div>
                                <div style={{ background: '#2c3338', color: '#fff', padding: '30px', margin: '-40px -40px 40px -40px', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h1 style={{ margin: 0, fontSize: '36px' }}>{type === 'invoice' ? 'INVOICE' : 'QUOTE'}</h1>
                                        <p style={{ margin: '5px 0 0', opacity: 0.8 }}>#{docNumber}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '500' }}>{title}</h2>
                                        <div style={{ marginTop: '10px', fontSize: '13px', opacity: 0.9 }}>
                                            <div>{dateLabel}: {dateField}</div>
                                            <div>{dueDateLabel}: {dueDateField}</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 10px', fontSize: '13px', color: '#646970', textTransform: 'uppercase' }}>Billed To:</h3>
                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1d2327' }}>{clientName}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ padding: '6px 12px', background: '#f0f0f1', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#1d2327' }}>{data.status}</span>
                                    </div>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '14px', color: '#3c434a' }}>
                                    <thead>
                                        <tr style={{ background: '#f0f0f1' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #2c3338', fontWeight: '600' }}>Item</th>
                                            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #2c3338', fontWeight: '600' }}>Qty</th>
                                            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #2c3338', fontWeight: '600' }}>Rate</th>
                                            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #2c3338', fontWeight: '600' }}>Tax</th>
                                            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #2c3338', fontWeight: '600' }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((row, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #f0f0f1' }}>
                                                <td style={{ padding: '12px' }}>
                                                    <strong style={{ display: 'block', color: '#1d2327' }}>{row.item || '—'}</strong>
                                                    {(row.description || row.itemTitle) && <span style={{ fontSize: '12px', color: '#646970' }}>{row.description || row.itemTitle}</span>}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'right' }}>{row.qty}</td>
                                                <td style={{ padding: '12px', textAlign: 'right' }}>{fmt(row.price || row.rate)}</td>
                                                <td style={{ padding: '12px', textAlign: 'right' }}>{row.tax}%</td>
                                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{fmt(row.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px', color: '#3c434a' }}>
                                    <div style={{ width: '320px', background: '#f8f9fa', padding: '20px', borderRadius: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span>Subtotal:</span><strong style={{ color: '#1d2327' }}>{fmt(subtotal)}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span>Tax:</span><strong style={{ color: '#1d2327' }}>{fmt(taxAmount)}</strong>
                                        </div>
                                        {discountAmt > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#d63638' }}>
                                                <span>Discount:</span><strong>-{fmt(discountAmt)}</strong>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #2c3338', fontSize: '20px', color: '#2c3338' }}>
                                            <strong>Total:</strong><strong>{fmt(grandTotal)}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TEMPLATE 3: Corporate Elegant Blue */}
                        {tpl === 'Template 3' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #2271b1', paddingBottom: '20px', marginBottom: '30px' }}>
                                    <div>
                                        <h1 style={{ margin: 0, fontSize: '32px', color: '#2271b1' }}>{title}</h1>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '300', color: '#3c434a' }}>{type === 'invoice' ? 'INVOICE' : 'QUOTE'}</h2>
                                        <p style={{ margin: '5px 0 0', fontWeight: 'bold', color: '#1d2327' }}>#{docNumber}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                                    <div style={{ background: '#f0f6fc', padding: '15px', borderRadius: '4px', width: '45%' }}>
                                        <h3 style={{ margin: '0 0 5px', fontSize: '12px', color: '#2271b1', textTransform: 'uppercase', letterSpacing: '1px' }}>Billed To</h3>
                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1d2327' }}>{clientName}</p>
                                    </div>
                                    <div style={{ width: '45%', border: '1px solid #e2e4e7', padding: '15px', borderRadius: '4px', color: '#3c434a' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ color: '#646970' }}>{dateLabel}:</span>
                                            <strong>{dateField}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ color: '#646970' }}>{dueDateLabel}:</span>
                                            <strong>{dueDateField}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#646970' }}>Status:</span>
                                            <strong style={{ color: '#2271b1' }}>{data.status}</strong>
                                        </div>
                                    </div>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '14px', color: '#3c434a' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ padding: '10px', textAlign: 'left', background: '#2271b1', color: '#fff', fontWeight: '600' }}>Description</th>
                                            <th style={{ padding: '10px', textAlign: 'center', background: '#2271b1', color: '#fff', fontWeight: '600' }}>Qty</th>
                                            <th style={{ padding: '10px', textAlign: 'right', background: '#2271b1', color: '#fff', fontWeight: '600' }}>Rate</th>
                                            <th style={{ padding: '10px', textAlign: 'right', background: '#2271b1', color: '#fff', fontWeight: '600' }}>Tax</th>
                                            <th style={{ padding: '10px', textAlign: 'right', background: '#2271b1', color: '#fff', fontWeight: '600' }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((row, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #e2e4e7' }}>
                                                <td style={{ padding: '15px 10px' }}>
                                                    <strong style={{ display: 'block', color: '#1d2327' }}>{row.item || '—'}</strong>
                                                    {(row.description || row.itemTitle) && <span style={{ fontSize: '12px', color: '#646970' }}>{row.description || row.itemTitle}</span>}
                                                </td>
                                                <td style={{ padding: '15px 10px', textAlign: 'center' }}>{row.qty}</td>
                                                <td style={{ padding: '15px 10px', textAlign: 'right' }}>{fmt(row.price || row.rate)}</td>
                                                <td style={{ padding: '15px 10px', textAlign: 'right' }}>{row.tax}%</td>
                                                <td style={{ padding: '15px 10px', textAlign: 'right', fontWeight: 'bold', color: '#1d2327' }}>{fmt(row.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px', color: '#3c434a' }}>
                                    <div style={{ width: '300px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px' }}>
                                            <span style={{ color: '#646970' }}>Subtotal:</span><strong style={{ color: '#1d2327' }}>{fmt(subtotal)}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px' }}>
                                            <span style={{ color: '#646970' }}>Tax:</span><strong style={{ color: '#1d2327' }}>{fmt(taxAmount)}</strong>
                                        </div>
                                        {discountAmt > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', color: '#d63638' }}>
                                                <span>Discount:</span><strong>-{fmt(discountAmt)}</strong>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 10px', background: '#f0f6fc', marginTop: '10px', borderRadius: '4px' }}>
                                            <strong style={{ fontSize: '16px', color: '#2271b1' }}>Total Due:</strong>
                                            <strong style={{ fontSize: '18px', color: '#2271b1' }}>{fmt(grandTotal)}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payments recorded (for Invoices only) */}
                        {type === 'invoice' && payments.some(p => p.amount) && (
                            <div style={{ marginBottom: '30px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13, color: '#166534' }}>Payments Recorded</div>
                                {payments.filter(p => p.amount).map((p, i) => (
                                    <div key={i} style={{ fontSize: 13, color: "#15803d", marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{p.date} — {p.method || "—"} [{p.status}] {p.reference && `(${p.reference})`}</span>
                                        <span style={{ fontWeight: 'bold' }}>{fmt(p.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Notes / Terms */}
                        {(data.notes || data.description || data.terms) && (
                            <div style={{ marginTop: '20px', borderTop: '1px solid #e2e4e7', paddingTop: '20px', color: '#3c434a', fontSize: '13px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                                {(data.notes || data.description) && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong style={{ color: '#1d2327', display: 'block', marginBottom: '5px' }}>{type === 'invoice' ? 'Notes:' : 'Description:'}</strong>
                                        {data.notes || data.description}
                                    </div>
                                )}
                                {data.terms && (
                                    <div>
                                        <strong style={{ color: '#1d2327', display: 'block', marginBottom: '5px' }}>Terms & Conditions:</strong>
                                        {data.terms}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                <div data-print-hide className="ai-modal-footer" style={{ padding: '15px 20px', borderTop: '1px solid #c3c4c7', display: 'flex', gap: '8px', justifyContent: 'flex-end', background: '#f6f7f7', flexShrink: 0 }}>
                    <button type="button" onClick={onClose} style={{ padding: '6px 12px', background: '#fff', border: '1px solid #8c8f94', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', color: '#3c434a' }}>Close</button>
                    <button type="button" onClick={() => window.print()} style={{ padding: '6px 12px', background: '#fff', border: '1px solid #8c8f94', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#3c434a' }}>
                        <Printer size={14} /> Print
                    </button>
                    <button type="button" onClick={() => downloadAsPDF('doc-print-area', `document.pdf`)} style={{ padding: '6px 12px', background: '#2271b1', border: '1px solid #2271b1', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#fff' }}>
                        <Download size={14} /> Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
