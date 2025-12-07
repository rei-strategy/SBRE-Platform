import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import { Loader2, Calendar } from 'lucide-react';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (date: string) => void;
    onSendNow: () => void;
    isSaving: boolean;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
    isOpen,
    onClose,
    onSchedule,
    onSendNow,
    isSaving
}) => {
    const [scheduleDate, setScheduleDate] = useState('');

    // Reset date when modal opens
    useEffect(() => {
        if (isOpen) setScheduleDate('');
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Review & Schedule" footer={
            <>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button
                    onClick={() => {
                        if (!scheduleDate) {
                            onSendNow();
                        } else {
                            onSchedule(scheduleDate);
                        }
                    }}
                    className="bg-emerald-600 text-white"
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {scheduleDate ? 'Schedule' : 'Send Now'}
                </Button>
            </>
        }>
            <div className="p-4 space-y-4">
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="datetime-local"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={scheduleDate}
                        onChange={e => setScheduleDate(e.target.value)}
                    />
                </div>
                <p className="text-xs text-slate-500 mt-2">Leave blank to send immediately.</p>
            </div>
        </Modal>
    );
};
