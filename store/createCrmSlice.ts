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
  crmPermissions,
  crmSegments,
  crmComplianceLogs,
} from '../data/crmMockData';

export const createCrmSlice: StoreSlice<CrmSlice> = (set, get) => ({
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
  crmPermissions,
  crmSegments,
  complianceAuditLogs: crmComplianceLogs,
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
  updateCrmCase: (updatedCase) =>
    set((state) => ({
      crmCases: state.crmCases.map((entry) => entry.id === updatedCase.id ? updatedCase : entry)
    })),
  addComplianceAuditLog: (log) =>
    set((state) => ({
      complianceAuditLogs: [...state.complianceAuditLogs, log]
    })),
  canAccessCrmObject: (object, action) => {
    const role = get().currentUser?.role;
    if (!role) return false;
    const policy = get().crmPermissions.find((entry) => entry.role === role && entry.object === object);
    return policy ? policy.actions.includes(action) : false;
  },
});
