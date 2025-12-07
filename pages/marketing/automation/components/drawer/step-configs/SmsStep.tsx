import React from 'react';

interface SmsStepProps {
    config: any;
    updateConfig: (updates: any) => void;
}

export const SmsStep: React.FC<SmsStepProps> = ({ config, updateConfig }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
            <textarea
                value={config.message || ''}
                onChange={(e) => updateConfig({ message: e.target.value })}
                rows={4}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="SMS Message..."
            />
        </div>
    );
};
