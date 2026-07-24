import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import api from '../../services/api';

const API_ENDPOINT = '/settings/extras/';

export default function Extras() {

  const [extra, setExtra] = useState({
    darkMode: false,
    notifications: true,
    maintenance: false,
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
      setExtra(prev => ({ ...prev, ...fetched }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.put(API_ENDPOINT, extra);
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings!");
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(e);
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Extra Settings
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={extra.darkMode}
              onChange={() =>
                setExtra({
                  ...extra,
                  darkMode: !extra.darkMode,
                })
              }
            />
            Enable Dark Mode
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={extra.notifications}
              onChange={() =>
                setExtra({
                  ...extra,
                  notifications: !extra.notifications,
                })
              }
            />
            Email Notifications
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={extra.maintenance}
              onChange={() =>
                setExtra({
                  ...extra,
                  maintenance: !extra.maintenance,
                })
              }
            />
            Maintenance Mode
          </label>

        </div>

        <button type="submit" className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg">
          Save Settings
        </button>
      </form>

    </div>
  );
}