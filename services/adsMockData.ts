import { AdCampaign, AdSet, Ad, AttributionRecord } from '../types';

export const MOCK_CAMPAIGNS: AdCampaign[] = [
    {
        id: 'camp-001',
        platform: 'META',
        subChannel: 'META_IG_REELS',
        name: 'Spring Retargeting (Local)',
        status: 'ACTIVE',
        budget: 500,
        spend: 342.50,
        impressions: 12500,
        clicks: 450,
        conversions: 28,
        roi: 4.2,
        startDate: '2025-05-01',
        cpc: 2.15,
        ctr: 1.85,
        costPerLead: 12.23,
        frequency: 1.4,
        relevanceScore: 8,
        details: { target: 'Local 25mi', creative: 'Spring Promo' }
    },
    {
        id: 'camp-002',
        platform: 'GOOGLE',
        subChannel: 'GOOGLE_SEARCH',
        name: 'Search - "Mobile Detailers near me"',
        status: 'ACTIVE',
        budget: 1200,
        spend: 890.15,
        impressions: 5400,
        clicks: 310,
        conversions: 45,
        roi: 3.8,
        startDate: '2025-04-15',
        cpc: 2.87,
        ctr: 5.74,
        costPerLead: 19.78,
        qualityScore: 9,
        details: { keywords: 'mobile detailing, car wash', strategy: 'Max Clicks' }
    },
    {
        id: 'camp-003',
        platform: 'GOOGLE',
        subChannel: 'GOOGLE_LOCAL_SERVICES',
        name: 'Local Services Ads (LSA)',
        status: 'ACTIVE',
        budget: 600,
        spend: 450.00,
        impressions: 1200,
        clicks: 180,
        conversions: 60,
        roi: 5.2,
        startDate: '2025-05-15',
        cpc: 2.50,
        ctr: 15.0,
        costPerLead: 7.50,
        details: { serviceArea: 'Downtown + 10mi' }
    },
    {
        id: 'camp-004',
        platform: 'META',
        subChannel: 'META_MIX',
        name: 'Brand Awareness (IG+FB)',
        status: 'PAUSED',
        budget: 300,
        spend: 280.00,
        impressions: 25000,
        clicks: 150,
        conversions: 5,
        roi: 1.2,
        startDate: '2025-04-01',
        cpc: 1.87,
        ctr: 0.6,
        costPerLead: 56.00,
        frequency: 2.1,
        details: { placement: 'Auto-Placement' }
    },
    {
        id: 'camp-005',
        platform: 'META',
        subChannel: 'META_FB_FEED',
        name: 'Brand Awareness - Top Funnel',
        status: 'PAUSED',
        budget: 300,
        spend: 150.00,
        impressions: 8000,
        clicks: 120,
        conversions: 5,
        roi: 1.5,
        startDate: '2025-03-01',
        endDate: '2025-03-31',
        cpc: 1.25,
        ctr: 1.50,
        costPerLead: 30.00,
        frequency: 2.1,
        relevanceScore: 6
    },
    {
        id: 'camp-004',
        platform: 'GOOGLE',
        subChannel: 'YOUTUBE_ADS',
        name: 'Video - "Before & After" Showreel',
        status: 'ACTIVE',
        budget: 600,
        spend: 420.50,
        impressions: 25000,
        clicks: 300,
        conversions: 12,
        roi: 2.1,
        startDate: '2025-05-10',
        cpc: 1.40,
        ctr: 1.20,
        costPerLead: 35.04,
        qualityScore: 8,
        details: { videoId: 'yt-123', strategy: 'Max Conversions' }
    }
];

