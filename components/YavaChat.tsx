import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { YAVA_SYSTEM_PROMPT } from '../utils/yavaSystemPrompt';
import { YavaTools } from '../utils/yavaTools';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
// Note: In a real app, use an environment variable for the API key.
// For this context, we'll assume the user has one or we'll hint at where to put it.
// defaulting to a placeholder or expecting it from env.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(API_KEY);

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
}

export const YavaChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Chat session reference to keep history context if needed, 
    // though we might just send the full history each time for simplicity in this stateless component.
    // Using a ref to store the model instance if we wanted a persistent chat session.

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);
    const toggleExpand = () => setIsExpanded(!isExpanded);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // 1. Prepare history for Gemini
            // We'll combine system prompt + recent messages
            // Gemini Node SDK supports 'system_instruction' in the model config or we can prepend it.
            // For safe typing and simple usage, we'll prepend.

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: YAVA_SYSTEM_PROMPT }]
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I am Yava. I am ready to help." }]
                    },
                    ...messages.map(m => ({
                        role: m.role,
                        parts: [{ text: m.content }]
                    }))
                ],
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            // 2. Send message
            const result = await chat.sendMessage(userMsg.content);
            const responseRef = result.response;
            let text = responseRef.text();

            // 3. Tool Calling Check (Native or Manual)
            // Since we defined manual JSON tools in the prompt, let's parse for JSON.
            // The prompt says: "If you need to perform an action, output the JSON tool call on a single line."

            let toolResponseText = "";

            try {
                // Attempt to find a JSON block or line
                // Simple heuristic: look for { "tool": ... }
                if (text.trim().startsWith('{') && text.includes('"tool":')) {
                    const toolCall = JSON.parse(text);
                    // Execute tool
                    if (YavaTools[toolCall.tool as keyof typeof YavaTools]) {
                        const toolFn = YavaTools[toolCall.tool as keyof typeof YavaTools];
                        // @ts-ignore
                        const toolResult = await toolFn(toolCall);

                        // Feed result back to model
                        const toolReusltMsg = `Tool ${toolCall.tool} Result: ${toolResult}`;
                        const followUp = await chat.sendMessage(toolReusltMsg);
                        text = followUp.response.text();
                    }
                }
            } catch (e) {
                console.error("Error parsing or executing tool", e);
                // Fail silently and just show the text, or append error
            }

            const modelMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: text,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, modelMsg]);

        } catch (error) {
            console.error("Gemini Error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: "I'm having trouble connecting right now. Please try again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none ${isOpen ? 'w-full md:w-auto' : ''}`}>
            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`
            pointer-events-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 
            flex flex-col mb-4 transition-all duration-300 origin-bottom-right overflow-hidden
            ${isExpanded ? 'w-[90vw] h-[80vh] md:w-[800px] md:h-[600px]' : 'w-[90vw] h-[60vh] md:w-[400px] md:h-[500px]'}
          `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-teal-600 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="font-bold text-sm">Y</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Yava Assistant</h3>
                                <p className="text-xs text-teal-100">Online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={toggleExpand} className="p-1 hover:bg-white/10 rounded transition-colors">
                                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                            <button onClick={toggleChat} className="p-1 hover:bg-white/10 rounded transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                        {messages.length === 0 && (
                            <div className="text-center text-slate-400 mt-8 text-sm">
                                <p>Hello! I'm Yava.</p>
                                <p>How can I help you today?</p>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                    max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm
                    ${msg.role === 'user'
                                            ? 'bg-teal-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'}
                  `}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none px-4 py-2 shadow-sm border border-slate-100 dark:border-slate-700">
                                    <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type a message..."
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!input.trim() || isLoading}
                                className="p-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-sm"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className={`
          pointer-events-auto w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center
          ${isOpen ? 'rotate-90 opacity-0 scale-50 absolute' : 'opacity-100 scale-100'}
        `}
            >
                <MessageSquare className="w-7 h-7" />
            </button>
            {isOpen && (
                <button
                    onClick={toggleChat}
                    className="pointer-events-auto h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-lg flex items-center justify-center mt-2 transition-all mr-2"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};
