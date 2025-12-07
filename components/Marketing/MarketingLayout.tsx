import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Search, Wand2, BrainCircuit, PieChart, ArrowLeft } from 'lucide-react';

interface MarketingLayoutProps {
    children: React.ReactNode;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Only show these tabs if we are in the Ads section
    const showAdsTabs = location.pathname.includes('/marketing/ads') ||
        location.pathname.includes('/marketing/meta') ||
        location.pathname.includes('/marketing/google') ||
        location.pathname.includes('/marketing/studio') ||
        location.pathname.includes('/marketing/intelligence') ||
        location.pathname.includes('/marketing/attribution');

    const navItems = [
        { path: '/marketing/ads', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/marketing/meta', label: 'Meta Ads', icon: Megaphone },
        { path: '/marketing/google', label: 'Google Ads', icon: Search },
        { path: '/marketing/studio', label: 'AI Studio', icon: Wand2 },
        { path: '/marketing/intelligence', label: 'Intelligence', icon: BrainCircuit },
        { path: '/marketing/attribution', label: 'Attribution', icon: PieChart },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Header with Back Button if deep in module */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 pt-6 pb-0 shadow-sm z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        {/* Only show back if not on main marketing overview */}
                        {location.pathname !== '/marketing' && (
                            <button
                                onClick={() => navigate('/marketing')}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {showAdsTabs ? 'Ads Intelligence' : 'Growth & Engagement'}
                                {showAdsTabs && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-bold">BETA</span>}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {showAdsTabs ? 'Manage your paid campaigns across Meta and Google.' : 'Overview of your marketing efforts.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Top Tab Navigation (Only for Ads Module) */}
                {showAdsTabs && (
                    <div className="flex gap-1 overflow-x-auto pb-0 custom-scrollbar">
                        {navItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap
                                    ${isActive
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300'}
                                `}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                {children}
            </div>
        </div>
    );
};
