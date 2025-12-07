import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Job, Client } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface JobsMapProps {
    jobs: Job[];
    clients: Client[];
}

// Component to handle map centering
const MapUpdater: React.FC<{ bounds: L.LatLngBoundsExpression | null, center: [number, number] }> = ({ bounds, center }) => {
    const map = useMap();

    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            map.setView(center, 10);
        }
    }, [bounds, center, map]);

    return null;
};

export const JobsMap: React.FC<JobsMapProps> = ({ jobs, clients }) => {
    // Filter jobs with valid locations
    const validJobs = jobs.filter(job => {
        const client = clients.find(c => c.id === job.clientId);
        const property = client?.properties.find(p => p.id === job.propertyId);
        return property?.address.lat && property?.address.lng;
    });

    // Calculate bounds
    let bounds: L.LatLngBoundsExpression | null = null;
    let center: [number, number] = [34.0522, -118.2437]; // Default to LA if no jobs

    if (validJobs.length > 0) {
        const points = validJobs.map(job => {
            const client = clients.find(c => c.id === job.clientId);
            const property = client?.properties.find(p => p.id === job.propertyId);
            return [property!.address.lat, property!.address.lng] as [number, number];
        });

        if (points.length > 0) {
            // Create bounds from points
            const lats = points.map(p => p[0]);
            const lngs = points.map(p => p[1]);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            const minLng = Math.min(...lngs);
            const maxLng = Math.max(...lngs);

            // If only one point or very close points, fitBounds might zoom too much
            if (minLat === maxLat && minLng === maxLng) {
                center = [minLat, minLng];
            } else {
                bounds = [[minLat, minLng], [maxLat, maxLng]];
            }
        }
    }

    // If we only have one job, center on it instead of bounds to avoid crazy zoom
    if (validJobs.length === 1 && validJobs[0]) {
        const client = clients.find(c => c.id === validJobs[0].clientId);
        const property = client?.properties.find(p => p.id === validJobs[0].propertyId);
        if (property?.address.lat && property.address.lng) {
            center = [property.address.lat, property.address.lng];
            bounds = null; // Use setView instead
        }
    }


    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full">
            <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapUpdater bounds={bounds} center={center} />
                {validJobs.map(job => {
                    const client = clients.find(c => c.id === job.clientId);
                    const property = client?.properties.find(p => p.id === job.propertyId);
                    const address = property?.address;

                    if (!address?.lat || !address?.lng) return null;

                    return (
                        <Marker key={job.id} position={[address.lat, address.lng]}>
                            <Popup>
                                <div className="p-1 min-w-[150px]">
                                    <h3 className="font-bold text-sm mb-1">{job.title}</h3>
                                    <p className="text-xs text-slate-600 mb-0.5">{client!.firstName} {client!.lastName}</p>
                                    <p className="text-xs text-slate-500 mb-1 truncate">{address.city}, {address.state}</p>
                                    <p className="text-xs text-emerald-600 font-bold">{new Date(job.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};
