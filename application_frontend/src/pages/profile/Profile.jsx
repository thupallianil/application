import { User, Mail, Phone, Building2, ShieldCheck, KeyRound, ShieldAlert, BadgeCheck, Activity, CalendarSync } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useRole } from "../../utils/useRole";

export default function Profile() {
  const navigate = useNavigate();
  const role = useRole();

  const [profile, setProfile] = useState({
    name: localStorage.getItem("user_name") || "User",
    email: localStorage.getItem("user_email") || "",
    phone: "Not configured",
    company: "Loading...",
    role: localStorage.getItem("user_role") || "client",
    joinDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    avatarColor: "from-blue-500 to-indigo-600"
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const [businessRes, clientsRes] = await Promise.all([
          api.get("/settings/business/"),
          api.get("/clients/"),
        ]);

        const businessName = businessRes.data?.businessName || "Not configured";
        const storedName = localStorage.getItem("user_name") || "";
        const storedEmail = localStorage.getItem("user_email") || "";

        const matchedClient = clientsRes.data?.find((c) => {
          const name = (c.client || "").toLowerCase();
          const email = (c.email || "").toLowerCase();
          return (
            email === storedEmail.toLowerCase() ||
            name === storedName.toLowerCase() ||
            (storedName && name.includes(storedName.split(" ")[0].toLowerCase()))
          );
        });

        // Determine a random color gradient bases on the name character
        const charCode = (matchedClient?.client || storedName || "U").charCodeAt(0);
        const colorGradients = [
          "from-blue-500 to-indigo-600",
          "from-emerald-400 to-teal-500",
          "from-orange-400 to-pink-500",
          "from-purple-500 to-indigo-500",
          "from-rose-400 to-red-500"
        ];
        const avatarColor = colorGradients[charCode % colorGradients.length];

        setProfile((prev) => ({
          ...prev,
          company: businessName,
          phone: matchedClient?.phone || prev.phone,
          name: matchedClient?.client || storedName,
          email: matchedClient?.email || storedEmail,
          joinDate: matchedClient?.created_at ? new Date(matchedClient.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : prev.joinDate,
          avatarColor
        }));
      } catch (err) {
        console.error("Error fetching profile info", err);
        setProfile((prev) => ({ ...prev, company: "Not configured" }));
        toast.error("Could not load some profile information.");
      }
    };

    fetchInfo();
  }, []);

  const roleLabel = role === "admin" ? "Administrator" : "Client";

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">

      {/* Header Banner */}
      <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Gradient Cover */}
        <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Profile Header Content */}
        <div className="px-8 pb-8 relative flex flex-col sm:flex-row sm:items-end gap-6 -mt-16">
          <div className={`w-32 h-32 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-5xl font-bold text-white bg-gradient-to-br ${profile.avatarColor} shrink-0 transform hover:scale-105 transition-transform duration-300 ring-4 ring-gray-50`}>
            {profile.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="flex-1 mt-2 sm:mt-0 sm:mb-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{profile.name}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5">
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                {role === "admin" ? <ShieldCheck size={14} className="text-indigo-600" /> : <User size={14} className="text-green-600" />}
                {roleLabel}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                <CalendarSync size={14} className="text-blue-500" />
                Joined {profile.joinDate}
              </span>
            </div>
          </div>

          <div className="sm:mb-2 flex justify-center w-full sm:w-auto">
            <button
              onClick={() => navigate("/change-password")}
              className="bg-white border shadow-sm border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              <KeyRound size={16} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Information Cards */}
        <div className="lg:col-span-2 space-y-6">

          {/* Main Info Card */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -z-10 group-hover:bg-blue-100 transition-colors duration-500"></div>

            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <User size={20} />
              </div>
              Personal Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
              <div className="space-y-1.5">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <Mail size={14} className="text-gray-400" /> Email Address
                </p>
                <p className="text-base font-medium text-gray-900 bg-gray-50/70 p-3 rounded-xl border border-transparent hover:border-gray-200 transition-colors break-all">
                  {profile.email || <span className="text-gray-400 italic">Not configured</span>}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <Phone size={14} className="text-gray-400" /> Phone Number
                </p>
                <p className="text-base font-medium text-gray-900 bg-gray-50/70 p-3 rounded-xl border border-transparent hover:border-gray-200 transition-colors">
                  {profile.phone === "Not configured" ? <span className="text-gray-400 italic">Not configured</span> : profile.phone}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <Building2 size={14} className="text-gray-400" /> Company
                </p>
                <p className="text-base font-medium text-gray-900 bg-gray-50/70 p-3 rounded-xl border border-transparent hover:border-gray-200 transition-colors">
                  {profile.company}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <BadgeCheck size={14} className="text-gray-400" /> Account Status
                </p>
                <p className="text-base font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl w-max flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  Active Account
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Security & Status */}
        <div className="space-y-6">

          <div className="bg-gradient-to-br from-[#1d2327] to-gray-900 rounded-2xl p-7 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5 backdrop-blur-sm border border-white/10 shadow-inner">
                <ShieldAlert size={24} className="text-blue-300" />
              </div>

              <h3 className="text-xl font-bold mb-2">Account Security</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Keeping your account secure is our top priority. We recommend updating your password regularly to maintain optimal security.
              </p>

              <button
                onClick={() => navigate("/change-password")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transform hover:-translate-y-0.5"
              >
                <KeyRound size={18} />
                Update Security Settings
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Activity size={16} className="text-indigo-500" /> System Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Access Level</span>
                <span className="text-sm font-semibold text-gray-900">{roleLabel}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Authentication</span>
                <span className="text-sm font-semibold text-gray-900">Token Base</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Last Login</span>
                <span className="text-sm font-semibold text-gray-900">Just now</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}