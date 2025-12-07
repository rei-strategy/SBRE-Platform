import React, { useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { format, differenceInMinutes, setHours, isSameDay } from 'date-fns';
import { Job, User, Client, JobStatus } from '../../../types';
import { getTechColorStyles, getOverlappingIntervals } from '../utils';
import { TechHeader } from '../components/TechHeader';

interface DayViewProps {
    currentDate: Date;
    technicians: User[];
    jobs: Job[];
    clients: Client[];
    canDispatch: boolean;
    handleJobClick: (job: Job, e: React.MouseEvent) => void;
    handleDragStart: (e: React.DragEvent, job: Job) => void;
    handleDragEnd: () => void;
    handleDragOver: (e: React.DragEvent, techId: string) => void;
    handleDrop: (e: React.DragEvent, techId: string) => void;
    handleColumnClick: (techId: string) => void;
    now: Date;
    dropPreview: { techId: string, start: Date } | null;
    selectedJobId: string | null;
    draggingJobId: string | null;
}

const START_HOUR = 7;
const END_HOUR = 21;
const HOURS_COUNT = END_HOUR - START_HOUR;
const PIXELS_PER_HOUR = 112;
const MIN_JOB_HEIGHT = 48;

export const DayView: React.FC<DayViewProps> = ({
    currentDate,
    technicians,
    jobs,
    clients,
    canDispatch,
    handleJobClick,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleColumnClick,
    now,
    dropPreview,
    selectedJobId,
    draggingJobId
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            const scrollPosition = (START_HOUR * PIXELS_PER_HOUR) - 50;
            scrollRef.current.scrollTop = Math.max(0, scrollPosition);
        }
    }, [currentDate]);

    const getJobsForTech = (techId: string, date: Date) => {
        return jobs.filter(
            (j) =>
                j.assignedTechIds.includes(techId) &&
                isSameDay(new Date(j.start), date)
        );
    };

    const renderCurrentTimeLine = (inColumn: boolean = false) => {
        if (!isSameDay(now, currentDate)) return null;
        const currentHour = now.getHours() + now.getMinutes() / 60;
        if (currentHour < START_HOUR || currentHour > END_HOUR) return null;

        const top = (currentHour - START_HOUR) * PIXELS_PER_HOUR;

        return (
            <div
                className="absolute left-0 right-0 z-20 pointer-events-none flex items-center group"
                style={{ top: `${top}px` }}
            >
                {!inColumn && (
                    <div className="absolute -left-16 w-16 text-right pr-2">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                            {format(now, 'h:mm a')}
                        </span>
                    </div>
                )}
                <div className="w-full border-t-2 border-red-500/50 shadow-[0_0_4px_rgba(239,68,68,0.4)]"></div>
            </div>
        );
    };

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col bg-white dark:bg-slate-800"
            onDragOver={(e) => canDispatch && e.preventDefault()}
        >
            {/* Header Row (Technicians) - Sticky */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-30 shadow-sm min-h-[80px]">
                <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col items-center justify-end pb-2">
                    <Clock className="w-4 h-4 text-slate-300 dark:text-slate-500" />
                </div>
                {technicians.map(tech => {
                    return (
                        <div key={tech.id} className="flex-1 min-w-[180px] border-r border-slate-100 dark:border-slate-700 p-3 group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <TechHeader tech={tech} dayJobs={getJobsForTech(tech.id, currentDate)} />
                        </div>
                    );
                })}
            </div>

            {/* Grid Body */}
            <div className="flex relative min-h-[1680px]"> {/* 15 hours * 112px */}
                {/* Time Column */}
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

                {/* Tech Columns */}
                {technicians.map((tech, i) => {
                    const dayJobs = getJobsForTech(tech.id, currentDate);
                    const techStyles = getTechColorStyles(tech.color);

                    return (
                        <div
                            key={tech.id}
                            className="flex-1 min-w-[180px] border-r border-slate-100 dark:border-slate-700 relative group"
                            onDragOver={(e) => handleDragOver(e, tech.id)}
                            onDrop={(e) => handleDrop(e, tech.id)}
                            onClick={() => handleColumnClick(tech.id)}
                        >
                            {/* Hour Grid Lines */}
                            {Array.from({ length: HOURS_COUNT }).map((_, h) => (
                                <div key={h} className="h-28 border-b border-slate-50 dark:border-slate-700/50"></div>
                            ))}

                            {/* Current Time Line (if today) */}
                            {renderCurrentTimeLine(true)}

                            {/* Overlap Indicators */}
                            {getOverlappingIntervals(dayJobs).map((overlap, idx) => {
                                const top = (differenceInMinutes(overlap.start, setHours(currentDate, START_HOUR)) / 60) * PIXELS_PER_HOUR;
                                const height = (differenceInMinutes(overlap.end, overlap.start) / 60) * PIXELS_PER_HOUR;
                                return (
                                    <div
                                        key={`overlap-${idx}`}
                                        className="absolute left-1 right-1 bg-red-500/30 z-20 pointer-events-none rounded-md border-2 border-red-500 border-dashed"
                                        style={{ top: `${top}px`, height: `${height}px` }}
                                    />
                                );
                            })}

                            {/* Drop Preview Phantom */}
                            {dropPreview && dropPreview.techId === tech.id && (
                                <div
                                    className="absolute left-2 right-2 rounded-lg border-2 border-dashed border-emerald-400 bg-emerald-50/50 z-10 pointer-events-none flex items-center justify-center"
                                    style={{
                                        top: `${(differenceInMinutes(dropPreview.start, setHours(currentDate, START_HOUR)) / 60) * PIXELS_PER_HOUR}px`,
                                        height: '112px' // Default 1h height preview
                                    }}
                                >
                                    <span className="text-emerald-600 font-bold text-sm bg-white/80 px-2 py-1 rounded">
                                        {format(dropPreview.start, 'h:mm a')}
                                    </span>
                                </div>
                            )}

                            {/* Jobs */}
                            {dayJobs.map(job => {
                                const start = new Date(job.start);
                                const end = new Date(job.end);
                                const top = (differenceInMinutes(start, setHours(currentDate, START_HOUR)) / 60) * PIXELS_PER_HOUR;
                                const height = Math.max((differenceInMinutes(end, start) / 60) * PIXELS_PER_HOUR, MIN_JOB_HEIGHT); // Min height
                                const client = clients.find(c => c.id === job.clientId);
                                const isOverlapping = false;

                                return (
                                    <div
                                        key={job.id}
                                        draggable={canDispatch}
                                        onDragStart={(e) => handleDragStart(e, job)}
                                        onDragEnd={handleDragEnd}
                                        onClick={(e) => handleJobClick(job, e)}
                                        className={`
                                        absolute left-1 right-1 rounded-xl border-l-4 p-2 text-xs cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:z-50
                                        ${selectedJobId === job.id ? 'ring-2 ring-slate-900 z-40 scale-[1.02]' : 'z-10'}
                                        ${draggingJobId === job.id ? 'opacity-50' : 'opacity-100'}
                                        ${job.status === JobStatus.COMPLETED
                                                ? 'bg-slate-100 dark:bg-slate-700 border-slate-400 opacity-80 grayscale'
                                                : `bg-${tech?.color || 'slate'}-50 dark:bg-${tech?.color || 'slate'}-900/30 border-${tech?.color || 'slate'}-500`
                                            }
                                    `}
                                        style={{
                                            top: `${top}px`,
                                            height: `${height}px`,
                                            left: isOverlapping ? '20%' : '4px'
                                        }}
                                    >
                                        <div className="flex justify-between items-start gap-1">
                                            <span className={`font-bold truncate text-[11px] leading-tight ${job.status === JobStatus.COMPLETED ? 'text-slate-900 dark:text-white' : `text-${tech?.color || 'slate'}-900 dark:text-${tech?.color || 'slate'}-100`}`}>
                                                {client?.lastName || 'Unknown'}
                                            </span>
                                            <span className="bg-white/50 dark:bg-slate-900/50 px-1 rounded text-[10px] font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                                {format(start, 'h:mm')}
                                            </span>
                                        </div>
                                        <div className={`font-medium truncate mt-0.5 ${job.status === JobStatus.COMPLETED ? 'text-slate-600 dark:text-slate-300' : `text-${tech?.color || 'slate'}-700 dark:text-${tech?.color || 'slate'}-300`}`} title={job.title}>
                                            {job.title}
                                        </div>
                                        {job.priority === 'HIGH' && (
                                            <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-red-500"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
