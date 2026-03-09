'use client';

import { Check, UserPlus, Lightbulb, Code, Zap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Phase } from '@/lib/types';

const phaseIcons: Record<Phase, React.ReactNode> = {
    enrollment: <UserPlus className="w-4 h-4" />,
    ideation: <Lightbulb className="w-4 h-4" />,
    development: <Code className="w-4 h-4" />,
    hackathon: <Zap className="w-4 h-4" />,
    results: <Trophy className="w-4 h-4" />,
};

const phaseLabels: Record<Phase, string> = {
    enrollment: 'Enrollment',
    ideation: 'Ideation',
    development: 'Development',
    hackathon: '24h Hackathon',
    results: 'Results',
};

const phaseColors: Record<Phase, string> = {
    enrollment: '#7c3aed',
    ideation: '#f59e0b',
    development: '#06b6d4',
    hackathon: '#ef4444',
    results: '#10b981',
};

const phases: Phase[] = ['enrollment', 'ideation', 'development', 'hackathon', 'results'];

interface PhaseStepperProps {
    currentPhase: Phase;
    completedPhases?: Phase[];
}

export default function PhaseStepper({ currentPhase, completedPhases = [] }: PhaseStepperProps) {
    const currentIndex = phases.indexOf(currentPhase);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between relative">
                {/* Progress line background */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-surface-border mx-8" />

                {/* Active progress line */}
                <motion.div
                    className="absolute top-5 left-0 h-0.5 mx-8"
                    style={{ background: `linear-gradient(90deg, #7c3aed, ${phaseColors[currentPhase]})` }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentIndex / (phases.length - 1)) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                />

                {phases.map((phase, index) => {
                    const isCompleted = completedPhases.includes(phase);
                    const isCurrent = phase === currentPhase;
                    const isPast = index < currentIndex;
                    const color = phaseColors[phase];

                    return (
                        <motion.div
                            key={phase}
                            className="flex flex-col items-center relative z-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted || isPast
                                        ? 'border-transparent'
                                        : isCurrent
                                            ? 'border-transparent'
                                            : 'border-surface-border bg-surface-raised'
                                    }`}
                                style={{
                                    background: isCompleted || isPast || isCurrent
                                        ? color
                                        : undefined,
                                    boxShadow: isCurrent ? `0 0 20px ${color}40` : undefined,
                                }}
                                whileHover={{ scale: 1.1 }}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4 text-white" />
                                ) : (
                                    <span className={isCompleted || isPast || isCurrent ? 'text-white' : 'text-muted-foreground'}>
                                        {phaseIcons[phase]}
                                    </span>
                                )}
                            </motion.div>
                            <span
                                className={`mt-2 text-xs font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'
                                    }`}
                            >
                                {phaseLabels[phase]}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
