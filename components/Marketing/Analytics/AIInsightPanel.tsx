import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

interface Insight {
    type: 'OPPORTUNITY' | 'WARNING' | 'SUCCESS';
    text: string;
    impact?: string;
}

interface Props {
    insights: Insight[];
}

export const AIInsightPanel: React.FC<Props> = ({ insights }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Optimization</h3>
                </div>
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
            </div>

            <div className="p-4 space-y-4 flex-1">
                {insights.map((insight, idx) => (
                    <div key={idx} className="flex gap-3">
                        <div className={`mt-0.5 shrink-0 ${insight.type === 'OPPORTUNITY' ? 'text-green-500' :
                                insight.type === 'WARNING' ? 'text-red-500' : 'text-blue-500'
                            }`}>
                            {insight.type === 'OPPORTUNITY' ? <TrendingUp className="w-5 h-5" /> :
                                insight.type === 'WARNING' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">
                                {insight.text}
                            </p>
                            {insight.impact && (
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${insight.type === 'OPPORTUNITY' ? 'bg-green-50 text-green-700 border-green-200' :
                                            insight.type === 'WARNING' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                        Impact: {insight.impact}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700">
                <button className="w-full py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center justify-center gap-1 group">
                    Apply All Recommendations <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};
