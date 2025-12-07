import React, { useContext } from 'react';
import { StoreContext } from '../../../store';
import { ChevronLeft, ChevronRight, Calendar, Plus, Briefcase, Coffee, Edit2 } from 'lucide-react';
import { Button } from '../../../components/Button';
import { format, subDays, addDays, endOfWeek, isSameDay } from 'date-fns';
import { TimeEntryType, TimeEntryStatus, TimeEntry } from '../../../types';
import { formatDuration } from '../utils';

interface MyTimesheetProps {
    currentWeekStart: Date;
    setCurrentWeekStart: (date: Date) => void;
    onManualEntry: (entry?: TimeEntry) => void;
}

export const MyTimesheet: React.FC<MyTimesheetProps> = ({
    currentWeekStart,
    setCurrentWeekStart,
    onManualEntry
}) => {
    const store = useContext(StoreContext);

    if (!store) return null;
    const { currentUser, timeEntries } = store;

    // Helper for status color
    const getStatusColor = (status: TimeEntryStatus) => {
        switch (status) {
            case TimeEntryStatus.APPROVED: return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400';
            case TimeEntryStatus.REJECTED: return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
            default: return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
        }
    };

    // Calculate days for the week
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

    return (
        <div className="space-y-6">
            {/* WEEK NAVIGATOR */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentWeekStart(subDays(currentWeekStart, 7))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
                    <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <span>{format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}</span>
                    </div>
                    <button onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
                </div>
                <Button onClick={() => onManualEntry()} variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Manual Entry</Button>
            </div>

            {/* DAILY ENTRIES */}
            <div className="space-y-4">
                {weekDays.map(day => {
                    const dayEntries = timeEntries.filter(e => e.userId === currentUser.id && isSameDay(new Date(e.startTime), day));
                    const dayTotal = dayEntries.reduce((acc, e) => acc + (e.durationMinutes || 0), 0);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={day.toISOString()} className={`bg-white dark:bg-slate-800 rounded-xl border ${isToday ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-700'} overflow-hidden`}>
                            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <h3 className={`font-bold ${isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{format(day, 'EEEE, MMM d')}</h3>
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{formatDuration(dayTotal)}</span>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {dayEntries.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-slate-400 italic">No entries</div>
                                ) : (
                                    dayEntries.map(entry => (
                                        <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${entry.type === TimeEntryType.JOB ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                                    {entry.type === TimeEntryType.JOB ? <Briefcase className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-slate-900 dark:text-white">
                                                            {format(new Date(entry.startTime), 'h:mm a')} - {entry.endTime ? format(new Date(entry.endTime), 'h:mm a') : 'Now'}
                                                        </span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${getStatusColor(entry.status)}`}>{entry.status}</span>
                                                    </div>
                                                    {entry.notes && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{entry.notes}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{formatDuration(entry.durationMinutes)}</span>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                    <button onClick={() => onManualEntry(entry)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-500"><Edit2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
