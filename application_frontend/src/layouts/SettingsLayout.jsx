import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { useEffect } from "react";

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

export default function SettingsLayout() {
    return (
        <div className="p-4 md:p-6 bg-[#f0f0f1] min-h-screen">
            <div className="max-w-[1200px]">

                {/* Page Header */}
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-[23px] font-normal text-[#1d2327] leading-tight">
                        Settings
                    </h1>
                </div>

                {/* Tab Bar — WordPress style */}
                <div className="flex flex-wrap gap-0 pt-3">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.path}
                            to={tab.path}
                            className={({ isActive }) =>
                                "px-[13px] py-[8px] text-[13px] font-medium border border-b-0 transition-colors rounded-t-sm select-none " +
                                (isActive
                                    ? "bg-white border-[#c3c4c7] text-[#2c3338] relative z-10 shadow-[0_1px_0_#fff] cursor-default"
                                    : "bg-[#dcdcde] border-[#c3c4c7] text-[#2271b1] hover:bg-[#f0f0f1] hover:text-[#0a4b78] -mb-px cursor-pointer")
                            }
                        >
                            {tab.name}
                        </NavLink>
                    ))}
                </div>

                {/* Content Panel */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm p-6 lg:p-8 relative z-0">
                    <Outlet />
                </div>

            </div>
        </div>
    );
}
