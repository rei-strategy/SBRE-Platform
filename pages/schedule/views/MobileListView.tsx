import React from 'react';
import { format, isSameDay, differenceInMinutes } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Phone, MessageCircle, Plus } from 'lucide-react';
import { Job, Client, User, JobStatus } from '../../../types';
import { Button } from '../../../components/Button';

interface MobileListViewProps {
    currentDate: Date;
    jobs: Job[];
    clients: Client[];
    users: User[];
    canDispatch: boolean;
}

export const MobileListView: React.FC<MobileListViewProps> = ({ currentDate, jobs, clients, users, canDispatch }) => {
    const navigate = useNavigate();
    const todaysJobs = jobs
        .filter(j => isSameDay(new Date(j.start), currentDate) && j.status !== 'DRAFT')
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const anytimeJobs = todaysJobs.filter(j => differenceInMinutes(new Date(j.end), new Date(j.start)) > 480);
    const scheduledJobs = todaysJobs.filter(j => !anytimeJobs.includes(j));

    return (
        <div className="px-4 pt-4 pb-24 space-y-6">
            {anytimeJobs.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anytime Visits</h3>
                    {anytimeJobs.map(job => (
                        <div key={job.id} className="bg-white dark:bg-slate-800 rounded-lg border-l-4 border-blue-500 shadow-sm p-4">
                            <h4 className="font-bold text-slate-900 dark:text-white">{job.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Anytime today</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Schedule</h3>
                    <span className="text-xs text-slate-400">{scheduledJobs.length} visits</span>
                </div>

                {scheduledJobs.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        <CalendarIcon className="w-8 h-8 text-slate-300 dark:text-slate-500 mx-auto mb-2" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">No visits scheduled for today.</p>
                        {canDispatch && <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/jobs/new')}>Create Visit</Button>}
                    </div>
                ) : (
                    scheduledJobs.map(job => {
                        const client = clients.find(c => c.id === job.clientId);
                        const tech = users.find(u => u.id === job.assignedTechIds[0]);
                        return (
                            <div key={job.id} className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-emerald-500 shadow-sm overflow-hidden active:scale-[0.98] transition-transform">
                                <Link to={`/jobs/${job.id}`} className="block p-4 pb-3">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                {format(new Date(job.start), 'h:mm')} - {format(new Date(job.end), 'h:mm a')}
                                            </span>
                                            {job.priority === 'HIGH' && (
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                            )}
                                        </div>
                                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">#{job.id.slice(-4)}</span>
                                    </div>

                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{client?.firstName} {client?.lastName}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{client?.properties.find(p => p.id === job.propertyId)?.address.street}</p>

                                    <div className="flex items-center gap-2 mt-3">
                                        {tech && (
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-600">
                                                <img src={tech.avatarUrl} className="w-5 h-5 rounded-full" />
                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{tech.name.split(' ')[0]}</span>
                                            </div>
                                        )}
                                        <span className={`text-[10px] px-2 py-1 rounded-full border uppercase font-bold ${job.status === JobStatus.COMPLETED ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800'}`}>
                                            {job.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </Link>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 border-t border-slate-100 dark:border-slate-700">
                                    <button className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 border-r border-slate-100 dark:border-slate-700 transition-colors" onClick={(e) => { e.stopPropagation(); alert('Calling client...'); }}>
                                        <Phone className="w-4 h-4 text-slate-400" /> Call
                                    </button>
                                    <button className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 transition-colors" onClick={(e) => { e.stopPropagation(); alert('Sending OMW message...'); }}>
                                        <MessageCircle className="w-4 h-4 text-slate-400" /> On My Way
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
