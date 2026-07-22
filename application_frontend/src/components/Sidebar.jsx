import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Settings,
  User,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/dashboard",
  },
  {
    name: "Clients",
    icon: <Users size={20} />,
    path: "/clients",
  },
  {
    name: "Quotations",
    icon: <FileText size={20} />,
    path: "/quotations",
  },
  {
    name: "Invoices",
    icon: <Receipt size={20} />,
    path: "/invoices",
  },
  {
    name: "Payments",
    icon: <CreditCard size={20} />,
    path: "/payments",
  },
  {
    name: "Settings",
    icon: <Settings size={20} />,
    path: "/settings",
  },
  {
    name: "Profile",
    icon: <User size={20} />,
    path: "/profile",
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white shadow-xl">

      {/* Logo */}

      <div className="p-6 border-b border-slate-700">

        <h1 className="text-2xl font-bold text-blue-400">
          Invoice App
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Admin Panel
        </p>

      </div>

      {/* Menu */}

      <div className="py-5">

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 mx-3 rounded-lg transition-all duration-200
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-gray-300"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}

      </div>

      {/* Logout */}

      <div className="absolute bottom-5 w-64 px-4">

        <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-lg transition">

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;