import React, { useState } from 'react';
import { Job, Client, JobStatus } from '../../../types';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { TimePicker } from '../../../components/TimePicker';
import { DatePicker } from '../../../components/DatePicker';

interface CreateJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    clients: Client[];
    onAddJob: (job: Job) => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
    isOpen,
    onClose,
    clients,
    onAddJob
}) => {
    const [formData, setFormData] = useState({
        clientId: '', title: '', description: '', date: '', time: '09:00',
        carYear: '', carMake: '', carModel: '', carColor: '',
        recurring: 'NONE'
    });

    const handleSubmit = () => {
        if (!formData.clientId || !formData.title || !formData.date) {
            alert("Please fill in required fields");
            return;
        }

        const client = clients.find(c => c.id === formData.clientId);
        if (!client) return;

        const start = new Date(`${formData.date}T${formData.time}`);
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

        const newJob: Job = {
            id: crypto.randomUUID(),
            clientId: client.id,
            propertyId: client.properties[0].id,
            assignedTechIds: [],
            title: formData.title,
            description: formData.description,
            start: start.toISOString(),
            end: end.toISOString(),
            status: JobStatus.SCHEDULED,
            pipelineStage: 'SCHEDULED',
            priority: 'MEDIUM',
            vehicleDetails: {
                year: formData.carYear || 'Unknown',
                make: formData.carMake || 'Vehicle',
                model: formData.carModel || '',
                color: formData.carColor || 'N/A',
                type: 'Sedan'
            },
            items: [],
            checklists: [
                { id: crypto.randomUUID(), label: 'Inspect Vehicle', isCompleted: false },
                { id: crypto.randomUUID(), label: 'Perform Service', isCompleted: false }
            ],
            photos: [],
            notes: '',
            recurrence: formData.recurring !== 'NONE' ? { frequency: formData.recurring as any } : undefined
        };

        onAddJob(newJob);
        onClose();
        setFormData({
            clientId: '', title: '', description: '', date: '', time: '09:00',
            carYear: '', carMake: '', carModel: '', carColor: '',
            recurring: 'NONE'
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Job" footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Create Job</Button></>}>
            <div className="space-y-5 p-1">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Client</label>
                    <select className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.clientId} onChange={(e) => setFormData(p => ({ ...p, clientId: e.target.value }))}>
                        <option value="">Select Client...</option>
                        {clients.map(c => (<option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>))}
                    </select>
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Service Title</label><input placeholder="e.g. Full Interior Detail" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Vehicle Details</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Year</label><input placeholder="2023" value={formData.carYear} onChange={(e) => setFormData(p => ({ ...p, carYear: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                        <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Make</label><input placeholder="Toyota" value={formData.carMake} onChange={(e) => setFormData(p => ({ ...p, carMake: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Model</label><input placeholder="Camry" value={formData.carModel} onChange={(e) => setFormData(p => ({ ...p, carModel: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                        <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Color</label><input placeholder="Silver" value={formData.carColor} onChange={(e) => setFormData(p => ({ ...p, carColor: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
                    </div>
                </div>
                <div><label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 h-24 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date</label><DatePicker value={formData.date} onChange={(val) => setFormData(p => ({ ...p, date: val }))} /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Time</label><TimePicker value={formData.time} onChange={(newTime) => setFormData(p => ({ ...p, time: newTime }))} /></div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Recurrence</label>
                    <select className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.recurring} onChange={(e) => setFormData(p => ({ ...p, recurring: e.target.value }))}>
                        <option value="NONE">No Recurrence (One-time)</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="BIWEEKLY">Bi-Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
};
