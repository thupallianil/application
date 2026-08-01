import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function EditQuote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const mediaInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState([]);

  const [quote, setQuote] = useState({
    quotation_id: "",
    client: "",
    status: "Draft",
    quoteDate: "",
    validUntil: "",
    currency: "INR",
    description: "",
    terms: "",
    notes: "",
    discount: 0,
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchQuoteData();
  }, []);

  const fetchQuoteData = async () => {
    try {
      const [clientsRes, quoteRes] = await Promise.all([
        api.get("/clients/"),
        api.get(`/quotes/${id}/`)
      ]);

      setClients(clientsRes.data);

      const data = quoteRes.data;
      setQuote({
        quotation_id: data.quotation_id || "",
        client: data.client || "",
        status: data.status || "Draft",
        quoteDate: data.quoteDate || "",
        validUntil: data.validUntil || "",
        currency: data.currency || "INR",
        description: data.description || "",
        terms: data.terms || "",
        notes: data.notes || "",
        discount: data.discount || 0,
      });

      if (data.items && data.items.length > 0) {
        setItems(data.items);
      } else {
        setItems([{ item: "", description: "", qty: 1, rate: 0, tax: 18, total: 0 }]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch quotation.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteChange = (e) => {
    setQuote({
      ...quote,
      [e.target.name]: e.target.value,
    });
  };

  const updateItem = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    const qty = Number(copy[index].qty) || 0;
    const rate = Number(copy[index].rate || copy[index].price || 0);
    const tax = Number(copy[index].tax) || 0;
    copy[index].price = rate;
    copy[index].total = qty * rate + (qty * rate * tax) / 100;
    setItems(copy);
  };

  const addItem = () => {
    setItems([...items, { item: "", description: "", qty: 1, rate: 0, tax: 18, total: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subTotal = items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate || item.price) || 0), 0);
  const taxAmount = items.reduce((sum, item) => sum + ((Number(item.qty) || 0) * (Number(item.rate || item.price) || 0) * (Number(item.tax) || 0)) / 100, 0);
  const grandTotal = subTotal + taxAmount - Number(quote.discount || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...quote,
        items,
        subtotal: subTotal,
        tax: taxAmount,
        grand_total: grandTotal,
        amount: grandTotal,
      };
      await api.put(`/quotes/${id}/`, payload);
      toast.success("Quotation Updated Successfully");
      navigate("/quotes");
    } catch (err) {
      console.log(err);
      toast.error("Unable to update quotation.");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Quote...</div>;
  }

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
                    toast.success(`Media "${file.name}" attached.`);
                  }
                  e.target.value = null;
                }}
              />
              <button
                type="button"
                onClick={() => mediaInputRef.current && mediaInputRef.current.click()}
                className="text-xs bg-white border border-gray-300 px-2 py-1 rounded-sm text-gray-700 flex items-center gap-1 hover:bg-blue-50 hover:text-[#2271b1] hover:border-[#2271b1] transition"
                title="Attach a media file to description"
              >
                <span className="text-gray-500 font-bold">+</span> Add Media
              </button>
              <button
                type="button"
                onClick={() => {
                  const formTemplate = `\n--- Requirements Form ---\nProject Name: \nProject Type: \nDeadline: \nBudget Range: \nSpecial Notes: \n-------------------------`;
                  setQuote(prev => ({ ...prev, description: prev.description + formTemplate }));
                  toast.info("Form template inserted.");
                }}
                className="text-xs bg-white border border-gray-300 px-2 py-1 rounded-sm text-gray-700 flex items-center gap-1 hover:bg-blue-50 hover:text-[#2271b1] hover:border-[#2271b1] transition"
                title="Insert a requirements form template"
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
                className="w-full p-3 resize-y focus:outline-none focus:ring-inset focus:ring-1 focus:ring-[#2271b1] text-sm"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white border border-gray-300 shadow-sm">
            <div className="border-b border-gray-200 px-4 py-2 font-semibold text-[13px] flex justify-between items-center cursor-pointer">
              <span>Line Items</span>
              <span>&#9650;</span>
            </div>

            <div className="p-4 space-y-4">
              {items.map((row, index) => (
                <div key={index} className="border border-gray-300 bg-white">
                  <div className="bg-[#f9f9f9] border-b border-gray-300 px-3 py-2 flex justify-between items-center text-sm font-semibold cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 text-lg cursor-pointer" onClick={() => removeItem(index)}>&times;</span>
                      <span>Item {index + 1}</span>
                    </div>
                    <span>&#9650;</span>
                  </div>

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
                        <input type="number" value={row.rate || row.price || 0} onChange={(e) => updateItem(index, "rate", e.target.value)} className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" />
                      </div>
                      <div className="col-span-2 text-right">
                        <label className="block mb-1 text-gray-600">Amount (₹)</label>
                        <div className="p-1.5 font-bold text-gray-800 bg-gray-50 border border-transparent">
                          ₹{(row.total || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-7">
                        <label className="block mb-1 text-gray-600">Description</label>
                        <textarea rows={2} placeholder="Brief description..." value={row.description} onChange={(e) => updateItem(index, "description", e.target.value)} className="w-full border border-gray-300 p-1.5 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" />
                      </div>
                      <div className="col-span-2 text-center">
                        <label className="block mb-1 text-gray-600">Taxable</label>
                        <input type="checkbox" checked={row.tax > 0} onChange={(e) => updateItem(index, "tax", e.target.checked ? 18 : 0)} className="mt-2" />
                      </div>
                      <div className="col-span-3 text-right flex flex-col justify-end items-end h-full">
                        <div className="flex gap-2">
                          <select className="border border-gray-300 text-xs p-1">
                            <option>Add a pre-defined line item</option>
                          </select>
                          <button type="button" className="border border-gray-300 p-1 bg-white hover:bg-gray-50">&#9650;</button>
                          <button type="button" className="border border-gray-300 p-1 bg-white hover:bg-gray-50">&#9660;</button>
                        </div>
                        <div className="mt-2">
                          <button type="button" onClick={() => removeItem(index)} className="border border-gray-300 bg-white hover:bg-gray-50 px-2 py-1 text-xs outline-none">Remove Item</button>
                        </div>
                      </div>
                    </div>
                  </div>
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
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white border border-gray-300 shadow-sm">
            <div className="border-b border-gray-200 px-4 py-2 font-semibold text-[13px] flex justify-between items-center cursor-pointer">
              <span>Terms & Conditions</span>
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
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="w-full lg:w-72 space-y-5">
          {/* Publish */}
          <div className="bg-white border border-gray-300 shadow-sm">
            <div className="border-b border-gray-200 px-3 py-2 font-semibold text-[13px] flex justify-between items-center">
              <span>Publish</span>
              <span>&#9650;</span>
            </div>
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white px-4 py-1.5 text-[13px] rounded-sm transition font-semibold"
                title="Save updates to this quotation"
              >
                {saving ? "Updating..." : "Update"}
              </button>
            </div>
          </div>

          {/* Quote Details */}
          <div className="bg-white border border-gray-300 shadow-sm text-[13px]">
            <div className="border-b border-gray-200 px-3 py-2 font-semibold flex justify-between items-center cursor-pointer">
              <span>Quote Details</span>
              <span>&#9650;</span>
            </div>

            <div className="p-3 space-y-4">
              {/* Client */}
              <div>
                <div className="font-bold mb-1 flex items-center justify-between">
                  Client
                </div>
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
                  <span className="text-gray-500 mr-2 text-xs">AKEYQ-</span>
                  <input
                    type="text"
                    name="quotation_id"
                    value={quote.quotation_id}
                    onChange={handleQuoteChange}
                    placeholder="02"
                    className="w-full border border-gray-300 p-1.5 text-xs focus:border-[#2271b1] outline-none bg-white"
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
              </div>

              {/* Tax Settings */}
              <div className="border border-gray-200">
                <div className="bg-gray-50 px-2 py-1.5 flex justify-between items-center text-xs cursor-pointer border-b border-gray-200">
                  <span>Tax Settings</span>
                  <span>&#9660;</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
}