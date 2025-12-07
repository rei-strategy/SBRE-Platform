import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { Job, User } from '../../../types';

interface MonthViewProps {
    currentDate: Date;
    jobs: Job[];
    users: User[];
    setCurrentDate: (date: Date) => void;
    setViewMode: (mode: any) => void;
    handleWheel: (e: React.WheelEvent) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({ currentDate, jobs, users, setCurrentDate, setViewMode, handleWheel }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weeks = [];
    let week: Date[] = [];
    days.forEach(day => {
        week.push(day);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    });

    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-800" onWheel={handleWheel}>
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{day}</div>
                ))}
            </div>
            <div className="flex-1 grid grid-rows-5 md:grid-rows-auto">
                {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="grid grid-cols-7 flex-1">
                        {week.map(day => {
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const dayJobs = jobs.filter(j => isSameDay(new Date(j.start), day) && j.status !== 'DRAFT');

                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`border-b border-r border-slate-100 dark:border-slate-700 p-2 min-h-[100px] hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${!isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-900/50' : ''}`}
                                    onClick={() => { setCurrentDate(day); setViewMode('day'); }}
                                >
                                    <div className={`text-right mb-2 text-sm font-bold ${isSameDay(day, new Date()) ? 'text-blue-600 dark:text-blue-400' : isCurrentMonth ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}>
                                        {format(day, 'd')}
                                    </div>
                                    <div className="space-y-1">
                                        {dayJobs.slice(0, 4).map(job => {
                                            const tech = users.find(u => u.id === job.assignedTechIds[0]);
                                            return (
                                                <div key={job.id} className={`text-[10px] px-1.5 py-0.5 rounded truncate border-l-2 bg-white dark:bg-slate-800 shadow-sm border-${tech?.color || 'slate'}-500 dark:text-slate-300`}>
                                                    {format(new Date(job.start), 'ha')} {job.title}
                                                </div>
                                            )
                                        })}
                                        {dayJobs.length > 4 && (
                                            <div className="text-[10px] text-slate-400 dark:text-slate-500 pl-1">+{dayJobs.length - 4} more</div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
