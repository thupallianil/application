import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  IndianRupee, FileText, FileSignature, CreditCard, Users, ArrowUp, ArrowRight, Calendar,
  TrendingDown
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* --- STYLES --- */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  .dash-wrapper { font-family: 'Inter', sans-serif; background-color: #f7f9fb; min-height: 100vh; padding: 32px; color: #1e293b; }
  .dash-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; }
  .dash-title { font-size: 26px; font-weight: 700; color: #0f172a; margin-bottom: 6px; letter-spacing: -0.5px; }
  .dash-subtitle { font-size: 14px; color: #64748b; }
  .dash-subtitle strong { color: #2563eb; }
  .date-picker-btn { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #e2e8f0; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
  
  .card-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin-bottom: 24px; }
  .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 20px 0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
  .stat-card-top { display: flex; align-items: flex-start; gap: 14px; }
  .icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  
  .stat-info .stat-label { font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 4px; }
  .stat-info .stat-val { font-size: 26px; font-weight: 700; color: #0f172a; margin-bottom: 6px; letter-spacing: -0.5px; line-height: 1; }
  .stat-badge { display: inline-flex; align-items: center; gap: 2px; font-size: 11px; font-weight: 700; }
  .stat-badge.green { color: #16a34a; }
  .stat-badge.red { color: #ef4444; }
  .stat-desc { font-size: 11px; color: #94a3b8; font-weight: 500; margin-left: 4px; }
  
  .sparkline-box { height: 45px; margin-top: 15px; margin-left: -20px; margin-right: -20px; }
  
  .mid-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
  .panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); padding: 24px; display: flex; flex-direction: column; }
  .panel-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
  .panel-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
  .panel-subtitle { font-size: 12px; color: #64748b; font-weight: 400; }
  .panel-btn { background: #f8fafc; border: 1px solid #e2e8f0; color: #2563eb; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
  .panel-btn:hover { background: #eff6ff; border-color: #bfdbfe; }
  
  .activity-list { display: flex; flex-direction: column; gap: 20px; }
  .activity-item { display: flex; gap: 16px; }
  .act-dot-container { position: relative; display: flex; flex-direction: column; align-items: center; }
  .act-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; z-index: 2; margin-top: 2px; }
  .active-line { position: absolute; top: 34px; bottom: -20px; left: 15px; width: 2px; background: #f1f5f9; z-index: 1; }
  .activity-item:last-child .active-line { display: none; }
  
  .act-details { flex: 1; padding-bottom: 4px; display: flex; justify-content: space-between; align-items: flex-start; }
  .act-title { font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 4px; line-height: 1.4; }
  .act-sub { font-size: 12px; color: #64748b; }
  .act-time { font-size: 11px; color: #94a3b8; font-weight: 500; white-space: nowrap; margin-left: 10px; }
  
  .rev-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
  .rev-amount { font-size: 32px; font-weight: 700; color: #0f172a; margin-top: 8px; letter-spacing: -1px; }
  .rev-badge-box { text-align: right; }
  .rev-badge { background: #dcfce7; color: #166534; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px; }
  .rev-vs { font-size: 11px; color: #94a3b8; margin-top: 6px; font-weight: 500; }
  
  .bot-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
  
  .donut-section { display: flex; align-items: center; margin-bottom: 24px; margin-top: 10px; }
  .donut-wrap { position: relative; width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .donut-center { position: absolute; text-align: center; }
  .donut-num { font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1; margin-bottom: 2px; }
  .donut-text { font-size: 11px; color: #64748b; font-weight: 500; text-transform: uppercase; }
  
  .legend-grid { display: grid; grid-template-columns: 1fr; gap: 12px; margin-left: 20px; flex: 1; }
  .legend-item { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
  .leg-left { display: flex; align-items: center; gap: 8px; color: #475569; font-weight: 500; }
  .leg-dot { width: 10px; height: 10px; border-radius: 50%; }
  .leg-val { color: #94a3b8; font-weight: 500; font-size: 11px; }
  
  .cli-list { display: flex; flex-direction: column; gap: 16px; margin-top: 10px; flex: 1; }
  .cli-item { display: flex; align-items: center; justify-content: space-between; }
  .cli-left { display: flex; align-items: center; gap: 12px; }
  .cli-avatar { width: 40px; height: 40px; border-radius: 50%; background: #e0e7ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 15px; }
  .cli-name { font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 4px; }
  .cli-inv { font-size: 11px; color: #94a3b8; font-weight: 500; }
  .cli-right { text-align: right; }
  .cli-amt { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }

  .view-all-link { color: #2563eb; font-size: 13px; font-weight: 600; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; padding-top: 16px; border-top: 1px solid #f1f5f9; cursor: pointer; transition: 0.2s; margin-top: auto; }
  .view-all-link:hover { color: #1d4ed8; gap: 8px; }
  .panel-link { color: #2563eb; font-size: 12px; font-weight: 600; cursor: pointer; text-decoration: none; }
  .panel-link:hover { text-decoration: underline; color: #1d4ed8; }

  /* Client Dashboard Overrides */
  .client-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }

  @media(max-width: 1300px) {
    .card-row { grid-template-columns: repeat(3, 1fr); }
  }
  @media(max-width: 1000px) {
    .card-row { grid-template-columns: repeat(2, 1fr); }
    .mid-row, .bot-row { grid-template-columns: 1fr; }
  }
  @media(max-width: 600px) {
    .card-row { grid-template-columns: 1fr; }
  }
`;

// Helper component for small sparkline areas
const Sparkline = ({ data, color }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <linearGradient id={"grad_" + color.replace('#', '')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.15} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fillOpacity={1} fill={"url(#grad_" + color.replace('#', '') + ")"} />
    </AreaChart>
  </ResponsiveContainer>
);

// Fallback visual data for charts
const DUMMY_REV_CHART = [
  { day: 'Jul 25', val: 1000 }, { day: 'Jul 26', val: 3200 },
  { day: 'Jul 27', val: 2400 }, { day: 'Jul 28', val: 4600 },
  { day: 'Jul 29', val: 5600 }, { day: 'Jul 30', val: 7000 },
  { day: 'Jul 31', val: 9200 }, { day: 'Aug 1', val: 7623 }
];
const sparkRev = [{ v: 2 }, { v: 5 }, { v: 4 }, { v: 8 }, { v: 7 }, { v: 12 }, { v: 14 }];
const sparkInv = [{ v: 1 }, { v: 2 }, { v: 1 }, { v: 3 }, { v: 2 }, { v: 4 }, { v: 3 }];
const sparkQte = [{ v: 3 }, { v: 2 }, { v: 4 }, { v: 3 }, { v: 6 }, { v: 4 }, { v: 5 }];
const sparkPay = [{ v: 2 }, { v: 3 }, { v: 4 }, { v: 2 }, { v: 5 }, { v: 6 }, { v: 7 }];
const sparkCli = [{ v: 1 }, { v: 1 }, { v: 2 }, { v: 1 }, { v: 3 }, { v: 2 }, { v: 4 }];

export default function Dashboard() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("user_role") || "client";
  const userName = localStorage.getItem("user_name") || "Anil Kumar";

  const [data, setData] = useState({
    clients: 0, invoices: 0, quotes: 0, payments: 0, revenue: 0, pending: 0,
    recentQuotes: [], recentInvoices: [], activities: [], topClients: [],
    invoiceStats: [], paymentStats: []
  });

  const [loading, setLoading] = useState(true);

  // Time formatter
  const formatTime = (ts) => {
    if (!ts) return "Recently";
    try {
      return new Date(ts).toLocaleDateString() + " " + new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch { return "Recently"; }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientParams = userRole !== "admin" ? { role: "client" } : {};
        const [clientsRes, invoicesRes, quotesRes, paymentsRes] = await Promise.all([
          api.get("/clients/", { params: clientParams }).catch(() => ({ data: [] })),
          api.get("/invoices/", { params: clientParams }).catch(() => ({ data: [] })),
          api.get("/quotes/", { params: clientParams }).catch(() => ({ data: [] })),
          api.get("/payments/", { params: clientParams }).catch(() => ({ data: [] })),
        ]);

        const invoices = invoicesRes.data || [];
        const quotes = quotesRes.data || [];
        const payments = paymentsRes.data || [];
        const clients = clientsRes.data || [];

        let revenue = 0, pending = 0;
        let invPaid = 0, invPending = 0, invOverdue = 0, invCancelled = 0;

        invoices.forEach(inv => {
          const amt = parseFloat(inv.amount) || 0;
          revenue += amt;
          const status = (inv.status || "").toLowerCase();

          if (status === "paid") invPaid++;
          else if (status === "overdue") invOverdue++;
          else if (status === "cancelled" || status === "canceled") invCancelled++;
          else { invPending++; pending += amt; }
        });

        // Dynamic Invoice Donuts
        const invTotal = invoices.length || 1; // avoid / 0
        const invoiceStats = [
          { name: 'Paid', value: invPaid, color: '#22c55e', pct: Math.round((invPaid / invTotal) * 100) },
          { name: 'Pending', value: invPending, color: '#eab308', pct: Math.round((invPending / invTotal) * 100) },
          { name: 'Overdue', value: invOverdue, color: '#ef4444', pct: Math.round((invOverdue / invTotal) * 100) },
          { name: 'Cancelled', value: invCancelled, color: '#94a3b8', pct: Math.round((invCancelled / invTotal) * 100) }
        ];

        // Dynamic Payment Donuts
        let payBank = 0, payUpi = 0, payCash = 0, payCard = 0;
        payments.forEach(p => {
          let m = (p.payment_mode || p.mode || "").toLowerCase();
          if (m.includes('bank') || m.includes('transfer')) payBank++;
          else if (m.includes('upi')) payUpi++;
          else if (m.includes('cash')) payCash++;
          else payCard++;
        });
        const payTotal = payments.length || 1;
        const paymentStats = [
          { name: 'Bank Transfer', value: payBank, color: '#3b82f6', pct: Math.round((payBank / payTotal) * 100) },
          { name: 'UPI', value: payUpi, color: '#22c55e', pct: Math.round((payUpi / payTotal) * 100) },
          { name: 'Cash', value: payCash, color: '#eab308', pct: Math.round((payCash / payTotal) * 100) },
          { name: 'Card', value: payCard, color: '#a855f7', pct: Math.round((payCard / payTotal) * 100) }
        ];

        // Dynamic Activities (aggregator)
        let acts = [];
        invoices.forEach(i => acts.push({ ts: i.created_at || i.created, type: 'invoice', data: i }));
        payments.forEach(p => acts.push({ ts: p.created_at || p.created, type: 'payment', data: p }));
        clients.forEach(c => acts.push({ ts: c.created_at || c.created, type: 'client', data: c }));
        quotes.forEach(q => acts.push({ ts: q.created_at || q.created, type: 'quote', data: q }));

        acts.sort((a, b) => new Date(b.ts || 0) - new Date(a.ts || 0));
        let topActs = acts.slice(0, 5).map(a => {
          if (a.type === 'invoice') return {
            icon: <FileText size={16} color="#ef4444" />, bg: '#fee2e2',
            title: "Invoice " + (a.data.invoice_number || "INV") + " created",
            sub: "Amount: ₹" + (a.data.amount || 0), time: formatTime(a.ts)
          };
          if (a.type === 'payment') return {
            icon: <IndianRupee size={16} color="#3b82f6" />, bg: '#dbeafe',
            title: "Payment of ₹" + (a.data.amount || 0) + " received",
            sub: "Payment ID: " + a.data.id, time: formatTime(a.ts)
          };
          if (a.type === 'client') return {
            icon: <Users size={16} color="#a855f7" />, bg: '#f3e8ff',
            title: "New client " + (a.data.client || a.data.name || "Unknown") + " added",
            sub: "Email: " + (a.data.email || "N/A"), time: formatTime(a.ts)
          };
          return {
            icon: <FileSignature size={16} color="#eab308" />, bg: '#fef3c7',
            title: "Quote " + (a.data.quotation_id || "QT") + " created",
            sub: "Amount: ₹" + (a.data.amount || 0), time: formatTime(a.ts)
          };
        });

        // If empty, supply one fallback visual so it doesn't look completely broken during early testing
        if (topActs.length === 0) {
          topActs = [{ icon: <CheckCircle size={16} color="#16a34a" />, bg: '#dcfce7', title: 'System initialized', sub: 'Ready for operation', time: 'Just now' }];
        }

        // Top Clients (dynamic aggregation)
        let clientMap = {};
        clients.forEach(c => {
          let n = c.client || c.name || "Client";
          clientMap[n] = { name: n, invs: 0, amt: 0, initial: n[0].toUpperCase() };
        });
        invoices.forEach(i => {
          let n = i.client_name || i.client || "SaaS Client";
          if (!clientMap[n]) clientMap[n] = { name: n, invs: 0, amt: 0, initial: n[0].toUpperCase() };
          clientMap[n].invs++;
          clientMap[n].amt += parseFloat(i.amount) || 0;
        });
        const topClients = Object.values(clientMap)
          .sort((a, b) => b.amt - a.amt)
          .slice(0, 3)
          .map((c, idx) => ({
            ...c,
            color: idx === 0 ? '#10b981' : idx === 1 ? '#8b5cf6' : '#f59e0b',
            bg: idx === 0 ? '#dcfce7' : idx === 1 ? '#ede9fe' : '#fef3c7'
          }));

        setData({
          clients: clients.length,
          invoices: invoices.length,
          quotes: quotes.length,
          payments: payments.length,
          revenue: revenue,
          pending: pending,
          recentQuotes: [...quotes].reverse().slice(0, 5),
          recentInvoices: [...invoices].reverse().slice(0, 5),
          activities: topActs,
          topClients: topClients,
          invoiceStats,
          paymentStats
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f7f9fb]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const fmt = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const rFormat = (v) => v >= 1000 ? "₹" + (v / 1000) + "K" : "₹" + v;
  const pTooltip = (v) => ["₹" + fmt(v), 'Revenue'];

  return (
    <>
      <style>{S}</style>
      <div className="dash-wrapper">

        <div className="dash-header">
          <div>
            <h1 className="dash-title">Dashboard {userRole === "admin" && "(Admin)"}</h1>
            <p className="dash-subtitle">
              Welcome back, <strong>{userName}</strong>! Here's what's happening with your business today.
            </p>
          </div>
          <button className="date-picker-btn">
            <Calendar size={16} /> Dashboard Range
          </button>
        </div>

        {userRole === "admin" ? (
          <>
            <div className="card-row">
              {[
                { label: 'Total Revenue', v: '₹' + fmt(data.revenue), up: '12.5%', icon: <IndianRupee size={22} color="#3b82f6" />, bg: '#eff6ff', st: '#3b82f6', spark: sparkRev },
                { label: 'Invoices', v: data.invoices, up: '33.3%', icon: <FileText size={22} color="#22c55e" />, bg: '#f0fdf4', st: '#22c55e', spark: sparkInv },
                { label: 'Quotes', v: data.quotes, up: '33.3%', icon: <FileSignature size={22} color="#a855f7" />, bg: '#f3e8ff', st: '#a855f7', spark: sparkQte },
                { label: 'Payments', v: data.payments, up: '33.3%', icon: <CreditCard size={22} color="#f97316" />, bg: '#fff7ed', st: '#f97316', spark: sparkPay },
                { label: 'Clients', v: data.clients, up: '25.0%', icon: <Users size={22} color="#ec4899" />, bg: '#fdf2f8', st: '#ec4899', spark: sparkCli },
              ].map((c, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-card-top">
                    <div className="icon-box" style={{ background: c.bg }}>{c.icon}</div>
                    <div className="stat-info">
                      <div className="stat-label">{c.label}</div>
                      <div className="stat-val">{c.v}</div>
                      <div className="stat-badge green"><ArrowUp size={12} /> {c.up}</div>
                      <span className="stat-desc">from last 7 days</span>
                    </div>
                  </div>
                  <div className="sparkline-box">
                    <Sparkline data={c.spark} color={c.st} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mid-row">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <div className="panel-title">Recent Activity</div>
                    <div className="panel-subtitle">Here's what's been happening in your business recently.</div>
                  </div>
                  <button className="panel-btn">View All Activity</button>
                </div>
                <div className="activity-list">
                  {data.activities.map((a, i) => (
                    <div className="activity-item" key={i}>
                      <div className="act-dot-container">
                        <div className="act-icon" style={{ background: a.bg }}>{a.icon}</div>
                        <div className="active-line"></div>
                      </div>
                      <div className="act-details">
                        <div>
                          <div className="act-title">{a.title}</div>
                          <div className="act-sub">{a.sub}</div>
                        </div>
                        <div className="act-time">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head mb-0">
                  <div className="panel-title">Revenue Overview</div>
                  <button className="date-picker-btn" style={{ padding: '6px 12px', fontSize: 12 }}>This Week ▼</button>
                </div>

                <div className="rev-top">
                  <div>
                    <div className="act-sub" style={{ marginTop: 10, fontWeight: 500 }}>Total Revenue</div>
                    <div className="rev-amount">₹{fmt(data.revenue)}</div>
                  </div>
                  <div className="rev-badge-box">
                    <div className="rev-badge"><ArrowUp size={14} /> 12.5%</div>
                    <div className="rev-vs">vs last 7 days</div>
                  </div>
                </div>

                <div style={{ height: 260, marginLeft: -20 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DUMMY_REV_CHART} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={rFormat} />
                      <RechartsTooltip
                        contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                        formatter={pTooltip}
                      />
                      <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bot-row">
              <div className="panel" style={{ padding: '24px 24px 0' }}>
                <div className="panel-title">Invoice Status</div>
                <div className="donut-section">
                  <div className="donut-wrap">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.invoiceStats} cx="50%" cy="50%" innerRadius={42} outerRadius={60} stroke="none" dataKey="value">
                          {data.invoiceStats.map((s, i) => <Cell key={i} fill={s.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center">
                      <div className="donut-num">{data.invoices}</div>
                      <div className="donut-text">Total</div>
                    </div>
                  </div>
                  <div className="legend-grid">
                    {data.invoiceStats.map((x, i) => (
                      <div className="legend-item" key={i}>
                        <div className="leg-left"><div className="leg-dot" style={{ background: x.color }}></div>{x.name}</div>
                        <div className="leg-val">{x.value} ({isNaN(x.pct) ? 0 : x.pct}%)</div>
                      </div>
                    ))}
                  </div>
                </div>
                <a className="view-all-link" onClick={() => navigate('/invoices')}>View All Invoices <ArrowRight size={14} /></a>
              </div>

              <div className="panel" style={{ padding: '24px 24px 0' }}>
                <div className="panel-head mb-0">
                  <div className="panel-title">Top Clients</div>
                  <button className="panel-btn" onClick={() => navigate('/clients')} style={{ padding: '4px 10px', fontSize: 11 }}>View All</button>
                </div>
                <div className="cli-list">
                  {data.topClients.map((c, i) => (
                    <div className="cli-item" key={i}>
                      <div className="cli-left">
                        <div className="cli-avatar" style={{ background: c.bg, color: c.color }}>{c.initial}</div>
                        <div>
                          <div className="cli-name">{c.name}</div>
                          <div className="cli-inv">{c.invs} Invoice{c.invs !== 1 && 's'}</div>
                        </div>
                      </div>
                      <div className="cli-right">
                        <div className="cli-amt">₹{fmt(c.amt)}</div>
                        <div className="cli-inv">{c.invs} Invoice</div>
                      </div>
                    </div>
                  ))}
                  {data.topClients.length === 0 && <div className="act-sub text-center py-4">No client data yet</div>}
                </div>
              </div>

              <div className="panel" style={{ padding: '24px 24px 0' }}>
                <div className="panel-title">Payment Methods</div>
                <div className="donut-section">
                  <div className="donut-wrap">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.paymentStats} cx="50%" cy="50%" innerRadius={42} outerRadius={60} stroke="none" dataKey="value">
                          {data.paymentStats.map((s, i) => <Cell key={i} fill={s.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center">
                      <div className="donut-num">{data.payments}</div>
                      <div className="donut-text">Total</div>
                    </div>
                  </div>
                  <div className="legend-grid">
                    {data.paymentStats.map((x, i) => (
                      <div className="legend-item" key={i}>
                        <div className="leg-left"><div className="leg-dot" style={{ background: x.color }}></div>{x.name}</div>
                        <div className="leg-val">{x.value} ({isNaN(x.pct) ? 0 : x.pct}%)</div>
                      </div>
                    ))}
                  </div>
                </div>
                <a className="view-all-link" onClick={() => navigate('/payments')}>View All Payments <ArrowRight size={14} /></a>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="client-grid">
              {[
                { label: 'My Quotations', v: data.quotes, bg: '#f3e8ff', c: '#a855f7', i: <FileSignature size={24} /> },
                { label: 'My Invoices', v: data.invoices, bg: '#f0fdf4', c: '#22c55e', i: <FileText size={24} /> },
                { label: 'Payments Made', v: data.payments, bg: '#eff6ff', c: '#3b82f6', i: <CreditCard size={24} /> },
                { label: 'Pending Balance', v: '₹' + fmt(data.pending), bg: '#fee2e2', c: '#ef4444', i: <TrendingDown size={24} /> },
              ].map((c, i) => (
                <div className="panel" style={{ padding: '20px', flexDirection: 'row', alignItems: 'center', gap: '16px' }} key={i}>
                  <div className="icon-box" style={{ background: c.bg, color: c.c }}>{c.i}</div>
                  <div>
                    <div className="act-sub">{c.label}</div>
                    <div className="rev-amount" style={{ fontSize: 24, marginTop: 4 }}>{c.v}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mid-row">
              <div className="panel">
                <div className="panel-title mb-4">Recent Quotations</div>
                {data.recentQuotes.length > 0 ? (
                  <div className="activity-list">
                    {data.recentQuotes.map((q, idx) => (
                      <div className="activity-item" key={idx} style={{ paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                        <div className="act-icon" style={{ background: '#f3e8ff', color: '#a855f7' }}><FileSignature size={16} /></div>
                        <div className="act-details">
                          <div>
                            <div className="act-title">{q.quotation_id || ("QT-" + q.id)}</div>
                            <div className="stat-badge" style={{ color: q.status === 'Accepted' ? '#16a34a' : '#d97706' }}>{q.status || 'Pending'}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="act-title">₹{fmt(parseFloat(q.amount || 0))}</div>
                            <a className="panel-link" onClick={() => navigate("/quotes/" + q.id)}>View detail</a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="act-sub py-6 text-center">No recent quotations found.</div>
                )}
              </div>

              <div className="panel">
                <div className="panel-title mb-4">Recent Invoices</div>
                {data.recentInvoices.length > 0 ? (
                  <div className="activity-list">
                    {data.recentInvoices.map((inv, idx) => (
                      <div className="activity-item" key={idx} style={{ paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                        <div className="act-icon" style={{ background: '#f0fdf4', color: '#22c55e' }}><FileText size={16} /></div>
                        <div className="act-details">
                          <div>
                            <div className="act-title">{inv.invoice || ("INV-" + inv.id)}</div>
                            <div className="stat-badge" style={{ color: inv.status?.toLowerCase() === 'paid' ? '#16a34a' : '#ef4444' }}>{inv.status || 'Unpaid'}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="act-title">₹{fmt(parseFloat(inv.amount || 0))}</div>
                            <a className="panel-link" onClick={() => navigate("/invoices/" + inv.id)}>View detail</a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="act-sub py-6 text-center">No recent invoices found.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}