import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { MarketingAutomation, AutomationAction, ActionType } from '../types';
import { AutomationHeader } from './marketing/automation/components/AutomationHeader';
import { AutomationCanvas } from './marketing/automation/components/AutomationCanvas';
import { AutomationSummary } from './marketing/automation/components/AutomationSummary';
import { AutomationDrawer } from './marketing/automation/components/drawer/AutomationDrawer';

export const MarketingAutomationBuilder: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { marketingAutomations, addAutomation, updateAutomation } = useAppStore();

    const [automation, setAutomation] = useState<MarketingAutomation | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null); // null = editing trigger
    const [drawerTitle, setDrawerTitle] = useState('');

    useEffect(() => {
        if (id === 'new') {
            const newAutomation: MarketingAutomation = {
                id: '',
                companyId: '',
                name: 'New Automation',
                triggerType: 'NEW_CLIENT',
                triggerConfig: { conditions: { id: 'root', logic: 'AND', conditions: [] } },
                steps: [],
                isActive: false,
                stats: { runs: 0, completed: 0 },
                createdAt: new Date().toISOString()
            };
            setAutomation(newAutomation);
            setLoading(false);
        } else {
            const found = marketingAutomations.find(a => a.id === id);
            if (found) {
                const loadedAutomation = { ...found };
                if (!loadedAutomation.triggerConfig?.conditions) {
                    loadedAutomation.triggerConfig = { ...loadedAutomation.triggerConfig, conditions: { id: 'root', logic: 'AND', conditions: [] } };
                }
                setAutomation(loadedAutomation);
            }
            setLoading(false);
        }
    }, [id, marketingAutomations]);

    const handleSave = async () => {
        if (!automation) return;
        setSaving(true);
        try {
            if (id === 'new') {
                await addAutomation(automation);
                navigate('/marketing/automations');
            } else {
                await updateAutomation(automation);
            }
        } catch (error) {
            console.error('Error saving automation:', error);
        } finally {
            setSaving(false);
        }
    };

    const openStepDrawer = (index: number) => {
        setEditingStepIndex(index);
        setDrawerTitle(automation?.steps[index].type.replace(/_/g, ' ') || 'Edit Step');
        setIsDrawerOpen(true);
    };

    const openTriggerDrawer = () => {
        setEditingStepIndex(null);
        setDrawerTitle('Edit Trigger');
        setIsDrawerOpen(true);
    };

    const openAddStepDrawer = () => {
        setEditingStepIndex(-1); // Use -1 to indicate adding a new step
        setDrawerTitle('Add New Step');
        setIsDrawerOpen(true);
        // Note: Logic for actually adding a step is usually different UI wise in complex builders
        // Here, we just want to create a step, then edit it?
        // The original code had logic for `addStep` but it was called differently.
        // WAIT - The original code:
        /*
           const addStep = (type: ActionType) => { ... }
           // The UI used a PLUS button that opened a menu (not shown in my view_file??)
           // Ah, looking at `canvas`, there is an "Add Step" button that opens drawer?
           // "Add Step" button in `AutomationCanvas.tsx` calls `openAddStepDrawer`.
        */
        // But `Drawer` contents for "Add New Step" (index -1) was missing in the extracted components?
        // Let's check `AutomationDrawer.tsx`. It handles index -1?
        // `AutomationDrawer` renders `StepConfig` if index != -1. If index === null, TriggerConfig.
        // We need to handle index -1 (Step Selector).
    };

    // We missed "Add New Step" Selector in AutomationDrawer!
    // I need to add that logic back.
    // Let's create `StepSelector.tsx` or handle it in Drawer.

    const addStep = (type: ActionType) => {
        if (!automation) return;
        const newStep: AutomationAction = {
            id: `step_${Date.now()}`,
            type,
            config: getDefaultConfig(type)
        };
        const newSteps = [...automation.steps, newStep];
        setAutomation({ ...automation, steps: newSteps });

        // Open drawer for the new step immediately
        // We use setTimeout to ensure state update propagates (not ideal but consistent with prev code)
        setTimeout(() => {
            setEditingStepIndex(newSteps.length - 1);
            setDrawerTitle(type.replace(/_/g, ' '));
        }, 50);
    };

    const updateStep = (index: number, updates: Partial<AutomationAction>) => {
        if (!automation) return;
        const newSteps = [...automation.steps];
        newSteps[index] = { ...newSteps[index], ...updates };
        setAutomation({ ...automation, steps: newSteps });
    };

    const getDefaultConfig = (type: ActionType) => {
        switch (type) {
            case 'SEND_EMAIL': return { subject: '', content: '', to: 'client' };
            case 'SEND_SMS': return { message: '' };
            case 'DELAY': return { days: 0, hours: 0, minutes: 0, instant: false };
            case 'ADD_TAG': return { tag: '' };
            case 'REMOVE_TAG': return { tag: '' };
            case 'CREATE_TASK': return { title: '', description: '' };
            case 'UPDATE_JOB_STATUS': return { status: 'SCHEDULED' };
            default: return {};
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!automation) return <div className="p-8 text-center">Automation not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
            <AutomationHeader
                automation={automation}
                setAutomation={setAutomation}
                onSave={handleSave}
                saving={saving}
            />

            <div className="flex-1 overflow-y-auto py-8 px-4">
                <AutomationCanvas
                    automation={automation}
                    openTriggerDrawer={openTriggerDrawer}
                    openStepDrawer={openStepDrawer}
                    openAddStepDrawer={openAddStepDrawer}
                />
                <AutomationSummary automation={automation} />
            </div>

            <AutomationDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={drawerTitle}
                automation={automation}
                setAutomation={setAutomation}
                editingStepIndex={editingStepIndex}
                updateStep={updateStep}
                onAddStep={addStep}
            />
        </div>
    );
};