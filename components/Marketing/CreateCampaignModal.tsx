import React, { useState, useEffect } from 'react';
import { X, Loader2, ChevronRight, ChevronLeft, Wand2, Target, Users, Layout, DollarSign, Search, Image as ImageIcon, CheckCircle, BarChart3, Globe, Video, Smartphone, Instagram, Facebook, Youtube } from 'lucide-react';
import { AdCampaign, AdPlatform, AdSubChannel } from '../../types';

interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (campaign: Partial<AdCampaign>) => Promise<void>;
    defaultPlatform?: AdPlatform;
}

const SUB_CHANNELS: Record<AdPlatform, { id: AdSubChannel; label: string; icon: any; desc: string }[]> = {
    META: [
        { id: 'META_MIX', label: 'Advantage+ (All Placements)', icon: Wand2, desc: 'Auto-optimize across FB & IG.' },
        { id: 'META_IG_ALL', label: 'All Instagram', icon: Instagram, desc: 'Feed, Reels, and Stories.' },
        { id: 'META_FB_ALL', label: 'All Facebook', icon: Facebook, desc: 'Feed, Reels, and Stories.' },
        { id: 'META_IG_REELS', label: 'Instagram Reels', icon: Instagram, desc: '9:16 vertical video. Best for engagement.' },
        { id: 'META_IG_FEED', label: 'Instagram Feed', icon: Instagram, desc: 'Square images/video. High visibility.' },
        { id: 'META_IG_STORIES', label: 'Instagram Stories', icon: Instagram, desc: 'Full screen vertical. 24h urgency.' },
        { id: 'META_FB_FEED', label: 'Facebook Feed', icon: Facebook, desc: 'Native feed ads. Broad reach.' },
        { id: 'META_FB_REELS', label: 'Facebook Reels', icon: Facebook, desc: 'Short-form video on Facebook.' },
    ],
    GOOGLE: [
        { id: 'GOOGLE_MIX', label: 'Performance Max', icon: Wand2, desc: 'Auto-mix of Search, Display, YouTube.' },
        { id: 'GOOGLE_SEARCH', label: 'Google Search', icon: Search, desc: 'Text ads on Google search results.' },
        { id: 'YOUTUBE_ADS', label: 'YouTube Ads', icon: Youtube, desc: 'Video ads before/during videos.' },
        { id: 'GOOGLE_LOCAL_SERVICES', label: 'Local Services (LSA)', icon: Target, desc: 'For local service businesses.' },
        { id: 'GOOGLE_DISPLAY', label: 'Display Network', icon: Layout, desc: 'Visual banner ads across websites.' },
        { id: 'GOOGLE_SHOPPING', label: 'Shopping', icon: Layout, desc: 'Product listings on Google.' },
        { id: 'GOOGLE_GMAIL', label: 'Gmail', icon: Layout, desc: 'Ads in Gmail promotions tab.' },
        { id: 'GOOGLE_DISCOVERY', label: 'Discovery', icon: Globe, desc: 'Native ads in Google feeds.' },
    ]
};

const CAMPAIGN_OBJECTIVES = {
    META: [
        { id: 'LEADS', label: 'Leads', desc: 'Instant forms, calls, or signups.' },
        { id: 'TRAFFIC', label: 'Traffic', desc: 'Send people to your website.' },
        { id: 'SALES', label: 'Sales', desc: 'Find people likely to purchase.' },
        { id: 'AWARENESS', label: 'Awareness', desc: 'Reach the maximum number of people.' },
    ],
    GOOGLE: [
        { id: 'LEAD_GEN', label: 'Leads', desc: 'Get conversions and signups.' },
        { id: 'WEB_TRAFFIC', label: 'Website Traffic', desc: 'Get the right people to visit.' },
        { id: 'SALES', label: 'Sales', desc: 'Drive sales online or in-app.' },
        { id: 'LOCAL_VISIT', label: 'Local Visits', desc: 'Drive visits to your shop (GMB).' },
        { id: 'BRAND_AWARENESS', label: 'Awareness', desc: 'Reach a broad audience (YouTube/Display).' },
    ]
};

