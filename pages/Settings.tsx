import React, { useContext, useState } from 'react';
import { StoreContext } from '../store';
import {
    Building2, Users, Calendar, DollarSign, List, Bell, Box,
    Settings as SettingsIcon, Database, Briefcase, User
} from 'lucide-react';
import { Button } from '../components/Button';
import { UserRole } from '../types';

// Extracted Components
import { ProfileSettings } from './settings/ProfileSettings';
import { CompanySettings } from './settings/CompanySettings';
import { TeamSettings } from './settings/TeamSettings';
import { FinanceSettings } from './settings/FinanceSettings';

export const Settings: React.FC = () => {
    const store = useContext(StoreContext);
    const [activeTab, setActiveTab] = useState('');

    if (!store) return null;
    const {
        settings,
        updateSettings,
        users,
        updateUser,
        currentUser,
        deleteAccount,
        categoryLibrary,
        approveCategory,
        rejectCategory
    } = store;
    const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.OFFICE;

    // Initialize active tab based on role
    if (!activeTab) {
        setActiveTab(isAdmin ? 'company' : 'profile');
    }

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            const { error } = await deleteAccount();
            if (error) {
                alert("Error deleting account: " + error.message);
            }
        }
    };

    const allTabs = [
        { id: 'company', label: 'Company Profile', icon: Building2, adminOnly: true },
        { id: 'profile', label: 'My Profile', icon: User, adminOnly: false },
        { id: 'team', label: 'Team & Payroll', icon: Users, adminOnly: true },
        { id: 'schedule', label: 'Schedule Config', icon: Calendar, adminOnly: true },
        { id: 'finance', label: 'Finance & Tax', icon: DollarSign, adminOnly: true },
        { id: 'services', label: 'Service Menu', icon: List, adminOnly: true },
        { id: 'notifications', label: 'Notifications', icon: Bell, adminOnly: true },
        { id: 'inventory', label: 'Inventory', icon: Box, adminOnly: true },
        { id: 'workflow', label: 'Workflow', icon: Briefcase, adminOnly: true },
        { id: 'data', label: 'Data Management', icon: Database, adminOnly: true },
    ];

    const visibleTabs = allTabs.filter(tab => isAdmin || !tab.adminOnly);

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-900 dark:bg-white rounded-xl text-white dark:text-slate-900">
                    <SettingsIcon className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Configure your business logic, team, and preferences.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full lg:w-64 shrink-0">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden sticky top-24">
                        {visibleTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-4 ${activeTab === tab.id ? 'bg-slate-50 dark:bg-slate-700/50 border-emerald-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/30 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 lg:p-8 min-h-[600px]">

                        {/* 0. My Profile (For Techs) */}
                        {activeTab === 'profile' && (
                            <ProfileSettings currentUser={currentUser} handleDeleteAccount={handleDeleteAccount} />
                        )}

                        {/* 1. Company Profile */}
                        {activeTab === 'company' && isAdmin && (
                            <CompanySettings settings={settings} updateSettings={updateSettings} />
                        )}

                        {/* 2. Team & Payroll */}
                        {activeTab === 'team' && isAdmin && (
                            <TeamSettings users={users} updateUser={updateUser} settings={settings} />
                        )}

                        {/* 3. Schedule Config */}
                        {activeTab === 'schedule' && isAdmin && (
                            <div className="space-y-6 max-w-2xl">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Schedule Configuration</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Business Start</label>
                                        <input
                                            type="time"
                                            className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={settings.businessHoursStart}
                                            onChange={(e) => updateSettings({ businessHoursStart: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Business End</label>
                                        <input
                                            type="time"
                                            className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={settings.businessHoursEnd}
                                            onChange={(e) => updateSettings({ businessHoursEnd: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-sm">
                                    <span className="font-bold">Note:</span> These hours determine the visible grid on your calendar view.
                                </div>
                            </div>
                        )}

                        {/* 4. Finance & Tax */}
                        {activeTab === 'finance' && isAdmin && (
                            <FinanceSettings settings={settings} updateSettings={updateSettings} />
                        )}

                        {/* 5. Service Menu (Mock) */}
                        {activeTab === 'services' && isAdmin && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4 mb-2">Category Governance</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Standardize categories, synonyms, and verification requirements.</p>
                                </div>

                                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                                        Pending approvals
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {categoryLibrary.filter((c) => c.status === 'PENDING').length === 0 ? (
                                            <div className="p-4 text-sm text-slate-500 dark:text-slate-400">No pending categories.</div>
                                        ) : (
                                            categoryLibrary
                                                .filter((c) => c.status === 'PENDING')
                                                .map((category) => (
                                                    <div key={category.id} className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                                        <div>
                                                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{category.name}</div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">{category.description}</div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                                Synonyms: {category.synonyms.join(', ') || '—'}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button size="sm" onClick={() => approveCategory(category.id, currentUser.id)}>Approve</Button>
                                                            <Button size="sm" variant="outline" onClick={() => rejectCategory(category.id, currentUser.id)}>Reject</Button>
                                                        </div>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                                        <span>Category Library</span>
                                        <span>Status</span>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-900 dark:text-white">
                                        {categoryLibrary.map((category) => (
                                            <div key={category.id} className="p-4 grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-sm">{category.name}</span>
                                                        <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{category.industryId.replace(/-/g, ' ')}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{category.description}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        Tags: {category.tags.join(', ') || '—'}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        Synonyms: {category.synonyms.join(', ') || '—'}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        Skills: {category.skillRequirements.join(', ') || '—'}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        Required docs: {category.requiredDocuments.join(', ') || '—'}
                                                    </div>
                                                </div>
                                                <div className="flex items-start lg:items-center justify-between lg:justify-end gap-3">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                                        category.status === 'APPROVED'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : category.status === 'PENDING'
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-slate-200 text-slate-600'
                                                    }`}>
                                                        {category.status}
                                                    </span>
                                                    {category.status === 'REJECTED' && (
                                                        <Button size="sm" variant="outline" onClick={() => approveCategory(category.id, currentUser.id)}>
                                                            Re-approve
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 6. Notifications */}
                        {activeTab === 'notifications' && isAdmin && (
                            <div className="space-y-6 max-w-2xl">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Notification Templates</h2>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">"On My Way" SMS</label>
                                    <textarea
                                        className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                                        value={settings.smsTemplateOnMyWay}
                                        onChange={(e) => updateSettings({ smsTemplateOnMyWay: e.target.value })}
                                    />
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Available variables: {'{{clientName}}'}, {'{{techName}}'}</p>
                                </div>
                            </div>
                        )}

                        {/* 7. Inventory */}
                        {activeTab === 'inventory' && isAdmin && (
                            <div className="space-y-6 max-w-2xl">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Inventory Settings</h2>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Low Stock Alert Threshold</label>
                                    <input
                                        type="number"
                                        className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={settings.lowStockThreshold}
                                        onChange={(e) => updateSettings({ lowStockThreshold: parseInt(e.target.value) })}
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Products below this quantity will be flagged in red.</p>
                                </div>
                            </div>
                        )}

                        {/* 8. Workflow */}
                        {activeTab === 'workflow' && isAdmin && (
                            <div className="space-y-6 max-w-2xl">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Workflow Automation</h2>
                                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">Auto-Invoice</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Automatically generate a draft invoice when a job is completed.</p>
                                    </div>
                                    <button
                                        onClick={() => updateSettings({ enableAutoInvoice: !settings.enableAutoInvoice })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableAutoInvoice ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-600'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableAutoInvoice ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 9. Data */}
                        {activeTab === 'data' && isAdmin && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Data Management</h2>
                                <div className="flex gap-4">
                                    <Button variant="outline">Export Clients (CSV)</Button>
                                    <Button variant="outline">Export Invoices (CSV)</Button>
                                </div>
                                <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                                    <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wide">Danger Zone</h3>
                                    <Button variant="danger" size="sm" onClick={handleDeleteAccount}>Delete Account</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
