import React from 'react';
import { differenceInMinutes } from 'date-fns';
import { GripVertical, User as UserIcon, Briefcase, Clock } from 'lucide-react';
import { Job, Client } from '../../../types';

interface UnassignedJobCardProps {
    job: Job;
    client?: Client;
    onClick: () => void;
    isSelected: boolean;
    onDragStart: (e: React.DragEvent) => void;
}

export const UnassignedJobCard: React.FC<UnassignedJobCardProps> = ({ job, client, onClick, isSelected, onDragStart }) => (
    <div
        draggable={true}
        onDragStart={onDragStart}
        onClick={onClick}
        className={`p-4 rounded-xl border cursor-grab active:cursor-grabbing transition-all duration-200 group relative select-none ${isSelected
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-md ring-1 ring-emerald-500 z-10'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-sm'
            }`}
    >
        <div className="flex justify-between items-start mb-2">
            <h4 className={`font-bold text-sm leading-tight pr-6 ${isSelected ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-800 dark:text-white'}`}>{job.title}</h4>
            <div className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30'}`}>
                <GripVertical className="w-3.5 h-3.5" />
            </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <UserIcon className="w-3 h-3" />
                <span className="font-medium">{client?.firstName} {client?.lastName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Briefcase className="w-3 h-3" />
                <span>{client?.properties.find(p => p.id === job.propertyId)?.address.city || 'No Location'}</span>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wide">
                <Clock className="w-3 h-3" />
                {Math.max(1, Math.round(differenceInMinutes(new Date(job.end), new Date(job.start)) / 60))}h
            </span>
        </div>
    </div>
);
