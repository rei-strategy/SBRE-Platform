import React from 'react';
import { User, ChatMessage } from '../../../../types';
import { Bot, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

// --- Custom Rich Message Component (Markdown-like) ---
const RichMessage: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');

    const parseBold = (text: string) => {
        const boldRegex = /\*\*([^*]+)\*\*/g;
        const parts: (string | JSX.Element)[] = [];
        let lastIndex = 0;
        let match;

        while ((match = boldRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            parts.push(<strong key={match.index} className="font-bold">{match[1]}</strong>);
            lastIndex = boldRegex.lastIndex;
        }
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }
        return parts.length > 0 ? parts : text;
    };

    return (
        <div className="space-y-1">
            {lines.map((line, i) => {
                if (!line.trim()) return <br key={i} />;

                const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                const parts: (string | JSX.Element)[] = [];
                let lastIndex = 0;
                let match;

                while ((match = linkRegex.exec(line)) !== null) {
                    if (match.index > lastIndex) {
                        parts.push(parseBold(line.substring(lastIndex, match.index)));
                    }
                    parts.push(
                        <Link
                            key={`${i}-${match.index}`}
                            to={match[2]}
                            className="text-indigo-600 dark:text-indigo-400 underline font-bold inline-flex items-center gap-0.5 hover:text-indigo-800"
                        >
                            {match[1]} <ExternalLink className="w-3 h-3" />
                        </Link>
                    );
                    lastIndex = linkRegex.lastIndex;
                }
                if (lastIndex < line.length) {
                    parts.push(parseBold(line.substring(lastIndex)));
                }

                // Handle lists (bullets)
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                    return <div key={i} className="pl-4 indent-[-1em] leading-relaxed">{parts}</div>;
                }

                return <p key={i} className="leading-relaxed">{parts}</p>;
            })}
        </div>
    );
};

interface MessageBubbleProps {
    message: ChatMessage;
    isMe: boolean;
    isAi: boolean;
    sender?: User;
    showAvatar: boolean;
    activeChatType?: 'DIRECT' | 'GROUP';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, isAi, sender, showAvatar, activeChatType }) => {
    return (
        <div className={`flex gap-2 md:gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 flex-shrink-0 flex flex-col items-center">
                {!isMe && showAvatar && (
                    isAi ? (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                            <Bot className="w-5 h-5" />
                        </div>
                    ) : (
                        <img src={sender?.avatarUrl} className="w-8 h-8 rounded-full shadow-sm border border-slate-200 dark:border-slate-700" title={sender?.name} alt="" />
                    )
                )}
            </div>
            <div className={`max-w-[85%] md:max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isMe && showAvatar && !isAi && activeChatType === 'GROUP' && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 mb-1">{sender?.name}</span>
                )}
                <div
                    className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${isMe
                            ? 'bg-emerald-600 text-white rounded-tr-sm'
                            : isAi
                                ? 'bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/50 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-indigo-500/5'
                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                        }`}
                >
                    {isAi ? <RichMessage content={message.content} /> : message.content}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 mx-1">
                    {format(new Date(message.timestamp), 'h:mm a')}
                </span>
            </div>
        </div>
    );
};
