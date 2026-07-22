import { useState } from "react";

export default function AddClient() {

  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });

  const handleChange = (e) => {
    setClient({
      ...client,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(client);
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Add Client
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          name="name"
          placeholder="Client Name"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="company"
          placeholder="Company"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <textarea
          rows="4"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-blue-600 text-white py-3 rounded-lg md:col-span-2">
          Save Client
        </button>

      </form>

    </div>
  );
}