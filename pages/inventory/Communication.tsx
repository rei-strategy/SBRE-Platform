import React, { useContext, useState } from 'react';
import { StoreContext } from '../../store';
import { useAgenticAI } from './communication/hooks/useAgenticAI';
import { ChatList } from './communication/components/ChatList';
import { ChatWindow } from './communication/components/ChatWindow';
import { CreateGroupModal } from './communication/components/CreateGroupModal';

export const Communication: React.FC = () => {
    const store = useContext(StoreContext);

    // State
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    // AI Logic
    const { isAiTyping, runAgenticWorkflow } = useAgenticAI();

    if (!store) return null;

    const {
        chats, currentUser, users, sendMessage, createChat
    } = store;

    // Derived Data
    const AI_CHAT_ID = 'ai-assistant-chat';
    const isAISelected = selectedChatId === AI_CHAT_ID;

    // Filter chats involving current user
    const regularChats = chats.filter(c => c.participantIds.includes(currentUser.id));

    // Use regularChats to find active chat, or if it's AI, undefined
    const activeChat = isAISelected ? undefined : regularChats.find(c => c.id === selectedChatId);

    // Filter messages for the selected chat
    const activeMessages = isAISelected
        ? store.messages.filter(m => m.chatId === AI_CHAT_ID)
        : store.messages.filter(m => m.chatId === selectedChatId);

    // Handlers
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedChatId) return;

        const input = messageInput;

        // 1. Send User Message
        sendMessage(selectedChatId, input);
        setMessageInput('');

        // 2. Trigger AI if selected
        if (isAISelected) {
            runAgenticWorkflow(input);
        }
    };

    const handleCreateGroup = (name: string, members: string[]) => {
        createChat(members, name);
    };

    return (
        <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] flex flex-col md:flex-row bg-white dark:bg-slate-800 md:rounded-2xl md:border border-slate-200 dark:border-slate-700 md:shadow-sm overflow-hidden -mx-4 md:mx-0 mt-[-1rem] md:mt-0">

            <ChatList
                chats={regularChats}
                users={users}
                currentUser={currentUser}
                selectedChatId={selectedChatId}
                onSelectChat={setSelectedChatId}
                onOpenCreateGroup={() => setIsGroupModalOpen(true)}
            />

            <ChatWindow
                selectedChatId={selectedChatId}
                activeChat={activeChat}
                activeMessages={activeMessages}
                currentUser={currentUser}
                users={users}
                isAiTyping={isAiTyping}
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                onSendMessage={handleSendMessage}
                onBack={() => setSelectedChatId(null)}
            />

            <CreateGroupModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                users={users}
                currentUser={currentUser}
                onCreateGroup={handleCreateGroup}
            />
        </div>
    );
};