'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore, useAuthHydrated } from '@/lib/store';
import { AGENTS_CONFIG } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/shared/Navbar';
import { toast } from 'sonner';
import type { AgentType } from '@/lib/types';
import { Bot, Send, Loader2, ArrowLeft, Copy, Sparkles } from 'lucide-react';

export default function AgentsPage() {
    const [mounted, setMounted] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [formData, setFormData] = useState<Record<string, string>>({});
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const hydrated = useAuthHydrated();

    useEffect(() => {
        setMounted(true);
        if (!hydrated) return;
        if (!isAuthenticated || !user) router.push('/login');
    }, [hydrated, isAuthenticated, user, router]);

    if (!mounted || !user) return null;

    const agentInfo = AGENTS_CONFIG.find(a => a.type === selectedAgent);

    const sendChatMessage = async () => {
        if (!chatInput.trim() || !selectedAgent) return;
        const newMsg = { role: 'user' as const, content: chatInput };
        setChatMessages(prev => [...prev, newMsg]);
        setChatInput('');
        setLoading(true);

        try {
            const res = await fetch(`/api/agents/${selectedAgent}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: chatInput, history: chatMessages }),
            });
            const data = await res.json();
            const reply = data.response || data.fallback || 'Unable to get a response. Check your GEMINI_API_KEY.';
            setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch {
            setChatMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    const submitForm = async () => {
        if (!selectedAgent || !agentInfo?.inputFields) return;
        const message = agentInfo.inputFields.map(f => `${f.label}: ${formData[f.name] || 'Not provided'}`).join('\n');
        setLoading(true);
        setResult('');

        try {
            const res = await fetch(`/api/agents/${selectedAgent}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });
            const data = await res.json();
            setResult(data.response || data.fallback || 'Unable to get a response.');
        } catch {
            setResult('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Agent Grid View
    if (!selectedAgent) {
        return (
            <div className="min-h-screen aurora-bg">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                                <Sparkles className="w-4 h-4 text-violet" />
                                <span className="text-sm text-muted-foreground">AI-Powered</span>
                            </div>
                            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                                <span className="gradient-text">AI Agents</span> Hub
                            </h1>
                            <p className="text-muted-foreground">Your AI-powered toolkit to ideate, code, pitch, and win.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {AGENTS_CONFIG.map((agent, i) => (
                                <motion.div
                                    key={agent.type}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    onClick={() => {
                                        setSelectedAgent(agent.type);
                                        setChatMessages([]);
                                        setResult('');
                                        setFormData({});
                                    }}
                                    className="cursor-pointer group"
                                >
                                    <Card className="glass-card border-0 hover:border-violet/30 transition-all duration-300 h-full glow-border">
                                        <CardContent className="pt-6">
                                            <div
                                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
                                                style={{ background: `${agent.color}15` }}
                                            >
                                                {agent.icon}
                                            </div>
                                            <h3 className="text-lg font-semibold mb-1 group-hover:text-violet transition-colors">
                                                {agent.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">{agent.description}</p>
                                            <div className="mt-3">
                                                <span
                                                    className="text-xs px-2 py-1 rounded-full"
                                                    style={{ background: `${agent.color}15`, color: agent.color }}
                                                >
                                                    {agent.isChat ? '💬 Chat' : '📝 Form'}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Agent Detail View
    return (
        <div className="min-h-screen aurora-bg">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Button variant="ghost" onClick={() => setSelectedAgent(null)} className="mb-6 text-muted-foreground hover:text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Agents
                    </Button>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${agentInfo?.color}15` }}>
                            {agentInfo?.icon}
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-bold">{agentInfo?.name}</h1>
                            <p className="text-sm text-muted-foreground">{agentInfo?.description}</p>
                        </div>
                    </div>

                    {/* Chat-based agents */}
                    {agentInfo?.isChat ? (
                        <Card className="glass-card border-0 glow-border">
                            <CardContent className="pt-6">
                                <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4 p-4 rounded-xl bg-[var(--surface)]">
                                    {chatMessages.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-8">Start a conversation with {agentInfo.name}...</p>
                                    )}
                                    {chatMessages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-violet text-white' : 'bg-[var(--surface-raised)] border border-[var(--surface-border)]'}`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="bg-[var(--surface-raised)] border border-[var(--surface-border)] rounded-xl px-4 py-3">
                                                <Loader2 className="w-4 h-4 animate-spin text-violet" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                                        placeholder="Type your message..."
                                        className="bg-[var(--surface-raised)] border-[var(--surface-border)]"
                                    />
                                    <Button onClick={sendChatMessage} disabled={loading} className="bg-violet hover:bg-violet-dark text-white">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        /* Form-based agents */
                        <div className="space-y-6">
                            <Card className="glass-card border-0 glow-border">
                                <CardHeader><CardTitle>Input</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {agentInfo?.inputFields?.map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <Label>{field.label}</Label>
                                            {field.type === 'textarea' ? (
                                                <Textarea
                                                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                    className="bg-[var(--surface-raised)] border-[var(--surface-border)] min-h-[80px]"
                                                    value={formData[field.name] || ''}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                                />
                                            ) : field.type === 'select' ? (
                                                <Select onValueChange={(val) => { setFormData(prev => Object.assign({}, prev, { [field.name]: val || '' })); }}>
                                                    <SelectTrigger className="bg-[var(--surface-raised)] border-[var(--surface-border)]"><SelectValue placeholder="Select..." /></SelectTrigger>
                                                    <SelectContent className="glass-card border-0">
                                                        {field.options?.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input
                                                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                    className="bg-[var(--surface-raised)] border-[var(--surface-border)]"
                                                    value={formData[field.name] || ''}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <Button onClick={submitForm} disabled={loading} className="w-full bg-gradient-to-r bg-[var(--primary)] text-[var(--primary-foreground)] py-5 rounded-xl font-semibold">
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                        Generate
                                    </Button>
                                </CardContent>
                            </Card>

                            {result && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <Card className="glass-card border-0 glow-border-cyan">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-2"><Bot className="w-5 h-5 text-cyan" /> Result</CardTitle>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied to clipboard!'); }}
                                                >
                                                    <Copy className="w-4 h-4 mr-1" /> Copy
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="prose max-w-none text-sm whitespace-pre-wrap bg-dark rounded-xl p-4 max-h-[500px] overflow-y-auto">
                                                {result}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
