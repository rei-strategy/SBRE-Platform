import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../store';
import { UserRole } from '../types';
import {
  Cable,
  Database,
  FileDigit,
  LayoutDashboard,
  Settings,
  Shield,
  ShieldAlert,
  Users,
  Workflow,
  Boxes,
  MessageSquare,
  Building2,
  Flag,
  Bell
} from 'lucide-react';

const sudoCards = [
  {
    title: 'Platform Core Controls',
    description: 'Company-level policy, coverage, and global company identity controls.',
    icon: Building2,
    to: '/settings?tab=company'
  },
  {
    title: 'Team & Permissions',
    description: 'User roles, payroll controls, and team access across the platform.',
    icon: Users,
    to: '/settings?tab=team'
  },
  {
    title: 'Workflow Security',
    description: 'SLA policy location, escalation rules, and case controls.',
    icon: Shield,
    to: '/jobs'
  },
  {
    title: 'Automation Governance',
    description: 'Review and manage platform automations and execution behavior.',
    icon: Workflow,
    to: '/jobs'
  },
  {
    title: 'Data Lake & Exports',
    description: 'Inventory, datasets, and operational export controls.',
    icon: Database,
    to: '/settings?tab=data'
  },
  {
    title: 'Finance Operations',
    description: 'Invoice, tax, and payout controls used by enterprise finance flows.',
    icon: FileDigit,
    to: '/invoices'
  },
  {
    title: 'Compliance & Alerting',
    description: 'Review notification templates and trust/safety channels.',
    icon: Bell,
    to: '/notifications'
  },
  {
    title: 'Service Registry',
    description: 'Category governance and audit-friendly policy enforcement.',
    icon: Flag,
    to: '/settings?tab=services'
  },
  {
    title: 'Messaging Fabric',
    description: 'Communication logs and inbound/outbound workflow visibility.',
    icon: MessageSquare,
    to: '/communication'
  },
  {
    title: 'Inventory Control',
    description: 'Stock and warehouse policy for platform-wide job operations.',
    icon: Boxes,
    to: '/inventory'
  },
  {
    title: 'Reliability Dashboard',
    description: 'Job health, SLA timing, and operational observability.',
    icon: Cable,
    to: '/jobs'
  }
];

const privilegedRoles = [UserRole.ADMIN];

export const AdminSettingsHub: React.FC = () => {
  const store = useContext(StoreContext);
  if (!store) return null;

  const isAdmin = privilegedRoles.includes(store.currentUser.role);
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-16">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Access Required</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">This is the sudo admin console. Access is restricted to administrator roles only.</p>
          <Link to="/settings" className="inline-flex mt-5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold">
            Open Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-900 dark:bg-white rounded-xl text-white dark:text-slate-900">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Sudo Admin Console</h1>
          <p className="text-slate-500 dark:text-slate-400">Platform-level controls for operations, security, and configuration.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {sudoCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:border-slate-400 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100 flex items-center justify-center mb-3">
              <card.icon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{card.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.description}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <LayoutDashboard className="w-4 h-4" />
            <span>Response-Time SLA</span>
          </div>
          <p className="text-sm mt-1 text-amber-800">SLA is configured from Jobs → CRM Pipeline using per-stage Edit SLA controls.</p>
        </div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold"
        >
          <Settings className="w-4 h-4" />
          Open Job Management
        </Link>
      </div>
    </div>
  );
};
