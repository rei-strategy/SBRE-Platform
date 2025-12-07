"use client";

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Briefcase, MessageCircle } from 'lucide-react';
import { User, Job } from '../../types';
import { techIcon } from '../../utils/mapIcons';
import { useMapContext } from './MapContext';
import ChatPopup from './ChatPopup';

interface TechMarkerProps {
    tech: User;
    position: { lat: number; lng: number };
    currentJob?: Job;
}

const TechMarker: React.FC<TechMarkerProps> = ({ tech, position, currentJob }) => {
    const { chattingTechId, setChattingTechId, setActiveTechId } = useMapContext();
    const isChatting = chattingTechId === tech.id;

    const handleMarkerClick = () => {
        setActiveTechId(tech.id);
        // If we were chatting with someone else, close it? 
        // Or if we click this marker, we probably want to see info first.
        // The original logic was: setChattingTechId(null) on marker click.
        setChattingTechId(null);
    };

    const handleChatClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setChattingTechId(tech.id);
    };

    return (
        <Marker
            position={[position.lat, position.lng]}
            icon={techIcon}
            eventHandlers={{
                click: handleMarkerClick
            }}
        >
            <Popup className="jobber-popup" closeButton={false}>
                {isChatting ? (
                    <ChatPopup
                        techId={tech.id}
                        techName={tech.name}
                        avatarUrl={tech.avatarUrl}
                    />
                ) : (
                    // --- INFO VIEW ---
                    <div className="flex flex-col bg-white w-full font-sans">
                        <div className="p-4 border-b border-slate-100 flex items-center gap-3 relative">
                            <div className="relative">
                                <img src={tech.avatarUrl} alt={tech.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-emerald-500"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">{tech.name}</h3>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Technician</p>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Current Activity</p>
                                    <p className="text-sm font-medium text-slate-900">{currentJob ? currentJob.title : 'Available'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                            <button
                                onClick={handleChatClick}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" /> Message
                            </button>
                        </div>
                    </div>
                )}
            </Popup>
        </Marker>
    );
};

export default TechMarker;
