import React from 'react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { Invoice, InvoiceStatus, Client } from '../../../types'; // Ensure Client import is available or remove if unused in props (checking props below)
import { Download, Mail, CreditCard, Loader2, Calendar, MapPin, Phone, Hash } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';

interface InvoiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice | null;
    client: Client | undefined;
    onStatusUpdate: (invoice: Invoice, status: InvoiceStatus) => void;
    onDownloadPDF: (e: React.MouseEvent | undefined, invoice: Invoice) => void;
    onSendInvoice: (e: React.MouseEvent, invoice: Invoice) => void;
    onRecordPayment: (e: React.MouseEvent, invoice: Invoice) => void;
    sendingInvoiceId: string | null;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
    isOpen,
    onClose,
    invoice,
    client,
    onStatusUpdate,
    onDownloadPDF,
    onSendInvoice,
    onRecordPayment,
    sendingInvoiceId
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Invoice Details">
            {invoice && (
                <div className="space-y-6">
                    {/* Header with Status */}
                    <div className="flex justify-between items-start pb-6 border-b border-slate-100 dark:border-slate-700">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                Invoice #{invoice.id.slice(0, 8).toUpperCase()}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Issued on {format(parseISO(invoice.issuedDate), 'MMM d, yyyy')}
                            </p>
                        </div>
                        <InvoiceStatusBadge invoice={invoice} onStatusUpdate={onStatusUpdate} />
                    </div>

                    {/* Content Section: Client & Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client Info */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold border border-slate-200 dark:border-slate-600">
                                    {client?.firstName[0]}{client?.lastName[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{client?.firstName} {client?.lastName}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{client?.companyName}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5"><Mail className="w-3 h-3" /> {client?.email}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {client?.phone}</p>
                                    {client?.properties && client.properties.length > 0 && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-start gap-1.5">
                                            <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                                            <span className="break-words max-w-[180px]">{client.properties[0].address.street}, {client.properties[0].address.city}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Invoice Summary */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Details</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span> <span className="font-medium text-slate-900 dark:text-white">${invoice.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        {invoice.taxLabel || 'Tax'} ({((invoice.taxRate ?? 0) * 100).toFixed(1)}%)
                                    </span>
                                    <span className="font-medium text-slate-900 dark:text-white">${invoice.tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-700 my-2 pt-2 flex justify-between">
                                    <span className="font-bold text-slate-700 dark:text-slate-200">Total</span>
                                    <span className="font-bold text-slate-900 dark:text-white text-lg">${invoice.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Amount Paid</span>
                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">-${(invoice.total - invoice.balanceDue).toFixed(2)}</span>
                                </div>
                                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg flex justify-between items-center border border-slate-200 dark:border-slate-600 mt-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Balance Due</span>
                                    <span className="font-bold text-red-600 dark:text-red-400">${invoice.balanceDue.toFixed(2)}</span>
                                </div>
                                {invoice.receiptId && (
                                    <div className="text-xs text-slate-500">
                                        Receipt: <span className="font-semibold text-slate-700 dark:text-slate-300">{invoice.receiptId}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Hash className="w-4 h-4 text-slate-400" /> Line Items</h3>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-4 py-2 font-medium text-slate-500">Description</th>
                                        <th className="px-4 py-2 font-medium text-slate-500 text-right">Qty</th>
                                        <th className="px-4 py-2 font-medium text-slate-500 text-right">Price</th>
                                        <th className="px-4 py-2 font-medium text-slate-500 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {invoice.items.map((item, idx) => (
                                        <tr key={idx} className="bg-white dark:bg-slate-800">
                                            <td className="px-4 py-2 text-slate-900 dark:text-white">{item.description}</td>
                                            <td className="px-4 py-2 text-slate-500 text-right">{item.quantity}</td>
                                            <td className="px-4 py-2 text-slate-500 text-right">${item.unitPrice.toFixed(2)}</td>
                                            <td className="px-4 py-2 font-medium text-slate-900 dark:text-white text-right">${item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {invoice.milestones && invoice.milestones.length > 0 && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Escrow / Milestones</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {invoice.milestones.map((milestone) => (
                                    <div key={milestone.id} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm">
                                        <div className="font-semibold text-slate-900 dark:text-white">{milestone.label}</div>
                                        <div className="text-xs text-slate-500">${milestone.amount.toFixed(2)}</div>
                                        <div className={`text-[10px] font-bold uppercase ${
                                            milestone.status === 'RELEASED'
                                                ? 'text-emerald-600'
                                                : milestone.status === 'FUNDED'
                                                ? 'text-amber-600'
                                                : 'text-slate-500'
                                        }`}>
                                            {milestone.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {invoice.payments.length > 0 && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment History</h3>
                            <div className="space-y-2">
                                {invoice.payments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between text-sm">
                                        <div className="text-slate-600 dark:text-slate-400">{format(parseISO(payment.date), 'MMM d, yyyy')}</div>
                                        <div className="font-semibold text-slate-900 dark:text-white">${payment.amount.toFixed(2)}</div>
                                        <div className="text-xs text-slate-500">{payment.method}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Footer */}
                    <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Button variant="secondary" className="flex-1 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors" onClick={(e) => onDownloadPDF(e, invoice)}>
                            <Download className="w-4 h-4 mr-2" /> Download PDF
                        </Button>
                        <Button variant="outline" className="flex-1" disabled={sendingInvoiceId === invoice.id || invoice.status === InvoiceStatus.PAID} onClick={(e) => onSendInvoice(e, invoice)}>
                            {sendingInvoiceId === invoice.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Mail className="w-4 h-4 mr-2" /> {invoice.status === InvoiceStatus.SENT ? 'Resend' : 'Email Invoice'}</>}
                        </Button>
                        {invoice.balanceDue > 0 && (
                            <Button className="flex-1" onClick={(e) => onRecordPayment(e, invoice)}>
                                <CreditCard className="w-4 h-4 mr-2" /> Record Payment
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};
