import React, { useState } from 'react';
import { Button } from './Button';
import { X, AlertTriangle } from 'lucide-react';

interface CancellationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string, note: string, competitorName?: string, competitorCity?: string, competitorState?: string, competitorType?: string) => void;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [reason, setReason] = useState('Too Expensive');
    const [note, setNote] = useState('');

    // Competitor Intel State
    const [compName, setCompName] = useState('');
    const [compCity, setCompCity] = useState('');
    const [compState, setCompState] = useState('');
    const [compType, setCompType] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!note.trim()) {
            alert("Please provide a note explaining the cancellation.");
            return;
        }
        // Fields are fast & optional for now
        onConfirm(reason, note, compName, compCity, compState, compType);

        // Reset
        setNote('');
        setReason('Too Expensive');
        setCompName('');
        setCompCity('');
        setCompState('');
        setCompType('');
    };

    const reasons = [
        'Too Expensive',
        'Competitor',
        'Scheduling Issue',
        'Ghosted / No Reply',
        'Personal Reasons',
        'Other'
    ];

    const isCompetitor = reason === 'Competitor';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Main Container - width transitions smoothly */}
            <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex ${isCompetitor ? 'max-w-4xl' : 'max-w-md'}`}>

                {/* LEFT PANEL: Cancellation Details - Fixed width to prevent squish */}
                <div className="w-[448px] shrink-0 p-6 flex flex-col h-full border-r border-transparent transition-colors duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cancel Job</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Help us understand why this job was lost.</p>
                            </div>
                        </div>
                        {!isCompetitor && (
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Primary Reason</label>
                            <div className="grid grid-cols-2 gap-2">
                                {reasons.map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setReason(r)}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${reason === r
                                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Notes <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="E.g. Client said DetailKingz offered $50 less..."
                                className="w-full h-24 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-slate-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Only show 'Keep Job' / 'Confirm' here if NOT expanding. If expanding, action is on the right. */}
                    <div className={`mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end gap-3 transition-opacity duration-300 ${isCompetitor ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <Button variant="ghost" onClick={onClose}>Keep Job</Button>
                        <Button variant="danger" onClick={handleSubmit}>Confirm Cancellation</Button>
                    </div>
                </div>

                {/* RIGHT PANEL: Competitor Intel (Slide-Out) - Always rendered, width animates */}
                <div
                    className={`bg-slate-50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${isCompetitor ? 'w-[350px] opacity-100' : 'w-0 opacity-0 border-l-0'}`}
                >
                    {/* Inner content wrapper with fixed width to prevent layout shifting during animation */}
                    <div className="w-[350px] p-6 flex flex-col h-full shrink-0">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Competitor Intel</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Help Perplexity AI find this business.</p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Competitor Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. DetailKingz"
                                    value={compName}
                                    onChange={(e) => setCompName(e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">City</label>
                                    <input
                                        type="text"
                                        placeholder="Dallas"
                                        value={compCity}
                                        onChange={(e) => setCompCity(e.target.value)}
                                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">State</label>
                                    <input
                                        type="text"
                                        placeholder="TX"
                                        value={compState}
                                        onChange={(e) => setCompState(e.target.value)}
                                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Business Type</label>
                                {/* FREE TEXT INPUT as requested */}
                                <input
                                    type="text"
                                    placeholder="e.g. Mobile Detailer, Tunnel Wash..."
                                    value={compType}
                                    onChange={(e) => setCompType(e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                                    <strong>Pro Tip:</strong> More details = better AI research. We'll use this to spy on them later. 🕵️‍♂️
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-end gap-3">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={handleSubmit}>Save Intel & Cancel Job</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
