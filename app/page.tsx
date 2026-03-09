'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/shared/Navbar';
import CountdownTimer from '@/components/shared/CountdownTimer';
import { HACKATHON_CONFIG } from '@/lib/auth';
import { Sparkles, Bot, Zap, BarChart3, Users, Shield, Rocket, ArrowRight, Star, Code, Lightbulb, Cpu, Boxes, Globe, ChevronDown } from 'lucide-react';



/* ─── Feature cards ─── */
const features = [
  { icon: <Bot className="w-6 h-6" />, title: 'AI Agents Hub', desc: '9 specialized AI agents to brainstorm, code, pitch, and design.', color: '#7c3aed', emoji: '🤖' },
  { icon: <Zap className="w-6 h-6" />, title: 'Live Hackathon', desc: '24-hour live coding sprint with real-time updates and judge feedback.', color: '#0891b2', emoji: '⚡' },
  { icon: <Lightbulb className="w-6 h-6" />, title: 'Phase Tracking', desc: 'Progress from ideation through development to final presentation.', color: '#d97706', emoji: '💡' },
  { icon: <BarChart3 className="w-6 h-6" />, title: 'Fair Evaluation', desc: 'Multi-round scoring with transparent leaderboards.', color: '#059669', emoji: '📊' },
  { icon: <Users className="w-6 h-6" />, title: 'Team Management', desc: 'Seamless enrollment and collaboration tools.', color: '#e11d48', emoji: '👥' },
  { icon: <Shield className="w-6 h-6" />, title: 'Admin Dashboard', desc: 'Full control panel for organizers with real-time analytics.', color: '#4f46e5', emoji: '🛡️' },
];

const stats = [
  { label: 'AI Agents', value: '9+', icon: <Bot className="w-5 h-5" /> },
  { label: 'Phases', value: '5', icon: <Code className="w-5 h-5" /> },
  { label: 'Teams', value: '∞', icon: <Users className="w-5 h-5" /> },
  { label: 'Hours', value: '24', icon: <Zap className="w-5 h-5" /> },
];

/* ─── Marquee logos ─── */
const techLogos = ['React', 'Next.js', 'Python', 'TensorFlow', 'Firebase', 'MongoDB', 'Docker', 'Gemini AI', 'TypeScript', 'Node.js', 'PostgreSQL', 'Flutter'];

/* ─── Animated text words ─── */
const heroWords = ['Innovate.', 'Collaborate.', 'Ship.', 'Win.'];

