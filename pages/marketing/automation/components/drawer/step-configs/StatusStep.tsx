import React from 'react';

interface StatusStepProps {
    config: any;
    updateConfig: (updates: any) => void;
}

export const StatusStep: React.FC<StatusStepProps> = ({ config, updateConfig }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Status</label>
            <select
                value={config.status || 'SCHEDULED'}
                onChange={(e) => updateConfig({ status: e.target.value })}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
            >
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
            </select>
        </div>
    );
};
