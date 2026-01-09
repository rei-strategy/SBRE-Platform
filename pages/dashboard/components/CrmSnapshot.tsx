import React, { useContext, useMemo } from 'react';
import { Briefcase, Building2, ClipboardCheck, HardHat, MapPin, MessageSquareWarning, Users, Workflow } from 'lucide-react';
import { StoreContext } from '../../../store';
import { CrmJobStatus } from '../../../types';

const statusOrder: CrmJobStatus[] = ['PLANNED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export const CrmSnapshot: React.FC = () => {
  const store = useContext(StoreContext);

    const stats = useMemo(() => {
      if (!store) return null;

      const pipelineConfig = store.crmPipelineConfigs[0] || null;
      const vendorCount = store.crmAccounts.filter((a) => a.type === 'VENDOR').length;
    const customerCount = store.crmAccounts.filter((a) => a.type === 'CUSTOMER').length;
    const openJobs = store.crmJobs.filter((j) => j.status !== 'COMPLETED' && j.status !== 'CANCELLED').length;
    const openTasks = store.crmTasks.filter((t) => t.status !== 'DONE').length;
    const openCases = store.crmCases.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
    const jobMix = statusOrder.map((status) => ({
      status,
      count: store.crmJobs.filter((j) => j.status === status).length,
    })).filter((entry) => entry.count > 0);

    return {
      pipelineConfig,
      vendorCount,
      customerCount,
      contactCount: store.crmContacts.length,
      locationCount: store.crmLocations.length,
      assetCount: store.crmAssets.length,
      openJobs,
      openTasks,
      openCases,
      jobMix,
    };
  }, [store]);

  if (!store || !stats) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-5">
      <div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">CRM Snapshot</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Real estate account coverage, active properties, and service workload.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">
            <Building2 className="w-4 h-4 text-blue-500" /> Customers
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.customerCount}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">
            <HardHat className="w-4 h-4 text-amber-500" /> Vendors
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.vendorCount}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">
            <Users className="w-4 h-4 text-emerald-500" /> Contacts
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.contactCount}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">
            <MapPin className="w-4 h-4 text-violet-500" /> Properties
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.locationCount}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">
            <Briefcase className="w-4 h-4 text-rose-500" /> Assets
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.assetCount}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">
            <ClipboardCheck className="w-4 h-4 text-sky-500" /> Open Jobs
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.openJobs}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">
            <ClipboardCheck className="w-4 h-4 text-blue-500" /> Open Tasks
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.openTasks}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase">
            <MessageSquareWarning className="w-4 h-4 text-orange-500" /> Open Cases
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.openCases}</div>
        </div>
      </div>

      {stats.jobMix.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">
            Job Mix
          </p>
          <div className="space-y-2">
            {stats.jobMix.map((entry) => (
              <div key={entry.status} className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>{entry.status.replace('_', ' ')}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{entry.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.pipelineConfig && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Real Estate Pipeline
            </p>
            <Workflow className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-2">
            {stats.pipelineConfig.stages.map((stage) => (
              <div key={stage.id} className="flex items-start justify-between text-sm text-slate-600 dark:text-slate-300">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{stage.name}</div>
                  {stage.automationTriggers && stage.automationTriggers.length > 0 && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Automations: {stage.automationTriggers.map((t) => t.action.replace(/_/g, ' ').toLowerCase()).join(', ')}
                    </div>
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  SLA {stage.slaHours ?? '—'}h
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
