
import React from 'react';
import { EmailCampaign, CampaignStatus, AudienceSegment } from '../types';
import { Plus, Search, Mail, Smartphone, ArrowUpRight, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

interface MarketingCampaignsProps {
    campaigns: EmailCampaign[];
    segments: AudienceSegment[];
    onAddCampaign: (campaign: EmailCampaign) => void;
}

import { StoreContext } from '../store';

import { useNavigate } from 'react-router-dom';

export const MarketingCampaigns: React.FC<MarketingCampaignsProps> = ({ campaigns, segments }) => {
    const store = React.useContext(StoreContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = React.useState<'ALL' | 'EMAIL' | 'SMS'>('ALL');
    // Since we only have EmailCampaigns for now, we treat them all as EMAIL.
    const filteredCampaigns = campaigns.filter(c => activeTab === 'ALL' || activeTab === 'EMAIL');

    const getStatusBadge = (status: CampaignStatus) => {
        const styles = {
            DRAFT: 'bg-slate-100 text-slate-600',
            SCHEDULED: 'bg-blue-50 text-blue-700',
            SENDING: 'bg-amber-50 text-amber-700',
            SENT: 'bg-emerald-50 text-emerald-700',
            PAUSED: 'bg-red-50 text-red-700',
            ARCHIVED: 'bg-gray-50 text-gray-400'
        };
        return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-transparent ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Campaigns</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage your outbound messages.</p>
                </div>
                <Link to="/marketing/campaigns/new">
                    <Button className="shadow-lg shadow-emerald-500/20"><Plus className="w-4 h-4 mr-2" /> New Campaign</Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 bg-slate-50/50 dark:bg-slate-900/50 items-center justify-between">
                    <div className="flex p-1 bg-slate-200/60 dark:bg-slate-700/60 rounded-xl self-start sm:self-center">
                        {['ALL', 'EMAIL', 'SMS'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>{tab === 'ALL' ? 'All Channels' : tab}</button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Campaign Name</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Audience</th>
                                <th className="px-6 py-4 text-right">Stats (Open/Click)</th>
                                <th className="px-6 py-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredCampaigns.map(campaign => (
                                <tr
                                    key={campaign.id}
                                    onClick={() => navigate(campaign.status === 'DRAFT' ? `/marketing/campaigns/${campaign.id}/edit` : `/marketing/campaigns/${campaign.id}`)}
                                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-600`}>
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 transition-colors">{campaign.name}</span>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{campaign.scheduleTime ? `Scheduled ${new Date(campaign.scheduleTime).toLocaleDateString()}` : 'Draft'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(campaign.status)}</td>
                                    <td className="px-6 py-4"><span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{segments.find(s => s.id === campaign.audienceId)?.name || 'All Clients'}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        {campaign.status === 'SENT' ? (
                                            <div className="flex items-center justify-end gap-4 text-sm">
                                                <span className="text-slate-600 dark:text-slate-400"><span className="font-bold text-slate-900 dark:text-white">{((campaign.openCount || 0) / (campaign.sentCount || 1) * 100).toFixed(0)}%</span> Open</span>
                                            </div>
                                        ) : campaign.status === 'SENDING' ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-xs text-amber-600 animate-pulse">Sending...</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (confirm('Retry sending this campaign?')) {
                                                            // @ts-ignore
                                                            store.retryCampaign(campaign.id);
                                                        }
                                                    }}
                                                    className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
                                                    title="Retry Sending"
                                                >
                                                    <RefreshCw className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : <span className="text-xs text-slate-400">No data</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (confirm('Are you sure you want to delete this campaign? This cannot be undone.')) {
                                                        store.deleteCampaign(campaign.id);
                                                    }
                                                }}
                                                className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                                title="Delete Campaign"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
