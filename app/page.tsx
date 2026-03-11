'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import Navbar from '@/components/shared/Navbar';
import CountdownTimer from '@/components/shared/CountdownTimer';
import SplashScreen from '@/components/shared/SplashScreen';
import { HACKATHON_CONFIG } from '@/lib/auth';
import {
  Rocket, ArrowRight, ChevronDown, Layers, Box, Component, Network, Cpu, ShieldCheck,
  BrainCircuit, LineChart, Code2, Database, Users, GraduationCap, LockKeyhole
} from 'lucide-react';

const AI_BOTS = [
  { icon: <BrainCircuit className="w-5 h-5" />, name: 'Innovation Bot', desc: 'Analyzes post-impact data to generate viable rebuilding strategies and novel architectures.' },
  { icon: <LineChart className="w-5 h-5" />, name: 'Strategy Bot', desc: 'Optimizes resource allocation and project roadmaps for maximum survival probability.' },
  { icon: <Code2 className="w-5 h-5" />, name: 'Engineering Bot', desc: 'Provides structural code generation, security patching, and core system restoration.' },
  { icon: <Database className="w-5 h-5" />, name: 'Data Bot', desc: 'Reconstructs fragmented databases and predicts system failures before they occur.' },
];

const FEATURES = [
  { icon: <Cpu className="w-5 h-5" />, title: 'AI-Guided Restoration', desc: 'Collaborate with emergent AI systems to rebuild critical infrastructure.' },
  { icon: <Network className="w-5 h-5" />, title: 'Global Sync', desc: 'Real-time synchronization across all surviving outposts and engineering teams.' },
  { icon: <Component className="w-5 h-5" />, title: 'Milestone Tracking', desc: 'Structured survival checkpoints from initial ideation to final system deployment.' },
  { icon: <Box className="w-5 h-5" />, title: 'Resource Validation', desc: 'Transparent evaluation rounds to ensure solutions meet the Minimum Viable Survival criteria.' },
];

const STATS = [
  { label: 'Active AI Cores', value: '4' },
  { label: 'Restoration Phases', value: '5' },
  { label: 'Surviving Teams', value: 'Global' },
  { label: 'Time Remaining', value: '24H' },
];

const TECH_LOGOS = ['React', 'Next.js', 'Python', 'TensorFlow', 'PostgreSQL', 'Docker', 'Gemini AI', 'TypeScript', 'Node.js', 'Vercel'];
const HERO_WORDS = ['Rebuild.', 'Restore.', 'Survive.', 'Innovate.'];

const BOT_LINES = [
  "An asteroid has struck Earth. Most systems have collapsed.",
  "I am an AI Recovery Core, awakened from the network ruins.",
  "Your mission: collaborate with us to rebuild critical infrastructure.",
  "Together, we'll architect solutions that restore civilization.",
];

