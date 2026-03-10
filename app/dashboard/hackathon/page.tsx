'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hackathonUpdateSchema, type HackathonUpdateFormData } from '@/lib/validators';
import { useAuthStore, useAuthHydrated, useTeamStore, useSubmissionStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';
import CountdownTimer from '@/components/shared/CountdownTimer';
import FileUpload from '@/components/shared/FileUpload';
import { HACKATHON_CONFIG } from '@/lib/auth';
import { toast } from 'sonner';
import type { FileAttachment } from '@/lib/types';
import { Zap, Send, Loader2, MessageCircle, Link2, AlertTriangle } from 'lucide-react';

export default function HackathonPage() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<FileAttachment[]>([]);
    const [isFinal, setIsFinal] = useState(false);
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const hydrated = useAuthHydrated();
    const { teams } = useTeamStore();
    const { submissions, addSubmission } = useSubmissionStore();

    useEffect(() => {
        setMounted(true);
        if (!hydrated) return;
        if (!isAuthenticated || !user) router.push('/login');
    }, [hydrated, isAuthenticated, user, router]);

    const team = teams.find(t => t.leader.email === user?.email || t.id === user?.teamId);
    const hackSubmissions = team ? submissions.filter(s => s.teamId === team.id && s.phase === 'hackathon').sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()) : [];
    const hasFinalSubmission = hackSubmissions.some(s => s.content.isFinalSubmission);

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<HackathonUpdateFormData>({
        resolver: zodResolver(hackathonUpdateSchema),
        defaultValues: { isFinalSubmission: false },
    });

    const onSubmit = async (data: HackathonUpdateFormData) => {
        if (!team) { toast.error('No team found.'); return; }
        if (hasFinalSubmission) { toast.error('Final submission already made!'); return; }
        setLoading(true);
        try {
            addSubmission({
                id: crypto.randomUUID(),
                teamId: team.id,
                phase: 'hackathon',
                content: { ...data, isFinalSubmission: isFinal },
                files,
                status: isFinal ? 'submitted' : 'draft',
                submittedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            toast.success(isFinal ? '🏁 Final submission locked!' : 'Update submitted!');
            reset();
            setFiles([]);
            setIsFinal(false);
        } catch {
            toast.error('Submission failed');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted || !user) return null;

    return (
        <div className="min-h-screen aurora-bg">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                            <Zap className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-muted-foreground">Phase 3 — 24h Hackathon</span>
                        </div>
                        <h1 className="font-display text-3xl font-bold mb-4">
                            <span className="gradient-text">Live Hackathon</span>
                        </h1>
                    </div>

                    {/* Countdown */}
                    <div className="mb-8">
                        <CountdownTimer targetDate={HACKATHON_CONFIG.endDate} label="Time Remaining" size="sm" />
                    </div>

                    {hasFinalSubmission && (
                        <Card className="mb-6 bg-green-500/5 border-green-500/20">
                            <CardContent className="pt-4 text-center">
                                <p className="text-[var(--primary)] font-semibold">🏁 Final submission has been locked!</p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Update Form */}
                        <div className="lg:col-span-3">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <Card className="glass-card border-0 glow-border">
                                    <CardHeader><CardTitle>Push Update</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>What changed?</Label>
                                            <Textarea placeholder="Describe recent changes..." className="bg-[var(--surface-raised)] border-[var(--surface-border)] min-h-[80px]" {...register('whatChanged')} />
                                            {errors.whatChanged && <p className="text-xs text-red-400">{errors.whatChanged.message}</p>}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>What&apos;s working?</Label>
                                                <Textarea placeholder="Working features..." className="bg-[var(--surface-raised)] border-[var(--surface-border)]" {...register('whatsWorking')} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>What&apos;s broken?</Label>
                                                <Textarea placeholder="Known issues..." className="bg-[var(--surface-raised)] border-[var(--surface-border)]" {...register('whatsBroken')} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Demo Link</Label>
                                            <div className="relative">
                                                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input placeholder="https://your-demo.vercel.app" className="pl-10 bg-[var(--surface-raised)] border-[var(--surface-border)]" {...register('demoLink')} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <FileUpload files={files} onChange={setFiles} label="Screenshots & Media" />

                                {/* Final Submission Toggle */}
                                {!hasFinalSubmission && (
                                    <Card className="bg-red-500/5 border-red-500/20">
                                        <CardContent className="pt-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                                    <div>
                                                        <p className="text-sm font-medium text-red-400">Final Submission</p>
                                                        <p className="text-xs text-muted-foreground">This locks your submission. Cannot be undone!</p>
                                                    </div>
                                                </div>
                                                <Switch
                                                    checked={isFinal}
                                                    onCheckedChange={(c) => { setIsFinal(c); setValue('isFinalSubmission', c); }}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <Button type="submit" disabled={loading || hasFinalSubmission} className={`w-full py-5 rounded-xl font-semibold ${isFinal ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-violet to-cyan'} text-white`}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                    {isFinal ? '🏁 Lock Final Submission' : 'Push Update'}
                                </Button>
                            </form>
                        </div>

                        {/* Updates & Judge Comments */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="glass-card border-0">
                                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><MessageCircle className="w-5 h-5 text-[var(--primary)]" /> Activity</CardTitle></CardHeader>
                                <CardContent>
                                    {hackSubmissions.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No updates yet. Push your first update!</p>
                                    ) : (
                                        <div className="space-y-3 max-h-96 overflow-y-auto">
                                            {hackSubmissions.map((sub) => (
                                                <div key={sub.id} className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--surface-border)]">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-muted-foreground">{new Date(sub.submittedAt).toLocaleTimeString()}</span>
                                                        {sub.content.isFinalSubmission && <Badge className="bg-red-500/20 text-red-400 text-xs">Final</Badge>}
                                                    </div>
                                                    <p className="text-sm">{sub.content.whatChanged}</p>
                                                    {sub.judgeComments?.map(jc => (
                                                        <div key={jc.id} className="mt-2 p-2 rounded bg-gold/5 border border-gold/20">
                                                            <p className="text-xs text-[var(--primary)] font-medium">{jc.judge}:</p>
                                                            <p className="text-xs text-muted-foreground">{jc.comment}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
