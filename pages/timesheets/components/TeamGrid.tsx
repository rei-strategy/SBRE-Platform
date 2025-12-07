import React, { useContext } from 'react';
import { StoreContext } from '../../../store';
import { UserRole } from '../../../types';
import { calculateWeeklyPayroll } from '../utils';
import { format } from 'date-fns';

interface TeamGridProps {
    currentWeekStart: Date;
}

export const TeamGrid: React.FC<TeamGridProps> = ({ currentWeekStart }) => {
    const store = useContext(StoreContext);

    if (!store) return null;
    const { users, timeEntries, jobs } = store;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Weekly Total</th>
                        <th className="px-6 py-4">Last Activity</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {users.filter(u => u.role !== UserRole.CLIENT).map(user => {
                        const userActiveEntry = timeEntries.find(e => e.userId === user.id && !e.endTime);
                        const payroll = calculateWeeklyPayroll(user.id, users, jobs, timeEntries, currentWeekStart);

                        return (
                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {userActiveEntry ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Clocked In
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                            Clocked Out
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                                    {payroll.regular.toFixed(1)} {payroll.label}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {userActiveEntry ? `Since ${format(new Date(userActiveEntry.startTime), 'h:mm a')}` : '-'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
