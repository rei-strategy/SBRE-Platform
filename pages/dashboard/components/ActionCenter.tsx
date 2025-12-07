import React, { useContext } from 'react';
import { StoreContext } from '../../../store';
import { Link } from 'react-router-dom';
import { AlertTriangle, Briefcase, FileText } from 'lucide-react';
import { InvoiceStatus, JobStatus, QuoteStatus } from '../../../types';

export const ActionCenter: React.FC = () => {
    const store = useContext(StoreContext);

    if (!store) return null;

    const overdueInvoices = store.invoices.filter(i => i.status === InvoiceStatus.OVERDUE);
    const unassignedJobs = store.jobs.filter(j => j.assignedTechIds.length === 0 && j.status !== JobStatus.COMPLETED && j.status !== JobStatus.CANCELLED);
    const pendingQuotes = store.quotes.filter(q => q.status === QuoteStatus.SENT);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/invoices?status=OVERDUE" className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-500"></div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">{overdueInvoices.length}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Overdue Invoices</p>
                </div>
            </Link>

            <Link to="/schedule" className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                    <Briefcase className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">{unassignedJobs.length}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Unassigned Jobs</p>
                </div>
            </Link>

            <Link to="/quotes?status=SENT" className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{pendingQuotes.length}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pending Quotes</p>
                </div>
            </Link>
        </div>
    );
};
