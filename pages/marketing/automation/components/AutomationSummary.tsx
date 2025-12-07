import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { MarketingAutomation } from '../../../../types';
import { supabase } from '../../../../supabaseClient';

interface AutomationSummaryProps {
    automation: MarketingAutomation;
}

export const AutomationSummary: React.FC<AutomationSummaryProps> = ({ automation }) => {
    const [aiSummary, setAiSummary] = useState<string>('');
    const [generatingSummary, setGeneratingSummary] = useState(false);

    const generateSummary = async () => {
        if (!automation) return;
        setGeneratingSummary(true);
        try {
            const { data, error } = await supabase.functions.invoke('generate-automation-summary', {
                body: { automation }
            });
            if (error) throw error;
            setAiSummary(data.summary);
        } catch (error) {
            console.error('Error generating summary:', error);
            setAiSummary("Unable to generate summary at this time. Please try again.");
        } finally {
            setGeneratingSummary(false);
        }
    };

    return (
        <div className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-8 pb-12">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" /> AI Summary
                    </h3>
                    <button
                        onClick={generateSummary}
                        disabled={generatingSummary}
                        className="text-sm text-blue-600 font-medium hover:underline disabled:opacity-50"
                    >
                        {generatingSummary ? 'Generating...' : 'Regenerate'}
                    </button>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none">
                    {aiSummary ? (
                        <p className="text-slate-900 dark:text-white">{aiSummary}</p>
                    ) : (
                        <>
                            <p>
                                This automation starts whenever a <strong>{automation.triggerType.replace(/_/g, ' ').toLowerCase()}</strong> event occurs.
                                {automation.triggerConfig?.conditions?.conditions?.length > 0 && ` It will only run if specific conditions are met (e.g., ${automation.triggerConfig?.conditions?.conditions?.[0]?.field} ${automation.triggerConfig?.conditions?.conditions?.[0]?.operator} ${automation.triggerConfig?.conditions?.conditions?.[0]?.value}).`}
                            </p>
                            <p>
                                After the trigger, the workflow proceeds through <strong>{automation.steps.length} steps</strong>.
                                {(automation.steps.find(s => s.type === 'DELAY')) && " It includes wait periods to ensure timely communication."}
                                {(automation.steps.find(s => s.type === 'SEND_EMAIL')) && " The system will automatically send personalized emails to the designated recipients."}
                            </p>
                            <p className="text-slate-500 italic">
                                "This workflow is designed to engage your clients automatically, saving you time and ensuring consistent follow-up."
                            </p>
                        </>
                    )}
                </div>

                {/* Structured Summary */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-100 dark:border-slate-700 pt-6">
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Trigger</h4>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">{automation.triggerType.replace(/_/g, ' ')}</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Actions</h4>
                        <div className="space-y-1">
                            {automation.steps.map((s, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{s.type.replace(/_/g, ' ')}</span>
                                </div>
                            ))}
                            {automation.steps.length === 0 && <span className="text-sm text-slate-400">No steps yet</span>}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Est. Time</h4>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {automation.steps.reduce((acc, s) => acc + (s.type === 'DELAY' ? (s.config.days * 24) + s.config.hours : 0), 0)} Hours
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
