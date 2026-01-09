import React, { useContext, useMemo, useState } from 'react';
import { StoreContext } from '../../../store';
import { Button } from '../../../components/Button';
import { CrmPipelineConfig, CrmPipelineStage, CrmPipelineTriggerAction } from '../../../types';
import { ChevronDown, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const triggerOptions: { id: CrmPipelineTriggerAction; label: string }[] = [
  { id: 'CREATE_QUOTE', label: 'Auto-create quote' },
  { id: 'CREATE_WORK_ORDER', label: 'Auto-create work order' },
  { id: 'SEND_REVIEW_REQUEST', label: 'Send review request' },
  { id: 'ASSIGN_OWNER', label: 'Auto-assign owner' },
  { id: 'SET_SLA_TIMER', label: 'Start SLA timer' },
];

const createDefaultPipeline = (industryId: string): CrmPipelineConfig => ({
  id: `pipeline-${crypto.randomUUID()}`,
  industryId,
  name: `${industryId} pipeline`,
  stages: [
    { id: 'inquiry', name: 'Inquiry', order: 1, slaHours: 2 },
    { id: 'qualified', name: 'Qualified', order: 2, slaHours: 24 },
    { id: 'quote', name: 'Quote Sent', order: 3, slaHours: 48 },
    { id: 'work-order', name: 'Work Order', order: 4, slaHours: 72 },
    { id: 'completion', name: 'Completion', order: 5, slaHours: 72 },
    { id: 'review', name: 'Review', order: 6, slaHours: 168 },
  ],
});

export const CrmPipelineView: React.FC = () => {
  const store = useContext(StoreContext);
  const [activeConfigId, setActiveConfigId] = useState<string>(() => store?.crmPipelineConfigs[0]?.id || '');

  const activeConfig = useMemo(() => {
    if (!store) return null;
    return store.crmPipelineConfigs.find((config) => config.id === activeConfigId) || store.crmPipelineConfigs[0] || null;
  }, [store, activeConfigId]);

  if (!store || !activeConfig) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        No CRM pipeline configured yet.
      </div>
    );
  }

  const updateConfig = (nextConfig: CrmPipelineConfig) => {
    store.updateCrmPipelineConfig(nextConfig);
    setActiveConfigId(nextConfig.id);
  };

  const updateStage = (stageId: string, updates: Partial<CrmPipelineStage>) => {
    const stages = activeConfig.stages.map((stage) =>
      stage.id === stageId ? { ...stage, ...updates } : stage
    );
    updateConfig({ ...activeConfig, stages });
  };

  const reorderStage = (stageId: string, direction: 'up' | 'down') => {
    const stages = [...activeConfig.stages].sort((a, b) => a.order - b.order);
    const index = stages.findIndex((stage) => stage.id === stageId);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= stages.length) return;
    const swapped = stages[targetIndex];
    stages[targetIndex] = { ...stages[index], order: swapped.order };
    stages[index] = { ...swapped, order: stages[index].order };
    updateConfig({ ...activeConfig, stages });
  };

  const toggleTrigger = (stageId: string, action: CrmPipelineTriggerAction) => {
    const stages = activeConfig.stages.map((stage) => {
      if (stage.id !== stageId) return stage;
      const existing = stage.automationTriggers || [];
      const hasTrigger = existing.some((t) => t.action === action);
      if (hasTrigger) {
        return {
          ...stage,
          automationTriggers: existing.filter((t) => t.action !== action),
        };
      }
      return {
        ...stage,
        automationTriggers: [
          ...existing,
          { id: `trigger-${stageId}-${action.toLowerCase()}`, stageId, action },
        ],
      };
    });
    updateConfig({ ...activeConfig, stages });
  };

  const addStage = () => {
    const order = activeConfig.stages.length + 1;
    const newStage: CrmPipelineStage = {
      id: `stage-${crypto.randomUUID().slice(0, 8)}`,
      name: 'New Stage',
      order,
      slaHours: 24,
    };
    updateConfig({ ...activeConfig, stages: [...activeConfig.stages, newStage] });
  };

  const removeStage = (stageId: string) => {
    const stages = activeConfig.stages.filter((stage) => stage.id !== stageId);
    const reordered = stages.map((stage, index) => ({ ...stage, order: index + 1 }));
    updateConfig({ ...activeConfig, stages: reordered });
  };

  const addPipeline = () => {
    const newConfig = createDefaultPipeline('new-industry');
    store.addCrmPipelineConfig(newConfig);
    setActiveConfigId(newConfig.id);
  };

  const removePipeline = () => {
    if (store.crmPipelineConfigs.length <= 1) return;
    store.removeCrmPipelineConfig(activeConfig.id);
    setActiveConfigId(store.crmPipelineConfigs[0]?.id || '');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-sm font-semibold text-slate-700"
              value={activeConfig.id}
              onChange={(e) => setActiveConfigId(e.target.value)}
            >
              {store.crmPipelineConfigs.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          <Button variant="outline" onClick={addPipeline}>
            <Plus className="w-4 h-4 mr-2" /> Add Industry Pipeline
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={removePipeline} disabled={store.crmPipelineConfigs.length <= 1}>
            <Trash2 className="w-4 h-4 mr-2" /> Remove Pipeline
          </Button>
          <Button onClick={addStage}>
            <Plus className="w-4 h-4 mr-2" /> Add Stage
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Pipeline Name</label>
            <input
              value={activeConfig.name}
              onChange={(e) => updateConfig({ ...activeConfig, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Industry ID</label>
            <input
              value={activeConfig.industryId}
              onChange={(e) => updateConfig({ ...activeConfig, industryId: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          {activeConfig.stages
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((stage) => (
              <div key={stage.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={stage.name}
                      onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                    />
                    <span className="text-xs text-slate-500">Order {stage.order}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-md border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-700"
                      onClick={() => reorderStage(stage.id, 'up')}
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      className="rounded-md border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-700"
                      onClick={() => reorderStage(stage.id, 'down')}
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      className="rounded-md border border-slate-200 bg-white p-2 text-slate-500 hover:text-red-600"
                      onClick={() => removeStage(stage.id)}
                      title="Remove stage"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">SLA (hours)</label>
                    <input
                      type="number"
                      min={0}
                      value={stage.slaHours ?? ''}
                      onChange={(e) => updateStage(stage.id, { slaHours: e.target.value === '' ? undefined : Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Automation Triggers</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {triggerOptions.map((option) => {
                        const hasTrigger = stage.automationTriggers?.some((t) => t.action === option.id);
                        return (
                          <label
                            key={option.id}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${
                              hasTrigger
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-slate-200 bg-white text-slate-500'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={!!hasTrigger}
                              onChange={() => toggleTrigger(stage.id, option.id)}
                            />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
