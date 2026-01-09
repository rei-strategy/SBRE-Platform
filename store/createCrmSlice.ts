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
} from '../data/crmMockData';

export const createCrmSlice: StoreSlice<CrmSlice> = () => ({
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
});
