"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MapContextType {
    activeTechId: string | null;
    setActiveTechId: (id: string | null) => void;
    chattingTechId: string | null;
    setChattingTechId: (id: string | null) => void;
    selectedDate: Date | undefined;
    defaultLocation: string | undefined;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

interface MapProviderProps {
    children: ReactNode;
    selectedDate?: Date;
    defaultLocation?: string;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children, selectedDate, defaultLocation }) => {
    const [activeTechId, setActiveTechId] = useState<string | null>(null);
    const [chattingTechId, setChattingTechId] = useState<string | null>(null);

    return (
        <MapContext.Provider value={{
            activeTechId,
            setActiveTechId,
            chattingTechId,
            setChattingTechId,
            selectedDate,
            defaultLocation
        }}>
            {children}
        </MapContext.Provider>
    );
};

export const useMapContext = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMapContext must be used within a MapProvider');
    }
    return context;
};
