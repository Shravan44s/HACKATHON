'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { developmentUpdateSchema, type DevelopmentUpdateFormData } from '@/lib/validators';
import { useAuthStore, useAuthHydrated, useTeamStore, useSubmissionStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';
import ChatWidget from '@/components/shared/ChatWidget';
import FileUpload from '@/components/shared/FileUpload';
import { toast } from 'sonner';
import type { FileAttachment } from '@/lib/types';
import { Code, Send, Loader2, GitBranch, CheckCircle2, Clock } from 'lucide-react';

const defaultMilestones = [
    { id: '1', text: 'Project architecture designed', completed: false },
    { id: '2', text: 'Core features implemented', completed: false },
    { id: '3', text: 'Database/API integration complete', completed: false },
    { id: '4', text: 'UI/UX polished', completed: false },
    { id: '5', text: 'Testing and bug fixes', completed: false },
    { id: '6', text: 'Demo ready', completed: false },
];

export default function DevelopmentPage() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<FileAttachment[]>([]);
    const [milestones, setMilestones] = useState(defaultMilestones);
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
    const devSubmissions = team ? submissions.filter(s => s.teamId === team.id && s.phase === 'development').sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()) : [];

    const { register, handleSubmit, formState: { errors }, reset } = useForm<DevelopmentUpdateFormData>({
        resolver: zodResolver(developmentUpdateSchema),
    });

    const onSubmit = async (data: DevelopmentUpdateFormData) => {
        if (!team) { toast.error('No team found.'); return; }
        setLoading(true);
        try {
            addSubmission({
                id: crypto.randomUUID(),
                teamId: team.id,
                phase: 'development',
                content: {
                    ...data,
                    milestones,
                },
                files,
                status: 'submitted',
                submittedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            toast.success('Progress update submitted! 📝');
            reset();
            setFiles([]);
        } catch {
            toast.error('Failed to submit update');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted || !user) return null;

    return (
        <div className="min-h-screen bg-background aurora-bg">
            <Navbar />
            <ChatWidget />
            <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                            <Code className="w-4 h-4 text-cyan" />
                            <span className="text-sm text-muted-foreground">Phase 2 — Development</span>
                        </div>
                        <h1 className="font-display text-3xl font-bold mb-2">
                            <span className="gradient-text">Development</span> Tracker
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Update Form */}
                        <div className="lg:col-span-3">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <Card className="bg-white border-surface-border glow-border">
                                    <CardHeader><CardTitle>Progress Update</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>What did you build today?</Label>
                                            <Textarea placeholder="Describe your progress..." className="bg-surface-raised border-surface-border min-h-[100px]" {...register('progressUpdate')} />
                                            {errors.progressUpdate && <p className="text-xs text-red-400">{errors.progressUpdate.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Blockers (optional)</Label>
                                            <Textarea placeholder="Any challenges or blockers?" className="bg-surface-raised border-surface-border" {...register('blockers')} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Next Steps</Label>
                                            <Textarea placeholder="What's planned next?" className="bg-surface-raised border-surface-border" {...register('nextSteps')} />
                                            {errors.nextSteps && <p className="text-xs text-red-400">{errors.nextSteps.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>GitHub Repository URL</Label>
                                            <div className="relative">
                                                <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input placeholder="https://github.com/..." className="pl-10 bg-surface-raised border-surface-border" {...register('githubRepoUrl')} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Milestones */}
                                <Card className="bg-white border-surface-border">
                                    <CardHeader><CardTitle>Milestone Checklist</CardTitle></CardHeader>
                                    <CardContent className="space-y-2">
                                        {milestones.map((m, i) => (
                                            <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-raised">
                                                <Checkbox
                                                    checked={m.completed}
                                                    onCheckedChange={(checked) => {
                                                        const updated = [...milestones];
                                                        updated[i] = { ...m, completed: checked === true };
                                                        setMilestones(updated);
                                                    }}
                                                />
                                                <span className={`text-sm ${m.completed ? 'line-through text-muted-foreground' : ''}`}>{m.text}</span>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <FileUpload files={files} onChange={setFiles} label="Screenshots & Diagrams" />

                                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan to-violet text-white py-5 rounded-xl font-semibold">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                    Submit Update
                                </Button>
                            </form>
                        </div>

                        {/* Build Log */}
                        <div className="lg:col-span-2">
                            <Card className="bg-white border-surface-border">
                                <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Clock className="w-5 h-5 text-cyan" /> Build Log</CardTitle></CardHeader>
                                <CardContent>
                                    {devSubmissions.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No updates yet. Submit your first progress update!</p>
                                    ) : (
                                        <div className="space-y-4 relative">
                                            <div className="absolute left-4 top-0 bottom-0 w-px bg-surface-border" />
                                            {devSubmissions.map((sub, i) => (
                                                <motion.div
                                                    key={sub.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="relative pl-10"
                                                >
                                                    <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-cyan border-2 border-dark" />
                                                    <div className="p-3 rounded-xl bg-surface-raised border border-surface-border">
                                                        <p className="text-xs text-muted-foreground mb-1">
                                                            {new Date(sub.submittedAt).toLocaleString()}
                                                        </p>
                                                        <p className="text-sm">{sub.content.progressUpdate}</p>
                                                        {sub.content.blockers && (
                                                            <p className="text-xs text-red-400 mt-1">⚠️ {sub.content.blockers}</p>
                                                        )}
                                                        {sub.adminComment && (
                                                            <div className="mt-2 p-2 rounded bg-gold/5 border border-gold/20">
                                                                <p className="text-xs text-gold">Admin: {sub.adminComment}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
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
