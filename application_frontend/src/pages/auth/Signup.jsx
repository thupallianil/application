import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
            toast.error("Passwords do not match.");
            return;
        }

        if (form.password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        const [first_name, ...rest] = form.full_name.trim().split(" ");
        const last_name = rest.join(" ");

        setLoading(true);
        try {
            const res = await api.post("/auth/register/", {
                first_name,
                last_name,
                email: form.email,
                password: form.password,
                password2: form.password2,
            });

            if (res.data?.token) {
                localStorage.setItem("auth_token", res.data.token);
                localStorage.setItem("user_email", res.data.user?.email || form.email);
                localStorage.setItem("user_name", form.full_name);
            }
            toast.success("Account created! Welcome.");
            navigate("/dashboard");
        } catch (err) {
            const data = err?.response?.data;
            if (data) {
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
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Sign up</h2>

                <form onSubmit={handleSubmit} style={styles.form}>

                    {/* Full Name */}
                    <div style={styles.inputWrapper}>
                        <span style={styles.icon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </span>
                        <input
                            id="signup-full-name"
                            type="text"
                            name="full_name"
                            placeholder="Full Name"
                            value={form.full_name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Mobile Number */}
                    <div style={styles.inputWrapper}>
                        <span style={styles.icon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                        </span>
                        <input
                            id="signup-mobile"
                            type="tel"
                            name="mobile"
                            placeholder="Mobile Number"
                            value={form.mobile}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    {/* Email */}
                    <div style={styles.inputWrapper}>
                        <span style={styles.icon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                        </span>
                        <input
                            id="signup-email"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div style={styles.inputWrapper}>
                        <span style={styles.icon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </span>
                        <input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                            {showPassword
                                ? <EyeOff size={15} color="#aaa" />
                                : <Eye size={15} color="#aaa" />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div style={styles.inputWrapper}>
                        <span style={styles.icon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </span>
                        <input
                            id="signup-password2"
                            type={showPassword2 ? "text" : "password"}
                            name="password2"
                            placeholder="Password"
                            value={form.password2}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        <button type="button" onClick={() => setShowPassword2(!showPassword2)} style={styles.eyeBtn}>
                            {showPassword2
                                ? <EyeOff size={15} color="#aaa" />
                                : <Eye size={15} color="#aaa" />}
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        id="signup-submit"
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitBtn,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "SIGNING UP..." : "SIGN UP"}
                    </button>

                    <p style={styles.loginLink}>
                        Already have an account?{" "}
                        <Link to="/" style={styles.link}>Login</Link>
                    </p>

                </form>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
        padding: "24px",
    },
    card: {
        background: "#fff",
        borderRadius: "16px",
        padding: "36px 32px",
        width: "100%",
        maxWidth: "360px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    },
    title: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#1a1a2e",
        marginBottom: "24px",
        textAlign: "left",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    inputWrapper: {
        display: "flex",
        alignItems: "center",
        background: "#f5f6fa",
        border: "1.5px solid #e8e8e8",
        borderRadius: "8px",
        padding: "0 12px",
        height: "46px",
        position: "relative",
    },
    icon: {
        display: "flex",
        alignItems: "center",
        marginRight: "10px",
        flexShrink: 0,
    },
    input: {
        flex: 1,
        border: "none",
        background: "transparent",
        outline: "none",
        fontSize: "14px",
        color: "#333",
        height: "100%",
    },
    eyeBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding: "0",
        marginLeft: "6px",
        flexShrink: 0,
    },
    submitBtn: {
        marginTop: "6px",
        background: "#3b5bdb",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        height: "46px",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "1px",
        cursor: "pointer",
        transition: "background 0.2s",
    },
    loginLink: {
        textAlign: "center",
        fontSize: "13px",
        color: "#888",
        marginTop: "4px",
    },
    link: {
        color: "#3b5bdb",
        fontWeight: "600",
        textDecoration: "none",
    },
};

export default Signup;
