import { useState } from "react";

export default function Business() {
  const [business, setBusiness] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    website: "",
    gst: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(business);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow">

      <h1 className="text-3xl font-bold mb-8">
        Business Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="ownerName"
          placeholder="Owner Name"
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
          placeholder="Phone Number"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="website"
          placeholder="Website"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="gst"
          placeholder="GST Number"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="state"
          placeholder="State"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="country"
          placeholder="Country"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <textarea
          name="address"
          placeholder="Business Address"
          rows="4"
          onChange={handleChange}
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button className="bg-blue-600 text-white py-3 rounded-lg md:col-span-2 hover:bg-blue-700">
          Save Business Details
        </button>

      </form>

    </div>
  );
}