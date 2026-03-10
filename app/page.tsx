'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/shared/Navbar';
import CountdownTimer from '@/components/shared/CountdownTimer';
import { HACKATHON_CONFIG } from '@/lib/auth';
import {
  Rocket, ArrowRight, ChevronDown, Layers, Box, Component, Network, Cpu, ShieldCheck
} from 'lucide-react';

const features = [
  { icon: <Cpu className="w-5 h-5" />, title: 'AI Automation', desc: 'Embedded AI agents handle boilerplate code, test generation, and review processes.' },
  { icon: <Network className="w-5 h-5" />, title: 'Live Collab', desc: 'Real-time synchronization for code logic, architecture planning, and deployment tracking.' },
  { icon: <Component className="w-5 h-5" />, title: 'Phase Progression', desc: 'Structured checkpoints from initial ideation straight through to the final pitch.' },
  { icon: <Box className="w-5 h-5" />, title: 'Clear Evaluation', desc: 'Transparent judging paradigms with multiple rounds and instant leaderboard updates.' },
  { icon: <Layers className="w-5 h-5" />, title: 'Team Sync', desc: 'Granular access controls, role assignments, and integrated collaborative workspaces.' },
  { icon: <ShieldCheck className="w-5 h-5" />, title: 'Control Panel', desc: 'Command center for organizers to manage the entire hackathon lifecycle.' },
];

const stats = [
  { label: 'AI Agents', value: '9+' },
  { label: 'Phases', value: '5' },
  { label: 'Teams', value: '∞' },
  { label: 'Hours', value: '24' },
];

const techLogos = ['React', 'Next.js', 'Python', 'TensorFlow', 'PostgreSQL', 'Docker', 'Gemini AI', 'TypeScript', 'Node.js', 'Vercel'];
const heroWords = ['Innovate.', 'Collaborate.', 'Ship.', 'Win.'];

