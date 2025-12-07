import React from 'react';
import { BrandKit } from '../../../../types';
import { Palette, Type } from 'lucide-react';

interface Props {
    brandKit: BrandKit;
}

export const BrandAssets: React.FC<Props> = ({ brandKit }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Active Brand Kit</h3>

            <div className="flex items-center gap-4 mb-4">
                {brandKit.logoUrl && (
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-1">
                        <img src={brandKit.logoUrl} alt="Logo" className="max-w-full max-h-full" />
                    </div>
                )}
                <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{brandKit.name}</p>
                    <p className="text-xs text-slate-400">{brandKit.industry}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-slate-400" />
                    <div className="flex gap-1.5">
                        {Object.entries(brandKit.colors).map(([key, color]) => (
                            <div key={key} className="w-6 h-6 rounded-full border border-slate-200 cursor-help" style={{ backgroundColor: color }} title={`${key}: ${color}`}></div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Type className="w-4 h-4 text-slate-400" />
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-bold">{brandKit.fonts.heading}</span> (Headers) • {brandKit.fonts.body} (Body)
                    </div>
                </div>
            </div>
        </div>
    );
};
