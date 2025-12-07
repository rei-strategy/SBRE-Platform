import React from 'react';

// Static placeholder for Phase 1 as requested in prompt, focusing on Image/Copy modules first.
// This serves as the container for future "drag and drop" composition.
export const AdComposer = () => {
    return (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 h-[600px]">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🎨</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ad Composer</h2>
            <p className="text-slate-500 max-w-lg mb-6">
                Select generated images and copy from the other tabs to assemble your final ad creatives here.
            </p>
            <button disabled className="px-6 py-2 bg-slate-200 text-slate-400 rounded-lg font-bold cursor-not-allowed">
                Coming Soon
            </button>
        </div>
    );
};
