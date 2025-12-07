import React from 'react';
import { differenceInMinutes } from 'date-fns';
import { User, Job } from '../../../types';

interface TechHeaderProps {
    tech: User;
    dayJobs: Job[];
}

export const TechHeader: React.FC<TechHeaderProps> = ({ tech, dayJobs }) => {
    const WORK_DAY_MINUTES = 8 * 60;
    const bookedMinutes = dayJobs.reduce((acc, job) => {
        const duration = differenceInMinutes(new Date(job.end), new Date(job.start));
        return acc + duration;
    }, 0);

    const percentage = Math.min(100, (bookedMinutes / WORK_DAY_MINUTES) * 100);
    const hoursBooked = (bookedMinutes / 60).toFixed(1);
    const isOverloaded = bookedMinutes > WORK_DAY_MINUTES;

    const colorMap: any = {
        emerald: 'bg-emerald-500',
        blue: 'bg-blue-500',
        amber: 'bg-amber-500',
        purple: 'bg-purple-500',
        rose: 'bg-rose-500',
        slate: 'bg-slate-500',
    };

    const baseColor = colorMap[tech.color || 'slate'];

    return (
        <div className="flex flex-col gap-2 h-full justify-center select-none">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${baseColor} text-white flex items-center justify-center shadow-sm ring-2 ring-offset-1 ring-white/60 dark:ring-slate-700/60 shrink-0`}>
                    {tech.avatarUrl ? (
                        <img src={tech.avatarUrl} alt={tech.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span className="font-bold text-sm">{tech.name.charAt(0)}</span>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-slate-800 dark:text-white truncate text-sm">{tech.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Technician</p>
                </div>
            </div>

            {/* Utilization Bar */}
            <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    <span>Capacity</span>
                    <span className={isOverloaded ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}>{hoursBooked} / 8h</span>
                </div>
                <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 rounded-full ${isOverloaded ? 'bg-red-500' : baseColor}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
