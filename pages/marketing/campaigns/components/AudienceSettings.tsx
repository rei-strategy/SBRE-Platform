import React, { useContext } from 'react';
import { Users } from 'lucide-react';
import { StoreContext } from '../../../../store';
import { EmailCampaign } from '../../../../types';

interface AudienceSettingsProps {
    formData: Partial<EmailCampaign>;
    setFormData: (data: Partial<EmailCampaign>) => void;
}

export const AudienceSettings: React.FC<AudienceSettingsProps> = ({
    formData,
    setFormData
}) => {
    const store = useContext(StoreContext);

    // We handle the store check gracefully inside, although parent should prevent rendering if no store
    if (!store) return null;

    return (
        <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-3 h-3" /> Audience & Settings
            </h3>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Line</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Audience</label>
                <select
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.audienceId || ''}
                    onChange={e => setFormData({ ...formData, audienceId: e.target.value })}
                >
                    <option value="">Select a list...</option>
                    {store.marketingAudiences.map(segment => (
                        <option key={segment.id} value={segment.id}>{segment.name} ({segment.estimatedCount} clients)</option>
                    ))}
                </select>
            </div>
        </section>
    );
};
