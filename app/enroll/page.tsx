'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enrollmentSchema, type EnrollmentFormData } from '@/lib/validators';
import { useAuthStore, useAuthHydrated, useTeamStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/shared/Navbar';
import { HACKATHON_CONFIG } from '@/lib/auth';
import { toast } from 'sonner';
import { UserPlus, Plus, Trash2, Rocket, Loader2, Users } from 'lucide-react';

export default function EnrollPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login, user, isAuthenticated } = useAuthStore();
    const hydrated = useAuthHydrated();
    const { addTeam } = useTeamStore();

    const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<EnrollmentFormData>({
        resolver: zodResolver(enrollmentSchema),
        defaultValues: {
            teamName: '',
            leader: { name: '', email: '', phone: '', college: '', department: '' },
            members: [{ id: crypto.randomUUID(), name: '', email: '', role: '' }],
            domain: '',
            problemStatement: '',
            agreement: false,
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'members' });
    const members = watch('members');
    const teamSize = (members?.length || 0) + 1;

    const onSubmit = async (data: EnrollmentFormData) => {
        setLoading(true);
        try {
            const teamId = crypto.randomUUID();
            if (hydrated && !isAuthenticated) {
                login({
                    id: `user-${Date.now()}`,
                    email: data.leader.email,
                    name: data.leader.name,
                    role: 'participant',
                    teamId,
                });
            }
            addTeam({
                id: teamId,
                teamName: data.teamName,
                leader: data.leader,
                members: data.members,
                domain: data.domain,
                problemStatement: data.problemStatement,
                status: 'enrolled',
                enrolledAt: new Date().toISOString(),
                teamSize,
            });
            toast.success('Team enrolled successfully! 🎉');
            router.push('/dashboard');
        } catch {
            toast.error('Enrollment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen aurora-bg">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 pt-24 pb-16 relative z-10">
                {/* Decorative blobs */}
                <div className="fixed top-20 right-1/4 w-72 h-72 bg-violet/6 rounded-full blur-3xl animate-morph pointer-events-none" />
                <div className="fixed bottom-20 left-1/3 w-64 h-64 bg-cyan/5 rounded-full blur-3xl animate-morph pointer-events-none" style={{ animationDelay: '-3s' }} />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet/5 border border-violet/10 mb-4"
                        >
                            <Users className="w-4 h-4 text-violet" />
                            <span className="text-sm font-medium text-violet">Team Enrollment</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="font-display text-3xl sm:text-4xl font-extrabold mb-2"
                        >
                            Register Your <span className="gradient-text">Team</span>
                        </motion.h1>
                        <p className="text-muted-foreground">Join {HACKATHON_CONFIG.name} and make it happen!</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Team Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="premium-card p-6 space-y-4"
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-violet" /> Team Information
                            </h2>
                            <div className="space-y-2">
                                <Label>Team Name</Label>
                                <Input placeholder="Team Alpha" className="bg-[var(--surface-raised)] border-[var(--surface-border)] rounded-xl h-11" {...register('teamName')} />
                                {errors.teamName && <p className="text-xs text-red-500">{errors.teamName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Project Domain</Label>
                                <Select onValueChange={(val) => setValue('domain', String(val ?? ''))}>
                                    <SelectTrigger className="bg-[var(--surface-raised)] border-[var(--surface-border)] rounded-xl h-11">
                                        <SelectValue placeholder="Select domain" />
                                    </SelectTrigger>
                                    <SelectContent className="glass-card border-0 shadow-xl">
                                        {HACKATHON_CONFIG.domains.map((d) => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.domain && <p className="text-xs text-red-500">{errors.domain.message}</p>}
                            </div>
                        </motion.div>

                        {/* Leader */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="premium-card p-6 space-y-4"
                        >
                            <h2 className="text-lg font-semibold">🎖️ Team Leader</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input placeholder="John Doe" className="bg-[var(--surface-raised)] border-[var(--surface-border)] rounded-xl h-11" {...register('leader.name')} />
                                    {errors.leader?.name && <p className="text-xs text-red-500">{errors.leader.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" placeholder="john@email.com" className="bg-[var(--surface-raised)] border-[var(--surface-border)] rounded-xl h-11" {...register('leader.email')} />
                                    {errors.leader?.email && <p className="text-xs text-red-500">{errors.leader.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input placeholder="+91 9876543210" className="bg-[var(--surface-raised)] border-[var(--surface-border)] rounded-xl h-11" {...register('leader.phone')} />
                                    {errors.leader?.phone && <p className="text-xs text-red-500">{errors.leader.phone.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>College</Label>
                                    <Input placeholder="MIT" className="bg-[var(--surface-raised)] border-[var(--surface-border)] rounded-xl h-11" {...register('leader.college')} />
                                    {errors.leader?.college && <p className="text-xs text-red-500">{errors.leader.college.message}</p>}
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label>Department</Label>
                                    <Input placeholder="Computer Science" className="bg-[var(--surface-raised)] border-[var(--surface-border)] rounded-xl h-11" {...register('leader.department')} />
                                    {errors.leader?.department && <p className="text-xs text-red-500">{errors.leader.department.message}</p>}
                                </div>
                            </div>
                        </motion.div>

                        {/* Members */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="premium-card p-6 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">👥 Team Members</h2>
                                <span className="text-sm text-muted-foreground font-mono bg-[var(--surface-raised)] px-3 py-1 rounded-lg border border-[var(--surface-border)]">
                                    Team Size: {teamSize}
                                </span>
                            </div>

                            {fields.map((field, index) => (
                                <motion.div
                                    key={field.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                    className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--surface-raised)] border border-[var(--surface-border)]"
                                >
                                    <div className="space-y-1">
                                        <Label className="text-xs">Name</Label>
                                        <Input placeholder="Name" className="glass-card border-0 text-sm rounded-xl" {...register(`members.${index}.name`)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Email</Label>
                                        <Input placeholder="email" className="glass-card border-0 text-sm rounded-xl" {...register(`members.${index}.email`)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Role</Label>
                                        <Input placeholder="Developer" className="glass-card border-0 text-sm rounded-xl" {...register(`members.${index}.role`)} />
                                    </div>
                                    <div className="flex items-end">
                                        {fields.length > 1 && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-400 hover:text-red-500 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {fields.length < 4 && (
                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => append({ id: crypto.randomUUID(), name: '', email: '', role: '' })}
                                        className="w-full border-dashed border-[var(--surface-border)] hover:border-violet/30 hover:bg-violet/5 rounded-xl"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add Member
                                    </Button>
                                </motion.div>
                            )}
                            {errors.members && <p className="text-xs text-red-500">{errors.members.message}</p>}
                        </motion.div>

                        {/* Problem Statement */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="premium-card p-6 space-y-4"
                        >
                            <h2 className="text-lg font-semibold">📋 Problem Statement</h2>
                            <Textarea
                                placeholder="Describe the problem your team wants to solve..."
                                className="bg-[var(--surface-raised)] border-[var(--surface-border)] min-h-[120px] rounded-xl"
                                {...register('problemStatement')}
                            />
                            {errors.problemStatement && <p className="text-xs text-red-500">{errors.problemStatement.message}</p>}
                        </motion.div>

                        {/* Agreement */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--surface-raised)] border border-[var(--surface-border)]"
                        >
                            <Checkbox
                                id="agreement"
                                onCheckedChange={(checked) => setValue('agreement', checked === true)}
                            />
                            <label htmlFor="agreement" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                                I agree to the hackathon rules and code of conduct. Our team commits to original work and fair participation.
                            </label>
                        </motion.div>
                        {errors.agreement && <p className="text-xs text-red-500">{errors.agreement.message}</p>}

                        <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r bg-[var(--primary)] text-[var(--primary-foreground)] py-6 text-lg font-semibold rounded-2xl shadow-xl shadow-violet/20"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Rocket className="w-5 h-5 mr-2" />}
                                Enroll Team
                            </Button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
