import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { KeyRound, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import api from "../../services/api";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleShow = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.current_password || !form.new_password || !form.confirm_password) {
      toast.error("All fields are required.");
      return;
    }

    if (form.new_password !== form.confirm_password) {
      toast.error("New passwords do not match.");
      return;
    }

    if (form.new_password.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/change-password/", form);
      toast.success("Password updated successfully! Please log in again.");

      // Clear token and redirect to login (password changed = re-auth required)
      setTimeout(() => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_role");
        navigate("/");
      }, 1500);
    } catch (err) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ label, name, showKey }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={showPasswords[showKey] ? "text" : "password"}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full border border-gray-200 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
          required
        />
        <button
          type="button"
          onClick={() => toggleShow(showKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPasswords[showKey] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update your account password</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Security Settings</h2>
            <p className="text-blue-100 text-sm">Your password must be at least 6 characters</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <PasswordInput label="Current Password" name="current_password" showKey="current" />
          <PasswordInput label="New Password" name="new_password" showKey="new" />
          <PasswordInput label="Confirm New Password" name="confirm_password" showKey="confirm" />

          {/* Strength hint */}
          {form.new_password && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-8 rounded-full transition-colors ${i < Math.min(4, Math.floor(form.new_password.length / 3))
                        ? form.new_password.length < 6 ? "bg-red-400"
                          : form.new_password.length < 9 ? "bg-yellow-400"
                            : "bg-green-400"
                        : "bg-gray-200"
                      }`}
                  />
                ))}
              </div>
              <span className="text-gray-500">
                {form.new_password.length < 6 ? "Too short"
                  : form.new_password.length < 9 ? "Fair"
                    : form.new_password.length < 12 ? "Good"
                      : "Strong"}
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Updating...</>
              ) : (
                <><KeyRound size={18} /> Update Password</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}