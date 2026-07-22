import { useState } from "react";

export default function Extras() {

  const [extra, setExtra] = useState({
    darkMode: false,
    notifications: true,
    maintenance: false,
  });

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Extra Settings
      </h1>

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

      <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg">
        Save Settings
      </button>

    </div>
  );
}