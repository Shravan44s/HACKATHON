'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { announcementSchema, type AnnouncementFormData } from '@/lib/validators';
import { useAuthStore, useAuthHydrated, useAnnouncementStore, useTeamStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/shared/Navbar';
import { toast } from 'sonner';
import { Megaphone, Pin, Trash2, Send, Loader2 } from 'lucide-react';

export default function AnnouncementsPage() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pinned, setPinned] = useState(false);
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const hydrated = useAuthHydrated();
    const { announcements, addAnnouncement, removeAnnouncement, updateAnnouncement } = useAnnouncementStore();
    const { teams } = useTeamStore();

    useEffect(() => {
        setMounted(true);
        if (!hydrated) return;
        if (!isAuthenticated || user?.role !== 'admin') router.push('/login');
    }, [hydrated, isAuthenticated, user, router]);

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AnnouncementFormData>({
        resolver: zodResolver(announcementSchema),
        defaultValues: { target: 'all', pinned: false },
    });

    const onSubmit = async (data: AnnouncementFormData) => {
        setLoading(true);
        try {
            addAnnouncement({
                id: crypto.randomUUID(),
                title: data.title,
                body: data.body,
                target: data.target,
                targetId: data.targetId,
                createdAt: new Date().toISOString(),
                pinned,
            });
            toast.success('Announcement published! 📢');
            reset();
            setPinned(false);
        } catch {
            toast.error('Failed to publish');
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
                    <h1 className="font-display text-3xl font-bold flex items-center gap-2 mb-8">
                        <Megaphone className="w-8 h-8 text-[var(--primary)]" /> Announcements
                    </h1>

                    {/* Compose */}
                    <Card className="glass-card border-0 glow-border mb-8">
                        <CardHeader><CardTitle>New Announcement</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input placeholder="Announcement title" className="bg-[var(--surface-raised)] border-[var(--surface-border)]" {...register('title')} />
                                    {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Body</Label>
                                    <Textarea placeholder="Write your announcement..." className="bg-[var(--surface-raised)] border-[var(--surface-border)] min-h-[120px]" {...register('body')} />
                                    {errors.body && <p className="text-xs text-red-400">{errors.body.message}</p>}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Target</Label>
                                        <Select defaultValue="all" onValueChange={(val) => setValue('target', (val || 'all') as 'all' | 'specific_team' | 'specific_phase')}>
                                            <SelectTrigger className="bg-[var(--surface-raised)] border-[var(--surface-border)]"><SelectValue /></SelectTrigger>
                                            <SelectContent className="glass-card border-0">
                                                <SelectItem value="all">All Teams</SelectItem>
                                                <SelectItem value="specific_team">Specific Team</SelectItem>
                                                <SelectItem value="specific_phase">Specific Phase</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <div className="flex items-center gap-2">
                                            <Pin className="w-4 h-4 text-[var(--primary)]" />
                                            <Label>Pin</Label>
                                            <Switch checked={pinned} onCheckedChange={setPinned} />
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" disabled={loading} className="bg-gradient-to-r from-gold to-gold-light text-dark font-semibold">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                    Publish
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* List */}
                    <div className="space-y-3">
                        {announcements.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No announcements yet.</p>
                        ) : (
                            announcements.map((a, i) => (
                                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                                    <Card className={`glass-card border-0 ${a.pinned ? 'border-gold/20' : ''}`}>
                                        <CardContent className="pt-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {a.pinned && <Badge className="bg-amber-400/20 text-[var(--primary)] text-xs"><Pin className="w-3 h-3 mr-1" /> Pinned</Badge>}
                                                        <Badge variant="outline" className="text-xs border-[var(--surface-border)]">{a.target === 'all' ? 'All Teams' : a.target}</Badge>
                                                    </div>
                                                    <h3 className="font-semibold mb-1">{a.title}</h3>
                                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.body}</p>
                                                    <p className="text-xs text-muted-foreground mt-2">{new Date(a.createdAt).toLocaleString()}</p>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => { removeAnnouncement(a.id); toast.success('Deleted'); }} className="text-red-400 hover:text-red-300">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
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
