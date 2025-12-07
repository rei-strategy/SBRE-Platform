import React, { useMemo, useContext } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { StoreContext } from '../../../store';
import { InvoiceStatus } from '../../../types';
import { subDays, startOfDay, endOfDay, parseISO, format } from 'date-fns';

export const RevenueChart: React.FC = () => {
    const store = useContext(StoreContext);
    const today = new Date();

    const revenueChartData = useMemo(() => {
        if (!store) return [];
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = subDays(today, 6 - i);
            return d;
        });

        return last7Days.map(day => {
            const dayStart = startOfDay(day);
            const dayEnd = endOfDay(day);

            // Calculate revenue from paid invoices on this day
            const dailyRevenue = store.invoices
                .filter(inv => {
                    if (inv.status !== InvoiceStatus.PAID) return false;
                    // Use payment date if available, otherwise issued date
                    const dateToCheck = inv.payments.length > 0 ? parseISO(inv.payments[0].date) : parseISO(inv.issuedDate);
                    return dateToCheck >= dayStart && dateToCheck <= dayEnd;
                })
                .reduce((sum, inv) => sum + inv.total, 0);

            return {
                name: format(day, 'EEE'), // Mon, Tue, etc.
                revenue: dailyRevenue
            };
        });
    }, [store?.invoices, today]);

    if (!store) return null;

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Revenue Trend (Last 7 Days)</h3>
            <div className="w-full min-w-0" style={{ height: 256 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#1e293b' }}
                            formatter={(value) => [`$${value}`, 'Revenue']}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