function CyclingText() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIndex(i => (i + 1) % heroWords.length), 2200);
    return () => clearInterval(iv);
  }, []);
  return (
    <span className="inline-block relative h-[1.15em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={heroWords[index]}
          initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -40, opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="gradient-text inline-block"
        >
          {heroWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function ShootingStars() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="shooting-star-container">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="shooting-star"
          style={{
            top: `${Math.random() * -20}%`,
            left: `${Math.random() * 120}%`,
            width: `${150 + Math.random() * 250}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            opacity: 0.5 + Math.random() * 0.5
          }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen overflow-clip">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <motion.section style={{ y: heroY, opacity: heroOpacity }} className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-10">

        {/* Ambient structure */}
        <ShootingStars />
        <div className="absolute top-[-5%] left-[20%] w-[600px] h-[600px] rounded-full blur-[140px] animate-morph pointer-events-none opacity-[0.14] dark:opacity-[0.18]"
          style={{ background: 'var(--primary)' }} />
        <div className="absolute bottom-[5%] right-[15%] w-[450px] h-[450px] rounded-full blur-[120px] animate-morph pointer-events-none opacity-[0.10] dark:opacity-[0.14]"
          style={{ background: 'var(--primary)', animationDelay: '-5s' }} />
        <div className="absolute inset-0 dot-grid opacity-[0.08] dark:opacity-[0.15] pointer-events-none" />

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 14 }}
          className="relative z-10 mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 glass pearl-border rounded-full shadow-sm">
            <span className="relative flex h-2 w-2 ml-1">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">{HACKATHON_CONFIG.name}</span>
          </div>
        </motion.div>

        {/* Title */}
        <div className="relative z-10 text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-7xl md:text-[6.5rem] font-extrabold leading-[0.95] tracking-tight text-foreground"
          >
            Make It<br />
            <span className="text-[var(--primary)] drop-shadow-sm">Happen</span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 text-center mb-6"
        >
          <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed font-medium">
            The intelligent hackathon ecosystem where precise engineering teams
          </p>
          <div className="mt-3 text-3xl sm:text-4xl font-display font-bold text-foreground">
            <CyclingText />
          </div>
        </motion.div>

        {/* CTAs — Apple style */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, type: 'spring', stiffness: 80 }}
          className="relative z-10 flex flex-col sm:flex-row gap-3 mt-8"
        >
          <Link href="/enroll">
            <motion.span
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary inline-flex items-center justify-center min-w-[160px] gap-2 h-11 px-7 rounded-xl text-[13px] shadow-md cursor-pointer"
            >
              Enroll Team
            </motion.span>
          </Link>
          <Link href="/login">
            <motion.span
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-glass inline-flex items-center justify-center min-w-[160px] gap-2 h-11 px-7 rounded-xl text-[13px] cursor-pointer"
            >
              Platform Login <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="relative z-10 mt-14 mb-8"
        >
          <CountdownTimer targetDate={HACKATHON_CONFIG.startDate} label="T-Minus" />
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
            <div className="flex flex-col items-center gap-1.5 text-foreground/30 hover:text-foreground/60 transition-colors cursor-pointer">
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase">Scroll</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══ TECH MARQUEE ═══ */}
      <section className="relative z-10 py-6 border-y border-[var(--border)] overflow-hidden bg-white/20 dark:bg-black/20 backdrop-blur-sm">
        <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-4">Powered by modern infrastructure</p>
        <div className="flex animate-[marquee_32s_linear_infinite]">
          {[...techLogos, ...techLogos].map((logo, i) => (
            <div key={i} className="flex-shrink-0 mx-3 px-3.5 py-1.5 glass rounded-full border border-[var(--border)] shadow-sm">
              <span className="text-[11px] font-bold text-foreground/50 whitespace-nowrap">{logo}</span>
            </div>
          ))}
        </div>
        <style jsx>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
              className="glass-card p-6 text-center border-[var(--border)]"
            >
              <div className="font-display text-4xl font-extrabold text-[var(--primary)] mb-2 drop-shadow-sm">{s.value}</div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass pearl-border rounded-full mb-6 shadow-sm">
            <Layers className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
            <span className="text-[11px] font-bold text-foreground/70 uppercase tracking-wide">Platform Architecture</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Built for <span className="text-[var(--primary)]">Engineers</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto font-medium">Everything required to go from chaotic brainstorming to a polished deployment in precisely 24 hours.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 90 }}
              className="glass-card p-7 group cursor-default transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105 shadow-sm"
                style={{ background: 'var(--primary)', color: 'white' }}>
                {f.icon}
              </div>
              <h3 className="text-[15px] font-bold text-foreground mb-2 group-hover:text-[var(--primary)] transition-colors">{f.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 80 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative overflow-hidden glass-card pearl-border p-12 sm:p-20 text-center shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[100px] opacity-[0.12] pointer-events-none"
              style={{ background: 'var(--primary)' }} />
            <div className="relative z-10">
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground mb-5 tracking-tight">
                Initialize <span className="text-[var(--primary)]">Sequence</span>
              </h2>
              <p className="text-muted-foreground text-[15px] mb-10 max-w-lg mx-auto font-medium">
                Team registration closes automatically. Secure your sandbox environment today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/enroll">
                  <motion.span whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}
                    className="btn-primary inline-flex items-center justify-center min-w-[160px] h-12 px-8 textsm font-bold shadow-md cursor-pointer">
                    Start Hacking
                  </motion.span>
                </Link>
                <Link href="/login">
                  <motion.span whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}
                    className="btn-glass inline-flex items-center justify-center min-w-[160px] h-12 px-8 text-sm font-bold shadow-sm cursor-pointer">
                    Dashboard Login
                  </motion.span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'var(--primary)' }}>
              <Layers className="w-4 h-4 text-white fill-current" />
            </div>
            <span className="font-display font-bold text-[15px] text-foreground">Make It Happen</span>
          </div>
          <div className="flex gap-4">
            <span className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Platform Status</span>
            <span className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Documentation</span>
          </div>
          <p className="text-[11px] font-medium text-muted-foreground tracking-wide">© 2026 ENGINE. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
