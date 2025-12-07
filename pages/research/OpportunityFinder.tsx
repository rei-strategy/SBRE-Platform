import React from 'react';
import { ResearchTool } from './ResearchTool';
import { Lightbulb, Target, TrendingUp } from 'lucide-react';

export const OpportunityFinder: React.FC = () => {
    return (
        <ResearchTool
            toolType="opportunity-finder"
            title="Opportunity Finder"
            description="Discover untapped market opportunities, underserved neighborhoods, and high-demand services."
            inputConfig={{
                fields: [
                    { key: 'city', label: 'City', placeholder: 'e.g. Denver, CO' },
                    { key: 'service', label: 'Core Industry', placeholder: 'e.g. Electrician' }
                ]
            }}
            renderResult={(data) => (
                <div className="space-y-8">
                    {/* Top Score */}
                    <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-700">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mb-4">
                            <Lightbulb className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Opportunity Score: <span className="text-indigo-600 dark:text-indigo-400">{data.score || 85}</span>/100</h2>
                        <p className="text-slate-500 max-w-lg mx-auto mt-2">Based on local demand volume vs competition density.</p>
                    </div>

                    {/* Main Opportunities */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900 dark:text-white">Top Growth Areas</h3>
                            {data.opportunities?.map((opp: string, i: number) => (
                                <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-3">
                                    <TrendingUp className="w-5 h-5 text-green-500 shrink-0" />
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{opp}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900 dark:text-white">Recommended Campaigns</h3>
                            {data.recommended_campaigns?.map((camp: string, i: number) => (
                                <div key={i} className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex gap-3">
                                    <Target className="w-5 h-5 text-indigo-500 shrink-0" />
                                    <p className="text-sm text-indigo-900 dark:text-indigo-200">{camp}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Services to Add */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Services you should add</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.recommended_services?.map((srv: string, i: number) => (
                                <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium">
                                    + {srv}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        />
    );
};
