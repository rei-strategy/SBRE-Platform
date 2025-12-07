import React, { useEffect, useState } from 'react';
import { AdsService } from '../../services/adsService';
import { AdCampaign } from '../../types';
import {
    AlertCircle, CheckCircle2, Megaphone, Plus, ExternalLink, Loader2,
    Wand2, Target, Users, LayoutGrid, Play, Image, Layers, Smartphone
} from 'lucide-react';
import { CreateCampaignModal } from '../../components/Marketing/CreateCampaignModal';
// Shared Analytics Components
import { ChannelEducationCard } from '../../components/Marketing/Analytics/ChannelEducationCard';
import { ChannelKPIs } from '../../components/Marketing/Analytics/ChannelKPIs';
import { AIInsightPanel } from '../../components/Marketing/Analytics/AIInsightPanel';
import { CreativeGallery } from '../../components/Marketing/Analytics/CreativeGallery';

const TABS = [
    { id: 'ALL', label: 'All Meta', icon: LayoutGrid },
    { id: 'META_FB_FEED', label: 'FB Feed', icon: LayoutGrid },
    { id: 'META_FB_REELS', label: 'FB Reels', icon: Play },
    { id: 'META_FB_STORIES', label: 'FB Stories', icon: Image },
    { id: 'META_IG_FEED', label: 'IG Feed', icon: Smartphone },
    { id: 'META_IG_REELS', label: 'IG Reels', icon: Play },
    { id: 'META_IG_STORIES', label: 'IG Stories', icon: Image },
];

export const MetaAdsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('ALL');
    const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
    const [channelConfig, setChannelConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [configLoading, setConfigLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const loadCampaigns = async () => {
        const all = await AdsService.getCampaigns();
        setCampaigns(all.filter(c => c.platform === 'META'));
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
            {/* Aggregated Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase">Total Spend</p>
                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Megaphone className="w-4 h-4" /></div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$492.50</h3>
                    <p className="text-xs text-slate-400 mt-1">MTD across all placements</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase">Leads</p>
                        <div className="p-1.5 bg-green-100 text-green-600 rounded-lg"><Users className="w-4 h-4" /></div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">33</h3>
                    <p className="text-xs text-green-500 font-bold mt-1">Cost: $14.92 / lead</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase">CTR (Link)</p>
                        <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><Target className="w-4 h-4" /></div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">1.85%</h3>
                    <p className="text-xs text-slate-400 mt-1">Avg. Frequency: 1.4</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase">Active Ads</p>
                        <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg"><Layers className="w-4 h-4" /></div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">12</h3>
                    <p className="text-xs text-slate-400 mt-1">Across 4 sub-channels</p>
                </div>
            </div>

            {/* AI Insights Bar */}
            <div className="bg-indigo-900 text-white p-4 rounded-xl flex items-center justify-between shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-indigo-700 p-2 rounded-lg">
                        <Wand2 className="w-5 h-5 text-indigo-200" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Meta Strategy Insight</h4>
                        <p className="text-indigo-200 text-xs">Reels are outperforming Feed by 35% in ROAS. Shift $200 budget to Instagram Reels.</p>
                    </div>
                </div>
                <button className="bg-white text-indigo-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors z-10">
                    View Allocation
                </button>
            </div>

            {/* Campaigns Table - Filtered for ALL (shows everything) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">All Active Campaigns</h3>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Create Campaign
                    </button>
                </div>
                {/* ... Reuse existing campaign table code ... */}
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

                            {/* Campaigns Table - Filtered for SubChannel */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 dark:text-white">{channelConfig.label} Campaigns</h3>
                                    <button
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="text-xs font-bold text-blue-600 hover:underline"
                                    >
                                        + New Campaign
                                    </button>
                                </div>
                                {renderCampaignTable(campaigns.filter(c => c.subChannel === activeTab || (!c.subChannel && activeTab === 'META_FB_FEED')))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* AI Insights Panel */}
                            <AIInsightPanel insights={channelConfig.aiInsights} />

                            {/* Top Creatives */}
                            <CreativeGallery creatives={channelConfig.creativeGallery} />
                        </div>
                    </div>
                </>
            ) : (
                <div className="p-10 text-center text-slate-400">
                    <p>No configuration data available for this channel yet.</p>
                </div>
            )}
        </div>
    );

    const renderCampaignTable = (list: AdCampaign[]) => (
        <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                    <th className="px-6 py-3 font-bold">Campaign Name</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                    <th className="px-6 py-3 font-bold text-right">Spend</th>
                    <th className="px-6 py-3 font-bold text-right">CPC</th>
                    <th className="px-6 py-3 font-bold text-right">CTR</th>
                    <th className="px-6 py-3 font-bold text-right">Leads</th>
                    <th className="px-6 py-3 font-bold text-right">ROAS</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {list.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">No active campaigns found for this channel.</td></tr>
                ) : list.map(campaign => (
                    <tr key={campaign.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                            {campaign.name}
                            <div className="text-xs text-slate-400 font-normal mt-0.5">{campaign.subChannel ? campaign.subChannel.replace('META_', '').replace('_', ' ') : 'General'}</div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    campaign.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                        'bg-slate-100 text-slate-600'
                                }`}>
                                {campaign.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">${campaign.spend.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-slate-500">${campaign.cpc?.toFixed(2) || '-'}</td>
                        <td className="px-6 py-4 text-right text-slate-500">{campaign.ctr?.toFixed(2)}%</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">{campaign.conversions}</td>
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
                defaultPlatform="META"
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
