import { useState } from "react";

export default function Emails() {
  const [email, setEmail] = useState({
    mailFrom: "",
    smtpHost: "",
    smtpPort: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setEmail({
      ...email,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Email Settings
      </h1>

      <form className="grid md:grid-cols-2 gap-6">

        <input
          name="mailFrom"
          placeholder="Mail From"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="smtpHost"
          placeholder="SMTP Host"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="smtpPort"
          placeholder="SMTP Port"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="username"
          placeholder="SMTP Username"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="password"
          name="password"
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