import React from 'react';
import { Search, Plus, Bot, Sparkles, Zap, Users } from 'lucide-react';
import { User, Chat, UserRole } from '../../../../types';
import { formatDistanceToNow } from 'date-fns';


interface ChatListProps {
    chats: Chat[];
    users: User[];
    currentUser: User;
    selectedChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onOpenCreateGroup: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
    chats, users, currentUser, selectedChatId, onSelectChat, onOpenCreateGroup
}) => {
    const AI_CHAT_ID = 'ai-assistant-chat';
    const isAISelected = selectedChatId === AI_CHAT_ID;

    const getChatDetails = (chat: Chat) => {
        if (chat.id === AI_CHAT_ID) return { name: 'Gemini Assistant', avatar: null, isOnline: true, isBot: true };
        if (chat.type === 'GROUP') return { name: chat.name, avatar: null, isOnline: false };
        const otherUserId = chat.participantIds.find((id: string) => id !== currentUser.id);
        const otherUser = users.find(u => u.id === otherUserId);
        return { name: otherUser?.name || 'Unknown User', avatar: otherUser?.avatarUrl, isOnline: true };
    };

    return (
        <div className={`${selectedChatId ? 'hidden md:flex' : 'flex'} w-full md:w-80 md:border-r border-slate-200 dark:border-slate-700 flex-col bg-slate-50/30 dark:bg-slate-900/30 h-full`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 md:bg-transparent">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h2>
                    {currentUser.role === UserRole.ADMIN && (
                        <button
                            onClick={onOpenCreateGroup}
                            className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300"
                            title="Create Group"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-transparent border focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl text-sm focus:outline-none transition-all text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800">

                {/* PINNED AI ASSISTANT */}
                <div
                    onClick={() => onSelectChat(AI_CHAT_ID)}
                    className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-b border-slate-100 dark:border-slate-700 relative overflow-hidden group ${isAISelected ? 'bg-indigo-50/80 dark:bg-indigo-900/20 md:border-l-4 md:border-l-indigo-500' : 'hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 md:border-l-4 md:border-l-transparent'}`}
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <Bot className="w-7 h-7" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                        <div className="flex justify-between items-center mb-0.5">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                Gemini Assistant
                                <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-full uppercase font-bold border border-indigo-200 dark:border-indigo-700 flex items-center gap-1">
                                    <Sparkles className="w-2 h-2" /> AI
                                </span>
                            </h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                            Automated Agent
                        </p>
                    </div>
                </div>

                {/* Regular Chats */}
                {chats.map(chat => {
                    const details = getChatDetails(chat);
                    const isSelected = selectedChatId === chat.id;

                    return (
                        <div
                            key={chat.id}
                            onClick={() => onSelectChat(chat.id)}
                            className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0 ${isSelected ? 'bg-white dark:bg-slate-700/50 shadow-sm md:border-l-4 md:border-l-emerald-500' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30 md:border-l-4 md:border-l-transparent'}`}
                        >
                            <div className="relative">
                                {details.avatar ? (
                                    <img src={details.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-600" alt="" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                        <Users className="w-6 h-6" />
                                    </div>
                                )}
                                {details.isOnline && chat.type === 'DIRECT' && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`font-bold truncate text-base ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>{details.name}</h3>
                                    {chat.lastMessage && (
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                                            {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: false })}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm truncate ${isSelected ? 'text-slate-600 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {chat.lastMessage ? (
                                        <>
                                            {chat.lastMessage.senderId === currentUser.id && <span className="font-semibold text-slate-700 dark:text-slate-300">You: </span>}
                                            {chat.lastMessage.content}
                                        </>
                                    ) : (
                                        <span className="italic text-slate-400 dark:text-slate-500">No messages yet</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
