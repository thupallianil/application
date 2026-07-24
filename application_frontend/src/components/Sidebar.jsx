import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Settings,
  BarChart,
  Monitor,
  LogOut,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const settingsSubMenu = [
  { name: "General", path: "/settings/general" },
  { name: "Business", path: "/settings/business" },
  { name: "Quotes", path: "/settings/quotes" },
  { name: "Invoices", path: "/settings/invoices" },
  { name: "Payments", path: "/settings/payments" },
  { name: "Tax", path: "/settings/tax" },
  { name: "Emails", path: "/settings/emails" },
  { name: "PDF", path: "/settings/pdf" },
  { name: "Translate", path: "/settings/translate" },
  { name: "Extras", path: "/settings/extras" },
  { name: "Licenses", path: "/settings/licenses" },
];

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard", end: true },
  {
    name: "Settings",
    icon: <Settings size={18} />,
    path: "/settings",
    end: false,
    subMenu: settingsSubMenu
  },
  { name: "Clients", icon: <Users size={18} />, path: "/clients", end: false },
  { name: "Quotations", icon: <FileText size={18} />, path: "/quotes", end: false },
  { name: "Invoices", icon: <Receipt size={18} />, path: "/invoices", end: false },
  { name: "Payments", icon: <CreditCard size={18} />, path: "/payments", end: false },
  { name: "Reports", icon: <BarChart size={18} />, path: "/reports", end: false },
  { name: "System", icon: <Monitor size={18} />, path: "/system", end: false },
];

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [businessName, setBusinessName] = useState("ULTRAKEY");

  // Get user role from local storage
  const userRole = localStorage.getItem("user_role") || "client";

  // Filter menu items based on role
  let filteredMenuItems = menuItems;
  if (userRole !== "admin") {
    // client sees limited options
    const allowedClientPaths = ["/dashboard", "/quotes", "/invoices", "/payments"];
    filteredMenuItems = menuItems.filter(item => allowedClientPaths.includes(item.path));

    // rename items for client view
    filteredMenuItems = filteredMenuItems.map(item => {
      if (item.name === "Quotations") return { ...item, name: "My Quotes" };
      if (item.name === "Invoices") return { ...item, name: "My Invoice" };
      return item;
    });

    // Add profile
    filteredMenuItems.push({ name: "Profile", icon: <Users size={18} />, path: "/profile", end: false });
  }

  useEffect(() => {
    // Automatically open the settings dropdown if we are on a settings page
    if (location.pathname.startsWith('/settings')) {
      setSettingsOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchBusinessSettings = async () => {
      try {
        const res = await api.get('/settings/business/');
        if (res.data.businessName) {
          setBusinessName(res.data.businessName);
        }
      } catch (err) {
        console.error("Error fetching business settings for sidebar", err);
      }
    };
    fetchBusinessSettings();
  }, []);

  // Simple heuristic to split business name into primary and secondary parts for logo
  const words = businessName.split(' ');
  const primaryName = words.length > 0 ? words[0] : "Ultrakey";
  const secondaryName = words.length > 1 ? words.slice(1).join(' ').toUpperCase() : "IT SOLUTIONS PVT LTD";
  const initial = primaryName.charAt(0).toUpperCase();

  return (
    <aside className={`min-h-screen bg-[#1d2327] text-white flex flex-col flex-shrink-0 transition-all duration-300 ${isOpen ? 'w-56' : 'w-0 overflow-hidden'}`}>
      <div className="w-56 flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 py-5 flex items-center justify-center border-b border-[#2c3338] bg-[#1d2327]">
          <div className="flex gap-2 items-center text-left hover:text-[#72aee6] cursor-pointer transition-colors max-w-full overflow-hidden">
            <div className="w-10 h-10 border-2 border-[#72aee6] rounded text-[#72aee6] flex items-center justify-center shrink-0">
              <span className="font-bold text-xl">{initial}</span>
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[#f0f0f1] font-bold text-lg leading-none tracking-tight truncate" title={primaryName}>{primaryName}</span>
              <span className="text-[#a7aaad] text-[9px] leading-tight mt-0.5 truncate" title={secondaryName}>{secondaryName}</span>
            </div>
          </div>
        </div>

        {/* Menu Header */}
        <div className="px-4 pt-6 pb-2 text-[#a7aaad] text-xs font-semibold tracking-wider uppercase">
          Navigation
        </div>

        {/* Menu */}
        <nav className="flex-1 w-full overflow-y-auto overflow-x-hidden sidebar-scroll">
          <ul className="flex flex-col w-full">
            {filteredMenuItems.map((item) => {
              const hasSubMenu = !!item.subMenu;
              const isActiveParent = location.pathname.startsWith(item.path);

              return (
                <li key={item.name} className="w-full flex-col">
                  <div className="w-full flex">
                    {hasSubMenu ? (
                      <div
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        className={`flex items-center justify-between px-4 py-2.5 text-[14px] w-full cursor-pointer transition-colors relative ${isActiveParent
                          ? "bg-[#2271b1] text-white font-semibold"
                          : "text-[#f0f0f1] hover:bg-[#2c3338] hover:text-[#72aee6]"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`${isActiveParent ? 'text-white' : 'text-[#a7aaad]'}`}>{item.icon}</span>
                          <span className="whitespace-nowrap">{item.name}</span>
                        </div>
                        <span className="text-[#a7aaad]">
                          {settingsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                      </div>
                    ) : (
                      <NavLink
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2.5 text-[14px] w-full transition-colors relative ${isActive
                            ? "bg-[#2271b1] text-white font-semibold"
                            : "text-[#f0f0f1] hover:bg-[#2c3338] hover:text-[#72aee6]"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span className={`${isActive ? 'text-white' : 'text-[#a7aaad]'}`}>
                              {item.icon}
                            </span>
                            <span className="whitespace-nowrap">{item.name}</span>
                          </>
                        )}
                      </NavLink>
                    )}
                  </div>

                  {/* Render SubMenu */}
                  {hasSubMenu && settingsOpen && (
                    <ul className="bg-[#2c3338] w-full py-1">
                      {item.subMenu.map(subItem => (
                        <li key={subItem.name} className="w-full">
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-10 py-1.5 text-[13px] w-full transition-colors ${isActive
                                ? "text-[#72aee6] font-semibold"
                                : "text-[#c3c4c7] hover:text-[#72aee6]"
                              }`
                            }
                          >
                            <span className="whitespace-nowrap">{subItem.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-[#2c3338] shrink-0 mt-auto shadow-inner">
          <button
            onClick={() => {
              localStorage.removeItem("auth_token");
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-4 py-4 text-[#f0f0f1] hover:bg-[#2c3338] hover:text-[#d63638] transition-colors text-[14px] font-semibold"
          >
            <LogOut size={18} className="text-[#a7aaad] group-hover:text-[#d63638]" />
            <span className="whitespace-nowrap">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}