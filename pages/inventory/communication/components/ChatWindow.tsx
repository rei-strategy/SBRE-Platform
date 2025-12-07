import React, { useRef, useEffect } from 'react';

import {
    Phone, Video, MoreVertical, ChevronLeft, Bot, Users,
    Paperclip, Smile, Send, MessageSquare
} from 'lucide-react';
import { User, Chat, ChatMessage } from '../../../../types';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
    selectedChatId: string | null;
    activeChat: Chat | undefined;
    activeMessages: ChatMessage[];
    currentUser: User;
    users: User[];
    isAiTyping: boolean;
    messageInput: string;
    setMessageInput: (val: string) => void;
    onSendMessage: (e: React.FormEvent) => void;
    onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    selectedChatId, activeChat, activeMessages, currentUser, users,
    isAiTyping, messageInput, setMessageInput, onSendMessage, onBack
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const AI_CHAT_ID = 'ai-assistant-chat';
    const isAISelected = selectedChatId === AI_CHAT_ID;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages.length, selectedChatId, isAiTyping]);

    const getChatDetails = (chat: Chat | undefined) => {
        if (!chat) return { name: '', avatar: null };
        if (chat.id === AI_CHAT_ID) return { name: 'Gemini Assistant', avatar: null, isOnline: true, isBot: true };
        if (chat.type === 'GROUP') return { name: chat.name, avatar: null, isOnline: false };
        const otherUserId = chat.participantIds.find((id: string) => id !== currentUser.id);
        const otherUser = users.find(u => u.id === otherUserId);
        return { name: otherUser?.name || 'Unknown User', avatar: otherUser?.avatarUrl, isOnline: true };
    };

    const details = getChatDetails(activeChat);

    if (!selectedChatId) {
        return (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50/30 dark:bg-slate-900/30 h-full">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-10 h-10 opacity-30 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="font-medium text-lg text-slate-600 dark:text-slate-300">Select a chat to start messaging</p>
                <p className="text-sm mt-2 max-w-xs text-center">Coordinate with your team, share updates, and keep jobs moving efficiently.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col bg-white dark:bg-slate-800 relative h-full w-full">
            {/* Chat Header */}
            <div className={`h - 16 border - b border - slate - 200 dark: border - slate - 700 flex justify - between items - center px - 4 md: px - 6 shrink - 0 z - 10 ${isAISelected ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : 'bg-white dark:bg-slate-800'} `}>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="relative">
                        {isAISelected ? (
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                                <Bot className="w-5 h-5" />
                            </div>
                        ) : details.avatar ? (
                            <img src={details.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-600" alt="" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Users className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white text-base leading-tight flex items-center gap-2">
                            {isAISelected ? 'Gemini Assistant' : details.name}
                            {isAISelected && <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded font-bold uppercase">Smart Agent</span>}
                        </div>
                        {activeChat && activeChat.type === 'GROUP' && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {activeChat.participantIds.length} members
                            </p>
                        )}
                        {isAISelected && (
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 animate-pulse">
                                {isAiTyping ? 'Processing Workflow...' : 'Always Online'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-1 md:gap-3 text-slate-400 dark:text-slate-500">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"><Phone className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"><Video className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
                </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                {isAISelected && activeMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-70">
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                            <Bot className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Agentic AI Ready</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                            I can check schedules, predict revenue, and manage your business.<br /><br />
                            Try: <em>"What is the projected revenue for this week?"</em>
                        </p>
                        <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                            {['Projected revenue?', 'Is Marcus free tomorrow?', 'Check stock for Towels', 'Create a new job'].map((suggestion, i) => (
                                <button key={i} onClick={() => setMessageInput(suggestion)} className="text-xs border border-slate-200 dark:border-slate-700 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeMessages.map((msg, idx) => {
                    const isMe = msg.senderId === currentUser.id;
                    const isAi = msg.senderId === 'ai-bot';
                    const sender = isAi ? { name: 'Gemini', avatarUrl: null } : users.find(u => u.id === msg.senderId);
                    const showAvatar = idx === 0 || activeMessages[idx - 1].senderId !== msg.senderId;

                    // Pass correct sender object (with minimal needed fields casted or found)
                    // The MessageBubble expects sender as User object potentially.
                    // We can cast or construct a partial user.
                    const bubbleSender = isAi ? undefined : users.find(u => u.id === msg.senderId);

                    return (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isMe={isMe}
                            isAi={isAi}
                            sender={bubbleSender}
                            showAvatar={showAvatar}
                            activeChatType={activeChat?.type}
                        />
                    );
                })}
                {isAiTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 flex-shrink-0">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                                <Bot className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/50 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky bottom-0">
                <form onSubmit={onSendMessage} className="flex items-end gap-2">
                    <button type="button" className="p-2 md:p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <div className={`flex - 1 bg - slate - 100 dark: bg - slate - 700 / 50 rounded - 2xl flex items - center px - 3 py - 2 border border - transparent transition - all ${isAISelected ? 'focus-within:border-indigo-300 dark:focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/30' : 'focus-within:border-emerald-300 dark:focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-900/30'} `}>
                        <input
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder={isAISelected ? "Ask me anything..." : "Type a message..."}
                            className="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                        />
                        <button type="button" className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className={`p - 3 text - white rounded - full shadow - lg transition - all active: scale - 95 disabled: opacity - 50 disabled: shadow - none ${isAISelected ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'} `}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
