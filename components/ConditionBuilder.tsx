import React from 'react';
import { ConditionGroup, AutomationCondition } from '../types';
import { RESOURCE_FIELDS } from '../utils/automationConstants';
import { Trash2, Plus, Layers } from 'lucide-react';

interface ConditionBuilderProps {
    group: ConditionGroup;
    onChange: (group: ConditionGroup) => void;
    onRemove?: () => void;
    depth?: number;
}

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ group, onChange, onRemove, depth = 0 }) => {

    const addCondition = () => {
        const newCondition: AutomationCondition = {
            id: `cond_${Date.now()}`,
            resource: 'client',
            field: '',
            operator: 'equals',
            value: ''
        };
        onChange({ ...group, conditions: [...group.conditions, newCondition] });
    };

    const addGroup = () => {
        const newGroup: ConditionGroup = {
            id: `group_${Date.now()}`,
            logic: 'AND',
            conditions: []
        };
        onChange({ ...group, conditions: [...group.conditions, newGroup] });
    };

    const updateCondition = (index: number, updates: Partial<AutomationCondition>) => {
        const newConditions = [...group.conditions];
        newConditions[index] = { ...newConditions[index] as AutomationCondition, ...updates };
        onChange({ ...group, conditions: newConditions });
    };

    const updateGroup = (index: number, updatedGroup: ConditionGroup) => {
        const newConditions = [...group.conditions];
        newConditions[index] = updatedGroup;
        onChange({ ...group, conditions: newConditions });
    };

    const removeItem = (index: number) => {
        const newConditions = [...group.conditions];
        newConditions.splice(index, 1);
        onChange({ ...group, conditions: newConditions });
    };

    return (
        <div className={`p-4 rounded-lg border ${depth === 0 ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 ml-6 mt-3'}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {depth > 0 && <span className="text-xs font-bold text-slate-400 uppercase">Logic:</span>}
                    <select
                        value={group.logic}
                        onChange={(e) => onChange({ ...group, logic: e.target.value as 'AND' | 'OR' })}
                        className="text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="AND">AND (All must match)</option>
                        <option value="OR">OR (Any can match)</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={addCondition} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Rule
                    </button>
                    <button onClick={addGroup} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Group
                    </button>
                    {onRemove && (
                        <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                            <Trash2 className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {group.conditions.map((item, index) => {
                    if ('logic' in item) {
                        // It's a group
                        return (
                            <ConditionBuilder
                                key={item.id}
                                group={item as ConditionGroup}
                                onChange={(updated) => updateGroup(index, updated)}
                                onRemove={() => removeItem(index)}
                                depth={depth + 1}
                            />
                        );
                    } else {
                        // It's a condition
                        const rule = item as AutomationCondition;
                        const resourceFields = RESOURCE_FIELDS[rule.resource as keyof typeof RESOURCE_FIELDS] || [];
                        const selectedField = resourceFields.find(f => f.value === rule.field);

                        return (
                            <div key={rule.id} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                                <select
                                    value={rule.resource}
                                    onChange={(e) => updateCondition(index, { resource: e.target.value as any, field: '', value: '' })}
                                    className="text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 w-24"
                                >
                                    <option value="client">Client</option>
                                    <option value="job">Job</option>
                                    <option value="quote">Quote</option>
                                    <option value="invoice">Invoice</option>
                                </select>

                                <select
                                    value={rule.field}
                                    onChange={(e) => updateCondition(index, { field: e.target.value, value: '' })}
                                    className="flex-1 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5"
                                >
                                    <option value="">Select Field...</option>
                                    {resourceFields.map(f => (
                                        <option key={f.value} value={f.value}>{f.label}</option>
                                    ))}
                                </select>

                                <select
                                    value={rule.operator}
                                    onChange={(e) => updateCondition(index, { operator: e.target.value as any })}
                                    className="text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 w-32"
                                >
                                    <option value="equals">Is Exactly</option>
                                    <option value="not_equals">Is Not</option>
                                    <option value="contains">Contains</option>
                                    <option value="gt">Greater Than</option>
                                    <option value="lt">Less Than</option>
                                    <option value="is_empty">Is Empty</option>
                                    <option value="is_not_empty">Has Any Value</option>
                                </select>

                                {selectedField?.type === 'select' ? (
                                    <select
                                        value={rule.value}
                                        onChange={(e) => updateCondition(index, { value: e.target.value })}
                                        className="flex-1 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5"
                                    >
                                        <option value="">Select Value...</option>
                                        {(selectedField as any).options?.map((opt: string) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={selectedField?.type === 'number' ? 'number' : 'text'}
                                        placeholder="Value"
                                        value={rule.value}
                                        onChange={(e) => updateCondition(index, { value: e.target.value })}
                                        className="flex-1 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5"
                                    />
                                )}

                                <button onClick={() => removeItem(index)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};
