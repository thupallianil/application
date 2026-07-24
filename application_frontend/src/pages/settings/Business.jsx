import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { Info, Save } from 'lucide-react';
import api from '../../services/api';

const API_ENDPOINT = '/settings/business/';

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

export default function Business() {
  const [formData, setFormData] = useState({
    logoUrl: 'https://ultrakeyit.com/wp-content/uploads/2024...',
    businessName: 'Ultrakey IT Solutions Private Limited',
    address: 'Flat No: 204, 2nd Floor, Cyber Residency\nIndira Nagar, Gachibowli,\nHyderabad, Telangana, India-500032\nsupport@ultrakeyit.com',
    extraInfo: '<br>\n<b>GST No:</b> 36AADC05062A1ZU',
    website: 'https://ultrakeyit.com'
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
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
      toast.success("Business settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save business settings!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading settings...</div>;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">Business Settings</h2>

      <div className="flex items-start gap-2 mt-3 mb-6 bg-blue-50 border border-blue-200 rounded p-3 text-[13px] text-blue-700">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>All of the Business Details below will be displayed on the Quotes &amp; Invoices.</span>
      </div>

      <form onSubmit={handleSave}>
        <FieldRow label="Logo" hint="Logo of your business. If no logo is added, the name of your business will be used instead.">
          <div className="flex items-center gap-3">
            <input type="text" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className={inputCls} />
            <button type="button" className="border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm whitespace-nowrap">Add or Upload File</button>
          </div>
          <div className="mt-3 p-2 border border-gray-200 inline-block bg-gray-50 rounded">
            <div className="w-48 h-14 flex items-center justify-center font-bold text-lg text-blue-900" style={{ backgroundImage: 'radial-gradient(#ddd 1px, transparent 0)', backgroundSize: '10px 10px' }}>
              <span className="bg-white/80 px-2 rounded">Ultrakey</span>
            </div>
          </div>
        </FieldRow>

        <FieldRow label="Business Name">
          <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Address" hint="Add your full address and format it anyway you like. Basic HTML is allowed.">
          <textarea name="address" rows="4" value={formData.address} onChange={handleChange} className={inputCls} />
        </FieldRow>

        <FieldRow label="Extra Business Info" hint="Extra business info such as Business Number, phone number or email address. Basic HTML is allowed.<br>You can add your VAT number or ABN here.">
          <textarea name="extraInfo" rows="3" value={formData.extraInfo} onChange={handleChange} className={`${inputCls} font-mono`} />
        </FieldRow>

        <FieldRow label="Website">
          <input type="text" name="website" value={formData.website} onChange={handleChange} className={inputCls} />
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