export const MOCK_CHANNEL_CONFIGS: Record<string, any> = {
    // --- META ---
    'META_FB_FEED': {
        id: 'META_FB_FEED',
        label: 'Facebook Feed',
        education: {
            title: 'Facebook Feed',
            description: 'The core detailed scrolling experience. Ideal for storytelling, direct response, and retargeting.',
            bestFor: ['Direct Response Sales', 'Retargeting', 'Long-form copy'],
            creativeRequirements: ['Single Image', 'Carousel', 'Video (4:5 or 1:1)'],
            technicalSpecs: ['1080x1080 or 1080x1350', 'Primary Text: 125 chars', 'Headline: 40 chars'],
            proTip: "Use square (1:1) video to occupy more screen real estate on mobile."
        },
        kpis: [
            { label: 'Spend', value: '$840.50', trend: 'up', trendValue: '12%', color: 'blue' },
            { label: 'ROAS', value: '3.8x', trend: 'up', trendValue: '0.2x', color: 'green' },
            { label: 'CTR', value: '1.2%', trend: 'down', trendValue: '0.1%', color: 'yellow' },
            { label: 'CPM', value: '$18.40', trend: 'up', trendValue: '$1.20', color: 'red' },
        ],
        // ... mocked for brevity, utilizing components to render
        aiInsights: [
            { type: 'OPPORTUNITY', text: 'Carousel ads are driving 20% lower CPA than single image. Shift budget.', impact: '-$5 CPA' },
            { type: 'WARNING', text: 'Frequency is reaching 2.8. Creative fatigue likely.', impact: 'CTR dropping' }
        ]
    },
    'META_IG_REELS': {
        id: 'META_IG_REELS',
        label: 'Instagram Reels',
        education: {
            title: 'Instagram Reels',
            description: 'Full-screen vertical video content. Best for brand awareness, engagement, and younger demographics.',
            bestFor: ['Brand Awareness', 'Engagement', 'Influencer Content'],
            creativeRequirements: ['Vertical Video (9:16)', 'Sound On'],
            technicalSpecs: ['1080x1920', 'Max 60s (15s recommended)', 'Safe zones for UI'],
            proTip: "Make the first 3 seconds count. 'Thumb-stop' rate is your most important metric."
        },
        kpis: [
            { label: 'Spend', value: '$1,250.00', trend: 'up', trendValue: '45%', color: 'pink' },
            { label: 'ROAS', value: '4.5x', trend: 'up', trendValue: '1.5x', color: 'green' },
            { label: 'Thumb-Stop', value: '35%', trend: 'up', trendValue: '5%', color: 'purple' },
            { label: 'CPM', value: '$12.50', trend: 'down', trendValue: '$2.00', color: 'blue' },
        ],
        aiInsights: [
            { type: 'SUCCESS', text: 'Reels creative #4 "UGC Testimonial" has a 45% thumb-stop rate.', impact: 'High Engagement' },
        ]
    },
    'GOOGLE_SEARCH': {
        id: 'GOOGLE_SEARCH',
        label: 'Google Search',
        education: {
            title: 'Google Search',
            description: 'Capture high-intent traffic when users are actively looking for your solution.',
            bestFor: ['High Intent Leads', 'Bottom of Funnel', 'Local Service'],
            creativeRequirements: ['Text Ads', 'Keywords', 'Extensions'],
            technicalSpecs: ['Headline: 30 chars', 'Desc: 90 chars', 'Sitelinks suggested'],
            proTip: "Focus on negative keywords to filter out unqualified traffic (e.g. 'free', 'jobs')."
        },
        kpis: [
            { label: 'Spend', value: '$2,100.00', trend: 'up', trendValue: '5%', color: 'blue' },
            { label: 'ROAS', value: '5.2x', trend: 'down', trendValue: '0.1x', color: 'green' },
            { label: 'Imp. Share', value: '65%', trend: 'up', trendValue: '2%', color: 'orange' },
            { label: 'Avg CPC', value: '$4.50', trend: 'up', trendValue: '$0.20', color: 'red' },
        ],
        aiInsights: [
            { type: 'WARNING', text: 'Quality Score for "Luxury Detailing" dropped to 5/10. Landing page needs relevance.', impact: 'Higher CPC' },
        ],
        keywords: [
            { term: 'mobile detailing dallas', clicks: 145, ctr: '12%', cpc: '$3.50', score: 9 },
            { term: 'car wash near me', clicks: 850, ctr: '4%', cpc: '$1.20', score: 7 },
        ]
    },
    'YOUTUBE_ADS': {
        id: 'YOUTUBE_ADS',
        label: 'YouTube Ads',
        education: {
            title: 'YouTube Ads',
            description: 'Video storytelling before, during, or after content. Great for brand building and complex explanations.',
            bestFor: ['Brand Awareness', 'Education', 'Retargeting'],
            creativeRequirements: ['Horizontal Video (16:9)', 'Skippable/Non-Skippable'],
            technicalSpecs: ['1920x1080', 'CTA Overlay'],
            proTip: "Front-load your brand and problem statement in the first 5 seconds before the Skip button appears."
        },
        kpis: [
            { label: 'Spend', value: '$650.00', trend: 'up', trendValue: '10%', color: 'red' },
            { label: 'View Rate', value: '42%', trend: 'up', trendValue: '3%', color: 'purple' },
            { label: 'CPV', value: '$0.04', trend: 'flat', trendValue: '0%', color: 'blue' },
            { label: 'Conv. Rate', value: '0.8%', trend: 'up', trendValue: '0.1%', color: 'green' },
        ],
        aiInsights: [
            { type: 'OPPORTUNITY', text: 'Viewers who watch >30s convert at 3x the rate. Retarget them on Display.', impact: 'Audience Segment' },
        ],
        retentionCurve: [
            { time: '0s', pct: 100 }, { time: '5s', pct: 85 }, { time: '15s', pct: 60 }, { time: '30s', pct: 45 }, { time: '60s', pct: 25 }
        ]
    }
};

