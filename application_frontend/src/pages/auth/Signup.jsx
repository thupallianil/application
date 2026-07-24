import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password2: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.first_name || !form.email || !form.password || !form.password2) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (form.password !== form.password2) {
            toast.error("Passwords do not match.");
            return;
        }

        if (form.password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/auth/register/", form);
            if (res.data?.token) {
                localStorage.setItem("auth_token", res.data.token);
                localStorage.setItem("user_email", res.data.user?.email || form.email);
                localStorage.setItem(
                    "user_name",
                    `${res.data.user?.first_name || ""} ${res.data.user?.last_name || ""}`.trim() ||
                    form.email.split("@")[0]
                );
            }
            toast.success("Account created! Welcome.");
            navigate("/dashboard");
        } catch (err) {
            const data = err?.response?.data;
            if (data) {
                // Show first backend validation error
                const firstError = Object.values(data)[0];
                toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                toast.error("Registration failed. Is the backend running?");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">

                <h1 className="text-3xl font-bold text-center text-blue-600">
                    Invoice Management
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Create your account
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">

                    {/* Name Row */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block mb-1 font-medium text-sm">First Name *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={16} />
                                <input
                                    id="signup-first-name"
                                    type="text"
                                    name="first_name"
                                    placeholder="First name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg py-2.5 pl-9 pr-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 font-medium text-sm">Last Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={16} />
                                <input
                                    id="signup-last-name"
                                    type="text"
                                    name="last_name"
                                    placeholder="Last name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg py-2.5 pl-9 pr-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 font-medium text-sm">Email *</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                id="signup-email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full border rounded-lg py-2.5 pl-9 pr-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 font-medium text-sm">Password *</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Min 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full border rounded-lg py-2.5 pl-9 pr-10 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block mb-1 font-medium text-sm">Confirm Password *</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                id="signup-password2"
                                type={showPassword2 ? "text" : "password"}
                                name="password2"
                                placeholder="Repeat your password"
                                value={form.password2}
                                onChange={handleChange}
                                className="w-full border rounded-lg py-2.5 pl-9 pr-10 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword2(!showPassword2)}
                                className="absolute right-3 top-3"
                            >
                                {showPassword2 ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        id="signup-submit"
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors mt-2"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className="text-sm text-center text-gray-500 mt-2">
                        Already have an account?{" "}
                        <Link to="/" className="text-blue-600 font-medium hover:underline">
                            Login here
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Signup;
