"use client";

import React, { useState, useRef, useEffect, useContext } from 'react';
import { ArrowLeft, MessageCircle, Send } from 'lucide-react';
import { StoreContext } from '../../store';
import { useMapContext } from './MapContext';

interface ChatPopupProps {
    techId: string;
    techName: string;
    avatarUrl?: string;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ techId, techName, avatarUrl }) => {
    const { setChattingTechId } = useMapContext();
    const store = useContext(StoreContext);
    const currentUser = store?.currentUser;
    const chats = store?.chats || [];
    const messages = store?.messages || [];
    const sendMessage = store?.sendMessage;
    const createChat = store?.createChat;

    const [messageInput, setMessageInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Find active chat
    const activeChat = chats.find(c =>
        c.type === 'DIRECT' &&
        c.participantIds.includes(currentUser?.id || '') &&
        c.participantIds.includes(techId)
    );

    const chatMessages = activeChat ? messages.filter(m => m.chatId === activeChat.id) : [];

    // Scroll to bottom
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !currentUser || !sendMessage || !createChat) return;

        let chat = activeChat;

        if (!chat) {
            // Create new chat if doesn't exist
            await createChat([techId]);
            // Optimistically try to find it again (or rely on store update)
            // In a real scenario, createChat should return the ID.
            // For now, we rely on the store updating the chats list.
        }

        // Re-find chat after creation attempt
        chat = store?.chats.find(c =>
            c.type === 'DIRECT' &&
            c.participantIds.includes(currentUser.id) &&
            c.participantIds.includes(techId)
        );

        if (chat) {
            sendMessage(chat.id, messageInput);
            setMessageInput('');
        } else {
            alert("Starting new chat... please try sending again in a moment.");
        }
    };

    return (
        <div className="flex flex-col bg-white w-full font-sans h-[400px]" onClick={(e) => e.stopPropagation()}>
            {/* Chat Header */}
            <div className="p-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                <button
                    onClick={(e) => { e.stopPropagation(); setChattingTechId(null); }}
                    className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <img src={avatarUrl} alt={techName} className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-emerald-500"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">{techName}</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Technician</p>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-xs">Start a conversation with {techName.split(' ')[0]}</p>
                    </div>
                ) : (
                    chatMessages.map(msg => {
                        const isMe = msg.senderId === currentUser?.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-2.5 rounded-xl text-sm ${isMe
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-slate-100">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-100 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPopup;
