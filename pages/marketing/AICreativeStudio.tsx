import React, { useState } from 'react';
import { AdsService } from '../../services/adsService';
import { Wand2, Image as ImageIcon, Type, Sparkles, Loader2, Save, Send, LayoutTemplate } from 'lucide-react';

export const AICreativeStudio: React.FC = () => {
    // State for Image Gen
    const [imagePrompt, setImagePrompt] = useState('');
    const [generatingImage, setGeneratingImage] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    // State for Copy Gen
    const [productName, setProductName] = useState('');
    const [generatingCopy, setGeneratingCopy] = useState(false);
    const [generatedCopy, setGeneratedCopy] = useState<{ headline: string, primaryText: string } | null>(null);

    const handleGenerateImage = async () => {
        if (!imagePrompt) return;
        setGeneratingImage(true);
        const url = await AdsService.generateImage(imagePrompt);
        setGeneratedImage(url);
        setGeneratingImage(false);
    };

    const handleGenerateCopy = async () => {
        if (!productName) return;
        setGeneratingCopy(true);
        const copy = await AdsService.generateCopy(productName);
        setGeneratedCopy(copy);
        setGeneratingCopy(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Wand2 className="w-6 h-6 text-purple-500" />
                    AI Creative Studio
                </h2>
                <p className="text-slate-500 dark:text-slate-400">Generate high-converting ad assets in seconds.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* IMAGE GENERATOR */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-blue-500" /> Ad Image Generator
                        </h3>
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">Gemini Nano</span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Describe your image</label>
                            <textarea
                                value={imagePrompt}
                                onChange={(e) => setImagePrompt(e.target.value)}
                                placeholder="e.g. A shiny red truck being detailed in a sunny driveway, professional photography..."
                                className="w-full h-24 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>

                        {/* Templates Row */}
                        <div className="flex gap-2 mb-2">
                            {['Before/After', 'Seasonal Promo', 'Testimonial'].map(t => (
                                <button key={t} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="mt-auto">
                            <button
                                onClick={handleGenerateImage}
                                disabled={generatingImage || !imagePrompt}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {generatingImage ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" /> Generate Image
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Result Area */}
                    <div className="aspect-video bg-slate-100 dark:bg-black flex items-center justify-center relative border-t border-slate-200 dark:border-slate-700">
                        {generatedImage ? (
                            <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-8">
                                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-400">Preview will appear here</p>
                            </div>
                        )}
                        {generatedImage && (
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-white flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Save to Asset Library
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* COPY GENERATOR */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Type className="w-4 h-4 text-green-500" /> Ad Copywriter
                        </h3>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">LLM Powered</span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Product/Service Name</label>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="e.g. Platinum Ceramic Coating"
                                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={handleGenerateCopy}
                                disabled={generatingCopy || !productName}
                                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {generatingCopy ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Writing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" /> Generate Headlines & Text
                                    </>
                                )}
                            </button>
                        </div>

                        {generatedCopy && (
                            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                                    <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2 block">Headline Option</span>
                                    <p className="font-bold text-lg text-slate-900 dark:text-white">{generatedCopy.headline}</p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Primary Text</span>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{generatedCopy.primaryText}</p>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button className="text-slate-400 hover:text-slate-600 text-sm font-medium">Try Again</button>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-500 flex items-center gap-2">
                                        <LayoutTemplate className="w-4 h-4" /> Use in Composer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