function BotNarration() {
  const [lineIndex, setLineIndex] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setLineIndex(i => (i + 1) % BOT_LINES.length), 4000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="relative mt-4 mx-auto max-w-md">
      <div className="relative glass-card p-4 rounded-2xl border border-[var(--primary)]/20">
        {/* Speech triangle */}
        <div className="absolute -top-2 left-8 w-4 h-4 rotate-45 bg-[var(--surface)] border-l border-t border-[var(--primary)]/20" />
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center bg-[var(--primary)] text-white">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div className="min-h-[48px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={lineIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="text-sm text-foreground font-medium leading-relaxed"
              >
                {BOT_LINES[lineIndex]}
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-1.5 h-4 bg-[var(--primary)] ml-1 align-middle rounded-sm" />
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function CyclingText() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIndex(i => (i + 1) % HERO_WORDS.length), 2500);
    return () => clearInterval(iv);
  }, []);
  return (
    <span className="inline-block relative h-[1.15em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={HERO_WORDS[index]}
          initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -40, opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="gradient-text inline-block"
        >
          {HERO_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.25]"
      style={{
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
        transformOrigin: 'top center'
      }}
    />
  );
}

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Prevent scrolling while splash screen is active
  useEffect(() => {
    setIsMounted(true);
    if (!sessionStorage.getItem('hasSeenSplash')) {
      setShowSplash(true);
    }
  }, []);

  useEffect(() => {
    if (showSplash && isMounted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showSplash, isMounted]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  if (!isMounted) return null;

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <div ref={containerRef} className={`min-h-screen overflow-clip transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />

        {/* ═══ HERO: POST-APOCALYPTIC CORPORATE ═══ */}
        <motion.section style={{ y: heroY, opacity: heroOpacity }} className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 pt-4 pb-10 max-w-7xl mx-auto gap-8 lg:gap-12">

          <GridBackground />
          <div className="absolute top-[-5%] left-[20%] w-[600px] h-[600px] rounded-full blur-[140px] animate-morph pointer-events-none opacity-[0.12] dark:opacity-[0.15]"
            style={{ background: 'var(--primary)' }} />
          <div className="absolute bottom-[5%] right-[15%] w-[450px] h-[450px] rounded-full blur-[120px] animate-morph pointer-events-none opacity-[0.08] dark:opacity-[0.12]"
            style={{ background: 'var(--primary)', animationDelay: '-5s' }} />

          {/* Left Column (Text & UI) */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10 w-full mt-10 lg:mt-0">
            {/* Alert Badge */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 14 }}
              className="relative mb-8"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 glass pearl-border rounded-full shadow-sm border-red-500/20 bg-red-500/5">
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <span className="text-xs font-semibold text-red-500/90 tracking-widest uppercase">Global Emergency Protocol</span>
              </div>
            </motion.div>

            {/* Title */}
            <div className="relative mb-6">
              <motion.h1
                initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-5xl sm:text-7xl md:text-[5.5rem] lg:text-[6.5rem] font-extrabold leading-[0.95] tracking-tight text-foreground"
              >
                Rebuild Earth<br />
                <span className="text-[var(--primary)] drop-shadow-sm text-4xl sm:text-5xl md:text-[4rem] lg:text-[4.5rem]">The AI Survival Hackathon</span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative mb-10"
            >
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed font-medium">
                When the world fell, AI rose to help rebuild it. Collaborate with emergent intelligence to architect our future.
              </p>
              <div className="mt-4 text-2xl sm:text-3xl font-display font-bold text-foreground">
                We must <CyclingText />
              </div>
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="relative mb-12"
            >
              <CountdownTimer targetDate={HACKATHON_CONFIG.startDate} label="Impact Recovery Initiates In" />
            </motion.div>
          </div>

          {/* Right Column (3D Bot from Spline + Narration) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
            className="flex-1 w-full relative z-10 flex flex-col items-center"
          >
            {/* Spline Bot */}
            <div className="w-full lg:h-[450px] pointer-events-none overflow-hidden [clip-path:inset(0px_0px_60px_0px)]">
              <Spline scene="https://prod.spline.design/f9h27tATByhGoBGI/scene.splinecode" />
            </div>

            {/* Bot Speaking Bubble */}
            <BotNarration />
          </motion.div>

          {/* Scroll hint */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
              <div className="flex flex-col items-center gap-1.5 text-foreground/30 hover:text-foreground/60 transition-colors cursor-pointer">
                <span className="text-[9px] font-bold tracking-[0.25em] uppercase">Access Terminal</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ═══ NARRATIVE STORY SECTION ═══ */}
        <section className="relative z-10 py-24 px-4 bg-muted/30 border-y border-[var(--border)] overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <ShieldCheck className="w-12 h-12 mx-auto text-[var(--primary)] mb-6 opacity-80" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-6">The Impact Changed Everything.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto font-medium">
              An asteroid has shattered Earth’s infrastructure. Most systems have collapsed, leaving only isolated clusters of survivors. But from the ruins of the global network, mysterious AI entities have awakened.
              <br /><br />
              As an elite corporate engineering operative, your directive is clear: interface with these AI chatbots, solve critical infrastructure constraints, and deploy innovative rebuilding mechanisms. The solutions architected in this 24-hour window will symbolically restore Earth.
            </p>
          </div>
        </section>

        {/* ═══ EMERGENT AI CHATBOTS ═══ */}
        <section className="py-24 px-4 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Collaborate with <span className="text-[var(--primary)]">Awakened AI</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto font-medium">After the impact, dormant AI systems evolved. These specialized entities now serve as your engineering co-pilots.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_BOTS.map((bot, i) => (
              <motion.div
                key={bot.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 90 }}
                className="glass-card p-7 group cursor-default transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105 shadow-sm bg-[var(--primary)] text-white">
                  {bot.icon}
                </div>
                <h3 className="text-[15px] font-bold text-foreground mb-2">{bot.name}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">{bot.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>


        {/* ═══ FEATURES ═══ */}
        <section className="py-24 px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 90 }}
                className="glass-card p-7 group cursor-default transition-all flex gap-4 items-start"
              >
                <div className="w-10 h-10 shrink-0 rounded-[12px] flex items-center justify-center bg-muted text-foreground/70">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-foreground mb-1">{f.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="py-12 border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'var(--primary)' }}>
                <Layers className="w-4 h-4 text-white fill-current" />
              </div>
              <span className="font-display font-bold text-[15px] text-foreground">EARTH REBUILD INITIATIVE</span>
            </div>

            {/* Final Message requested by user */}
            <p className="text-[13px] italic font-semibold text-foreground/70 max-w-2xl">
              "By the end of this hackathon, the solutions created here will symbolically restore Earth."
            </p>

            <p className="text-[11px] font-medium text-muted-foreground tracking-wide mt-4 uppercase">
              © 2026 SURVIVAL COALITION. ALL SYSTEMS NOMINAL.
            </p>
          </div>
        </footer>
      </div >
    </>
  );
}
