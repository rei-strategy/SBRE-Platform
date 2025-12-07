import React, { useState } from 'react';
import { Modal } from '../../../../components/Modal';
import { Button } from '../../../../components/Button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { emailTemplates, emailThemes, generateEmailHtml, EmailTemplate, EmailTheme } from '../../../../data/emailTemplates';
import { TemplatePreview } from '../../../../components/TemplatePreview';

interface TemplatePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (template: EmailTemplate) => void;
    selectedTheme: EmailTheme;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
    isOpen,
    onClose,
    onSelectTemplate,
    selectedTheme
}) => {
    const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Choose a Template" maxWidth="full">
            <div className="h-[85vh] flex flex-col bg-slate-50 dark:bg-slate-900/50">
                {/* Carousel Container */}
                <div className="flex-1 flex items-center justify-center relative p-0 overflow-hidden">

                    {/* Prev Button */}
                    <button
                        onClick={() => {
                            const newIndex = currentTemplateIndex === 0 ? emailTemplates.length - 1 : currentTemplateIndex - 1;
                            setCurrentTemplateIndex(newIndex);
                        }}
                        className="absolute left-4 z-10 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform text-slate-600 dark:text-slate-300"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Template Card (Active) */}
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden flex flex-col">

                        {/* Preview Area (Full Screen) */}
                        <div className="flex-1 relative w-full h-full overflow-hidden">
                            <div className="absolute inset-0 flex justify-center bg-slate-200/50 dark:bg-black/50 backdrop-blur-sm p-4 md:p-8">
                                {/* Phone/Desktop Frame - Centered */}
                                <div className="h-full w-full max-w-[800px] bg-white shadow-2xl rounded-xl overflow-hidden ring-1 ring-slate-900/5 relative">
                                    <TemplatePreview
                                        html={generateEmailHtml(emailTemplates[currentTemplateIndex].defaultContent, selectedTheme, emailTemplates[currentTemplateIndex].layout)}
                                        scale={1}
                                        className="w-full h-full"
                                        scrollable={true}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Floating Bottom Bar (Info & Action) */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-30">
                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left flex-1">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                            {emailTemplates[currentTemplateIndex].name}
                                        </h2>
                                        <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                            {emailTemplates[currentTemplateIndex].category}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600">
                                            {emailTemplates[currentTemplateIndex].layout} Layout
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {emailTemplates[currentTemplateIndex].description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => onSelectTemplate(emailTemplates[currentTemplateIndex])}
                                    className="whitespace-nowrap px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 flex items-center gap-2"
                                >
                                    <Check className="w-5 h-5" /> Use Template
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => {
                            const newIndex = currentTemplateIndex === emailTemplates.length - 1 ? 0 : currentTemplateIndex + 1;
                            setCurrentTemplateIndex(newIndex);
                        }}
                        className="absolute right-4 z-10 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform text-slate-600 dark:text-slate-300"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                </div>

                {/* Thumbnails (Optional, for quick nav) */}
                <div className="h-24 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex items-center justify-center gap-3 overflow-x-auto">
                    {emailTemplates.map((t, idx) => (
                        <button
                            key={t.id}
                            onClick={() => setCurrentTemplateIndex(idx)}
                            className={`w-12 h-12 rounded-lg border-2 transition-all ${currentTemplateIndex === idx ? 'border-blue-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            title={t.name}
                        >
                            <div className={`w-full h-full rounded bg-gradient-to-br ${idx % 2 === 0 ? 'from-slate-200 to-slate-300' : 'from-blue-100 to-indigo-200'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
