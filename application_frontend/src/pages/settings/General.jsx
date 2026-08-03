import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { Info, Save } from "lucide-react";
import api from '../../services/api';

const API_ENDPOINT = '/settings/general/';

const FieldRow = ({ label, hint, children }) => (
  <div className="grid md:grid-cols-[200px_1fr] gap-4 items-start w-full py-3 border-b border-gray-100 last:border-b-0">
    <label className="text-sm font-medium text-gray-700 pt-1.5">{label}</label>
    <div className="flex flex-col max-w-xl">
      {children}
      {hint && <p className="text-xs text-gray-400 italic mt-1.5">{hint}</p>}
    </div>
  </div>
);

const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";

export default function General() {
  const [formData, setFormData] = useState({
    yearStart: '01 Apr',
    yearEnd: '31 Mar',
    preDefinedLineItems: '',
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
      setFormData(prev => ({ ...prev, ...fetched }));
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
      await api.put(API_ENDPOINT, formData);
      toast.success("General settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save general settings!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading settings...</div>;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">General Settings</h2>

      <div className="flex items-start gap-2 mt-3 mb-6 bg-blue-50 border border-blue-200 rounded p-3 text-[13px] text-blue-700">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>Here you will find all of the General application settings. Configure your financial year and pre-defined line items.</span>
      </div>

      <form onSubmit={handleSave}>
        <FieldRow label="Financial Year Start" hint="The start date of your financial year (e.g. 01 Apr for India).">
          <input type="text" name="yearStart" value={formData.yearStart} onChange={handleChange} placeholder="e.g. 01 Apr" className={inputCls} style={{ width: "200px" }} />
        </FieldRow>

        <FieldRow label="Financial Year End" hint="The end date of your financial year (e.g. 31 Mar for India).">
          <input type="text" name="yearEnd" value={formData.yearEnd} onChange={handleChange} placeholder="e.g. 31 Mar" className={inputCls} style={{ width: "200px" }} />
        </FieldRow>

        <FieldRow label="Pre-defined Line Items" hint="Comma-separated list of common items shown as suggestions when adding line items.">
          <textarea name="preDefinedLineItems" rows="5" value={formData.preDefinedLineItems} onChange={handleChange} placeholder="e.g. Web Design, Hosting, Maintenance, Support" className={`${inputCls} w-full`} />
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
