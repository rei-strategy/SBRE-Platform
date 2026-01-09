import React, { useState, useMemo, useEffect } from 'react';
import { Invoice, Client, InvoiceStatus } from '../types';
import { Plus } from 'lucide-react';
import { Button } from '../components/Button';
import { jsPDF } from 'jspdf';

// Extracted Components
import { InvoiceToolbar, InvoiceFilterType } from './invoices/components/InvoiceToolbar';
import { InvoiceTable } from './invoices/components/InvoiceTable';
import { CreateInvoiceModal } from './invoices/components/CreateInvoiceModal';
import { InvoiceDetailModal } from './invoices/components/InvoiceDetailModal';

interface InvoicesProps {
    invoices: Invoice[];
    clients: Client[];
    onCreateInvoice: (invoice: Invoice) => void;
    onUpdateInvoice: (invoice: Invoice) => void;
}

export const Invoices: React.FC<InvoicesProps> = ({ invoices, clients, onCreateInvoice, onUpdateInvoice }) => {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [sendingInvoiceId, setSendingInvoiceId] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<InvoiceFilterType>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'info', direction: 'desc' });
    const [formData, setFormData] = useState({ clientId: '', amount: '250', description: 'Service' });

    // Logic Handlers
    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const client = clients.find(c => c.id === invoice.clientId);
            const searchString = `${invoice.id} ${client?.firstName || ''} ${client?.lastName || ''} ${client?.companyName || ''}`.toLowerCase();
            if (searchTerm && !searchString.includes(searchTerm.toLowerCase())) return false;

            if (activeFilter === 'ALL') return true;
            if (activeFilter === 'PAID') return invoice.status === InvoiceStatus.PAID;
            if (activeFilter === 'OUTSTANDING') return invoice.status === InvoiceStatus.SENT || invoice.status === InvoiceStatus.OVERDUE;
            if (activeFilter === 'OVERDUE') return invoice.status === InvoiceStatus.OVERDUE;
            if (activeFilter === 'DRAFT') return invoice.status === InvoiceStatus.DRAFT;
            return true;
        });
    }, [invoices, clients, activeFilter, searchTerm]);

    const sortedInvoices = useMemo(() => {
        let sortable = [...filteredInvoices];
        sortable.sort((a, b) => {
            const clientA = clients.find(c => c.id === a.clientId);
            const clientB = clients.find(c => c.id === b.clientId);

            let aVal: any, bVal: any;
            switch (sortConfig.key) {
                case 'info': aVal = new Date(a.issuedDate).getTime(); bVal = new Date(b.issuedDate).getTime(); break;
                case 'client': aVal = `${clientA?.firstName} ${clientA?.lastName}`.toLowerCase(); bVal = `${clientB?.firstName} ${clientB?.lastName}`.toLowerCase(); break;
                case 'status':
                    const rank = { [InvoiceStatus.OVERDUE]: 0, [InvoiceStatus.SENT]: 1, [InvoiceStatus.DRAFT]: 2, [InvoiceStatus.PAID]: 3, [InvoiceStatus.BAD_DEBT]: 4 };
                    aVal = rank[a.status]; bVal = rank[b.status]; break;
                case 'amount': aVal = a.total; bVal = b.total; break;
                default: return 0;
            }
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sortable;
    }, [filteredInvoices, sortConfig, clients]);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const handleCreateInvoice = () => {
        if (!formData.clientId) return;
        const client = clients.find(c => c.id === formData.clientId);
        if (!client) return;

        const amount = parseFloat(formData.amount);
        const newInvoice: Invoice = {
            id: crypto.randomUUID(),
            clientId: client.id,
            items: [{ id: crypto.randomUUID(), description: formData.description, quantity: 1, unitPrice: amount, total: amount }],
            subtotal: amount,
            tax: amount * 0.1,
            total: amount * 1.1,
            balanceDue: amount * 1.1,
            status: InvoiceStatus.DRAFT,
            dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
            issuedDate: new Date().toISOString(),
            payments: []
        };

        onCreateInvoice(newInvoice);
        setIsCreateModalOpen(false);
        setFormData({ clientId: '', amount: '250', description: 'Service' });
    };

    const handleSendInvoice = (e: React.MouseEvent, invoice: Invoice) => {
        e.stopPropagation();
        const client = clients.find(c => c.id === invoice.clientId);
        setSendingInvoiceId(invoice.id);
        setTimeout(() => {
            setSendingInvoiceId(null);
            alert(`Invoice sent to ${client ? client.firstName : 'Client'}`);
            if (invoice.status === InvoiceStatus.DRAFT) onUpdateInvoice({ ...invoice, status: InvoiceStatus.SENT });
        }, 1500);
    };

    const handleRecordPayment = (e: React.MouseEvent, invoice: Invoice) => {
        e.stopPropagation();
        const receiptId = invoice.receiptId || `RCT-${invoice.id.slice(0, 6).toUpperCase()}`;
        const paidInvoice: Invoice = {
            ...invoice,
            status: InvoiceStatus.PAID,
            balanceDue: 0,
            receiptId,
            payments: [
                ...invoice.payments,
                {
                    id: crypto.randomUUID(),
                    invoiceId: invoice.id,
                    amount: invoice.balanceDue,
                    method: 'CREDIT_CARD',
                    date: new Date().toISOString()
                }
            ]
        };
        onUpdateInvoice(paidInvoice);
    };

    const handleStatusUpdate = (invoice: Invoice, newStatus: InvoiceStatus) => {
        const updatedInvoice = { ...invoice, status: newStatus };
        if (newStatus === InvoiceStatus.PAID && invoice.balanceDue > 0) {
            updatedInvoice.balanceDue = 0;
            updatedInvoice.payments = [...invoice.payments, { id: crypto.randomUUID(), invoiceId: invoice.id, amount: invoice.balanceDue, method: 'CREDIT_CARD', date: new Date().toISOString() }];
        } else if (newStatus !== InvoiceStatus.PAID && invoice.status === InvoiceStatus.PAID) {
            updatedInvoice.balanceDue = invoice.total;
            updatedInvoice.payments = [];
        }
        onUpdateInvoice(updatedInvoice);
    };

    const handleDownloadPDF = (e: React.MouseEvent | undefined, invoice: Invoice) => {
        if (e) e.stopPropagation();
        try {
            const doc = new jsPDF();
            doc.text(`Invoice ${invoice.id}`, 10, 10);
            doc.save(`Invoice-${invoice.id}.pdf`);
        } catch (error) { console.error("PDF Download failed", error); alert("Failed to download PDF."); }
    };

    return (
        <div className="max-w-7xl mx-auto pb-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Invoices</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track payments, manage billing cycles, and revenue.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-lg shadow-emerald-500/20"><Plus className="w-4 h-4 mr-2" /> Create Invoice</Button>
            </div>

            {/* TABLE SECTION */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <InvoiceToolbar
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <InvoiceTable
                    invoices={sortedInvoices}
                    clients={clients}
                    onRowClick={(inv) => { setSelectedInvoice(inv); setIsDetailOpen(true); }}
                    onStatusUpdate={handleStatusUpdate}
                    onSendInvoice={handleSendInvoice}
                    onRecordPayment={handleRecordPayment}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    sendingInvoiceId={sendingInvoiceId}
                />
            </div>

            {/* MODALS */}
            <CreateInvoiceModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                clients={clients}
                formData={formData}
                setFormData={setFormData}
                onCreate={handleCreateInvoice}
            />

            <InvoiceDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                invoice={selectedInvoice}
                client={selectedInvoice ? clients.find(c => c.id === selectedInvoice.clientId) : undefined}
                onStatusUpdate={handleStatusUpdate}
                onDownloadPDF={handleDownloadPDF}
                onSendInvoice={handleSendInvoice}
                onRecordPayment={handleRecordPayment}
                sendingInvoiceId={sendingInvoiceId}
            />
        </div>
    );
};
