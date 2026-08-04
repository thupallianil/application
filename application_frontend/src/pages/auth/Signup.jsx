import { useState } from "react";
import { Eye, EyeOff, User, Phone, Mail, Lock, Key } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: "",
        mobile: "",
        email: "",
        password: "",
        password2: "",
        role: "client",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!form.full_name || !form.email || !form.password || !form.password2) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (form.password !== form.password2) {
            toast.error("Passwords do not match. Please re-enter both passwords.");
            return;
        }

        if (form.password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        const nameParts = form.full_name.trim().split(" ");
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(" ");

        setLoading(true);
        try {
            const res = await api.post("/auth/register/", {
                first_name,
                last_name,
                email: form.email,
                mobile: form.mobile,
                password: form.password,
                password2: form.password2,
                role: form.role,
            });

            if (res.data && res.data.require_otp) {
                toast.success("OTP sent to your email! Please verify to continue.");
                setShowOtp(true);
            }
        } catch (err) {
            const data = err?.response?.data;
            if (data) {
                const messages = [];
                Object.values(data).forEach(v => {
                    if (Array.isArray(v)) v.forEach(e => messages.push(e));
                    else messages.push(String(v));
                });
                if (messages.length > 0) toast.error(messages[0]);
                else toast.error("Registration failed. Please check your details.");
            } else {
                toast.error("Cannot reach server. Make sure the backend is running.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            toast.error("Please enter the OTP.");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/auth/verify-registration-otp/", {
                email: form.email,
                otp: otp
            });

            if (res.data && res.data.token) {
                localStorage.setItem("auth_token", res.data.token);
                localStorage.setItem("user_email", form.email);
                localStorage.setItem("user_name", form.full_name);
                localStorage.setItem("user_role", res.data.user?.role || form.role);

                toast.success("Account verified! Welcome.");
                navigate("/dashboard");
            }
        } catch (err) {
            const data = err?.response?.data;
            toast.error(data?.error || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            await api.post("/auth/resend-otp/", { email: form.email, purpose: "register" });
            toast.success("OTP resent successfully!");
        } catch (err) {
            toast.error("Failed to resend OTP.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-center text-blue-600">
                    Sign Up
                </h1>
                <p className="text-center text-gray-500 mt-2">
                    {showOtp ? "Verify Your Email" : "Create your account"}
                </p>

                {!showOtp ? (
                    <form onSubmit={handleRegister} className="mt-8 space-y-4">
                        <div>
                            <label className="block mb-2 font-medium">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text" name="full_name" placeholder="Enter your full name"
                                    value={form.full_name} onChange={handleChange}
                                    className="w-full border rounded-lg py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="tel" name="mobile" placeholder="Enter your mobile number"
                                    value={form.mobile} onChange={handleChange}
                                    className="w-full border rounded-lg py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="email" name="email" placeholder="Enter your email"
                                    value={form.email} onChange={handleChange}
                                    className="w-full border rounded-lg py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500" required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Role</label>
                            <select
                                name="role" value={form.role} onChange={handleChange}
                                className="w-full border rounded-lg py-3 px-3 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"} name="password" placeholder="Min 6 characters"
                                    value={form.password} onChange={handleChange}
                                    className="w-full border rounded-lg py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-blue-500" required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type={showPassword2 ? "text" : "password"} name="password2" placeholder="Repeat your password"
                                    value={form.password2} onChange={handleChange}
                                    className="w-full border rounded-lg py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-blue-500" required
                                />
                                <button type="button" onClick={() => setShowPassword2(!showPassword2)} className="absolute right-3 top-3">
                                    {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors mt-4">
                            {loading ? "Creating Account..." : "SIGN UP & GET OTP"}
                        </button>

                        <p className="text-sm text-center text-gray-500 mt-2">
                            Already have an account? <Link to="/" className="text-blue-600 font-medium hover:underline">Login here</Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="mt-8 space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg mb-4 text-blue-800 text-sm">
                            An OTP has been sent to <strong>{form.email}</strong>. Please check your inbox and enter it below to verify your account.
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Enter OTP</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text" placeholder="6-digit OTP" maxLength="6"
                                    value={otp} onChange={(e) => setOtp(e.target.value)}
                                    className="w-full border rounded-lg py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest text-center text-lg" required
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors mt-4">
                            {loading ? "Verifying..." : "VERIFY & LOGIN"}
                        </button>

                        <div className="text-center mt-4">
                            <button type="button" onClick={handleResendOtp} className="text-sm text-blue-600 hover:underline">
                                Didn't receive the OTP? Resend
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Signup;
