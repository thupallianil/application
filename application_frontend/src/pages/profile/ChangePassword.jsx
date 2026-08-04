import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  KeyRound, Eye, EyeOff, ShieldCheck, ArrowLeft,
  Loader2, Mail, CheckCircle2
} from "lucide-react";
import api from "../../services/api";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = enter current password, 2 = enter OTP + new password
  const [otp, setOtp] = useState("");
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const userEmail = localStorage.getItem("user_email") || "your registered email";

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggleShow = (field) => setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  // Step 1: Verify current password + send OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!form.current_password) {
      toast.error("Please enter your current password.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/request-change-password-otp/", {
        current_password: form.current_password,
      });
      toast.success(`OTP sent to ${userEmail}!`);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP. Check your current password.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP + new password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!otp || !form.new_password || !form.confirm_password) {
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
    setLoading(true);
    try {
      await api.post("/auth/change-password/", {
        otp,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      });
      toast.success("Password updated successfully! Please log in again.");
      setTimeout(() => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_role");
        navigate("/");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/auth/request-change-password-otp/", {
        current_password: form.current_password,
      });
      toast.success("OTP resent successfully!");
    } catch {
      toast.error("Failed to resend OTP.");
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
          <p className="text-sm text-gray-500 mt-0.5">OTP verification required — sent to your registered email</p>
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
            <p className="text-blue-100 text-sm">
              {step === 1 ? "Enter your current password to receive an OTP" : `Enter the OTP sent to ${userEmail}`}
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center px-8 pt-6 gap-2">
          {[
            { num: 1, label: "Verify Identity" },
            { num: 2, label: "Set New Password" },
          ].map((s, i, arr) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${step >= s.num ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300 text-gray-400"
                }`}>
                {step > s.num ? <CheckCircle2 size={14} /> : s.num}
              </div>
              <span className={`text-xs font-medium transition-colors ${step >= s.num ? "text-blue-600" : "text-gray-400"}`}>
                {s.label}
              </span>
              {i < arr.length - 1 && (
                <div className={`flex-1 h-px mx-1 ${step > s.num ? "bg-blue-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 — Current Password */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="p-8 space-y-6">
            <PasswordInput label="Current Password" name="current_password" showKey="current" />

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Mail size={18} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-700">
                After verifying your current password, a one-time code will be sent to <span className="font-semibold">{userEmail}</span> to authorize the password change.
              </p>
            </div>

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
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Sending OTP...</> : <><Mail size={18} /> Send OTP to Email</>}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2 — OTP + New Password */}
        {step === 2 && (
          <form onSubmit={handleChangePassword} className="p-8 space-y-6">
            {/* OTP input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">OTP Code</label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full border border-blue-300 rounded-xl py-3 px-4 text-sm font-mono tracking-widest text-center bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-800 placeholder-gray-400"
                required
              />
              <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                <span>OTP expires in 10 minutes</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Resend OTP
                </button>
              </div>
            </div>

            <PasswordInput label="New Password" name="new_password" showKey="new" />
            <PasswordInput label="Confirm New Password" name="confirm_password" showKey="confirm" />

            {/* Password strength */}
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
                      : form.new_password.length < 12 ? "Good" : "Strong"}
                </span>
                {form.confirm_password && (
                  <span className={`ml-auto font-medium ${form.new_password === form.confirm_password ? "text-green-500" : "text-red-400"}`}>
                    {form.new_password === form.confirm_password ? "✓ Passwords match" : "✗ Do not match"}
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Updating...</> : <><KeyRound size={18} /> Update Password</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}