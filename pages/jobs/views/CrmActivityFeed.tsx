import React, { useContext, useMemo, useState } from 'react';
import { StoreContext } from '../../../store';
import { CrmActivity, CrmEntityType } from '../../../types';
import {
  FileText,
  Mail,
  MessageCircle,
  Phone,
  StickyNote,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

const channelMeta = {
  EMAIL: { icon: Mail, label: 'Email' },
  SMS: { icon: MessageCircle, label: 'SMS' },
  CALL: { icon: Phone, label: 'Call' },
  NOTE: { icon: StickyNote, label: 'Note' },
  FILE: { icon: FileText, label: 'File' },
  STATUS: { icon: ShieldCheck, label: 'Status' },
};

const entityOptions: { id: 'ALL' | CrmEntityType; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'ACCOUNT', label: 'Account' },
  { id: 'CONTACT', label: 'Contact' },
  { id: 'LOCATION', label: 'Location' },
  { id: 'ASSET', label: 'Asset' },
  { id: 'JOB', label: 'Job' },
  { id: 'QUOTE', label: 'Quote' },
  { id: 'INVOICE', label: 'Invoice' },
  { id: 'TASK', label: 'Task' },
  { id: 'CASE', label: 'Case' },
];

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const CrmActivityFeed: React.FC = () => {
  const store = useContext(StoreContext);
  const [entityFilter, setEntityFilter] = useState<'ALL' | CrmEntityType>('ALL');

  const activities = useMemo(() => {
    if (!store) return [];
    return store.crmActivities
      .filter((activity) => {
        if (entityFilter === 'ALL') return true;
        return activity.relatedTo?.type === entityFilter;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [store, entityFilter]);

  if (!store) return null;

  const handleConsent = (activity: CrmActivity) => {
    if (!activity.consent || !activity.consent.required) return;
    store.updateCrmActivity(activity.id, {
      consent: {
        ...activity.consent,
        granted: true,
        recordedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg text-slate-900">CRM Activity Timeline</h3>
          <p className="text-sm text-slate-500">
            Unified email, SMS, call, notes, files, and status changes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase text-slate-500">Filter</label>
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value as 'ALL' | CrmEntityType)}
          >
            {entityOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {activities.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
            No activity logged for this selection.
          </div>
        )}
        {activities.map((activity) => {
          const meta = channelMeta[activity.channel];
          const Icon = meta.icon;
          const directionIcon = activity.direction === 'INBOUND' ? ArrowDownRight : ArrowUpRight;
          const DirectionIcon = directionIcon;
          return (
            <div key={activity.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{activity.subject}</div>
                    <div className="text-xs text-slate-500">
                      {meta.label} • {activity.relatedTo?.type || 'Account'} • {formatTimestamp(activity.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <DirectionIcon className="w-4 h-4" />
                  {activity.direction}
                </div>
              </div>

              {activity.detail && (
                <div className="text-sm text-slate-600">{activity.detail}</div>
              )}

              {activity.callRecordingUrl && (
                <div className="text-xs text-slate-500">
                  Recording: <span className="font-semibold text-slate-700">{activity.callRecordingUrl}</span>
                </div>
              )}

              {activity.consent?.required && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded-full font-semibold ${
                      activity.consent.granted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    Consent {activity.consent.granted ? 'granted' : 'required'}
                  </span>
                  {!activity.consent.granted && (
                    <button
                      type="button"
                      className="text-emerald-700 font-semibold"
                      onClick={() => handleConsent(activity)}
                    >
                      Mark consent received
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
