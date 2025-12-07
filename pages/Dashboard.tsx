import React, { useMemo, useContext } from 'react';
import { CircleDollarSign } from 'lucide-react';
import { InvoiceStatus, UserRole } from '../types';
import { StoreContext } from '../store';

// Extracted Components
import { TechnicianDashboard } from './dashboard/components/TechnicianDashboard';
import { ActionCenter } from './dashboard/components/ActionCenter';
import { TodaysAgenda } from './dashboard/components/TodaysAgenda';
import { RevenueChart } from './dashboard/components/RevenueChart';
import { LiveTeamStatus } from './dashboard/components/LiveTeamStatus';
import { QuotePipeline } from './dashboard/components/QuotePipeline';
import { ActivityFeed } from './dashboard/components/ActivityFeed';

export const Dashboard: React.FC = () => {
  const store = useContext(StoreContext);
  const currentUser = store?.currentUser;
  const today = new Date();

  // Calculate total revenue (for the header) - All time paid
  const totalRevenue = useMemo(() => {
    if (!store) return 0;
    return store.invoices.filter(i => i.status === InvoiceStatus.PAID).reduce((acc, i) => acc + i.total, 0);
  }, [store?.invoices]);

  if (!store || !currentUser) return null;

  // --- ROLE CHECK ---
  const isTechnician = currentUser.role === UserRole.TECHNICIAN;

  if (isTechnician) {
    return <TechnicianDashboard />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Operational overview for {today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Total Revenue</p>
              <p className="font-bold text-slate-900 dark:text-white text-lg">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT COLUMN (Main Operations) */}
        <div className="xl:col-span-2 space-y-6">
          <ActionCenter />
          <TodaysAgenda />
          <RevenueChart />
        </div>

        {/* RIGHT COLUMN (Status & Analytics) */}
        <div className="space-y-6">
          <LiveTeamStatus />
          <QuotePipeline />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};
