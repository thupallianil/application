import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { Info, Save } from "lucide-react";
import api from '../../services/api';

const API_ENDPOINT = '/settings/pdf/';

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

export default function Pdf() {
  const [pdf, setPdf] = useState({
    template: "Template 1",
    paper: "A4",
    orientation: "Portrait",
    watermark: false,
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
      setPdf(prev => ({ ...prev, ...fetched }));
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
      await api.put(API_ENDPOINT, pdf);
      toast.success("PDF settings saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save PDF settings!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPdf(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading settings...</div>;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">PDF Settings</h2>

      <div className="flex items-start gap-2 mt-3 mb-6 bg-blue-50 border border-blue-200 rounded p-3 text-[13px] text-blue-700">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>Configure how PDF documents are generated for invoices and quotes.</span>
      </div>

      <form onSubmit={handleSave}>
        <FieldRow label="Template" hint="Choose which PDF template to use when generating documents.">
          <select name="template" value={pdf.template} onChange={handleChange} className={inputCls} style={{ width: "250px" }}>
            <option value="Template 1">Template 1</option>
            <option value="Template 2">Template 2</option>
            <option value="Template 3">Template 3</option>
          </select>
        </FieldRow>

        <FieldRow label="Paper Size" hint="The paper size for generated PDF documents.">
          <select name="paper" value={pdf.paper} onChange={handleChange} className={inputCls} style={{ width: "250px" }}>
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
          </select>
        </FieldRow>

        <FieldRow label="Orientation" hint="Choose between Portrait or Landscape layout for PDFs.">
          <select name="orientation" value={pdf.orientation} onChange={handleChange} className={inputCls} style={{ width: "250px" }}>
            <option value="Portrait">Portrait</option>
            <option value="Landscape">Landscape</option>
          </select>
        </FieldRow>

        <FieldRow label="Watermark" hint="Add a 'PAID' or 'DRAFT' watermark to generated PDFs.">
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-1">
            <input type="checkbox" name="watermark" checked={pdf.watermark} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            Yes, enable watermark on PDF documents
          </label>
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