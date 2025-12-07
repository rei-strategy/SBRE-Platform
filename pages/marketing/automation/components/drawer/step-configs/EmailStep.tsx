import React, { useState } from 'react';
import { Zap, Clock } from 'lucide-react';
import { supabase } from '../../../../../../supabaseClient';
import { LiveEmailPreview } from '../../preview/LiveEmailPreview';

interface EmailStepProps {
    config: any;
    triggerType: string;
    updateConfig: (updates: any) => void;
}

export const EmailStep: React.FC<EmailStepProps> = ({ config, triggerType, updateConfig }) => {
    const [generatingEmail, setGeneratingEmail] = useState(false);
    const [showAiOptions, setShowAiOptions] = useState(false);
    const [emailTone, setEmailTone] = useState('Professional');

    const generateEmailContent = async (currentSubject: string, currentContent: string) => {
        setGeneratingEmail(true);
        try {
            // Infer topic from trigger and existing content
            let topic = triggerType.replace(/_/g, ' ').toLowerCase();
            if (currentSubject) topic += ` - ${currentSubject}`;

            const { data, error } = await supabase.functions.invoke('generate-email-content', {
                body: {
                    tone: emailTone,
                    topic: topic,
                    context: `Automation Trigger: ${triggerType}. Existing content: ${currentContent}`
                }
            });

            if (error) throw error;

            updateConfig({
                subject: data.subject,
                content: data.content
            });
            setShowAiOptions(false);
        } catch (error) {
            console.error('Error generating email:', error);
            alert('Failed to generate email content. Please try again.');
        } finally {
            setGeneratingEmail(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">To</label>
                <select
                    value={config.to || 'client'}
                    onChange={(e) => updateConfig({ to: e.target.value })}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                    <option value="technician">Assigned Technician</option>
                    <option value="property_contact">Property Contact</option>
                    <option value="custom">Custom Email Address</option>
                </select>
            </div>
            {config.to === 'custom' && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Custom Email</label>
                    <input
                        type="email"
                        value={config.customEmail || ''}
                        onChange={(e) => updateConfig({ customEmail: e.target.value })}
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 p-3 text-sm"
                        placeholder="recipient@example.com"
                    />
                </div>
            )}

            {/* AI Generator Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowAiOptions(!showAiOptions)}
                    className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                    <Zap className="w-3 h-3" />
                    {showAiOptions ? 'Hide AI Options' : 'Generate with AI'}
                </button>
            </div>

            {/* AI Options Panel */}
            {showAiOptions && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800 space-y-3 animate-in slide-in-from-top-2">
                    <div>
                        <label className="block text-xs font-medium text-indigo-900 dark:text-indigo-300 mb-1">Tone</label>
                        <select
                            value={emailTone}
                            onChange={(e) => setEmailTone(e.target.value)}
                            className="w-full text-sm rounded-md border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="Professional">Professional</option>
                            <option value="Friendly">Friendly</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Gratitude">Gratitude</option>
                            <option value="Persuasive">Persuasive</option>
                        </select>
                    </div>
                    <button
                        onClick={() => generateEmailContent(config.subject, config.content)}
                        disabled={generatingEmail}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {generatingEmail ? (
                            <>
                                <Clock className="w-4 h-4 animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4" /> Generate Content
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Variable Insertion Helper */}
            <div className="relative">
                <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                    {[
                        { label: 'Client Name', value: '{{client.first_name}}' },
                        { label: 'Tech Name', value: '{{technician.name}}' },
                        { label: 'Job Date', value: '{{job.date}}' },
                        { label: 'Service', value: '{{job.service_name}}' },
                        { label: 'Quote Link', value: '{{quote.link}}' },
                        { label: 'Invoice Link', value: '{{invoice.link}}' },
                        { label: 'Company', value: '{{company.name}}' }
                    ].map(v => (
                        <button
                            key={v.value}
                            onClick={() => {
                                // Logic to insert at cursor would require refs to inputs, simplifying for now to append
                                // or we can just let users copy paste if complex.
                                // Re-implementing the focus logic might be tricky without access to the inputs directly.
                                // For now, let's append to the mostly likely active field or just append to content as fallback
                                const newContent = (config.content || '') + v.value;
                                updateConfig({ content: newContent });
                            }}
                            className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium whitespace-nowrap hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                            + {v.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input
                    name="subject"
                    type="text"
                    value={config.subject || ''}
                    onChange={(e) => updateConfig({ subject: e.target.value })}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Email Subject"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
                <textarea
                    name="content"
                    value={config.content || ''}
                    onChange={(e) => updateConfig({ content: e.target.value })}
                    rows={6}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                    placeholder="Email body content..."
                />
            </div>

            <LiveEmailPreview
                toType={config.to}
                customEmail={config.customEmail}
                subject={config.subject || ''}
                content={config.content || ''}
            />
        </div>
    );
};
