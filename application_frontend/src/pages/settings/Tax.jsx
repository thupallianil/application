import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { Info, Save } from "lucide-react";
import api from '../../services/api';
import { invalidateSettingsCache } from '../../services/settingsService';

const API_ENDPOINT = '/settings/tax/';

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

export default function Tax() {
  const [tax, setTax] = useState({
    pricesIncludeTax: "no",
    taxRate: "18",
    taxName: "GST (18%)",
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
      setTax(prev => ({ ...prev, ...fetched }));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(API_ENDPOINT, tax);
      invalidateSettingsCache('tax');
      toast.success("Tax settings saved!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save tax settings!");
    } finally { setIsSaving(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTax(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading settings...</div>;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">Tax Settings</h2>

      <div className="flex items-start gap-2 mt-3 mb-6 bg-blue-50 border border-blue-200 rounded p-3 text-[13px] text-blue-700">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>Here you will find all tax-related settings.</span>
      </div>

      <form onSubmit={handleSave}>
        <FieldRow label="Prices entered with tax">
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="pricesIncludeTax"
                value="yes"
                checked={tax.pricesIncludeTax === "yes"}
                onChange={handleChange}
                className="text-blue-600 w-4 h-4"
              />
              Yes, I will enter prices inclusive of tax
            </label>
            <label className={`flex items-center gap-2 text-sm ${tax.pricesIncludeTax === "no" ? "text-blue-600 font-medium" : "text-gray-700"}`}>
              <input
                type="radio"
                name="pricesIncludeTax"
                value="no"
                checked={tax.pricesIncludeTax === "no"}
                onChange={handleChange}
                className="text-blue-600 w-4 h-4"
              />
              No, I will enter prices exclusive of tax
            </label>
          </div>
        </FieldRow>

        <FieldRow label="Tax Rate (%)" hint="Default tax percentage. Set to 0 or leave blank for no tax.">
          <input type="number" name="taxRate" value={tax.taxRate} onChange={handleChange} className={inputCls} style={{ width: "200px" }} min="0" max="100" step="0.01" />
        </FieldRow>

        <FieldRow label="Tax Name" hint="The name of the tax for your country/region. GST, VAT, Tax etc.">
          <input type="text" name="taxName" value={tax.taxName} onChange={handleChange} className={inputCls} style={{ width: "250px" }} placeholder="e.g. GST (18%)" />
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