import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../store';
import { useNavigate, useParams } from 'react-router-dom';
import { CampaignStatus, EmailCampaign } from '../types';
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { emailTemplates, emailThemes, generateEmailHtml, EmailTemplate, EmailTheme, EmailContent } from '../data/emailTemplates';

// Extracted Components
import { DesignParameters } from './marketing/campaigns/components/DesignParameters';
import { ContentEditor } from './marketing/campaigns/components/ContentEditor';
import { AudienceSettings } from './marketing/campaigns/components/AudienceSettings';
import { CampaignPreview } from './marketing/campaigns/components/CampaignPreview';
import { TemplatePickerModal } from './marketing/campaigns/components/TemplatePickerModal';
import { ScheduleModal } from './marketing/campaigns/components/ScheduleModal';
import { SendConfirmationModal } from './marketing/campaigns/components/SendConfirmationModal';

export const MarketingCampaignBuilder: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const store = useContext(StoreContext);
    const existingCampaign = id && id !== 'new' ? store?.marketingCampaigns.find((c: any) => c.id === id) : null;

    // State for the new "Form" approach
    const [contentData, setContentData] = useState<EmailContent>({
        headline: '',
        body: '',
        ctaText: 'Book Now',
        ctaLink: '{{booking_link}}',
        imageUrl: ''
    });

    const [selectedTheme, setSelectedTheme] = useState<EmailTheme>(emailThemes[0]);
    const [formData, setFormData] = useState<Partial<EmailCampaign>>(existingCampaign || {
        name: '', subject: '', previewText: '', fromName: 'MasterClean HQ', content: '',
        status: 'DRAFT', audienceId: '', settings: { trackOpens: true, trackClicks: true }
    });

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isSendNowConfirmationOpen, setIsSendNowConfirmationOpen] = useState(false);

    // Unused in new design but kept for potential future use or cleanup
    // const [isRecipientListOpen, setIsRecipientListOpen] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [audienceType, setAudienceType] = useState<'SEGMENT' | 'INDIVIDUAL'>('SEGMENT');
    const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
    const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0); // Kept for default template reference if needed, though modal handles its own index

    if (!store) return null;

    // Generate HTML whenever content or theme changes
    useEffect(() => {
        // We use currentTemplateIndex to grab the *layout* type if we want to stay in sync with what was seemingly selected
        // But really, we should probably track `selectedLayout` separately. 
        // For now, we'll default to 'card' or grab from the first template if index 0.
        // Or better yet, we can pass the actual template object if we stored it.
        // Let's assume 'card' layout for live preview unless we have a better way to track it.
        // Actually, the preview component now handles generation if we pass it params.
        // But we also need to update formData.content for saving.
        const layout = emailTemplates[0].layout; // Default fallback
        const html = generateEmailHtml(contentData, selectedTheme, layout);
        setFormData(prev => ({ ...prev, content: html }));
    }, [contentData, selectedTheme]);

    const handleSave = async (status: CampaignStatus, schedule?: string) => {
        if (!formData.name) {
            alert("Please enter a campaign name");
            return;
        }

        setIsSaving(true);

        let finalAudienceId = formData.audienceId;
        if (audienceType === 'INDIVIDUAL') {
            if (selectedClientIds.length === 0) {
                alert("Please select at least one client.");
                setIsSaving(false);
                return;
            }
            finalAudienceId = null; // No audience ID if using specific IDs
        }

        const campaign: EmailCampaign = {
            id: existingCampaign?.id || crypto.randomUUID(),
            companyId: store.currentUser.companyId,
            name: formData.name || 'Untitled',
            subject: formData.subject || '',
            previewText: formData.previewText,
            fromName: formData.fromName,
            content: formData.content || '',
            status: status,
            audienceId: finalAudienceId || null,
            audienceFilter: !finalAudienceId ? { includedIds: selectedClientIds } : null,
            scheduleTime: schedule,
            settings: formData.settings || { trackOpens: true, trackClicks: true },
            sentCount: existingCampaign?.sentCount || 0,
            openCount: existingCampaign?.openCount || 0,
            clickCount: existingCampaign?.clickCount || 0,
            createdAt: existingCampaign?.createdAt || new Date().toISOString()
        };

        try {
            let res;
            if (existingCampaign) {
                res = await store.updateCampaign(campaign);
            } else {
                res = await store.addCampaign(campaign);
            }

            if (res.error) throw res.error;

            setTimeout(() => {
                navigate('/marketing/campaigns');
            }, 100);
        } catch (error) {
            console.error("Failed to save campaign", error);
            const errorMessage = (error as Error).message || 'Unknown error';
            alert('Failed to save campaign: ' + errorMessage);
            setIsSaving(false);
        }
    };

    const applyTemplate = (template: EmailTemplate) => {
        setContentData(template.defaultContent);
        setFormData(prev => ({ ...prev, subject: template.defaultContent.headline })); // Auto-set subject
        setIsTemplateModalOpen(false);
        // Ideally we should update the 'layout' state here if we were tracking it
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
            {/* Top Bar */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex justify-between items-center shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/marketing/campaigns')} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                    <input
                        type="text"
                        className="bg-transparent text-lg font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                        placeholder="Campaign Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => handleSave('DRAFT')} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Draft
                    </Button>
                    <Button onClick={() => setIsScheduleModalOpen(true)} disabled={isSaving}>
                        <Send className="w-4 h-4 mr-2" />
                        Send / Schedule
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Editor */}
                <div className="w-[450px] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col overflow-y-auto shrink-0 z-10 shadow-xl">
                    <div className="p-6 space-y-8">
                        <DesignParameters
                            selectedTheme={selectedTheme}
                            setSelectedTheme={setSelectedTheme}
                            onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
                        />

                        <hr className="border-slate-100 dark:border-slate-700" />

                        <ContentEditor
                            contentData={contentData}
                            setContentData={setContentData}
                        />

                        <hr className="border-slate-100 dark:border-slate-700" />

                        <AudienceSettings
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                </div>

                {/* Right Panel: Live Preview */}
                <CampaignPreview
                    contentData={contentData}
                    selectedTheme={selectedTheme}
                    currentTemplate={emailTemplates[0]} // Passing default for now, ideally track selected template
                />
            </div>

            {/* Modals */}
            <ScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onSchedule={(date) => {
                    setIsScheduleModalOpen(false);
                    handleSave('SCHEDULED', date);
                }}
                onSendNow={() => {
                    setIsScheduleModalOpen(false);
                    setIsSendNowConfirmationOpen(true);
                }}
                isSaving={isSaving}
            />

            <SendConfirmationModal
                isOpen={isSendNowConfirmationOpen}
                onClose={() => setIsSendNowConfirmationOpen(false)}
                onConfirm={() => handleSave('SENDING', new Date().toISOString())}
                isSaving={isSaving}
            />

            <TemplatePickerModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelectTemplate={applyTemplate}
                selectedTheme={selectedTheme}
            />
        </div>
    );
};