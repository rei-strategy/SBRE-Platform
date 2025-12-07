import React, { useState, useEffect } from 'react';
import { CreativeService } from '../../../../services/creativeService';
import { BrandKit, GeneratedImage, PlatformFormat } from '../../../../types';
import { BrandAssets } from '../Shared/BrandAssets';
import {
    Wand2, Image as ImageIcon, Sparkles, AlertCircle, RefreshCw,
    Download, Check, Layers, Type, Maximize
} from 'lucide-react';

const PRESETS = [
    { id: 'LOCAL_SERVICE', label: 'Local Service', desc: 'Clean professional photography', icon: '📸' },
    { id: 'LUXURY', label: 'Luxury', desc: 'Premium aesthetic, dark tones', icon: '💎' },
    { id: 'MINIMAL', label: 'Minimal', desc: 'Clean lines, lots of whitespace', icon: '⚪' },
    { id: 'UGC', label: 'UGC Style', desc: 'Authentic smartphone style', icon: '📱' },
    { id: 'HOLIDAY', label: 'Holiday Promo', desc: 'Seasonal festive themes', icon: '🎁' },
    { id: 'OFFER', label: 'Offer Banner', desc: 'Bold text overlays for sales', icon: '🏷️' }
];

const FORMATS: { id: PlatformFormat, label: string, ratio: string }[] = [
    { id: 'INSTAGRAM_FEED', label: 'IG Feed (1:1)', ratio: 'aspect-square' },
    { id: 'INSTAGRAM_STORY', label: 'Story (9:16)', ratio: 'aspect-[9/16]' },
    { id: 'FACEBOOK_FEED', label: 'FB Feed (1.91:1)', ratio: 'aspect-[1.91/1]' }
];

export const ImageGenerator = () => {
    const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
    const [prompt, setPrompt] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('LOCAL_SERVICE');
    const [selectedFormats, setSelectedFormats] = useState<PlatformFormat[]>(['INSTAGRAM_FEED']);
    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<GeneratedImage[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const kit = await CreativeService.getBrandKit();
        setBrandKit(kit);
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        try {
            const images = await CreativeService.generateImages({
                prompt,
                stylePreset: selectedPreset,
                formats: selectedFormats,
                useBrandKit: true,
                textOverlay: { enabled: false }
            });
            setResults(images);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleFormat = (format: PlatformFormat) => {
        if (selectedFormats.includes(format)) {
            setSelectedFormats(selectedFormats.filter(f => f !== format));
        } else {
            setSelectedFormats([...selectedFormats, format]);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Control Panel */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-lg dark:text-white">Nano Banana Pro</h2>
                    </div>

                    {/* Prompt Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Describe your ad creative
                        </label>
                        <textarea
                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            rows={3}
                            placeholder="e.g. A sparkling clean luxury SUV parked in front of a modern home, sunset lighting..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-slate-400">Be specific for best results.</span>
                            <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
                                <Wand2 className="w-3 h-3" /> Enhance Prompt
                            </button>
                        </div>
                    </div>

                    {/* Presets Grid */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Style Preset</label>
                        <div className="grid grid-cols-2 gap-2">
                            {PRESETS.map(preset => (
                                <button
                                    key={preset.id}
                                    onClick={() => setSelectedPreset(preset.id)}
                                    className={`p-3 rounded-lg border text-left transition-all relative group ${selectedPreset === preset.id
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-600'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                                        }`}
                                >
                                    <div className="text-xl mb-1">{preset.icon}</div>
                                    <div className={`font-bold text-xs ${selectedPreset === preset.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>{preset.label}</div>
                                    {/* Tooltip description could go here */}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Format Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Target Formats</label>
                        <div className="space-y-2">
                            {FORMATS.map(fmt => (
                                <label key={fmt.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <input
                                        type="checkbox"
                                        checked={selectedFormats.includes(fmt.id)}
                                        onChange={() => toggleFormat(fmt.id)}
                                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium dark:text-slate-300">{fmt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!prompt || isGenerating}
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all ${!prompt || isGenerating
                                ? 'bg-slate-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02]'
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" /> Generate Assets
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
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <ImageIcon className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to Design</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Enter a prompt and choose your settings to generate professional ad creatives tailored to your brand.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                        {results.map((img) => (
                            <div key={img.id} className="group relative">
                                <div className={`w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-slate-200 relative ${FORMATS.find(f => f.id === img.format)?.ratio || 'aspect-video'
                                    }`}>
                                    <img src={img.url} alt="Generated" className="w-full h-full object-cover" />

                                    {/* Brand Logo Overlay Mockup - bottom right */}
                                    {brandKit?.logoUrl && (
                                        <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur rounded-lg p-1.5 shadow-sm opacity-90">
                                            <img src={brandKit.logoUrl} className="w-full h-full object-contain" />
                                        </div>
                                    )}

                                    {/* Action Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button className="bg-white text-slate-900 p-2 rounded-full hover:bg-slate-100" title="Download">
                                            <Download className="w-5 h-5" />
                                        </button>
                                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700">
                                            Use in Composer
                                        </button>
                                        <button className="bg-white text-slate-900 p-2 rounded-full hover:bg-slate-100" title="Full Screen">
                                            <Maximize className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 flex justify-between items-center px-1">
                                    <span className="text-xs font-bold text-slate-500 uppercase">{img.format.replace(/_/g, ' ')}</span>
                                    <span className="text-xs text-slate-400">Generated just now</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
