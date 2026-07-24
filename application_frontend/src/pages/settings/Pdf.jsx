import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import api from '../../services/api';

const API_ENDPOINT = '/settings/pdf/';

export default function Pdf() {

  const [pdf, setPdf] = useState({
    template: "Template 1",
    paper: "A4",
    orientation: "Portrait",
    watermark: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
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
    try {
      await api.put(API_ENDPOINT, pdf);
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings!");
    }
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setPdf({
      ...pdf,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(e);
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        PDF Settings
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <select
          name="template"
          value={pdf.template}
          onChange={handleChange}
          className="border rounded-lg p-3 w-full"
        >
          <option>Template 1</option>
          <option>Template 2</option>
          <option>Template 3</option>
        </select>

        <select
          name="paper"
          value={pdf.paper}
          onChange={handleChange}
          className="border rounded-lg p-3 w-full"
        >
          <option>A4</option>
          <option>Letter</option>
        </select>

        <select
          name="orientation"
          value={pdf.orientation}
          onChange={handleChange}
          className="border rounded-lg p-3 w-full"
        >
          <option>Portrait</option>
          <option>Landscape</option>
        </select>

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="watermark"
            checked={pdf.watermark}
            onChange={handleChange}
          />

          Enable Watermark

        </label>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Save PDF Settings
        </button>

      </form>

    </div>
  );
}