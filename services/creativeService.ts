import { BrandKit, CopyGenerationConfig, CopyVariant, GeneratedImage, ImageGenerationConfig } from '../types';
import { MOCK_BRAND_KIT, MOCK_FB_HEADLINES, MOCK_GENERATED_IMAGES, MOCK_REELS_CAPTIONS } from './creativeMockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const CreativeService = {
    getBrandKit: async (): Promise<BrandKit> => {
        await delay(300);
        return MOCK_BRAND_KIT;
    },

    updateBrandKit: async (kit: Partial<BrandKit>): Promise<BrandKit> => {
        await delay(500);
        return { ...MOCK_BRAND_KIT, ...kit };
    },

    /**
     * SIMULATES NANO BANANA PRO IMAGE GENERATION
     */
    generateImages: async (config: ImageGenerationConfig): Promise<GeneratedImage[]> => {
        await delay(2500); // Simulate processing time

        // Select mock images based on style preset
        const styleKey = config.stylePreset.toUpperCase().includes('LUX') ? 'LUXURY' :
            config.stylePreset.toUpperCase().includes('MIN') ? 'MINIMAL' : 'UGC';

        const baseImages = MOCK_GENERATED_IMAGES[styleKey as keyof typeof MOCK_GENERATED_IMAGES] || MOCK_GENERATED_IMAGES['UGC'];

        // Generate a result for each requested format
        return config.formats.map((fmt, idx) => ({
            id: `img-gen-${Date.now()}-${idx}`,
            url: baseImages[idx % baseImages.length], // Cycle through mocks
            format: fmt,
            prompt: config.prompt,
            createdAt: new Date().toISOString()
        }));
    },

    /**
     * SIMULATES ADVANCED COPYWRITER
     */
    generateCopy: async (config: CopyGenerationConfig): Promise<CopyVariant[]> => {
        await delay(1800);

        const variants: CopyVariant[] = [];

        // Simple mock logic to vary contrast based on platform
        if (config.platform.includes('INSTAGRAM')) {
            MOCK_REELS_CAPTIONS.forEach((text, i) => {
                variants.push({
                    id: `copy-${Date.now()}-${i}`,
                    text: text,
                    type: 'CAPTION',
                    score: 90 - (i * 5),
                    tags: ['Engaging', 'Short']
                });
            });
        } else {
            MOCK_FB_HEADLINES.forEach((text, i) => {
                variants.push({
                    id: `copy-${Date.now()}-${i}`,
                    text: text,
                    type: 'HEADLINE',
                    score: 95 - (i * 3),
                    tags: ['Direct Response', 'Clear']
                });
            });
            // Add some body text too
            variants.push({
                id: `copy-body-${Date.now()}`,
                text: `Experience the ultimate convenience with ${MOCK_BRAND_KIT.name}. We bring the shine to you, so you can focus on what matters. Book your slot today!`,
                type: 'PRIMARY_TEXT',
                score: 88,
                tags: ['Benefit-Driven']
            });
        }

        return variants;
    }
};
