import React from 'react';

interface LiveEmailPreviewProps {
    toType: string;
    customEmail?: string;
    subject: string;
    content: string;
}

export const LiveEmailPreview: React.FC<LiveEmailPreviewProps> = ({
    toType,
    customEmail,
    subject,
    content
}) => {
    return (
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Live Preview</h4>
            <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 space-y-2">
                    <div className="flex">
                        <span className="text-xs text-slate-500 w-16">To:</span>
                        <span className="text-xs text-slate-900 dark:text-white font-medium">{toType === 'custom' ? customEmail : 'John Doe <john@example.com>'}</span>
                    </div>
                    <div className="flex">
                        <span className="text-xs text-slate-500 w-16">Subject:</span>
                        <span className="text-xs text-slate-900 dark:text-white font-medium">
                            {subject
                                .replace(/{{client.first_name}}/g, 'John')
                                .replace(/{{client.last_name}}/g, 'Doe')
                                .replace(/{{technician.name}}/g, 'Mike Smith')
                                .replace(/{{job.service_name}}/g, 'HVAC Maintenance')
                                .replace(/{{job.date}}/g, 'Oct 12, 2023')
                                .replace(/{{company.name}}/g, 'Acme Services')
                                || '(No Subject)'}
                        </span>
                    </div>
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {content
                        .replace(/{{client.first_name}}/g, 'John')
                        .replace(/{{client.last_name}}/g, 'Doe')
                        .replace(/{{technician.name}}/g, 'Mike Smith')
                        .replace(/{{job.service_name}}/g, 'HVAC Maintenance')
                        .replace(/{{job.date}}/g, 'Oct 12, 2023')
                        .replace(/{{quote.link}}/g, 'https://acme.com/q/123')
                        .replace(/{{invoice.link}}/g, 'https://acme.com/i/456')
                        .replace(/{{company.name}}/g, 'Acme Services')
                        || '(No Content)'}
                </div>
            </div>
        </div>
    );
};