export const MOCK_ATTRIBUTION: AttributionRecord[] = [
    {
        id: 'attr-001',
        source: 'Instagram Reels',
        subChannel: 'META_IG_REELS',
        platform: 'META',
        leadsCount: 145,
        jobsBooked: 28,
        revenue: 9450,
        costPerLead: 11.50,
        costPerAcquisition: 72.00,
        spend: 2100,
        assistedConversions: 55,
        roi: 4.5,
        avgTouchpoints: 4.5
    },
    {
        id: 'attr-002',
        source: 'Google Search',
        subChannel: 'GOOGLE_SEARCH',
        platform: 'GOOGLE',
        leadsCount: 110,
        jobsBooked: 35,
        revenue: 14200,
        costPerLead: 21.50,
        costPerAcquisition: 68.00,
        spend: 2400,
        assistedConversions: 40,
        roi: 5.9,
        avgTouchpoints: 2.5
    },
    {
        id: 'attr-003',
        source: 'Facebook Feed',
        subChannel: 'META_FB_FEED',
        platform: 'META',
        leadsCount: 65,
        jobsBooked: 10,
        revenue: 3000,
        costPerLead: 14.80,
        costPerAcquisition: 95.00,
        spend: 1100,
        assistedConversions: 25,
        roi: 2.7,
        avgTouchpoints: 3.8
    },
    {
        id: 'attr-004',
        source: 'YouTube Ads',
        subChannel: 'YOUTUBE_ADS',
        platform: 'GOOGLE',
        leadsCount: 40,
        jobsBooked: 10,
        revenue: 4700,
        costPerLead: 18.20,
        costPerAcquisition: 85.00,
        spend: 550,
        assistedConversions: 45,
        roi: 8.5,
        avgTouchpoints: 5.2
    },
    {
        id: 'attr-005',
        source: 'Organic Search',
        platform: 'ORGANIC',
        leadsCount: 85,
        jobsBooked: 40,
        revenue: 11200,
        costPerLead: 0,
        costPerAcquisition: 0,
        spend: 0,
        assistedConversions: 60,
        roi: 0,
        avgTouchpoints: 5.5
    },
    {
        id: 'attr-006',
        source: 'Direct',
        platform: 'DIRECT',
        leadsCount: 45,
        jobsBooked: 30,
        revenue: 6500,
        costPerLead: 0,
        costPerAcquisition: 0,
        spend: 0,
        assistedConversions: 15,
        roi: 0,
        avgTouchpoints: 1.5
    }
];

export const MOCK_AD_SETS: AdSet[] = [
    { id: 'as1', campaignId: 'camp-001', name: 'Spring Promo - Local 25mi', status: 'ACTIVE', targeting: 'Dallas + 25mi, 25-54' },
    { id: 'as2', campaignId: 'camp-002', name: 'Search Keywords - High Intent', status: 'ACTIVE', targeting: 'Keywords: detailer, car wash' }
];

export const MOCK_ADS: Ad[] = [
    { id: 'ad1', adSetId: 'as1', name: 'Video - Muddy Truck', status: 'ACTIVE', creativeUrl: 'https://example.com/vid1.mp4', clicks: 250, ctr: 2.1, cpc: 1.5 },
    { id: 'ad2', adSetId: 'as2', name: 'Text - Fast Service', status: 'ACTIVE', headline: 'We Come To You', clicks: 150, ctr: 4.5, cpc: 2.8 }
];

export const MOCK_ATTRIBUTION_INSIGHTS = [
    {
        id: '1',
        type: 'OPPORTUNITY',
        message: 'Instagram Reels initiates 42% of high-value conversions. Consider increasing top-of-funnel budget here.',
        impact: '+15% ROAS',
        source: 'META'
    },
    {
        id: '2',
        type: 'WARNING',
        message: 'Google Display has a high click-through but low conversion. Verify placement quality.',
        impact: 'Wasted Spend',
        source: 'GOOGLE'
    },
    {
        id: '3',
        type: 'INFO',
        message: 'Organic Search is the primary closer for users who first saw a YouTube Ad.',
        impact: 'Cross-channel',
        source: 'ORGANIC'
    }
];
