'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore, useAuthHydrated, useTeamStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/shared/Navbar';
import { HACKATHON_CONFIG } from '@/lib/auth';
import { toast } from 'sonner';
import { Users, Search, Download, ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';

export default function EnrollmentsPage() {
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState('');
    const [domainFilter, setDomainFilter] = useState('all');
    const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const hydrated = useAuthHydrated();
    const { teams } = useTeamStore();

    useEffect(() => {
        setMounted(true);
        if (!hydrated) return;
        if (!isAuthenticated || user?.role !== 'admin') router.push('/login');
    }, [hydrated, isAuthenticated, user, router]);

    if (!mounted || !user) return null;

    const filtered = teams.filter(t => {
        const matchSearch = t.teamName.toLowerCase().includes(search.toLowerCase()) || t.leader.name.toLowerCase().includes(search.toLowerCase());
        const matchDomain = domainFilter === 'all' || t.domain === domainFilter;
        return matchSearch && matchDomain;
    });

    const exportCSV = () => {
        const headers = 'Team Name,Leader,Email,Phone,College,Domain,Members,Status,Enrolled At\n';
        const rows = filtered.map(t =>
            `"${t.teamName}","${t.leader.name}","${t.leader.email}","${t.leader.phone}","${t.leader.college}","${t.domain}","${t.members.map(m => m.name).join('; ')}","${t.status}","${t.enrolledAt}"`
        ).join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'enrolled_teams.csv';
        a.click();
        toast.success('CSV exported!');
    };

    return (
        <div className="min-h-screen aurora-bg">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
                                <Users className="w-8 h-8 text-violet" /> Enrolled Teams
                            </h1>
                            <p className="text-muted-foreground mt-1">{filtered.length} teams</p>
                        </div>
                        <Button onClick={exportCSV} variant="outline" className="border-[var(--surface-border)] hover:border-violet/30">
                            <Download className="w-4 h-4 mr-2" /> Export CSV
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search teams..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-[var(--surface-raised)] border-[var(--surface-border)]"
                            />
                        </div>
                        <Select value={domainFilter} onValueChange={(val) => setDomainFilter(val || 'all')}>
                            <SelectTrigger className="w-48 bg-[var(--surface-raised)] border-[var(--surface-border)]">
                                <SelectValue placeholder="Filter by domain" />
                            </SelectTrigger>
                            <SelectContent className="glass-card border-0">
                                <SelectItem value="all">All Domains</SelectItem>
                                {HACKATHON_CONFIG.domains.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Teams List */}
                    <div className="space-y-3">
                        {filtered.length === 0 ? (
                            <Card className="glass-card border-0">
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">No teams found.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            filtered.map((team, i) => (
                                <motion.div
                                    key={team.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                >
                                    <Card className="glass-card border-0 hover:border-violet/20 transition-all">
                                        <CardContent className="pt-4">
                                            <div
                                                className="flex items-center justify-between cursor-pointer"
                                                onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center font-bold text-violet">
                                                        {team.teamName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{team.teamName}</p>
                                                        <p className="text-xs text-muted-foreground">{team.leader.name} • {team.leader.college}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge className="bg-[var(--accent)] text-[var(--primary)]">{team.domain}</Badge>
                                                    <Badge variant="outline" className={team.status === 'enrolled' ? 'border-green-500/30 text-[var(--primary)]' : ''}>
                                                        {team.status}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground font-mono">{team.teamSize} members</span>
                                                    {expandedTeam === team.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </div>
                                            </div>

                                            {expandedTeam === team.id && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-[var(--surface-border)]">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-3">
                                                            <h4 className="text-sm font-semibold text-muted-foreground">Leader Details</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <p className="flex items-center gap-2"><Mail className="w-3 h-3 text-cyan" /> {team.leader.email}</p>
                                                                <p className="flex items-center gap-2"><Phone className="w-3 h-3 text-cyan" /> {team.leader.phone}</p>
                                                                <p>🎓 {team.leader.college} — {team.leader.department}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <h4 className="text-sm font-semibold text-muted-foreground">Team Members</h4>
                                                            <div className="space-y-2">
                                                                {team.members.map(m => (
                                                                    <div key={m.id} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-[var(--surface-raised)]">
                                                                        <span className="font-medium">{m.name}</span>
                                                                        <span className="text-xs text-muted-foreground">({m.role})</span>
                                                                        <span className="text-xs text-muted-foreground ml-auto">{m.email}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 p-3 rounded-xl bg-[var(--surface-raised)]">
                                                        <h4 className="text-xs font-semibold text-muted-foreground mb-1">Problem Statement</h4>
                                                        <p className="text-sm">{team.problemStatement}</p>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-3">Enrolled: {new Date(team.enrolledAt).toLocaleString()}</p>
                                                </motion.div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
