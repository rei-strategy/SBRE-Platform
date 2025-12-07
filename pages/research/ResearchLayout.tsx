import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    Users, TrendingUp, Search, Building2,
    DollarSign, BarChart2, Lightbulb, Rocket
} from 'lucide-react';

const TOOLS = [
    { path: 'competitor-insights', label: 'Competitor Insights', icon: Users, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { path: 'market-trends', label: 'Market Trends', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { path: 'keyword-discovery', label: 'Keyword Discovery', icon: Search, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { path: 'business-audit', label: 'Business Audit', icon: Building2, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { path: 'pricing-benchmarks', label: 'Pricing Benchmarks', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { path: 'seo-audit', label: 'SEO Audit', icon: BarChart2, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
    { path: 'opportunity-finder', label: 'Opportunity Finder', icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { path: 'growth-plan-generator', label: 'Growth Plan', icon: Rocket, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
];

export const ResearchLayout: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Market Research Intelligence</h1>
                    <p className="text-indigo-100 max-w-2xl">
                        Deep-dive into your market with AI-powered research tools. Analyze competitors, uncover trends, and build your growth roadmap using real-time internet data.
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                {TOOLS.map((tool) => (
                    <NavLink
                        key={tool.path}
                        to={`/research/${tool.path}`}
                        className={({ isActive }) => `
                            flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all border
                            ${isActive
                                ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-md text-indigo-600 dark:text-indigo-400'
                                : 'bg-white/50 dark:bg-slate-800/50 border-transparent hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}
                        `}
                    >
                        <div className={`p-1.5 rounded-lg ${tool.bg}`}>
                            <tool.icon className={`w-4 h-4 ${tool.color}`} />
                        </div>
                        <span className="font-semibold text-sm">{tool.label}</span>
                    </NavLink>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                <Outlet />
            </div>
        </div>
    );
};
