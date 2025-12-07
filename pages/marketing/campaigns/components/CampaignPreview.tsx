import React, { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { TemplatePreview } from '../../../../components/TemplatePreview';
import { generateEmailHtml, EmailContent, EmailTheme, EmailTemplate } from '../../../../data/emailTemplates';

interface CampaignPreviewProps {
    contentData: EmailContent;
    selectedTheme: EmailTheme;
    currentTemplate: EmailTemplate; // Needed for layout
}

export const CampaignPreview: React.FC<CampaignPreviewProps> = ({
    contentData,
    selectedTheme,
    currentTemplate
}) => {
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    return (
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative flex flex-col items-center justify-center p-8">
            {/* Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 p-1 flex gap-1 z-20">
                <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded-full transition-colors ${previewMode === 'desktop' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Desktop View"
                >
                    <Monitor className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded-full transition-colors ${previewMode === 'mobile' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Mobile View"
                >
                    <Smartphone className="w-4 h-4" />
                </button>
            </div>

            {/* Preview Container */}
            <div
                className={`bg-white shadow-2xl transition-all duration-500 ease-in-out overflow-hidden ${previewMode === 'mobile'
                    ? 'w-[375px] h-[667px] rounded-[3rem] border-[8px] border-slate-900'
                    : 'w-[800px] h-[600px] rounded-lg border border-slate-200'
                    }`}
            >
                <TemplatePreview
                    html={generateEmailHtml(contentData, selectedTheme, currentTemplate?.layout || 'card')}
                    scale={1}
                    className="w-full h-full"
                    scrollable={true}
                />
            </div>
            <p className="mt-4 text-sm text-slate-400 font-medium">Live Preview • {previewMode === 'desktop' ? 'Desktop' : 'iPhone SE'}</p>
        </div>
    );
};
