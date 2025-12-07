import React, { useContext } from 'react';
import { StoreContext } from '../../../store';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, MapPin } from 'lucide-react';
import { isSameDay, parseISO } from 'date-fns';
import { JobStatus } from '../../../types';

export const TodaysAgenda: React.FC = () => {
    const store = useContext(StoreContext);
    const today = new Date();

    if (!store) return null;

    const todaysJobs = store.jobs
        .filter(j => isSameDay(parseISO(j.start), today))
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    Today's Agenda
                </h3>
                <Link to="/schedule" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center">
                    View Schedule <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {todaysJobs.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        No jobs scheduled for today.
                    </div>
                ) : (
                    todaysJobs.slice(0, 5).map(job => (
                        <Link to={`/jobs/${job.id}`} key={job.id} className="p-4 flex items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors block">
                            <div className="w-20 shrink-0 flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-700 pr-4 mr-4">
                                <span className="text-xs font-bold text-slate-400 uppercase">{new Date(job.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                                <span className="text-[10px] text-slate-400">TO</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">{new Date(job.end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 dark:text-white truncate">{job.title}</h4>
                                <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                        <MapPin className="w-3 h-3" />
                                        Location ID: {job.propertyId.slice(0, 6)}...
                                    </div>
                                    {job.priority === 'HIGH' && (
                                        <span className="text-[10px] font-bold bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">HIGH PRIORITY</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide
                            ${job.status === JobStatus.COMPLETED ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                                        job.status === JobStatus.IN_PROGRESS ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                                            'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'}`}>
                                    {job.status.replace('_', ' ')}
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};
