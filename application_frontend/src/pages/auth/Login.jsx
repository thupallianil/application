import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      // Try API login first
      const res = await api.post("/auth/login/", { email, password });
      if (res.data && (res.data.token || res.data.access || res.data.success)) {
        // Store token if returned
        if (res.data.token) localStorage.setItem("auth_token", res.data.token);
        if (res.data.access) localStorage.setItem("auth_token", res.data.access);
        toast.success("Login successful!");
        navigate("/dashboard");
        return;
      }
    } catch (err) {
      // If API auth endpoint not found (404) or server offline, fall back to demo login
      const status = err?.response?.status;
      if (status === 404 || status === undefined || !err.response) {
        // Backend offline or no auth endpoint — allow demo login
        if (email === "admin@example.com" && password === "admin123") {
          localStorage.setItem("auth_token", "demo_token");
          toast.success("Logged in (demo mode)!");
          navigate("/dashboard");
          return;
        } else {
          toast.error("Invalid credentials. Use admin@example.com / admin123 for demo.");
          setLoading(false);
          return;
        }
      }
      // 401 Unauthorized = wrong credentials
      if (status === 401 || status === 400) {
        toast.error("Invalid email or password.");
        setLoading(false);
        return;
      }
      toast.error("Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Invoice Management
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Login to your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <div className="relative">

              <Mail
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                id="login-email"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <div className="relative">

              <Lock
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          <div className="flex justify-between text-sm">

            <label className="flex items-center gap-2">

              <input type="checkbox" />

              Remember Me

            </label>

            <Link
              to="/forgot-password"
              className="text-blue-600"
            >
              Forgot Password?
            </Link>

          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-xs text-center text-gray-400 mt-2">
            Demo: admin@example.com / admin123
          </p>

        </form>

      </div>

    </div>
  );
};

export default Login;