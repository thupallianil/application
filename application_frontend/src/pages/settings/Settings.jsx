import { NavLink, Outlet } from "react-router-dom";

const tabs = [
    { name: "General", path: "general" },
    { name: "Business", path: "business" },
    { name: "Quotes", path: "quotes" },
    { name: "Invoices", path: "invoices" },
    { name: "Payments", path: "payments" },
    { name: "Tax", path: "tax" },
    { name: "Emails", path: "emails" },
    { name: "PDF", path: "pdf" },
    { name: "Translate", path: "translate" },
    { name: "Extras", path: "extras" },
    { name: "Licenses", path: "licenses" },
];

export default function Settings() {
    return (
        <div className="p-4 md:p-6 bg-[#f0f0f1] min-h-screen">
            <div className="max-w-6xl">
                {/* Tabs Bar */}
                <div className="flex flex-wrap gap-1 mb-0 pt-2 px-1">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.path}
                            to={tab.path}
                            className={({ isActive }) =>
                                `px-3 py-1.5 text-sm font-semibold border transition-colors ${isActive
                                    ? "bg-white border-[#c3c4c7] border-b-transparent text-[#2c3338] relative z-10 bottom-[-1px]"
                                    : "bg-[#e5e5e5] border-[#c3c4c7] text-[#2271b1] hover:bg-[#f3f5f6] hover:text-[#0a4b78]"
                                }`
                            }
                        >
                            {tab.name}
                        </NavLink>
                    ))}
                </div>

                {/* Content Box */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm flex-1 p-6 lg:p-8 relative z-0">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}