
import React, { useState } from 'react';
import {
    AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Legend
} from 'recharts';
import {
    TrendingUp, DollarSign, Briefcase, ArrowUpRight, ArrowDownRight,
    PieChart as PieChartIcon, Printer, Calendar, Filter, Download, Activity
} from 'lucide-react';
import { Invoice, Job, User } from '../types';
import { format, subMonths, startOfYear, startOfMonth, endOfMonth } from 'date-fns';
import { DatePicker } from '../components/DatePicker';
import { useReportsData } from '../hooks/useReportsData';
import { Button } from '../components/Button';
import { ReportsPrintView } from '../components/ReportsPrintView';

interface ReportsProps {
    jobs: Job[];
    invoices: Invoice[];
    users: User[];
}

export const Reports: React.FC<ReportsProps> = ({ jobs, invoices, users }) => {
    // Default to YTD
    const [dateRange, setDateRange] = useState({
        start: format(startOfYear(new Date()), 'yyyy-MM-dd'),
        end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    });

    const { kpis, revenueTrendData, techPerformanceData, serviceMixData, invoiceStats } = useReportsData(jobs, invoices, users, dateRange);

    // Handle Presets
    const applyPreset = (type: '6M' | 'YTD' | '1Y') => {
        const now = new Date();
        let start = new Date();

        if (type === '6M') start = subMonths(now, 5);
        if (type === 'YTD') start = startOfYear(now);
        if (type === '1Y') start = subMonths(now, 11);

        setDateRange({
            start: format(startOfMonth(start), 'yyyy-MM-dd'),
            end: format(endOfMonth(now), 'yyyy-MM-dd')
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportCSV = () => {
        // Simple CSV Export Logic
        const headers = ['Month', 'Revenue', 'Profit'];
        const rows = revenueTrendData.map(d => [d.name, d.revenue, d.profit].join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "revenue_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="print:hidden max-w-7xl mx-auto pb-10 space-y-6">

                {/* Screen Header & Controls */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Reports</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Business analytics and performance metrics.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={handleExportCSV} className="bg-white dark:bg-slate-800">
                                <Download className="w-4 h-4 mr-2" /> Export CSV
                            </Button>
                            <Button onClick={handlePrint} className="shadow-lg shadow-slate-900/20">
                                <Printer className="w-4 h-4 mr-2" /> Print PDF
                            </Button>
                        </div>
                    </div>

                    {/* Date Range Toolbar */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                            <div className="flex p-1 bg-slate-100 dark:bg-slate-700 rounded-lg shrink-0">
                                {(['6M', 'YTD', '1Y'] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => applyPreset(type)}
                                        className="px-4 py-1.5 text-xs font-bold rounded-md transition-colors text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 hover:shadow-sm hover:text-slate-900 dark:hover:text-white"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 shrink-0 hidden md:block"></div>

                            <div className="flex items-center gap-3">
                                <div className="w-40">
                                    <DatePicker
                                        value={dateRange.start}
                                        onChange={(val) => setDateRange(p => ({ ...p, start: val }))}
                                        placeholder="Start Date"
                                    />
                                </div>
                                <span className="text-slate-400 text-sm font-medium">to</span>
                                <div className="w-40">
                                    <DatePicker
                                        value={dateRange.end}
                                        onChange={(val) => setDateRange(p => ({ ...p, end: val }))}
                                        placeholder="End Date"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-800">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${kpis.revenueGrowth >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                                {kpis.revenueGrowth >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {Math.abs(kpis.revenueGrowth).toFixed(1)}%
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">${kpis.totalRevenue.toLocaleString()}</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-100 dark:border-amber-800">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="flex items-center text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                {kpis.profitMargin.toFixed(1)}% Margin
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Gross Profit</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">${kpis.grossProfit.toLocaleString()}</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${kpis.jobsGrowth >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                                {kpis.jobsGrowth >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {Math.abs(kpis.jobsGrowth).toFixed(1)}%
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Jobs Completed</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{kpis.completedJobsCount}</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg border border-purple-100 dark:border-purple-800">
                                <PieChartIcon className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Ticket Size</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">${kpis.avgTicket.toFixed(0)}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* REVENUE & PROFIT TREND CHART */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue vs Profit</h3>
                        </div>
                        <div className="w-full min-w-0" style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueTrendData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3266d3" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3266d3" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                        formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        name="Revenue"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="profit"
                                        name="Gross Profit"
                                        stroke="#3266d3"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorProf)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* SERVICE MIX CHART */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Service Mix</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Revenue distribution by service type.</p>
                        <div className="w-full min-w-0 relative" style={{ height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={serviceMixData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {serviceMixData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.completedJobsCount}</span>
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Jobs</span>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2 max-h-[100px] overflow-y-auto custom-scrollbar">
                            {serviceMixData.map(item => (
                                <div key={item.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[150px]">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white">{Math.round((item.value / (kpis.completedJobsCount || 1)) * 100)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* TECHNICIAN PERFORMANCE */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Technician Leaderboard</h3>
                        <div className="w-full min-w-0" style={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={techPerformanceData} layout="vertical" margin={{ left: 0, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        width={100}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                    <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={24}>
                                        {techPerformanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={
                                                entry.color === 'rose' ? '#f43f5e' :
                                                    entry.color === 'blue' ? '#3266d3' :
                                                        entry.color === 'amber' ? '#f59e0b' :
                                                            entry.color === 'emerald' ? '#10b981' : '#64748b'
                                            } />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* 5. INVOICE STATUS BREAKDOWN */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Invoice Status</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Current cash flow health based on filtered invoices.</p>

                        <div className="space-y-6 flex-1">
                            {/* Paid */}
                            <div>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        Paid
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400">{invoiceStats.counts.PAID} / {invoiceStats.total}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(invoiceStats.counts.PAID / (invoiceStats.total || 1)) * 100}%` }}></div>
                                </div>
                            </div>

                            {/* Overdue */}
                            <div>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        Overdue
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400">{invoiceStats.counts.OVERDUE} / {invoiceStats.total}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${(invoiceStats.counts.OVERDUE / (invoiceStats.total || 1)) * 100}%` }}></div>
                                </div>
                            </div>

                            {/* Sent/Pending */}
                            <div>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        Pending Payment
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400">{invoiceStats.counts.SENT} / {invoiceStats.total}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(invoiceStats.counts.SENT / (invoiceStats.total || 1)) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden print:block">
                <ReportsPrintView
                    dateRange={dateRange}
                    kpis={kpis}
                    revenueTrendData={revenueTrendData}
                    serviceMixData={serviceMixData}
                    techPerformanceData={techPerformanceData}
                    invoiceStats={invoiceStats}
                />
            </div>
        </>
    );
};
