import React, { useMemo } from 'react';

interface TemplatePreviewProps {
    html: string;
    scale?: number;
    className?: string;
    scrollable?: boolean;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ html, scale = 1, className = '', scrollable = false }) => {
    // We use a data URI to render the HTML in an iframe safely and independently
    const srcDoc = useMemo(() => {
        return html;
    }, [html]);

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: `${100 / scale}%`, height: `${100 / scale}%` }}>
            <iframe
                srcDoc={srcDoc}
                title="Email Preview"
                className={`w-full h-full border-0 ${scrollable ? '' : 'pointer-events-none'}`}
                sandbox="allow-same-origin"
            />
            {/* Overlay to prevent interaction within the preview if needed */}
            {!scrollable && <div className="absolute inset-0 z-10 bg-transparent" />}
        </div>
    );
};
