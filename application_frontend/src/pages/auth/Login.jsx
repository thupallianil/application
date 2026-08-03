import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Users, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin"); // UI hint only, NOT used for auth
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
      const res = await api.post("/auth/login/", { email, password });

      if (res.data?.token) {
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("user_email", res.data.user?.email || email);
        const fullName = `${res.data.user?.first_name || ""} ${res.data.user?.last_name || ""}`.trim() || email.split("@")[0];
        localStorage.setItem("user_name", fullName);

        const backendRole = res.data.user?.role || "client";

        // ROLE SELECTION LOGIC:
        // - If backend says admin AND user clicked Admin card → store "admin" → Admin page
        // - If backend says admin AND user clicked Client card → store "client" → Client page
        // - If backend says client → ALWAYS "client" regardless of card clicked (security)
        let sessionRole;
        if (backendRole === "admin") {
          // Admin account: honor the card they clicked
          sessionRole = selectedRole; // "admin" or "client" as chosen on login screen
        } else {
          // Client account: always client, cannot choose admin
          sessionRole = "client";
        }

        localStorage.setItem("user_role", sessionRole);
        toast.success(`Login successful! Welcome as ${sessionRole === "admin" ? "Admin" : "Client"}.`);
        navigate("/dashboard");
      } else {
        toast.error("Login failed. Unexpected response from server.");
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error;

      if (status === 401) {
        toast.error(err.message || msg || "Invalid email or password.");
      } else if (status === 400) {
        toast.error(msg || "Please check your input.");
      } else if (!err.response) {
        toast.error("Cannot reach server. Please make sure the backend is running.");
      } else {
        toast.error(msg || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex justify-center items-center p-6">

      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl w-full max-w-lg p-8 px-10">

        <h1 className="text-2xl font-bold text-center text-slate-900">
          Login to Your Account
        </h1>

        <p className="text-center text-sm text-gray-500 mt-2">
          Select <strong>Admin</strong> or <strong>Client</strong> to choose which dashboard to open
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          <div className="text-center mb-6">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Login As</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Admin Card - visual hint only, actual role comes from backend */}
            <div
              onClick={() => setSelectedRole("admin")}
              className={`relative cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${selectedRole === "admin"
                ? "border-indigo-600 bg-indigo-50/50"
                : "border-gray-100 hover:border-gray-200"
                }`}
            >
              {selectedRole === "admin" && (
                <div className="absolute top-2 right-2 text-indigo-600">
                  <CheckCircle2 size={18} fill="currentColor" className="text-white" />
                </div>
              )}
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-gray-900">Admin</h3>
              <p className="text-[10px] text-center text-gray-500 mt-1 leading-tight">Access admin panel and manage everything</p>
            </div>

            {/* Client Card - visual hint only, actual role comes from backend */}
            <div
              onClick={() => setSelectedRole("client")}
              className={`relative cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${selectedRole === "client"
                ? "border-green-500 bg-green-50/50"
                : "border-gray-100 hover:border-gray-200"
                }`}
            >
              {selectedRole === "client" && (
                <div className="absolute top-2 right-2 text-green-500">
                  <CheckCircle2 size={18} fill="currentColor" className="text-white" />
                </div>
              )}
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                <Users size={24} />
              </div>
              <h3 className="font-bold text-gray-900">Client</h3>
              <p className="text-[10px] text-center text-gray-500 mt-1 leading-tight">Access your account and manage your services</p>
            </div>
          </div>

          <div>

            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Email / Username
            </label>

            <div className="relative">

              <Mail
                className="absolute left-3.5 top-3.5 text-gray-400"
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors flex justify-center items-center gap-2"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-sm text-center text-gray-500 mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Sign up here
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
};

export default Login;