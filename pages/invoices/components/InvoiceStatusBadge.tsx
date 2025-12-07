import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceStatus } from '../../../types';
import { Check, AlertCircle, Mail, FileText, ChevronDown, Clock } from 'lucide-react';

interface InvoiceStatusBadgeProps {
    invoice: Invoice;
    onStatusUpdate: (invoice: Invoice, newStatus: InvoiceStatus) => void;
}

export const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ invoice, onStatusUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = () => setIsOpen(false);
        if (isOpen) document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    const status = invoice.status;
    let badgeContent;
    switch (status) {
        case InvoiceStatus.PAID: badgeContent = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wide"><Check className="w-3 h-3" /> Paid</span>; break;
        case InvoiceStatus.OVERDUE: badgeContent = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 uppercase tracking-wide"><AlertCircle className="w-3 h-3" /> Overdue</span>; break;
        case InvoiceStatus.SENT: badgeContent = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-wide"><Mail className="w-3 h-3" /> Sent</span>; break;
        default: badgeContent = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 uppercase tracking-wide"><FileText className="w-3 h-3" /> Draft</span>;
    }

    return (
        <div className="relative inline-block">
            <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="hover:opacity-80 transition-opacity focus:outline-none flex items-center gap-1"
            >
                {badgeContent} <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="py-1">
                        <button onClick={(e) => { e.stopPropagation(); onStatusUpdate(invoice, InvoiceStatus.DRAFT); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Draft</button>
                        <button onClick={(e) => { e.stopPropagation(); onStatusUpdate(invoice, InvoiceStatus.SENT); }} className="w-full text-left px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Sent</button>
                        <button onClick={(e) => { e.stopPropagation(); onStatusUpdate(invoice, InvoiceStatus.PAID); }} className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Paid</button>
                        <button onClick={(e) => { e.stopPropagation(); onStatusUpdate(invoice, InvoiceStatus.OVERDUE); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Overdue</button>
                    </div>
                </div>
            )}
        </div>
    );
};
