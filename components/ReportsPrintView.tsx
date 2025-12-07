import React from 'react';
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, PieChart, Pie, Legend } from 'recharts';
import { format } from 'date-fns';
import { Invoice, Job, User } from '../types';

interface ReportsPrintViewProps {
    dateRange: { start: string; end: string };
    kpis: {
        totalRevenue: number;
        revenueGrowth: number;
        grossProfit: number;
        profitMargin: number;
        completedJobsCount: number;
        jobsGrowth: number;
        avgTicket: number;
    };
    revenueTrendData: any[];
    serviceMixData: any[];
    techPerformanceData: any[];
    invoiceStats: {
        counts: { PAID: number; OVERDUE: number; SENT: number };
        total: number;
    };
}

export const ReportsPrintView: React.FC<ReportsPrintViewProps> = ({
    dateRange,
    kpis,
    revenueTrendData,
    serviceMixData,
    techPerformanceData,
    invoiceStats
}) => {
    return (
        <div className="p-8 bg-white min-h-screen text-slate-900 font-sans">
            {/* 1. Header Section */}
            <div className="flex justify-between items-end border-b-4 border-slate-900 pb-6 mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold uppercase tracking-tight text-slate-900 leading-none">
                        Executive<br />Report
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 text-lg">The Matador Mobile Detailing</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Reporting Period</p>
                    <p className="text-lg font-bold text-slate-900">
                        {format(new Date(dateRange.start), 'MMM d, yyyy')} — {format(new Date(dateRange.end), 'MMM d, yyyy')}
                    </p>
                </div>
            </div>

            {/* 2. KPI Grid - High Impact */}
            <div className="grid grid-cols-4 gap-6 mb-10">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
                    <p className="text-3xl font-black text-slate-900">${kpis.totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center mt-2 text-sm font-semibold text-emerald-700">
                        {kpis.revenueGrowth >= 0 ? '+' : ''}{kpis.revenueGrowth.toFixed(1)}% vs Prev
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gross Profit</p>
                    <p className="text-3xl font-black text-slate-900">${kpis.grossProfit.toLocaleString()}</p>
                    <div className="mt-2 inline-block px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-xs font-bold">
                        {kpis.profitMargin.toFixed(1)}% Margin
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Jobs Done</p>
                    <p className="text-3xl font-black text-slate-900">{kpis.completedJobsCount}</p>
                    <div className="flex items-center mt-2 text-sm font-semibold text-emerald-700">
                        {kpis.jobsGrowth >= 0 ? '+' : ''}{kpis.jobsGrowth.toFixed(1)}% vs Prev
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avg Ticket</p>
                    <p className="text-3xl font-black text-slate-900">${kpis.avgTicket.toFixed(0)}</p>
                </div>
            </div>

            {/* 3. Charts Row */}
            <div className="grid grid-cols-3 gap-8 mb-10">
                {/* Revenue Trend - Takes up 2 columns */}
                <div className="col-span-2">
                    <h3 className="text-lg font-bold border-l-4 border-slate-900 pl-3 mb-4">Financial Performance</h3>
                    <div className="h-64 border border-slate-100 rounded-lg bg-slate-50 p-2">
                        <AreaChart width={500} height={250} data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="printColorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `$${val / 1000}k`} />
                            <Area type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={2} fill="url(#printColorRev)" />
                            <Area type="monotone" dataKey="profit" stroke="#94a3b8" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                        </AreaChart>
                    </div>
                </div>

                {/* Service Mix - 1 Column */}
                <div className="col-span-1">
                    <h3 className="text-lg font-bold border-l-4 border-slate-900 pl-3 mb-4">Service Mix</h3>
                    <div className="h-64 border border-slate-100 rounded-lg bg-slate-50 p-2 flex flex-col items-center justify-center">
                        <PieChart width={200} height={160}>
                            <Pie
                                data={serviceMixData}
                                cx={100}
                                cy={80}
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {serviceMixData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div className="w-full mt-4 space-y-1">
                            {serviceMixData.slice(0, 5).map(item => (
                                <div key={item.name} className="flex justify-between text-xs">
                                    <span className="truncate w-24 font-medium text-slate-600">{item.name}</span>
                                    <span className="font-bold">{Math.round((item.value / kpis.completedJobsCount) * 100)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Secondary Data: Techs & Invoices */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-lg font-bold border-l-4 border-slate-900 pl-3 mb-4">Top Technicians</h3>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-500 uppercase text-xs">
                            <tr>
                                <th className="px-3 py-2 rounded-l">Name</th>
                                <th className="px-3 py-2 text-right rounded-r">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {techPerformanceData.map((tech) => (
                                <tr key={tech.name}>
                                    <td className="px-3 py-2 font-medium">{tech.name}</td>
                                    <td className="px-3 py-2 text-right font-bold text-slate-900">${tech.revenue.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <h3 className="text-lg font-bold border-l-4 border-slate-900 pl-3 mb-4">Invoice Health</h3>
                    <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-1 gap-4">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="font-bold text-emerald-900">Paid Invoices</span>
                            </div>
                            <span className="font-mono font-bold text-lg">{invoiceStats.counts.PAID}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="font-bold text-red-900">Overdue</span>
                            </div>
                            <span className="font-mono font-bold text-lg">{invoiceStats.counts.OVERDUE}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="font-bold text-blue-900">Pending</span>
                            </div>
                            <span className="font-mono font-bold text-lg">{invoiceStats.counts.SENT}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-8 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-400">
                    Generated by The Matador FieldFlow System on {format(new Date(), 'MMMM d, yyyy @ h:mm a')}
                </p>
            </div>
        </div>
    );
};
