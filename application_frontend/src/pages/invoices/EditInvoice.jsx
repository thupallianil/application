import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Trash2,
  Save,
  Calendar,
  FileText,
} from "lucide-react";

export default function EditInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [invoice, setInvoice] = useState({
    title: "",
    client: "",
    status: "Pending",
    invoiceDate: "",
    dueDate: "",
    currency: "INR",
    discount: 0,
    notes: "",
    terms: "",
  });

  const [items, setItems] = useState([
    {
      item: "",
      qty: 1,
      price: 0,
      tax: 18,
      total: 0,
    },
  ]);

  const [payments, setPayments] = useState([
    {
      amount: "",
      method: "",
      reference: "",
      date: "",
    },
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
        notes: data.notes || "",
        terms: data.terms || "",
      });
      if (data.items && data.items.length > 0) {
        setItems(data.items);
      }
      if (data.payments && data.payments.length > 0) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.log(err);
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

  const handleInvoiceChange = (e) => {
    setInvoice({
      ...invoice,
      [e.target.name]: e.target.value,
    });
  };

  const updateItem = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;

    const qty = Number(copy[index].qty);
    const price = Number(copy[index].price);
    const tax = Number(copy[index].tax);

    copy[index].total =
      qty * price +
      (qty * price * tax) / 100;

    setItems(copy);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        item: "",
        qty: 1,
        price: 0,
        tax: 18,
        total: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.qty) * Number(item.price),
    0
  );

  const taxAmount = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.qty) *
        Number(item.price) *
        Number(item.tax)) /
      100,
    0
  );

  const grandTotal =
    subtotal +
    taxAmount -
    Number(invoice.discount);

  const submitInvoice = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/invoices/${id}/`, {
        ...invoice,
        items,
        payments,
        subtotal,
        taxAmount,
        grandTotal,
      });

      toast.success("Invoice Updated");
      navigate("/invoices");
    } catch (err) {
      toast.error("Unable to update invoice");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={submitInvoice}
        className="max-w-7xl mx-auto flex gap-6"
      >
        {/* LEFT */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-lg shadow border">
            <div className="border-b px-6 py-4">
              <h1 className="text-3xl font-semibold">
                Edit Invoice
              </h1>
            </div>
            <div className="p-6">
              <input
                type="text"
                name="title"
                value={invoice.title}
                onChange={handleInvoiceChange}
                placeholder="Enter Invoice Title"
                className="w-full text-2xl border rounded-lg p-3"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white rounded-lg shadow border">
            <div className="border-b px-6 py-3 font-semibold">
              Description
            </div>
            <div className="p-6">
              <textarea
                rows="6"
                name="notes"
                value={invoice.notes}
                onChange={handleInvoiceChange}
                placeholder="Invoice Description..."
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>

          {/* ITEMS */}
          <div className="bg-white rounded-lg shadow border">
            <div className="border-b px-6 py-3 flex justify-between">
              <h2 className="font-semibold">
                Invoice Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Item</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Tax %</th>
                    <th className="p-2">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <input
                          className="border rounded p-2 w-full"
                          value={row.item}
                          onChange={(e) => updateItem(index, "item", e.target.value)}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="border rounded p-2 w-20"
                          value={row.qty}
                          onChange={(e) => updateItem(index, "qty", e.target.value)}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="border rounded p-2 w-28"
                          value={row.price}
                          onChange={(e) => updateItem(index, "price", e.target.value)}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="border rounded p-2 w-20"
                          value={row.tax}
                          onChange={(e) => updateItem(index, "tax", e.target.value)}
                        />
                      </td>
                      <td className="p-2 font-semibold">
                        ₹{row.total.toFixed(2)}
                      </td>
                      <td className="p-2">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t p-6 flex justify-end">
              <div className="w-80 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Discount</span>
                  <input
                    type="number"
                    name="discount"
                    value={invoice.discount}
                    onChange={handleInvoiceChange}
                    className="border rounded p-2 w-28"
                  />
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENTS */}
          <div className="bg-white rounded-lg shadow border">
            <div className="border-b px-6 py-3 flex justify-between">
              <h2 className="font-semibold">Payments</h2>
              <button
                type="button"
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() =>
                  setPayments([
                    ...payments,
                    {
                      amount: "",
                      method: "",
                      reference: "",
                      date: "",
                    },
                  ])
                }
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {payments.map((payment, index) => (
                <div key={index} className="grid grid-cols-4 gap-4">
                  <input
                    placeholder="Amount"
                    className="border rounded p-2"
                    value={payment.amount}
                    onChange={(e) => {
                      const copy = [...payments];
                      copy[index].amount = e.target.value;
                      setPayments(copy);
                    }}
                  />
                  <input
                    placeholder="Method"
                    className="border rounded p-2"
                    value={payment.method}
                    onChange={(e) => {
                      const copy = [...payments];
                      copy[index].method = e.target.value;
                      setPayments(copy);
                    }}
                  />
                  <input
                    placeholder="Reference"
                    className="border rounded p-2"
                    value={payment.reference}
                    onChange={(e) => {
                      const copy = [...payments];
                      copy[index].reference = e.target.value;
                      setPayments(copy);
                    }}
                  />
                  <input
                    type="date"
                    className="border rounded p-2"
                    value={payment.date}
                    onChange={(e) => {
                      const copy = [...payments];
                      copy[index].date = e.target.value;
                      setPayments(copy);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ================= TERMS & NOTES ================= */}
          <div className="bg-white border rounded-lg shadow">
            <div className="border-b px-6 py-3 font-semibold">
              Terms & Conditions
            </div>
            <div className="p-6">
              <textarea
                rows={5}
                name="terms"
                value={invoice.terms}
                onChange={handleInvoiceChange}
                placeholder="Enter invoice terms and conditions..."
                className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate("/invoices")}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Updating..." : "Update Invoice"}
            </button>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Publish Card */}
          <div className="bg-white border rounded-lg shadow">
            <div className="border-b px-5 py-3 font-semibold">Publish</div>
            <div className="p-5 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {loading ? "Updating..." : "Publish Invoice"}
              </button>
              <button
                type="button"
                className="w-full border rounded-lg py-2 hover:bg-gray-50"
              >
                Save Draft
              </button>
              <button
                type="button"
                className="w-full border rounded-lg py-2 hover:bg-gray-50"
              >
                Preview
              </button>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-white border rounded-lg shadow">
            <div className="border-b px-5 py-3 font-semibold">
              Invoice Details
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium">Client</label>
                <select
                  name="client"
                  value={invoice.client}
                  onChange={handleInvoiceChange}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select Client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.client}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={invoice.status}
                  onChange={handleInvoiceChange}
                  className="w-full border rounded-lg p-2"
                >
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Invoice Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="invoiceDate"
                    value={invoice.invoiceDate}
                    onChange={handleInvoiceChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={invoice.dueDate}
                  onChange={handleInvoiceChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Currency
                </label>
                <select
                  name="currency"
                  value={invoice.currency}
                  onChange={handleInvoiceChange}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* END RIGHT SIDEBAR */}
      </form>
    </div>
  );
}