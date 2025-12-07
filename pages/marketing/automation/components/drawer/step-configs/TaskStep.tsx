import React from 'react';

interface TaskStepProps {
    config: any;
    updateConfig: (updates: any) => void;
}

export const TaskStep: React.FC<TaskStepProps> = ({ config, updateConfig }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
                <input
                    type="text"
                    value={config.title || ''}
                    onChange={(e) => updateConfig({ title: e.target.value })}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                    value={config.description || ''}
                    onChange={(e) => updateConfig({ description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>
        </div>
    );
};
