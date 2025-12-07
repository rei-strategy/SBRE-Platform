import React from 'react';
import { format, startOfWeek, addDays, isSameDay, differenceInMinutes, setHours } from 'date-fns';
import { Job, Client, User } from '../../../types';
import { getTechColorStyles } from '../utils';

interface WeekViewProps {
    currentDate: Date;
    jobs: Job[];
    clients: Client[];
    users: User[];
    handleJobClick: (job: Job, e: React.MouseEvent) => void;
}

const START_HOUR = 7;
const END_HOUR = 21;
const HOURS_COUNT = END_HOUR - START_HOUR;
const PIXELS_PER_HOUR = 112;
const MIN_JOB_HEIGHT = 48;

export const WeekView: React.FC<WeekViewProps> = ({ currentDate, jobs, clients, users, handleJobClick }) => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col bg-white dark:bg-slate-800">
            {/* Header */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-30 shadow-sm min-h-[50px]">
                <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800"></div>
                {days.map(day => (
                    <div key={day.toISOString()} className={`flex-1 border-r border-slate-100 dark:border-slate-700 p-2 text-center ${isSameDay(day, new Date()) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                        <div className={`text-xs font-bold uppercase ${isSameDay(day, new Date()) ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>{format(day, 'EEE')}</div>
                        <div className={`text-lg font-bold ${isSameDay(day, new Date()) ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>{format(day, 'd')}</div>
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="flex relative" style={{ height: HOURS_COUNT * PIXELS_PER_HOUR }}>
                {/* Time Axis */}
                <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 select-none z-20">
                    {Array.from({ length: HOURS_COUNT }).map((_, i) => {
                        const hour = START_HOUR + i;
                        return (
                            <div key={hour} className="h-28 border-b border-slate-50 dark:border-slate-700/50 relative">
                                <span className="absolute -top-2.5 left-0 right-0 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
                                    {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Day Columns */}
                {days.map(day => {
                    const dayJobs = jobs.filter(j => isSameDay(new Date(j.start), day) && j.status !== 'DRAFT');

                    return (
                        <div key={day.toISOString()} className="flex-1 border-r border-slate-100 dark:border-slate-700 relative">
                            {/* Grid Lines */}
                            {Array.from({ length: HOURS_COUNT }).map((_, h) => (
                                <div key={h} className="h-28 border-b border-slate-50 dark:border-slate-700/50"></div>
                            ))}

                            {dayJobs.map(job => {
                                const start = new Date(job.start);
                                const end = new Date(job.end);
                                const top = (differenceInMinutes(start, setHours(day, START_HOUR)) / 60) * PIXELS_PER_HOUR;
                                const height = Math.max((differenceInMinutes(end, start) / 60) * PIXELS_PER_HOUR, MIN_JOB_HEIGHT);
                                const tech = users.find(u => u.id === job.assignedTechIds[0]);
                                const client = clients.find(c => c.id === job.clientId);
                                const techStyles = getTechColorStyles(tech?.color);

                                return (
                                    <div
                                        key={job.id}
                                        onClick={(e) => handleJobClick(job, e)}
                                        className={`absolute left-1 right-1 rounded-lg border-l-4 p-2 text-xs cursor-pointer shadow-sm hover:z-50 hover:shadow-md transition-all
                                        ${job.status === 'COMPLETED' ? 'bg-slate-100 dark:bg-slate-700 border-slate-400 opacity-80' : `bg-white dark:bg-slate-800 border-${tech?.color || 'slate'}-500`}
                                    `}
                                        style={{
                                            top: `${top}px`,
                                            height: `${height}px`,
                                            backgroundColor: job.status !== 'COMPLETED' ? `var(--color-${tech?.color || 'slate'}-50)` : undefined,
                                            borderColor: tech?.color ? undefined : '#cbd5e1'
                                        }}
                                    >
                                        <div className={`font-bold truncate ${techStyles.text} dark:text-slate-200`}>{client?.lastName || 'Unknown'}</div>
                                        <div className="truncate text-[10px] text-slate-500 dark:text-slate-400">{job.title}</div>
                                        {tech && <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">{tech.name.split(' ')[0]}</div>}
                                    </div>
                                )
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
