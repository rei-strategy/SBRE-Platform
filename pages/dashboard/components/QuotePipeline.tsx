import React, { useContext } from 'react';
import { StoreContext } from '../../../store';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { QuoteStatus } from '../../../types';

export const QuotePipeline: React.FC = () => {
    const store = useContext(StoreContext);

    if (!store) return null;

    const quoteStats = [
        { name: 'Draft', value: store.quotes.filter(q => q.status === QuoteStatus.DRAFT).length, color: '#94a3b8' },
        { name: 'Sent', value: store.quotes.filter(q => q.status === QuoteStatus.SENT).length, color: '#3266d3' },
        { name: 'Approved', value: store.quotes.filter(q => q.status === QuoteStatus.APPROVED).length, color: '#10b981' },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Quote Pipeline</h3>
            <div className="w-full min-w-0 relative" style={{ height: 192 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={quoteStats}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {quoteStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{store.quotes.length}</span>
                    <span className="text-xs text-slate-400 uppercase font-bold">Total Quotes</span>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
                {quoteStats.map(stat => (
                    <Link
                        to={`/quotes?status=${stat.name.toUpperCase()}`}
                        key={stat.name}
                        className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                    >
                        <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: stat.color }}></div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                        <p className="font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};
