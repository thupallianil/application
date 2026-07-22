import { Bell, Search, UserCircle, Menu, LogOut, User as UserIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const profileRef = useRef(null);
  const notifyRef = useRef(null);

  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setNotifyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Basic logout logic: navigate to login page
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">

        {/* Left */}
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-blue-600 focus:outline-none">
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-blue-600 hidden sm:block">
            Invoice Management
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">

          {/* Search */}
          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-72"
            />
          </div>

          {/* Notification */}
          <div className="relative" ref={notifyRef}>
            <button
              onClick={() => setNotifyOpen(!notifyOpen)}
              className="relative p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <Bell
                size={24}
                className="text-gray-600 hover:text-blue-600 cursor-pointer"
              />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                3
              </span>
            </button>

            {/* Notification Dropdown */}
            {notifyOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700">Notifications</h3>
                  <span className="text-xs text-blue-600 cursor-pointer hover:underline">Mark all as read</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-gray-800">New Invoice Created</p>
                    <p className="text-xs text-gray-500 mt-1">Invoice #INV-2023-001 has been generated.</p>
                    <p className="text-[10px] text-gray-400 mt-1">2 mins ago</p>
                  </div>
                  <div className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-gray-800">Payment Received</p>
                    <p className="text-xs text-gray-500 mt-1">Client John Doe paid $500.00.</p>
                    <p className="text-[10px] text-gray-400 mt-1">1 hour ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-gray-800">System Update</p>
                    <p className="text-xs text-gray-500 mt-1">Your system has been updated to v1.0.4.</p>
                    <p className="text-[10px] text-gray-400 mt-1">1 day ago</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <span className="text-sm text-blue-600 hover:underline cursor-pointer">View all notifications</span>
                </div>
              </div>
            )}
          </div>

          {/* User */}
          <div className="relative" ref={profileRef}>
            <div
              className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <UserCircle
                size={38}
                className="text-blue-600"
              />
              <div className="hidden md:block">
                <h3 className="font-semibold text-gray-800 leading-tight">
                  Admin User
                </h3>
                <p className="text-xs text-gray-500">
                  admin@example.com
                </p>
              </div>
            </div>

            {/* User Dropdown Profile Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                  <p className="text-sm font-semibold text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@example.com</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <UserIcon size={16} />
                  My Profile
                </Link>

                <div className="border-t border-gray-100 mt-1 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;