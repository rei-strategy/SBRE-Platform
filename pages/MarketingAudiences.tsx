import React, { useState, useContext, useMemo } from 'react';
import { StoreContext } from '../store';
import { AudienceSegment, SegmentFilter } from '../types';
import { Users, Filter, UserPlus, MoreHorizontal, X, Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import { Button } from '../components/Button';

export const MarketingAudiences: React.FC = () => {
    const store = useContext(StoreContext);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    if (!store) return null;
    const { marketingAudiences, deleteAudienceSegment } = store;

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Audiences</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Segment your clients to send relevant, targeted messages.</p>
                </div>
                <Button className="shadow-lg shadow-emerald-500/20" onClick={() => setIsCreateModalOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" /> Create Segment
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Segment Name</th>
                            <th className="px-6 py-4">Contacts</th>
                            <th className="px-6 py-4">Criteria</th>
                            <th className="px-6 py-4">Last Updated</th>
                            <th className="px-6 py-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {marketingAudiences.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No segments yet. Create one to get started!
                                </td>
                            </tr>
                        ) : marketingAudiences.map(seg => (
                            <tr key={seg.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-900 dark:text-white block">{seg.name}</span>
                                            {seg.description && <span className="text-xs text-slate-400">{seg.description}</span>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                    {seg.estimatedCount?.toLocaleString() || 0}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="flex flex-wrap gap-2">
                                        {seg.filters.map((f, i) => (
                                            <div key={i} className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-700 text-xs">
                                                <span className="font-semibold text-slate-500">{f.field}</span>
                                                <span className="text-slate-400">{f.operator}</span>
                                                <span className="font-mono text-slate-700 dark:text-slate-300">{String(f.value)}</span>
                                            </div>
                                        ))}
                                        {seg.filters.length === 0 && <span className="text-slate-400 italic">All Contacts</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                    {new Date(seg.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => deleteAudienceSegment(seg.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isCreateModalOpen && (
                <CreateSegmentModal onClose={() => setIsCreateModalOpen(false)} />
            )}
        </div>
    );
};

const CreateSegmentModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const store = useContext(StoreContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [filters, setFilters] = useState<SegmentFilter[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Filter Builder State
    const [newFilterField, setNewFilterField] = useState('tags');
    const [newFilterOp, setNewFilterOp] = useState('contains');
    const [newFilterValue, setNewFilterValue] = useState('');

    const clients = store?.clients || [];

    // Live Preview Calculation
    const previewCount = useMemo(() => {
        if (filters.length === 0) return clients.length;

        return clients.filter(client => {
            return filters.every(filter => {
                const clientValue = (client as any)[filter.field]; // Simple access, improve for nested

                if (filter.operator === 'equals') return String(clientValue) === String(filter.value);
                if (filter.operator === 'contains') return String(clientValue).toLowerCase().includes(String(filter.value).toLowerCase());
                if (filter.operator === 'gt') return Number(clientValue) > Number(filter.value);
                if (filter.operator === 'lt') return Number(clientValue) < Number(filter.value);

                // Handle array fields like tags
                if (filter.field === 'tags' && Array.isArray(client.tags)) {
                    if (filter.operator === 'contains') return client.tags.some(t => t.toLowerCase().includes(String(filter.value).toLowerCase()));
                }

                return false;
            });
        }).length;
    }, [clients, filters]);

    const addFilter = () => {
        if (!newFilterValue) return;
        setFilters([...filters, { field: newFilterField, operator: newFilterOp as any, value: newFilterValue }]);
        setNewFilterValue('');
    };

    const removeFilter = (index: number) => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!name) return;
        setIsSaving(true);
        await store?.addAudienceSegment({
            id: '', // Generated by DB
            companyId: '', // Handled by store
            name,
            description,
            filters,
            estimatedCount: previewCount,
            createdAt: ''
        });
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Segment</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Segment Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="e.g. High Value Clients"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                            <input
                                type="text"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="Short description..."
                            />
                        </div>
                    </div>

                    {/* Filter Builder */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Define Criteria
                        </h3>

                        <div className="flex flex-col md:flex-row gap-2 mb-4">
                            <select
                                value={newFilterField}
                                onChange={e => setNewFilterField(e.target.value)}
                                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                            >
                                <option value="tags">Tags</option>
                                <option value="firstName">First Name</option>
                                <option value="lastName">Last Name</option>
                                <option value="email">Email</option>
                                <option value="companyName">Company Name</option>
                            </select>
                            <select
                                value={newFilterOp}
                                onChange={e => setNewFilterOp(e.target.value)}
                                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                            >
                                <option value="contains">Contains</option>
                                <option value="equals">Equals</option>
                                <option value="gt">Greater Than</option>
                                <option value="lt">Less Than</option>
                            </select>
                            <input
                                type="text"
                                value={newFilterValue}
                                onChange={e => setNewFilterValue(e.target.value)}
                                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-emerald-500"
                                placeholder="Value..."
                                onKeyDown={e => e.key === 'Enter' && addFilter()}
                            />
                            <button
                                onClick={addFilter}
                                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Active Filters */}
                        <div className="space-y-2">
                            {filters.map((filter, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{filter.field}</span>
                                        <span className="text-slate-400 text-xs uppercase">{filter.operator}</span>
                                        <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400">{filter.value}</span>
                                    </div>
                                    <button onClick={() => removeFilter(idx)} className="text-slate-400 hover:text-red-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {filters.length === 0 && (
                                <p className="text-sm text-slate-400 italic text-center py-2">No filters added. This segment will include ALL contacts.</p>
                            )}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/30 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Estimated Audience Size</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">Based on current client data</p>
                        </div>
                        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            {previewCount}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!name || isSaving}>
                        {isSaving ? 'Saving...' : 'Save Segment'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
