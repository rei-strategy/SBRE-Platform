import React, { useEffect, useState } from 'react';
import { AdsService } from '../../services/adsService';
import { AttributionRecord, AttributionKPIs, CustomerJourneyPath, AttributionInsight } from '../../types';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
    Loader2, Users, DollarSign, Target, TrendingUp, ArrowRight,
    Filter, Download, Calendar, Activity, Zap, Info, Layers, RefreshCw
} from 'lucide-react';

const COLORS = ['#3266d3', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export const AttributionPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [model, setModel] = useState('DATA_DRIVEN');

    const [kpis, setKpis] = useState<AttributionKPIs | null>(null);
    const [channels, setChannels] = useState<AttributionRecord[]>([]);
    const [journeys, setJourneys] = useState<CustomerJourneyPath[]>([]);
    const [insights, setInsights] = useState<AttributionInsight[]>([]);

    useEffect(() => {
        loadData();
    }, [dateRange, model]);

    const loadData = async () => {
        setLoading(true);
        const [kpiData, channelData, journeyData, insightData] = await Promise.all([
            AdsService.getAttributionKPIs(),
            AdsService.getAttribution(),
            AdsService.getCustomerJourneys(),
            AdsService.getAttributionInsights()
        ]);
        setKpis(kpiData);
        setChannels(channelData);
        setJourneys(journeyData);
        setInsights(insightData);
        setLoading(false);
    };

    const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

    const renderKPICard = (title: string, value: string | number, subtext: string, icon: any, color: string) => (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">{title}</p>
                <div className={`p-1.5 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
                    {React.createElement(icon, { className: `w-4 h-4 ${color.replace('bg-', 'text-')}` })}
                </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">{subtext}</p>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                    <RefreshCw className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Analyzing Attribution Models...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Lead Attribution
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full border border-purple-200">AI Powered</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Multi-touch analysis across Meta, Google, and Organic.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* Attribution Model Selector */}
                    <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-4">
                        <span className="text-xs font-bold text-slate-500 uppercase">Model:</span>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-sm font-bold text-slate-900 dark:text-white py-1.5 px-3 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="LAST_TOUCH">Last Touch</option>
                            <option value="FIRST_TOUCH">First Touch</option>
                            <option value="LINEAR">Linear</option>
                            <option value="DATA_DRIVEN">Data-Driven (AI)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-sm font-medium text-slate-900 dark:text-white py-1.5 px-3 focus:ring-2 focus:ring-blue-500"
                        >
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Quarter</option>
                            <option>Year to Date</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderKPICard('Revenue Attributed', formatCurrency(kpis?.totalRevenue || 0), '+12% vs previous', DollarSign, 'bg-green-500')}
                {renderKPICard('Total Leads', kpis?.totalLeads || 0, 'Cost per Lead: $42', Users, 'bg-blue-500')}
                {renderKPICard('Global ROAS', `${kpis?.roas}x`, 'Return on Ad Spend', Target, 'bg-indigo-500')}
                {renderKPICard('Avg Touchpoints', kpis?.avgTouchpoints || 0, 'To conversion', Layers, 'bg-orange-500')}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Journey Top Paths */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Top Conversion Paths</h3>
                            <p className="text-slate-500 text-sm">Most common journeys leading to a booking.</p>
                        </div>
                        <button className="text-blue-600 text-sm font-bold hover:underline">View All Paths</button>
                    </div>

                    <div className="space-y-4">
                        {journeys.map((journey, idx) => (
                            <div key={journey.id} className="relative">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                                    <div className="flex items-center flex-wrap gap-2 flex-1">
                                        <div className="text-xs font-bold text-slate-400 w-6">#{idx + 1}</div>
                                        {journey.path.map((step, stepIdx) => (
                                            <React.Fragment key={stepIdx}>
                                                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm ${step.includes('Meta') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    step.includes('Google') ? 'bg-red-50 text-red-700 border-red-200' :
                                                        step.includes('Organic') ? 'bg-green-50 text-green-700 border-green-200' :
                                                            'bg-slate-100 text-slate-700 border-slate-200'
                                                    }`}>
                                                    {step}
                                                </div>
                                                {stepIdx < journey.path.length - 1 && (
                                                    <ArrowRight className="w-3 h-3 text-slate-300" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-6 md:border-l md:border-slate-200 md:pl-6">
                                        <div className="text-center">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">{journey.conversions}</div>
                                            <div className="text-[10px] uppercase text-slate-400 font-bold">Conv.</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm font-bold text-green-600">{formatCurrency(journey.revenue)}</div>
                                            <div className="text-[10px] uppercase text-slate-400 font-bold">Rev.</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm font-bold text-slate-500">{journey.avgDays}d</div>
                                            <div className="text-[10px] uppercase text-slate-400 font-bold">Time</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Attribution Insights */}
                <div className="bg-indigo-900 text-white rounded-xl shadow-lg border border-indigo-800 p-6 relative overflow-hidden flex flex-col">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <h3 className="font-bold text-lg">Attribution Intelligence</h3>
                        </div>

                        <div className="space-y-4 flex-1">
                            {insights.map(insight => (
                                <div key={insight.id} className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${insight.type === 'OPPORTUNITY' ? 'bg-green-500/20 text-green-300' :
                                            insight.type === 'WARNING' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                                            }`}>{insight.type}</span>
                                        {insight.impact && <span className="text-[10px] text-indigo-200">Impact: {insight.impact}</span>}
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed opacity-90">{insight.message}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10">
                            <h4 className="text-xs font-bold uppercase text-indigo-300 mb-2">Recommendation</h4>
                            <p className="text-sm opacity-80">
                                Based on {model.toLowerCase().replace('_', ' ')} modeling, increasing Meta budget by 15% could lift overall blended ROAS by 0.4x.
                            </p>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
                </div>
            </div>

            {/* Detailed Channel Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Channel Performance</h3>
                        <p className="text-xs text-slate-500 mt-1">Comparing First Touch vs. Last Touch impacts</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 border border-transparent hover:border-slate-200 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 border border-transparent hover:border-slate-200 transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 font-bold">Channel Source</th>
                                <th className="px-6 py-4 font-bold">Role</th>
                                <th className="px-6 py-4 font-bold text-right">Spend</th>
                                <th className="px-6 py-4 font-bold text-right">Leads</th>
                                <th className="px-6 py-4 font-bold text-right">Conversions</th>
                                <th className="px-6 py-4 font-bold text-right">AOV</th>
                                <th className="px-6 py-4 font-bold text-right text-blue-600">Assisted</th>
                                <th className="px-6 py-4 font-bold text-right">Revenue</th>
                                <th className="px-6 py-4 font-bold text-right">ROAS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {channels.map((channel, i) => {
                                const aov = channel.jobsBooked > 0 ? channel.revenue / channel.jobsBooked : 0;
                                const isInitiator = channel.subChannel?.includes('REELS') || channel.subChannel?.includes('YOUTUBE') || channel.source.includes('Awareness');
                                const role = isInitiator ? 'Initiator' : (channel.assistedConversions > channel.jobsBooked ? 'Influencer' : 'Closer');

                                return (
                                    <tr key={channel.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    {channel.source}
                                                    {channel.platform === 'META' && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">Meta</span>}
                                                    {channel.platform === 'GOOGLE' && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">Google</span>}
                                                </div>
                                                {channel.subChannel && (
                                                    <div className="text-xs text-slate-400 font-normal mt-0.5">{channel.subChannel.replace('META_', '').replace('GOOGLE_', '').replace('_', ' ')}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${role === 'Initiator' ? 'bg-purple-100 text-purple-700' :
                                                    role === 'Influencer' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-500">
                                            {channel.spend ? formatCurrency(channel.spend) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium">{channel.leadsCount}</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                                            {channel.jobsBooked}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-600">
                                            {formatCurrency(aov)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-blue-600 bg-blue-50/50 dark:bg-blue-900/10">
                                            {channel.assistedConversions}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-green-600">
                                            {formatCurrency(channel.revenue)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {channel.roi ?
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${channel.roi > 3 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {channel.roi}x
                                                </span>
                                                : '-'
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Info Card */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-slate-400 mt-0.5" />
                <div className="text-sm text-slate-500 space-y-1">
                    <p><strong>Data-Driven Model:</strong> Uses machine learning to assign credit to each touchpoint based on its statistical probability of influencing the conversion.</p>
                    <p>Data last synced: Just now. Conversion window: 30 days click, 1 day view.</p>
                </div>
            </div>
        </div>
    );
};
