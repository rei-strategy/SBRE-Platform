import React from 'react';
import { ResearchTool } from './ResearchTool';
import { Rocket, CheckSquare, Calendar, BarChart } from 'lucide-react';

export const GrowthPlanGenerator: React.FC = () => {
    return (
        <ResearchTool
            toolType="growth-plan-generator"
            title="Growth Plan Generator"
            description="Generate a step-by-step 30, 60, and 90-day execution plan to scale your business."
            inputConfig={{
                fields: [
                    { key: 'business_info', label: 'Business Context', type: 'textarea', placeholder: 'Describe your current revenue, team size, and main goals...' }
                ]
            }}
            renderResult={(data) => (
                <div className="space-y-8">
                    {/* 30 Day Plan */}
                    <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900 ml-4 space-y-8">
                        {data.plan_30?.map((step: any, i: number) => (
                            <div key={i} className="relative pl-8">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-800" />
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{step.focus}</h4>
                                        <span className="text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">Day {step.day}</span>
                                    </div>
                                    <ul className="space-y-2 mt-3">
                                        {step.tasks?.map((task: string, t: number) => (
                                            <li key={t} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <CheckSquare className="w-4 h-4 mt-0.5 shrink-0 text-slate-300" />
                                                {task}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {data.KPIs?.slice(0, 3).map((kpi: string, i: number) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center">
                                <BarChart className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{kpi}</p>
                            </div>
                        ))}
                    </div>

                    {/* High Impact Actions */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="font-bold flex items-center gap-2 mb-4">
                            <Rocket className="w-5 h-5" /> High Impact Quick Wins
                        </h3>
                        <ul className="space-y-2">
                            {data.high_impact_actions?.map((action: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-sm font-medium">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full" /> {action}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        />
    );
};
