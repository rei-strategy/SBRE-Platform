import React from 'react';
import { Search, Filter } from 'lucide-react';
import { InvoiceFilter } from '../../../types'; // We might need to export this type or redefine it

export type InvoiceFilterType = 'ALL' | 'PAID' | 'OUTSTANDING' | 'DRAFT' | 'OVERDUE';

interface InvoiceToolbarProps {
    activeFilter: InvoiceFilterType;
    setActiveFilter: (filter: InvoiceFilterType) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export const InvoiceToolbar: React.FC<InvoiceToolbarProps> = ({
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm
}) => {
    return (
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 bg-slate-50/50 dark:bg-slate-900/50 items-center justify-between">
            <div className="flex p-1 bg-slate-200/60 dark:bg-slate-700/60 rounded-xl self-start sm:self-center">
                {[{ id: 'ALL', label: 'All Invoices' }, { id: 'OUTSTANDING', label: 'Outstanding' }, { id: 'PAID', label: 'Paid' }, { id: 'OVERDUE', label: 'Overdue' }, { id: 'DRAFT', label: 'Drafts' }].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveFilter(tab.id as InvoiceFilterType)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === tab.id ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-600/50'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search invoices..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all text-sm placeholder-slate-400 dark:placeholder-slate-500"
                    />
                </div>
                <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200">
                    <Filter className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
