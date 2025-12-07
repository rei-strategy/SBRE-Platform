import React from 'react';
import { format, startOfWeek, addDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { Link } from 'react-router-dom';
import { User, MapPin, ChevronRight } from 'lucide-react';
import { Job, Client, User as UserType } from '../../../types';
import { Button } from '../../../components/Button';

interface ListViewProps {
    currentDate: Date;
    jobs: Job[];
    clients: Client[];
    users: UserType[];
    setCurrentDate: (date: Date) => void;
}

export const ListView: React.FC<ListViewProps> = ({ currentDate, jobs, clients, users, setCurrentDate }) => {
    // Group jobs by date for the next 30 days
    // Note: The original code loaded next 2 weeks (14 days)
    const days = eachDayOfInterval({
        start: startOfWeek(currentDate),
        end: addDays(startOfWeek(currentDate), 14) // 2 weeks view
    });

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50 dark:bg-slate-900 space-y-6">
            {days.map(day => {
                const dayJobs = jobs
                    .filter(j => isSameDay(new Date(j.start), day) && j.status !== 'DRAFT')
                    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

                if (dayJobs.length === 0) return null;

                return (
                    <div key={day.toISOString()}>
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 sticky top-0 bg-slate-50 dark:bg-slate-900 py-2 z-10">
                            {format(day, 'EEEE, MMMM do')}
                        </h3>
                        <div className="space-y-3">
                            {dayJobs.map(job => {
                                const client = clients.find(c => c.id === job.clientId);
                                const tech = users.find(u => u.id === job.assignedTechIds[0]);
                                const statusColor = job.status === 'COMPLETED' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800' : 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';

                                return (
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        key={job.id}
                                        className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500 transition-all group"
                                    >
                                        <div className="w-24 shrink-0 text-center border-r border-slate-100 dark:border-slate-700 pr-4">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">{format(new Date(job.start), 'h:mm a')}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{format(new Date(job.end), 'h:mm a')}</div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{job.title}</h4>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {client?.firstName} {client?.lastName}</span>
                                                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {client?.properties.find(p => p.id === job.propertyId)?.address.city}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {tech && (
                                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-600">
                                                    <img src={tech.avatarUrl} className="w-6 h-6 rounded-full" />
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{tech.name.split(' ')[0]}</span>
                                                </div>
                                            )}
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase ${statusColor}`}>
                                                {job.status.replace('_', ' ')}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            <div className="text-center py-8">
                <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, 7))}>Load Next Week</Button>
            </div>
        </div>
    );
};
