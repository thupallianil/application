import { useState } from "react";
import { Eye, EyeOff, User, Phone, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (e) => {
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
                password: form.password,
                password2: form.password2,
                role: form.role,
            });

            if (res.data && res.data.token) {
                localStorage.setItem("auth_token", res.data.token);
                localStorage.setItem("user_email", form.email);
                localStorage.setItem("user_name", form.full_name);
                localStorage.setItem("user_role", res.data.user?.role || form.role);
            }
            toast.success("Account created! Welcome.");
            navigate("/dashboard");
        } catch (err) {
            const data = err?.response?.data;
            if (data) {
                // Collect all error messages from DRF response
                const messages = [];
                Object.entries(data).forEach(([field, errors]) => {
                    if (Array.isArray(errors)) {
                        errors.forEach(e => messages.push(e));
                    } else if (typeof errors === "string") {
                        messages.push(errors);
                    } else if (typeof errors === "object") {
                        // nested object errors
                        Object.values(errors).forEach(v => {
                            if (Array.isArray(v)) v.forEach(e => messages.push(e));
                            else messages.push(String(v));
                        });
                    }
                });
                if (messages.length > 0) {
                    toast.error(messages[0]);
                } else {
                    toast.error("Registration failed. Please check your details.");
                }
            } else {
                toast.error("Cannot reach server. Make sure the backend is running.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">

                <h1 className="text-3xl font-bold text-center text-blue-600">
                    Sign Up
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Create your account
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">

                    {/* Full Name */}
                    <div>
                        <label className="block mb-2 font-medium">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                id="signup-full-name"
                                type="text"
                                name="full_name"
                                placeholder="Enter your full name"
                                value={form.full_name}
                                onChange={handleChange}
                                className="w-full border rounded-lg py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="block mb-2 font-medium">Mobile Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                id="signup-mobile"
                                type="tel"
                                name="mobile"
                                placeholder="Enter your mobile number"
                                value={form.mobile}
                                onChange={handleChange}
                                className="w-full border rounded-lg py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-2 font-medium">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                id="signup-email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full border rounded-lg py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block mb-2 font-medium">Role</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full border rounded-lg py-3 px-3 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="client">Client</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-2 font-medium">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Min 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full border rounded-lg py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block mb-2 font-medium">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                id="signup-password2"
                                type={showPassword2 ? "text" : "password"}
                                name="password2"
                                placeholder="Repeat your password"
                                value={form.password2}
                                onChange={handleChange}
                                className="w-full border rounded-lg py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword2(!showPassword2)}
                                className="absolute right-3 top-3"
                            >
                                {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        id="signup-submit"
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors mt-2"
                    >
                        {loading ? "Creating Account..." : "SIGN UP"}
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
