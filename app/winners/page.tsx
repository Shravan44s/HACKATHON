'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useWinnersStore } from '@/lib/store';
import Navbar from '@/components/shared/Navbar';
import { Trophy, Star, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const POSITION_STYLES: Record<number, { gradient: string; trophy: string; glow: string; label: string }> = {
    1: {
        gradient: 'from-yellow-400 via-amber-300 to-yellow-500',
        trophy: 'text-yellow-400',
        glow: 'shadow-[0_0_80px_rgba(250,204,21,0.3)]',
        label: '🥇 1st Place',
    },
    2: {
        gradient: 'from-slate-300 via-gray-200 to-slate-400',
        trophy: 'text-slate-300',
        glow: 'shadow-[0_0_60px_rgba(148,163,184,0.25)]',
        label: '🥈 2nd Place',
    },
    3: {
        gradient: 'from-amber-600 via-orange-400 to-amber-700',
        trophy: 'text-amber-500',
        glow: 'shadow-[0_0_60px_rgba(217,119,6,0.2)]',
        label: '🥉 3rd Place',
    },
};

const STORY_LINES = [
    "The asteroid had left nothing but silence.",
    "Across the ruins, survivors gathered — engineers, creators, thinkers.",
    "Guided by awakened AI cores, they built what no one thought possible.",
    "Systems were restored. Infrastructure was rebuilt. Hope returned.",
    "And on this day, Earth was declared... Restored.",
];

function StoryNarration() {
    const [lineIndex, setLineIndex] = useState(0);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        if (lineIndex < STORY_LINES.length - 1) {
            const t = setTimeout(() => setLineIndex(i => i + 1), 3000);
            return () => clearTimeout(t);
        } else {
            const t = setTimeout(() => setComplete(true), 2000);
            return () => clearTimeout(t);
        }
    }, [lineIndex]);

    return (
        <div className="text-center max-w-2xl mx-auto mb-16 min-h-[120px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
                {!complete ? (
                    <motion.p
                        key={lineIndex}
                        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                        transition={{ duration: 0.6 }}
                        className="text-lg sm:text-xl text-muted-foreground font-medium italic leading-relaxed"
                    >
                        &ldquo;{STORY_LINES[lineIndex]}&rdquo;
                    </motion.p>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                            🌍 Earth Has Been Restored.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 font-medium">Thank you, survivors. Your solutions saved humanity.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function WinnersPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { winners, isVisible } = useWinnersStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!isVisible) {
        return (
            <div className="min-h-screen aurora-bg">
                <Navbar />
                <div className="max-w-xl mx-auto px-4 pt-32 pb-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6">
                            <Trophy className="w-8 h-8 text-yellow-400" />
                        </div>
                        <h1 className="text-3xl font-display font-bold mb-3">Coming Soon</h1>
                        <p className="text-muted-foreground mb-6">The winners haven&apos;t been announced yet. Stay tuned!</p>
                        <Button onClick={() => router.push('/')} className="bg-[var(--primary)] text-[var(--primary-foreground)]">
                            Back to Home
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    const sorted = [...winners].sort((a, b) => a.position - b.position);

    return (
        <div className="min-h-screen aurora-bg overflow-hidden">
            <Navbar />

            {/* Background particles */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-yellow-400/30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.7, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10"
                >
                    <motion.div
                        animate={{ rotate: [0, -8, 8, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                        className="inline-block mb-6"
                    >
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_60px_rgba(250,204,21,0.3)]">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                    </motion.div>

                    <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-2">
                        The <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">Winners</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-base sm:text-lg max-w-lg mx-auto">
                        Earth Rebuild Initiative — Final Results
                    </p>
                </motion.div>

                {/* Story Narration */}
                <StoryNarration />

                {/* Winner Cards */}
                <div className="space-y-6">
                    {sorted.map((winner, i) => {
                        const posStyle = POSITION_STYLES[winner.position] || {
                            gradient: 'from-blue-400 to-cyan-400',
                            trophy: 'text-blue-400',
                            glow: '',
                            label: `#${winner.position}`,
                        };

                        return (
                            <motion.div
                                key={winner.id}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className={`relative rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 sm:p-8 ${winner.position <= 3 ? posStyle.glow : ''} transition-all hover:scale-[1.01]`}>
                                    {/* Position stripe */}
                                    <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r ${posStyle.gradient}`} />

                                    <div className="flex items-center gap-5">
                                        {/* Trophy / Position */}
                                        <div className="shrink-0">
                                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${posStyle.gradient} flex items-center justify-center`}>
                                                {winner.position <= 3 ? (
                                                    <Trophy className="w-8 h-8 text-white drop-shadow-md" />
                                                ) : (
                                                    <span className="text-2xl font-black text-white">#{winner.position}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-bold tracking-widest uppercase ${posStyle.trophy}`}>
                                                    {posStyle.label}
                                                </span>
                                                {winner.position === 1 && (
                                                    <motion.span
                                                        animate={{ rotate: [0, 15, -15, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                                    >
                                                        <Sparkles className="w-4 h-4 text-yellow-400" />
                                                    </motion.span>
                                                )}
                                            </div>
                                            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground truncate">
                                                {winner.teamName}
                                            </h2>
                                            <p className="text-sm text-muted-foreground font-medium mt-0.5 truncate">
                                                {winner.projectTitle}
                                            </p>
                                        </div>

                                        {/* Stars */}
                                        <div className="hidden sm:flex gap-1">
                                            {Array.from({ length: Math.max(1, 4 - winner.position) }).map((_, si) => (
                                                <motion.div
                                                    key={si}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.8 + i * 0.2 + si * 0.1 }}
                                                >
                                                    <Star className={`w-5 h-5 fill-current ${posStyle.trophy}`} />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Closing message */}
                {sorted.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="mt-20 text-center"
                    >
                        <div className="inline-block px-8 py-4 rounded-2xl glass-card border border-[var(--primary)]/20">
                            <p className="text-lg font-display font-bold text-foreground mb-1">
                                🌍 All survivors contributed to Earth&apos;s restoration.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Every line of code, every idea, every collaboration mattered. Thank you all.
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
