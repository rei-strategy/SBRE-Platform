import React from 'react';
import { Button } from '../../components/Button';
import { Copy } from 'lucide-react';

interface CompanySettingsProps {
    settings: any;
    updateSettings: (settings: any) => void;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({ settings, updateSettings }) => {
    const copyInviteCode = () => {
        if (settings.companyCode) {
            navigator.clipboard.writeText(settings.companyCode);
            alert("Invite code copied to clipboard!");
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Company Profile</h2>

            {/* Invite Code Box */}
            <div className="bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-xl p-4 flex flex-col gap-2">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Team Invite Code</p>
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white tracking-widest">
                        {settings.companyCode || '-------'}
                    </span>
                    <button
                        onClick={copyInviteCode}
                        className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-500"
                        title="Copy to clipboard"
                    >
                        <Copy className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Share this code with your employees to let them join your team.</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                <input
                    className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={settings.companyName}
                    onChange={(e) => updateSettings({ companyName: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Address</label>
                <input
                    className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={settings.companyAddress}
                    onChange={(e) => updateSettings({ companyAddress: e.target.value })}
                />
            </div>
            <div className="pt-4">
                <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">Save Changes</Button>
            </div>
        </div>
    );
};
