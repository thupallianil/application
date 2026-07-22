import { Bell, Search, UserCircle } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">

        {/* Left */}
        <div>
          <h1 className="text-2xl font-bold text-blue-600">
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

          <button className="relative">

            <Bell
              size={24}
              className="text-gray-600 hover:text-blue-600 cursor-pointer"
            />

            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              3
            </span>

          </button>

          {/* User */}

          <div className="flex items-center gap-3 cursor-pointer">

            <UserCircle
              size={40}
              className="text-blue-600"
            />

            <div>

              <h3 className="font-semibold">
                Admin
              </h3>

              <p className="text-sm text-gray-500">
                admin@example.com
              </p>

            </div>

          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;