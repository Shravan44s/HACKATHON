'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore, useAuthHydrated, useWinnersStore, useTeamStore, type WinnerEntry } from '@/lib/store';
import Navbar from '@/components/shared/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Trophy, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

export default function AdminWinnersPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const hydrated = useAuthHydrated();
    const { winners, isVisible, addWinner, removeWinner, toggleVisibility } = useWinnersStore();
    const { teams } = useTeamStore();

    const [selectedTeam, setSelectedTeam] = useState('');
    const [projectTitle, setProjectTitle] = useState('');
    const [position, setPosition] = useState('1');

    useEffect(() => {
        setMounted(true);
        if (!hydrated) return;
        if (!isAuthenticated || user?.role !== 'admin') router.push('/login');
    }, [hydrated, isAuthenticated, user, router]);

    if (!mounted || !user) return null;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeam || !projectTitle) {
            toast.error('Please select a team and enter a project title.');
            return;
        }

        const team = teams.find(t => t.id === selectedTeam);
        if (!team) return;

        const entry: WinnerEntry = {
            id: crypto.randomUUID(),
            teamName: team.teamName,
            projectTitle,
            position: parseInt(position),
        };

        addWinner(entry);
        toast.success(`${team.teamName} added as #${position}!`);
        setSelectedTeam('');
        setProjectTitle('');
        setPosition('1');
    };

    const sorted = [...winners].sort((a, b) => a.position - b.position);

    return (
        <div className="min-h-screen aurora-bg">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-display font-bold">Winner Manager</h1>
                                <p className="text-muted-foreground text-sm">Set winners and choose when to reveal them.</p>
                            </div>
                        </div>

                        {/* Visibility Toggle */}
                        <div className="flex items-center gap-3 p-3 rounded-xl glass-card">
                            {isVisible ? (
                                <Eye className="w-5 h-5 text-green-400" />
                            ) : (
                                <EyeOff className="w-5 h-5 text-muted-foreground" />
                            )}
                            <div className="text-sm">
                                <p className="font-semibold">{isVisible ? 'Visible' : 'Hidden'}</p>
                                <p className="text-xs text-muted-foreground">Winners page</p>
                            </div>
                            <Switch
                                checked={isVisible}
                                onCheckedChange={toggleVisibility}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Add Winner */}
                        <div className="md:col-span-1">
                            <Card className="glass-card border-0 glow-border sticky top-24">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Plus className="w-4 h-4 text-[var(--primary)]" /> Add Winner
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleAdd} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Team</Label>
                                            <Select value={selectedTeam} onValueChange={(v) => v && setSelectedTeam(v)}>
                                                <SelectTrigger className="bg-[var(--surface-raised)] border-[var(--surface-border)] h-11">
                                                    <SelectValue placeholder="Select team..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {teams.map(t => (
                                                        <SelectItem key={t.id} value={t.id}>{t.teamName}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Project Title</Label>
                                            <Input
                                                placeholder="Project name..."
                                                value={projectTitle}
                                                onChange={e => setProjectTitle(e.target.value)}
                                                className="bg-[var(--surface-raised)] border-[var(--surface-border)] h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Position</Label>
                                            <Select value={position} onValueChange={(v) => v && setPosition(v)}>
                                                <SelectTrigger className="bg-[var(--surface-raised)] border-[var(--surface-border)] h-11">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">🥇 1st Place</SelectItem>
                                                    <SelectItem value="2">🥈 2nd Place</SelectItem>
                                                    <SelectItem value="3">🥉 3rd Place</SelectItem>
                                                    <SelectItem value="4">#4 Runner-up</SelectItem>
                                                    <SelectItem value="5">#5 Runner-up</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button type="submit" className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] h-11">
                                            Add Winner
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Current Winners */}
                        <div className="md:col-span-2 space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                Winner List ({winners.length})
                            </h3>

                            {sorted.length === 0 ? (
                                <div className="p-8 text-center rounded-2xl bg-[var(--surface-raised)] border border-[var(--surface-border)]">
                                    <Trophy className="w-8 h-8 mx-auto text-muted-foreground mb-3 opacity-50" />
                                    <p className="text-muted-foreground">No winners added yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sorted.map(w => (
                                        <Card key={w.id} className="glass-card border-0">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-white font-bold">
                                                        #{w.position}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{w.teamName}</h4>
                                                        <p className="text-xs text-muted-foreground">{w.projectTitle}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-400 hover:text-red-500"
                                                    onClick={() => removeWinner(w.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
