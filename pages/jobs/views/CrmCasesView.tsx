import React, { useContext, useMemo, useState } from 'react';
import { StoreContext } from '../../../store';
import { CrmCase, CrmCaseStatus, CrmCaseSeverity } from '../../../types';
import { ShieldAlert, FileDown } from 'lucide-react';
import { Button } from '../../../components/Button';

const statusOptions: CrmCaseStatus[] = ['OPEN', 'PENDING', 'ESCALATED', 'RESOLVED', 'CLOSED'];
const severityOptions: CrmCaseSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const CrmCasesView: React.FC = () => {
  const store = useContext(StoreContext);
  const [segmentId, setSegmentId] = useState<string>('ALL');

  if (!store) return null;

  const canView = store.canAccessCrmObject('CASE', 'VIEW');
  const canEdit = store.canAccessCrmObject('CASE', 'EDIT');
  const canExport = store.canAccessCrmObject('CASE', 'EXPORT');

  const filteredCases = useMemo(() => {
    if (!canView) return [];
    const segment = store.crmSegments.find((seg) => seg.id === segmentId);
    const allowedTerritories = store.settings?.regionalAccess;

    return store.crmCases.filter((entry) => {
      const account = store.crmAccounts.find((acc) => acc.id === entry.accountId);
      const territories = account?.territoryIds || [];

      if (allowedTerritories && allowedTerritories.length > 0) {
        const hasRegion = territories.some((id) => allowedTerritories.includes(id));
        if (!hasRegion) return false;
      }

      if (segment && segmentId !== 'ALL') {
        return territories.some((id) => segment.territoryIds.includes(id));
      }

      return true;
    });
  }, [store, segmentId, canView]);

  const handleUpdateCase = (entry: CrmCase, updates: Partial<CrmCase>, action: string) => {
    const updated = { ...entry, ...updates };
    store.updateCrmCase(updated);
    store.addComplianceAuditLog({
      id: crypto.randomUUID(),
      actorId: store.currentUser.id,
      action,
      entityType: 'CASE',
      entityId: entry.id,
      timestamp: new Date().toISOString(),
      detail: updates.status ? `Status -> ${updates.status}` : undefined,
      metadata: { severity: updates.severity || entry.severity }
    });
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(filteredCases, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crm-cases-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!canView) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        You don’t have access to view CRM cases.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Cases & Disputes</h2>
          <p className="text-sm text-slate-500">Manage dispute workflows with resolution steps and audit trail.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            value={segmentId}
            onChange={(e) => setSegmentId(e.target.value)}
          >
            <option value="ALL">All segments</option>
            {store.crmSegments.map((segment) => (
              <option key={segment.id} value={segment.id}>
                {segment.name}
              </option>
            ))}
          </select>
          {canExport && (
            <Button size="sm" variant="outline" onClick={handleExport}>
              <FileDown className="w-4 h-4 mr-2" /> Export
            </Button>
          )}
        </div>
      </div>

      {filteredCases.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          No cases found for this segment.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredCases.map((entry) => {
            const vendor = store.crmAccounts.find((acc) => acc.id === entry.vendorAccountId);
            const customer = store.crmAccounts.find((acc) => acc.id === entry.customerAccountId);
            const job = store.crmJobs.find((jobEntry) => jobEntry.id === entry.jobId);
            const auditEvents = store.complianceAuditLogs.filter((log) => log.entityId === entry.id);

            return (
              <div key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{entry.subject}</div>
                      <div className="text-xs text-slate-500">Case #{entry.id.slice(0, 6).toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold uppercase text-slate-500">
                    {entry.status}
                  </div>
                </div>

                <div className="text-sm text-slate-600">{entry.description}</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500">
                  <div>
                    <div className="uppercase text-[10px] text-slate-400">Vendor</div>
                    <div className="font-semibold text-slate-700">{vendor?.name || '—'}</div>
                  </div>
                  <div>
                    <div className="uppercase text-[10px] text-slate-400">Customer</div>
                    <div className="font-semibold text-slate-700">{customer?.name || '—'}</div>
                  </div>
                  <div>
                    <div className="uppercase text-[10px] text-slate-400">Job</div>
                    <div className="font-semibold text-slate-700">{job?.title || '—'}</div>
                  </div>
                  <div>
                    <div className="uppercase text-[10px] text-slate-400">Opened</div>
                    <div className="font-semibold text-slate-700">{new Date(entry.openedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="uppercase text-[10px] text-slate-400">Status</div>
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
                      value={entry.status}
                      onChange={(e) => handleUpdateCase(entry, { status: e.target.value as CrmCaseStatus }, 'Case status updated')}
                      disabled={!canEdit}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="uppercase text-[10px] text-slate-400">Severity</div>
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
                      value={entry.severity}
                      onChange={(e) => handleUpdateCase(entry, { severity: e.target.value as CrmCaseSeverity }, 'Case severity updated')}
                      disabled={!canEdit}
                    >
                      {severityOptions.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {entry.resolutionSteps && entry.resolutionSteps.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Resolution Steps</div>
                    {entry.resolutionSteps.map((step) => (
                      <label key={step.id} className="flex items-center gap-2 text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={step.status === 'COMPLETED'}
                          onChange={() => {
                            if (!canEdit) return;
                            const nextSteps = entry.resolutionSteps?.map((entryStep) =>
                              entryStep.id === step.id
                                ? { ...entryStep, status: entryStep.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED' }
                                : entryStep
                            );
                            handleUpdateCase(entry, { resolutionSteps: nextSteps }, 'Resolution step updated');
                          }}
                        />
                        <span className={step.status === 'COMPLETED' ? 'line-through text-slate-400' : ''}>
                          {step.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-[10px] uppercase text-slate-400 font-bold mb-2">Audit Trail</div>
                  <div className="space-y-2 text-xs text-slate-500">
                    {auditEvents.length === 0 && <div>No audit events yet.</div>}
                    {auditEvents.map((log) => (
                      <div key={log.id} className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-slate-700">{log.action}</div>
                          <div>{log.detail}</div>
                        </div>
                        <div className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
