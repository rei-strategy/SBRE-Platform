import React from 'react';
import { ResearchTool } from './ResearchTool';
import { Search, Target, MousePointer } from 'lucide-react';

export const KeywordDiscovery: React.FC = () => {
    return (
        <ResearchTool
            toolType="keyword-discovery"
            title="Keyword Discovery"
            description="Find high-intent keywords that your competitors are missing."
            inputConfig={{
                fields: [
                    { key: 'city', label: 'City', placeholder: 'e.g. Chicago, IL' },
                    { key: 'service', label: 'Service Category', placeholder: 'e.g. Lawn Care' }
                ]
            }}
            renderResult={(data) => (
                <div className="space-y-6">
                    {/* Scores */}
                    <div className="flex gap-4 mb-6">
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl flex-1">
                            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{data.difficulty_scores?.overall || '--'}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase mt-1">Difficulty Score</div>
                        </div>
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl flex-1">
                            <div className="text-3xl font-black text-teal-600 dark:text-teal-400">{data.keywords?.length || 0}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase mt-1">Keywords Found</div>
                        </div>
                    </div>

                    {/* Keywords Table */}
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-4">Keyword</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Est. Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {data.keywords?.map((kw: any, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-4 font-medium text-slate-900 dark:text-white">{kw.term}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400 capitalize">
                                                {kw.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1">
                                                <div className={`w-2 h-2 rounded-full ${kw.volume_est === 'high' ? 'bg-green-500' :
                                                        kw.volume_est === 'med' ? 'bg-yellow-500' : 'bg-slate-300'
                                                    }`} />
                                                <span className="capitalize text-slate-600 dark:text-slate-400">{kw.volume_est}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                        <h4 className="font-bold text-indigo-900 dark:text-white mb-3">Keyword Strategy</h4>
                        <ul className="space-y-2">
                            {data.recommendations?.map((rec: string, i: number) => (
                                <li key={i} className="text-sm text-indigo-800 dark:text-indigo-200 flex gap-2">
                                    <Target className="w-4 h-4 shrink-0 mt-0.5" /> {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        />
    );
};