const STEPS = [
    { id: 1, label: 'Channel', icon: Layout },
    { id: 2, label: 'Targeting', icon: Users },
    { id: 3, label: 'Strategy', icon: Target },
    { id: 4, label: 'Creative', icon: ImageIcon },
    { id: 5, label: 'Review', icon: CheckCircle },
];

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose, onSubmit, defaultPlatform = 'META' }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);

    // FORM STATE
    const [formData, setFormData] = useState<{
        name: string;
        platform: AdPlatform;
        subChannel: AdSubChannel | '';
        status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
        objective: string;
        budget: number;
        startDate: string;
        locations: string[];
        ageRange: [number, number];
        gender: string;
        keywords: string[];
        interests: string[];
        biddingStrategy: string;
        targetCpa: number;
        headlines: string[];
        descriptions: string[];
        primaryText: string;
        finalUrl: string;
        mediaUrl: string;
        videoId?: string;
    }>({
        name: '',
        platform: defaultPlatform,
        subChannel: '',
        status: 'ACTIVE',
        objective: '',
        budget: 50,
        startDate: new Date().toISOString().split('T')[0],
        locations: ['Dallas, TX', 'Fort Worth, TX'],
        ageRange: [25, 55],
        gender: 'ALL',
        keywords: [],
        interests: [],
        biddingStrategy: 'MAXIMIZE_CONVERSIONS',
        targetCpa: 25,
        headlines: [],
        descriptions: [],
        primaryText: '',
        finalUrl: 'https://',
        mediaUrl: '',
        videoId: ''
    });

    useEffect(() => {
        if (isOpen) {
            // Reset to defaults or selected platform
            setFormData(prev => ({ ...prev, platform: defaultPlatform, subChannel: '' }));
            setCurrentStep(1);
        }
    }, [isOpen, defaultPlatform]);

    if (!isOpen) return null;

    // --- AI GENERATORS ---
    const generateCreative = async () => {
        setAiGenerating(true);
        setTimeout(() => {
            const isMeta = formData.platform === 'META';
            const isVideo = formData.subChannel === 'META_IG_REELS' || formData.subChannel === 'META_FB_REELS' || formData.subChannel === 'YOUTUBE_ADS';

            setFormData(prev => ({
                ...prev,
                headlines: isMeta
                    ? ['Premium Mobile Detailing', 'We Come To You', 'Showroom Shine Today']
                    : ['#1 Mobile Detailer in Dallas', 'Ceramic Coating Experts', 'Full Interior Shampoo'],
                primaryText: isMeta
                    ? "Don't let a dirty car ruin your professional image. 🚗✨ Our 5-star mobile detailing crew comes directly to your home or office. Book today and get 20% off your first Platinum Package!"
                    : "",
                descriptions: isMeta
                    ? ['Trusted by 500+ locals.']
                    : ['Licensed & Insured. We come to you. Book online in 60 seconds.'],
                videoId: isVideo ? 'https://youtube.com/watch?v=mock_video_id' : ''
            }));
            setAiGenerating(false);
        }, 1500);
    };

    const generateKeywords = async () => {
        setAiGenerating(true);
        setTimeout(() => {
            setFormData(prev => ({
                ...prev,
                keywords: ['mobile car detailing', 'car wash near me', 'interior car cleaning', 'ceramic coating dallas', 'auto detailing service', 'mobile wash dallas', 'hand wax service']
            }));
            setAiGenerating(false);
        }, 1200);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Failed', error);
        } finally {
            setLoading(false);
        }
    };

    const isSearch = formData.subChannel === 'GOOGLE_SEARCH';
    const isYouTube = formData.subChannel === 'YOUTUBE_ADS';
    const isReels = formData.subChannel === 'META_IG_REELS' || formData.subChannel === 'META_FB_REELS';
    const isDisplay = formData.subChannel === 'GOOGLE_DISPLAY';

    // --- RENDER STEPS ---

    const renderStep1 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Platform Selection */}
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">1. Select Platform</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setFormData(p => ({ ...p, platform: 'META', subChannel: '' }))}
                        className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${formData.platform === 'META' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <div className="p-2 bg-blue-600 rounded-lg text-white"><Layout className="w-6 h-6" /></div>
                        <div className="text-left">
                            <div className="font-bold text-slate-900 dark:text-white">Meta Ads</div>
                            <div className="text-xs text-slate-500">Facebook & Instagram</div>
                        </div>
                    </button>
                    <button
                        onClick={() => setFormData(p => ({ ...p, platform: 'GOOGLE', subChannel: '' }))}
                        className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${formData.platform === 'GOOGLE' ? 'border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <div className="p-2 bg-red-600 rounded-lg text-white"><Search className="w-6 h-6" /></div>
                        <div className="text-left">
                            <div className="font-bold text-slate-900 dark:text-white">Google Ads</div>
                            <div className="text-xs text-slate-500">Search, YouTube, Display</div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Sub-Channel Selection */}
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">2. Select Placement (Sub-Channel)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SUB_CHANNELS[formData.platform].map(sub => (
                        <button
                            key={sub.id}
                            onClick={() => setFormData(p => ({ ...p, subChannel: sub.id }))}
                            className={`p-4 rounded-xl border text-left transition-all ${formData.subChannel === sub.id
                                ? 'border-primary ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/10'
                                : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold ${formData.subChannel === sub.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{sub.label}</span>
                                {React.createElement(sub.icon, { className: "w-4 h-4 text-slate-400" })}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{sub.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Campaign Name & Objective */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!formData.subChannel ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Campaign Name</label>
                    <input
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
                        placeholder="e.g. Summer Promo 2025"
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Objective</label>
                    <select
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
                        value={formData.objective}
                        onChange={e => setFormData(p => ({ ...p, objective: e.target.value }))}
                    >
                        <option value="">Select Objective</option>
                        {CAMPAIGN_OBJECTIVES[formData.platform]
                            .filter(obj => isYouTube ? obj.id !== 'LOCAL_VISIT' : true) // Example filtering
                            .map(obj => (
                                <option key={obj.id} value={obj.id}>{obj.label} - {obj.desc}</option>
                            ))}
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Common Targeting */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Locations</label>
                    <div className="flex flex-wrap gap-2 mb-2 p-2 border rounded-lg bg-slate-50 dark:bg-slate-900 min-h-[42px]">
                        {formData.locations.map(loc => (
                            <span key={loc} className="bg-white dark:bg-slate-800 border px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                                {loc} <button className="hover:text-red-500"><X className="w-3 h-3" /></button>
                            </span>
                        ))}
                        <button className="text-blue-600 text-xs font-bold hover:underline">+ Add</button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Age & Gender</label>
                    <div className="flex gap-2">
                        <select className="px-2 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 w-1/2">
                            <option>25 - 55</option>
                        </select>
                        <select className="px-2 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 w-1/2">
                            <option>All Genders</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Keyword vs Interest Switching */}
            {isSearch || isYouTube ? (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {isYouTube ? 'Video Topics / Keywords' : 'Search Keywords (Required)'}
                        </label>
                        <button onClick={generateKeywords} disabled={aiGenerating} className="text-xs font-bold text-purple-600 flex items-center gap-1">
                            <Wand2 className="w-3 h-3" /> {aiGenerating ? 'Generating...' : 'AI Suggestions'}
                        </button>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 min-h-[120px]">
                        {formData.keywords.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {formData.keywords.map(k => (
                                    <span key={k} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm italic">Enter keywords or use AI to generate...</p>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Detailed Targeting (Interests)</label>
                    <textarea
                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 h-24 text-sm"
                        placeholder="e.g. Home Improvement, Luxury Cars, DIY..."
                    />
                </div>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Daily Budget</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                        <input
                            type="number"
                            className="w-full pl-6 px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white font-bold"
                            value={formData.budget}
                            onChange={(e) => setFormData(p => ({ ...p, budget: parseInt(e.target.value) || 0 }))}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Est. {Math.floor(formData.budget * 0.8)} - {Math.floor(formData.budget * 1.5)} clicks/day</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                    <input
                        type="date"
                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white"
                        value={formData.startDate}
                        onChange={(e) => setFormData(p => ({ ...p, startDate: e.target.value }))}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bidding Strategy</label>
                <select
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white"
                    value={formData.biddingStrategy}
                    onChange={(e) => setFormData(p => ({ ...p, biddingStrategy: e.target.value }))}
                >
                    <option value="MAXIMIZE_CONVERSIONS">Maximize Conversions (Recommended)</option>
                    <option value="TARGET_CPA">Target CPA</option>
                    <option value="MAXIMIZE_CLICKS">Maximize Clicks</option>
                    <option value="TARGET_ROAS">Target ROAS</option>
                </select>
            </div>

            {/* Dynamic insight based on sub-channel */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 text-sm border border-blue-100 dark:border-blue-800">
                <Wand2 className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="text-blue-800 dark:text-blue-300">
                    <span className="font-bold">Pro Tip:</span>
                    {isYouTube ?
                        " For YouTube, 'Maximize Conversions' works best with video creatives > 15s." :
                        isSearch ?
                            " Ensure your daily budget is at least 10x your average keyword CPC for Search." :
                            " Advantage+ placements automatically find the cheapest conversions across Facebook & Instagram."
                    }
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-900 dark:text-white">Ad Creative</h4>
                <button
                    onClick={generateCreative}
                    disabled={aiGenerating}
                    className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-purple-200 transition-colors"
                >
                    {aiGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                    AI Auto-Fill
                </button>
            </div>

            {/* Search Only - No Media */}
            {isSearch ? (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-3">Responsive Search Ad</p>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500">Final URL</label>
                            <input className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800" value={formData.finalUrl} onChange={e => setFormData(p => ({ ...p, finalUrl: e.target.value }))} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500">Headlines (Min 3)</label>
                            <div className="space-y-2 mt-1">
                                {[0, 1, 2].map(i => (
                                    <input
                                        key={i}
                                        placeholder={`Headline ${i + 1}`}
                                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800"
                                        value={formData.headlines[i] || ''}
                                        onChange={e => {
                                            const newH = [...formData.headlines];
                                            newH[i] = e.target.value;
                                            setFormData(p => ({ ...p, headlines: newH }));
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500">Descriptions (Min 2)</label>
                            <div className="space-y-2 mt-1">
                                {[0, 1].map(i => (
                                    <input
                                        key={i}
                                        placeholder={`Description ${i + 1}`}
                                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800"
                                        value={formData.descriptions[i] || ''}
                                        onChange={e => {
                                            const newD = [...formData.descriptions];
                                            newD[i] = e.target.value;
                                            setFormData(p => ({ ...p, descriptions: newD }));
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Visual Ads (Meta / YouTube / Display) */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        {isYouTube ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">YouTube Video URL</label>
                                <div className="flex gap-2">
                                    <input
                                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-sm"
                                        placeholder="https://youtube.com/watch?v=..."
                                        value={formData.videoId}
                                        onChange={e => setFormData(p => ({ ...p, videoId: e.target.value }))}
                                    />
                                    <button className="px-3 bg-red-600 text-white rounded-lg"><Youtube className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Media Upload</label>
                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                                    {isReels ? <Smartphone className="w-8 h-8 text-slate-400 mb-2" /> : <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />}
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                        {isReels ? 'Upload 9:16 Vertical Video' : 'Upload Image or Video'}
                                    </span>
                                    <span className="text-xs text-slate-400 mt-1">
                                        {isReels ? 'Min resolution 1080x1920' : 'JPG, PNG, MP4 supported'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Text</label>
                            <textarea
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-sm h-24"
                                placeholder={isYouTube ? "N/A for instream ads" : "Ad copy text..."}
                                value={formData.primaryText}
                                onChange={e => setFormData(p => ({ ...p, primaryText: e.target.value }))}
                            />
                        </div>
                        {/* YouTube doesn't always need headlines in the same way, but keeping consistent for simplicity */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Headline</label>
                            <input
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-sm font-bold"
                                value={formData.headlines[0] || ''}
                                onChange={e => setFormData(p => ({ ...p, headlines: [e.target.value] }))}
                            />
                        </div>
                    </div>

                    {/* Preview Box */}
                    <div className="bg-slate-100 dark:bg-slate-950 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Ad Preview</p>
                        <div className={`bg-white dark:bg-black rounded-lg shadow-sm overflow-hidden flex flex-col ${isReels ? 'aspect-[9/16] w-48' : 'aspect-video w-full'}`}>
                            {/* Mock Preview Content */}
                            <div className="flex-1 bg-slate-200 dark:bg-slate-800 flex items-center justify-center relative">
                                {isYouTube && <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white"><Youtube className="w-8 h-8" /></div>}
                                {isReels && <span className="text-xs text-slate-500 font-medium">9:16 Video</span>}
                                {!isReels && !isYouTube && <ImageIcon className="w-8 h-8 text-slate-300" />}
                            </div>
                            <div className="p-3">
                                <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                                <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Review Campaign</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">Ready</span>
                </div>

                <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                        <span className="block text-slate-500 text-xs uppercase font-bold">Platform</span>
                        <span className="font-medium text-slate-900 dark:text-white">{formData.platform}</span>
                    </div>
                    <div>
                        <span className="block text-slate-500 text-xs uppercase font-bold">Placement</span>
                        <span className="font-medium text-slate-900 dark:text-white">{SUB_CHANNELS[formData.platform].find(s => s.id === formData.subChannel)?.label}</span>
                    </div>
                    <div>
                        <span className="block text-slate-500 text-xs uppercase font-bold">Budget</span>
                        <span className="font-medium text-slate-900 dark:text-white">${formData.budget}/day</span>
                    </div>
                    <div>
                        <span className="block text-slate-500 text-xs uppercase font-bold">Targeting</span>
                        <span className="font-medium text-slate-900 dark:text-white">{formData.locations[0]} + {formData.locations.length - 1} more</span>
                    </div>
                </div>
            </div>

            {isSearch && formData.keywords.length === 0 && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex gap-2 items-center">
                    <X className="w-4 h-4" />
                    Warning: You haven't selected any keywords for your Search campaign.
                </div>
            )}

            <p className="text-center text-xs text-slate-500">
                By launching, you agree to {formData.platform === 'META' ? 'Meta' : 'Google'} advertising policies.
                <br />Your ads will go into review immediately.
            </p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl h-[650px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg">
                            <Wand2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Campaign Wizard</h3>
                            <p className="text-xs text-slate-500">Step {currentStep}: {STEPS.find(s => s.id === currentStep)?.label}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Steps Sidebar */}
                    <div className="w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-700 p-6 space-y-2 hidden md:block">
                        {STEPS.map(step => (
                            <div key={step.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${currentStep === step.id ? 'bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'opacity-60'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === step.id ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                    {step.id}
                                </div>
                                <span className={`text-sm font-bold ${currentStep === step.id ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{step.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="max-w-2xl mx-auto">
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}
                            {currentStep === 3 && renderStep3()}
                            {currentStep === 4 && renderStep4()}
                            {currentStep === 5 && renderStep5()}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex justify-between">
                    <button
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                        disabled={currentStep === 1}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                        Back
                    </button>
                    {currentStep < 5 ? (
                        <button
                            onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                            disabled={currentStep === 1 && !formData.subChannel} // Block step 1 if no subchannel
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-2.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />} Launch Campaign
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};
