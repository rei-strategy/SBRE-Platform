import React, { useState, useRef, useEffect } from 'react';
import { JobStatus } from '../types';
import { ChevronDown } from 'lucide-react';

interface JobStatusSelectProps {
    status: JobStatus;
    onChange: (status: JobStatus) => void;
}

export const JobStatusSelect: React.FC<JobStatusSelectProps> = ({ status, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const getStatusStyles = (s: string) => {
        switch (s) {
            case JobStatus.COMPLETED: return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
            case JobStatus.IN_PROGRESS: return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
            case JobStatus.SCHEDULED: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
            case JobStatus.DRAFT: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 border-dashed';
            case JobStatus.CANCELLED: return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800';
            default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (s: JobStatus, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(s);
        setIsOpen(false);
    };

    // Available statuses to select from
    const statuses = [
        JobStatus.SCHEDULED,
        JobStatus.IN_PROGRESS,
        JobStatus.COMPLETED,
        JobStatus.CANCELLED,
        JobStatus.DRAFT
    ];

    return (
        <div className="relative inline-block" ref={containerRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide whitespace-nowrap flex items-center gap-1 hover:brightness-95 transition-all ${getStatusStyles(status)}`}
            >
                {status.replace('_', ' ')}
                <ChevronDown className="w-3 h-3 opacity-50" />
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-1 flex flex-col gap-0.5">
                        {statuses.map((s) => (
                            <button
                                key={s}
                                onClick={(e) => handleSelect(s, e)}
                                className={`w-full text-left px-2 py-1.5 rounded text-[10px] font-bold border uppercase tracking-wide transition-colors ${getStatusStyles(s)}`}
                            >
                                {s.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
