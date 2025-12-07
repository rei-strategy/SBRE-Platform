import React, { useContext } from 'react';
import { Job, Client, User } from '../../../types';
import { SortKey } from '../types';
import { ArrowUp, ArrowDown, ArrowUpDown, Filter, Clock, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WeatherIndicator } from '../../../components/WeatherIndicator';
import { JobStatusSelect } from '../../../components/JobStatusSelect';
import { StoreContext } from '../../../store';

interface JobsTableProps {
    jobs: Job[];
    clients: Client[];
    users: User[];
    isTechnician: boolean;
    sortConfig: { key: SortKey; direction: 'asc' | 'desc' };
    handleSortToggle: (key: SortKey) => void;
    handleStatusChange: (jobId: string, newStatus: any) => void;
}

export const JobsTable: React.FC<JobsTableProps> = ({
    jobs,
    clients,
    users,
    isTechnician,
    sortConfig,
    handleSortToggle,
    handleStatusChange
}) => {
    const navigate = useNavigate();
    const store = useContext(StoreContext);

    const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
        if (sortConfig.key !== columnKey) return <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />;
        return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400 ml-1" /> : <ArrowDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400 ml-1" />;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none" onClick={() => handleSortToggle('JOB')}><div className="flex items-center gap-2">Job Info <SortIcon columnKey="JOB" /></div></th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none" onClick={() => handleSortToggle('CLIENT')}><div className="flex items-center gap-2">Client <SortIcon columnKey="CLIENT" /></div></th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none" onClick={() => handleSortToggle('DATE')}><div className="flex items-center gap-2">Date & Time <SortIcon columnKey="DATE" /></div></th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none" onClick={() => handleSortToggle('VEHICLE')}><div className="flex items-center gap-2">Vehicle <SortIcon columnKey="VEHICLE" /></div></th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none" onClick={() => handleSortToggle('STATUS')}><div className="flex items-center gap-2">Status <SortIcon columnKey="STATUS" /></div></th>
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none" onClick={() => handleSortToggle('TECH')}><div className="flex items-center gap-2">Technician <SortIcon columnKey="TECH" /></div></th>
                            {!isTechnician && (
                                <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none" onClick={() => handleSortToggle('VALUE')}><div className="flex items-center justify-end gap-2">Value <SortIcon columnKey="VALUE" /></div></th>
                            )}
                            <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {jobs.length === 0 ? (
                            <tr>
                                <td colSpan={isTechnician ? 7 : 8} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                    <Filter className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p>No jobs found matching your filters.</p>
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => {
                                const client = clients.find((c) => c.id === job.clientId);
                                const tech = users.find(u => u.id === job.assignedTechIds[0]);
                                const totalValue = job.items.reduce((acc, i) => acc + i.total, 0);

                                return (
                                    <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 dark:text-white">{job.title}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">#{job.id.slice(0, 8)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">{client?.firstName[0]}{client?.lastName[0]}</div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{client?.firstName} {client?.lastName}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{client?.properties.find(p => p.id === job.propertyId)?.address.city}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900 dark:text-white mb-1">{new Date(job.start).toLocaleDateString()}</div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(job.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                {client && client.properties && (
                                                    <WeatherIndicator
                                                        lat={client.properties.find(p => p.id === job.propertyId)?.address.lat}
                                                        lng={client.properties.find(p => p.id === job.propertyId)?.address.lng}
                                                        date={job.start}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {job.vehicleDetails ? (
                                                <div className="text-sm text-slate-700 dark:text-slate-300">{job.vehicleDetails.year} {job.vehicleDetails.make} {job.vehicleDetails.model}</div>
                                            ) : <span className="text-slate-400 italic text-xs">No vehicle info</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <JobStatusSelect
                                                status={job.status}
                                                onChange={(newStatus) => handleStatusChange(job.id, newStatus)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            {tech ? (
                                                <div className="flex items-center gap-2">
                                                    <img src={tech.avatarUrl} alt={tech.name} className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-600" />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">{tech.name.split(' ')[0]}</span>
                                                </div>
                                            ) : <span className="text-xs text-slate-400 italic">Unassigned</span>}
                                        </td>
                                        {!isTechnician && (
                                            <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">${totalValue.toLocaleString()}</td>
                                        )}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Are you sure you want to delete this job?')) {
                                                            store?.deleteJob(job.id);
                                                        }
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete Job"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <div className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg inline-flex transition-colors"><ChevronRight className="w-4 h-4" /></div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
