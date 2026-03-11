'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/shared/Navbar';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, Loader2, Zap } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    role: z.enum(['admin', 'participant', 'mentor']),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuthStore();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: { role: 'participant' }
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, password: data.password }),
            });
            const result = await res.json();
            if (result.success) {
                login(result.user);
                toast.success(`Welcome, ${result.user.name}!`);
                router.push(result.user.role === 'admin' ? '/admin' : '/dashboard');
            } else {
                toast.error(result.message || 'Login failed. Check your credentials.');
            }
        } catch {
            toast.error('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 relative overflow-hidden">
            <Navbar />

            {/* Background ambient */}
            <div className="fixed top-[15%] left-[20%] w-[500px] h-[500px] bg-[var(--primary)]/08 rounded-full blur-[110px] animate-morph pointer-events-none" />
            <div className="fixed bottom-[10%] right-[18%] w-[400px] h-[400px] bg-[var(--primary)]/06 rounded-full blur-[90px] animate-morph pointer-events-none" style={{ animationDelay: '-5s' }} />

            <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card pearl-border p-9">

                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="w-11 h-11 rounded-2xl bg-[var(--primary)] flex items-center justify-center shadow-xl"
                        >
                            <Zap className="w-5 h-5 text-[var(--primary-foreground)]" />
                        </motion.div>
                        <span className="font-display text-xl font-bold gradient-text-violet">Make It Happen</span>
                    </div>

                    <div className="text-center mb-7">
                        <h1 className="text-2xl font-bold text-foreground mb-1">System Auth</h1>
                        <p className="text-sm text-muted-foreground">Verify your security clearance</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-foreground/70">Email</Label>
                            <div className="relative focus-ring rounded-xl">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                                <Input
                                    type="email"
                                    placeholder="you@email.com"
                                    className="pl-11 glass-input rounded-xl h-11"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-foreground/70">Password</Label>
                            <div className="relative focus-ring rounded-xl">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-11 glass-input rounded-xl h-11"
                                    {...register('password')}
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                        </div>

                        <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-6 rounded-xl font-semibold shadow-lg text-base hover:opacity-90 transition-opacity"
                            >
                                {loading
                                    ? <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    : <LogIn className="w-5 h-5 mr-2" />
                                }
                                Sign In
                            </Button>
                        </motion.div>
                    </form>

                    {/* Credentials hint */}
                    <div className="mt-7 p-4 rounded-2xl bg-[var(--surface-raised)] border border-[var(--surface-border)]">
                        <p className="text-xs text-muted-foreground text-center mb-2 font-medium uppercase tracking-wider">Demo Override Codes</p>
                        <div className="text-xs text-center font-mono space-y-1 text-foreground/60">
                            <p><span className="text-[var(--primary)] font-semibold">Admin:</span> admin@makeithappen.com</p>
                            <p><span className="text-emerald-500 font-semibold">Mentor:</span> mentor@makeithappen.com</p>
                            <p><span className="font-semibold">Participant:</span> any email</p>
                            <p className="mt-2 text-[10px] opacity-70">Pass: admin123 / default (4+ chars)</p>
                        </div>
                    </div>

                    <p className="text-sm text-center text-muted-foreground mt-5">
                        New team?{' '}
                        <Link href="/enroll" className="text-[var(--primary)] font-semibold hover:underline">
                            Enroll here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
