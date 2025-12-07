import React from 'react';

interface TagStepProps {
    config: any;
    updateConfig: (updates: any) => void;
}

export const TagStep: React.FC<TagStepProps> = ({ config, updateConfig }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tag Name</label>
            <input
                type="text"
                value={config.tag || ''}
                onChange={(e) => updateConfig({ tag: e.target.value })}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g. VIP, Lead, etc."
            />
        </div>
    );
};
