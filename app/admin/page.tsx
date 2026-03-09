'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore, useAuthHydrated, useTeamStore, useSubmissionStore, usePhaseStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/shared/Navbar';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Phase } from '@/lib/types';
import {
    Users, FileText, Zap, Trophy, Megaphone, Shield,
    ArrowRight, UserCheck, Lightbulb, Code
} from 'lucide-react';

const COLORS = ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const hydrated = useAuthHydrated();
    const { teams } = useTeamStore();
    const { submissions } = useSubmissionStore();
    const { phases, togglePhase } = usePhaseStore();

    useEffect(() => {
        setMounted(true);
        if (!hydrated) return;
        if (!isAuthenticated || !user || user.role !== 'admin') {
            router.push('/login');
        }
    }, [hydrated, isAuthenticated, user, router]);

    if (!mounted || !user) return null;

    // Stats
    const totalTeams = teams.length;
    const ideationSubs = submissions.filter(s => s.phase === 'ideation').length;
    const devSubs = submissions.filter(s => s.phase === 'development').length;
    const hackSubs = submissions.filter(s => s.phase === 'hackathon').length;

    // Domain distribution for pie chart
    const domainCounts = teams.reduce<Record<string, number>>((acc, t) => {
        acc[t.domain] = (acc[t.domain] || 0) + 1;
        return acc;
    }, {});
    const domainData = Object.entries(domainCounts).map(([name, value]) => ({ name, value }));

    // Submissions per phase for bar chart
    const barData = [
        { phase: 'Ideation', count: ideationSubs },
        { phase: 'Development', count: devSubs },
        { phase: 'Hackathon', count: hackSubs },
    ];

    const statCards = [
        { label: 'Total Teams', value: totalTeams, icon: <Users className="w-5 h-5" />, color: '#7c3aed', href: '/admin/enrollments' },
        { label: 'Ideation Subs', value: ideationSubs, icon: <Lightbulb className="w-5 h-5" />, color: '#f59e0b', href: '/admin/submissions' },
        { label: 'Dev Updates', value: devSubs, icon: <Code className="w-5 h-5" />, color: '#06b6d4', href: '/admin/submissions' },
        { label: 'Hack Updates', value: hackSubs, icon: <Zap className="w-5 h-5" />, color: '#ef4444', href: '/admin/hackathon' },
    ];

    return (
        <div className="min-h-screen bg-background aurora-bg">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
                                <Shield className="w-8 h-8 text-violet" />
                                Admin <span className="gradient-text-violet">Dashboard</span>
                            </h1>
                            <p className="text-muted-foreground mt-1">Manage the hackathon from here.</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map((s, i) => (
                            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <Link href={s.href}>
                                    <Card className="bg-white border-surface-border hover:border-violet/30 transition-all cursor-pointer group">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15`, color: s.color }}>
                                                    {s.icon}
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="font-mono text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Phase Management */}
                        <Card className="bg-white border-surface-border glow-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-violet" /> Phase Management
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {phases.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-surface-border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-dark flex items-center justify-center text-sm">
                                                {p.id === 'enrollment' && <UserCheck className="w-4 h-4 text-violet" />}
                                                {p.id === 'ideation' && <Lightbulb className="w-4 h-4 text-gold" />}
                                                {p.id === 'development' && <Code className="w-4 h-4 text-cyan" />}
                                                {p.id === 'hackathon' && <Zap className="w-4 h-4 text-red-400" />}
                                                {p.id === 'results' && <Trophy className="w-4 h-4 text-green-400" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{p.name}</p>
                                                <p className="text-xs text-muted-foreground">{p.description}</p>
                                            </div>
                                        </div>
                                        <Switch checked={p.active} onCheckedChange={() => togglePhase(p.id)} />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Submissions Chart */}
                        <Card className="bg-white border-surface-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-cyan" /> Submissions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barData}>
                                            <XAxis dataKey="phase" stroke="#71717a" fontSize={12} />
                                            <YAxis stroke="#71717a" fontSize={12} />
                                            <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #2a2a3e', borderRadius: '8px' }} />
                                            <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Domain Distribution */}
                        <Card className="bg-white border-surface-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-gold" /> Domains
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {domainData.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">No teams enrolled yet</p>
                                ) : (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={domainData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name }) => name}>
                                                    {domainData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                                                </Pie>
                                                <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #2a2a3e', borderRadius: '8px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                        {[
                            { href: '/admin/enrollments', label: 'Manage Teams', icon: <Users className="w-5 h-5" />, color: '#7c3aed' },
                            { href: '/admin/submissions', label: 'View Submissions', icon: <FileText className="w-5 h-5" />, color: '#06b6d4' },
                            { href: '/admin/hackathon', label: 'Hackathon Control', icon: <Zap className="w-5 h-5" />, color: '#ef4444' },
                            { href: '/admin/announcements', label: 'Announcements', icon: <Megaphone className="w-5 h-5" />, color: '#f59e0b' },
                        ].map(item => (
                            <Link key={item.href} href={item.href}>
                                <Button variant="outline" className="w-full h-auto py-4 border-surface-border hover:border-violet/30 flex flex-col items-center gap-2">
                                    <span style={{ color: item.color }}>{item.icon}</span>
                                    <span className="text-sm">{item.label}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
