import { CrmSlice, StoreSlice } from './types';
import {
  crmAccounts,
  crmAssets,
  crmCases,
  crmContacts,
  crmInvoices,
  crmJobs,
  crmQuotes,
  crmServiceCategories,
  crmTasks,
  crmTerritories,
  crmLocations,
  crmPipelineConfigs,
  crmActivities,
} from '../data/crmMockData';

export const createCrmSlice: StoreSlice<CrmSlice> = (set) => ({
  crmServiceCategories,
  crmTerritories,
  crmAccounts,
  crmContacts,
  crmLocations,
  crmAssets,
  crmJobs,
  crmQuotes,
  crmInvoices,
  crmTasks,
  crmCases,
  crmPipelineConfigs,
  crmActivities,
  addCrmPipelineConfig: (config) =>
    set((state) => ({
      crmPipelineConfigs: [...state.crmPipelineConfigs, config],
    })),
  updateCrmPipelineConfig: (config) =>
    set((state) => ({
      crmPipelineConfigs: state.crmPipelineConfigs.map((existing) =>
        existing.id === config.id ? config : existing
      ),
    })),
  removeCrmPipelineConfig: (configId) =>
    set((state) => ({
      crmPipelineConfigs: state.crmPipelineConfigs.filter((config) => config.id !== configId),
    })),
  updateCrmActivity: (activityId, updates) =>
    set((state) => ({
      crmActivities: state.crmActivities.map((activity) =>
        activity.id === activityId ? { ...activity, ...updates } : activity
      ),
    })),
});
