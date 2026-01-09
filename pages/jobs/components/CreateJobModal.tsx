import React, { useMemo, useState } from 'react';
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
        clientId: '',
        propertyId: '',
        title: '',
        description: '',
        accessNotes: '',
        jobType: '',
        date: '',
        time: '09:00',
        recurring: 'NONE'
    });

    const selectedClient = useMemo(() => {
        return clients.find((c) => c.id === formData.clientId) || null;
    }, [clients, formData.clientId]);

    const handleSubmit = () => {
        if (!formData.clientId || !formData.propertyId || !formData.title || !formData.date) {
            alert("Please fill in required fields");
            return;
        }

        if (!selectedClient) return;

        const start = new Date(`${formData.date}T${formData.time}`);
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

        const notesParts = [];
        if (formData.jobType) notesParts.push(`Job Type: ${formData.jobType}`);
        if (formData.accessNotes) notesParts.push(`Access: ${formData.accessNotes}`);

        const newJob: Job = {
            id: crypto.randomUUID(),
            clientId: selectedClient.id,
            propertyId: formData.propertyId,
            assignedTechIds: [],
            title: formData.title,
            description: formData.description,
            start: start.toISOString(),
            end: end.toISOString(),
            status: JobStatus.SCHEDULED,
            pipelineStage: 'SCHEDULED',
            priority: 'MEDIUM',
            items: [],
            checklists: [
                { id: crypto.randomUUID(), label: 'Confirm access & scope', isCompleted: false },
                { id: crypto.randomUUID(), label: 'Complete work order', isCompleted: false },
                { id: crypto.randomUUID(), label: 'Upload completion photos', isCompleted: false }
            ],
            photos: [],
            notes: notesParts.join(' • '),
            recurrence: formData.recurring !== 'NONE' ? { frequency: formData.recurring as any } : undefined
        };

        onAddJob(newJob);
        onClose();
        setFormData({
            clientId: '',
            propertyId: '',
            title: '',
            description: '',
            accessNotes: '',
            jobType: '',
            date: '',
            time: '09:00',
            recurring: 'NONE'
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Job" footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Create Job</Button></>}>
            <div className="space-y-5 p-1">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Client</label>
                    <select
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={formData.clientId}
                        onChange={(e) => {
                            const nextClientId = e.target.value;
                            const nextClient = clients.find((c) => c.id === nextClientId);
                            setFormData((p) => ({
                                ...p,
                                clientId: nextClientId,
                                propertyId: nextClient?.properties[0]?.id || '',
                            }));
                        }}
                    >
                        <option value="">Select Client...</option>
                        {clients.map(c => (<option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Property / Site</label>
                    <select
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={formData.propertyId}
                        onChange={(e) => setFormData((p) => ({ ...p, propertyId: e.target.value }))}
                        disabled={!selectedClient}
                    >
                        <option value="">Select Property...</option>
                        {(selectedClient?.properties || []).map((property) => (
                            <option key={property.id} value={property.id}>
                                {property.address.street}, {property.address.city}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Service Title</label>
                    <input
                        placeholder="e.g. Unit turnover + make-ready"
                        value={formData.title}
                        onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Type</label>
                        <input
                            placeholder="Turnover, Make-ready, Inspection"
                            value={formData.jobType}
                            onChange={(e) => setFormData(p => ({ ...p, jobType: e.target.value }))}
                            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Access Notes</label>
                        <input
                            placeholder="Gate code, lockbox, concierge"
                            value={formData.accessNotes}
                            onChange={(e) => setFormData(p => ({ ...p, accessNotes: e.target.value }))}
                            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 h-24 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    />
                </div>
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
