import React, { useContext } from 'react';
import { StoreContext } from '../../../store';
import { Clock, AlertTriangle, DollarSign } from 'lucide-react';
import { calculateWeeklyPayroll } from '../utils';

interface PayrollSummaryProps {
    currentWeekStart: Date;
}

export const PayrollSummary: React.FC<PayrollSummaryProps> = ({ currentWeekStart }) => {
    const store = useContext(StoreContext);

    if (!store) return null;
    const { currentUser, users, jobs, timeEntries } = store;

    const myPayroll = calculateWeeklyPayroll(currentUser.id, users, jobs, timeEntries, currentWeekStart);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400"><Clock className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-700 dark:text-slate-200">Regular {myPayroll.label}</h3>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{myPayroll.regular.toFixed(1)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400"><AlertTriangle className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-700 dark:text-slate-200">Overtime</h3>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{myPayroll.overtime.toFixed(1)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400"><DollarSign className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-700 dark:text-slate-200">Est. Gross Pay</h3>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">${myPayroll.gross.toFixed(2)}</p>
            </div>
        </div>
    );
};
