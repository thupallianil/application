import { useState } from "react";

export default function EditClient() {

  const [client, setClient] = useState({
    name: "John",
    email: "john@gmail.com",
    phone: "9876543210",
    company: "ABC Pvt Ltd",
    address: "Hyderabad",
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
        Edit Client
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          name="name"
          value={client.name}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="email"
          value={client.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="phone"
          value={client.phone}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="company"
          value={client.company}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <textarea
          rows="4"
          name="address"
          value={client.address}
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg md:col-span-2">
          Update Client
        </button>

      </form>

    </div>
  );
}