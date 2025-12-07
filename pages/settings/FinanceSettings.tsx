import React from 'react';

interface FinanceSettingsProps {
    settings: any;
    updateSettings: (settings: any) => void;
}

export const FinanceSettings: React.FC<FinanceSettingsProps> = ({ settings, updateSettings }) => {
    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Finance & Taxes</h2>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Default Tax Rate (%)</label>
                    <input
                        type="number"
                        step="0.01"
                        className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={settings.taxRate}
                        onChange={(e) => updateSettings({ taxRate: parseFloat(e.target.value) })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Currency</label>
                    <select
                        className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={settings.currency}
                        onChange={(e) => updateSettings({ currency: e.target.value })}
                    >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
