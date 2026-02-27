import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../store';
import { UserRole } from '../types';
import { Building2, Calendar, Database, DollarSign, List, Settings, ShieldCheck, Users, Workflow } from 'lucide-react';

const adminCards = [
  {
    title: 'Company & Coverage',
    description: 'Business profile, coverage areas, and verification documents.',
    icon: Building2,
    to: '/settings?tab=company'
  },
  {
    title: 'Team & Access',
    description: 'Roles, payroll settings, and staff invite controls.',
    icon: Users,
    to: '/settings?tab=team'
  },
  {
    title: 'Schedule Config',
    description: 'Business hours and scheduling defaults.',
    icon: Calendar,
    to: '/settings?tab=schedule'
  },
  {
    title: 'Finance & Tax',
    description: 'Tax and currency configuration.',
    icon: DollarSign,
    to: '/settings?tab=finance'
  },
  {
    title: 'Service Menu',
    description: 'Category governance and verification requirements.',
    icon: List,
    to: '/settings?tab=services'
  },
  {
    title: 'Inventory & Data',
    description: 'Inventory thresholds, exports, and account data controls.',
    icon: Database,
    to: '/settings?tab=inventory'
  }
];

export const AdminSettingsHub: React.FC = () => {
  const store = useContext(StoreContext);
  if (!store) return null;

  const isAdmin = store.currentUser.role === UserRole.ADMIN || store.currentUser.role === UserRole.OFFICE || store.currentUser.role === UserRole.CLIENT;
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-16">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Access Required</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">This page is available to Admin, Office, and Client roles.</p>
          <Link to="/settings" className="inline-flex mt-5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold">
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-slate-900 dark:bg-white rounded-xl text-white dark:text-slate-900">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Interface</h1>
          <p className="text-slate-500 dark:text-slate-400">Central access to all admin configuration pages.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {adminCards.map((card) => (
          <Link key={card.title} to={card.to} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:border-emerald-300 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <card.icon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{card.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.description}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-800 font-semibold">
            <Workflow className="w-4 h-4" />
            Response-Time SLA Settings
          </div>
          <p className="text-sm text-amber-700 mt-1">SLA timers are configured in Jobs → CRM Pipeline via each stage’s Edit SLA control.</p>
        </div>
        <Link to="/jobs" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold">
          <ShieldCheck className="w-4 h-4" />
          Open Job Management
        </Link>
      </div>
    </div>
  );
};
