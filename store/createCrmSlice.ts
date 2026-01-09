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
});
