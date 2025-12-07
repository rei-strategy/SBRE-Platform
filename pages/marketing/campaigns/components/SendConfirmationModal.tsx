import React from 'react';
import { Modal } from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import { Loader2, Send } from 'lucide-react';

interface SendConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isSaving: boolean;
}

export const SendConfirmationModal: React.FC<SendConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isSaving
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirm Send Now" footer={
            <>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} className="bg-emerald-600 text-white" disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />} Yes, Send Immediately
                </Button>
            </>
        }>
            <div className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><Send className="w-6 h-6" /></div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Ready to blast off?</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">This campaign will be sent <strong>immediately</strong>.</p>
            </div>
        </Modal>
    );
};
