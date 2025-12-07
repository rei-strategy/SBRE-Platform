import React, { useState } from 'react';
import { ImageGenerator } from '../../components/Marketing/Creative/ImageGenerator/ImageGenerator';
import { Copywriter } from '../../components/Marketing/Creative/Copywriter/Copywriter';
import { AdComposer } from '../../components/Marketing/Creative/Composer/AdComposer';
import { Image as ImageIcon, PenTool, Layout, Layers } from 'lucide-react';

const TABS = [
    { id: 'GENERATOR', label: 'Image Generator', icon: ImageIcon },
    { id: 'COPYWRITER', label: 'Copywriter', icon: PenTool },
    { id: 'COMPOSER', label: 'Ad Composer', icon: Layout }
];

export const CreativeSuitePage = () => {
    const [activeTab, setActiveTab] = useState('GENERATOR');

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-8 h-8 text-indigo-600" />
                        Ads Creative Suite
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Powered by Nano Banana Pro & Advanced Copywriter AI</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700">
                <div className="flex gap-8">
                    {TABS.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-colors ${isActive
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span className="font-bold">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Module Render */}
            <div className="min-h-[600px] animate-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'GENERATOR' && <ImageGenerator />}
                {activeTab === 'COPYWRITER' && <Copywriter />}
                {activeTab === 'COMPOSER' && <AdComposer />}
            </div>
        </div>
    );
};
