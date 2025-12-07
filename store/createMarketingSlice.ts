import { StoreSlice } from './types';
import { supabase } from '../supabaseClient';
import { EmailCampaign, MarketingAutomation, AudienceSegment, AutomationTriggerType, ConditionGroup, AutomationCondition } from '../types';

export const createMarketingSlice: StoreSlice<any> = (set, get) => ({
    marketingCampaigns: [],
    marketingAutomations: [],
    marketingAudiences: [],

    setMarketingAutomations: (value: any) => {
        // Zustand doesn't support React.Dispatch<SetStateAction>. 
        // We will implement a custom setter that mimics it if passed a function, or value.
        // Assuming value is always an array for simplicity in this port, or handling the function case checking.
        if (typeof value === 'function') {
            set((state) => ({ marketingAutomations: value(state.marketingAutomations) }));
        } else {
            set({ marketingAutomations: value });
        }
    },

    addCampaign: async (campaign: EmailCampaign) => {
        const { currentUser } = get();
        const payload = {
            company_id: currentUser.companyId,
            name: campaign.name,
            subject: campaign.subject,
            preview_text: campaign.previewText,
            from_name: campaign.fromName,
            content: campaign.content,
            template_id: campaign.templateId,
            audience_id: campaign.audienceId,
            audience_filter: campaign.audienceFilter,
            schedule_time: campaign.scheduleTime,
            status: campaign.status,
            settings: campaign.settings
        };
        const { data, error } = await supabase.from('email_campaigns').insert(payload).select().single();
        if (data) {
            set((state) => ({
                marketingCampaigns: [...state.marketingCampaigns, { ...campaign, id: data.id, createdAt: data.created_at }]
            }));

            if (campaign.status === 'SENDING') {
                const { error: sendError } = await supabase.functions.invoke('send-campaign', {
                    body: { campaignId: data.id }
                });
                if (sendError) console.error("Failed to trigger send-campaign:", sendError);
            }
        }
        return { error };
    },

    updateCampaign: async (campaign: EmailCampaign) => {
        const payload = {
            name: campaign.name,
            subject: campaign.subject,
            preview_text: campaign.previewText,
            from_name: campaign.fromName,
            content: campaign.content,
            template_id: campaign.templateId,
            audience_id: campaign.audienceId,
            audience_filter: campaign.audienceFilter,
            schedule_time: campaign.scheduleTime,
            status: campaign.status,
            settings: campaign.settings
        };
        const { error } = await supabase.from('email_campaigns').update(payload).eq('id', campaign.id);
        if (!error) {
            set((state) => ({
                marketingCampaigns: state.marketingCampaigns.map(c => c.id === campaign.id ? campaign : c)
            }));

            if (campaign.status === 'SENDING') {
                const { error: sendError } = await supabase.functions.invoke('send-campaign', {
                    body: { campaignId: campaign.id }
                });
                if (sendError) console.error("Failed to trigger send-campaign:", sendError);
            }
        }
        return { error };
    },

    deleteCampaign: async (id: string) => {
        const { error } = await supabase.from('email_campaigns').delete().eq('id', id);
        if (!error) {
            set((state) => ({ marketingCampaigns: state.marketingCampaigns.filter(c => c.id !== id) }));
        }
        return { error };
    },

    retryCampaign: async (campaignId: string) => {
        console.log(`Retrying campaign ${campaignId}...`);
        const { data, error: sendError } = await supabase.functions.invoke('send-campaign', {
            body: { campaignId }
        });

        if (sendError) {
            console.error("Failed to retry send-campaign (Transport):", sendError);
            alert(`Failed to retry sending: ${sendError.message}`);
        } else if (data && !data.success) {
            console.error("Failed to retry send-campaign (Logic):", data.error);
            alert(`Failed to retry sending: ${data.error}`);
        } else {
            console.log("Retry trigger sent successfully");
            alert("Retry trigger sent! Check the campaign status in a moment.");
        }
    },

    addAutomation: async (automation: Omit<MarketingAutomation, 'id' | 'createdAt' | 'stats'>) => {
        const payload = {
            company_id: automation.companyId,
            name: automation.name,
            description: automation.description,
            trigger_type: automation.triggerType,
            trigger_config: automation.triggerConfig,
            steps: automation.steps,
            is_active: automation.isActive
        };

        const { data, error } = await supabase
            .from('marketing_automations')
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('Error adding automation:', error);
            return { error };
        }

        if (data) {
            const newAutomation: MarketingAutomation = {
                id: data.id,
                companyId: data.company_id,
                name: data.name,
                description: data.description,
                triggerType: data.trigger_type,
                triggerConfig: data.trigger_config,
                steps: data.steps,
                isActive: data.is_active,
                stats: data.stats || { runs: 0, completed: 0 },
                createdAt: data.created_at
            };
            set((state) => ({ marketingAutomations: [...state.marketingAutomations, newAutomation] }));
            return { data: newAutomation };
        }
    },

    updateAutomation: async (automation: MarketingAutomation) => {
        const payload = {
            name: automation.name,
            description: automation.description,
            trigger_type: automation.triggerType,
            trigger_config: automation.triggerConfig,
            steps: automation.steps,
            is_active: automation.isActive
        };

        const { error } = await supabase
            .from('marketing_automations')
            .update(payload)
            .eq('id', automation.id);

        if (error) {
            console.error('Error updating automation:', error);
            return;
        }

        set((state) => ({
            marketingAutomations: state.marketingAutomations.map(a => a.id === automation.id ? automation : a)
        }));
    },

    deleteAutomation: async (id: string) => {
        const { error } = await supabase.from('marketing_automations').delete().eq('id', id);
        if (error) {
            console.error('Error deleting automation:', error);
            return { error };
        }
        set((state) => ({ marketingAutomations: state.marketingAutomations.filter(a => a.id !== id) }));
        return { error: null };
    },

    addAudienceSegment: async (segment: AudienceSegment) => {
        const { currentUser } = get();
        const payload = {
            company_id: currentUser.companyId,
            name: segment.name,
            type: segment.type,
            description: segment.description,
            filters: segment.filters,
            criteria: segment.criteria,
            estimated_count: segment.estimatedCount,
            last_calculated_at: new Date().toISOString()
        };
        const { data, error } = await supabase.from('audience_segments').insert(payload).select().single();
        if (data) {
            set((state) => ({
                marketingAudiences: [...state.marketingAudiences, {
                    id: data.id,
                    companyId: data.company_id,
                    name: data.name,
                    description: data.description,
                    filters: data.filters,
                    estimatedCount: data.estimated_count,
                    lastCalculatedAt: data.last_calculated_at,
                    createdAt: data.created_at
                }]
            }));
        }
        return { error };
    },

    deleteAudienceSegment: async (id: string) => {
        const { error } = await supabase.from('audience_segments').delete().eq('id', id);
        if (!error) {
            set((state) => ({ marketingAudiences: state.marketingAudiences.filter(s => s.id !== id) }));
        }
        return { error };
    },

    triggerAutomation: async (triggerType: AutomationTriggerType, entityId: string, context: any = {}) => {
        console.log(`[Trigger] Checking triggers for ${triggerType} (Entity: ${entityId})`);
        const { marketingAutomations, currentUser } = get();

        const automations = marketingAutomations.filter(a => a.triggerType === triggerType && a.isActive);
        console.log(`[Trigger] Found ${automations.length} active automations`);

        for (const automation of automations) {
            if (automation.triggerConfig?.conditions) {
                const rulesPassed = evaluateConditionGroup(automation.triggerConfig.conditions, context);
                if (!rulesPassed) {
                    console.log(`[Trigger] Rules failed for automation: ${automation.name}`);
                    continue;
                }
            }

            console.log(`[Trigger] Starting automation: ${automation.name} (${automation.id})`);

            const { data: run, error } = await supabase.from('automation_runs').insert({
                company_id: currentUser.companyId,
                automation_id: automation.id,
                entity_id: entityId,
                status: 'RUNNING',
                current_step_index: 0,
                logs: [{ step: 'INIT', status: 'STARTED', timestamp: new Date().toISOString() }]
            }).select().single();

            if (run) {
                set((state) => ({
                    marketingAutomations: state.marketingAutomations.map(a =>
                        a.id === automation.id
                            ? { ...a, stats: { ...a.stats, runs: (a.stats?.runs || 0) + 1 } }
                            : a
                    )
                }));

                supabase.functions.invoke('process-automation', {
                    body: { runId: run.id }
                }).then(({ error }) => {
                    if (error) console.error(`Failed to start automation ${automation.name}:`, error);
                });
            }
        }
    }
});

