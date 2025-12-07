import React, { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, List } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const execCommand = (command: string) => {
        document.execCommand(command, false, undefined);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    // Sync value from props to editor (only when not focused or empty to prevent cursor jumps)
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            if (document.activeElement !== editorRef.current) {
                editorRef.current.innerHTML = value;
            }
        }
    }, [value]);

    return (
        <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-700 focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-sm">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800">
                <ToolbarButton onClick={() => execCommand('bold')} icon={<Bold className="w-4 h-4" />} title="Bold" />
                <ToolbarButton onClick={() => execCommand('italic')} icon={<Italic className="w-4 h-4" />} title="Italic" />
                <ToolbarButton onClick={() => execCommand('underline')} icon={<Underline className="w-4 h-4" />} title="Underline" />
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
                <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={<List className="w-4 h-4" />} title="Bullet List" />
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                className="p-4 min-h-[150px] outline-none prose prose-sm dark:prose-invert max-w-none text-slate-900 dark:text-white"
                onInput={(e) => onChange(e.currentTarget.innerHTML)}
                data-placeholder={placeholder}
            />
            <style>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #94a3b8;
                    pointer-events: none;
                    display: block; /* For Firefox */
                }
            `}</style>
        </div>
    );
};

const ToolbarButton = ({ onClick, icon, title }: any) => (
    <button
        type="button"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
        title={title}
    >
        {icon}
    </button>
);
