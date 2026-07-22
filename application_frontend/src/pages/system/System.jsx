import React from 'react';
import { Monitor, Server, Database, Shield, RefreshCw, HardDrive, Clock, Activity } from 'lucide-react';

export default function System() {
  return (
    <div className="p-4 md:p-6 bg-[#f0f0f1] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Monitor className="text-[#2c3338]" size={24} />
          <h1 className="text-2xl font-normal text-[#2c3338]">System Status</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Information Card */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm">
            <div className="border-b border-[#c3c4c7] px-4 py-3 bg-[#f6f7f7]">
              <h2 className="text-[14px] font-semibold text-[#2c3338] flex items-center gap-2">
                <Server size={18} className="text-[#135e96]" /> Environment Info
              </h2>
            </div>
            <div className="p-4">
              <table className="w-full text-[13px] text-[#2c3338]">
                <tbody>
                  <tr className="border-b border-[#f0f0f1]">
                    <td className="py-3 font-semibold w-1/3">Application Version</td>
                    <td className="py-3">1.0.4 (Latest)</td>
                  </tr>
                  <tr className="border-b border-[#f0f0f1]">
                    <td className="py-3 font-semibold">Environment</td>
                    <td className="py-3">Production</td>
                  </tr>
                  <tr className="border-b border-[#f0f0f1]">
                    <td className="py-3 font-semibold">OS</td>
                    <td className="py-3">Linux / Ubuntu 22.04 LTS</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Server timezone</td>
                    <td className="py-3">UTC</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Info Card */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm">
            <div className="border-b border-[#c3c4c7] px-4 py-3 bg-[#f6f7f7]">
              <h2 className="text-[14px] font-semibold text-[#2c3338] flex items-center gap-2">
                <Database size={18} className="text-[#135e96]" /> Database Status
              </h2>
            </div>
            <div className="p-4">
              <table className="w-full text-[13px] text-[#2c3338]">
                <tbody>
                  <tr className="border-b border-[#f0f0f1]">
                    <td className="py-3 font-semibold w-1/3">Connection Status</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Connected
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-[#f0f0f1]">
                    <td className="py-3 font-semibold">Database Engine</td>
                    <td className="py-3">SQLite 3.39.2</td>
                  </tr>
                  <tr className="border-b border-[#f0f0f1]">
                    <td className="py-3 font-semibold">Database Size</td>
                    <td className="py-3">14.2 MB</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Last Backup</td>
                    <td className="py-3">Today, 03:00 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm">
            <div className="border-b border-[#c3c4c7] px-4 py-3 bg-[#f6f7f7]">
              <h2 className="text-[14px] font-semibold text-[#2c3338] flex items-center gap-2">
                <Activity size={18} className="text-[#135e96]" /> System Health
              </h2>
            </div>
            <div className="p-4">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <h3 className="text-[13px] font-semibold text-[#2c3338]">Security Headers</h3>
                    <p className="text-[12px] text-[#646970]">Active and properly configured.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <RefreshCw size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <h3 className="text-[13px] font-semibold text-[#2c3338]">Background Tasks</h3>
                    <p className="text-[12px] text-[#646970]">Cron jobs are running smoothly.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <HardDrive size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <h3 className="text-[13px] font-semibold text-[#2c3338]">File Permissions</h3>
                    <p className="text-[12px] text-[#646970]">All critical directories are writable.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm">
            <div className="border-b border-[#c3c4c7] px-4 py-3 bg-[#f6f7f7]">
              <h2 className="text-[14px] font-semibold text-[#2c3338] flex items-center gap-2">
                <Clock size={18} className="text-[#135e96]" /> Quick Actions
              </h2>
            </div>
            <div className="p-4">
              <p className="text-[13px] text-[#646970] mb-4">
                Use these tools to perform routine maintenance on your system.
              </p>
              <div className="flex flex-col gap-3">
                <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-[#2271b1] text-[#2271b1] bg-[#f0f6fc] hover:bg-[#2271b1] hover:text-white transition-colors text-[13px] font-semibold rounded-sm">
                  <RefreshCw size={14} /> Clear Application Cache
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-[#c3c4c7] text-[#2c3338] bg-white hover:bg-[#f0f0f1] transition-colors text-[13px] font-semibold rounded-sm">
                  <Database size={14} /> Optimize Database
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
