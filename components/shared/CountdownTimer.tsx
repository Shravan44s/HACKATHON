'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
    targetDate: string;
    label?: string;
    size?: 'sm' | 'lg';
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function CountdownTimer({ targetDate, label = 'Hackathon Starts In', size = 'lg' }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate).getTime() - new Date().getTime();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };
        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!mounted) return null;

    const units = [
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Minutes' },
        { value: timeLeft.seconds, label: 'Seconds' },
    ];

    const isLarge = size === 'lg';

    return (
        <div className="text-center">
            {label && (
                <p className={`text-muted-foreground mb-4 ${isLarge ? 'text-lg' : 'text-sm'}`}>
                    {label}
                </p>
            )}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
                {units.map((unit, index) => (
                    <motion.div
                        key={unit.label}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col items-center"
                    >
                        <div
                            className={`glass glow-border rounded-xl flex items-center justify-center font-mono font-bold ${isLarge
                                    ? 'w-20 h-20 sm:w-24 sm:h-24 text-3xl sm:text-4xl'
                                    : 'w-14 h-14 text-xl'
                                }`}
                        >
                            <motion.span
                                key={unit.value}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-foreground"
                            >
                                {String(unit.value).padStart(2, '0')}
                            </motion.span>
                        </div>
                        <span className={`mt-2 text-muted-foreground font-medium ${isLarge ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                            {unit.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
