import React, { useState, useRef, useEffect } from 'react';
import { Filter, Check, ChevronDown } from 'lucide-react';
import { User } from '../../../types';

interface ScheduleFiltersProps {
    technicians: User[];
    hiddenTechIds: string[];
    onToggleTech: (techId: string) => void;
    onShowAll: () => void;
}

export const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
    technicians,
    hiddenTechIds,
    onToggleTech,
    onShowAll
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const activeFilterCount = technicians.length - hiddenTechIds.length;
    const isAllSelected = hiddenTechIds.length === 0;

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border
                    ${!isAllSelected
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}
                `}
            >
                <Filter className="w-4 h-4" />
                <span>Technicians</span>
                {!isAllSelected && (
                    <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                        {activeFilterCount}
                    </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-2">Filter By Filter</span>
                        <button
                            onClick={onShowAll}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 hover:underline px-2"
                        >
                            Select All
                        </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto py-1 custom-scrollbar">
                        {technicians.map(tech => {
                            const isSelected = !hiddenTechIds.includes(tech.id);
                            return (
                                <button
                                    key={tech.id}
                                    onClick={() => onToggleTech(tech.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected
                                            ? 'bg-indigo-600 border-indigo-600 text-white'
                                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                        }`}>
                                        {isSelected && <Check className="w-3 h-3" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full bg-${tech.color || 'slate'}-500`}></div>
                                        <span className={`text-sm ${isSelected ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                                            {tech.name}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
