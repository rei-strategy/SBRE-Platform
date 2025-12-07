import React from 'react';
import { format, addDays, isSameDay, differenceInMinutes, setHours } from 'date-fns';
import { Link } from 'react-router-dom';
import { Job, Client } from '../../../types';

interface MobileDayViewProps {
    currentDate: Date;
    jobs: Job[];
    clients: Client[];
    daysToShow?: number;
    now: Date;
}

const START_HOUR = 7;
const END_HOUR = 21;
const HOURS_COUNT = END_HOUR - START_HOUR;
const PIXELS_PER_HOUR = 112;
const MIN_JOB_HEIGHT = 48;

export const MobileDayView: React.FC<MobileDayViewProps> = ({ currentDate, jobs, clients, daysToShow = 1, now }) => {
    const days = [];
    for (let i = 0; i < daysToShow; i++) {
        days.push(addDays(currentDate, i));
    }

    return (
        <div className="flex h-full overflow-hidden relative bg-white dark:bg-slate-800">
            {/* Time Labels */}
            <div className="w-12 shrink-0 border-r border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 z-20 pt-2">
                {Array.from({ length: HOURS_COUNT + 1 }).map((_, i) => {
                    const hour = START_HOUR + i;
                    return (
                        <div key={hour} className="h-28 text-[10px] font-medium text-slate-400 dark:text-slate-500 text-center relative -top-2">
                            {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                        </div>
                    );
                })}
            </div>

            {/* Columns */}
            <div className="flex flex-1 overflow-x-auto">
                {days.map((day) => {
                    const dayJobs = jobs.filter(j => isSameDay(new Date(j.start), day) && j.status !== 'DRAFT');
                    return (
                        <div key={day.toISOString()} className="flex-1 min-w-[100px] border-r border-slate-100 dark:border-slate-700 relative h-[1680px]"> {/* 15 * 112 = 1680px height */}
                            {/* Grid Lines */}
                            {Array.from({ length: HOURS_COUNT }).map((_, i) => (
                                <div key={i} className="h-28 border-b border-slate-50 dark:border-slate-700/50 w-full box-border"></div>
                            ))}

                            {/* Current Time Line */}
                            {isSameDay(day, now) && (
                                <div className="absolute left-0 right-0 z-10 pointer-events-none border-t-2 border-red-500 w-full"
                                    style={{ top: `${(now.getHours() - START_HOUR + now.getMinutes() / 60) * PIXELS_PER_HOUR}px` }}>
                                    <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-500"></div>
                                </div>
                            )}

                            {/* Jobs */}
                            {dayJobs.map(job => {
                                const start = new Date(job.start);
                                const end = new Date(job.end);
                                const top = (differenceInMinutes(start, setHours(day, START_HOUR)) / 60) * PIXELS_PER_HOUR;
                                const height = Math.max((differenceInMinutes(end, start) / 60) * PIXELS_PER_HOUR, MIN_JOB_HEIGHT);
                                const client = clients.find(c => c.id === job.clientId);

                                return (
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        key={job.id}
                                        className="absolute left-1 right-1 rounded-md border-l-4 border-emerald-500 bg-emerald-50/90 dark:bg-emerald-900/50 p-1 text-xs overflow-hidden hover:z-20 shadow-sm"
                                        style={{ top: `${top}px`, height: `${height}px` }}
                                    >
                                        <div className="font-bold text-emerald-900 dark:text-emerald-100 truncate leading-tight">{job.title}</div>
                                        <div className="text-emerald-700 dark:text-emerald-300 truncate scale-90 origin-top-left">{client?.lastName}</div>
                                    </Link>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
