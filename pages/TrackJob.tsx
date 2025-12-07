"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Loader, MapPin, Navigation, User as UserIcon } from 'lucide-react';
import { techIcon } from '../utils/mapIcons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Icon issues
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TrackingData {
    job: {
        title: string;
        status: string;
        start: string;
        end: string;
        location: { lat: number; lng: number; address: string } | null;
    };
    tech: {
        name: string;
        avatarUrl: string;
        location: { lat: number; lng: number } | null;
    } | null;
}

const TrackJob: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [data, setData] = useState<TrackingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTrackingInfo = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-tracking-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({ token })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to fetch tracking info');
            }

            const result = await response.json();
            setData(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrackingInfo();
        const interval = setInterval(fetchTrackingInfo, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Tracking Unavailable</h1>
                    <p className="text-slate-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { job, tech } = data;
    const center: [number, number] = job.location ? [job.location.lat, job.location.lng] : [33.5779, -101.8552];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-4 shadow-sm z-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">{job.title}</h1>
                        <p className="text-sm text-slate-500">
                            {new Date(job.start).toLocaleDateString()} • {new Date(job.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                            job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-blue-100 text-blue-700'
                        }`}>
                        {job.status.replace('_', ' ')}
                    </div>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=9wOCWt2fKzEDWWAC9p8B`}
                        attribution='&copy; MapTiler'
                    />

                    {/* Job Location */}
                    {job.location && (
                        <Marker position={[job.location.lat, job.location.lng]}>
                            <Popup>
                                <div className="font-bold">{job.title}</div>
                                <div className="text-xs text-slate-500">{job.location.address}</div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Tech Location */}
                    {tech && tech.location && (
                        <Marker position={[tech.location.lat, tech.location.lng]} icon={techIcon}>
                            <Popup>
                                <div className="flex items-center gap-2">
                                    <img src={tech.avatarUrl} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <div className="font-bold">{tech.name}</div>
                                        <div className="text-xs text-emerald-600 font-bold">On My Way</div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* Tech Card Overlay */}
                {tech && (
                    <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 bg-white p-4 rounded-xl shadow-xl border border-slate-200 z-[1000]">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img src={tech.avatarUrl} alt={tech.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white bg-emerald-500"></div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">Your Technician</p>
                                <h3 className="font-bold text-slate-900 text-lg">{tech.name}</h3>
                                {tech.location ? (
                                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mt-1">
                                        <Navigation className="w-3 h-3" />
                                        <span>En Route</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mt-1">
                                        <UserIcon className="w-3 h-3" />
                                        <span>Assigned</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackJob;
