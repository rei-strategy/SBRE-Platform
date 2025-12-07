import { MOCK_CAMPAIGNS, MOCK_AD_SETS, MOCK_ADS, MOCK_ATTRIBUTION, MOCK_ATTRIBUTION_INSIGHTS, MOCK_CHANNEL_CONFIGS } from './adsMockData';
import { AdCampaign, AdSet, Ad, AttributionRecord } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory state for the session (Working Demo)
let currentCampaigns = [...MOCK_CAMPAIGNS];

export const AdsService = {
    getDashboardStats: async () => {
        await delay(600);
        const totalSpend = currentCampaigns.reduce((acc, c) => acc + c.spend, 0);
        const totalImpressions = currentCampaigns.reduce((acc, c) => acc + c.impressions, 0);
        const totalClicks = currentCampaigns.reduce((acc, c) => acc + c.clicks, 0);
        const totalConversions = currentCampaigns.reduce((acc, c) => acc + c.conversions, 0);

        return {
            spend: totalSpend,
            impressions: totalImpressions,
            clicks: totalClicks,
            conversions: totalConversions,
            cpc: totalClicks > 0 ? totalSpend / totalClicks : 0,
            roi: 3.5 // blended static for now, or calc dynamic if needed
        };
    },

    getCampaigns: async (): Promise<AdCampaign[]> => {
        await delay(500);
        return [...currentCampaigns];
    },

    createCampaign: async (campaign: Partial<AdCampaign>): Promise<AdCampaign> => {
        await delay(800);
        const newCampaign: AdCampaign = {
            id: `cid_${Date.now()}`,
            name: campaign.name || 'New Campaign',
            platform: campaign.platform || 'META',
            status: campaign.status || 'DRAFT',
            budget: campaign.budget || 500,
            spend: 0,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            roi: 0,
            startDate: new Date().toISOString(),
            ...campaign
        };
        currentCampaigns.unshift(newCampaign);
        return newCampaign;
    },

    getAdSets: async (campaignId: string): Promise<AdSet[]> => {
        await delay(400);
        return MOCK_AD_SETS.filter(s => s.campaignId === campaignId);
    },

    getAds: async (adSetId: string): Promise<Ad[]> => {
        await delay(400);
        return MOCK_ADS.filter(a => a.adSetId === adSetId);
    },

    getAttribution: async (): Promise<AttributionRecord[]> => {
        await delay(700);
        return [...MOCK_ATTRIBUTION];
    },

    getAttributionKPIs: async () => {
        await delay(500);
        return {
            totalLeads: 515,
            totalJobs: 173,
            totalRevenue: 54850,
            cac: 42.50, // Simplified avg
            avgJobValue: 317,
            roas: 5.1,
            assistedConversions: 192,
            avgTouchpoints: 3.8,
            timeToConversion: 14 // days
        };
    },

    getCustomerJourneys: async () => {
        await delay(600);
        return [
            { id: 'j1', path: ['Instagram Reels', 'Google Search', 'Direct'], conversions: 45, revenue: 12500, avgDays: 12 },
            { id: 'j2', path: ['YouTube Ads', 'Google Search', 'Booking'], conversions: 38, revenue: 14200, avgDays: 3 },
            { id: 'j3', path: ['Facebook Feed', 'Instagram Reels', 'Search'], conversions: 25, revenue: 6800, avgDays: 7 },
            { id: 'j4', path: ['Organic Search', 'Referral', 'YouTube Ads'], conversions: 18, revenue: 5400, avgDays: 21 },
            { id: 'j5', path: ['Direct', 'Google Maps'], conversions: 15, revenue: 3200, avgDays: 1 }
        ];
    },

    getAttributionInsights: async () => {
        await delay(550);
        return [
            { id: 'ai1', type: 'OPPORTUNITY', message: 'Instagram Reels initiates 42% of all multi-touch journeys, making it your key awareness driver.', impact: 'HIGH' },
            { id: 'ai2', type: 'WARNING', message: 'Google Display has a high spend but appears in < 5% of converting paths. Consider pausing.', impact: 'MED' },
            { id: 'ai3', type: 'INFO', message: 'YouTube Ads produce the highest Average Order Value (AOV) paths ($450 avg job size).', impact: 'LOW' }
        ];
    },

    // AI MOCK GENERATORS
    generateImage: async (prompt: string): Promise<string> => {
        await delay(2500); // AI takes time
        // Return random unsplash image based on keywords in prompt (simulated)
        if (prompt.toLowerCase().includes('truck')) return 'https://images.unsplash.com/photo-1605218427368-35b843343890?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
        if (prompt.toLowerCase().includes('interior')) return 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
        return 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; // Default detail shot
    },

    generateCopy: async (productName: string): Promise<{ headline: string, primaryText: string }> => {
        await delay(1500);
        return {
            headline: `Professional Detailing for ${productName}`,
            primaryText: `Restore the showroom shine of your ${productName}. Book now and get 20% off your first premium package. We come to you!`
        };
    },

    // ADVANCED ANALYTICS (MOCK)
    getAIInsights: async () => {
        await delay(600);
        return [
            { id: 1, type: 'OPPORTUNITY', text: 'Shift $300 from Facebook Feed to Instagram Reels — Reels drives 2.4x more first-touch conversions.', impact: 'HIGH' },
            { id: 2, type: 'WARNING', text: 'Google Search has the highest close rate (65%); decrease idle spend on Display Network.', impact: 'MEDIUM' },
            { id: 3, type: 'SUCCESS', text: 'YouTube Video ads are outperforming generic Facebook Image ads by 30% in CTR.', impact: 'POSITIVE' }
        ];
    },

    getTrendData: async (range: string) => {
        await delay(400);
        // Mock 30 days data
        return Array.from({ length: 14 }).map((_, i) => ({
            date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            spend: Math.floor(Math.random() * 500) + 200,
            conversions: Math.floor(Math.random() * 20) + 5,
            metaSpend: Math.floor(Math.random() * 300) + 100,
            googleSpend: Math.floor(Math.random() * 200) + 100,
            // Sub-Channel Mock Data
            reelsSpend: Math.floor(Math.random() * 150) + 50,
            searchSpend: Math.floor(Math.random() * 100) + 40,
            youtubeSpend: Math.floor(Math.random() * 80) + 20,
            displaySpend: Math.floor(Math.random() * 50) + 10,
            feedSpend: Math.floor(Math.random() * 100) + 30,
            roas: (Math.random() * 2 + 2).toFixed(1)
        }));
    },

    getAnomalies: async () => {
        await delay(300);
        return [
            { id: 1, metric: 'CPC', change: '+25%', platform: 'GOOGLE', items: ['Search - "Mobile Detailers"'] }
        ];
    },

    getChannelConfig: async (subChannelId: string): Promise<any> => {
        await delay(300);
        return MOCK_CHANNEL_CONFIGS[subChannelId] || null;
    }
};
