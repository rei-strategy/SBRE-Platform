import React, { useState, useEffect } from 'react';
import { AdsService } from '../../services/adsService';
import { AdCampaign } from '../../types';
import {
    Calendar, ChevronDown, Filter, Download, DollarSign, Eye, MousePointer,
    Target, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight,
    Sparkles, RefreshCw, Layers, PieChart, BarChart3, Activity, Zap, CheckCircle2
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';

export const AdsDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [platformFilter, setPlatformFilter] = useState('ALL');
    const [subChannelFilter, setSubChannelFilter] = useState('ALL');

    const [stats, setStats] = useState<any>(null);
    const [trends, setTrends] = useState<any[]>([]);
    const [insights, setInsights] = useState<any[]>([]);
    const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
    const [anomalies, setAnomalies] = useState<any[]>([]);
    const [attribution, setAttribution] = useState<any[]>([]);

    useEffect(() => {
        loadDashboardData();
    }, [dateRange, platformFilter]);

    const loadDashboardData = async () => {
        setLoading(true);
        const [statsData, trendData, insightData, campaignData, anomalyData, attributionData] = await Promise.all([
            AdsService.getDashboardStats(),
            AdsService.getTrendData(dateRange),
            AdsService.getAIInsights(),
            AdsService.getCampaigns(),
            AdsService.getAnomalies(),
            AdsService.getAttribution()
        ]);

        setStats(statsData);
        setTrends(trendData);
        setInsights(insightData);
        setCampaigns(campaignData);
        setAnomalies(anomalyData);
        setAttribution(attributionData);
        setLoading(false);
    };

    const getChartKeys = () => {
        if (subChannelFilter === 'META_IG_REELS') return { spend: 'reelsSpend', conv: 'conversions' };
        if (subChannelFilter === 'GOOGLE_SEARCH') return { spend: 'searchSpend', conv: 'conversions' };
        if (subChannelFilter === 'YOUTUBE_ADS') return { spend: 'youtubeSpend', conv: 'conversions' };
        // Fallback or ALL
        return { spend: 'spend', conv: 'conversions' };
    };

    const keys = getChartKeys();

    const getSubChannelBadge = (sub: string) => {
        switch (sub) {
            case 'META_IG_REELS': return <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-xs font-bold border border-pink-200">IG Reels</span>;
            case 'META_FB_FEED': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-200">FB Feed</span>;
            case 'META_IG_FEED': return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold border border-purple-200">IG Feed</span>;
            case 'GOOGLE_SEARCH': return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold border border-blue-200">Search</span>;
            case 'YOUTUBE_ADS': return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold border border-red-200">YouTube</span>;
            case 'GOOGLE_LOCAL_SERVICES': return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold border border-green-200">LSA</span>;
            case 'GOOGLE_DISPLAY': return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold border border-orange-200">Display</span>;
            case 'META_MIX': return <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold border border-indigo-200">Advantage+</span>;
            default: return <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">Other</span>;
        }
    }

    // Winner Calculation (Mock Logic based on loaded data)
    const winner = attribution.reduce((prev, current) => (prev.roi > current.roi) ? prev : current, { roi: 0, source: 'None' });

    const KpiCard = ({ title, value, subValue, trend, trendValue, icon: Icon, colorClass }: any) => (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
                    <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
                {trend && (
                    <div className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {trendValue}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{value}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mt-1">{title}</p>
                {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
            </div>
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-700 mt-4 rounded-full overflow-hidden">
                <div className={`h-full ${trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: '65%' }}></div>
            </div>
        </div>
    );

    const renderInsightsPanel = () => (
        <div className="bg-indigo-900 text-white rounded-xl overflow-hidden shadow-lg border border-indigo-800">
            <div className="p-4 border-b border-indigo-800 flex justify-between items-center bg-indigo-950/50">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-bold">AI Intelligence Engine</h3>
                </div>
                <span className="text-xs bg-indigo-800 px-2 py-1 rounded border border-indigo-700">Live Analysis</span>
            </div>
            <div className="p-5 space-y-4">
                {insights.map((insight) => (
                    <div key={insight.id} className="flex gap-3 items-start bg-indigo-800/50 p-3 rounded-lg border border-indigo-700/50">
                        <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${insight.type === 'OPPORTUNITY' ? 'bg-green-500/20 text-green-400' :
                            insight.type === 'WARNING' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            {insight.type === 'OPPORTUNITY' ? <TrendingUp className="w-4 h-4" /> :
                                insight.type === 'WARNING' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className="text-sm font-medium leading-relaxed opacity-90">{insight.text}</p>
                            <div className="flex gap-2 mt-2">
                                <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors font-semibold">Apply Fix</button>
                                <button className="text-xs text-indigo-300 hover:text-white px-2 py-1">Dismiss</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 bg-indigo-950/30 border-t border-indigo-800 text-center">
                <button className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 justify-center mx-auto">
                    View Full Analysis Report <ChevronDown className="w-3 h-3" />
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Analyzing Campaign Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Unified Ads Intelligence
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200">BETA</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Cross-platform performance analytics for Meta & Google.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm">
                        <button
                            onClick={() => setPlatformFilter('ALL')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${platformFilter === 'ALL' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setPlatformFilter('META')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${platformFilter === 'META' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Meta
                        </button>
                        <button
                            onClick={() => setPlatformFilter('GOOGLE')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${platformFilter === 'GOOGLE' ? 'bg-red-500 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Google
                        </button>
                    </div>

                    <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {dateRange}
                        <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                    </button>

                    <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            {/* Anomalies Banner */}
            {anomalies.length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex items-start gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg text-orange-600 dark:text-orange-400">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-orange-800 dark:text-orange-200">Anomaly Detected</h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                            Your Google Ads <strong>CPC</strong> spiked by <span className="font-bold">25%</span> in the last 24 hours. Consider pausing "Search - Mobile Detailers" to investigate keyword competition.
                        </p>
                    </div>
                    <button className="text-sm font-bold text-orange-700 hover:underline px-3 py-1">Check Campaign</button>
                </div>
            )}

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Total Spend"
                    value={`$${stats?.spend.toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="bg-blue-500"
                    trend="up"
                    trendValue="4.2%"
                    subValue="On track with monthly budget"
                />
                <KpiCard
                    title="Total Conversions"
                    value={stats?.conversions}
                    icon={CheckCircle2}
                    colorClass="bg-green-500"
                    trend="up"
                    trendValue="12%"
                    subValue="Cost per booking: $42.50"
                />
                <KpiCard
                    title="Avg. CPC"
                    value={`$${stats?.cpc.toFixed(2)}`}
                    icon={MousePointer}
                    colorClass="bg-purple-500"
                    trend="down"
                    trendValue="2.1%"
                    subValue="vs $2.95 last period"
                />

                {/* Dynamic Winner Card */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-1 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <PieChart className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Top Performer</span>
                        </div>
                        <h3 className="text-xl font-bold">{winner.source}</h3>
                        <p className="text-sm text-slate-300 mt-1">Highest ROAS at <span className="font-bold text-green-400">{winner.roi}x</span>.</p>
                    </div>
                    <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Charts */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Trend Chart */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance Trends</h3>
                                <p className="text-sm text-slate-500">Spend vs. Conversions (Last 14 Days)</p>
                            </div>
                            <div className="flex gap-4">
                                <select
                                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={subChannelFilter}
                                    onChange={(e) => setSubChannelFilter(e.target.value)}
                                >
                                    <option value="ALL">All Channels</option>
                                    <option value="META_IG_REELS">Instagram Reels</option>
                                    <option value="GOOGLE_SEARCH">Google Search</option>
                                    <option value="YOUTUBE_ADS">YouTube Ads</option>
                                </select>
                                <div className="flex gap-2 items-center">
                                    <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Spend</span>
                                    <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Leads</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trends}>
                                    <defs>
                                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3266d3" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3266d3" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area yAxisId="left" type="monotone" dataKey={keys.spend} stroke="#3266d3" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" name="Ad Spend" />
                                    <Area yAxisId="right" type="monotone" dataKey={keys.conv} stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorConv)" name="Conversions" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Unified Campaigns Table */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white">Active Campaigns</h3>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500">
                                    <Filter className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 font-bold">Channel</th>
                                        <th className="px-6 py-3 font-bold">Campaign</th>
                                        <th className="px-6 py-3 font-bold">Status</th>
                                        <th className="px-6 py-3 font-bold text-right">Spend</th>
                                        <th className="px-6 py-3 font-bold text-right">Results</th>
                                        <th className="px-6 py-3 font-bold text-right">CPA</th>
                                        <th className="px-6 py-3 font-bold text-right">ROAS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {campaigns.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                {c.subChannel ? getSubChannelBadge(c.subChannel) : (c.platform === 'META' ?
                                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">META</span> :
                                                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">GOOGLE</span>)
                                                }
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                {c.name}
                                                <div className="text-xs text-slate-400 font-normal truncate max-w-[200px]">{c.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${c.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                                    <span className="text-slate-600 dark:text-slate-300 capitalize">{c.status.toLowerCase()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono">${c.spend.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-bold">{c.conversions}</td>
                                            <td className="px-6 py-4 text-right text-slate-500">
                                                ${c.conversions > 0 ? (c.spend / c.conversions).toFixed(2) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-green-600">
                                                {c.roi}x
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Insights & Breakdown */}
                <div className="space-y-6">
                    {renderInsightsPanel()}

                    {/* Sub-Channel / Placement Breakdown */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Layers className="w-4 h-4 text-slate-400" /> Channels & Placements
                            </h3>
                            <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><Filter className="w-3 h-3" /></button>
                        </div>

                        <div className="space-y-4">
                            {attribution.filter(a => a.platform !== 'DIRECT' && a.platform !== 'ORGANIC' && a.platform !== 'REFERRAL').map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1 px-1">
                                        <span className="font-medium text-slate-700 dark:text-slate-200">{item.source}</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{item.roi}x ROAS</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden mb-1">
                                        <div
                                            className={`h-2 rounded-full ${item.platform === 'META' ? 'bg-blue-500' : 'bg-red-500'}`}
                                            style={{ width: `${Math.min(100, (item.revenue / 20000) * 100)}%` }} // Mock scaling
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 mt-0.5 px-1">
                                        <span>${item.costPerAcquisition} CPA</span>
                                        <span>{item.leadsCount} Leads</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Attribution Info */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Activity className="w-4 h-4 text-slate-400" /> Attribution
                            </h3>
                            <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">Last Touch</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Conversions are attributed to the last ad clicked within a <strong>30-day window</strong>.
                        </p>
                        <hr className="my-4 border-slate-100 dark:border-slate-700" />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Avg. Path Length</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">3.2 days</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Touchpoints</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">4.5 avg</p>
                            </div>
                        </div>
                    </div>

                    {/* Funnel/Conversion Chart Block */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-slate-400" /> Conversion Funnel
                        </h3>
                        <div className="space-y-1">
                            {/* Simple Funnel Viz */}
                            <div className="relative h-8 bg-blue-100 dark:bg-blue-900/30 w-full mb-1 rounded-sm flex items-center px-2">
                                <span className="text-xs font-bold text-blue-800 dark:text-blue-300">Impressions (45k)</span>
                            </div>
                            <div className="relative h-8 bg-blue-200 dark:bg-blue-800/40 w-[60%] mx-auto mb-1 rounded-sm flex items-center px-2">
                                <span className="text-xs font-bold text-blue-900 dark:text-blue-200">Clicks (1.2k)</span>
                            </div>
                            <div className="relative h-8 bg-blue-300 dark:bg-blue-700/50 w-[30%] mx-auto mb-1 rounded-sm flex items-center px-2">
                                <span className="text-xs font-bold text-blue-950 dark:text-white">Leads (85)</span>
                            </div>
                            <div className="relative h-8 bg-green-400 dark:bg-green-600 w-[15%] mx-auto rounded-sm flex items-center px-2">
                                <span className="text-xs font-bold text-white">Sales (12)</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
