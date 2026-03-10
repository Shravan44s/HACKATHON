'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore, useAuthHydrated, useTeamStore, useSubmissionStore, useScoreStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/shared/Navbar';
import { toast } from 'sonner';
import { Zap, Trophy, MessageSquare, Send, Eye, EyeOff, RefreshCw } from 'lucide-react';

const ROUND1_CRITERIA = ['Innovation', 'Feasibility', 'Presentation'];
const ROUND2_CRITERIA = ['Technical Execution', 'Impact', 'Demo Quality'];

export default function HackathonControlPage() {
    const [mounted, setMounted] = useState(false);
    const [scoreTeamId, setScoreTeamId] = useState('');
    const [round, setRound] = useState(1);
    const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>({});
    const [scoreNotes, setScoreNotes] = useState('');
    const [commentTeamId, setCommentTeamId] = useState('');
    const [commentText, setCommentText] = useState('');
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const hydrated = useAuthHydrated();
    const { teams } = useTeamStore();
    const { submissions, updateSubmission } = useSubmissionStore();
    const { scores, addScore, toggleRelease } = useScoreStore();

    useEffect(() => {
        setMounted(true);
        if (!hydrated) return;
        if (!isAuthenticated || user?.role !== 'admin') router.push('/login');
    }, [hydrated, isAuthenticated, user, router]);

    if (!mounted || !user) return null;

    const hackSubs = submissions.filter(s => s.phase === 'hackathon').sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    const getTeamName = (id: string) => teams.find(t => t.id === id)?.teamName || 'Unknown';
    const criteria = round === 1 ? ROUND1_CRITERIA : ROUND2_CRITERIA;

    const submitScore = () => {
        if (!scoreTeamId) { toast.error('Select a team'); return; }
        const total = Object.values(criteriaScores).reduce((s, v) => s + v, 0);
        addScore({
            id: crypto.randomUUID(),
            teamId: scoreTeamId,
            phase: 'hackathon',
            round,
            criteria: criteriaScores,
            total,
            released: false,
            notes: scoreNotes,
            evaluator: user.name,
        });
        toast.success(`Score saved for ${getTeamName(scoreTeamId)} — Round ${round}`);
        setCriteriaScores({});
        setScoreNotes('');
        setScoreTeamId('');
    };

    const postComment = (submissionId: string) => {
        if (!commentText.trim()) return;
        const sub = submissions.find(s => s.id === submissionId);
        if (!sub) return;
        const newComment = {
            id: crypto.randomUUID(),
            judge: user.name,
            comment: commentText,
            timestamp: new Date().toISOString(),
        };
        updateSubmission(submissionId, { judgeComments: [...(sub.judgeComments || []), newComment] });
        toast.success('Comment posted!');
        setCommentText('');
        setCommentTeamId('');
    };

    // Build leaderboard
    const leaderboard = teams.map(t => {
        const teamScores = scores.filter(s => s.teamId === t.id);
        const totalScore = teamScores.reduce((sum, s) => sum + s.total, 0);
        return { teamId: t.id, teamName: t.teamName, domain: t.domain, totalScore, roundScores: teamScores };
    }).sort((a, b) => b.totalScore - a.totalScore);

    return (
        <div className="min-h-screen aurora-bg">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="font-display text-3xl font-bold flex items-center gap-2 mb-2">
                        <Zap className="w-8 h-8 text-red-400" /> Hackathon Control Panel
                    </h1>
                    <p className="text-muted-foreground mb-8">Manage the 24-hour hackathon</p>

                    <Tabs defaultValue="feed" className="space-y-6">
                        <TabsList className="bg-white border border-[var(--surface-border)]">
                            <TabsTrigger value="feed">Live Feed</TabsTrigger>
                            <TabsTrigger value="scoring">Evaluation</TabsTrigger>
                            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                        </TabsList>

                        {/* Live Feed */}
                        <TabsContent value="feed">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Team Updates</h2>
                                <Badge className="bg-green-500/20 text-[var(--primary)]">
                                    <RefreshCw className="w-3 h-3 mr-1" /> Live
                                </Badge>
                            </div>
                            {hackSubs.length === 0 ? (
                                <Card className="glass-card border-0">
                                    <CardContent className="py-12 text-center text-muted-foreground">No hackathon updates yet.</CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {hackSubs.map((sub) => (
                                        <Card key={sub.id} className="glass-card border-0">
                                            <CardContent className="pt-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-[var(--accent)] text-[var(--primary)]">{getTeamName(sub.teamId)}</Badge>
                                                        {sub.content.isFinalSubmission && <Badge className="bg-red-500/20 text-red-400">Final</Badge>}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{new Date(sub.submittedAt).toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm mb-2">{sub.content.whatChanged}</p>
                                                {sub.content.whatsWorking && <p className="text-xs text-[var(--primary)]">✅ {sub.content.whatsWorking}</p>}
                                                {sub.content.whatsBroken && <p className="text-xs text-red-400">❌ {sub.content.whatsBroken}</p>}
                                                {sub.content.demoLink && <a href={sub.content.demoLink} target="_blank" className="text-xs text-cyan hover:underline">🔗 Demo</a>}

                                                {/* Judge comments on this update */}
                                                {sub.judgeComments?.map(jc => (
                                                    <div key={jc.id} className="mt-2 p-2 rounded-lg bg-gold/5 border border-gold/20">
                                                        <p className="text-xs"><span className="text-[var(--primary)] font-medium">{jc.judge}:</span> {jc.comment}</p>
                                                    </div>
                                                ))}

                                                {/* Add comment */}
                                                {commentTeamId === sub.id ? (
                                                    <div className="mt-3 flex gap-2">
                                                        <Input
                                                            value={commentText}
                                                            onChange={(e) => setCommentText(e.target.value)}
                                                            placeholder="Add judge comment..."
                                                            className="bg-[var(--surface-raised)] border-[var(--surface-border)] text-sm"
                                                        />
                                                        <Button size="sm" onClick={() => postComment(sub.id)} className="bg-gold hover:bg-gold/80 text-dark">
                                                            <Send className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setCommentTeamId(sub.id)}
                                                        className="mt-2 text-xs text-muted-foreground hover:text-[var(--primary)]"
                                                    >
                                                        <MessageSquare className="w-3 h-3 mr-1" /> Comment
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* Scoring */}
                        <TabsContent value="scoring">
                            <Card className="glass-card border-0 glow-border">
                                <CardHeader>
                                    <CardTitle>Evaluation Panel</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Select Team</Label>
                                            <select
                                                value={scoreTeamId}
                                                onChange={(e) => setScoreTeamId(e.target.value)}
                                                className="w-full p-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--surface-border)] text-sm"
                                            >
                                                <option value="">Choose a team...</option>
                                                {teams.map(t => <option key={t.id} value={t.id}>{t.teamName}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Round</Label>
                                            <div className="flex gap-2">
                                                <Button type="button" variant={round === 1 ? 'default' : 'outline'} onClick={() => { setRound(1); setCriteriaScores({}); }} className={round === 1 ? 'bg-violet' : 'border-[var(--surface-border)]'}>
                                                    Round 1
                                                </Button>
                                                <Button type="button" variant={round === 2 ? 'default' : 'outline'} onClick={() => { setRound(2); setCriteriaScores({}); }} className={round === 2 ? 'bg-violet' : 'border-[var(--surface-border)]'}>
                                                    Round 2
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {criteria.map(c => (
                                            <div key={c} className="space-y-2">
                                                <Label className="text-xs">{c} (0-10)</Label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={10}
                                                    value={criteriaScores[c.toLowerCase().replace(/\s/g, '_')] || ''}
                                                    onChange={(e) => setCriteriaScores(prev => ({ ...prev, [c.toLowerCase().replace(/\s/g, '_')]: Number(e.target.value) }))}
                                                    className="bg-[var(--surface-raised)] border-[var(--surface-border)] font-mono"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <Textarea placeholder="Evaluator notes..." value={scoreNotes} onChange={(e) => setScoreNotes(e.target.value)} className="bg-[var(--surface-raised)] border-[var(--surface-border)]" />

                                    <Button onClick={submitScore} className="bg-gradient-to-r bg-[var(--primary)] text-[var(--primary-foreground)]">
                                        Save Score
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Saved Scores */}
                            <div className="mt-6 space-y-3">
                                <h3 className="text-lg font-semibold">Saved Scores</h3>
                                {scores.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No scores recorded yet.</p>
                                ) : (
                                    scores.map(s => (
                                        <Card key={s.id} className="glass-card border-0">
                                            <CardContent className="pt-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold">{getTeamName(s.teamId)}</p>
                                                        <p className="text-xs text-muted-foreground">Round {s.round} • {s.evaluator}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-mono text-lg font-bold text-[var(--primary)]">{s.total}/{criteria.length * 10}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-muted-foreground">{s.released ? 'Visible' : 'Hidden'}</span>
                                                            <Switch checked={s.released} onCheckedChange={() => toggleRelease(s.id)} />
                                                            {s.released ? <Eye className="w-4 h-4 text-[var(--primary)]" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        {/* Leaderboard */}
                        <TabsContent value="leaderboard">
                            <Card className="glass-card border-0 glow-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-[var(--primary)]" /> Leaderboard (Admin View)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {leaderboard.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No teams to rank yet.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {leaderboard.map((entry, i) => (
                                                <div key={entry.teamId} className={`flex items-center justify-between p-4 rounded-xl border ${i === 0 ? 'bg-gold/5 border-gold/20' : i === 1 ? 'bg-gray-400/5 border-gray-400/20' : i === 2 ? 'bg-amber-700/5 border-amber-700/20' : 'bg-[var(--surface-raised)] border-[var(--surface-border)]'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`font-mono text-2xl font-bold ${i === 0 ? 'text-[var(--primary)]' : i === 1 ? 'text-muted-foreground' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                                                            #{i + 1}
                                                        </span>
                                                        <div>
                                                            <p className="font-semibold">{entry.teamName}</p>
                                                            <Badge variant="outline" className="text-xs border-[var(--surface-border)]">{entry.domain}</Badge>
                                                        </div>
                                                    </div>
                                                    <span className="font-mono text-2xl font-bold text-white">{entry.totalScore}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
}
