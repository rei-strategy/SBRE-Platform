import React from 'react';
import { Zap } from 'lucide-react';
import { MarketingAutomation } from '../../../../../types';
import { ConditionBuilder } from '../../../../../components/ConditionBuilder';

interface TriggerConfigProps {
    automation: MarketingAutomation;
    setAutomation: (automation: MarketingAutomation) => void;
}

export const TriggerConfig: React.FC<TriggerConfigProps> = ({ automation, setAutomation }) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Trigger Event</label>
                <select
                    value={automation.triggerType}
                    onChange={(e) => setAutomation({ ...automation, triggerType: e.target.value as any })}
                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3"
                >
                    <option value="NEW_CLIENT">New Client Created</option>
                    <option value="NEW_JOB">Job Scheduled</option>
                    <option value="JOB_COMPLETED">Job Completed</option>
                    <option value="TECH_ON_MY_WAY">Technician On The Way</option>
                    <option value="NEW_QUOTE">Quote Sent</option>
                    <option value="QUOTE_NOT_APPROVED">Quote Not Approved (Follow-up)</option>
                    <option value="NEW_INVOICE">Invoice Sent</option>
                    <option value="INVOICE_PAID">Payment Collected</option>
                    <option value="CLIENT_BIRTHDAY">Client Birthday</option>
                    <option value="DORMANT_CLIENT">Dormant Client (Re-engagement)</option>
                </select>
            </div>

            {/* Trigger Preview Panel */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Trigger Preview
                </h4>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <p><span className="font-semibold">Recipient:</span> {
                        ['NEW_CLIENT', 'CLIENT_BIRTHDAY', 'DORMANT_CLIENT'].includes(automation.triggerType) ? 'Client' :
                            ['NEW_JOB', 'JOB_COMPLETED', 'TECH_ON_MY_WAY'].includes(automation.triggerType) ? 'Client (associated with Job)' :
                                'Client (associated with Document)'
                    }</p>
                    <p><span className="font-semibold">Example:</span> {
                        automation.triggerType === 'NEW_CLIENT' ? 'Runs when a new client is added to the system.' :
                            automation.triggerType === 'NEW_JOB' ? 'Runs when a job is scheduled on the calendar.' :
                                automation.triggerType === 'JOB_COMPLETED' ? 'Runs when a job status changes to "Completed".' :
                                    automation.triggerType === 'TECH_ON_MY_WAY' ? 'Runs when a technician taps "On My Way" in the app.' :
                                        automation.triggerType === 'NEW_QUOTE' ? 'Runs immediately after a quote is sent to a client.' :
                                            automation.triggerType === 'QUOTE_NOT_APPROVED' ? 'Runs if a quote remains pending for X days.' :
                                                automation.triggerType === 'NEW_INVOICE' ? 'Runs when an invoice is emailed to a client.' :
                                                    automation.triggerType === 'INVOICE_PAID' ? 'Runs when a payment is recorded.' :
                                                        automation.triggerType === 'CLIENT_BIRTHDAY' ? 'Runs on the client\'s birthday at 9:00 AM.' :
                                                            'Runs if a client hasn\'t booked a job in X months.'
                    }</p>
                    <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                        <p className="text-xs font-semibold mb-1">Available Variables:</p>
                        <div className="flex flex-wrap gap-1">
                            {['client.first_name', 'client.last_name', 'company.name'].map(v => (
                                <span key={v} className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs font-mono">{`{{${v}}}`}</span>
                            ))}
                            {['NEW_JOB', 'JOB_COMPLETED', 'TECH_ON_MY_WAY'].includes(automation.triggerType) && (
                                <>
                                    <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs font-mono">{`{{job.date}}`}</span>
                                    <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs font-mono">{`{{job.type}}`}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Filter Conditions (Optional)</h3>
                <p className="text-xs text-slate-500 mb-4">Only run this automation if these specific conditions are met.</p>
                <ConditionBuilder
                    group={automation.triggerConfig?.conditions || { id: 'root', logic: 'AND', conditions: [] }}
                    onChange={(newGroup) => setAutomation({ ...automation, triggerConfig: { ...automation.triggerConfig, conditions: newGroup } })}
                />
            </div>
        </div>
    );
};
