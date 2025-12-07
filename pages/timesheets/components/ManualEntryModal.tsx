import React from 'react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { TimeEntry, TimeEntryType } from '../../../types';
import { format } from 'date-fns';

interface ManualEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingEntry: TimeEntry | null;
    onSave: (e: React.FormEvent) => void;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
    isOpen,
    onClose,
    editingEntry,
    onSave
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingEntry ? "Edit Time Entry" : "Manual Time Entry"}
            footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" form="manual-entry-form">Save Entry</Button></>}
        >
            <form id="manual-entry-form" onSubmit={onSave} className="space-y-4 p-1">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Entry Type</label>
                    <select name="type" defaultValue={editingEntry?.type || TimeEntryType.JOB} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500">
                        <option value={TimeEntryType.JOB}>Job</option>
                        <option value={TimeEntryType.TRAVEL}>Travel</option>
                        <option value={TimeEntryType.BREAK}>Break</option>
                        <option value={TimeEntryType.ADMIN}>Admin / Shop</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                    <input type="date" name="date" defaultValue={editingEntry ? format(new Date(editingEntry.startTime), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')} required className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                        <input type="time" name="startTime" defaultValue={editingEntry ? format(new Date(editingEntry.startTime), 'HH:mm') : ''} required className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                        <input type="time" name="endTime" defaultValue={editingEntry && editingEntry.endTime ? format(new Date(editingEntry.endTime), 'HH:mm') : ''} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                    <textarea name="notes" defaultValue={editingEntry?.notes} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500" placeholder="Describe work done..." />
                </div>
            </form>
        </Modal>
    );
};
