import React from 'react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { Client } from '../../../types';

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    clients: Client[];
    formData: { clientId: string; amount: string; description: string };
    setFormData: React.Dispatch<React.SetStateAction<{ clientId: string; amount: string; description: string }>>;
    onCreate: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
    isOpen,
    onClose,
    clients,
    formData,
    setFormData,
    onCreate
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Invoice" footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={onCreate}>Generate Invoice</Button></>}>
            <div className="space-y-4 p-1">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Client</label>
                    <select className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" value={formData.clientId} onChange={(e) => setFormData(p => ({ ...p, clientId: e.target.value }))}>
                        <option value="">Select Client...</option>
                        {clients.map(c => (<option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Service Description</label>
                    <input value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" placeholder="e.g. Emergency Plumbing Repair" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Amount ($)</label>
                    <input type="number" value={formData.amount} onChange={(e) => setFormData(p => ({ ...p, amount: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
                </div>
            </div>
        </Modal>
    );
};
