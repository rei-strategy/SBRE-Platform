import React, { useContext } from 'react';
import { StoreContext } from '../store';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, MailOpen, MousePointerClick, Edit, Copy } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase } from '../supabaseClient';

export const MarketingCampaignDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const store = useContext(StoreContext);

    if (!store) return null;

    const campaign = store.marketingCampaigns.find((c: any) => c.id === id);

    if (!campaign) {
        return (
            <div className="p-8 text-center">
                <p className="text-slate-500">Campaign not found.</p>
                <Link to="/marketing/campaigns" className="text-blue-600 hover:underline mt-2 block">Back to Campaigns</Link>
            </div>
        );
    }

    const isDraft = campaign.status === 'DRAFT';

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <button onClick={() => navigate('/marketing/campaigns')} className="flex items-center text-slate-500 hover:text-slate-900 mb-6 font-medium">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Campaigns
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{campaign.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase border ${campaign.status === 'SENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            campaign.status === 'SENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                            {campaign.status}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-sm">
                            {campaign.scheduleTime ? `Scheduled for ${new Date(campaign.scheduleTime).toLocaleDateString()}` :
                                campaign.createdAt ? `Created on ${new Date(campaign.createdAt).toLocaleDateString()}` : ''}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    {isDraft && (
                        <Link to={`/marketing/campaigns/${campaign.id}/edit`}>
                            <Button variant="secondary"><Edit className="w-4 h-4 mr-2" /> Edit Campaign</Button>
                        </Link>
                    )}
                    {/* Future: Add Duplicate Functionality */}
                    {/* <Button variant="outline"><Copy className="w-4 h-4 mr-2" /> Duplicate</Button> */}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Send className="w-5 h-5" /></div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-300">Sent</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{campaign.sentCount || 0}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Send className="w-5 h-5" /></div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-300">Delivered</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {campaign.deliveredCount || 0}
                        <span className="text-sm text-slate-500 font-normal ml-2">
                            ({campaign.sentCount ? ((campaign.deliveredCount || 0) / campaign.sentCount * 100).toFixed(1) : 0}%)
                        </span>
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><MailOpen className="w-5 h-5" /></div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-300">Opened</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {campaign.openCount || 0}
                        <span className="text-sm text-slate-500 font-normal ml-2">
                            ({campaign.sentCount ? ((campaign.openCount || 0) / campaign.sentCount * 100).toFixed(1) : 0}%)
                        </span>
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><MousePointerClick className="w-5 h-5" /></div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-300">Clicked</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {campaign.clickCount || 0}
                        <span className="text-sm text-slate-500 font-normal ml-2">
                            ({campaign.sentCount ? ((campaign.clickCount || 0) / campaign.sentCount * 100).toFixed(1) : 0}%)
                        </span>
                    </p>
                </div>
            </div>

            {/* Email Preview */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Email Preview</h3>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900 min-h-[300px] prose max-w-none dark:prose-invert">
                    {campaign.content ? (
                        <div dangerouslySetInnerHTML={{ __html: campaign.content }} />
                    ) : (
                        <p className="text-slate-400 italic">No content yet.</p>
                    )}
                </div>
            </div>

            {/* Recipient Activity & Debugging */}
            <RecipientList campaignId={campaign.id} />
        </div>
    );
};

const RecipientList: React.FC<{ campaignId: string }> = ({ campaignId }) => {
    const [logs, setLogs] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchLogs = async () => {
        console.log("Fetching logs for campaign:", campaignId);
        const { data, error } = await supabase
            .from('email_logs')
            .select('*')
            .eq('campaign_id', campaignId)
            .order('sent_at', { ascending: false });

        if (error) {
            console.error("Error fetching logs:", error);
            alert("Error fetching logs: " + error.message);
        } else {
            console.log("Logs fetched:", data);
            if (data) setLogs(data);
        }
        setLoading(false);
    };

    React.useEffect(() => {
        fetchLogs();
        // Subscribe to log changes for this campaign
        const channel = supabase.channel(`logs-${campaignId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'email_logs', filter: `campaign_id=eq.${campaignId}` }, () => {
                fetchLogs();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [campaignId]);

    const simulateOpen = async (log: any) => {
        if (!confirm("This will simulate a webhook call from Resend. Continue?")) return;

        try {
            const res = await fetch('https://wumwjhdzihawygsmwfkn.supabase.co/functions/v1/resend-webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'email.opened',
                    created_at: new Date().toISOString(),
                    data: {
                        tags: {
                            campaign_id: campaignId,
                            recipient_id: log.recipient_id
                        },
                        email_id: 'simulated_' + Date.now()
                    }
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // alert("Webhook sent! Log ID: " + data.logId);
                console.log("Webhook success, refreshing logs...");
                fetchLogs();
            } else {
                console.error("Webhook failed", data);
                alert("Webhook failed: " + (data.message || JSON.stringify(data)));
            }
        } catch (e: any) {
            alert("Error: " + e.message);
        }
    };

    const simulateDelivered = async (log: any) => {
        if (!confirm("This will simulate a DELIVERED webhook call from Resend. Continue?")) return;

        try {
            const res = await fetch('https://wumwjhdzihawygsmwfkn.supabase.co/functions/v1/resend-webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'email.delivered',
                    created_at: new Date().toISOString(),
                    data: {
                        tags: {
                            campaign_id: campaignId,
                            recipient_id: log.recipient_id
                        },
                        email_id: 'simulated_' + Date.now()
                    }
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                console.log("Webhook success, refreshing logs...");
                fetchLogs();
            } else {
                console.error("Webhook failed", data);
                alert("Webhook failed: " + (data.message || JSON.stringify(data)));
            }
        } catch (e: any) {
            alert("Error: " + e.message);
        }
    };

    const testDB = async () => {
        try {
            const { data, error } = await supabase.from('email_logs').insert({
                company_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
                campaign_id: campaignId,
                recipient_email: 'test@example.com',
                status: 'TEST'
            }).select();

            if (error) {
                alert("DB Error: " + error.message);
                console.error(error);
            } else {
                alert("DB Write Success! Table exists and is writable.");
                // Clean up
                if (data && data[0]) {
                    await supabase.from('email_logs').delete().eq('id', data[0].id);
                }
            }
        } catch (e: any) {
            alert("Critical Error: " + e.message);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading recipients...</div>;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Recipient Activity</h3>
                <button onClick={testDB} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded">
                    Test DB Connection
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">
                            <th className="py-3">Email</th>
                            <th className="py-3">Status</th>
                            <th className="py-3">Time</th>
                            <th className="py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {logs.map(log => (
                            <tr key={log.id} className="text-sm">
                                <td className="py-3">{log.recipient_email}</td>
                                <td className="py-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${log.status === 'OPENED' ? 'bg-emerald-100 text-emerald-700' :
                                        log.status === 'CLICKED' ? 'bg-purple-100 text-purple-700' :
                                            log.status === 'DELIVERED' ? 'bg-indigo-100 text-indigo-700' :
                                                log.status === 'BOUNCED' ? 'bg-red-100 text-red-700' :
                                                    'bg-slate-100 text-slate-600'
                                        }`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="py-3 text-slate-500">
                                    {new Date(log.opened_at || log.sent_at || log.created_at).toLocaleString()}
                                </td>
                                <td className="py-3 text-right">
                                    <button
                                        onClick={() => simulateOpen(log)}
                                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors"
                                    >
                                        Simulate Open
                                    </button>
                                    <button
                                        onClick={() => simulateDelivered(log)}
                                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors ml-2"
                                    >
                                        Simulate Delivered
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-4 text-center text-slate-500">No recipients found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
