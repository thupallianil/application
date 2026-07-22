import { useState } from "react";

export default function General() {

  const [formData, setFormData] = useState({
    appName: "Invoice Management",
    companyName: "Ultrakey IT Solutions",
    timezone: "Asia/Kolkata",
    currency: "INR",
    language: "English",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        General Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <div>

          <label className="block mb-2 font-medium">
            Application Name
          </label>

          <input
            name="appName"
            value={formData.appName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Company Name
          </label>

          <input
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Time Zone
          </label>

          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option>Asia/Kolkata</option>
            <option>UTC</option>
            <option>America/New_York</option>
          </select>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Currency
          </label>

          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option>INR</option>
            <option>USD</option>
            <option>EUR</option>
          </select>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Language
          </label>

          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Telugu</option>
          </select>

        </div>

        <div className="md:col-span-2">

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
          >
            Save Settings
          </button>

        </div>

      </form>

    </div>
  );
}