// Helper for condition evaluation
const evaluateConditionGroup = (group: ConditionGroup, context: any): boolean => {
    if (!group.conditions || group.conditions.length === 0) return true;

    const results = group.conditions.map(condition => {
        if ('logic' in condition) {
            return evaluateConditionGroup(condition as ConditionGroup, context);
        } else {
            const rule = condition as AutomationCondition;
            const data = context[rule.resource];
            if (!data) return false;

            const actualValue = data[rule.field];
            const targetValue = rule.value;

            switch (rule.operator) {
                case 'equals': return actualValue == targetValue;
                case 'not_equals': return actualValue != targetValue;
                case 'contains': return String(actualValue).includes(String(targetValue));
                case 'not_contains': return !String(actualValue).includes(String(targetValue));
                case 'gt': return Number(actualValue) > Number(targetValue);
                case 'lt': return Number(actualValue) < Number(targetValue);
                case 'gte': return Number(actualValue) >= Number(targetValue);
                case 'lte': return Number(actualValue) <= Number(targetValue);
                case 'is_empty': return !actualValue || actualValue === '';
                case 'is_not_empty': return !!actualValue && actualValue !== '';
                case 'is_true': return actualValue === true;
                case 'is_false': return actualValue === false;
                case 'starts_with': return String(actualValue).startsWith(String(targetValue));
                case 'ends_with': return String(actualValue).endsWith(String(targetValue));
                default: return false;
            }
        }
    });

    if (group.logic === 'AND') {
        return results.every(r => r === true);
    } else {
        return results.some(r => r === true);
    }
};
