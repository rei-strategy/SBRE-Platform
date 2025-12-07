import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { X, CheckCircle, XCircle, Clock, ChevronRight, User, AlertTriangle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface AutomationRunsHistoryProps {
    automationId: string;
    onClose: () => void;
}

interface RunData {
    id: string;
    status: string;
    started_at: string;
    completed_at?: string;
    current_step_index: number;
    logs: any[];
    entity_id: string;
    client?: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

export const AutomationRunsHistory: React.FC<AutomationRunsHistoryProps> = ({ automationId, onClose }) => {
    const [runs, setRuns] = useState<RunData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRun, setSelectedRun] = useState<RunData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRuns();
    }, [automationId]);

    const fetchRuns = async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch runs
            const { data: runsData, error: fetchError } = await supabase
                .from('automation_runs')
                .select('*')
                .eq('automation_id', automationId)
                .order('started_at', { ascending: false });

            if (fetchError) throw fetchError;

            // Fetch client details for each run
            const enrichedRuns = await Promise.all(runsData.map(async (run: any) => {
                if (run.entity_id) {
                    // Try fetching client directly
                    let { data: client } = await supabase
                        .from('clients')
                        .select('first_name, last_name, email')
                        .eq('id', run.entity_id)
                        .single();

                    // If not found, try fetching job to get client_id
                    if (!client) {
                        const { data: job } = await supabase
                            .from('jobs')
                            .select('client_id')
                            .eq('id', run.entity_id)
                            .single();

                        if (job && job.client_id) {
                            const { data: jobClient } = await supabase
                                .from('clients')
                                .select('first_name, last_name, email')
                                .eq('id', job.client_id)
                                .single();
                            client = jobClient;
                        }
                    }

                    return { ...run, client };
                }
                return run;
            }));

            setRuns(enrichedRuns);
        } catch (err: any) {
            console.error('Error fetching runs:', err);
            setError(err.message || 'Failed to load runs');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRun = async (e: React.MouseEvent, runId: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this run history?')) return;

        try {
            const { error } = await supabase.from('automation_runs').delete().eq('id', runId);
            if (error) throw error;

            setRuns(prev => prev.filter(r => r.id !== runId));
            if (selectedRun?.id === runId) setSelectedRun(null);
        } catch (err: any) {
            console.error('Error deleting run:', err);
            alert('Failed to delete run');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
            case 'FAILED': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            case 'RUNNING': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
            case 'WAITING': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
            default: return 'text-slate-500 bg-slate-50 dark:bg-slate-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
            case 'FAILED': return <XCircle className="w-4 h-4" />;
            case 'RUNNING': return <Clock className="w-4 h-4 animate-spin" />;
            case 'WAITING': return <Clock className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Run History</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* List */}
                    <div className="w-1/3 border-r border-slate-100 dark:border-slate-800 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-slate-500">Loading runs...</div>
                        ) : error ? (
                            <div className="p-8 text-center">
                                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                <p className="text-red-500 text-sm font-medium">{error}</p>
                            </div>
                        ) : runs.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No runs found.</div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {runs.map(run => (
                                    <div
                                        key={run.id}
                                        onClick={() => setSelectedRun(run)}
                                        className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group relative ${selectedRun?.id === run.id ? 'bg-slate-50 dark:bg-slate-800' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(run.status)}`}>
                                                {getStatusIcon(run.status)}
                                                {run.status}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-400">
                                                    {format(new Date(run.started_at), 'MMM d, h:mm a')}
                                                </span>
                                                <button
                                                    onClick={(e) => handleDeleteRun(e, run.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                                                    title="Delete Run"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white mb-1">
                                            <User className="w-4 h-4 text-slate-400" />
                                            {run.client ? `${run.client.first_name} ${run.client.last_name}` : 'Unknown Client'}
                                        </div>
                                        <div className="text-xs text-slate-500 truncate">
                                            ID: {run.id.slice(0, 8)}...
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
                        {selectedRun ? (
                            <div className="p-6">
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Run Details</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-xs font-medium text-slate-500 uppercase mb-1">Status</div>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRun.status)}`}>
                                                {getStatusIcon(selectedRun.status)}
                                                {selectedRun.status}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-slate-500 uppercase mb-1">Started At</div>
                                            <div className="text-sm text-slate-900 dark:text-white">
                                                {format(new Date(selectedRun.started_at), 'PPpp')}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-slate-500 uppercase mb-1">Recipient</div>
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                {selectedRun.client ? `${selectedRun.client.first_name} ${selectedRun.client.last_name}` : 'Unknown'}
                                            </div>
                                            {selectedRun.client && (
                                                <div className="text-xs text-slate-500">{selectedRun.client.email}</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-slate-500 uppercase mb-1">Current Step</div>
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                Step {selectedRun.current_step_index + 1}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Execution Logs</h3>
                                    <div className="space-y-4">
                                        {selectedRun.logs && selectedRun.logs.length > 0 ? (
                                            selectedRun.logs.map((log: any, index: number) => (
                                                <div key={index} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-2 h-2 rounded-full mt-2 ${log.status === 'FAILED' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                        {index < selectedRun.logs.length - 1 && (
                                                            <div className="w-px h-full bg-slate-100 dark:bg-slate-700 my-1" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-4">
                                                        <div className="flex justify-between items-start">
                                                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                                {isNaN(Number(log.step)) ? log.step : `Step ${Number(log.step) + 1}`}
                                                            </span>
                                                            <span className="text-xs text-slate-400">
                                                                {log.timestamp ? format(new Date(log.timestamp), 'h:mm:ss a') : ''}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                                            {log.status === 'FAILED' ? (
                                                                <span className="text-red-500">{log.error || 'Unknown error'}</span>
                                                            ) : (
                                                                log.status
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-slate-500 py-8">No logs available</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <Clock className="w-12 h-12 mb-4 opacity-20" />
                                <p>Select a run to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
