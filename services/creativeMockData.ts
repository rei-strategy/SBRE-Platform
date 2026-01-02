import { BrandKit } from '../types';

export const MOCK_BRAND_KIT: BrandKit = {
    id: 'bk-001',
    name: 'SBRE Global Default',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/2917/2917242.png', // Generic car icon
    colors: {
        primary: '#2563EB', // Blue 600
        secondary: '#1E293B', // Slate 800
        accent: '#F59E0B', // Amber 500
        background: '#FFFFFF'
    },
    fonts: {
        heading: 'Inter',
        body: 'Roboto'
    },
    tagline: 'Premium Mobile Detailing at Your Doorstep',
    industry: 'Automotive Services',
    tone: 'Professional'
};

export const MOCK_REELS_CAPTIONS = [
    "✨ Transform your ride today! Book now. #detailing #shiny",
    "POV: Your car generated a brand new shine. 🚗✨ #satisfying",
    "Don't let dirt dull your sparkle. We come to you! 🚛💨",
    "From dusty to dazzling in 60 minutes. ⏱️ #mobiledetailing"
];

export const MOCK_FB_HEADLINES = [
    "Get Showroom Shine at Home",
    "We Come To You - Premium Detailing",
    "Mobile Car Wash & Detail - Book Now",
    "Trusted by 500+ Local Owners"
];

export const MOCK_GENERATED_IMAGES = {
    'LUXURY': [
        'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=600&fit=crop'
    ],
    'MINIMAL': [
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1580273916550-e323be2ebdd9?w=600&h=600&fit=crop'
    ],
    'UGC': [
        'https://images.unsplash.com/photo-1605218427368-35b843343890?w=600&h=600&fit=crop', // Washing a car manually
        'https://images.unsplash.com/photo-1507767355452-944f24317798?w=600&h=600&fit=crop' // Foam cannon
    ]
};
