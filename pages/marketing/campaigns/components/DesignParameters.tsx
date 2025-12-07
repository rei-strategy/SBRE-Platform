import React, { useState } from 'react';
import { LayoutTemplate, Check, Plus } from 'lucide-react';
import { EmailTheme, emailThemes } from '../../../../data/emailTemplates';

interface DesignParametersProps {
    selectedTheme: EmailTheme;
    setSelectedTheme: (theme: EmailTheme) => void;
    onOpenTemplateModal: () => void;
}

export const DesignParameters: React.FC<DesignParametersProps> = ({
    selectedTheme,
    setSelectedTheme,
    onOpenTemplateModal
}) => {
    const [isCustomTheme, setIsCustomTheme] = useState(false);

    const handleThemeSelect = (theme: EmailTheme) => {
        setSelectedTheme(theme);
        setIsCustomTheme(false);
    };

    return (
        <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <LayoutTemplate className="w-3 h-3" /> Design
            </h3>
            <div className="space-y-4">
                <button
                    onClick={onOpenTemplateModal}
                    className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group text-left"
                >
                    <div className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 mb-1">Change Template</div>
                    <p className="text-xs text-slate-500">Current: Custom / Selected</p>
                </button>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Color Theme</label>
                    <div className="grid grid-cols-6 gap-2">
                        {emailThemes.map(theme => (
                            <button
                                key={theme.name}
                                onClick={() => handleThemeSelect(theme)}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedTheme.name === theme.name && !isCustomTheme ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent hover:scale-105'}`}
                                style={{ backgroundColor: theme.primaryColor }}
                                title={theme.name}
                            >
                                {selectedTheme.name === theme.name && !isCustomTheme && <Check className="w-4 h-4 text-white" />}
                            </button>
                        ))}
                        <button
                            onClick={() => setIsCustomTheme(true)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all bg-white dark:bg-slate-700 ${isCustomTheme ? 'border-blue-500 scale-110' : 'border-slate-200 dark:border-slate-600 hover:border-blue-400'}`}
                            title="Custom Theme"
                        >
                            {isCustomTheme ? <Check className="w-4 h-4 text-blue-500" /> : <Plus className="w-4 h-4 text-slate-400" />}
                        </button>
                    </div>

                    {/* Custom Theme Editor */}
                    {isCustomTheme && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Primary Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={selectedTheme.primaryColor}
                                        onChange={e => setSelectedTheme({ ...selectedTheme, primaryColor: e.target.value, secondaryColor: e.target.value })}
                                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                    />
                                    <input
                                        type="text"
                                        value={selectedTheme.primaryColor}
                                        onChange={e => setSelectedTheme({ ...selectedTheme, primaryColor: e.target.value, secondaryColor: e.target.value })}
                                        className="flex-1 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Background</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={selectedTheme.backgroundColor}
                                        onChange={e => setSelectedTheme({ ...selectedTheme, backgroundColor: e.target.value })}
                                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                    />
                                    <input
                                        type="text"
                                        value={selectedTheme.backgroundColor}
                                        onChange={e => setSelectedTheme({ ...selectedTheme, backgroundColor: e.target.value })}
                                        className="flex-1 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Font Family</label>
                                <select
                                    value={selectedTheme.fontFamily || 'Arial, sans-serif'}
                                    onChange={e => setSelectedTheme({ ...selectedTheme, fontFamily: e.target.value })}
                                    className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Arial, sans-serif">Arial (Modern Sans)</option>
                                    <option value="'Times New Roman', serif">Times New Roman (Classic)</option>
                                    <option value="'Courier New', monospace">Courier New (Typewriter)</option>
                                    <option value="Georgia, serif">Georgia (Elegant)</option>
                                    <option value="'Trebuchet MS', sans-serif">Trebuchet MS (Clean)</option>
                                    <option value="Impact, sans-serif">Impact (Bold)</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
