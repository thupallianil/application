import { useState } from "react";

export default function ChangePassword() {

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.newPassword !== password.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log(password);
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Change Password
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-xl"
      >

        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          onChange={handleChange}
          className="border rounded-lg p-3 w-full"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          onChange={handleChange}
          className="border rounded-lg p-3 w-full"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="border rounded-lg p-3 w-full"
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
          Update Password
        </button>

      </form>

    </div>
  );
}