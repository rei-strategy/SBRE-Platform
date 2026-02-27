import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StoreContext } from '../store';
import {
    Building2, Users, Calendar, DollarSign, List, Box,
    Settings as SettingsIcon, Database, User,
    AlertTriangle
} from 'lucide-react';
import { Button } from '../components/Button';
import { Client, Invoice, Job, ServiceCategory, UserRole } from '../types';
import { INDUSTRY_OPTIONS } from '../data/industryOptions';
import { CRM_AUTOMATION_TRIGGERS, CRM_MESSAGE_TEMPLATES } from '../data/crmMessagingTemplates';

// Extracted Components
import { ProfileSettings } from './settings/ProfileSettings';
import { CompanySettings } from './settings/CompanySettings';
import { TeamSettings } from './settings/TeamSettings';
import { FinanceSettings } from './settings/FinanceSettings';

export const Settings: React.FC = () => {
    const store = useContext(StoreContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('');

    if (!store) return null;
    const {
        settings,
        updateSettings,
        users,
        clients,
        jobs,
        invoices,
        updateUser,
        currentUser,
        deleteAccount,
        categoryLibrary,
        approveCategory,
        rejectCategory,
        addCategory
    } = store;
    const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.OFFICE;
    const canExportClients = clients.length > 0;
    const canExportInvoices = invoices.length > 0;

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
        { id: 'services', label: 'Service Menu', icon: List, adminOnly: false },
        { id: 'inventory', label: 'Inventory', icon: Box, adminOnly: true },
        { id: 'data', label: 'Data Management', icon: Database, adminOnly: false },
        { id: 'logout', label: 'Log Out', icon: AlertTriangle, adminOnly: false },
    ];

    const visibleTabs = allTabs.filter(tab => isAdmin || !tab.adminOnly);
    const defaultTab = isAdmin ? 'company' : 'profile';

    useEffect(() => {
        const requestedTab = searchParams.get('tab');
        const validTabIds = visibleTabs.map((tab) => tab.id);

        if (requestedTab && validTabIds.includes(requestedTab)) {
            if (activeTab !== requestedTab) {
                setActiveTab(requestedTab);
            }
            return;
        }

        if (!activeTab || !validTabIds.includes(activeTab)) {
            setActiveTab(defaultTab);
        }
    }, [activeTab, defaultTab, searchParams, visibleTabs]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId }, { replace: true });
    };

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
                                onClick={() => {
                                    if (tab.id === 'logout') {
                                        store.logout();
                                        return;
                                    }
                                    handleTabChange(tab.id);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-4 ${
                                    activeTab === tab.id
                                        ? 'bg-slate-50 dark:bg-slate-700/50 border-emerald-500 text-slate-900 dark:text-white'
                                        : tab.id === 'logout'
                                            ? 'border-transparent text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10'
                                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/30 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-emerald-500' : tab.id === 'logout' ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`} />
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
                        {activeTab === 'services' && (
                            <ServiceCategoryGovernance
                                categoryLibrary={categoryLibrary}
                                isAdmin={isAdmin}
                                currentUserId={currentUser.id}
                                approveCategory={approveCategory}
                                rejectCategory={rejectCategory}
                                addCategory={addCategory}
                            />
                        )}

                        {/* 6. Inventory */}
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

                        {activeTab === 'data' && isAdmin && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Data Management</h2>
                                <div className="flex flex-wrap gap-3">
                                    <Button variant="outline" disabled={!canExportClients}>Export Clients (CSV)</Button>
                                    <Button variant="outline" disabled={!canExportInvoices}>Export Invoices (CSV)</Button>
                                </div>
                                {(!canExportClients || !canExportInvoices) && (
                                    <p className="text-xs text-slate-500">
                                        Export is available once data exists.
                                    </p>
                                )}
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

type CategoryGovernanceProps = {
    categoryLibrary: ServiceCategory[];
    isAdmin: boolean;
    currentUserId: string;
    approveCategory: (categoryId: string, reviewerId?: string) => void;
    rejectCategory: (categoryId: string, reviewerId?: string) => void;
    addCategory: (category: ServiceCategory) => void;
};

const ServiceCategoryGovernance: React.FC<CategoryGovernanceProps> = ({
    categoryLibrary,
    isAdmin,
    currentUserId,
    approveCategory,
    rejectCategory,
    addCategory
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
    const [industryFilter, setIndustryFilter] = useState('ALL');
    const [requestForm, setRequestForm] = useState({
        name: '',
        industryId: '',
        description: '',
        tags: '',
        synonyms: '',
        skillRequirements: '',
        requiredDocuments: ''
    });

    const filteredCategories = useMemo(() => {
        return categoryLibrary.filter((category) => {
            const matchesSearch =
                category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.tags.join(',').toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.synonyms.join(',').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || category.status === statusFilter;
            const matchesIndustry = industryFilter === 'ALL' || category.industryId === industryFilter;
            return matchesSearch && matchesStatus && matchesIndustry;
        });
    }, [categoryLibrary, searchTerm, statusFilter, industryFilter]);

    const handleSubmitRequest = () => {
        if (!requestForm.name || !requestForm.industryId) {
            alert('Please provide a category name and industry.');
            return;
        }

        addCategory({
            id: crypto.randomUUID(),
            name: requestForm.name,
            industryId: requestForm.industryId,
            description: requestForm.description,
            tags: requestForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            synonyms: requestForm.synonyms.split(',').map((syn) => syn.trim()).filter(Boolean),
            skillRequirements: requestForm.skillRequirements.split(',').map((item) => item.trim()).filter(Boolean),
            requiredDocuments: requestForm.requiredDocuments.split(',').map((item) => item.trim()).filter(Boolean),
            status: 'PENDING',
            requestedBy: currentUserId
        });

        setRequestForm({
            name: '',
            industryId: '',
            description: '',
            tags: '',
            synonyms: '',
            skillRequirements: '',
            requiredDocuments: ''
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4 mb-2">Category Governance</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Standardize categories, synonyms, and verification requirements.</p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Request a new category</div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <input
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                        placeholder="Category name"
                        value={requestForm.name}
                        onChange={(e) => setRequestForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <select
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                        value={requestForm.industryId}
                        onChange={(e) => setRequestForm((prev) => ({ ...prev, industryId: e.target.value }))}
                    >
                        <option value="">Select industry</option>
                        {INDUSTRY_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <textarea
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                    placeholder="Description"
                    value={requestForm.description}
                    onChange={(e) => setRequestForm((prev) => ({ ...prev, description: e.target.value }))}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <input
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                        placeholder="Tags (comma separated)"
                        value={requestForm.tags}
                        onChange={(e) => setRequestForm((prev) => ({ ...prev, tags: e.target.value }))}
                    />
                    <input
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                        placeholder="Synonyms (comma separated)"
                        value={requestForm.synonyms}
                        onChange={(e) => setRequestForm((prev) => ({ ...prev, synonyms: e.target.value }))}
                    />
                    <input
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                        placeholder="Skill requirements (comma separated)"
                        value={requestForm.skillRequirements}
                        onChange={(e) => setRequestForm((prev) => ({ ...prev, skillRequirements: e.target.value }))}
                    />
                    <input
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                        placeholder="Required documents (comma separated)"
                        value={requestForm.requiredDocuments}
                        onChange={(e) => setRequestForm((prev) => ({ ...prev, requiredDocuments: e.target.value }))}
                    />
                </div>
                <div className="flex justify-end">
                    <Button size="sm" onClick={handleSubmitRequest}>Submit Request</Button>
                </div>
            </div>

            {isAdmin && (
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        <input
                            className="w-full md:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                            placeholder="Search categories"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        >
                            <option value="ALL">All</option>
                            <option value="APPROVED">Approved</option>
                            <option value="PENDING">Pending</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <select
                            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                            value={industryFilter}
                            onChange={(e) => setIndustryFilter(e.target.value)}
                        >
                            <option value="ALL">All industries</option>
                            {INDUSTRY_OPTIONS.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        {filteredCategories.map((category) => (
                            <div key={category.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{category.name}</h3>
                                        <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            {category.status}
                                        </span>
                                    </div>
                                    {category.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{category.description}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    {category.status !== 'APPROVED' && (
                                        <Button size="sm" onClick={() => approveCategory(category.id, currentUserId)}>Approve</Button>
                                    )}
                                    {category.status !== 'REJECTED' && (
                                        <Button size="sm" variant="outline" onClick={() => rejectCategory(category.id, currentUserId)}>Reject</Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
