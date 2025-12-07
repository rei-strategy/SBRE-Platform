import React, { useState } from 'react';
import { Invoice, Client, InvoiceStatus } from '../../../types';
import { ArrowUpDown, ArrowUp, ArrowDown, FileText, Calendar, Clock, CreditCard, Mail, ChevronRight, Loader2 } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';

interface InvoiceTableProps {
    invoices: Invoice[];
    clients: Client[];
    onRowClick: (invoice: Invoice) => void;
    onStatusUpdate: (invoice: Invoice, status: InvoiceStatus) => void;
    onSendInvoice: (e: React.MouseEvent, invoice: Invoice) => void;
    onRecordPayment: (e: React.MouseEvent, invoice: Invoice) => void;
    sortConfig: { key: string; direction: 'asc' | 'desc' };
    onSort: (key: string) => void;
    sendingInvoiceId: string | null;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
    invoices,
    clients,
    onRowClick,
    onStatusUpdate,
    onSendInvoice,
    onRecordPayment,
    sortConfig,
    onSort,
    sendingInvoiceId
}) => {

    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />;
        return sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-emerald-500" /> : <ArrowDown className="w-4 h-4 text-emerald-500" />;
    };

    return (
        <div className="flex-1 overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors group select-none" onClick={() => onSort('info')}>
                            <div className="flex items-center gap-2">Invoice Info <SortIcon columnKey="info" /></div>
                        </th>
                        <th className="px-6 py-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors group select-none" onClick={() => onSort('client')}>
                            <div className="flex items-center gap-2">Client <SortIcon columnKey="client" /></div>
                        </th>
                        <th className="px-6 py-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors group select-none" onClick={() => onSort('status')}>
                            <div className="flex items-center gap-2">Status <SortIcon columnKey="status" /></div>
                        </th>
                        <th className="px-6 py-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors group select-none text-right" onClick={() => onSort('amount')}>
                            <div className="flex items-center justify-end gap-2">Amount & Balance <SortIcon columnKey="amount" /></div>
                        </th>
                        <th className="px-6 py-4 w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {invoices.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-600"><FileText className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-medium">No invoices found matching your criteria.</p></td></tr>
                    ) : (
                        invoices.map((invoice) => {
                            const client = clients.find(c => c.id === invoice.clientId);
                            const daysOverdue = invoice.status === InvoiceStatus.OVERDUE ? differenceInDays(new Date(), parseISO(invoice.dueDate)) : 0;
                            return (
                                <tr key={invoice.id} onClick={() => onRowClick(invoice)} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors duration-150">
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 shrink-0 border border-slate-200 dark:border-slate-700"><FileText className="w-5 h-5" /></div>
                                            <div><p className="font-bold text-slate-900 dark:text-white text-sm">#{invoice.id.slice(0, 8).toUpperCase()}</p><div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400"><Calendar className="w-3 h-3" /> {format(parseISO(invoice.issuedDate), 'MMM d, yyyy')}</div></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex items-center gap-3 mb-1"><div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold border border-slate-200 dark:border-slate-700">{client?.firstName[0]}{client?.lastName[0]}</div><span className="text-sm font-bold text-slate-700 dark:text-slate-300">{client?.firstName} {client?.lastName}</span></div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 ml-9 truncate max-w-[200px]">{client?.companyName || client?.email}</p>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex flex-col items-start gap-1.5">
                                            <InvoiceStatusBadge invoice={invoice} onStatusUpdate={onStatusUpdate} />
                                            {invoice.status === InvoiceStatus.OVERDUE && daysOverdue > 0 && (<span className="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded"><Clock className="w-3 h-3" /> {daysOverdue} days late</span>)}
                                            {invoice.status === InvoiceStatus.SENT && (<span className="text-[10px] text-slate-400">Due: {format(parseISO(invoice.dueDate), 'MMM d')}</span>)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-top text-right">
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">${invoice.total.toFixed(2)}</p>
                                        {invoice.balanceDue > 0 ? (<p className="text-xs font-bold text-red-600 dark:text-red-400 mt-0.5">Due: ${invoice.balanceDue.toFixed(2)}</p>) : (<p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Paid in Full</p>)}
                                    </td>
                                    <td className="px-6 py-4 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {(invoice.status === InvoiceStatus.SENT || invoice.status === InvoiceStatus.OVERDUE) && (<button onClick={(e) => onRecordPayment(e, invoice)} className="p-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors" title="Record Payment"><CreditCard className="w-4 h-4" /></button>)}
                                            {(invoice.status === InvoiceStatus.DRAFT || invoice.status === InvoiceStatus.SENT || invoice.status === InvoiceStatus.OVERDUE) && (<button onClick={(e) => onSendInvoice(e, invoice)} disabled={sendingInvoiceId === invoice.id} className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors disabled:opacity-50" title="Email Invoice">{sendingInvoiceId === invoice.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}</button>)}
                                            <div className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};
