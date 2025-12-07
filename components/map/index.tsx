"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Job, User, Client, TimeEntry, Invoice } from '../../types';
import { MapProvider, useMapContext } from './MapContext';
import JobMarker from './JobMarker';
import TechMarker from './TechMarker';
import RouteLayer from './RouteLayer';
import MapControls from './MapControls';
import { optimizeRoute, JobWithLocation } from '../../utils/routeOptimization';
import { calculateJobProfit, JobProfitability } from '../../utils/profitability';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Icon issues in Next.js
import L from 'leaflet';
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
    jobs?: Job[];
    users?: User[];
    clients?: Client[];
    timeEntries?: TimeEntry[];
    invoices?: Invoice[];
    selectedDate?: Date;
    defaultLocation?: string;
}

// Helper to get Location for a Job
const getJobLocation = (job: Job, clients: Client[]) => {
    const client = clients.find(c => c.id === job.clientId);
    const property = client?.properties.find(p => p.id === job.propertyId);
    if (property?.address.lat && property?.address.lng) {
        return { lat: property.address.lat, lng: property.address.lng, addressStr: `${property.address.street}, ${property.address.city}` };
    }
    return null;
};

// Component to handle Smart Centering
const MapController: React.FC<{ mapJobs: Job[], clients: Client[], defaultLocation?: string }> = ({ mapJobs, clients, defaultLocation }) => {
    const map = useMap();
    const [hasCentered, setHasCentered] = useState(false);

    useEffect(() => {
        if (hasCentered) return;

        // 1. Try to center on the first job of the day
        if (mapJobs.length > 0) {
            const firstJob = mapJobs[0];
            const loc = getJobLocation(firstJob, clients);
            if (loc) {
                map.setView([loc.lat, loc.lng], 12);
                setHasCentered(true);
                return;
            }
        }

        // 2. Fallback to default location (if we had geocoding here)
        // For now, we stick to the initial center or user's previous view
        // If we really wanted to geocode defaultLocation, we'd need an async effect here.

    }, [mapJobs, clients, hasCentered, map]);

    return null;
};

