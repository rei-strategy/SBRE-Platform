import React from 'react';
import { ResearchTool } from './ResearchTool';
import { TrendingUp, Calendar, AlertTriangle } from 'lucide-react';

export const MarketTrends: React.FC = () => {
    return (
        <ResearchTool
            toolType="market-trends"
            title="Market Trends"
            description="Identify emerging trends, seasonality, and demand shifts in your local market."
            inputConfig={{
                fields: [
                    { key: 'city', label: 'City', placeholder: 'e.g. Seattle, WA' },
                    { key: 'service', label: 'Service Niche', placeholder: 'e.g. HVAC' }
                ]
            }}
            renderResult={(data) => (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Short Term */}
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <h3 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5" /> Short Term Trends
                            </h3>
                            <ul className="space-y-2">
                                {data.short_term_trends?.map((t: string, i: number) => (
                                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                                        <span className="text-blue-500">•</span> {t}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Long Term */}
                        <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-900/30">
                            <h3 className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2 mb-4">
                                <Calendar className="w-5 h-5" /> Long Term Shifts
                            </h3>
                            <ul className="space-y-2">
                                {data.long_term_trends?.map((t: string, i: number) => (
                                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                                        <span className="text-purple-500">•</span> {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Seasonality & Demand */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Seasonality</h4>
                            <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{data.seasonality}</p>
                        </div>
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Demand Shift</h4>
                            <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{data.demand_shift}</p>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3">Strategic Recommendations</h4>
                        <div className="grid gap-3">
                            {data.recommendations?.map((rec: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{rec}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        />
    );
};
