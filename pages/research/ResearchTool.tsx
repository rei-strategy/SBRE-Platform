import React, { useState, useContext } from 'react';
import { Search, Sparkles, Loader2, AlertCircle, History } from 'lucide-react';
import { StoreContext } from '../../store';
import { ResearchService } from '../../services/researchService';
import { ResearchToolType } from '../../types';

interface ResearchToolProps {
    toolType: ResearchToolType;
    title: string;
    description: string;
    inputConfig: {
        fields: Array<{
            key: string;
            label: string;
            placeholder: string;
            type?: 'text' | 'textarea';
        }>;
    };
    renderResult: (data: any) => React.ReactNode;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ResearchTool Render Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                        <p className="font-bold">Display Error</p>
                        <p className="text-sm">The result could not be rendered: {this.state.error?.message}</p>
                        <p className="text-xs mt-1 text-slate-500">Raw Data: See console or 'Raw' view.</p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export const ResearchTool: React.FC<ResearchToolProps> = ({
    toolType, title, description, inputConfig, renderResult
}) => {
    const store = useContext(StoreContext);
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRunResearch = async () => {
        // Validate inputs
        const missing = inputConfig.fields.filter(f => !inputs[f.key]);
        if (missing.length > 0) {
            setError(`Please fill in: ${missing.map(m => m.label).join(', ')}`);
            return;
        }

        if (!store?.currentUser?.id) return;

        setIsLoading(true);
        setError(null);
        setResult(null); // Clear previous result

        try {
            const res = await ResearchService.runResearch(
                toolType,
                inputs,
                store.currentUser.id,
                store.currentUser.companyId
            );
            console.log("Research Result:", res.data); // Debug log
            setResult(res.data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Research failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{description}</p>

                    <div className="space-y-4">
                        {inputConfig.fields.map(field => (
                            <div key={field.key} className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                                        placeholder={field.placeholder}
                                        value={inputs[field.key] || ''}
                                        onChange={e => setInputs(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder={field.placeholder}
                                        value={inputs[field.key] || ''}
                                        onChange={e => setInputs(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleRunResearch}
                        disabled={isLoading}
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" /> Run Analysis
                            </>
                        )}
                    </button>

                    <p className="text-xs text-center text-slate-400 mt-4">
                        Powered by Perplexity AI & Real-time Web Data
                    </p>
                </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">
                {result ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Search className="w-4 h-4 text-indigo-500" /> Research Results
                            </h3>
                            <button onClick={() => setResult(null)} className="text-xs text-slate-500 hover:text-indigo-500">
                                Clear Results
                            </button>
                        </div>
                        <div className="p-6">
                            {result.error ? (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <div>
                                        <p className="font-bold">Analysis Failed</p>
                                        <p className="text-sm">
                                            {typeof result.error === 'string'
                                                ? result.error
                                                : JSON.stringify(result.error)}
                                        </p>
                                    </div>
                                </div>
                            ) : result.raw || result.raw_content ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg text-sm flex gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p>The AI provided a response but it wasn't in the expected structured format. Displaying raw output below.</p>
                                    </div>
                                    <div className="prose dark:prose-invert max-w-none">
                                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                                            {result.raw || result.raw_content}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <ErrorBoundary>
                                    {renderResult(result)}
                                </ErrorBoundary>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-full mb-4 shadow-sm">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="font-medium">Ready to research</p>
                        <p className="text-sm opacity-70">Enter details on the left to start.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
