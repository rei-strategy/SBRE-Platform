import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPI {
    label: string;
    value: string;
    trend: 'up' | 'down';
    trendValue: string;
    color: string;
}

interface Props {
    kpis: KPI[];
}

export const ChannelKPIs: React.FC<Props> = ({ kpis }) => {
    // Mock sparkline data generator based on trend
    const getMockData = (trend: 'up' | 'down') => {
        const data = [];
        let val = 50;
        for (let i = 0; i < 10; i++) {
            val += (trend === 'up' ? Math.random() * 10 : -Math.random() * 10) + (Math.random() * 10 - 5);
            data.push({ v: val });
        }
        return data;
    };

    const getColorHex = (colorName: string) => {
        const colors: Record<string, string> = {
            blue: '#3266d3',
            green: '#10b981',
            red: '#ef4444',
            purple: '#8b5cf6',
            orange: '#f97316',
            pink: '#ec4899',
            yellow: '#eab308'
        };
        return colors[colorName] || '#64748b';
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    <div className="relative z-10">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">{kpi.label}</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{kpi.value}</h3>

                        <div className="flex items-center gap-2">
                            <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${kpi.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {kpi.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                {kpi.trendValue}
                            </span>
                            <span className="text-xs text-slate-400">vs last 30d</span>
                        </div>
                    </div>

                    {/* Sparkline Background */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={getMockData(kpi.trend)}>
                                <Area
                                    type="monotone"
                                    dataKey="v"
                                    stroke={getColorHex(kpi.color)}
                                    fill={getColorHex(kpi.color)}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ))}
        </div>
    );
};
