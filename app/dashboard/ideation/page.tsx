'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ideationSchema, type IdeationFormData } from '@/lib/validators';
import { useAuthStore, useAuthHydrated, useTeamStore, useSubmissionStore, usePhaseStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/shared/Navbar';
import FileUpload from '@/components/shared/FileUpload';
import { HACKATHON_CONFIG } from '@/lib/auth';
import { toast } from 'sonner';
import type { FileAttachment } from '@/lib/types';
import { Lightbulb, Send, Loader2, X, Plus, Lock } from 'lucide-react';

export default function IdeationPage() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<FileAttachment[]>([]);
    const [techInput, setTechInput] = useState('');
    const [selectedTech, setSelectedTech] = useState<string[]>([]);
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const hydrated = useAuthHydrated();
    const { teams } = useTeamStore();
    const { submissions, addSubmission, updateSubmission } = useSubmissionStore();
    const { phases } = usePhaseStore();

    useEffect(() => {
        setMounted(true);
        if (!hydrated) return;
        if (!isAuthenticated || !user) router.push('/login');
    }, [hydrated, isAuthenticated, user, router]);

    const team = teams.find(t => t.leader.email === user?.email || t.id === user?.teamId);
    const existingSubmission = team ? submissions.find(s => s.teamId === team.id && s.phase === 'ideation') : null;

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<IdeationFormData>({
        resolver: zodResolver(ideationSchema),
        defaultValues: {
            projectTitle: existingSubmission?.content.projectTitle || '',
            problemStatement: existingSubmission?.content.problemStatement || '',
            proposedSolution: existingSubmission?.content.proposedSolution || '',
            targetAudience: existingSubmission?.content.targetAudience || '',
            techStack: existingSubmission?.content.techStack || [],
            videoPitchUrl: existingSubmission?.content.videoPitchUrl || '',
        },
    });

    const addTech = (tech: string) => {
        if (tech && !selectedTech.includes(tech)) {
            const newTech = [...selectedTech, tech];
            setSelectedTech(newTech);
            setValue('techStack', newTech);
        }
        setTechInput('');
    };

    const removeTech = (tech: string) => {
        const newTech = selectedTech.filter(t => t !== tech);
        setSelectedTech(newTech);
        setValue('techStack', newTech);
    };

    const onSubmit = async (data: IdeationFormData) => {
        if (!team) { toast.error('No team found. Please enroll first.'); return; }
        setLoading(true);
        try {
            const submissionData = {
                id: existingSubmission?.id || crypto.randomUUID(),
                teamId: team.id,
                phase: 'ideation' as const,
                content: { ...data, techStack: selectedTech },
                files,
                status: 'submitted' as const,
                submittedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (existingSubmission) {
                updateSubmission(existingSubmission.id, submissionData);
            } else {
                addSubmission(submissionData);
            }

            toast.success('Ideation submitted successfully! 🚀');
            router.push('/dashboard');
        } catch {
            toast.error('Submission failed');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted || !user) return null;

    const isPhaseActive = phases.find(p => p.id === 'ideation')?.active ?? false;

    if (!isPhaseActive) {
        return (
            <div className="min-h-screen aurora-bg">
                <Navbar />
                <div className="max-w-xl mx-auto px-4 pt-32 pb-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
                            <Lock className="w-8 h-8 text-red-400" />
                        </div>
                        <h1 className="text-3xl font-display font-bold mb-3">Phase Locked</h1>
                        <p className="text-muted-foreground mb-6">The <strong>Ideation</strong> phase has not been activated by the admin yet. Please check back later.</p>
                        <Button onClick={() => router.push('/dashboard')} className="bg-[var(--primary)] text-[var(--primary-foreground)]">
                            Back to Dashboard
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen aurora-bg">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                            <Lightbulb className="w-4 h-4 text-[var(--primary)]" />
                            <span className="text-sm text-muted-foreground">Phase 1 — Ideation</span>
                        </div>
                        <h1 className="font-display text-3xl font-bold mb-2">
                            Submit Your <span className="gradient-text">Idea</span>
                        </h1>
                        {existingSubmission && (
                            <Badge className="bg-[var(--accent)] text-[var(--primary)]">{existingSubmission.status}</Badge>
                        )}
                    </div>

                    {/* Admin Feedback */}
                    {existingSubmission?.adminComment && (
                        <Card className="mb-6 bg-gold/5 border-gold/20">
                            <CardContent className="pt-4">
                                <p className="text-sm font-medium text-[var(--primary)] mb-1">Admin Feedback:</p>
                                <p className="text-sm text-muted-foreground">{existingSubmission.adminComment}</p>
                            </CardContent>
                        </Card>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Card className="glass-card border-0 glow-border">
                            <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Project Title</Label>
                                    <Input placeholder="My Awesome Project" className="bg-[var(--surface-raised)] border-[var(--surface-border)]" {...register('projectTitle')} />
                                    {errors.projectTitle && <p className="text-xs text-red-400">{errors.projectTitle.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Problem Statement</Label>
                                    <Textarea placeholder="What problem does your project solve?" className="bg-[var(--surface-raised)] border-[var(--surface-border)] min-h-[100px]" {...register('problemStatement')} />
                                    {errors.problemStatement && <p className="text-xs text-red-400">{errors.problemStatement.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Proposed Solution</Label>
                                    <Textarea placeholder="How will you solve this problem?" className="bg-[var(--surface-raised)] border-[var(--surface-border)] min-h-[100px]" {...register('proposedSolution')} />
                                    {errors.proposedSolution && <p className="text-xs text-red-400">{errors.proposedSolution.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Target Audience</Label>
                                    <Input placeholder="Who will benefit from this?" className="bg-[var(--surface-raised)] border-[var(--surface-border)]" {...register('targetAudience')} />
                                    {errors.targetAudience && <p className="text-xs text-red-400">{errors.targetAudience.message}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tech Stack */}
                        <Card className="glass-card border-0">
                            <CardHeader><CardTitle>Tech Stack</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedTech.map(t => (
                                        <Badge key={t} className="bg-[var(--accent)] text-[var(--primary)] cursor-pointer" onClick={() => removeTech(t)}>
                                            {t} <X className="w-3 h-3 ml-1" />
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(techInput); } }}
                                        placeholder="Type or select..."
                                        className="bg-[var(--surface-raised)] border-[var(--surface-border)]"
                                    />
                                    <Button type="button" variant="outline" onClick={() => addTech(techInput)} className="border-[var(--surface-border)]">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {HACKATHON_CONFIG.techStackOptions.slice(0, 20).map(t => (
                                        <Badge
                                            key={t}
                                            variant="outline"
                                            className={`cursor-pointer text-xs ${selectedTech.includes(t) ? 'bg-violet/20 border-violet text-violet' : 'border-[var(--surface-border)] hover:border-violet/50'}`}
                                            onClick={() => selectedTech.includes(t) ? removeTech(t) : addTech(t)}
                                        >
                                            {t}
                                        </Badge>
                                    ))}
                                </div>
                                {errors.techStack && <p className="text-xs text-red-400">{errors.techStack.message}</p>}
                            </CardContent>
                        </Card>

                        {/* File Upload */}
                        <Card className="glass-card border-0">
                            <CardHeader><CardTitle>Attachments</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FileUpload files={files} onChange={setFiles} />
                                <div className="space-y-2">
                                    <Label>Video Pitch URL (optional)</Label>
                                    <Input placeholder="https://youtube.com/watch?v=..." className="bg-[var(--surface-raised)] border-[var(--surface-border)]" {...register('videoPitchUrl')} />
                                </div>
                            </CardContent>
                        </Card>

                        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r bg-[var(--primary)] text-[var(--primary-foreground)] py-6 text-lg font-semibold rounded-xl">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                            {existingSubmission ? 'Update Submission' : 'Submit for Review'}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
