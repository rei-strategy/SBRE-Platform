"use client";

import React, { useEffect, useState, useContext } from 'react';
import { StoreContext } from '../store';
import { calculateDistance } from '../utils/routeOptimization';
import { JobStatus } from '../types';
import { MapPin, Navigation } from 'lucide-react';

const GeofencingWatcher: React.FC = () => {
    const store = useContext(StoreContext);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [prompt, setPrompt] = useState<{ jobId: string; type: 'ARRIVAL' | 'DEPARTURE'; message: string } | null>(null);
    const [ignoredJobIds, setIgnoredJobIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!store?.currentUser || store.currentUser.role !== 'TECHNICIAN') return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ lat: latitude, lng: longitude });
                checkGeofences(latitude, longitude);
            },
            (error) => console.error('Geofencing error:', error),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [store?.currentUser, store?.jobs]);

    const checkGeofences = (lat: number, lng: number) => {
        if (!store?.jobs || !store.currentUser) return;

        const today = new Date();
        const myJobs = store.jobs.filter(job =>
            job.assignedTechIds.includes(store.currentUser.id) &&
            new Date(job.start).toDateString() === today.toDateString() &&
            !ignoredJobIds.has(job.id)
        );

        for (const job of myJobs) {
            // Get Job Location
            const client = store.clients.find(c => c.id === job.clientId);
            const property = client?.properties.find(p => p.id === job.propertyId);

            if (property?.address.lat && property?.address.lng) {
                const distKm = calculateDistance(
                    { lat, lng },
                    { lat: property.address.lat, lng: property.address.lng }
                );
                const distMeters = distKm * 1000;

                // ARRIVAL CHECK (< 200m)
                if (distMeters < 200 && job.status === JobStatus.SCHEDULED) {
                    setPrompt({
                        jobId: job.id,
                        type: 'ARRIVAL',
                        message: `You've arrived at ${client?.name}'s job. Start Job?`
                    });
                    return; // Handle one at a time
                }

                // DEPARTURE CHECK (> 500m)
                if (distMeters > 500 && job.status === JobStatus.IN_PROGRESS) {
                    setPrompt({
                        jobId: job.id,
                        type: 'DEPARTURE',
                        message: `You've left ${client?.name}'s job. Complete Job?`
                    });
                    return;
                }
            }
        }
    };

    const handleAction = () => {
        if (!prompt || !store) return;

        if (prompt.type === 'ARRIVAL') {
            store.updateJobStatus(prompt.jobId, JobStatus.IN_PROGRESS);
            store.clockIn(prompt.jobId);
        } else {
            store.updateJobStatus(prompt.jobId, JobStatus.COMPLETED);
            store.clockOut();
        }

        // Add to ignored so we don't prompt again immediately
        setIgnoredJobIds(prev => new Set(prev).add(prompt.jobId));
        setPrompt(null);
    };

    const handleDismiss = () => {
        if (prompt) {
            setIgnoredJobIds(prev => new Set(prev).add(prompt.jobId));
            setPrompt(null);
        }
    };

    if (!prompt) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-[9999] animate-in slide-in-from-bottom-4">
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${prompt.type === 'ARRIVAL' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    {prompt.type === 'ARRIVAL' ? <MapPin className="w-6 h-6" /> : <Navigation className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">{prompt.type === 'ARRIVAL' ? 'Arrived at Site' : 'Leaving Site'}</h3>
                    <p className="text-sm text-slate-600 mb-3">{prompt.message}</p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAction}
                            className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                        >
                            {prompt.type === 'ARRIVAL' ? 'Start Job' : 'Complete Job'}
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
                        >
                            Ignore
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeofencingWatcher;
