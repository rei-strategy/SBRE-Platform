import { Address } from '../types';

const MAPTILER_KEY = '9wOCWt2fKzEDWWAC9p8B';

export const geocodeAddress = async (address: Address): Promise<{ lat: number; lng: number } | null> => {
    try {
        const query = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
        const encodedQuery = encodeURIComponent(query);
        const url = `https://api.maptiler.com/geocoding/${encodedQuery}.json?key=${MAPTILER_KEY}`;

        const response = await fetch(url);
        if (!response.ok) {
            console.error('Geocoding failed:', response.statusText);
            return null;
        }

        const data = await response.json();
        if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            return { lat, lng };
        }

        return null;
    } catch (error) {
        console.error('Error geocoding address:', error);
        return null;
    }
};
