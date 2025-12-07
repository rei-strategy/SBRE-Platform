import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MarketingAutomation } from '../../../../types';

interface AutomationHeaderProps {
    automation: MarketingAutomation;
    setAutomation: (automation: MarketingAutomation) => void;
    onSave: () => void;
    saving: boolean;
}

export const AutomationHeader: React.FC<AutomationHeaderProps> = ({
    automation,
    setAutomation,
    onSave,
    saving
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
            <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/marketing/automations')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <input
                        type="text"
                        value={automation.name}
                        onChange={(e) => setAutomation({ ...automation, name: e.target.value })}
                        className="text-lg font-bold bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-white placeholder-slate-400 w-48 md:w-auto"
                        placeholder="Automation Name"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setAutomation({ ...automation, isActive: !automation.isActive })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${automation.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${automation.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 text-sm">
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};
