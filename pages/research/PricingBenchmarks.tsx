import React from 'react';
import { ResearchTool } from './ResearchTool';
import { DollarSign, BarChart } from 'lucide-react';

export const PricingBenchmarks: React.FC = () => {
    return (
        <ResearchTool
            toolType="pricing-benchmarks"
            title="Pricing Benchmarks"
            description="Compare your pricing against local competitors. Identify if you are leaving money on the table."
            inputConfig={{
                fields: [
                    { key: 'city', label: 'City', placeholder: 'e.g. Miami, FL' },
                    { key: 'service', label: 'Service Type', placeholder: 'e.g. House Cleaning' }
                ]
            }}
            renderResult={(data) => (
                <div className="space-y-8">
                    {/* Pricing Matrix */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                            <thead className="text-slate-500 font-bold">
                                <tr>
                                    <th className="px-4 pb-2">Service</th>
                                    <th className="px-4 pb-2 text-green-600">Low Range</th>
                                    <th className="px-4 pb-2 text-blue-600">Market Average</th>
                                    <th className="px-4 pb-2 text-purple-600">Premium Range</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.pricing_matrix?.map((row: any, i: number) => (
                                    <tr key={i} className="bg-slate-50 dark:bg-slate-900/50">
                                        <td className="p-4 rounded-l-xl font-bold text-slate-900 dark:text-white">{row.service}</td>
                                        <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{row.low}</td>
                                        <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10">{row.average}</td>
                                        <td className="p-4 rounded-r-xl font-mono text-slate-600 dark:text-slate-400">{row.high}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Market Segments</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">Analysis of budget vs premium players.</p>
                            <ul className="space-y-2">
                                {data.segments?.map((seg: string, i: number) => (
                                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5"></span>
                                        {seg}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                            <h4 className="font-bold text-yellow-800 dark:text-yellow-400 mb-2">Pricing Opportunities</h4>
                            <ul className="space-y-2">
                                {data.recommendations?.map((rec: string, i: number) => (
                                    <li key={i} className="text-sm text-yellow-900 dark:text-yellow-200 flex items-start gap-2">
                                        <DollarSign className="w-4 h-4 shrink-0 mt-0.5" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        />
    );
};
