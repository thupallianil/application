import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function AddClient() {

  const navigate = useNavigate();

  const [userType, setUserType] = useState("existing");

  const [formData, setFormData] = useState({
    existingUser: "",

    client: "",
    email: "",
    username: "",
    password: "",
    phone: "",

    address: "",
    extraInfo: "",

    firstName: "",
    lastName: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      await api.post("/clients/", formData);

      toast.success("Client Added Successfully");

      navigate("/clients");

    } catch (err) {

      toast.error("Unable to Add Client");

    }

    setLoading(false);
  };

  return (

<div className="min-h-screen bg-gray-100 py-10">

<div className="max-w-5xl mx-auto">

<div className="bg-white rounded-lg shadow border">

<div className="border-b px-8 py-5">

<h1 className="text-2xl font-bold">
Add New Client
</h1>

<p className="text-gray-500 text-sm mt-2">
To create a new client, choose either an existing user
or create a new user.
</p>

</div>

<form onSubmit={handleSubmit}>

<div className="px-8 py-6">

<p className="font-medium mb-3">
Add new client from:
</p>

<div className="space-y-3 mb-8">

<label className="flex items-center gap-2 cursor-pointer">

<input
type="radio"
value="existing"
checked={userType==="existing"}
onChange={()=>setUserType("existing")}
/>

Existing User

</label>

<label className="flex items-center gap-2 cursor-pointer">

<input
type="radio"
value="new"
checked={userType==="new"}
onChange={()=>setUserType("new")}
/>

Create New User

</label>

</div>

{/* EXISTING USER */}

{userType==="existing" && (

<div className="space-y-5">

<div>

<label className="block mb-2 font-semibold">
Select Existing User *
</label>

<select
name="existingUser"
value={formData.existingUser}
onChange={handleChange}
className="w-full border rounded-md px-3 py-2"
>

<option value="">
Choose Client
</option>

<option value="1">
Client One
</option>

<option value="2">
Client Two
</option>

<option value="3">
Client Three
</option>

</select>

</div>

<div>

<label className="block mb-2 font-semibold">
Business / Client Name *
</label>

<input
type="text"
name="client"
value={formData.client}
onChange={handleChange}
className="w-full border rounded-md px-3 py-2"
/>

</div>

<div>

<label className="block mb-2 font-semibold">
Address
</label>

<textarea
rows="3"
name="address"
value={formData.address}
onChange={handleChange}
className="w-full border rounded-md px-3 py-2"
/>

</div>

<div>

<label className="block mb-2 font-semibold">
Extra Info
</label>

<textarea
rows="3"
name="extraInfo"
value={formData.extraInfo}
onChange={handleChange}
className="w-full border rounded-md px-3 py-2"
/>

</div>

</div>

)}

{/* CREATE NEW USER */}

{userType==="new" && (

<div className="grid md:grid-cols-2 gap-5">

<div>

<label className="block mb-2 font-semibold">
Business / Client Name *
</label>

<input
type="text"
name="client"
value={formData.client}
onChange={handleChange}
className="w-full border rounded-md px-3 py-2"
/>

</div>

<div>

<label className="block mb-2 font-semibold">
Email *
</label>

<input
type="email"
name="email"
value={formData.email}
onChange={handleChange}
className="w-full border rounded-md px-3 py-2"
/>

</div>

<div>

<label className="block mb-2 font-semibold">
Username *
</label>

<input
type="text"
name="username"
value={formData.username}
onChange={handleChange}
className="w-full border rounded-md px-3 py-2"
/>

</div>

<div>

<label className="block mb-2 font-semibold">
Password *
</label>

<input
type="password"
name="password"
value={formData.password}
onChange={handleChange}
className="w-full border rounded-md px-3 py-2"
/>

</div>
<div>
  <label className="block mb-2 font-semibold">
    Phone *
  </label>

  <input
    type="text"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    className="w-full border rounded-md px-3 py-2"
  />
</div>

<div className="md:col-span-2">
  <label className="block mb-2 font-semibold">
    Address
  </label>

  <textarea
    rows="3"
    name="address"
    value={formData.address}
    onChange={handleChange}
    className="w-full border rounded-md px-3 py-2"
  />
</div>

<div className="md:col-span-2">
  <label className="block mb-2 font-semibold">
    Extra Info
  </label>

  <textarea
    rows="3"
    name="extraInfo"
    value={formData.extraInfo}
    onChange={handleChange}
    className="w-full border rounded-md px-3 py-2"
  />
</div>

<div>
  <label className="block mb-2 font-semibold">
    First Name
  </label>

  <input
    type="text"
    name="firstName"
    value={formData.firstName}
    onChange={handleChange}
    className="w-full border rounded-md px-3 py-2"
  />
</div>

<div>
  <label className="block mb-2 font-semibold">
    Last Name
  </label>

  <input
    type="text"
    name="lastName"
    value={formData.lastName}
    onChange={handleChange}
    className="w-full border rounded-md px-3 py-2"
  />
</div>

<div className="md:col-span-2">
  <label className="block mb-2 font-semibold">
    Website
  </label>

  <input
    type="text"
    name="website"
    value={formData.website}
    onChange={handleChange}
    className="w-full border rounded-md px-3 py-2"
  />
</div>

</div>
)}

<div className="mt-8">
  <button
    type="submit"
    disabled={loading}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
  >
    {loading ? "Saving..." : "Add New Client"}
  </button>
</div>

</div>

</form>

</div>

</div>

</div>

);

}