import React, { useContext } from 'react';
import { StoreContext } from '../../../store';
import { Link } from 'react-router-dom';
import { Activity, ChevronRight, Users } from 'lucide-react';
import { JobStatus, UserRole } from '../../../types';
import { isBefore, isAfter, parseISO } from 'date-fns';

export const LiveTeamStatus: React.FC = () => {
    const store = useContext(StoreContext);
    const today = new Date();

    if (!store) return null;

    const technicians = store.users.filter(u => u.role === UserRole.TECHNICIAN);

    const getTechStatus = (techId: string) => {
        const currentJob = store.jobs.find(j =>
            j.assignedTechIds.includes(techId) &&
            j.status === JobStatus.IN_PROGRESS
        );
        if (currentJob) return { status: 'Busy', job: currentJob };
        const scheduledNow = store.jobs.find(j =>
            j.assignedTechIds.includes(techId) &&
            isBefore(parseISO(j.start), today) &&
            isAfter(parseISO(j.end), today)
        );
        if (scheduledNow) return { status: 'Scheduled', job: scheduledNow };
        return { status: 'Available', job: null };
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Live Team Status
                </h3>
            </div>
            <div className="p-2">
                {technicians.map(tech => {
                    const { status, job } = getTechStatus(tech.id);
                    const isBusy = status === 'Busy';
                    const isScheduled = status === 'Scheduled';

                    return (
                        <Link
                            to={`/team/${tech.id}`}
                            key={tech.id}
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer block group"
                        >
                            <div className="relative">
                                <img src={tech.avatarUrl} alt={tech.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-600 group-hover:border-emerald-400 transition-colors" />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${isBusy ? 'bg-amber-500' : isScheduled ? 'bg-blue-400' : 'bg-emerald-500'}`}></div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{tech.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {isBusy ? `On Job: ${job?.title}` : isScheduled ? 'Starting soon' : 'Available'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {isBusy && <Activity className="w-4 h-4 text-amber-500 animate-pulse" />}
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