/* ─── Mouse-tracking card ─── */
function MagneticCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const resetMouse = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Cycling text ─── */
function CyclingText() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex(i => (i + 1) % heroWords.length), 2000);
    return () => clearInterval(interval);
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

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const parallax1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const parallax2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20"
      >
        {/* Animated dot grid */}
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        {/* Aurora blobs */}
        <motion.div style={{ y: parallax1 }} className="absolute top-10 left-[15%] w-[500px] h-[500px] bg-violet/6 rounded-full blur-[100px] animate-morph pointer-events-none" />
        <motion.div style={{ y: parallax2, animationDelay: '-4s' }} className="absolute bottom-10 right-[10%] w-[600px] h-[600px] bg-cyan/5 rounded-full blur-[120px] animate-morph pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[80px] animate-morph pointer-events-none" style={{ animationDelay: '-8s' }} />



        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 14 }}
          className="relative z-10 mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-surface-border shadow-xl shadow-violet/5">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="w-4 h-4 text-violet" />
            </motion.div>
            <span className="text-sm font-semibold text-foreground">{HACKATHON_CONFIG.name}</span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </motion.div>

        {/* Title */}
        <div className="relative z-10 text-center mb-6 overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 80, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl sm:text-7xl md:text-[5.5rem] font-extrabold leading-[0.92] tracking-tight"
          >
            <span className="text-foreground">Make It</span>
            <br />
            <span className="gradient-text">Happen</span>
          </motion.h1>
        </div>

        {/* Subtitle with cycling text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center mb-4"
        >
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The AI-powered hackathon platform where teams
          </p>
          <div className="mt-2 text-3xl sm:text-4xl font-display font-extrabold">
            <CyclingText />
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 80 }}
          className="relative z-10 flex flex-col sm:flex-row gap-4 mt-8"
        >
          <Link href="/enroll">
            <motion.div whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.96 }}>
              <Button size="lg" className="bg-gradient-to-r from-violet via-indigo to-violet-dark text-white px-10 py-7 text-lg rounded-2xl shadow-2xl shadow-violet/30 font-bold relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Rocket className="w-5 h-5 mr-2.5" />
                Enroll Your Team
              </Button>
            </motion.div>
          </Link>
          <Link href="/login">
            <motion.div whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.96 }}>
              <Button size="lg" variant="outline" className="px-10 py-7 text-lg rounded-2xl border-2 border-surface-border bg-white/70 backdrop-blur-sm shadow-xl font-bold hover:border-violet/30 hover:shadow-violet/10">
                Admin Login <ArrowRight className="w-5 h-5 ml-2.5" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="relative z-10 mt-16"
        >
          <CountdownTimer targetDate={HACKATHON_CONFIG.startDate} label="Hackathon Starts In" />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <span className="text-xs font-medium tracking-wider uppercase">Scroll to explore</span>
              <ChevronDown className="w-5 h-5" />
            </div>
          </motion.div>
        </motion.div>


      </motion.section>

      {/* ═══ TECH MARQUEE ═══ */}
      <section className="relative z-10 py-12 border-y border-surface-border bg-surface-raised/50 overflow-hidden">
        <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-6">Built with the best tech stack</p>
        <div className="relative">
          <div className="flex animate-[marquee_25s_linear_infinite]">
            {[...techLogos, ...techLogos].map((logo, i) => (
              <div key={i} className="flex-shrink-0 mx-8 px-6 py-2.5 rounded-xl bg-white border border-surface-border shadow-sm">
                <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="relative z-10 py-16 max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <MagneticCard key={s.label} className="cursor-default">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 120 }}
                className="premium-card p-6 text-center hover-lift"
              >
                <div className="flex items-center justify-center text-violet mb-2">{s.icon}</div>
                <div className="font-display text-4xl font-extrabold gradient-text-violet">{s.value}</div>
                <p className="text-xs text-muted-foreground mt-1 font-semibold uppercase tracking-wide">{s.label}</p>
              </motion.div>
            </MagneticCard>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-24 px-4 max-w-6xl mx-auto aurora-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet/5 border border-violet/10 mb-6">
            <Sparkles className="w-4 h-4 text-violet" />
            <span className="text-sm font-semibold text-violet">Features</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Everything You Need to <span className="gradient-text">Win</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From AI-powered ideation to live hackathon tracking — every tool covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((f, i) => (
            <MagneticCard key={f.title} className="cursor-default">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 80 }}
                className="premium-card p-8 group h-full"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg"
                    style={{ background: `${f.color}10`, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <div className="text-3xl mt-1 opacity-30 group-hover:opacity-60 transition-opacity">{f.emoji}</div>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-violet transition-colors duration-300">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>

                {/* Hover accent line */}
                <motion.div
                  className="mt-5 h-1 rounded-full bg-gradient-to-r from-violet to-cyan origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            </MagneticCard>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 60 }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet via-indigo to-cyan p-12 sm:p-16 text-center">
            {/* Animated decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.18),transparent_60%)]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-morph" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-morph" style={{ animationDelay: '-3s' }} />

            {/* Grid lines */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
                  Ready to Make<br />It Happen?
                </h2>
                <p className="text-white/80 text-lg mb-10 max-w-lg mx-auto">
                  Enroll your team, harness AI agents, and build something incredible in 24 hours.
                </p>
              </motion.div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/enroll">
                  <motion.div whileHover={{ scale: 1.07, y: -3 }} whileTap={{ scale: 0.96 }}>
                    <Button size="lg" className="bg-white text-violet px-10 py-7 text-lg rounded-2xl font-bold shadow-2xl hover:shadow-white/20 relative overflow-hidden group">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-violet/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <Rocket className="w-5 h-5 mr-2" />
                      Enroll Now
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.07, y: -3 }} whileTap={{ scale: 0.96 }}>
                    <Button size="lg" variant="outline" className="border-2 border-white/30 text-white px-10 py-7 text-lg rounded-2xl font-bold bg-white/10 backdrop-blur-sm hover:bg-white/20">
                      Login <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12 border-t border-surface-border bg-surface-raised/30">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet to-cyan flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold gradient-text-violet">Make It Happen</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Make It Happen. Built with ❤️ and AI.
          </p>
        </div>
      </footer>

      {/* Marquee animation CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