const MapInner: React.FC<MapViewProps> = ({ jobs = [], users = [], clients = [], timeEntries = [], invoices = [], selectedDate, defaultLocation }) => {
    const { activeTechId, setActiveTechId } = useMapContext();
    const [optimizedRoutes, setOptimizedRoutes] = useState<Record<string, [number, number][]>>({});
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);

    // Reset optimized routes when date changes
    useEffect(() => {
        setOptimizedRoutes({});
    }, [selectedDate]);

    // Filter technicians (or anyone with a GPS location)
    const technicians = useMemo(() => {
        const activeUserIds = new Set(timeEntries.filter(t => t.gpsLocation).map(t => t.userId));
        return users.filter(u => u.role === 'TECHNICIAN' || activeUserIds.has(u.id));
    }, [users, timeEntries]);

    // Filter jobs for the map
    const mapJobs = useMemo(() => {
        let filtered = jobs.filter(job => job.status !== 'DRAFT' && job.status !== 'CANCELLED');

        if (selectedDate) {
            filtered = filtered.filter(job => {
                const jobDate = new Date(job.start);
                return jobDate.getDate() === selectedDate.getDate() &&
                    jobDate.getMonth() === selectedDate.getMonth() &&
                    jobDate.getFullYear() === selectedDate.getFullYear();
            });
        }
        return filtered;
    }, [jobs, selectedDate]);

    // Calculate Routes & Sequences
    const { routes, jobSequences } = useMemo(() => {
        const techRoutes: Record<string, [number, number][]> = {};
        const sequences: Record<string, { order: number, isFirst: boolean, isLast: boolean }> = {};

        // 1. Group jobs by technician
        const groupedJobs: Record<string, Job[]> = {};

        mapJobs.forEach(job => {
            const techId = job.assignedTechIds[0]; // Primary tech
            if (techId) {
                if (!groupedJobs[techId]) groupedJobs[techId] = [];
                groupedJobs[techId].push(job);
            }
        });

        // 2. Sort by time and generate routes
        Object.entries(groupedJobs).forEach(([techId, techJobs]) => {
            const sortedJobs = techJobs.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
            const routePoints: [number, number][] = [];

            // Add Tech Starting Position if available
            const tech = users.find(u => u.id === techId);
            if (tech?.lat && tech?.lng) {
                routePoints.push([tech.lat, tech.lng]);
            }

            sortedJobs.forEach((job, index) => {
                const loc = getJobLocation(job, clients);
                if (loc) {
                    routePoints.push([loc.lat, loc.lng]);

                    sequences[job.id] = {
                        order: index + 1,
                        isFirst: index === 0,
                        isLast: index === sortedJobs.length - 1 && sortedJobs.length > 1
                    };
                }
            });

            if (routePoints.length > 0) {
                techRoutes[techId] = routePoints;
            }
        });

        return { routes: techRoutes, jobSequences: sequences };
    }, [mapJobs, users, clients]);

    const handleOptimizeRoute = () => {
        if (!activeTechId) return;
        setIsOptimizing(true);

        // Simulate async calculation for UX
        setTimeout(() => {
            const techJobs = mapJobs.filter(j => j.assignedTechIds.includes(activeTechId));
            const tech = users.find(u => u.id === activeTechId);

            // Find latest GPS location or default to tech home/company
            const latestEntry = timeEntries
                .filter(e => e.userId === activeTechId && e.gpsLocation)
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];

            const startLoc = latestEntry?.gpsLocation
                ? { lat: latestEntry.gpsLocation.lat, lng: latestEntry.gpsLocation.lng }
                : (tech?.lat && tech?.lng ? { lat: tech.lat, lng: tech.lng } : { lat: 33.5779, lng: -101.8552 }); // Default Lubbock

            // Prepare jobs with locations
            const jobsWithLoc: JobWithLocation[] = techJobs.map(job => {
                const loc = getJobLocation(job, clients);
                if (loc) {
                    return { ...job, location: { lat: loc.lat, lng: loc.lng } };
                }
                return null;
            }).filter((j): j is JobWithLocation => j !== null);

            const optimized = optimizeRoute(startLoc, jobsWithLoc);

            // Build new route points
            const newRoutePoints: [number, number][] = [
                [startLoc.lat, startLoc.lng],
                ...optimized.map(j => [j.location.lat, j.location.lng] as [number, number])
            ];

            setOptimizedRoutes(prev => ({
                ...prev,
                [activeTechId]: newRoutePoints
            }));

            setIsOptimizing(false);
        }, 800);
    };

    // Merge standard routes with optimized routes
    const displayRoutes = { ...routes, ...optimizedRoutes };

    const MAPTILER_KEY = '9wOCWt2fKzEDWWAC9p8B';
    const mapTilerUrl = `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;

    return (
        <div className="w-full h-full bg-slate-100 relative z-0 rounded-xl overflow-hidden shadow-inner min-h-[600px]">
            <style>{`
                .jobber-popup .leaflet-popup-content-wrapper {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                    padding: 0;
                    overflow: hidden;
                }
                .jobber-popup .leaflet-popup-content {
                    margin: 0;
                    width: 320px !important;
                }
                .jobber-popup .leaflet-popup-tip {
                    background: white;
                }
                .jobber-popup a.leaflet-popup-close-button {
                    display: none;
                }
            `}</style>

            <MapContainer center={[33.5779, -101.8552]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url={mapTilerUrl}
                    attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>'
                />

                <MapController mapJobs={mapJobs} clients={clients} defaultLocation={defaultLocation} />

                <MapControls
                    onOptimize={handleOptimizeRoute}
                    isOptimizing={isOptimizing}
                    hasActiveTech={!!activeTechId}
                    showHeatmap={showHeatmap}
                    onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
                />

                <RouteLayer routes={displayRoutes} />

                {/* Technician Markers */}
                {technicians.map(tech => {
                    // Find latest GPS location from time entries
                    const latestEntry = timeEntries
                        .filter(e => e.userId === tech.id && e.gpsLocation)
                        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];

                    const position = latestEntry?.gpsLocation
                        ? { lat: latestEntry.gpsLocation.lat, lng: latestEntry.gpsLocation.lng }
                        : (tech.lat && tech.lng ? { lat: tech.lat, lng: tech.lng } : null);

                    if (!position) return null;

                    const currentJob = mapJobs.find(j => j.assignedTechIds.includes(tech.id) && j.status === 'IN_PROGRESS');

                    return (
                        <TechMarker
                            key={tech.id}
                            tech={tech}
                            position={position}
                            currentJob={currentJob}
                        />
                    );
                })}

                {/* Job Markers */}
                {mapJobs.map(job => {
                    const loc = getJobLocation(job, clients);
                    if (!loc) return null;

                    const seq = jobSequences[job.id];
                    const techId = job.assignedTechIds[0];
                    const assignedTech = techId ? users.find(u => u.id === techId) : undefined;

                    const profitability = calculateJobProfit(job, invoices, timeEntries, users);

                    return (
                        <JobMarker
                            key={job.id}
                            job={job}
                            position={{ lat: loc.lat, lng: loc.lng, addressStr: loc.addressStr }}
                            sequence={seq}
                            assignedTech={assignedTech}
                            profitability={profitability}
                            showHeatmap={showHeatmap}
                        />
                    );
                })}

                {/* Legend Overlay */}
                <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                    <div className="bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg border border-slate-200 max-w-xs">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Map Legend</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                <div className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-sm"></div>
                                <span>Technicians</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                <div className="w-3 h-3 rounded-full bg-emerald-600 border border-white shadow-sm flex items-center justify-center text-[8px] text-white">1</div>
                                <span>Start of Route</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                <div className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-sm flex items-center justify-center text-[8px] text-white">2</div>
                                <span>Route Stop</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                <div className="w-3 h-3 rounded-full bg-red-600 border border-white shadow-sm flex items-center justify-center text-[8px] text-white">3</div>
                                <span>End of Route</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                <div className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-sm relative">
                                    <div className="absolute -inset-1 rounded-full border border-amber-500 opacity-50"></div>
                                </div>
                                <span>Work In Progress</span>
                            </div>
                            {activeTechId && (
                                <div className="flex items-center gap-2 text-xs font-medium text-blue-600 pt-1 border-t border-slate-100 mt-1">
                                    <div className="w-4 h-0.5 bg-blue-600"></div>
                                    <span>Route: {users.find(u => u.id === activeTechId)?.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {activeTechId && (
                        <button
                            onClick={() => setActiveTechId(null)}
                            className="bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-lg border border-slate-200 text-xs font-bold text-slate-600 hover:text-red-600 transition-colors"
                        >
                            Clear Selection
                        </button>
                    )}
                </div>
            </MapContainer>
        </div>
    );
};

const MapView: React.FC<MapViewProps> = (props) => {
    return (
        <MapProvider selectedDate={props.selectedDate} defaultLocation={props.defaultLocation}>
            <MapInner {...props} />
        </MapProvider>
    );
};

export default MapView;
