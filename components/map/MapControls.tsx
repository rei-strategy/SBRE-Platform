"use client";

import React from 'react';
import { Zap, DollarSign } from 'lucide-react';

interface MapControlsProps {
    onOptimize: () => void;
    isOptimizing: boolean;
    hasActiveTech: boolean;
    showHeatmap: boolean;
    onToggleHeatmap: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
    onOptimize,
    isOptimizing,
    hasActiveTech,
    showHeatmap,
    onToggleHeatmap
}) => {
    if (!hasActiveTech) return null;

    return (
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
            <button
                onClick={onOptimize}
                disabled={isOptimizing}
                className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-slate-200 text-sm font-bold text-slate-700 hover:bg-white hover:text-blue-600 transition-all disabled:opacity-50"
            >
                <Zap className={`w-4 h-4 ${isOptimizing ? 'animate-pulse text-amber-500' : 'text-blue-500'}`} />
                {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
            </button>

            <button
                onClick={onToggleHeatmap}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg border text-sm font-bold transition-all ${showHeatmap
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white/90 backdrop-blur text-slate-700 border-slate-200 hover:bg-white hover:text-emerald-600'
                    }`}
            >
                <DollarSign className={`w-4 h-4 ${showHeatmap ? 'text-white' : 'text-emerald-500'}`} />
                Profit Heatmap
            </button>
        </div>
    );
};

export default MapControls;
