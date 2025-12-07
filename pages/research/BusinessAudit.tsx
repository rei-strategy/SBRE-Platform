import React from 'react';
import { ResearchTool } from './ResearchTool';
import { CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const BusinessAudit: React.FC = () => {
    return (
        <ResearchTool
            toolType="business-audit"
            title="Business 360 Audit"
            description="Comprehensive analysis of your marketing, operations, and brand presence."
            inputConfig={{
                fields: [
                    { key: 'business_info', label: 'Business Description & Website', type: 'textarea', placeholder: 'e.g. Joe\'s Plumbing at www.joesplumbing.com. We do residential service and repair...' }
                ]
            }}
            renderResult={(data) => (
                <div className="space-y-8">
                    {/* SWOT Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-900/10 p-5 rounded-xl">
                            <h3 className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2 mb-4">
                                <CheckCircle className="w-5 h-5" /> Strengths
                            </h3>
                            <ul className="space-y-2">
                                {data.strengths?.map((s: string, i: number) => (
                                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 pl-4 border-l-2 border-green-300 dark:border-green-700">{s}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-900/10 p-5 rounded-xl">
                            <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-4">
                                <XCircle className="w-5 h-5" /> Weaknesses
                            </h3>
                            <ul className="space-y-2">
                                {data.weaknesses?.map((w: string, i: number) => (
                                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 pl-4 border-l-2 border-red-300 dark:border-red-700">{w}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Roadmaps */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Action Plan</h3>

                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 border-b border-slate-200 dark:border-slate-700 font-bold text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                                Next 30 Days (Quick Wins)
                            </div>
                            <div className="p-5 space-y-3">
                                {data.roadmap_30_days?.map((item: string, i: number) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 border-b border-slate-200 dark:border-slate-700 font-bold text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400">
                                90 Day Strategic Goals
                            </div>
                            <div className="p-5 space-y-3">
                                {data.roadmap_90_days?.map((item: string, i: number) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        />
    );
};
