import React from 'react';
import { AutomationAction } from '../../../../../types';
import { EmailStep } from './step-configs/EmailStep';
import { SmsStep } from './step-configs/SmsStep';
import { DelayStep } from './step-configs/DelayStep';
import { TagStep } from './step-configs/TagStep';
import { TaskStep } from './step-configs/TaskStep';
import { StatusStep } from './step-configs/StatusStep';

interface StepConfigProps {
    step: AutomationAction;
    triggerType: string;
    updateStep: (updates: Partial<AutomationAction>) => void;
}

export const StepConfig: React.FC<StepConfigProps> = ({ step, triggerType, updateStep }) => {

    const handleUpdateConfig = (newConfig: any) => {
        updateStep({ config: { ...step.config, ...newConfig } });
    };

    switch (step.type) {
        case 'SEND_EMAIL':
            return <EmailStep config={step.config} triggerType={triggerType} updateConfig={handleUpdateConfig} />;
        case 'SEND_SMS':
            return <SmsStep config={step.config} updateConfig={handleUpdateConfig} />;
        case 'DELAY':
            return <DelayStep config={step.config} updateConfig={handleUpdateConfig} />;
        case 'ADD_TAG':
        case 'REMOVE_TAG':
            return <TagStep config={step.config} updateConfig={handleUpdateConfig} />;
        case 'CREATE_TASK':
            return <TaskStep config={step.config} updateConfig={handleUpdateConfig} />;
        case 'UPDATE_JOB_STATUS':
            return <StatusStep config={step.config} updateConfig={handleUpdateConfig} />;
        default:
            return <div className="text-slate-500">No configuration needed for this step type.</div>;
    }
};
