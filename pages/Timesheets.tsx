import React, { useContext, useState } from 'react';
import { StoreContext } from '../store';
import { TimeEntry, TimeEntryType, TimeEntryStatus, UserRole } from '../types';
import { startOfWeek, differenceInMinutes } from 'date-fns';

// Extracted Components
import { ClockWidget } from './timesheets/components/ClockWidget';
import { PayrollSummary } from './timesheets/components/PayrollSummary';
import { MyTimesheet } from './timesheets/components/MyTimesheet';
import { TeamGrid } from './timesheets/components/TeamGrid';
import { ManualEntryModal } from './timesheets/components/ManualEntryModal';

export const Timesheets: React.FC = () => {
    const store = useContext(StoreContext);
    const [activeTab, setActiveTab] = useState<'MY_TIME' | 'TEAM' | 'APPROVALS' | 'TIMEOFF'>('MY_TIME');
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

    if (!store) return null;
    const { currentUser, updateTimeEntry, addTimeEntry } = store;

    const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.OFFICE;

    const handleSaveManualEntry = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const type = formData.get('type') as TimeEntryType;
        const date = formData.get('date') as string;
        const startTime = formData.get('startTime') as string;
        const endTime = formData.get('endTime') as string;
        const notes = formData.get('notes') as string;

        const startDateTime = new Date(`${date}T${startTime}`).toISOString();
        const endDateTime = endTime ? new Date(`${date}T${endTime}`).toISOString() : undefined;
        const duration = endDateTime ? differenceInMinutes(new Date(endDateTime), new Date(startDateTime)) : undefined;

        if (editingEntry) {
            updateTimeEntry({
                ...editingEntry,
                type,
                startTime: startDateTime,
                endTime: endDateTime,
                durationMinutes: duration,
                notes
            });
        } else {
            addTimeEntry({
                id: crypto.randomUUID(),
                userId: currentUser.id,
                type,
                startTime: startDateTime,
                endTime: endDateTime,
                durationMinutes: duration,
                status: TimeEntryStatus.PENDING,
                notes
            });
        }
        setIsManualEntryOpen(false);
        setEditingEntry(null);
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* HEADER & DASHBOARD */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Timesheets</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track time, manage approvals, and process payroll.</p>
                </div>

                {/* CLOCK WIDGET */}
                <ClockWidget />
            </div>

            {/* PAYROLL SUMMARY CARD */}
            <PayrollSummary currentWeekStart={currentWeekStart} />

            {/* TABS */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                <button onClick={() => setActiveTab('MY_TIME')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'MY_TIME' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>My Timesheet</button>
                {isAdmin && <button onClick={() => setActiveTab('TEAM')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'TEAM' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Team Grid</button>}
                {isAdmin && <button onClick={() => setActiveTab('APPROVALS')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'APPROVALS' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Approvals</button>}
                <button onClick={() => setActiveTab('TIMEOFF')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'TIMEOFF' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Time Off</button>
            </div>

            {/* MY TIMESHEET VIEW */}
            {activeTab === 'MY_TIME' && (
                <MyTimesheet
                    currentWeekStart={currentWeekStart}
                    setCurrentWeekStart={setCurrentWeekStart}
                    onManualEntry={(entry) => {
                        setEditingEntry(entry || null);
                        setIsManualEntryOpen(true);
                    }}
                />
            )}

            {/* TEAM GRID VIEW */}
            {activeTab === 'TEAM' && isAdmin && (
                <TeamGrid currentWeekStart={currentWeekStart} />
            )}

            {/* MANUAL ENTRY MODAL */}
            <ManualEntryModal
                isOpen={isManualEntryOpen}
                onClose={() => { setIsManualEntryOpen(false); setEditingEntry(null); }}
                editingEntry={editingEntry}
                onSave={handleSaveManualEntry}
            />
        </div>
    );
};