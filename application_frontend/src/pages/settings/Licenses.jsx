import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { Info, ShieldCheck, CheckCircle2, XCircle, Save } from "lucide-react";
import api from '../../services/api';

const API_ENDPOINT = '/settings/licenses/';

const FieldRow = ({ label, hint, children }) => (
  <div className="grid md:grid-cols-[200px_1fr] gap-4 items-start w-full py-3 border-b border-gray-100 last:border-b-0">
    <label className="text-sm font-medium text-gray-700 pt-1.5">{label}</label>
    <div className="flex flex-col max-w-xl">
      {children}
      {hint && <p className="text-xs text-gray-400 italic mt-1.5">{hint}</p>}
    </div>
  </div>
);

const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full";

export default function Licenses() {
  const [license, setLicense] = useState({
    company: "",
    purchaseCode: "",
    licenseKey: "",
    expiry: "",
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
      setLicense(prev => ({ ...prev, ...fetched }));
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
      await api.put(API_ENDPOINT, license);
      toast.success("License saved!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save license!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    setLicense({ ...license, [e.target.name]: e.target.value });
  };

  const isActive = license.licenseKey && license.expiry;

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading settings...</div>;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">License Settings</h2>

      <div className="flex items-start gap-2 mt-3 mb-6 bg-blue-50 border border-blue-200 rounded p-3 text-[13px] text-blue-700">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>Manage your software license and activation details.</span>
      </div>

      {/* License Status Card */}
      <div className={`flex items-center gap-4 p-4 rounded-lg mb-6 border ${isActive ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        {isActive
          ? <CheckCircle2 className="text-green-600 shrink-0" size={22} />
          : <XCircle className="text-yellow-600 shrink-0" size={22} />
        }
        <div>
          <p className={`font-semibold text-sm ${isActive ? 'text-green-800' : 'text-yellow-800'}`}>
            {isActive ? "License Active" : "License Not Configured"}
          </p>
          <p className={`text-xs ${isActive ? 'text-green-600' : 'text-yellow-600'}`}>
            {isActive ? `Expires: ${license.expiry}` : "Please enter your license details below."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <FieldRow label="Company Name" hint="The company name associated with this license.">
          <input type="text" name="company" value={license.company} onChange={handleChange} placeholder="e.g. Ultrakey IT Solutions Pvt. Ltd." className={inputCls} />
        </FieldRow>

        <FieldRow label="Purchase Code" hint="The purchase code received after buying the product.">
          <input type="text" name="purchaseCode" value={license.purchaseCode} onChange={handleChange} placeholder="e.g. abc123-def456-..." className={`${inputCls} font-mono text-xs`} />
        </FieldRow>

        <FieldRow label="License Key" hint="Your unique license key for activation.">
          <input type="text" name="licenseKey" value={license.licenseKey} onChange={handleChange} placeholder="e.g. XXXX-XXXX-XXXX-XXXX" className={`${inputCls} font-mono text-xs`} />
        </FieldRow>

        <FieldRow label="License Expiry Date" hint="The date on which the license expires and must be renewed.">
          <input type="date" name="expiry" value={license.expiry} onChange={handleChange} className={inputCls} style={{ width: "200px" }} />
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