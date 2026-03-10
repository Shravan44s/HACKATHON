'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const WELCOME = "Hi! I'm your Make It Happen AI assistant 🤖 I can help with hackathon strategy, ideation, code review, and anything else. What can I help you with?";

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([{ id: '0', role: 'assistant', content: WELCOME }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(1);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthStore();

    useEffect(() => {
        if (open) {
            setUnread(0);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
        }
    }, [open, messages]);

    const send = async () => {
        const text = input.trim();
        if (!text || loading) return;
        setInput('');
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);
        try {
            const res = await fetch('/api/agents/guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
                    userContext: user ? { name: user.name, role: user.role } : undefined,
                }),
            });
            const data = await res.json();
            const reply = data.response || data.message || "I'm having trouble connecting. Please try again!";
            setMessages(prev => [...prev, { id: Date.now().toString() + '_r', role: 'assistant', content: reply }]);
        } catch {
            setMessages(prev => [...prev, { id: Date.now().toString() + '_e', role: 'assistant', content: "Network error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* FAB button */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-2xl flex items-center justify-center cursor-pointer"
                aria-label="Toggle AI assistant"
            >
                <AnimatePresence mode="wait">
                    {open
                        ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-5 h-5" /></motion.div>
                        : <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Bot className="w-5 h-5" /></motion.div>
                    }
                </AnimatePresence>
                {!open && unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-background">
                        {unread}
                    </span>
                )}
            </motion.button>

            {/* Chat panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        className="fixed bottom-24 right-6 z-[99] w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden flex flex-col"
                        style={{
                            height: 480,
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--primary)' }}>
                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">AI Assistant</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                                    <p className="text-[10px] text-white/70">Online</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'var(--muted)' }}>
                            {messages.map(msg => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                                            <Bot className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'rounded-br-sm text-white'
                                            : 'rounded-bl-sm text-foreground'
                                        }`}
                                        style={{
                                            background: msg.role === 'user' ? 'var(--primary)' : 'var(--card)',
                                            border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                                        }}
                                    >
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex items-end gap-2">
                                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                                        <Bot className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="flex gap-2 p-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                                placeholder="Ask me anything…"
                                disabled={loading}
                                className="flex-1 text-sm rounded-xl px-3.5 py-2 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.94 }}
                                onClick={send}
                                disabled={loading || !input.trim()}
                                className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-40 flex-shrink-0 cursor-pointer text-white"
                                style={{ background: 'var(--primary)' }}
                            >
                                <Send className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
