import { StoreSlice } from './types';
import { supabase } from '../supabaseClient';
import { Chat, ChatMessage } from '../types';

export const createCommunicationSlice: StoreSlice<any> = (set, get) => ({
    chats: [],
    messages: [],

    sendMessage: async (chatId: string, content: string, senderId?: string) => {
        const { currentUser } = get();
        const msgId = crypto.randomUUID();
        const payload = {
            id: msgId,
            company_id: currentUser.companyId,
            chat_id: chatId,
            sender_id: senderId || currentUser.id,
            content: content,
            timestamp: new Date().toISOString(),
            read_by: [currentUser.id]
        };
        await supabase.from('messages').insert(payload);

        const msg: ChatMessage = {
            id: msgId,
            chatId,
            senderId: senderId || currentUser.id,
            content,
            timestamp: payload.timestamp,
            readBy: [currentUser.id]
        };
        set((state) => ({ messages: [...state.messages, msg] }));
    },

    createChat: async (participantIds: string[], name?: string) => {
        const { currentUser } = get();
        const chatId = crypto.randomUUID();
        const allParticipants = [currentUser.id, ...participantIds];
        const payload = {
            id: chatId,
            company_id: currentUser.companyId,
            type: name ? 'GROUP' : 'DIRECT',
            name: name,
            participant_ids: allParticipants
        };
        await supabase.from('chats').insert(payload);

        const newChat: Chat = { id: chatId, type: payload.type as any, participantIds: allParticipants, name };
        set((state) => ({ chats: [newChat, ...state.chats] }));
    },

    deleteChat: (chatId: string) => {
        set((state) => ({ chats: state.chats.filter(c => c.id !== chatId) }));
    }
});
