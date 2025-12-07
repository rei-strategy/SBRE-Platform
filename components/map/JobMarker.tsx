"use client";

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Clock, ChevronRight, DollarSign } from 'lucide-react';
import { Job, User } from '../../types';
import { createOrderedJobIcon } from '../../utils/mapIcons';
import { useMapContext } from './MapContext';
import { JobProfitability } from '../../utils/profitability';

interface JobMarkerProps {
    job: Job;
    position: { lat: number; lng: number; addressStr: string };
    sequence?: { order: number; isFirst: boolean; isLast: boolean };
    assignedTech?: User;
    profitability?: JobProfitability;
    showHeatmap?: boolean;
}

const getJobStatusStyle = (status: string) => {
    switch (status) {
        case 'SCHEDULED': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'IN_PROGRESS': return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
};

const JobMarker: React.FC<JobMarkerProps> = ({ job, position, sequence, assignedTech, profitability, showHeatmap }) => {
    const { activeTechId } = useMapContext();

    // Determine opacity based on active route
    const isAssignedToActiveTech = assignedTech && activeTechId === assignedTech.id;
    const opacity = activeTechId ? (isAssignedToActiveTech ? 1 : 0.5) : 1;

    // Determine Heatmap Color
    let heatmapColor: string | undefined;
    if (showHeatmap && profitability) {
        if (profitability.status === 'HIGH') heatmapColor = '#10b981'; // Green
        else if (profitability.status === 'MEDIUM') heatmapColor = '#f59e0b'; // Yellow
        else heatmapColor = '#ef4444'; // Red
    }

    // Determine Icon
    // If sequence exists, use it. If not, use generic (order 0).
    const icon = createOrderedJobIcon(
        sequence?.order || 0,
        sequence?.isFirst || false,
        sequence?.isLast || false,
        job.status,
        heatmapColor
    );

    const openJobDetails = () => {
        console.log('Open job', job.id);
        // In real app: router.push(`/jobs/${job.id}`)
    };

    return (
        <Marker
            position={[position.lat, position.lng]}
            icon={icon}
            opacity={opacity}
            eventHandlers={{
                click: openJobDetails
            }}
        >
            <Popup className="jobber-popup" closeButton={false}>
                <div className="flex flex-col bg-white w-full font-sans">
                    <div className="p-4 border-b border-slate-100 flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                            <p className="text-sm text-slate-500">{position.addressStr}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getJobStatusStyle(job.status)}`}>
                            {job.status.replace('_', ' ')}
                        </span>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">
                                {new Date(job.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(job.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>

                        </div>

                        {showHeatmap && profitability && (
                            <div className={`flex items-center justify-between font-bold text-xs pt-2 border-t border-slate-100 ${profitability.status === 'HIGH' ? 'text-emerald-600' :
                                profitability.status === 'MEDIUM' ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    <span>Profit: ${profitability.profit.toFixed(2)}</span>
                                </div>
                                <span>{profitability.margin.toFixed(0)}% Margin</span>
                            </div>
                        )}

                        {assignedTech ? (
                            <div className="flex items-center gap-3">
                                <img src={assignedTech.avatarUrl} className="w-6 h-6 rounded-full" alt={assignedTech.name} />
                                <span className="text-sm font-medium text-slate-700">{assignedTech.name}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">?</div>
                                <span className="text-sm font-medium text-slate-500 italic">Unassigned</span>
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-100">
                        <button onClick={openJobDetails} className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                            View Details <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Popup>
        </Marker >
    );
};

export default JobMarker;
