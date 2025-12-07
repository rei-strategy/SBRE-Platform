import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../../components/Button';
import { ViewMode } from './types';

interface ScheduleHeaderProps {
    currentDate: Date;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    canDispatch: boolean;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    unassignedCount: number;
    filterSlot?: React.ReactNode;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
    currentDate,
    viewMode,
    setViewMode,
    onPrev,
    onNext,
    onToday,
    canDispatch,
    isSidebarOpen,
    setIsSidebarOpen,
    unassignedCount,
    filterSlot
}) => {
    return (
        <div className="flex justify-between items-center mb-6 shrink-0 hidden md:flex">
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center">
                    <button onClick={onPrev} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={onToday} className="px-4 py-1 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors">
                        Today
                    </button>
                    <button onClick={onNext} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white px-2 min-w-[200px] text-center select-none">
                    {format(currentDate, viewMode === 'day' ? 'EEEE, MMMM do' : 'MMMM yyyy')}
                </h2>
            </div>

            <div className="flex gap-3">
                {filterSlot && (
                    <div className="mr-2 border-r border-slate-200 dark:border-slate-700 pr-4">
                        {filterSlot}
                    </div>
                )}
                {/* View Switcher */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    {(['list', 'day', 'week', 'month', 'map'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === mode
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                </div>
                {canDispatch && (
                    <Button
                        variant="secondary"
                        className="hidden xl:flex"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? 'Hide Unassigned' : `Show Unassigned (${unassignedCount})`}
                    </Button>
                )}
            </div>
        </div>
    );
};
