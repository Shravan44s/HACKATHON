'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore, useAuthHydrated, useChecklistStore } from '@/lib/store';
import Navbar from '@/components/shared/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ChecklistItem } from '@/lib/types';
import { CheckSquare, Plus, Trash2, List } from 'lucide-react';

export default function AdminChecklistPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const hydrated = useAuthHydrated();
    const { checklistItems, addChecklistItem, removeChecklistItem } = useChecklistStore();

    const [newItemLabel, setNewItemLabel] = useState('');

    useEffect(() => {
        setMounted(true);
        if (!hydrated) return;
        if (!isAuthenticated || user?.role !== 'admin') router.push('/login');
    }, [hydrated, isAuthenticated, user, router]);

    if (!mounted || !user) return null;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemLabel) {
            toast.error('Checklist item must have a name.');
            return;
        }

        const newItem: ChecklistItem = {
            id: crypto.randomUUID(),
            label: newItemLabel,
            createdAt: new Date().toISOString()
        };

        addChecklistItem(newItem);
        toast.success('Checklist item added.');
        setNewItemLabel('');
    };

    return (
        <div className="min-h-screen aurora-bg">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-[var(--surface-raised)] flex items-center justify-center border border-[var(--surface-border)]">
                            <CheckSquare className="w-6 h-6 text-[var(--primary)]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold">Admin Checklist</h1>
                            <p className="text-muted-foreground">Define tracking items that admins can check off per team in the Enrollments panel.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Creation Form */}
                        <div className="md:col-span-1">
                            <Card className="glass-card border-0 glow-border sticky top-24">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Plus className="w-4 h-4 text-[var(--primary)]" /> Add Item
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleAdd} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Item Name</Label>
                                            <Input
                                                placeholder="e.g. T-Shirt Sizes Submitted"
                                                value={newItemLabel}
                                                onChange={e => setNewItemLabel(e.target.value)}
                                                className="bg-[var(--surface-raised)] border-[var(--surface-border)] h-11"
                                            />
                                        </div>
                                        <Button type="submit" className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] h-11">
                                            Add Checklist Item
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Current Checklist Items */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <List className="w-5 h-5 text-[var(--primary)]" />
                                <h3 className="font-semibold text-lg">Checklist Items</h3>
                            </div>

                            {checklistItems.length === 0 ? (
                                <div className="p-8 text-center rounded-2xl bg-[var(--surface-raised)] border border-[var(--surface-border)]">
                                    <CheckSquare className="w-8 h-8 mx-auto text-muted-foreground mb-3 opacity-50" />
                                    <p className="text-muted-foreground">No checklist items yet.<br /> Add your first item on the left.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {checklistItems.map(item => (
                                        <Card key={item.id} className="glass-card border-0 hover:border-[var(--primary)]/30 transition-colors">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex-1 space-y-1">
                                                    <h4 className="font-semibold">{item.label}</h4>
                                                    <p className="text-xs text-muted-foreground">Added: {new Date(item.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-400 hover:text-red-500 hover:bg-red-50"
                                                    onClick={() => removeChecklistItem(item.id)}
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
