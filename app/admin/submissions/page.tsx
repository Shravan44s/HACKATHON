'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useAuthHydrated, useTeamStore, useSubmissionStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/shared/Navbar';
import { toast } from 'sonner';
import type { Submission, SubmissionStatus } from '@/lib/types';
import { FileText, MessageSquare, Check, X, Eye, AlertCircle } from 'lucide-react';

const statusColors: Record<SubmissionStatus, string> = {
    draft: 'bg-gray-500/20 text-muted-foreground',
    submitted: 'bg-blue-500/20 text-blue-400',
    under_review: 'bg-yellow-500/20 text-yellow-400',
    feedback_received: 'bg-purple-500/20 text-purple-400',
    approved: 'bg-green-500/20 text-[var(--primary)]',
    rejected: 'bg-red-500/20 text-red-400',
};

export default function SubmissionsPage() {
    const [mounted, setMounted] = useState(false);
    const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
    const [feedback, setFeedback] = useState('');
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const hydrated = useAuthHydrated();
    const { teams } = useTeamStore();
    const { submissions, updateSubmission } = useSubmissionStore();

    useEffect(() => {
        setMounted(true);
        if (!hydrated) return;
        if (!isAuthenticated || user?.role !== 'admin') router.push('/login');
    }, [hydrated, isAuthenticated, user, router]);

    if (!mounted || !user) return null;

    const ideationSubs = submissions.filter(s => s.phase === 'ideation');
    const getTeamName = (teamId: string) => teams.find(t => t.id === teamId)?.teamName || 'Unknown';

    const updateStatus = (subId: string, status: SubmissionStatus, comment?: string) => {
        updateSubmission(subId, { status, adminComment: comment || undefined, updatedAt: new Date().toISOString() });
        toast.success(`Submission ${status === 'approved' ? 'approved ✅' : status === 'rejected' ? 'rejected ❌' : 'updated'}`);
        setSelectedSub(null);
        setFeedback('');
    };

    return (
        <div className="min-h-screen aurora-bg">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="font-display text-3xl font-bold flex items-center gap-2 mb-2">
                        <FileText className="w-8 h-8 text-cyan" /> Ideation Submissions
                    </h1>
                    <p className="text-muted-foreground mb-8">{ideationSubs.length} submissions</p>

                    {ideationSubs.length === 0 ? (
                        <Card className="glass-card border-0">
                            <CardContent className="py-12 text-center">
                                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">No ideation submissions yet.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ideationSubs.map((sub, i) => (
                                <motion.div
                                    key={sub.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -3 }}
                                >
                                    <Card className="glass-card border-0 hover:border-violet/20 transition-all cursor-pointer h-full" onClick={() => setSelectedSub(sub)}>
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <Badge className="bg-[var(--accent)] text-[var(--primary)] text-xs">{getTeamName(sub.teamId)}</Badge>
                                                <Badge className={statusColors[sub.status]}>{sub.status.replace('_', ' ')}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <h3 className="font-semibold mb-2">{sub.content.projectTitle || 'Untitled'}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{sub.content.problemStatement}</p>
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {sub.content.techStack?.slice(0, 3).map(t => (
                                                    <Badge key={t} variant="outline" className="text-xs border-[var(--surface-border)]">{t}</Badge>
                                                ))}
                                                {(sub.content.techStack?.length || 0) > 3 && (
                                                    <Badge variant="outline" className="text-xs border-[var(--surface-border)]">+{(sub.content.techStack?.length || 0) - 3}</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="ghost" className="text-cyan text-xs">
                                                    <Eye className="w-3 h-3 mr-1" /> View Details
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Detail Modal */}
                    <Dialog open={!!selectedSub} onOpenChange={() => setSelectedSub(null)}>
                        <DialogContent className="max-w-2xl glass-card border-0 max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-xl">{selectedSub?.content.projectTitle}</DialogTitle>
                            </DialogHeader>
                            {selectedSub && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-[var(--accent)] text-[var(--primary)]">{getTeamName(selectedSub.teamId)}</Badge>
                                        <Badge className={statusColors[selectedSub.status]}>{selectedSub.status.replace('_', ' ')}</Badge>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-3 rounded-xl bg-[var(--surface-raised)]">
                                            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Problem Statement</h4>
                                            <p className="text-sm whitespace-pre-wrap">{selectedSub.content.problemStatement}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[var(--surface-raised)]">
                                            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Proposed Solution</h4>
                                            <p className="text-sm whitespace-pre-wrap">{selectedSub.content.proposedSolution}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[var(--surface-raised)]">
                                            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Target Audience</h4>
                                            <p className="text-sm">{selectedSub.content.targetAudience}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Tech Stack</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedSub.content.techStack?.map(t => (
                                                    <Badge key={t} className="bg-cyan/10 text-cyan text-xs">{t}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                        {selectedSub.content.videoPitchUrl && (
                                            <div>
                                                <h4 className="text-xs font-semibold text-muted-foreground mb-1">Video Pitch</h4>
                                                <a href={selectedSub.content.videoPitchUrl} target="_blank" className="text-sm text-cyan hover:underline">{selectedSub.content.videoPitchUrl}</a>
                                            </div>
                                        )}
                                        {selectedSub.files.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Attachments ({selectedSub.files.length})</h4>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {selectedSub.files.map(f => (
                                                        <div key={f.id} className="p-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--surface-border)] text-center">
                                                            {f.type.startsWith('image/') ? (
                                                                <img src={f.url} alt={f.name} className="w-full h-20 object-cover rounded mb-1" />
                                                            ) : (
                                                                <FileText className="w-8 h-8 mx-auto mb-1 text-muted-foreground" />
                                                            )}
                                                            <p className="text-xs truncate">{f.name}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Feedback & Actions */}
                                    <div className="border-t border-[var(--surface-border)] pt-4">
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-[var(--primary)]" /> Feedback
                                        </h4>
                                        <Textarea
                                            placeholder="Add feedback for the team..."
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            className="bg-[var(--surface-raised)] border-[var(--surface-border)] mb-3"
                                        />
                                        <div className="flex gap-2">
                                            <Button onClick={() => updateStatus(selectedSub.id, 'approved', feedback)} className="bg-green-600 hover:bg-green-700 text-white">
                                                <Check className="w-4 h-4 mr-1" /> Approve
                                            </Button>
                                            <Button onClick={() => updateStatus(selectedSub.id, 'feedback_received', feedback)} variant="outline" className="border-yellow-500/30 text-yellow-400">
                                                <MessageSquare className="w-4 h-4 mr-1" /> Request Changes
                                            </Button>
                                            <Button onClick={() => updateStatus(selectedSub.id, 'rejected', feedback)} variant="outline" className="border-red-500/30 text-red-400">
                                                <X className="w-4 h-4 mr-1" /> Reject
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </motion.div>
            </div>
        </div>
    );
}
