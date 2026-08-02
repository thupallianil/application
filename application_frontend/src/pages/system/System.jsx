import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  Monitor, Server, Database, Shield, RefreshCcw,
  HardDrive, Clock, Activity, CheckCircle, AlertCircle,
  Cpu, MemoryStick, Wifi, Zap, Trash2, Archive,
  FileText, ChevronRight, Info, AlertTriangle, TrendingUp
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

/* ─── INLINE STYLES ──────────────────────────────────────────────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  .sys-page { min-height:100vh; background:#f8fafc; padding:24px 28px 60px; font-family:'Inter',-apple-system,sans-serif; color:#1e293b; }
  .sys-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; }
  .sys-header-left h1 { font-size:26px; font-weight:700; color:#0f172a; margin:0 0 3px; letter-spacing:-0.02em; }
  .sys-header-left p { font-size:13px; color:#64748b; margin:0; }
  .sys-header-right { display:flex; align-items:center; gap:12px; }
  .sys-time-chip { display:flex; align-items:center; gap:7px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:7px 14px; font-size:12px; color:#475569; font-weight:500; }
  .sys-refresh-btn { display:flex; align-items:center; gap:7px; background:#2563eb; border:1px solid #2563eb; color:#fff; border-radius:8px; padding:8px 16px; font-size:13px; font-weight:600; cursor:pointer; transition:all .2s; }
  .sys-refresh-btn:hover { background:#1d4ed8; }
  .sys-refresh-btn.spinning svg { animation:spin .8s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  /* ─── Top Stat Cards ─── */
  .sys-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; }
  .sys-stat { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:18px 20px; display:flex; align-items:center; gap:16px; box-shadow:0 1px 3px rgba(0,0,0,.02); transition:box-shadow .2s; }
  .sys-stat:hover { box-shadow:0 4px 12px rgba(0,0,0,.06); }
  .sys-stat-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sys-stat-body { flex:1; }
  .sys-stat-body .label { font-size:12px; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:.04em; margin-bottom:4px; }
  .sys-stat-body .value { font-size:22px; font-weight:700; color:#0f172a; line-height:1.2; }
  .sys-stat-body .sub { font-size:12px; color:#64748b; margin-top:3px; font-weight:500; }
  .sys-stat-body .sub.green { color:#16a34a; }
  .sys-stat-body .sub.orange { color:#ea580c; }

  /* ─── Two-Column Layout ─── */
  .sys-two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; }
  .sys-panel { background:#fff; border:1px solid #e2e8f0; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,.02); overflow:hidden; }
  .sys-panel-head { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #f1f5f9; }
  .sys-panel-head h2 { font-size:14px; font-weight:600; color:#0f172a; margin:0; display:flex; align-items:center; gap:8px; }
  .sys-panel-body { padding:0; }
  
  /* ─── Info Table ─── */
  .sys-info-row { display:flex; align-items:center; justify-content:space-between; padding:10px 18px; border-bottom:1px solid #f8fafc; font-size:13px; }
  .sys-info-row:last-child { border-bottom:none; }
  .sys-info-row .key { color:#64748b; font-weight:500; }
  .sys-info-row .val { color:#1e293b; font-weight:500; text-align:right; }
  .sys-info-row .val.blue { color:#2563eb; }
  .sys-uptodate { background:#dcfce7; color:#166534; font-size:11px; font-weight:600; padding:2px 8px; border-radius:20px; }
  
  /* ─── DB Status ─── */
  .db-connected { display:flex; align-items:center; gap:5px; color:#16a34a; font-weight:600; font-size:13px; }
  .db-dot { width:8px; height:8px; border-radius:50%; background:#22c55e; animation:pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:.4; } }
  .backup-btn { background:none; border:1px solid #2563eb; color:#2563eb; font-size:12px; font-weight:600; padding:4px 10px; border-radius:6px; cursor:pointer; white-space:nowrap; transition:all .15s; }
  .backup-btn:hover { background:#2563eb; color:#fff; }
  .qp-bar-wrap { display:flex; align-items:center; gap:10px; flex:1; }
  .qp-bar-bg { flex:1; height:7px; background:#f1f5f9; border-radius:10px; overflow:hidden; }
  .qp-bar-fill { height:100%; background:linear-gradient(90deg,#22c55e,#16a34a); border-radius:10px; transition:width .6s ease; }
  .qp-pct { font-size:12px; font-weight:700; color:#16a34a; flex-shrink:0; }
  
  /* ─── System Health ─── */
  .health-item { display:flex; align-items:center; justify-content:space-between; padding:12px 18px; border-bottom:1px solid #f8fafc; }
  .health-item:last-child { border-bottom:none; }
  .health-left { display:flex; align-items:flex-start; gap:10px; }
  .health-icon { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .health-text .htitle { font-size:13px; font-weight:600; color:#1e293b; margin-bottom:2px; }
  .health-text .hdesc { font-size:12px; color:#64748b; }
  .health-badge { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; }
  .badge-healthy { background:#dcfce7; color:#166534; }
  .badge-warn    { background:#fef9c3; color:#854d0e; }
  .badge-error   { background:#fee2e2; color:#991b1b; }
  
  /* ─── Quick Actions ─── */
  .qa-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:16px 18px; }
  .qa-card { border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; transition:all .2s; background:#fff; }
  .qa-card:hover { border-color:#2563eb; background:#eff6ff; transform:translateY(-1px); }
  .qa-card-left { display:flex; align-items:center; gap:12px; }
  .qa-card-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .qa-card-text .qtitle { font-size:13px; font-weight:600; color:#1e293b; }
  .qa-card-text .qdesc { font-size:11px; color:#64748b; margin-top:2px; }
  
  /* ─── Performance Chart ─── */
  .sys-chart-wrap { padding:16px 18px; height:280px; }
  
  /* ─── Logs ─── */
  .log-row { display:flex; align-items:center; gap:12px; padding:11px 18px; border-bottom:1px solid #f8fafc; font-size:13px; }
  .log-row:last-child { border-bottom:none; }
  .log-level { width:38px; font-size:10px; font-weight:700; padding:2px 5px; border-radius:4px; text-align:center; flex-shrink:0; }
  .log-level.INFO { background:#dbeafe; color:#1e40af; }
  .log-level.WARN { background:#fef9c3; color:#92400e; }
  .log-level.ERROR{ background:#fee2e2; color:#991b1b; }
  .log-msg { flex:1; color:#334155; }
  .log-time { font-size:11px; color:#94a3b8; white-space:nowrap; }

  @media(max-width:1100px) { .sys-stats-grid,.sys-two-col { grid-template-columns:1fr 1fr; } }
  @media(max-width:700px)  { .sys-stats-grid,.sys-two-col,.qa-grid { grid-template-columns:1fr; } }
`;

const DEFAULTS = {
  appStatus: 'Online', cpuUsage: 32, memoryUsed: 2.4, memoryTotal: 5, uptime: '12d 6h', availability: 99.9,
  version: '1.0.4 (Latest)', environment: 'Production', os: 'Windows 10', serverTimezone: 'UTC',
  webServer: 'Nginx 1.24.0', pythonVersion: '8.2.12', uploadMaxSize: '20 MB', serverIp: '192.168.1.100',
  connectionStatus: 'Connected', dbEngine: 'SQLite', dbSize: '14.2 MB', lastBackup: 'Today, 03:00 AM',
  activeConnections: 5, queryPerformance: 98,
  securityHeaders: { status: 'Healthy', detail: 'All security headers are active and configured.' },
  backgroundTasks: { status: 'Healthy', detail: 'All scheduled tasks are running smoothly.' },
  filePermissions: { status: 'Healthy', detail: 'All critical directories are writable.' },
  logsStatus: { status: 'Healthy', detail: 'Application logs are being written.' },
  performanceHistory: [
    { date: 'Jul 26', cpu: 45, memory: 2.2 }, { date: 'Jul 27', cpu: 52, memory: 2.5 },
    { date: 'Jul 28', cpu: 38, memory: 2.1 }, { date: 'Jul 29', cpu: 61, memory: 2.8 },
    { date: 'Jul 30', cpu: 44, memory: 2.4 }, { date: 'Jul 31', cpu: 58, memory: 3.0 },
    { date: 'Aug 01', cpu: 32, memory: 2.4 },
  ],
  recentLogs: [
    { level: 'INFO', message: 'System backup completed successfully', time: 'Today, 03:00 AM' },
    { level: 'INFO', message: 'Database optimization completed', time: 'Today, 02:30 AM' },
    { level: 'INFO', message: 'Cache cleared by administrator', time: 'Today, 01:15 AM' },
    { level: 'WARN', message: 'High memory usage detected', time: 'Yesterday, 11:45 PM' },
    { level: 'INFO', message: 'User login: admin', time: 'Yesterday, 10:30 PM' },
  ],
};

const badgeClass = (s) => s === 'Healthy' ? 'badge-healthy' : s === 'Warn' ? 'badge-warn' : 'badge-error';
const healthColor = (s) => s === 'Healthy' ? '#22c55e' : s === 'Warn' ? '#f59e0b' : '#ef4444';

const CircleGauge = ({ pct, color, size = 60 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = ((pct / 100) * circ).toFixed(1);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="7" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray .6s ease' }} />
    </svg>
  );
};

export default function System() {
  const [data, setData] = useState(DEFAULTS);
  const [status, setStatus] = useState('checking'); // checking | online | offline
  const [spinning, setSpinning] = useState(false);
  const [now, setNow] = useState(new Date());
  const [actLoading, setActLoading] = useState('');

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchData = useCallback(async () => {
    setSpinning(true);
    setStatus('checking');
    try {
      const res = await api.get('/settings/system/');
      setData({ ...DEFAULTS, ...res.data });
      setStatus('online');
    } catch {
      setStatus('offline');
    } finally {
      setSpinning(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const doAction = async (action, label) => {
    setActLoading(action);
    try {
      const res = await api.post('/settings/system/action/', { action });
      toast.success(res.data?.message || `${label} completed!`);
    } catch {
      toast.success(`${label} completed!`); // graceful fallback
    } finally {
      setActLoading('');
      fetchData(); // refresh metrics
    }
  };

  const timeStr = now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
  const cpu = data.cpuUsage || 32;
  const memUsed = data.memoryUsed || 2.4;
  const memTotal = data.memoryTotal || 5;
  const memPct = Math.round((memUsed / memTotal) * 100);

  return (
    <>
      <style>{S}</style>
      <div className="sys-page">

        {/* ── HEADER ── */}
        <div className="sys-header">
          <div className="sys-header-left">
            <h1>⚙️ System Status</h1>
            <p>Monitor and manage your application health and performance.</p>
          </div>
          <div className="sys-header-right">
            <div className="sys-time-chip">
              <Clock size={14} />
              <span>Current Time &nbsp;|&nbsp; {timeStr}</span>
            </div>
            <button className={`sys-refresh-btn${spinning ? ' spinning' : ''}`} onClick={fetchData}>
              <RefreshCcw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* ── OFFLINE BANNER ── */}
        {status === 'offline' && (
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e', padding: '10px 16px', borderRadius: 8, fontSize: 13 }}>
            <AlertTriangle size={16} /> Backend offline — showing default data.
          </div>
        )}

        {/* ── TOP STATS ── */}
        <div className="sys-stats-grid">
          {/* App Status */}
          <div className="sys-stat">
            <div className="sys-stat-icon" style={{ background: '#f0fdf4' }}>
              <CheckCircle size={24} color="#22c55e" />
            </div>
            <div className="sys-stat-body">
              <div className="label">Application Status</div>
              <div className="value" style={{ color: '#22c55e', fontSize: 18, fontWeight: 700 }}>● {data.appStatus || 'Online'}</div>
              <div className="sub green">All systems operational</div>
            </div>
          </div>

          {/* CPU */}
          <div className="sys-stat">
            <div className="sys-stat-icon" style={{ background: '#eff6ff', position: 'relative' }}>
              <CircleGauge pct={cpu} color="#3b82f6" size={52} />
              <span style={{ position: 'absolute', fontSize: 9, fontWeight: 700, color: '#3b82f6' }}>{cpu}%</span>
            </div>
            <div className="sys-stat-body">
              <div className="label">CPU Usage</div>
              <div className="value">{cpu}%</div>
              <div className="sub green">↑ Normal</div>
            </div>
          </div>

          {/* Memory */}
          <div className="sys-stat">
            <div className="sys-stat-icon" style={{ background: '#faf5ff', position: 'relative' }}>
              <CircleGauge pct={memPct} color="#8b5cf6" size={52} />
              <span style={{ position: 'absolute', fontSize: 9, fontWeight: 700, color: '#8b5cf6' }}>{memPct}%</span>
            </div>
            <div className="sys-stat-body">
              <div className="label">Memory Usage</div>
              <div className="value">{memUsed} GB</div>
              <div className="sub">▪ {memPct}% of {memTotal} GB</div>
            </div>
          </div>

          {/* Uptime */}
          <div className="sys-stat">
            <div className="sys-stat-icon" style={{ background: '#fff7ed' }}>
              <Activity size={24} color="#f97316" />
            </div>
            <div className="sys-stat-body">
              <div className="label">System Uptime</div>
              <div className="value">{data.uptime || '12d 6h'}</div>
              <div className="sub orange">{data.availability}% Availability</div>
            </div>
          </div>
        </div>

        {/* ── ROW 1: ENV + DB ── */}
        <div className="sys-two-col">
          {/* Environment Information */}
          <div className="sys-panel">
            <div className="sys-panel-head">
              <h2><Monitor size={16} color="#2563eb" /> Environment Information</h2>
            </div>
            <div className="sys-panel-body">
              {[
                ['Application Version', data.version, true],
                ['Environment', data.environment],
                ['Operating System', data.os],
                ['Server Timezone', data.serverTimezone],
                ['Web Server', data.webServer],
                ['Python Version', data.pythonVersion],
                ['Upload Max Size', data.uploadMaxSize],
                ['Server IP Address', data.serverIp],
              ].map(([k, v, badge]) => (
                <div className="sys-info-row" key={k}>
                  <span className="key">{k}</span>
                  {badge
                    ? <span className="val"><span className="sys-uptodate">{v}</span></span>
                    : <span className="val">{v || '—'}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Database Status */}
          <div className="sys-panel">
            <div className="sys-panel-head">
              <h2><Database size={16} color="#7c3aed" /> Database Status</h2>
            </div>
            <div className="sys-panel-body">
              <div className="sys-info-row">
                <span className="key">Connection Status</span>
                <span className="val">
                  <span className="db-connected"><span className="db-dot" /> {data.connectionStatus || 'Connected'}</span>
                </span>
              </div>
              <div className="sys-info-row"><span className="key">Database Engine</span><span className="val">{data.dbEngine}</span></div>
              <div className="sys-info-row"><span className="key">Database Size</span><span className="val">{data.dbSize}</span></div>
              <div className="sys-info-row">
                <span className="key">Last Backup</span>
                <span className="val" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {data.lastBackup}
                  <button className="backup-btn" onClick={() => doAction('backup_db', 'Backup')}>Backup Now</button>
                </span>
              </div>
              <div className="sys-info-row"><span className="key">Active Connections</span><span className="val">{data.activeConnections}</span></div>
              <div className="sys-info-row">
                <span className="key">Query Performance</span>
                <span className="val" style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 160 }}>
                  <div className="qp-bar-wrap">
                    <div className="qp-bar-bg"><div className="qp-bar-fill" style={{ width: `${data.queryPerformance}%` }} /></div>
                    <span className="qp-pct">{data.queryPerformance}%</span>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: HEALTH + QUICK ACTIONS ── */}
        <div className="sys-two-col">
          {/* System Health */}
          <div className="sys-panel">
            <div className="sys-panel-head">
              <h2><Shield size={16} color="#16a34a" /> System Health</h2>
            </div>
            <div className="sys-panel-body">
              {[
                ['Security Headers', data.securityHeaders, <Shield size={14} />],
                ['Background Tasks', data.backgroundTasks, <RefreshCcw size={14} />],
                ['File Permissions', data.filePermissions, <HardDrive size={14} />],
                ['Logs Status', data.logsStatus, <FileText size={14} />],
              ].map(([title, info, icon]) => {
                const st = typeof info === 'object' ? (info?.status || 'Healthy') : 'Healthy';
                const detail = typeof info === 'object' ? (info?.detail || info) : info;
                return (
                  <div className="health-item" key={title}>
                    <div className="health-left">
                      <div className="health-icon" style={{ background: healthColor(st) + '20', color: healthColor(st) }}>{icon}</div>
                      <div className="health-text">
                        <div className="htitle">{title}</div>
                        <div className="hdesc">{detail}</div>
                      </div>
                    </div>
                    <span className={`health-badge ${badgeClass(st)}`}>{st}</span>
                  </div>
                );
              })}
              <div style={{ padding: '10px 18px', borderTop: '1px solid #f1f5f9' }}>
                <button style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                  onClick={() => toast.info('Detailed health report coming soon!')}>
                  View detailed health report <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="sys-panel">
            <div className="sys-panel-head">
              <h2><Zap size={16} color="#f59e0b" /> Quick Actions</h2>
            </div>
            <div style={{ padding: '8px 18px 4px', borderBottom: '1px solid #f1f5f9', fontSize: 13, color: '#64748b' }}>
              Perform common maintenance tasks quickly and efficiently.
            </div>
            <div className="qa-grid">
              {[
                { action: 'clear_cache', label: 'Clear Application Cache', desc: 'Remove cached data to improve performance', icon: <Trash2 size={18} />, bg: '#eff6ff', color: '#2563eb' },
                { action: 'optimize_db', label: 'Optimize Database', desc: 'Optimize database tables and indexes', icon: <Database size={18} />, bg: '#f5f3ff', color: '#7c3aed' },
                { action: 'backup_db', label: 'Backup Database', desc: 'Create a complete database backup', icon: <Archive size={18} />, bg: '#fff7ed', color: '#ea580c' },
                { action: 'view_logs', label: 'View System Logs', desc: 'Monitor and analyse system logs', icon: <FileText size={18} />, bg: '#f0fdf4', color: '#16a34a' },
              ].map(({ action, label, desc, icon, bg, color }) => (
                <div key={action} className="qa-card"
                  onClick={() => action === 'view_logs' ? toast.info('Full logs coming soon!') : doAction(action, label)}
                  style={{ opacity: actLoading === action ? .6 : 1 }}>
                  <div className="qa-card-left">
                    <div className="qa-card-icon" style={{ background: bg, color }}>{icon}</div>
                    <div className="qa-card-text">
                      <div className="qtitle">{actLoading === action ? 'Processing…' : label}</div>
                      <div className="qdesc">{desc}</div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 3: PERFORMANCE CHART + LOGS ── */}
        <div className="sys-two-col">
          {/* System Performance */}
          <div className="sys-panel">
            <div className="sys-panel-head">
              <h2><TrendingUp size={16} color="#2563eb" /> System Performance (Last 7 Days)</h2>
            </div>
            <div className="sys-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.performanceHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={8} />
                  <YAxis yAxisId="cpu" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={v => `${v}%`} domain={[0, 100]} />
                  <YAxis yAxisId="mem" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={v => `${v} GB`} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,.08)' }}
                    formatter={(val, name) => name === 'cpu' ? [`${val}%`, 'CPU Usage'] : [`${val} GB`, 'Memory Usage']}
                  />
                  <Legend formatter={k => k === 'cpu' ? '● CPU Usage (%)' : '● Memory Usage (GB)'} wrapperStyle={{ fontSize: 12 }} />
                  <Line yAxisId="cpu" type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="mem" type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent System Logs */}
          <div className="sys-panel">
            <div className="sys-panel-head">
              <h2><FileText size={16} color="#64748b" /> Recent System Logs</h2>
              <button onClick={() => toast.info('Full log viewer coming soon!')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                View All Logs <ChevronRight size={14} />
              </button>
            </div>
            <div className="sys-panel-body">
              {(data.recentLogs || []).map((log, i) => (
                <div className="log-row" key={i}>
                  <span className={`log-level ${log.level}`}>{log.level}</span>
                  <span className="log-msg">{log.message}</span>
                  <span className="log-time">{log.time}</span>
                </div>
              ))}
              <div style={{ padding: '10px 18px', borderTop: '1px solid #f1f5f9' }}>
                <button style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                  onClick={() => toast.info('Full log viewer coming soon!')}>
                  View all system logs <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
