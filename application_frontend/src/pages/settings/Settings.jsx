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
                <div className="flex flex-wrap gap-0 mb-0 pt-2 px-0">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.path}
                            to={tab.path}
                            className={({ isActive }) =>
                                `px-3.5 py-2 text-[13px] font-medium border border-b-0 transition-colors rounded-t-sm ${isActive
                                    ? "bg-white border-[#c3c4c7] text-[#2c3338] relative z-10 shadow-[0_1px_0_white]"
                                    : "bg-[#dcdcde] border-[#c3c4c7] text-[#2271b1] hover:bg-[#f0f0f1] hover:text-[#0a4b78] -mb-px"
                                }`
                            }
                        >
                            {tab.name}
                        </NavLink>
                    ))}
                </div>

                {/* Content Box */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm p-6 lg:p-8 relative z-0 -mt-px">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}