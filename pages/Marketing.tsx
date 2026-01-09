
import React, { useMemo, useState, useEffect } from 'react';
import { EmailCampaign, CampaignStatus } from '../types';
import { useAppStore } from '../store';
import { supabase } from '../supabaseClient';
import { AdsService } from '../services/adsService';
import {
    Megaphone, MousePointerClick, MailOpen, TrendingUp,
    Smartphone, Mail, ChevronRight, BarChart3, Zap, PlayCircle, Loader2, Target
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { format, subDays, isSameDay, parseISO, startOfDay } from 'date-fns';

interface MarketingProps {
    campaigns: EmailCampaign[];
}

export const Marketing: React.FC<MarketingProps> = ({ campaigns }) => {
    const { marketingAutomations } = useAppStore();
    const [recentRuns, setRecentRuns] = useState<any[]>([]);

    // Fetch recent automation runs for the chart
    useEffect(() => {
        const fetchRecentRuns = async () => {
            const { data } = await supabase
                .from('automation_runs')
                .select('created_at, automation_id, status')
                .gte('created_at', subDays(new Date(), 7).toISOString());

            if (data) setRecentRuns(data);
        };
        fetchRecentRuns();
    }, []);

    const [adStats, setAdStats] = useState<any>(null);
    useEffect(() => {
        const loadAds = async () => {
            const stats = await AdsService.getDashboardStats();
            setAdStats(stats);
        };
        loadAds();
    }, []);

    // --- REAL Metrics Calculation ---
    const metrics = useMemo(() => {
        // Campaign Metrics
        const sentCampaigns = campaigns.filter(c => c.status === 'SENT' || c.status === 'SENDING');
        const totalSent = sentCampaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
        const totalOpened = sentCampaigns.reduce((sum, c) => sum + (c.openCount || 0), 0);
        const totalClicked = sentCampaigns.reduce((sum, c) => sum + (c.clickCount || 0), 0);
        const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
        const avgClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;

        // Automation Metrics
        const activeAutomations = marketingAutomations.filter(a => a.isActive).length;
        const totalAutomationRuns = marketingAutomations.reduce((sum, a) => sum + (a.stats?.runs || 0), 0);

        return { totalSent, avgOpenRate, avgClickRate, activeAutomations, totalAutomationRuns };
    }, [campaigns, marketingAutomations]);

    // --- Real Chart Data (Last 7 Days) ---
    const chartData = useMemo(() => {
        const today = new Date();
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = subDays(today, 6 - i);
            return d;
        });

        return last7Days.map(day => {
            // Campaigns on this day
            const campaignsOnDay = campaigns.filter(c => {
                if (!c.scheduleTime) return false;
                return isSameDay(parseISO(c.scheduleTime), day);
            });
            const campaignCount = campaignsOnDay.reduce((sum, c) => sum + (c.sentCount || 0), 0);

            // Automation Runs on this day
            const runsOnDay = recentRuns.filter(r => isSameDay(parseISO(r.created_at), day));
            const automationCount = runsOnDay.length;

            return {
                name: format(day, 'EEE'), // Mon, Tue...
                campaigns: campaignCount,
                automations: automationCount,
                date: format(day, 'MMM d')
            };
        });
    }, [campaigns, recentRuns]);

    const recentCampaigns = [...campaigns].sort((a, b) => {
        const dateA = new Date(a.scheduleTime || a.createdAt).getTime();
        const dateB = new Date(b.scheduleTime || b.createdAt).getTime();
        return dateB - dateA;
    }).slice(0, 3);

    const recentAutomations = [...marketingAutomations]
        .filter(a => a.isActive)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto pb-10 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Marketing Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Track your campaigns and automation performance.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Megaphone className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Campaign Emails</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{metrics.totalSent.toLocaleString()}</h3>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                            <Zap className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Active Automations</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{metrics.activeAutomations}</h3>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <PlayCircle className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Auto-Runs</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{metrics.totalAutomationRuns.toLocaleString()}</h3>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                            <MailOpen className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Avg. Open Rate</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{metrics.avgOpenRate.toFixed(1)}%</h3>
                </div>
            </div>

            {/* PAID ADS SNAPSHOT (New) */}
            <Link to="/marketing/ads" className="block transform transition-transform hover:scale-[1.01]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Total Ad Spend</p>
                        <h3 className="text-3xl font-bold mb-4">{adStats ? `$${adStats.spend.toLocaleString()}` : <Loader2 className="w-6 h-6 animate-spin" />}</h3>
                        <div className="flex items-center gap-2 text-xs font-medium bg-white/20 w-fit px-2 py-1 rounded-lg">
                            <TrendingUp className="w-3 h-3" />
                            Paid Media (Meta + Google)
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Impressions</p>
                            <BarChart3 className="w-4 h-4 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            {adStats ? adStats.impressions.toLocaleString() : '-'}
                        </h3>
                        <p className="text-xs text-green-500 font-bold">+12% vs last month</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Blended ROI</p>
                            <Target className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {adStats ? `${adStats.roi}x` : '-'}
                            </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Return on Ad Spend</p>
                    </div>
                </div>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity Volume (Last 7 Days)</h3>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-slate-600 dark:text-slate-400">Campaigns</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500" />
                                <span className="text-slate-600 dark:text-slate-400">Automations</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full min-w-0" style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCampaigns" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3266d3" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3266d3" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAutomations" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    labelFormatter={(label) => label}
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="campaigns"
                                    name="Campaign Emails"
                                    stroke="#3266d3"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCampaigns)"
                                    stackId="1"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="automations"
                                    name="Automation Actions"
                                    stroke="#a855f7"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAutomations)"
                                    stackId="1"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions / Recent Activity */}
                <div className="space-y-6">

                    {/* Quick Create */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg border border-slate-700">
                        <h3 className="font-bold text-lg mb-2">Create Campaign</h3>
                        <p className="text-slate-300 text-sm mb-4">Send a blast to your customers to drive bookings.</p>
                        <div className="flex gap-3">
                            <Link to="/marketing/campaigns/new" className="flex-1 bg-white text-slate-900 py-2.5 rounded-lg text-sm font-bold text-center hover:bg-slate-100 transition-colors">
                                Email Blast
                            </Link>
                            <Link to="/marketing/automations/new" className="flex-1 bg-slate-700 text-white py-2.5 rounded-lg text-sm font-bold text-center hover:bg-slate-600 border border-slate-600">
                                Automation
                            </Link>
                        </div>
                    </div>

                    {/* Recent Campaigns */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white">Recent Campaigns</h3>
                            <Link to="/marketing/campaigns" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">View All</Link>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {recentCampaigns.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-sm">
                                    No campaigns sent yet.
                                </div>
                            ) : (
                                recentCampaigns.map(campaign => (
                                    <Link to={`/marketing/campaigns/${campaign.id}`} key={campaign.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors block">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-600`}>
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{campaign.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                {campaign.scheduleTime ? `Sent ${format(parseISO(campaign.scheduleTime), 'MMM d')}` : 'Draft'}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Active Automations */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white">Active Automations</h3>
                            <Link to="/marketing/automations" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">View All</Link>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {recentAutomations.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-sm">
                                    No active automations.
                                </div>
                            ) : (
                                recentAutomations.map(automation => (
                                    <Link to={`/marketing/automations/${automation.id}`} key={automation.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors block">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-purple-100 text-purple-600`}>
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{automation.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                {automation.triggerType.replace(/_/g, ' ')} • {automation.stats?.runs || 0} Runs
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
