"use client";

import React from 'react';
import { Polyline } from 'react-leaflet';
import { useMapContext } from './MapContext';

interface RouteLayerProps {
    routes: Record<string, [number, number][]>;
}

const RouteLayer: React.FC<RouteLayerProps> = ({ routes }) => {
    const { activeTechId } = useMapContext();

    return (
        <>
            {Object.entries(routes).map(([techId, positions]) => {
                const isSelected = activeTechId === techId;
                const opacity = activeTechId ? (isSelected ? 0.8 : 0.1) : 0.5;
                const color = isSelected ? '#2563eb' : '#3b82f6';
                const weight = isSelected ? 4 : 3;

                return (
                    <Polyline
                        key={techId}
                        positions={positions}
                        pathOptions={{
                            color,
                            weight,
                            opacity,
                            dashArray: isSelected ? undefined : '8, 6',
                            lineCap: 'round',
                            lineJoin: 'round'
                        }}
                    />
                );
            })}
        </>
    );
};

export default RouteLayer;
