import React, { useContext } from 'react';
import { StoreContext } from '../../../store';
import { Job, JobStatus } from '../../../types';
import { isSameDay, parseISO, format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Clock, MapPin, CheckCircle } from 'lucide-react';

interface TechnicianDashboardProps { }

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = () => {
    const store = useContext(StoreContext);
    const currentUser = store?.currentUser;
    const today = new Date();

    if (!store || !currentUser) return null;

    const myJobsToday = store.jobs
        .filter(j => j.assignedTechIds.includes(currentUser.id) && isSameDay(parseISO(j.start), today))
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const currentJob = store.jobs.find(j => j.assignedTechIds.includes(currentUser.id) && j.status === JobStatus.IN_PROGRESS);
    const nextJob = myJobsToday.find(j => j.status === JobStatus.SCHEDULED);

    return (
        <div className="space-y-6 max-w-3xl mx-auto pb-10">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Hello, {currentUser.name.split(' ')[0]}</h1>
                <p className="text-slate-500 dark:text-slate-400">Here is your schedule for {today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
            </div>

            {/* Current Job Card */}
            {currentJob ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border-l-4 border-l-amber-500 shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-full uppercase tracking-wide">In Progress</span>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{currentJob.title}</h2>
                            </div>
                            <Link to={`/jobs/${currentJob.id}`} className="bg-slate-900 dark:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">
                                View Job
                            </Link>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Clock className="w-5 h-5 text-slate-400" />
                                <span>Started at {format(parseISO(currentJob.start), 'h:mm a')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <MapPin className="w-5 h-5 text-slate-400" />
                                <span>{store?.clients.find(c => c.id === currentJob.clientId)?.properties.find(p => p.id === currentJob.propertyId)?.address.street}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">You are currently available.</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{nextJob ? `Next job starts at ${format(parseISO(nextJob.start), 'h:mm a')}` : 'No active jobs right now.'}</p>
                    </div>
                </div>
            )}

            {/* Upcoming Jobs List */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Today's Agenda</h3>
                {myJobsToday.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
                        <p className="text-slate-500 dark:text-slate-400">No jobs scheduled for today.</p>
                    </div>
                ) : (
                    myJobsToday.map(job => (
                        <Link to={`/jobs/${job.id}`} key={job.id} className="block bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                    {format(parseISO(job.start), 'h:mm a')} - {format(parseISO(job.end), 'h:mm a')}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                    {job.status.replace('_', ' ')}
                                </span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{job.title}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm truncate">{store?.clients.find(c => c.id === job.clientId)?.properties[0].address.street}</p>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};
