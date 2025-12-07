import React from 'react';
import { ResearchTool } from './ResearchTool';
import { Check, X, ExternalLink } from 'lucide-react';

export const CompetitorInsights: React.FC = () => {
    return (
        <ResearchTool
            toolType="competitor-insights"
            title="Competitor Insights"
            description="Deep-dive analysis of your top local competitors. Uncover their ads, offers, pricing, and weaknesses."
            inputConfig={{
                fields: [
                    { key: 'city', label: 'City', placeholder: 'e.g. Austin, TX' },
                    { key: 'service', label: 'Service Niche', placeholder: 'e.g. Residential Plumbing' }
                ]
            }}
            renderResult={(data) => (
                <div className="space-y-8">
                    {/* Opportunities Summary */}
                    {data.opportunities && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide mb-2">Key Opportunities</h4>
                            <ul className="space-y-1">
                                {data.opportunities.map((opp: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-900 dark:text-emerald-300">
                                        <Check className="w-4 h-4 mt-0.5 shrink-0" />
                                        {opp}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Competitor Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {data.competitors?.map((comp: any, i: number) => (
                            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-indigo-300 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{comp.name}</h3>
                                        <div className="flex gap-2 mt-1">
                                            {comp.ads_running ? (
                                                <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded">Running Ads</span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded">No Ads</span>
                                            )}
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded">{comp.price_indicator} Price</span>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-bold px-2 py-1 rounded ${comp.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                                            comp.sentiment === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {comp.sentiment} Sentiment
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Current Offer</p>
                                        <p className="text-slate-800 dark:text-slate-200">{comp.offers || 'None detected'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Main Differentiator</p>
                                        <p className="text-slate-800 dark:text-slate-200">{comp.differentiators}</p>
                                    </div>
                                    <div className="md:col-span-2 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">
                                        <p className="text-xs font-bold text-red-500 uppercase mb-1">Detected Weakness</p>
                                        <p className="text-slate-800 dark:text-slate-200">{comp.weaknesses}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        />
    );
};
