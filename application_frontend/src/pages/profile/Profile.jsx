import { User, Mail, Phone, Building2, ShieldCheck, KeyRound } from "lucide-react";
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
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        // Try to get client record matching logged-in email/name
        const [businessRes, clientsRes] = await Promise.all([
          api.get("/settings/business/"),
          api.get("/clients/"),
        ]);

        const businessName = businessRes.data?.businessName || "Not configured";
        const storedName = localStorage.getItem("user_name") || "";
        const storedEmail = localStorage.getItem("user_email") || "";

        // Try to match this user to a client record in the DB
        const matchedClient = clientsRes.data?.find((c) => {
          const name = (c.client || "").toLowerCase();
          const email = (c.email || "").toLowerCase();
          return (
            email === storedEmail.toLowerCase() ||
            name === storedName.toLowerCase() ||
            (storedName && name.includes(storedName.split(" ")[0].toLowerCase()))
          );
        });

        setProfile((prev) => ({
          ...prev,
          company: businessName,
          phone: matchedClient?.phone || prev.phone,
          // If backend returned actual client name, prefer it
          name: matchedClient?.client || storedName,
          email: matchedClient?.email || storedEmail,
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
  const roleBg = role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-green-100 text-green-700";

  return (
    <div className="bg-white rounded-xl shadow p-8 max-w-2xl">

      {/* Avatar + Name Header */}
      <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 rounded-full bg-[#2271b1] flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {profile.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1d2327]">{profile.name}</h1>
          <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold ${roleBg}`}>
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="space-y-5">

        <div className="flex gap-4 items-center">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <User className="text-blue-600" size={18} />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Full Name</p>
            <p className="font-semibold text-[#1d2327]">{profile.name}</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Mail className="text-blue-600" size={18} />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Email Address</p>
            <p className="font-semibold text-[#1d2327]">{profile.email || "Not configured"}</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Phone className="text-blue-600" size={18} />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Phone</p>
            <p className={`font-semibold ${profile.phone === "Not configured" ? "text-gray-400 italic" : "text-[#1d2327]"}`}>
              {profile.phone}
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Building2 className="text-blue-600" size={18} />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Company</p>
            <p className="font-semibold text-[#1d2327]">{profile.company}</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <ShieldCheck className="text-blue-600" size={18} />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Role</p>
            <p className="font-semibold text-[#1d2327]">{roleLabel}</p>
          </div>
        </div>

      </div>

      {/* Change Password Link */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={() => navigate("/change-password")}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <KeyRound size={15} />
          Change Password
        </button>
      </div>

    </div>
  );
}