import React from 'react';
import { ResearchTool } from './ResearchTool';
import { BarChart2, Globe, AlertCircle, Link } from 'lucide-react';

export const SEOAudit: React.FC = () => {
    return (
        <ResearchTool
            toolType="seo-audit"
            title="SEO Audit"
            description="Analyze your website's search performance, content gaps, and technical health."
            inputConfig={{
                fields: [
                    { key: 'website', label: 'Website URL', placeholder: 'e.g. www.yoursite.com' }
                ]
            }}
            renderResult={(data) => (
                <div className="space-y-8">
                    {/* Score Hero */}
                    <div className="flex items-center justify-between bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-6 rounded-xl">
                        <div>
                            <h3 className="text-lg font-bold">SEO Health Score</h3>
                            <p className="text-slate-400 dark:text-slate-500 text-sm">Based on domain authority & technical factors</p>
                        </div>
                        <div className="text-5xl font-black">{data.site_score || '--'}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Missing Keywords */}
                        <div className="border border-slate-200 dark:border-slate-700 p-5 rounded-xl">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500" /> Missing Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {data.keywords_missing?.map((kw: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Content Gaps */}
                        <div className="border border-slate-200 dark:border-slate-700 p-5 rounded-xl">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-500" /> Content Gaps
                            </h4>
                            <ul className="space-y-2">
                                {data.content_gaps?.map((gap: string, i: number) => (
                                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400">• {gap}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3">Fix Instructions</h4>
                        <div className="space-y-3">
                            {data.recommendations?.map((rec: string, i: number) => (
                                <div key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                    <span className="font-bold text-indigo-500">{i + 1}.</span> {rec}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        />
    );
};
