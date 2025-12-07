import React from 'react';
import { Type } from 'lucide-react';
import { EmailContent } from '../../../../data/emailTemplates';
import { RichTextEditor } from '../../../../components/RichTextEditor';

interface ContentEditorProps {
    contentData: EmailContent;
    setContentData: (data: EmailContent) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
    contentData,
    setContentData
}) => {
    return (
        <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Type className="w-3 h-3" /> Content
            </h3>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Headline</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={contentData.headline}
                    onChange={e => setContentData({ ...contentData, headline: e.target.value })}
                    placeholder="e.g. Big Summer Sale!"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero Image URL (Optional)</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={contentData.imageUrl || ''}
                    onChange={e => setContentData({ ...contentData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-slate-400 mt-1">Paste a link to your logo or a banner image.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message Body</label>
                <RichTextEditor
                    value={contentData.body}
                    onChange={html => setContentData({ ...contentData, body: html })}
                    placeholder="Write your message here..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Button Text</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={contentData.ctaText}
                        onChange={e => setContentData({ ...contentData, ctaText: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Button Link</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={contentData.ctaLink}
                        onChange={e => setContentData({ ...contentData, ctaLink: e.target.value })}
                    />
                </div>
            </div>
        </section>
    );
};
