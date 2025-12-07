import React, { useContext } from 'react';
import { StoreContext } from '../../../store';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle, CircleDollarSign, FileText } from 'lucide-react';
import { Job, Invoice, Quote, JobStatus, InvoiceStatus, QuoteStatus } from '../../../types';
import { formatDistanceToNow } from 'date-fns';

export const ActivityFeed: React.FC = () => {
    const store = useContext(StoreContext);

    if (!store) return null;

    const activities = [
        ...store.jobs.filter(j => j.status === JobStatus.COMPLETED).map(j => ({ type: 'JOB_COMPLETE', date: j.end, data: j })),
        ...store.invoices.filter(i => i.status === InvoiceStatus.PAID).map(i => ({ type: 'PAYMENT', date: i.payments[0]?.date || i.issuedDate, data: i })),
        ...store.quotes.filter(q => q.status === QuoteStatus.SENT).map(q => ({ type: 'QUOTE_SENT', date: q.issuedDate, data: q }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" />
                    Activity Feed
                </h3>
            </div>
            <div className="p-3 space-y-2">
                {activities.map((act, idx) => {
                    let icon, color, title, desc, linkTo;
                    if (act.type === 'JOB_COMPLETE') {
                        icon = CheckCircle; color = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800';
                        title = 'Job Completed'; desc = (act.data as Job).title;
                        linkTo = `/jobs/${(act.data as Job).id}`;
                    } else if (act.type === 'PAYMENT') {
                        icon = CircleDollarSign; color = 'text-blue-500 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800';
                        title = 'Payment Received'; desc = `Invoice #${(act.data as Invoice).id}`;
                        linkTo = '/invoices';
                    } else {
                        icon = FileText; color = 'text-slate-500 bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600';
                        title = 'Quote Sent'; desc = `Quote #${(act.data as Quote).id}`;
                        linkTo = '/quotes';
                    }
                    const Icon = icon;

                    return (
                        <Link
                            to={linkTo}
                            key={idx}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all group hover:-translate-y-0.5"
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{desc}</p>
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-md">
                                {formatDistanceToNow(new Date(act.date), { addSuffix: true })}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
