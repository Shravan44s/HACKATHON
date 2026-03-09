'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore, useAuthHydrated, useTeamStore, usePhaseStore, useAnnouncementStore, useScoreStore, useSubmissionStore } from '@/lib/store';
import Navbar from '@/components/shared/Navbar';
import ChatWidget from '@/components/shared/ChatWidget';
import PhaseStepper from '@/components/shared/PhaseStepper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Phase } from '@/lib/types';
import {
    Lightbulb, Code, Zap, Trophy, Bell, Users, Bot,
    ArrowRight, Star, FileText, Clock, Rocket, Sparkles, CheckCircle2
} from 'lucide-react';

const phaseLinks: Record<string, { href: string; label: string; icon: React.ReactNode }> = {
    ideation: { href: '/dashboard/ideation', label: 'Submit Ideation', icon: <Lightbulb className="w-4 h-4" /> },
    development: { href: '/dashboard/development', label: 'Update Progress', icon: <Code className="w-4 h-4" /> },
    hackathon: { href: '/dashboard/hackathon', label: 'Go to Hackathon', icon: <Zap className="w-4 h-4" /> },
    results: { href: '/dashboard', label: 'View Results', icon: <Trophy className="w-4 h-4" /> },
};

export default function ParticipantDashboard() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const hydrated = useAuthHydrated();
    const { teams } = useTeamStore();
    const { phases } = usePhaseStore();
    const { announcements } = useAnnouncementStore();
    const { scores } = useScoreStore();
    const { submissions } = useSubmissionStore();

    useEffect(() => {
        setMounted(true);
        if (!hydrated) return;
        if (!isAuthenticated || !user || user.role === 'admin') {
            router.push('/login');
        }
    }, [hydrated, isAuthenticated, user, router]);

    if (!mounted || !user) return null;

    const team = teams.find(t => t.leader.email === user.email || t.id === user.teamId);
    const activePhasesArr = phases.filter(p => p.active).sort((a, b) => b.order - a.order);
    const currentPhase = activePhasesArr[0]?.id || 'enrollment';
    const completedPhases = phases.filter(p => p.active && p.order < (activePhasesArr[0]?.order ?? 0)).map(p => p.id);

    const teamScores = team ? scores.filter(s => s.teamId === team.id && s.released) : [];
    const teamSubmissions = team ? submissions.filter(s => s.teamId === team.id) : [];
    const teamAnnouncements = announcements.filter(a =>
        a.target === 'all' || (a.target === 'specific_team' && a.targetId === team?.id) || (a.target === 'specific_phase' && a.targetId === currentPhase)
    );
    const currentPhaseLink = phaseLinks[currentPhase];

    return (
        <div className="min-h-screen bg-background aurora-bg">
            <Navbar />
            <ChatWidget />

            <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Welcome */}
                    <div className="mb-8">
                        <h1 className="font-display text-3xl font-bold mb-1">
                            Welcome, <span className="gradient-text-violet">{user.name}</span>
                        </h1>
                        <p className="text-muted-foreground">
                            {team ? `Team: ${team.teamName} • ${team.domain}` : 'Complete your enrollment to get started'}
                        </p>
                    </div>

                    {/* ── ENROLLMENT BANNER (if not enrolled) ── */}
                    {!team && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                            className="mb-8"
                        >
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet via-indigo to-cyan p-[1px]">
                                <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl p-8 overflow-hidden">
                                    {/* Background aura */}
                                    <div className="absolute top-0 right-0 w-72 h-72 bg-violet/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                        {/* Icon */}
                                        <motion.div
                                            animate={{ y: [-4, 4, -4], rotate: [0, 3, -3, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                            className="flex-shrink-0"
                                        >
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet to-indigo flex items-center justify-center shadow-xl shadow-violet/25">
                                                <Rocket className="w-9 h-9 text-white" />
                                            </div>
                                        </motion.div>

                                        {/* Content */}
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet/10 border border-violet/15 mb-3">
                                                <Sparkles className="w-3 h-3 text-violet" />
                                                <span className="text-xs font-semibold text-violet">Action Required</span>
                                            </div>
                                            <h2 className="text-2xl font-bold mb-2">
                                                You&apos;re not enrolled yet!
                                            </h2>
                                            <p className="text-muted-foreground mb-1">
                                                Register your team to unlock all hackathon features — AI agents, submissions, live hackathon, and more.
                                            </p>
                                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> 9 AI Agents</span>
                                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Phase Tracking</span>
                                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Live Hackathon</span>
                                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Fair Scoring</span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="flex-shrink-0">
                                            <Link href="/enroll">
                                                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                                                    <Button size="lg" className="bg-gradient-to-r from-violet to-indigo text-white px-8 py-6 text-base rounded-2xl shadow-xl shadow-violet/25 font-semibold">
                                                        <Rocket className="w-5 h-5 mr-2" />
                                                        Enroll Now
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </motion.div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Phase Stepper */}
                    <div className="mb-8 p-6 glass rounded-2xl glow-border">
                        <PhaseStepper currentPhase={currentPhase as Phase} completedPhases={completedPhases as Phase[]} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Current Phase Card */}
                            <Card className="bg-white border-surface-border glow-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-violet" />
                                        Current Phase: <span className="gradient-text-violet capitalize">{currentPhase}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {currentPhase === 'enrollment' && 'Your team is enrolled! Wait for the next phase to open.'}
                                        {currentPhase === 'ideation' && 'Submit your project idea, problem statement, and proposed solution.'}
                                        {currentPhase === 'development' && 'Build your project and submit progress updates.'}
                                        {currentPhase === 'hackathon' && 'The 24-hour hackathon is live! Push updates and submit your final project.'}
                                        {currentPhase === 'results' && 'Results are being compiled. Check your scores below.'}
                                    </p>
                                    {currentPhaseLink && (
                                        <Link href={currentPhaseLink.href}>
                                            <Button className="bg-violet hover:bg-violet-dark text-white">
                                                {currentPhaseLink.icon}
                                                <span className="ml-2">{currentPhaseLink.label}</span>
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Submissions Summary */}
                            <Card className="bg-white border-surface-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileText className="w-5 h-5 text-cyan" /> Your Submissions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {teamSubmissions.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No submissions yet. Start with the current phase!</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {teamSubmissions.map(sub => (
                                                <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-surface-border">
                                                    <div>
                                                        <p className="text-sm font-medium capitalize">{sub.phase} Phase</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <Badge variant={sub.status === 'approved' ? 'default' : 'secondary'} className={sub.status === 'approved' ? 'bg-green-500/20 text-green-400' : ''}>
                                                        {sub.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Scores (released only) */}
                            {teamScores.length > 0 && (
                                <Card className="bg-white border-surface-border glow-border-cyan">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Star className="w-5 h-5 text-gold" /> Your Scores
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {teamScores.map(score => (
                                                <div key={score.id} className="p-4 rounded-xl bg-surface-raised border border-surface-border">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium capitalize">Round {score.round} — {score.phase}</span>
                                                        <span className="font-mono text-lg font-bold text-gold">{score.total}/60</span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {Object.entries(score.criteria).map(([key, val]) => (
                                                            <div key={key} className="text-center p-2 rounded-lg bg-background">
                                                                <p className="text-xs text-muted-foreground capitalize">{key}</p>
                                                                <p className="font-mono text-sm font-bold">{val}/10</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Team Info */}
                            {team && (
                                <Card className="bg-white border-surface-border">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Users className="w-5 h-5 text-cyan" /> Team
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-sm font-semibold">{team.teamName}</p>
                                            <Badge className="mt-1 bg-violet/20 text-violet">{team.domain}</Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs text-gold">👑</div>
                                                <span>{team.leader.name}</span>
                                                <Badge variant="outline" className="text-xs border-gold/30 text-gold">Leader</Badge>
                                            </div>
                                            {team.members.map(m => (
                                                <div key={m.id} className="flex items-center gap-2 text-sm">
                                                    <div className="w-6 h-6 rounded-full bg-surface-raised flex items-center justify-center text-xs">👤</div>
                                                    <span>{m.name}</span>
                                                    <span className="text-xs text-muted-foreground">({m.role})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* AI Agents Quick Access */}
                            <Card className="bg-white border-surface-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Bot className="w-5 h-5 text-violet" /> AI Agents
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground mb-3">Get AI-powered help for your hackathon project</p>
                                    <Link href="/dashboard/agents">
                                        <Button variant="outline" className="w-full border-violet/30 text-violet hover:bg-violet/10">
                                            <Bot className="w-4 h-4 mr-2" /> Open AI Agents Hub
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Announcements */}
                            <Card className="bg-white border-surface-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Bell className="w-5 h-5 text-gold" /> Announcements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {teamAnnouncements.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No announcements yet.</p>
                                    ) : (
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {teamAnnouncements.slice(0, 5).map(a => (
                                                <div key={a.id} className="p-3 rounded-xl bg-surface-raised border border-surface-border">
                                                    {a.pinned && <Badge className="bg-gold/20 text-gold text-xs mb-1">📌 Pinned</Badge>}
                                                    <p className="text-sm font-medium">{a.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
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
