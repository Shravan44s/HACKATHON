import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
    onComplete: () => void;
}

const BOOT_LINES = [
    '> ASTEROID IMPACT DETECTED...',
    '> GLOBAL SYSTEMS: ██████░░░░ 62% DESTROYED',
    '> SCANNING FOR SURVIVORS...',
    '> AI RECOVERY CORES: ONLINE',
    '> INITIATING EARTH REBUILD PROTOCOL...',
];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [visibleLines, setVisibleLines] = useState(0);
    const [showSkip, setShowSkip] = useState(false);

    const dismiss = useCallback(() => {
        setIsVisible(false);
        setTimeout(onComplete, 800);
    }, [onComplete]);

    useEffect(() => {
        // Typewriter boot lines
        const lineTimers = BOOT_LINES.map((_, i) =>
            setTimeout(() => setVisibleLines(i + 1), 1200 + i * 900)
        );

        // Show skip button after 1.5s
        const skipTimer = setTimeout(() => setShowSkip(true), 1500);

        // Auto-dismiss after all lines + a pause
        const autoTimer = setTimeout(dismiss, 1200 + BOOT_LINES.length * 900 + 1500);

        return () => {
            lineTimers.forEach(clearTimeout);
            clearTimeout(skipTimer);
            clearTimeout(autoTimer);
        };
    }, [dismiss]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[100] bg-black overflow-hidden"
                >
                    {/* Full-screen clear video */}
                    <video
                        autoPlay
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/Asteroid_Landing_Screen_Animation_Video.mp4" type="video/mp4" />
                    </video>

                    {/* Subtle scanlines overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.06] z-10"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                        }}
                    />

                    {/* Bottom gradient for text readability */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Boot Sequence Terminal */}
                    <div className="absolute bottom-12 left-6 sm:left-12 z-20 max-w-lg">
                        <div className="space-y-1.5">
                            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`font-mono text-xs sm:text-sm tracking-wide ${
                                        i === visibleLines - 1
                                            ? 'text-green-400'
                                            : 'text-green-400/50'
                                    }`}
                                >
                                    {line}
                                    {i === visibleLines - 1 && (
                                        <motion.span
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity }}
                                            className="ml-0.5 inline-block w-2 h-4 bg-green-400 align-middle"
                                        />
                                    )}
                                </motion.p>
                            ))}
                        </div>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.7, filter: 'blur(16px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none drop-shadow-2xl"
                        >
                            SYSTEM FAILURE
                            <br />
                            <span className="text-red-500 animate-pulse">DETECTED</span>
                        </motion.h1>
                    </div>

                    {/* Skip Button */}
                    {showSkip && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={dismiss}
                            className="absolute top-6 right-6 z-30 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-semibold tracking-widest uppercase"
                        >
                            SKIP ›
                        </motion.button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
