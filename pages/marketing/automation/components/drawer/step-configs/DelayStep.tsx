import React from 'react';

interface DelayStepProps {
    config: any;
    updateConfig: (updates: any) => void;
}

export const DelayStep: React.FC<DelayStepProps> = ({ config, updateConfig }) => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Days</label>
                <input
                    type="number"
                    min="0"
                    value={config.days || 0}
                    onChange={(e) => updateConfig({ days: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hours</label>
                <input
                    type="number"
                    min="0"
                    max="23"
                    value={config.hours || 0}
                    onChange={(e) => updateConfig({ hours: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Minutes</label>
                <input
                    type="number"
                    min="0"
                    max="59"
                    value={config.minutes || 0}
                    onChange={(e) => updateConfig({ minutes: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>
        </div>
    );
};
