import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function AddQuote() {
  const navigate = useNavigate();
  const mediaInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  // Panel collapse states
  const [publishOpen, setPublishOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [lineItemsOpen, setLineItemsOpen] = useState(true);
  const [collapsedItems, setCollapsedItems] = useState({});

  const toggleItemCollapse = (index) => {
    setCollapsedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const [quote, setQuote] = useState({
    quotation_id: "",
    client: "",
    status: "Pending",
    quoteDate: "",
    validUntil: "",
    currency: "INR",
    description: "",
    terms: "",
    notes: "",
    discount: 0,
  });

  const [items, setItems] = useState([
    { item: "", description: "", qty: 1, rate: 0, tax: 18, total: 0 },
  ]);

  useEffect(() => { loadClients(); }, []);

  const loadClients = async () => {
    try {
      const res = await api.get("/clients/");
      setClients(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Unable to load clients.");
    }
  };

  const handleQuoteChange = (e) => {
    setQuote({ ...quote, [e.target.name]: e.target.value });
  };

  const updateItem = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    const qty = Number(copy[index].qty);
    const rate = Number(copy[index].rate);
    const tax = Number(copy[index].tax);
    copy[index].total = qty * rate + (qty * rate * tax) / 100;
    setItems(copy);
  };

  const addItem = () => {
    setItems([...items, { item: "", description: "", qty: 1, rate: 0, tax: 18, total: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
    setCollapsedItems(prev => {
      const next = {};
      Object.keys(prev).forEach(k => {
        const ki = Number(k);
        if (ki < index) next[ki] = prev[ki];
        else if (ki > index) next[ki - 1] = prev[ki];
      });
      return next;
    });
  };

  const moveItem = (index, direction) => {
    const copy = [...items];
    const swapIdx = index + direction;
    if (swapIdx < 0 || swapIdx >= copy.length) return;
    [copy[index], copy[swapIdx]] = [copy[swapIdx], copy[index]];
    setItems(copy);
    setCollapsedItems(prev => ({
      ...prev,
      [index]: prev[swapIdx],
      [swapIdx]: prev[index],
    }));
  };

  const subTotal = items.reduce((sum, item) => sum + Number(item.qty) * Number(item.rate), 0);
  const taxAmount = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.rate) * Number(item.tax)) / 100, 0);
  const grandTotal = subTotal + taxAmount - Number(quote.discount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/quotes/", {
        ...quote,
        items,
        subtotal: subTotal,
        tax: taxAmount,
        grand_total: grandTotal,
      });
      toast.success("Quotation Created Successfully");
      navigate("/quotes");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data
        ? JSON.stringify(err.response.data)
        : "Failed to create quotation.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-4 text-[#3c434a] font-sans">
      <form onSubmit={handleSubmit} className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5">

        {/* ================= LEFT COLUMN ================= */}
        <div className="flex-1 space-y-5">

          {/* Title */}
          <div>
            <input
              type="text"
              name="quotation_id"
              value={quote.quotation_id}
              onChange={handleQuoteChange}
              placeholder="Enter Quote title"
              className="w-full text-2xl border border-gray-300 shadow-inner px-4 py-2 focus:ring-1 focus:outline-none focus:border-[#2271b1] focus:ring-[#2271b1]"
            />
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-300 shadow-sm">
            <div className="border-b border-gray-200 px-4 py-2 flex justify-between font-semibold text-[13px]">
              <div>Description</div>
            </div>
            <div className="p-0 border-b border-gray-200 bg-[#f0f0f1] px-2 py-1 flex items-center gap-2">
              {/* Hidden file input for Add Media */}
              <input
                type="file"
                ref={mediaInputRef}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setQuote(prev => ({
                      ...prev,
                      description: prev.description
                        ? prev.description + `\n[Media: ${file.name}]`
                        : `[Media: ${file.name}]`
                    }));
                    toast.success(`Media "${file.name}" attached to description.`);
                  }
                  e.target.value = null;
                }}
              />
              <button
                type="button"
                onClick={() => mediaInputRef.current && mediaInputRef.current.click()}
                className="text-xs bg-white border border-gray-300 px-2 py-1 rounded-sm text-gray-700 flex items-center gap-1 hover:bg-blue-50 hover:text-[#2271b1] hover:border-[#2271b1] transition"
                title="Attach a media file (image, PDF, etc.) to description"
              >
                <span className="text-gray-500 font-bold">+</span> Add Media
              </button>
              <button
                type="button"
                onClick={() => {
                  const formTemplate = `\n--- Requirements Form ---\nProject Name: \nProject Type: \nDeadline: \nBudget Range: \nSpecial Notes: \n-------------------------`;
                  setQuote(prev => ({ ...prev, description: prev.description + formTemplate }));
                  toast.info("Form template inserted into description.");
                }}
                className="text-xs bg-white border border-gray-300 px-2 py-1 rounded-sm text-gray-700 flex items-center gap-1 hover:bg-blue-50 hover:text-[#2271b1] hover:border-[#2271b1] transition"
                title="Insert a requirements form template into the description"
              >
                <span className="text-gray-500 font-bold">+</span> Add Form
              </button>
              <div className="flex-1"></div>
              <button type="button" className="text-xs border border-gray-300 bg-gray-100 px-2 py-1">Visual</button>
              <button type="button" className="text-xs border-y border-r border-gray-300 bg-white px-2 py-1">Text</button>
            </div>
            <div className="p-0 bg-[#f0f0f1] border-b border-gray-200 px-2 py-1 flex items-center gap-3">
              <div className="flex items-center gap-1 text-gray-600 font-serif font-bold text-sm">
                <span className="px-1 hover:bg-gray-200 cursor-pointer">B</span>
                <span className="px-1 hover:bg-gray-200 cursor-pointer italic">I</span>
                <span className="px-1 hover:bg-gray-200 cursor-pointer line-through">U</span>
              </div>
            </div>
            <div>
              <textarea
                rows={4}
                name="description"
                value={quote.description}
                onChange={handleQuoteChange}
                className="w-full p-3 resize-y focus:outline-none focus:ring-inset focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white border border-gray-300 shadow-sm">
            <div
              className="border-b border-gray-200 px-4 py-2 font-semibold text-[13px] flex justify-between items-center cursor-pointer select-none"
              onClick={() => setLineItemsOpen(o => !o)}
              title="Click to collapse/expand Line Items"
            >
              <span>Line Items</span>
              <span
                className="text-gray-500 transition-transform"
                style={{ display: 'inline-block', transform: lineItemsOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}
              >&#9650;</span>
            </div>

            {lineItemsOpen && (
              <div className="p-4 space-y-4">
                {items.map((row, index) => (
                  <div key={index} className="border border-gray-300 bg-white">
                    {/* Item Header */}
                    <div
                      className="bg-[#f9f9f9] border-b border-gray-300 px-3 py-2 flex justify-between items-center text-sm font-semibold cursor-pointer select-none"
                      onClick={() => toggleItemCollapse(index)}
                      title="Click to collapse/expand this item"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="text-red-500 text-lg cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                          title="Remove this line item"
                        >&times;</span>
                        <span>Item {index + 1}{row.item ? ` — ${row.item}` : ''}</span>
                      </div>
                      <span
                        className="text-gray-400 text-xs"
                        style={{ display: 'inline-block', transform: collapsedItems[index] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      >&#9650;</span>
                    </div>

                    {/* Item Body */}
                    {!collapsedItems[index] && (
                      <div className="p-4 space-y-4 text-xs">
                        <div className="grid grid-cols-12 gap-4 items-end">
                          <div className="col-span-2">
                            <label className="block mb-1 text-gray-600">Qty</label>
                            <input type="number" value={row.qty} onChange={(e) => updateItem(index, "qty", e.target.value)} className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" />
                          </div>
                          <div className="col-span-4">
                            <label className="block mb-1 text-gray-600">Item Title</label>
                            <input type="text" value={row.item} onChange={(e) => updateItem(index, "item", e.target.value)} className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" />
                          </div>
                          <div className="col-span-2">
                            <label className="block mb-1 text-gray-600">Adjust (%)</label>
                            <input type="number" defaultValue={0} className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" />
                          </div>
                          <div className="col-span-2">
                            <label className="block mb-1 text-gray-600">Rate (₹)</label>
                            <input type="number" value={row.rate} onChange={(e) => updateItem(index, "rate", e.target.value)} className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" />
                          </div>
                          <div className="col-span-2 text-right">
                            <label className="block mb-1 text-gray-600">Amount (₹)</label>
                            <div className="p-1.5 font-bold text-gray-800 bg-gray-50 border border-transparent">
                              ₹{row.total.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4 items-start">
                          <div className="col-span-7">
                            <label className="block mb-1 text-gray-600">Description</label>
                            <textarea rows={2} placeholder="Brief description of the work carried out for this line item (optional)" value={row.description} onChange={(e) => updateItem(index, "description", e.target.value)} className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" />
                          </div>
                          <div className="col-span-2 text-center">
                            <label className="block mb-1 text-gray-600">Taxable</label>
                            <input type="checkbox" checked={row.tax > 0} onChange={(e) => updateItem(index, "tax", e.target.checked ? 18 : 0)} className="mt-2" />
                          </div>
                          <div className="col-span-3 text-right flex flex-col justify-end items-end h-full">
                            <div className="flex gap-1 items-center">
                              <select className="border border-gray-300 text-xs p-1 flex-1">
                                <option>Add a pre-defined line item</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => moveItem(index, -1)}
                                disabled={index === 0}
                                className="border border-gray-300 p-1 bg-white hover:bg-blue-50 hover:border-[#2271b1] disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move item up"
                              >&#9650;</button>
                              <button
                                type="button"
                                onClick={() => moveItem(index, 1)}
                                disabled={index === items.length - 1}
                                className="border border-gray-300 p-1 bg-white hover:bg-blue-50 hover:border-[#2271b1] disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move item down"
                              >&#9660;</button>
                            </div>
                            <div className="mt-2">
                              <button type="button" onClick={() => removeItem(index)} className="border border-gray-300 bg-white hover:bg-red-50 hover:border-red-400 hover:text-red-600 px-2 py-1 text-xs outline-none transition" title="Remove this item">Remove Item</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-between items-start mt-4">
                  <button
                    type="button"
                    onClick={addItem}
                    className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7] bg-white px-3 py-1.5 text-[13px] font-semibold transition"
                  >
                    Add Another Item
                  </button>

                  <div className="w-64 border border-gray-200 bg-white shadow-sm p-4 text-[13px]">
                    <div className="font-bold text-gray-800 text-right mb-3">Quote Totals</div>
                    <div className="flex justify-between mb-2 border-b border-gray-100 pb-1">
                      <span className="text-gray-600 text-xs">Sub Total</span>
                      <span className="text-gray-800">₹{subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 border-b border-gray-100 pb-1">
                      <span className="text-gray-600 text-xs text-right">GST (18%)</span>
                      <span className="text-gray-800">₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 border-b border-gray-100 pb-1">
                      <span className="text-gray-600 text-xs">Discount: <a href="#" className="text-[#2271b1] hover:underline">edit</a></span>
                      <span className="text-red-500">-₹{Number(quote.discount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-1 font-bold text-gray-900 border-t border-gray-200 mt-2">
                      <span>Total Due</span>
                      <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white border border-gray-300 shadow-sm">
            <div className="border-b border-gray-200 px-4 py-2 font-semibold text-[13px] flex justify-between items-center cursor-pointer select-none">
              <span>Terms &amp; Conditions</span>
              <span>&#9660;</span>
            </div>
            <div className="p-3">
              <textarea
                rows={3}
                name="terms"
                value={quote.terms}
                onChange={handleQuoteChange}
                className="w-full p-2 border border-gray-300 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] text-xs outline-none"
              />
            </div>
          </div>

          {/* Discussion */}
          <div className="bg-white border border-gray-300 shadow-sm">
            <div className="border-b border-gray-200 px-4 py-2 font-semibold text-[13px] flex justify-between items-center cursor-pointer select-none">
              <span>Discussion</span>
              <span>&#9650;</span>
            </div>
            <div className="p-4 text-[13px] text-gray-700 space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span>allow comments</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>allow <a href="#" className="text-[#2271b1] hover:underline">trackbacks and pingbacks</a></span>
              </label>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="w-full lg:w-72 space-y-5">

          {/* Publish */}
          <div className="bg-white border border-gray-300 shadow-sm">
            <div
              className="border-b border-gray-200 px-3 py-2 font-semibold text-[13px] flex justify-between items-center cursor-pointer select-none"
              onClick={() => setPublishOpen(o => !o)}
              title="Click to collapse/expand Publish"
            >
              <span>Publish</span>
              <span
                className="text-gray-500"
                style={{ display: 'inline-block', transform: publishOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}
              >&#9650;</span>
            </div>
            {publishOpen && (
              <>
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between text-[12px] text-gray-600 border-b border-gray-100 pb-2">
                    <span>&#128274; Status:</span>
                    <span className="font-semibold text-gray-800">{quote.status || "Draft"}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-gray-600 border-b border-gray-100 pb-2">
                    <span>&#128197; Date:</span>
                    <span className="font-semibold text-gray-800">{quote.quoteDate || "Immediately"}</span>
                  </div>
                </div>
                <div className="px-3 pb-3 flex justify-between items-center bg-gray-50 border-t border-gray-200 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/quotes")}
                    className="text-[#2271b1] hover:underline text-xs"
                  >
                    Move to Trash
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white px-4 py-1.5 text-[13px] rounded-sm transition font-semibold"
                    title="Save and publish this quotation"
                  >
                    {loading ? "Publishing..." : "Publish"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quote Details */}
          <div className="bg-white border border-gray-300 shadow-sm text-[13px]">
            <div
              className="border-b border-gray-200 px-3 py-2 font-semibold flex justify-between items-center cursor-pointer select-none"
              onClick={() => setDetailsOpen(o => !o)}
              title="Click to collapse/expand Quote Details"
            >
              <span>Quote Details</span>
              <span
                className="text-gray-500"
                style={{ display: 'inline-block', transform: detailsOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}
              >&#9650;</span>
            </div>

            {detailsOpen && (
              <div className="p-3 space-y-4">
                {/* Client */}
                <div>
                  <div className="font-bold mb-1">Client</div>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (quote.client) {
                          navigate(`/clients/edit/${quote.client}`);
                        } else {
                          toast.warning("Please select a client first.");
                        }
                      }}
                      className="border border-[#2271b1] text-[#2271b1] bg-white px-2 py-0.5 text-xs hover:bg-[#f0f6fc] transition"
                      title="Edit the currently selected client"
                    >
                      Edit Client
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/clients/add")}
                      className="border border-[#2271b1] text-[#2271b1] bg-white px-2 py-0.5 text-xs hover:bg-[#f0f6fc] transition"
                      title="Add a new client"
                    >
                      Add New Client
                    </button>
                  </div>
                  <select
                    name="client"
                    value={quote.client}
                    onChange={handleQuoteChange}
                    className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] outline-none bg-white"
                  >
                    <option value="">Choose client...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.client}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="font-bold block mb-1">Status</label>
                  <select
                    name="status"
                    value={quote.status}
                    onChange={handleQuoteChange}
                    className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] outline-none bg-white"
                  >
                    <option>Draft</option>
                    <option>Pending</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>
                </div>

                {/* Quote Number */}
                <div>
                  <label className="font-bold block mb-1">Quote Number</label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2 text-xs">AKEYI-</span>
                    <input
                      type="text"
                      name="quotation_id"
                      value={quote.quotation_id}
                      onChange={handleQuoteChange}
                      placeholder="02"
                      className="w-24 border border-gray-300 p-1.5 text-xs focus:border-[#2271b1] outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Created Date */}
                <div>
                  <label className="font-bold block mb-1">Created Date</label>
                  <input
                    type="date"
                    name="quoteDate"
                    value={quote.quoteDate}
                    onChange={handleQuoteChange}
                    className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] outline-none bg-white text-gray-600"
                  />
                </div>

                {/* Valid Until Date */}
                <div>
                  <label className="font-bold block mb-1">Valid Until Date</label>
                  <input
                    type="date"
                    name="validUntil"
                    value={quote.validUntil}
                    onChange={handleQuoteChange}
                    className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] outline-none bg-white text-gray-600"
                  />
                </div>

                {/* Payment Settings */}
                <div className="border border-gray-200">
                  <div className="bg-gray-50 px-2 py-1.5 flex justify-between items-center text-xs cursor-pointer border-b border-gray-200">
                    <span>Payment Settings</span>
                    <span>&#9660;</span>
                  </div>
                  <div className="p-2 space-y-3">
                    <div>
                      <label className="font-bold block mb-1 text-[11px]">Currency</label>
                      <select
                        name="currency"
                        value={quote.currency}
                        onChange={handleQuoteChange}
                        className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] outline-none bg-white text-xs"
                      >
                        <option value="INR">Default Currency</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold block mb-1 text-[11px]">Currency Symbol</label>
                      <input
                        type="text"
                        readOnly
                        value={quote.currency === 'INR' ? '₹' : (quote.currency === 'USD' ? '$' : '€')}
                        className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] outline-none bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Tax Settings */}
                <div className="border border-gray-200">
                  <div className="bg-gray-50 px-2 py-1.5 flex justify-between items-center text-xs cursor-pointer border-b border-gray-200">
                    <span>Tax Settings</span>
                    <span>&#9660;</span>
                  </div>
                  <div className="p-2 space-y-3">
                    <div>
                      <label className="font-bold block mb-1 text-[11px] leading-tight">Prices entered with tax</label>
                      <select className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] outline-none bg-white text-[11px]">
                        <option>No, I will enter prices exclusi...</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold block mb-1 text-[11px] leading-tight">Tax Rate (%)</label>
                      <input type="text" defaultValue="18" className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] outline-none bg-white text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
