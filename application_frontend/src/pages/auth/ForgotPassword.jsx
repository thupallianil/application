import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Eye, EyeOff, KeyRound, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import api from "../../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = enter email, 2 = set new password
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    email: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!form.email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password/", { email: form.email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send OTP. Account may not exist.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP and new password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !form.new_password || !form.confirm_password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (form.new_password !== form.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.new_password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password-otp/", {
        email: form.email,
        otp: otp,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      });
      toast.success("Password reset successfully! Please log in with your new password.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/auth/resend-otp/", { email: form.email, purpose: "reset_password" });
      toast.success("OTP resent successfully!");
    } catch (err) {
      toast.error("Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex justify-center items-center p-6">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl w-full max-w-md p-8">

        {/* Logo / Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <ShieldCheck size={32} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-1">
          {step === 1 ? "Forgot Password?" : "Set New Password"}
        </h1>
        <p className="text-center text-blue-200/70 text-sm mb-8">
          {step === 1
            ? "Enter your registered email address to receive an OTP."
            : `Resetting password for: ${form.email}`}
        </p>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${step >= s
                ? "bg-blue-500 border-blue-500 text-white"
                : "border-white/20 text-white/30"
                }`}>
                {s}
              </div>
              <span className={`text-xs transition-colors ${step >= s ? "text-blue-300" : "text-white/30"}`}>
                {s === 1 ? "Verify Email" : "Reset Password"}
              </span>
              {s < 2 && <div className={`flex-1 h-px ${step > s ? "bg-blue-500" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1 — Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-100">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/60" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your registered email"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : "Get OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 — OTP & New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-100">Enter OTP</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/60" size={18} />
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl py-3 pl-11 pr-4 text-sm tracking-widest text-center font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-100">New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/60" size={18} />
                <input
                  type={showNew ? "text" : "password"}
                  name="new_password"
                  value={form.new_password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl py-3 pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-100">Confirm New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/60" size={18} />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl py-3 pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Match indicator */}
            {form.new_password && form.confirm_password && (
              <p className={`text-xs font-medium ${form.new_password === form.confirm_password ? "text-green-400" : "text-red-400"}`}>
                {form.new_password === form.confirm_password ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-white/5 border border-white/10 text-white/80 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Resetting...</> : "Reset Password"}
              </button>
            </div>

            <div className="text-center mt-3">
              <button type="button" onClick={handleResendOtp} className="text-sm text-blue-300 hover:underline">
                Didn't receive the OTP? Resend
              </button>
            </div>
          </form>
        )}

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link to="/" className="text-blue-300/70 hover:text-blue-300 text-sm transition-colors">
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;