import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import {
    addDays, isSameDay, setHours, setMinutes,
    differenceInMinutes, addMinutes, startOfWeek, addWeeks, addMonths, subWeeks, subMonths, subDays,
    isToday, format, eachDayOfInterval
} from 'date-fns';
import { Job, User, JobStatus, UserRole } from '../types';
import {
    ChevronDown, List, Grid, Map as MapIcon, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../store';
import { Button } from '../components/Button';
import MapView from '../components/MapView';

// Sub-components
import { ScheduleHeader } from './schedule/ScheduleHeader';
import { UnscheduledJobsPanel } from './schedule/UnscheduledJobsPanel';
import { SchedulingWizard } from './schedule/components/SchedulingWizard';
import { DayView } from './schedule/views/DayView';
import { WeekView } from './schedule/views/WeekView';
import { MonthView } from './schedule/views/MonthView';
import { ListView } from './schedule/views/ListView';
import { MobileListView } from './schedule/views/MobileListView';
import { MobileDayView } from './schedule/views/MobileDayView';
import { ViewMode, MobileViewMode } from './schedule/types';
import { ScheduleFilters } from './schedule/components/ScheduleFilters';
import { getTechColorStyles } from './schedule/utils';


// Icons
const Layout3DayIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
);

interface ScheduleProps {
    jobs: Job[];
    users: User[];
}

// Constants shared with sub-components (could be exported from utils if needed)
const START_HOUR = 7;
const PIXELS_PER_HOUR = 112;
const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60;
const SNAP_MINUTES = 15;

