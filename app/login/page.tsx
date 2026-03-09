'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Navbar from '@/components/shared/Navbar';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, Loader2, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuthStore();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { role: 'participant' },
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (result.success) {
                login(result.user);
                toast.success(`Welcome, ${result.user.name}! 🎉`);
                router.push(result.user.role === 'admin' ? '/admin' : '/dashboard');
            } else {
                toast.error(result.message || 'Login failed');
            }
        } catch {
            toast.error('Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background aurora-bg">
            <Navbar />
            <div className="flex items-center justify-center min-h-screen px-4 pt-16">
                {/* Decorative blobs */}
                <div className="fixed top-20 left-1/4 w-64 h-64 bg-violet/6 rounded-full blur-3xl animate-morph" />
                <div className="fixed bottom-20 right-1/4 w-80 h-80 bg-cyan/5 rounded-full blur-3xl animate-morph" style={{ animationDelay: '-3s' }} />

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="premium-card p-8">
                        {/* Logo */}
                        <div className="flex items-center justify-center gap-2.5 mb-8">
                            <motion.div
                                initial={{ rotate: -10 }}
                                animate={{ rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet to-cyan flex items-center justify-center shadow-lg shadow-violet/20"
                            >
                                <Zap className="w-6 h-6 text-white" />
                            </motion.div>
                            <span className="font-display text-xl font-bold gradient-text-violet">Make It Happen</span>
                        </div>

                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
                            <p className="text-sm text-muted-foreground">Sign in to continue your hackathon journey</p>
                        </div>

                        {/* Role Toggle */}
                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-4 p-3 rounded-2xl bg-surface-raised border border-surface-border mb-6"
                        >
                            <span className={`text-sm font-medium transition-colors ${!isAdmin ? 'text-violet' : 'text-muted-foreground'}`}>Participant</span>
                            <Switch
                                checked={isAdmin}
                                onCheckedChange={(checked) => {
                                    setIsAdmin(checked);
                                    setValue('role', checked ? 'admin' : 'participant');
                                }}
                            />
                            <span className={`text-sm font-medium transition-colors ${isAdmin ? 'text-violet' : 'text-muted-foreground'}`}>Admin</span>
                        </motion.div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Email</Label>
                                <div className="relative focus-ring rounded-xl">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="you@email.com"
                                        className="pl-11 bg-surface-raised border-surface-border rounded-xl h-11"
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Password</Label>
                                <div className="relative focus-ring rounded-xl">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-11 bg-surface-raised border-surface-border rounded-xl h-11"
                                        {...register('password')}
                                    />
                                </div>
                                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                            </div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet to-indigo text-white py-5 rounded-xl font-semibold shadow-lg shadow-violet/20 text-base">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
                                    Sign In
                                </Button>
                            </motion.div>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-6 p-4 rounded-2xl bg-surface-raised border border-surface-border">
                            <p className="text-xs text-muted-foreground text-center mb-2 font-medium">Demo Credentials</p>
                            <div className="text-xs text-center font-mono space-y-1">
                                <p><span className="text-violet font-semibold">Admin:</span> admin@makeitappen.com / admin123</p>
                                <p><span className="text-cyan font-semibold">Participant:</span> any email / any pass (4+ chars)</p>
                            </div>
                        </div>

                        <p className="text-sm text-center text-muted-foreground mt-6">
                            New team? <Link href="/enroll" className="text-violet font-semibold hover:underline">Enroll here</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
