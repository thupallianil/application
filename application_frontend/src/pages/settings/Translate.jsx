import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Info, Save } from "lucide-react";
import api from '../../services/api';

const API_ENDPOINT = '/settings/translate/';

const FieldRow = ({ label, hint, children }) => (
  <div className="grid md:grid-cols-[200px_1fr] gap-4 items-start w-full py-3 border-b border-gray-100 last:border-b-0">
    <label className="text-sm font-medium text-gray-700 pt-1.5">{label}</label>
    <div className="flex flex-col max-w-xl">
      {children}
      {hint && <p className="text-xs text-gray-400 italic mt-1.5" dangerouslySetInnerHTML={{ __html: hint }} />}
    </div>
  </div>
);

const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full";

export default function Translate() {
  const [form, setForm] = useState({
    quoteLabel: "Quote",
    quoteLabelPlural: "Quotes",
    invoiceLabel: "Invoice",
    invoiceLabelPlural: "Invoices",
    hrsQty: "Hrs/Qty",
    service: "Service",
    ratePrice: "Rate/Price",
    adjust: "Adjust",
    subTotal: "Sub Total",
    discount: "Discount",
    total: "Total",
    totalDue: "Total Due",
  });

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get(API_ENDPOINT);
      const fetched = {};
      for (const key in res.data) {
        if (res.data[key] !== null) fetched[key] = res.data[key];
      }
      setForm(prev => ({ ...prev, ...fetched }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(API_ENDPOINT, form);
      toast.success("Translate settings saved!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save translate settings!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading settings...</div>;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">Translate Settings</h2>

      <div className="flex items-start gap-2 mt-3 mb-6 bg-blue-50 border border-blue-200 rounded p-3 text-[13px] text-blue-700">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>
          Here you can translate strings into your own language, or simply change the text to suit your needs.
          <br />
          (PRO) The <a href="#" className="underline text-blue-800">Easy Translate Extension</a> adds many more fields here, allowing you to translate every piece of text your client sees on your quotes and invoices.
        </span>
      </div>

      <form onSubmit={handleSave}>
        <FieldRow label="Quote Label" hint='You can change this from Quote to Estimate or Proposal (or any other word you like).'>
          <input type="text" name="quoteLabel" value={form.quoteLabel} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Quote Label Plural" hint="The plural of the above.">
          <input type="text" name="quoteLabelPlural" value={form.quoteLabelPlural} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Invoice Label" hint='You can change this from Invoice to Tax Invoice (or any other word you like).'>
          <input type="text" name="invoiceLabel" value={form.invoiceLabel} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Invoice Label Plural" hint="The plural of the above.">
          <input type="text" name="invoiceLabelPlural" value={form.invoiceLabelPlural} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Hrs/Qty">
          <input type="text" name="hrsQty" value={form.hrsQty} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Service">
          <input type="text" name="service" value={form.service} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Rate/Price">
          <input type="text" name="ratePrice" value={form.ratePrice} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Adjust">
          <input type="text" name="adjust" value={form.adjust} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Sub Total">
          <input type="text" name="subTotal" value={form.subTotal} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Discount">
          <input type="text" name="discount" value={form.discount} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Total">
          <input type="text" name="total" value={form.total} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Total Due">
          <input type="text" name="totalDue" value={form.totalDue} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <div className="flex justify-start pt-6 pb-2">
          <button type="submit" disabled={isSaving} className="bg-[#2271b1] hover:bg-[#135e96] text-white px-5 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
            <Save size={16} />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}