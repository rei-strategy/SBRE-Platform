import React from 'react';
import { Zap, Plus, ChevronRight, Mail, MessageSquare, Clock, Tag, CheckSquare, Briefcase, Play } from 'lucide-react';
import { MarketingAutomation, AutomationAction, ActionType } from '../../../../types';

interface AutomationCanvasProps {
    automation: MarketingAutomation;
    openTriggerDrawer: () => void;
    openStepDrawer: (index: number) => void;
    openAddStepDrawer: () => void;
}

export const AutomationCanvas: React.FC<AutomationCanvasProps> = ({
    automation,
    openTriggerDrawer,
    openStepDrawer,
    openAddStepDrawer
}) => {
    const getIconForType = (type: ActionType) => {
        switch (type) {
            case 'SEND_EMAIL': return <Mail className="w-5 h-5 text-blue-500" />;
            case 'SEND_SMS': return <MessageSquare className="w-5 h-5 text-green-500" />;
            case 'DELAY': return <Clock className="w-5 h-5 text-orange-500" />;
            case 'ADD_TAG':
            case 'REMOVE_TAG': return <Tag className="w-5 h-5 text-purple-500" />;
            case 'CREATE_TASK': return <CheckSquare className="w-5 h-5 text-indigo-500" />;
            case 'UPDATE_JOB_STATUS': return <Briefcase className="w-5 h-5 text-slate-500" />;
            default: return <Play className="w-5 h-5 text-slate-500" />;
        }
    };

    return (
        <div className="max-w-xl mx-auto relative pb-32">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 -translate-x-1/2 -z-10" />

            {/* Trigger Node */}
            <div className="flex justify-center mb-8">
                <div
                    onClick={openTriggerDrawer}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-slate-700 p-4 w-64 text-center cursor-pointer hover:border-emerald-500 transition-colors relative group"
                >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">When {automation.triggerType.replace(/_/g, ' ').toLowerCase()}</h3>
                    <p className="text-xs text-slate-500 mt-1">Click to configure trigger</p>

                    {/* Add Button Below Trigger */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <Plus className="w-3 h-3 text-slate-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Steps */}
            {automation.steps?.map((step, index) => (
                <div key={step.id} className="flex justify-center mb-8 relative group">
                    <div
                        onClick={() => openStepDrawer(index)}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 w-64 cursor-pointer hover:shadow-md transition-all flex items-center gap-4"
                    >
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg shrink-0">
                            {getIconForType(step.type)}
                        </div>
                        <div className="text-left overflow-hidden">
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{step.type.replace(/_/g, ' ')}</h4>
                            <p className="text-xs text-slate-500 truncate">
                                {step.type === 'SEND_EMAIL' ? step.config?.subject || 'No subject' :
                                    step.type === 'DELAY' ? `${step.config?.days || 0}d ${step.config?.hours || 0}h` :
                                        'Click to configure'}
                            </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                    </div>

                    {/* Add Button Below Step */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <Plus className="w-3 h-3 text-slate-500" />
                        </div>
                    </div>
                </div>
            ))}

            {/* Add Step Button (Bottom) */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={openAddStepDrawer}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-full text-slate-500 hover:text-emerald-600 hover:border-emerald-500 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" /> Add Step
                </button>
            </div>
        </div>
    );
};
