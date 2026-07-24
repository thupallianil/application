import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { Info, Moon, Bell, Wrench, Save } from "lucide-react";
import api from '../../services/api';

const API_ENDPOINT = '/settings/extras/';

export default function Extras() {
  const [extra, setExtra] = useState({
    darkMode: false,
    notifications: true,
    maintenance: false,
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
      setExtra(prev => ({ ...prev, ...fetched }));

      applyDarkMode(res.data.darkMode);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyDarkMode = (isDark) => {
    // Dynamic Dark Mode Injection
    const existingStyle = document.getElementById('dark-mode-styles');
    if (isDark) {
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'dark-mode-styles';
        style.innerHTML = `
          body, .bg-\\[\\#f0f0f1\\] {
            background-color: #1a1a1a !important;
            color: #f1f1f1 !important;
          }
          .bg-white {
            background-color: #242424 !important;
            border-color: #333 !important;
            color: #eee !important;
          }
          .text-gray-800, .text-\\[\\#1d2327\\], .text-gray-700 {
            color: #f1f1f1 !important;
          }
          .bg-gray-50, .bg-\\[\\#f6f7f7\\] {
            background-color: #2a2a2a !important;
          }
          .border-gray-100, .border-gray-200, .border-\\[\\#c3c4c7\\] {
            border-color: #444 !important;
          }
          label, p, span, h1, h2, h3, h4, h5, h6 {
            color: #ddd !important;
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(API_ENDPOINT, extra);
      toast.success("Extra settings saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save extra settings!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setExtra(prev => ({ ...prev, [name]: checked }));

    if (name === 'darkMode') {
      applyDarkMode(checked);
    }

    if (name === 'maintenance') {
      if (checked) {
        toast.warning("Maintenance mode enabled. App is now restricted to admins only.");
      } else {
        toast.info("Maintenance mode disabled.");
      }
    }

    if (name === 'notifications') {
      if (checked) {
        toast.success("Email Notifications Enabled.");
      } else {
        toast.info("Email Notifications Disabled.");
      }
    }
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading settings...</div>;

  const features = [
    {
      icon: Moon,
      iconColor: "text-indigo-500",
      bgColor: "bg-gray-50/50",
      name: "darkMode",
      label: "Dark Mode",
      description: "Switch the app interface to a dark color scheme.",
      checked: extra.darkMode,
      toggleColor: "peer-checked:bg-blue-600",
    },
    {
      icon: Bell,
      iconColor: "text-yellow-500",
      bgColor: "bg-white",
      name: "notifications",
      label: "Email Notifications",
      description: "Receive email alerts for invoice views, payments, and activity.",
      checked: extra.notifications,
      toggleColor: "peer-checked:bg-blue-600",
    },
    {
      icon: Wrench,
      iconColor: "text-red-500",
      bgColor: "bg-gray-50/50",
      name: "maintenance",
      label: "Maintenance Mode",
      description: "Put the application into maintenance mode. Users will see an \"Under Maintenance\" page.",
      checked: extra.maintenance,
      toggleColor: "peer-checked:bg-red-500",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">Extras Settings</h2>

      <div className="flex items-start gap-2 mt-3 mb-6 bg-blue-50 border border-blue-200 rounded p-3 text-[13px] text-blue-700">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>Toggle extra application-wide features and modes.</span>
      </div>

      <form onSubmit={handleSave}>
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={feature.name} className={`flex items-center justify-between p-5 ${feature.bgColor} ${idx < features.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center gap-3">
                  <Icon className={feature.iconColor} size={18} />
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{feature.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
                  <input type="checkbox" name={feature.name} checked={feature.checked} onChange={handleChange} className="sr-only peer" />
                  <div className={`w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer ${feature.toggleColor} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white`}></div>
                </label>
              </div>
            );
          })}
        </div>

        <div className="flex justify-start pt-2 pb-2">
          <button type="submit" disabled={isSaving} className="bg-[#2271b1] hover:bg-[#135e96] text-white px-5 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
            <Save size={16} />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}