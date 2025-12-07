import React, { useState, useEffect } from 'react';
import {
    format, setHours, setMinutes,
    differenceInMinutes, addMinutes, isSameDay, areIntervalsOverlapping
} from 'date-fns';
import { ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { Job, User } from '../../../types';
import { Modal } from '../../../components/Modal';

interface SchedulingWizardProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job | null;
    date: Date | null;
    preSelectedTechId?: string;
    technicians: User[];
    jobs: Job[];
    onConfirm: (jobId: string, techId: string, start: Date) => void;
}

const START_HOUR = 7; // 7 AM
const END_HOUR = 21; // 9 PM

export const SchedulingWizard: React.FC<SchedulingWizardProps> = ({
    isOpen, onClose, job, date, preSelectedTechId, technicians, jobs, onConfirm
}) => {
    const [step, setStep] = useState<'TECH' | 'TIME'>('TECH');
    const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<Date[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (preSelectedTechId) {
                setSelectedTechId(preSelectedTechId);
                setStep('TIME');
            } else {
                setStep('TECH');
                setSelectedTechId(null);
            }
        }
    }, [isOpen, preSelectedTechId]);

    useEffect(() => {
        if (step === 'TIME' && selectedTechId && date && job) {
            const duration = differenceInMinutes(new Date(job.end), new Date(job.start));
            const validDuration = isNaN(duration) || duration <= 0 ? 120 : duration;

            const slots = [];
            let cursor = setMinutes(setHours(date, START_HOUR), 0);
            const endOfDay = setMinutes(setHours(date, END_HOUR), 0);

            const techJobs = jobs.filter(j =>
                j.assignedTechIds.includes(selectedTechId) &&
                isSameDay(new Date(j.start), date)
            );

            while (differenceInMinutes(endOfDay, cursor) >= validDuration) {
                const proposedEnd = addMinutes(cursor, validDuration);
                const hasConflict = techJobs.some(j =>
                    areIntervalsOverlapping(
                        { start: cursor, end: proposedEnd },
                        { start: new Date(j.start), end: new Date(j.end) }
                    )
                );

                if (!hasConflict) {
                    slots.push(cursor);
                }
                cursor = addMinutes(cursor, 30);
            }
            setAvailableSlots(slots);
        }
    }, [step, selectedTechId, date, job, jobs]);

    if (!job) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule Job">
            <div className="p-1">
                <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white">{job.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{date && format(date, 'EEEE, MMMM do')}</p>
                </div>

                {step === 'TECH' && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">Select Technician</h3>
                        {technicians.map(tech => (
                            <button
                                key={tech.id}
                                onClick={() => { setSelectedTechId(tech.id); setStep('TIME'); }}
                                className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-left group"
                            >
                                <div className={`w-10 h-10 rounded-full bg-${tech.color}-500 flex items-center justify-center text-white shadow-sm`}>
                                    {tech.avatarUrl ? (
                                        <img src={tech.avatarUrl} alt={tech.name} className="w-full h-full rounded-full" />
                                    ) : tech.name[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{tech.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">View availability</p>
                                </div>
                                <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-emerald-500" />
                            </button>
                        ))}
                    </div>
                )}

                {step === 'TIME' && (
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            {!preSelectedTechId && (
                                <button onClick={() => setStep('TECH')} className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center">
                                    <ChevronLeft className="w-3 h-3" /> Back
                                </button>
                            )}
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Available Time Slots</h3>
                        </div>

                        {availableSlots.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                                <p>No available slots for this day.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                                {availableSlots.map(slot => (
                                    <button
                                        key={slot.toISOString()}
                                        onClick={() => selectedTechId && onConfirm(job.id, selectedTechId, slot)}
                                        className="p-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors text-center text-slate-700 dark:text-slate-300"
                                    >
                                        {format(slot, 'h:mm a')}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};
