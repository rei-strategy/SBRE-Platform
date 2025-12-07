import React, { useState, useRef } from 'react';
import { Job, Client, JobStatus } from '../../../types';
import { format, addDays, startOfWeek, eachDayOfInterval, startOfDay, differenceInDays, subWeeks, addWeeks, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JobsViewProps } from '../types';

export const GanttView: React.FC<JobsViewProps> = ({ jobs, clients }) => {
    const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [daysToShow, setDaysToShow] = useState(14);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const endDate = addDays(startDate, daysToShow - 1);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const cellWidth = 100;

    const handlePrev = () => setStartDate(subWeeks(startDate, 1));
    const handleNext = () => setStartDate(addWeeks(startDate, 1));
    const handleToday = () => setStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));

    const getBarPosition = (job: Job) => {
        const jobStart = new Date(job.start);
        const jobEnd = new Date(job.end);
        const diffDays = differenceInDays(startOfDay(jobStart), startOfDay(startDate));
        let durationDays = (jobEnd.getTime() - jobStart.getTime()) / (1000 * 60 * 60 * 24);
        if (durationDays < 0.1) durationDays = 0.1;
        const left = diffDays * cellWidth;
        const width = durationDays * cellWidth;
        const padding = 4;
        return {
            left: `${left + padding}px`,
            width: `${Math.max(width - (padding * 2), 20)}px`
        };
    };

    const getStatusColor = (status: JobStatus) => {
        switch (status) {
            case JobStatus.COMPLETED: return 'bg-emerald-500 border-emerald-600';
            case JobStatus.IN_PROGRESS: return 'bg-amber-500 border-amber-600';
            case JobStatus.SCHEDULED: return 'bg-blue-500 border-blue-600';
            case JobStatus.CANCELLED: return 'bg-red-400 border-red-500';
            default: return 'bg-slate-400 border-slate-500';
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm">
                        <button onClick={handlePrev} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500 dark:text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
                        <button onClick={handleToday} className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-x border-slate-100 dark:border-slate-700">Today</button>
                        <button onClick={handleNext} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500 dark:text-slate-400"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-slate-400" />
                        {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                    </h3>
                </div>
                <div className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Scheduled</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> In Progress</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Completed</span>
                </div>
            </div>
            <div className="flex-1 flex overflow-hidden relative">
                <div className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 z-20 flex flex-col shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                    <div className="h-[50px] border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center px-4 font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Job Details
                    </div>
                    <div className="overflow-hidden">
                        {jobs.map(job => {
                            const client = clients.find(c => c.id === job.clientId);
                            return (
                                <div key={job.id} className="h-[60px] border-b border-slate-100 dark:border-slate-700/50 px-4 flex flex-col justify-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate pr-2">{job.title}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{client?.firstName} {client?.lastName}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-900/30" ref={scrollContainerRef}>
                    <div className="relative" style={{ width: `${days.length * cellWidth}px` }}>
                        <div className="flex sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-[50px]">
                            {days.map(day => {
                                const isTodayDate = isSameDay(day, new Date());
                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={`flex-shrink-0 border-r border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center ${isTodayDate ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                                        style={{ width: `${cellWidth}px` }}
                                    >
                                        <span className={`text-[10px] font-bold uppercase ${isTodayDate ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                            {format(day, 'EEE')}
                                        </span>
                                        <span className={`text-sm font-bold ${isTodayDate ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-2 rounded-full' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex pointer-events-none">
                                {days.map(day => (
                                    <div
                                        key={`grid-${day.toISOString()}`}
                                        className={`flex-shrink-0 border-r border-slate-100 dark:border-slate-700/30 h-full ${isSameDay(day, new Date()) ? 'bg-blue-50/10 dark:bg-blue-900/5' : ''}`}
                                        style={{ width: `${cellWidth}px` }}
                                    />
                                ))}
                            </div>
                            {jobs.map(job => (
                                <div key={`row-${job.id}`} className="h-[60px] border-b border-slate-100 dark:border-slate-700/50 relative group hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        className={`absolute top-3 h-9 rounded-md shadow-sm border text-white text-xs font-bold flex items-center px-2 truncate hover:brightness-110 hover:shadow-md transition-all z-10 ${getStatusColor(job.status)}`}
                                        style={getBarPosition(job)}
                                        title={`${job.title} (${format(new Date(job.start), 'MMM d, h:mm a')} - ${format(new Date(job.end), 'h:mm a')})`}
                                    >
                                        <span className="drop-shadow-md truncate">{format(new Date(job.start), 'h:mm a')}</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
