import React, { useState, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Job, Client, JobStatus, UserRole } from '../types';
import { Plus, Filter, Layout, Table as TableIcon, GanttChart, Map as MapIcon, AlertCircle, Workflow, ShieldAlert, CalendarClock, ClipboardList, Route } from 'lucide-react';
import { Button } from '../components/Button';
import { Pipeline } from './Pipeline';
import { StoreContext } from '../store';
import { JobsMap } from '../components/JobsMap';
import { CancellationModal } from '../components/CancellationModal';

// Extracted Components
import { GanttView } from './jobs/views/GanttView';
import { JobsTable } from './jobs/views/JobsTable';
import { CrmPipelineView } from './jobs/views/CrmPipelineView';
import { CrmCasesView } from './jobs/views/CrmCasesView';
import { CreateJobModal } from './jobs/components/CreateJobModal';
import { JobFilterType, ViewType, SortKey } from './jobs/types';

interface JobsListProps {
    jobs: Job[];
    clients: Client[];
    onAddJob: (job: Job) => void;
}

export const JobsList: React.FC<JobsListProps> = ({ jobs, clients, onAddJob }) => {
    const store = useContext(StoreContext);
    const users = store?.users || [];
    const quotes = store?.quotes || [];
    const currentUser = store?.currentUser;
    const isTechnician = currentUser?.role === UserRole.TECHNICIAN;
    const canViewCases = store?.canAccessCrmObject?.('CASE', 'VIEW');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<JobFilterType>('ALL');
    const [viewType, setViewType] = useState<ViewType>('TABLE');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'DATE', direction: 'desc' });

    // Cancellation State
    const [cancellationJobId, setCancellationJobId] = useState<string | null>(null);

    const handleStatusChange = (jobId: string, newStatus: JobStatus) => {
        if (newStatus === JobStatus.CANCELLED) {
            setCancellationJobId(jobId);
        } else {
            store?.updateJobStatus(jobId, newStatus);
        }
    };

    const handleCancellationConfirm = (reason: string, note: string, competitorName?: string, competitorCity?: string, competitorState?: string, competitorType?: string) => {
        if (cancellationJobId && store) {
            // Find job to update properly
            const jobToCancel = jobs.find(j => j.id === cancellationJobId);
            if (jobToCancel) {
                store.updateJob({
                    ...jobToCancel,
                    status: JobStatus.CANCELLED,
                    pipelineStage: 'CANCELLED',
                    cancellationReason: reason,
                    cancellationNote: note,
                    competitorName: competitorName,
                    competitorCity: competitorCity,
                    competitorState: competitorState,
                    competitorType: competitorType
                });
            }
            setCancellationJobId(null);
        }
    };

    const handleSortToggle = (key: SortKey) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedJobs = useMemo(() => {
        const filtered = jobs.filter(job => {
            if (activeFilter === 'ALL') return true;
            if (activeFilter === 'ACTIVE') return job.status === JobStatus.SCHEDULED || job.status === JobStatus.IN_PROGRESS;
            if (activeFilter === 'DRAFTS') return job.status === JobStatus.DRAFT;
            if (activeFilter === 'COMPLETED') return job.status === JobStatus.COMPLETED;
            if (activeFilter === 'HIGH_PRIORITY') return job.priority === 'HIGH';
            return true;
        });

        return filtered.sort((a, b) => {
            const clientA = clients.find(c => c.id === a.clientId);
            const clientB = clients.find(c => c.id === b.clientId);
            const techA = users.find(u => u.id === a.assignedTechIds[0]);
            const techB = users.find(u => u.id === b.assignedTechIds[0]);

            const valueA = a.items.reduce((sum, i) => sum + i.total, 0);
            const valueB = b.items.reduce((sum, i) => sum + i.total, 0);

            let valA: any = '', valB: any = '';

            switch (sortConfig.key) {
                case 'JOB': valA = a.title.toLowerCase(); valB = b.title.toLowerCase(); break;
                case 'CLIENT': valA = `${clientA?.lastName} ${clientA?.firstName}`.toLowerCase(); valB = `${clientB?.lastName} ${clientB?.firstName}`.toLowerCase(); break;
                case 'VEHICLE': valA = `${a.vehicleDetails?.make} ${a.vehicleDetails?.model}`.toLowerCase(); valB = `${b.vehicleDetails?.make} ${b.vehicleDetails?.model}`.toLowerCase(); break;
                case 'STATUS': valA = a.status; valB = b.status; break;
                case 'TECH': valA = techA?.name || 'zzzz'; valB = techB?.name || 'zzzz'; break;
                case 'VALUE': valA = valueA; valB = valueB; break;
                case 'DATE': default: valA = new Date(a.start).getTime(); valB = new Date(b.start).getTime(); break;
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [jobs, activeFilter, sortConfig, clients, users]);

    const draftJobs = sortedJobs.filter((job) => job.status === JobStatus.DRAFT);
    const activeJobs = sortedJobs.filter((job) => job.status === JobStatus.SCHEDULED || job.status === JobStatus.IN_PROGRESS);
    const availableTechs = Object.values(store?.techAvailability || {}).filter(Boolean).length;

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Jobs</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Schedule, track, and manage your detailing operations.</p>
                </div>
                {(viewType === 'TABLE' || viewType === 'GANTT' || viewType === 'MAP' || viewType === 'PIPELINE' || viewType === 'CRM_PIPELINE' || viewType === 'CRM_CASES') && (
                    <div className="flex flex-row flex-wrap md:flex-nowrap md:items-center justify-between gap-2 mb-4 shrink-0 bg-slate-50/50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                        <button onClick={() => setViewType('TABLE')} className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${viewType === 'TABLE' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`} title="Table View"><TableIcon className="w-6 h-6" /><span className="text-sm font-semibold">Table</span></button>
                        <button onClick={() => setViewType('GANTT')} className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${viewType === 'GANTT' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`} title="Timeline View"><GanttChart className="w-6 h-6" /><span className="text-sm font-semibold">Timeline</span></button>
                        <button onClick={() => setViewType('PIPELINE')} className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${viewType === 'PIPELINE' ? 'bg-emerald-50 dark:bg-emerald-900/30 shadow-sm text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`} title="Pipeline View"><Layout className="w-6 h-6" /><span className="text-sm font-semibold">Pipeline</span></button>
                        <button onClick={() => setViewType('CRM_PIPELINE')} className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${viewType === 'CRM_PIPELINE' ? 'bg-blue-50 dark:bg-blue-900/30 shadow-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`} title="CRM Pipeline"><Workflow className="w-6 h-6" /><span className="text-sm font-semibold">CRM Pipeline</span></button>
                        {canViewCases && (
                            <button onClick={() => setViewType('CRM_CASES')} className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${viewType === 'CRM_CASES' ? 'bg-amber-50 dark:bg-amber-900/30 shadow-sm text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`} title="CRM Cases"><ShieldAlert className="w-6 h-6" /><span className="text-sm font-semibold">Cases</span></button>
                        )}
                        <button onClick={() => setViewType('MAP')} className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${viewType === 'MAP' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`} title="Map View"><MapIcon className="w-6 h-6" /><span className="text-sm font-semibold">Map</span></button>
                    </div>
                )}

                {(viewType === 'PIPELINE' || viewType === 'CRM_PIPELINE' || viewType === 'CRM_CASES') && (
                    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 flex items-center justify-between gap-3">
                        <span>Response-time SLA settings are in <strong>CRM Pipeline</strong>. Open any stage and use <strong>Edit SLA</strong>.</span>
                        {viewType !== 'CRM_PIPELINE' && (
                            <Button size="sm" onClick={() => setViewType('CRM_PIPELINE')}>Go to CRM Pipeline</Button>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    {!isTechnician && (
                        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-emerald-500/20">
                            <Plus className="w-4 h-4 mr-2" /> New Job
                        </Button>
                    )}
                </div>
            </div>

            {(viewType === 'TABLE' || viewType === 'GANTT' || viewType === 'MAP' || viewType === 'PIPELINE') && (
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4 shrink-0 bg-slate-50/50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                        {[
                            { id: 'ALL', label: 'All Jobs' },
                            { id: 'ACTIVE', label: 'Active' },
                            { id: 'DRAFTS', label: 'Drafts' },
                            { id: 'COMPLETED', label: 'Completed' },
                            { id: 'HIGH_PRIORITY', label: 'Priority', icon: AlertCircle }
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id as JobFilterType)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${activeFilter === filter.id ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-800 dark:border-slate-100 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                            >
                                {filter.icon && <filter.icon className="w-3.5 h-3.5" />}
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!isTechnician && (viewType === 'TABLE' || viewType === 'PIPELINE' || viewType === 'MAP' || viewType === 'GANTT') && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">Scheduling & Booking</p>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Availability</h3>
                            </div>
                            <CalendarClock className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                            {availableTechs} techs currently marked available.
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link to="/schedule" className="inline-flex">
                                <Button size="sm">Open Scheduler</Button>
                            </Link>
                            <Button size="sm" variant="outline" onClick={() => setIsModalOpen(true)}>Create Booking</Button>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Route optimization and availability controls live in the scheduling calendar.
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">Booking Queue</p>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Draft Requests</h3>
                            </div>
                            <ClipboardList className="w-5 h-5 text-slate-400" />
                        </div>
                        {draftJobs.length === 0 ? (
                            <div className="text-sm text-slate-500 dark:text-slate-400">No draft bookings waiting.</div>
                        ) : (
                            <div className="space-y-2">
                                {draftJobs.slice(0, 3).map((job) => {
                                    const client = clients.find((c) => c.id === job.clientId);
                                    return (
                                        <div key={job.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm">
                                            <div className="font-semibold text-slate-900 dark:text-white">{job.title}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                {client?.firstName} {client?.lastName} • {new Date(job.start).toLocaleDateString()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">Work Orders</p>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">In Progress</h3>
                            </div>
                            <Route className="w-5 h-5 text-slate-400" />
                        </div>
                        {activeJobs.length === 0 ? (
                            <div className="text-sm text-slate-500 dark:text-slate-400">No active work orders right now.</div>
                        ) : (
                            <div className="space-y-2">
                                {activeJobs.slice(0, 3).map((job) => {
                                    const client = clients.find((c) => c.id === job.clientId);
                                    return (
                                        <div key={job.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm">
                                            <div className="font-semibold text-slate-900 dark:text-white">{job.title}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                {client?.firstName} {client?.lastName} • {job.status.replace('_', ' ')}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex-1 min-h-0">
                {viewType === 'PIPELINE' ? (
                    <Pipeline
                        jobs={jobs}
                        clients={clients}
                        users={store?.users || []}
                        invoices={store?.invoices || []}
                        onUpdateStage={store?.updateJobStage || (() => { })}
                    />
                ) : viewType === 'CRM_PIPELINE' ? (
                    <CrmPipelineView />
                ) : viewType === 'CRM_CASES' ? (
                    <CrmCasesView />
                ) : viewType === 'GANTT' ? (
                    <GanttView jobs={sortedJobs} clients={clients} />
                ) : viewType === 'MAP' ? (
                    <JobsMap jobs={sortedJobs} clients={clients} />
                ) : (
                    <JobsTable
                        jobs={sortedJobs}
                        clients={clients}
                        users={users}
                        isTechnician={isTechnician}
                        sortConfig={sortConfig}
                        handleSortToggle={handleSortToggle}
                        handleStatusChange={handleStatusChange}
                    />
                )}
            </div>

            {!isTechnician && (
                <CreateJobModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    clients={clients}
                    users={users}
                    currentUser={store?.currentUser}
                    onAddJob={onAddJob}
                    quotes={quotes}
                />
            )}

            {/* Cancellation Modal */}
            <CancellationModal
                isOpen={!!cancellationJobId}
                onClose={() => setCancellationJobId(null)}
                onConfirm={handleCancellationConfirm}
            />
        </div>
    );
};
