import React, { useEffect, useState } from 'react';
import { AdsService } from '../../services/adsService';
import { AdCampaign } from '../../types';
import {
    AlertCircle, Search, Loader2, BarChart2, TrendingUp, MapPin, CheckCircle2,
    Sparkles, Youtube, Globe, LayoutGrid, Image, Plus
} from 'lucide-react';
import { CreateCampaignModal } from '../../components/Marketing/CreateCampaignModal';
// Shared Analytics Components
import { ChannelEducationCard } from '../../components/Marketing/Analytics/ChannelEducationCard';
import { ChannelKPIs } from '../../components/Marketing/Analytics/ChannelKPIs';
import { AIInsightPanel } from '../../components/Marketing/Analytics/AIInsightPanel';

const TABS = [
    { id: 'ALL', label: 'All Google', icon: LayoutGrid },
    { id: 'GOOGLE_SEARCH', label: 'Search', icon: Search },
    { id: 'YOUTUBE_ADS', label: 'YouTube', icon: Youtube },
    { id: 'GOOGLE_DISPLAY', label: 'Display', icon: Image },
    { id: 'GOOGLE_DISCOVERY', label: 'Discovery', icon: Globe },
];

export const GoogleAdsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('ALL');
    const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
    const [channelConfig, setChannelConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [configLoading, setConfigLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const loadCampaigns = async () => {
        const all = await AdsService.getCampaigns();
        setCampaigns(all.filter(c => c.platform === 'GOOGLE'));
        setLoading(false);
    };

    const loadChannelConfig = async (subChannelId: string) => {
        if (subChannelId === 'ALL') {
            setChannelConfig(null);
            return;
        }
        setConfigLoading(true);
        const config = await AdsService.getChannelConfig(subChannelId);
        setChannelConfig(config);
        setConfigLoading(false);
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    useEffect(() => {
        loadChannelConfig(activeTab);
    }, [activeTab]);

    const handleCreateCampaign = async (campaignData: Partial<AdCampaign>) => {
        await AdsService.createCampaign(campaignData);
        await loadCampaigns();
    };

    const renderAllView = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-700 pb-6">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Google Ads</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Search Network & Display Performance</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="text-sm font-medium text-slate-500 hover:text-slate-900">Account Settings</button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-blue-700"
                    >
                        New Campaign
                    </button>
                </div>
            </div>

            {/* Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase">Search Imp. Share</p>
                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Search className="w-4 h-4" /></div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">68.2%</h3>
                    <p className="text-xs text-green-500 font-bold mt-1">Top of page rate: 45%</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase">Avg. CPC</p>
                        <div className="p-1.5 bg-green-100 text-green-600 rounded-lg"><TrendingUp className="w-4 h-4" /></div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$2.85</h3>
                    <p className="text-xs text-slate-400 mt-1">-5% vs last month</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase">Conversions</p>
                        <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">45</h3>
                    <p className="text-xs text-slate-400 mt-1">Cost / Conv: $19.78</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase">Quality Score</p>
                        <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg"><BarChart2 className="w-4 h-4" /></div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">9/10</h3>
                    <p className="text-xs text-green-500 font-bold mt-1">Excellent</p>
                </div>
            </div>

            {/* Keyword Insights Panel - Keep existing component block logic for ALL view */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-400" /> Top Performing Search Terms</h3>
                            <p className="text-slate-400 text-sm">Based on last 7 days data</p>
                        </div>
                        <button className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">View Keyword Report</button>
                    </div>

                    <div className="space-y-3 relative z-10">
                        {[
                            { term: "mobile detailing near me", click: 154, ctr: '8.2%', cpc: "$1.20", score: 9.5 },
                            { term: "car wash dallas", click: 98, ctr: '5.1%', cpc: "$0.90", score: 8.2 },
                            { term: "ceramic coating price", click: 45, ctr: '3.4%', cpc: "$3.50", score: 7.8 }
                        ].map((k, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                                <div>
                                    <p className="font-mono text-sm text-green-400 mb-1">"{k.term}"</p>
                                    <div className="flex gap-3 text-xs text-slate-400">
                                        <span>{k.click} Clicks</span>
                                        <span>CTR: {k.ctr}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold">{k.cpc}</div>
                                    <div className="text-xs text-slate-500">CPC</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Location Heatmap Mock */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <h3 className="font-bold text-slate-900 dark:text-white">Top Locations</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "Dallas, TX", share: 42, roas: 4.1 },
                            { name: "Fort Worth, TX", share: 28, roas: 3.5 },
                            { name: "Plano, TX", share: 15, roas: 2.8 },
                            { name: "Arlington, TX", share: 10, roas: 3.2 }
                        ].map((loc, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{loc.name}</span>
                                    <span className="font-bold text-green-600">{loc.roas}x ROAS</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${loc.share}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* All Campaigns Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white">All Active Campaigns</h3>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="text-xs font-bold text-blue-600 hover:underline"
                    >
                        + New Campaign
                    </button>
                </div>
                {renderCampaignTable(campaigns)}
            </div>
        </div>
    );

    const renderSubChannelView = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            {configLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : channelConfig ? (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Education Card */}
                            <ChannelEducationCard education={channelConfig.education} />

                            {/* Channel Specific KPIs */}
                            <ChannelKPIs kpis={channelConfig.kpis} />

                            {/* Specialized Charts for Specific Channels */}
                            {activeTab === 'YOUTUBE_ADS' && channelConfig.retentionCurve && (
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Audience Retention</h3>
                                    <div className="h-48 flex items-end justify-between px-2 gap-2">
                                        {channelConfig.retentionCurve.map((point: any, i: number) => (
                                            <div key={i} className="flex flex-col items-center gap-2 group w-full">
                                                <div className="w-full bg-red-100 dark:bg-red-900/20 rounded-t-lg relative group-hover:bg-red-200 transition-colors" style={{ height: `${point.pct}%` }}>
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">{point.pct}%</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-mono">{point.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Campaigns Table - Filtered for SubChannel */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 dark:text-white">{channelConfig.label} Campaigns</h3>
                                </div>
                                {renderCampaignTable(campaigns.filter(c => c.subChannel === activeTab))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* AI Insights Panel */}
                            <AIInsightPanel insights={channelConfig.aiInsights} />

                            {/* Specific Components per channel */}
                            {activeTab === 'GOOGLE_SEARCH' && channelConfig.keywords && (
                                <div className="bg-slate-900 text-white rounded-xl p-5">
                                    <h3 className="font-bold mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-400" /> Top Keywords</h3>
                                    <div className="space-y-3">
                                        {channelConfig.keywords.map((k: any, i: number) => (
                                            <div key={i} className="bg-white/10 p-3 rounded-lg border border-white/5">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-mono text-xs text-green-300">"{k.term}"</span>
                                                    <span className="text-xs font-bold">{k.score}/10</span>
                                                </div>
                                                <div className="flex justify-between text-[10px] text-slate-400">
                                                    <span>{k.clicks} Clicks</span>
                                                    <span>{k.cpc} CPC</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="p-10 text-center text-slate-400">
                    <p>Select a sub-channel to view detailed analytics.</p>
                </div>
            )}
        </div>
    );

    const renderCampaignTable = (list: AdCampaign[]) => (
        <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                    <th className="px-6 py-3 font-bold">Campaign</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                    <th className="px-6 py-3 font-bold text-right">Daily Budget</th>
                    <th className="px-6 py-3 font-bold text-right">Clicks</th>
                    <th className="px-6 py-3 font-bold text-right">CTR</th>
                    <th className="px-6 py-3 font-bold text-right">Conversions</th>
                    <th className="px-6 py-3 font-bold text-right">ROAS</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {list.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">No active campaigns found for this channel.</td></tr>
                ) : list.map(campaign => (
                    <tr key={campaign.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                            {campaign.name}
                            {campaign.details?.keywords && <div className="text-xs text-slate-400 font-normal mt-0.5 max-w-[200px] truncate">{campaign.details.keywords}</div>}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${campaign.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                <span className="text-slate-600 dark:text-slate-300 capitalize">{campaign.status.toLowerCase()}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">${(campaign.budget / 30).toFixed(2)}</td>
                        <td className="px-6 py-4 text-right font-medium">{campaign.clicks}</td>
                        <td className="px-6 py-4 text-right text-slate-500">
                            {campaign.ctr ? `${campaign.ctr}%` : ((campaign.clicks / campaign.impressions) * 100).toFixed(2) + '%'}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                            {campaign.conversions}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <span className={`font-bold px-2 py-1 rounded-lg ${(campaign.roi || 0) > 3 ? 'text-green-600 bg-green-50' : 'text-slate-600'}`}>
                                {campaign.roi}x
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <CreateCampaignModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateCampaign}
                defaultPlatform="GOOGLE"
            />
            {/* Header / Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-20 pt-2">
                <div className="flex overflow-x-auto gap-4 pb-0 hide-scrollbar">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-all whitespace-nowrap ${isActive
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                <span className="text-sm font-bold">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'ALL' ? renderAllView() : renderSubChannelView()}
        </div>
    );
};
