import { useState, useEffect } from "react";
import axios from "axios";

export default function Translate() {

  const [language, setLanguage] = useState("English");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(language);
    alert("Language settings saved locally.");
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Translate
      </h1>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border rounded-lg p-3 w-full"
      >
        <option>English</option>
        <option>Telugu</option>
        <option>Hindi</option>
        <option>Tamil</option>
      </select>

      <button className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg">
        Save Language
      </button>

    </div>
  );
}