export const Schedule: React.FC<ScheduleProps> = ({ jobs, users }) => {
    const store = useContext(StoreContext);
    const clients = store ? store.clients : [];
    const timeEntries = store ? store.timeEntries : [];
    const moveJob = store ? store.moveJob : () => { };
    const updateJobStatus = store ? store.updateJobStatus : () => { };
    const unscheduleJob = store ? store.unscheduleJob : () => { };
    const currentUser = store?.currentUser;

    // -- PERMISSION CHECK --
    const canDispatch = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.OFFICE;

    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    // Desktop View Mode
    const [viewMode, setViewMode] = useState<ViewMode>('day');
    const lastScrollTime = useRef(0);

    // Mobile View Mode
    const [mobileViewMode, setMobileViewMode] = useState<MobileViewMode>('list');
    const [showMobileViewOptions, setShowMobileViewOptions] = useState(false);

    const technicians = users.filter((u) => u.role === 'TECHNICIAN');

    // FILTERS
    const [hiddenTechIds, setHiddenTechIds] = useState<string[]>([]);

    // Filter logic
    const displayedTechnicians = useMemo(() => {
        return technicians.filter(t => !hiddenTechIds.includes(t.id));
    }, [technicians, hiddenTechIds]);

    const filteredJobs = useMemo(() => {
        // If all techs are hidden, show no assigned jobs? Or show all? Usually show selected.
        // If hiddenTechIds is empty, show all.
        if (hiddenTechIds.length === 0) return jobs;

        // Show job if AT LEAST ONE of its assigned techs is visible.
        // If not assigned, it's a DRAFT/Unassigned, usually shown in sidebar, but for Calendar views?
        // Calendar views usually show SCHEDULED jobs.
        // If a job is scheduled but assigned to hidden tech, hide it.
        return jobs.filter(j => {
            if (j.status === JobStatus.DRAFT) return false; // Usually filtered out by view anyway
            if (j.assignedTechIds.length === 0) return false; // Unassigned
            return j.assignedTechIds.some(id => !hiddenTechIds.includes(id));
        });
    }, [jobs, hiddenTechIds]);

    // Dispatch Mode State
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [draggingJobId, setDraggingJobId] = useState<string | null>(null);
    const [dropPreview, setDropPreview] = useState<{ techId: string, start: Date } | null>(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Scheduling Wizard State
    const [pendingSchedule, setPendingSchedule] = useState<{ job: Job, date: Date, techId?: string } | null>(null);

    // Current Time Indicator
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // --- MEMOIZED CALCULATIONS ---
    const baseUnassignedJobs = useMemo(() => {
        return jobs.filter(j => j.status === JobStatus.DRAFT || j.assignedTechIds.length === 0);
    }, [jobs]);

    const unassignedJobs = useMemo(() => {
        if (!searchQuery) return baseUnassignedJobs;
        const searchLower = searchQuery.toLowerCase();

        return baseUnassignedJobs.filter(j => {
            const client = clients.find(c => c.id === j.clientId);
            return (
                j.title.toLowerCase().includes(searchLower) ||
                client?.firstName.toLowerCase().includes(searchLower) ||
                client?.lastName.toLowerCase().includes(searchLower)
            );
        });
    }, [baseUnassignedJobs, searchQuery, clients]);

    // Auto-Minimize/Maximize Logic (Only for dispatchers)
    const prevUnassignedCount = useRef(0);
    useEffect(() => {
        if (!canDispatch) return;
        const count = baseUnassignedJobs.length;
        if (count === 0 && prevUnassignedCount.current > 0) {
            setIsSidebarOpen(false);
        }
        else if (count > 0 && prevUnassignedCount.current === 0) {
            setIsSidebarOpen(true);
        }
        prevUnassignedCount.current = count;
    }, [baseUnassignedJobs.length, canDispatch]);

    // --- HANDLERS ---

    const handlePrev = () => {
        if (viewMode === 'day') setCurrentDate((prev) => addDays(prev, -1));
        if (viewMode === 'week') setCurrentDate((prev) => subWeeks(prev, 1));
        if (viewMode === 'month') setCurrentDate((prev) => subMonths(prev, 1));
        if (viewMode === 'list') setCurrentDate((prev) => subWeeks(prev, 1));
        if (viewMode === 'map') setCurrentDate((prev) => addDays(prev, -1));
    };

    const handleNext = () => {
        if (viewMode === 'day') setCurrentDate((prev) => addDays(prev, 1));
        if (viewMode === 'week') setCurrentDate((prev) => addWeeks(prev, 1));
        if (viewMode === 'month') setCurrentDate((prev) => addMonths(prev, 1));
        if (viewMode === 'list') setCurrentDate((prev) => addWeeks(prev, 1));
        if (viewMode === 'map') setCurrentDate((prev) => addDays(prev, 1));
    };

    const handleToday = () => setCurrentDate(new Date());

    const handleWheel = (e: React.WheelEvent) => {
        if (viewMode === 'month') {
            const now = Date.now();
            if (now - lastScrollTime.current < 250) return; // Throttle

            if (Math.abs(e.deltaY) > 10) {
                lastScrollTime.current = now;
                if (e.deltaY > 0) {
                    handleNext();
                } else {
                    handlePrev();
                }
            }
        }
    };

    const handleJobClick = (job: Job, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/jobs/${job.id}`);
    };

    const handleDragStart = (e: React.DragEvent, job: Job) => {
        if (!canDispatch) return;
        e.stopPropagation();
        e.dataTransfer.setData('jobId', job.id);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            setDraggingJobId(job.id);
        }, 20);
    };

    const calculateSnapTime = (e: React.MouseEvent | React.DragEvent, container: HTMLDivElement) => {
        const rect = container.getBoundingClientRect();
        const offsetY = e.clientY - rect.top + container.scrollTop;
        const minutesFromStart = offsetY / PIXELS_PER_MINUTE;
        const snappedMinutes = Math.round(minutesFromStart / SNAP_MINUTES) * SNAP_MINUTES;
        const snapTime = new Date(currentDate);
        snapTime.setHours(START_HOUR, 0, 0, 0);
        return addMinutes(snapTime, snappedMinutes);
    };

    const handleDragOver = (e: React.DragEvent, techId: string) => {
        if (!canDispatch) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        // Logic for preview moved here from DayView or kept here?
        // It resides here because it updates state used by DayView
        if (viewMode === 'day') {
            // We need access to the container relative position.
            // DayView passes the event.
            const time = calculateSnapTime(e, e.currentTarget as HTMLDivElement);
            if (!dropPreview || dropPreview.techId !== techId || dropPreview.start.getTime() !== time.getTime()) {
                setDropPreview({ techId, start: time });
            }
        }
    };

    const handleDrop = (e: React.DragEvent, techId: string) => {
        if (!canDispatch) return;
        e.preventDefault();
        e.stopPropagation();

        const jobId = e.dataTransfer.getData('jobId');
        const job = jobs.find(j => j.id === jobId);
        if (!job) return;

        if (viewMode === 'day') {
            let targetStart = dropPreview?.start;
            if (!targetStart) {
                targetStart = calculateSnapTime(e, e.currentTarget as HTMLDivElement);
            }

            if (targetStart) {
                finalizeMove(jobId, techId, targetStart);
            }
        } else if (viewMode === 'week') {
            setPendingSchedule({ job, date: currentDate, techId });
        } else if (viewMode === 'month') {
            setPendingSchedule({ job, date: currentDate });
        }

        setDraggingJobId(null);
        setDropPreview(null);
    };

    const handleUnassignedDragOver = (e: React.DragEvent) => {
        if (!canDispatch) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dropPreview) {
            setDropPreview(null);
        }
    };

    const handleUnassignedDrop = (e: React.DragEvent) => {
        if (!canDispatch) return;
        e.preventDefault();
        e.stopPropagation();
        const jobId = e.dataTransfer.getData('jobId');
        if (jobId) {
            unscheduleJob(jobId);
            setDraggingJobId(null);
            setDropPreview(null);
        }
    };

    const finalizeMove = (jobId: string, techId: string, newStart: Date) => {
        const job = jobs.find(j => j.id === jobId);
        if (!job) return;

        let durationMinutes = differenceInMinutes(new Date(job.end), new Date(job.start));
        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            durationMinutes = 120;
        }

        const newEnd = addMinutes(newStart, durationMinutes);

        let newAssignedTechIds = [...job.assignedTechIds];
        if (!newAssignedTechIds.includes(techId)) {
            if (newAssignedTechIds.length <= 1) {
                newAssignedTechIds = [techId];
            } else {
                newAssignedTechIds.push(techId);
            }
        }

        moveJob(jobId, newStart.toISOString(), newEnd.toISOString(), newAssignedTechIds);

        if (job.status === JobStatus.DRAFT) {
            updateJobStatus(jobId, JobStatus.SCHEDULED);
        }

        setSelectedJobId(null);
        setDraggingJobId(null);
        setDropPreview(null);
        setPendingSchedule(null);
    };

    const handleDragEnd = () => {
        setDraggingJobId(null);
        setDropPreview(null);
    };

    const handleColumnClick = (techId: string) => {
        setSelectedJobId(null);
    };

    const isJobUnassigned = (jobId: string) => {
        return !!baseUnassignedJobs.find(j => j.id === jobId);
    }

    return (
        <>
            {/* --- MOBILE LAYOUT --- */}
            <div className="flex flex-col h-[calc(100vh-64px)] md:hidden bg-slate-50 dark:bg-slate-900 -m-4 relative">
                {/* Mobile Header - Could be extracted but keeping for now as it's simple */}
                <div className="bg-white dark:bg-slate-800 shadow-sm z-30 shrink-0">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                        <button
                            className="flex items-center gap-1 text-lg font-bold text-slate-900 dark:text-white"
                            onClick={() => setCurrentDate(new Date())}
                        >
                            {format(currentDate, 'MMMM yyyy')}
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() => setShowMobileViewOptions(!showMobileViewOptions)}
                                    className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    {mobileViewMode === 'list' && <List className="w-5 h-5" />}
                                    {mobileViewMode === 'day' && <Grid className="w-5 h-5" />}
                                    {mobileViewMode === '3day' && <Layout3DayIcon className="w-5 h-5" />}
                                    {mobileViewMode === 'map' && <MapIcon className="w-5 h-5" />}
                                </button>
                                {showMobileViewOptions && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowMobileViewOptions(false)}></div>
                                        <div className="absolute right-0 top-12 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                            {[
                                                { id: 'list', label: 'List View', icon: List },
                                                { id: 'day', label: 'Day View', icon: Grid },
                                                { id: '3day', label: '3-Day View', icon: Layout3DayIcon },
                                                { id: 'map', label: 'Map View', icon: MapIcon },
                                            ].map(option => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => { setMobileViewMode(option.id as MobileViewMode); setShowMobileViewOptions(false); }}
                                                    className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 ${mobileViewMode === option.id ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-700 dark:text-slate-300'}`}
                                                >
                                                    <option.icon className="w-4 h-4" /> {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            {canDispatch && (
                                <button className="p-2 bg-slate-900 dark:bg-emerald-600 rounded-full text-white shadow-lg shadow-slate-900/20 dark:shadow-emerald-600/20 active:scale-95 transition-transform">
                                    <Plus className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Date Scrubber - keeping inline as it's mobile specific */}
                    <div className="flex overflow-x-auto py-2 px-2 hide-scrollbar bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        {eachDayOfInterval({
                            start: subDays(currentDate, 3),
                            end: addDays(currentDate, 3)
                        }).map(day => {
                            const isSelected = isSameDay(day, currentDate);
                            const isTodayDate = isToday(day);
                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => setCurrentDate(day)}
                                    className={`flex flex-col items-center justify-center min-w-[3.5rem] py-2 rounded-xl mx-1 transition-all duration-200 ${isSelected ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-105' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                >
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {format(day, 'EEE')}
                                    </span>
                                    <span className={`text-lg font-bold leading-none mt-1 ${isTodayDate && !isSelected ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                                        {format(day, 'd')}
                                    </span>
                                    {isTodayDate && !isSelected && <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1"></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-900 relative">
                    {mobileViewMode === 'list' && <MobileListView currentDate={currentDate} jobs={jobs} clients={clients} users={users} canDispatch={canDispatch} />}
                    {mobileViewMode === 'day' && <MobileDayView currentDate={currentDate} jobs={jobs} clients={clients} daysToShow={1} now={now} />}
                    {mobileViewMode === '3day' && <MobileDayView currentDate={currentDate} jobs={jobs} clients={clients} daysToShow={3} now={now} />}
                    {mobileViewMode === 'map' && (
                        <div className="h-full w-full">
                            <MapView
                                jobs={jobs}
                                users={users}
                                clients={clients}
                                timeEntries={timeEntries}
                                invoices={store?.invoices || []}
                                selectedDate={currentDate}
                                defaultLocation={store?.settings?.companyAddress}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* --- DESKTOP LAYOUT --- */}
            <div className="flex-col h-[calc(100vh-100px)] hidden md:flex">
                <ScheduleHeader
                    currentDate={currentDate}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onToday={handleToday}
                    canDispatch={canDispatch}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    unassignedCount={unassignedJobs.length}
                    filterSlot={
                        <ScheduleFilters
                            technicians={technicians}
                            hiddenTechIds={hiddenTechIds}
                            onToggleTech={(id) => {
                                setHiddenTechIds(prev =>
                                    prev.includes(id)
                                        ? prev.filter(tid => tid !== id)
                                        : [...prev, id]
                                );
                            }}
                            onShowAll={() => setHiddenTechIds([])}
                        />
                    }
                />

                <div className="flex gap-6 flex-1 min-h-0">
                    <div className={`flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col relative transition-all duration-300`}>
                        {viewMode === 'map' && (
                            <div className="flex-1 relative">
                                <MapView
                                    jobs={filteredJobs}
                                    users={users}
                                    clients={clients}
                                    timeEntries={timeEntries}
                                    invoices={store?.invoices || []}
                                    selectedDate={currentDate}
                                    defaultLocation={store?.settings?.companyAddress}
                                />
                            </div>
                        )}

                        {viewMode === 'day' && (
                            <DayView
                                currentDate={currentDate}
                                technicians={displayedTechnicians}
                                jobs={jobs}
                                clients={clients}
                                canDispatch={canDispatch}
                                handleJobClick={handleJobClick}
                                handleDragStart={handleDragStart}
                                handleDragEnd={handleDragEnd}
                                handleDragOver={handleDragOver}
                                handleDrop={handleDrop}
                                handleColumnClick={handleColumnClick}
                                now={now}
                                dropPreview={dropPreview}
                                selectedJobId={selectedJobId}
                                draggingJobId={draggingJobId}
                            />
                        )}
                        {viewMode === 'week' && <WeekView currentDate={currentDate} jobs={filteredJobs} clients={clients} users={users} handleJobClick={handleJobClick} />}
                        {viewMode === 'month' && <MonthView currentDate={currentDate} jobs={filteredJobs} users={users} setCurrentDate={setCurrentDate} setViewMode={setViewMode} handleWheel={handleWheel} />}
                        {viewMode === 'list' && <ListView currentDate={currentDate} jobs={filteredJobs} clients={clients} users={users} setCurrentDate={setCurrentDate} />}
                    </div>

                    {canDispatch && (
                        <UnscheduledJobsPanel
                            isOpen={isSidebarOpen}
                            onClose={() => setIsSidebarOpen(false)}
                            unassignedJobs={unassignedJobs}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedJobId={selectedJobId}
                            setSelectedJobId={setSelectedJobId}
                            onDragStart={handleDragStart}
                            draggingJobId={draggingJobId}
                            isJobUnassigned={isJobUnassigned}
                            onDrop={handleUnassignedDrop}
                            onDragOver={handleUnassignedDragOver}
                            clients={clients}
                        />
                    )}
                </div>
            </div>

            {canDispatch && (
                <SchedulingWizard
                    isOpen={!!pendingSchedule}
                    onClose={() => setPendingSchedule(null)}
                    job={pendingSchedule?.job || null}
                    date={pendingSchedule?.date || null}
                    preSelectedTechId={pendingSchedule?.techId}
                    technicians={technicians}
                    jobs={jobs}
                    onConfirm={(jobId, techId, start) => finalizeMove(jobId, techId, start)}
                />
            )}
        </>
    );
};
