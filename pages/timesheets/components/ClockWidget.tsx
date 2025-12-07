import React, { useContext } from 'react';
import { StoreContext } from '../../../store';
import { Square, Play, Clock } from 'lucide-react';
import { TimeEntry, JobStatus, TimeEntryType, TimeEntryStatus } from '../../../types';
import { differenceInMinutes, format } from 'date-fns';

export const ClockWidget: React.FC = () => {
    const store = useContext(StoreContext);

    if (!store) return null;
    const { currentUser, timeEntries, addTimeEntry, updateTimeEntry, jobs } = store;

    const currentEntry = timeEntries.find(e => e.userId === currentUser.id && !e.endTime);

    const handleClockInOut = () => {
        if (currentEntry) {
            updateTimeEntry({
                ...currentEntry,
                endTime: new Date().toISOString(),
                durationMinutes: differenceInMinutes(new Date(), new Date(currentEntry.startTime))
            });
        } else {
            // Try to find an active job to link to
            const activeJob = jobs.find(j => j.assignedTechIds.includes(currentUser.id) && j.status === JobStatus.IN_PROGRESS);

            // Use real GPS
            store.getCurrentLocation().then(location => {
                addTimeEntry({
                    id: crypto.randomUUID(),
                    userId: currentUser.id,
                    type: activeJob ? TimeEntryType.JOB : TimeEntryType.ADMIN,
                    startTime: new Date().toISOString(),
                    status: TimeEntryStatus.PENDING,
                    gpsLocation: location,
                    jobId: activeJob?.id
                });
            });
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-6 min-w-[320px]">
            <button
                onClick={handleClockInOut}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${currentEntry ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'}`}
            >
                {currentEntry ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</p>
                <h3 className={`text-xl font-bold ${currentEntry ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-white'}`}>
                    {currentEntry ? 'Clocked In' : 'Clocked Out'}
                </h3>
                {currentEntry && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Since {format(new Date(currentEntry.startTime), 'h:mm a')}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
