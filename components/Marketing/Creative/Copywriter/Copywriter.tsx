import React, { useState, useEffect } from 'react';
import { CreativeService } from '../../../../services/creativeService';
import { BrandKit, CopyVariant } from '../../../../types';
import { BrandAssets } from '../Shared/BrandAssets';
import {
    PenTool, Copy, Check, RefreshCw, MessageSquare,
    Facebook, Instagram, Search, Layout, Linkedin
} from 'lucide-react';

const PLATFORMS = [
    { id: 'FACEBOOK', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'INSTAGRAM', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { id: 'GOOGLE_SEARCH', label: 'Google Search', icon: Search, color: 'text-blue-500' },
    { id: 'LINKEDIN', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' }
];

const TONES = ['Professional', 'Friendly', 'Luxury', 'Bold', 'Minimal', 'Humorous'];

export const Copywriter = () => {
    const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('FACEBOOK');
    const [selectedTone, setSelectedTone] = useState('Professional');
    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<CopyVariant[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const kit = await CreativeService.getBrandKit();
        setBrandKit(kit);
    };

    const handleGenerate = async () => {
        if (!productName || !description) return;
        setIsGenerating(true);
        try {
            const copy = await CreativeService.generateCopy({
                productName,
                description,
                platform: selectedPlatform as any,
                tone: selectedTone,
                goal: 'CONVERSION',
                includeEmoji: true
            });
            setResults(copy);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Control Panel */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                            <PenTool className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-lg dark:text-white">Advanced Copywriter</h2>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Platform Mode</label>
                        <div className="grid grid-cols-2 gap-2">
                            {PLATFORMS.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPlatform(p.id)}
                                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${selectedPlatform === p.id
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-600'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                                        }`}
                                >
                                    <p.icon className={`w-4 h-4 ${p.color}`} />
                                    <span className={`text-xs font-bold ${selectedPlatform === p.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Service / Product Name</label>
                            <input
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500"
                                placeholder="e.g. Premium Exterior Detail"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Key Benefits / Details</label>
                            <textarea
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500"
                                rows={4}
                                placeholder="e.g. We come to you, eco-friendly products, takes 1 hour, 100% satisfaction guarantee."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Tone Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Tone of Voice</label>
                        <div className="flex flex-wrap gap-2">
                            {TONES.map(tone => (
                                <button
                                    key={tone}
                                    onClick={() => setSelectedTone(tone)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${selectedTone === tone
                                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-700'
                                        }`}
                                >
                                    {tone}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!productName || !description || isGenerating}
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all ${!productName || !description || isGenerating
                                ? 'bg-slate-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 transform hover:scale-[1.02]'
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" /> Writing...
                            </>
                        ) : (
                            <>
                                <PenTool className="w-5 h-5" /> Generate Copy
                            </>
                        )}
                    </button>
                </div>

                {brandKit && <BrandAssets brandKit={brandKit} />}
            </div>

            {/* Right Display Area */}
            <div className="lg:col-span-2 space-y-6">
                {results.length === 0 ? (
                    <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <MessageSquare className="w-10 h-10 text-pink-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to Write</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Provide details about your offer and our AI will generate high-converting copy optimized for your selected platform.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        {/* Group by Type or just list them */}
                        {results.map((variant) => (
                            <div key={variant.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm group hover:border-pink-300 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${variant.type === 'HEADLINE' ? 'bg-blue-100 text-blue-700' :
                                                variant.type === 'HOOK' ? 'bg-red-100 text-red-700' :
                                                    variant.type === 'CAPTION' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-slate-100 text-slate-600'
                                            }`}>
                                            {variant.type.replace('_', ' ')}
                                        </span>
                                        <div className="flex gap-1">
                                            {variant.tags.map(tag => (
                                                <span key={tag} className="text-[10px] text-slate-400 border border-slate-200 px-1.5 rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Copy to clipboard">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Use in Composer">
                                            <Layout className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed font-medium">
                                    {variant.text}
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${variant.score}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-green-600">{variant.score}/100</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
