import React from 'react';
import { Mail, MessageSquare, Clock, Tag, CheckSquare, Briefcase } from 'lucide-react';
import { ActionType } from '../../../../../types';

interface StepSelectorProps {
    onSelect: (type: ActionType) => void;
}

export const StepSelector: React.FC<StepSelectorProps> = ({ onSelect }) => {
    const steps: { type: ActionType; label: string; icon: React.ReactNode; desc: string, color: string }[] = [
        { type: 'SEND_EMAIL', label: 'Send Email', icon: <Mail className="w-6 h-6" />, desc: 'Send an automated email to client or staff.', color: 'bg-blue-100 text-blue-600' },
        { type: 'SEND_SMS', label: 'Send SMS', icon: <MessageSquare className="w-6 h-6" />, desc: 'Send a text message notification.', color: 'bg-green-100 text-green-600' },
        { type: 'DELAY', label: 'Delay / Wait', icon: <Clock className="w-6 h-6" />, desc: 'Wait for a specific amount of time.', color: 'bg-orange-100 text-orange-600' },
        { type: 'ADD_TAG', label: 'Add Tag', icon: <Tag className="w-6 h-6" />, desc: 'Add a tag to the client profile.', color: 'bg-purple-100 text-purple-600' },
        { type: 'REMOVE_TAG', label: 'Remove Tag', icon: <Tag className="w-6 h-6" />, desc: 'Remove a tag from the client profile.', color: 'bg-red-100 text-red-600' },
        { type: 'CREATE_TASK', label: 'Create Task', icon: <CheckSquare className="w-6 h-6" />, desc: 'Create a task for your team.', color: 'bg-indigo-100 text-indigo-600' },
        { type: 'UPDATE_JOB_STATUS', label: 'Update Job Status', icon: <Briefcase className="w-6 h-6" />, desc: 'Automatically change job status.', color: 'bg-slate-100 text-slate-600' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map(s => (
                <button
                    key={s.type}
                    onClick={() => onSelect(s.type)}
                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
                >
                    <div className={`p-3 rounded-lg ${s.color} group-hover:scale-110 transition-transform`}>
                        {s.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{s.label}</h4>
                        <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};
