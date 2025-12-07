import { Job } from '../types';

interface Location {
    lat: number;
    lng: number;
}

export interface JobWithLocation extends Job {
    location: Location;
}

export const calculateDistance = (loc1: Location, loc2: Location): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(loc2.lat - loc1.lat);
    const dLng = deg2rad(loc2.lng - loc1.lng);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(loc1.lat)) * Math.cos(deg2rad(loc2.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
};

export const optimizeRoute = (startLocation: Location, jobs: JobWithLocation[]): JobWithLocation[] => {
    if (jobs.length === 0) return [];

    const optimized: JobWithLocation[] = [];
    const remaining = [...jobs];
    let currentLocation = startLocation;

    while (remaining.length > 0) {
        let nearestIndex = -1;
        let minDistance = Infinity;

        for (let i = 0; i < remaining.length; i++) {
            const dist = calculateDistance(currentLocation, remaining[i].location);
            if (dist < minDistance) {
                minDistance = dist;
                nearestIndex = i;
            }
        }

        if (nearestIndex !== -1) {
            const nearestJob = remaining[nearestIndex];
            optimized.push(nearestJob);
            currentLocation = nearestJob.location;
            remaining.splice(nearestIndex, 1);
        } else {
            break;
        }
    }

    return optimized;
};
