import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8001/api/settings/emails/';

export default function Emails() {
  const [email, setEmail] = useState({
    mailFrom: "",
    smtpHost: "",
    smtpPort: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(API_URL);
      const fetched = {};
      for (const key in res.data) {
        if (res.data[key] !== null) fetched[key] = res.data[key];
      }
      setEmail(prev => ({ ...prev, ...fetched }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await axios.put(API_URL, email);
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings!");
    }
  };


  const handleChange = (e) => {
    setEmail({
      ...email,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(e);
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Email Settings
      </h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

        <input
          name="mailFrom"
          value={email.mailFrom}
          placeholder="Mail From"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="smtpHost"
          value={email.smtpHost}
          placeholder="SMTP Host"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="smtpPort"
          value={email.smtpPort}
          placeholder="SMTP Port"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="username"
          value={email.username}
          placeholder="SMTP Username"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="password"
          name="password"
          value={email.password}
          placeholder="SMTP Password"
          onChange={handleChange}
          className="border p-3 rounded-lg md:col-span-2"
        />

        <button className="bg-blue-600 text-white rounded-lg py-3 md:col-span-2">
          Save Email Settings
        </button>

      </form>

    </div>
  );
}