import { useState } from "react";

export default function Licenses() {

  const [license, setLicense] = useState({
    company: "",
    purchaseCode: "",
    licenseKey: "",
    expiry: "",
  });

  const handleChange = (e) => {
    setLicense({
      ...license,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(license);
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        License Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          name="company"
          placeholder="Company Name"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="purchaseCode"
          placeholder="Purchase Code"
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="licenseKey"
          placeholder="License Key"
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <input
          type="date"
          name="expiry"
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg md:col-span-2">
          Save License
        </button>

      </form>

    </div>
  );
}