import { Outlet, NavLink } from "react-router-dom";

export default function SettingsLayout() {
    const tabs = [
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

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold">Settings</h1>

            {/* Tab Navigation */}
            <div className="flex border-b overflow-x-auto bg-gray-50 border border-gray-200">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.name}
                        to={tab.path}
                        className={({ isActive }) =>
                            `px-4 py-2 text-sm font-medium border-r transition-colors whitespace-nowrap ${isActive
                                ? "bg-white text-blue-600 border-b-2 border-b-blue-600"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        {tab.name}
                    </NavLink>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <Outlet />
            </div>
        </div>
    );
}
