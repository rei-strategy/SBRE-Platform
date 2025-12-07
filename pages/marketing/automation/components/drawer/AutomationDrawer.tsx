import React from 'react';
import { MarketingAutomation, AutomationAction } from '../../../../../types';
import { Drawer } from '../../../../../components/Drawer';
import { TriggerConfig } from './TriggerConfig';
import { StepConfig } from './StepConfig';
import { StepSelector } from './StepSelector';
import { ActionType } from '../../../../../types';

interface AutomationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    automation: MarketingAutomation;
    setAutomation: (automation: MarketingAutomation) => void;
    editingStepIndex: number | null;
    updateStep: (index: number, updates: Partial<AutomationAction>) => void;
    onAddStep: (type: ActionType) => void;
}

export const AutomationDrawer: React.FC<AutomationDrawerProps> = ({
    isOpen,
    onClose,
    title,
    automation,
    setAutomation,
    editingStepIndex,
    updateStep,
    onAddStep
}) => {

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            {editingStepIndex === null ? (
                <TriggerConfig automation={automation} setAutomation={setAutomation} />
            ) : editingStepIndex === -1 ? (
                <StepSelector onSelect={onAddStep} />
            ) : automation.steps[editingStepIndex] ? (
                <StepConfig
                    step={automation.steps[editingStepIndex]}
                    triggerType={automation.triggerType}
                    updateStep={(updates) => updateStep(editingStepIndex, updates)}
                />
            ) : null}
        </Drawer>
    );
};
