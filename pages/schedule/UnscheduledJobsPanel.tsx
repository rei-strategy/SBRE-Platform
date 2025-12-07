import React from 'react';
import { Briefcase, X, Search } from 'lucide-react';
import { Job, Client } from '../../types';
import { UnassignedJobCard } from './components/UnassignedJobCard';

interface UnscheduledJobsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    unassignedJobs: Job[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedJobId: string | null;
    setSelectedJobId: (id: string | null) => void;
    onDragStart: (e: React.DragEvent, job: Job) => void;
    draggingJobId: string | null;
    isJobUnassigned: (jobId: string) => boolean;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    clients: Client[];
}

export const UnscheduledJobsPanel: React.FC<UnscheduledJobsPanelProps> = ({
    isOpen,
    onClose,
    unassignedJobs,
    searchQuery,
    setSearchQuery,
    selectedJobId,
    setSelectedJobId,
    onDragStart,
    draggingJobId,
    isJobUnassigned,
    onDrop,
    onDragOver,
    clients
}) => {
    return (
        <div
            className={`
        bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 ease-in-out relative
        ${isOpen ? 'w-80 translate-x-0 opacity-100' : 'w-0 translate-x-20 opacity-0 hidden'}
    `}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {/* Drop Zone Overlay */}
            {draggingJobId && !isJobUnassigned(draggingJobId) && (
                <div className="absolute inset-2 z-50 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-[1px] border-2 border-dashed border-emerald-400 rounded-xl flex flex-col items-center justify-center text-emerald-600 animate-in fade-in duration-200 pointer-events-none">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-full shadow-sm mb-2">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-sm">Drop to Unassign</p>
                </div>
            )}

            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Unassigned
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs">{unassignedJobs.length}</span>
                </h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search jobs..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs focus:outline-none focus:border-emerald-500 transition-colors text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30 dark:bg-slate-900/30 custom-scrollbar">
                {unassignedJobs.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                        <p className="text-xs">No unassigned jobs.</p>
                    </div>
                ) : (
                    unassignedJobs.map(job => {
                        const client = clients.find(c => c.id === job.clientId);
                        return (
                            <UnassignedJobCard
                                key={job.id}
                                job={job}
                                client={client}
                                onClick={() => setSelectedJobId(job.id)}
                                isSelected={selectedJobId === job.id}
                                onDragStart={(e) => onDragStart(e, job)}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};
