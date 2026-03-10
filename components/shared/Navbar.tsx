'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore, useTeamStore } from '@/lib/store';
import ThemeToggle from '@/components/shared/ThemeToggle';
import {
    LogOut, Menu, X,
    LayoutDashboard, Lightbulb, Code2, Rocket, Bot,
    Users, FileText, Megaphone, ClipboardList,
    Home, UserPlus, Layers, Box
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();
    const { teams } = useTeamStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Signed out');
        router.push('/');
    };

    const isEnrolled = isAuthenticated && user?.role === 'participant'
        ? teams.some(t => t.leader.email === user.email || t.id === user.teamId)
        : false;

    // Build nav links per role
    const navLinks = (() => {
        if (!isAuthenticated) return [
            { href: '/', label: 'Home', icon: <Home className="w-[14px] h-[14px]" /> },
            { href: '/enroll', label: 'Enroll', icon: <UserPlus className="w-[14px] h-[14px]" /> },
        ];

        if (user?.role === 'admin') return [
            { href: '/admin', label: 'Overview', icon: <LayoutDashboard className="w-[14px] h-[14px]" /> },
            { href: '/admin/enrollments', label: 'Teams', icon: <Users className="w-[14px] h-[14px]" /> },
            { href: '/admin/submissions', label: 'Submissions', icon: <FileText className="w-[14px] h-[14px]" /> },
            { href: '/admin/hackathon', label: 'Hackathon', icon: <ClipboardList className="w-[14px] h-[14px]" /> },
            { href: '/admin/announcements', label: 'Announce', icon: <Megaphone className="w-[14px] h-[14px]" /> },
        ];

        // Participant — always show all sections
        return [
            { href: '/', label: 'Home', icon: <Home className="w-[14px] h-[14px]" /> },
            ...(!isEnrolled ? [{ href: '/enroll', label: 'Enroll', icon: <UserPlus className="w-[14px] h-[14px]" /> }] : []),
            { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-[14px] h-[14px]" /> },
            { href: '/dashboard/ideation', label: 'Ideation', icon: <Lightbulb className="w-[14px] h-[14px]" /> },
            { href: '/dashboard/development', label: 'Build', icon: <Code2 className="w-[14px] h-[14px]" /> },
            { href: '/dashboard/hackathon', label: 'Hackathon', icon: <Rocket className="w-[14px] h-[14px]" /> },
            { href: '/dashboard/agents', label: 'AI Agents', icon: <Bot className="w-[14px] h-[14px]" /> },
        ];
    })();

    // Exact matching for route root-level dashboard, prefix match for deep pages
    const isActive = (href: string) => {
        if (href === '/' || href === '/dashboard' || href === '/admin') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            <div className="w-full h-[88px] flex-shrink-0" /> {/* Spacer to prevent layout shift */}
            <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-400 px-4 pt-4 sm:pt-6 h-[88px] pointer-events-none`}>
                <div
                    className={`mx-auto transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-between glass shadow-lg border border-[var(--border)] relative overflow-hidden pointer-events-auto ${scrolled
                        ? 'max-w-5xl h-14 rounded-full px-4 translate-y-1 bg-white/70 dark:bg-black/40 backdrop-blur-xl'
                        : 'max-w-7xl h-16 rounded-[1.25rem] px-5 sm:px-6 bg-white/50 dark:bg-black/20'
                        }`}
                >

                    {/* Logo */}
                    <Link
                        href={user?.role === 'admin' ? '/admin' : user ? '/dashboard' : '/'}
                        className="flex items-center gap-2.5 flex-shrink-0 z-10 mr-4"
                    >
                        <div className={`flex items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow-sm transition-all duration-300 ${scrolled ? 'w-8 h-8' : 'w-9 h-9'}`}>
                            <Layers className={`${scrolled ? 'w-4 h-4' : 'w-4.5 h-4.5'} fill-current`} />
                        </div>
                        <span className={`font-display font-bold tracking-tight text-foreground transition-all duration-300 hidden sm:block ${scrolled ? 'text-sm' : 'text-[15px]'}`}>
                            Make It Happen
                        </span>
                        {user?.role === 'admin' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white hidden md:inline-block bg-[var(--primary)]">
                                ADMIN
                            </span>
                        )}
                    </Link>

                    {/* Desktop nav links — centered scrollable pill row */}
                    <div className="hidden md:flex flex-1 items-center justify-center overflow-hidden z-10 px-2">
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                            {navLinks.map(link => (
                                <Link key={link.href} href={link.href}>
                                    <span
                                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${isActive(link.href)
                                            ? 'bg-[var(--foreground)] text-[var(--background)] shadow-sm'
                                            : 'text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center justify-end gap-2 sm:gap-2.5 z-10 flex-shrink-0">
                        <ThemeToggle />

                        {isAuthenticated && user ? (
                            <>
                                <button
                                    onClick={handleLogout}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0 bg-[var(--primary)]"
                                    title={user.name}
                                >
                                    {user.name[0].toUpperCase()}
                                </div>
                            </>
                        ) : (
                            <Link href="/login">
                                <span className="btn-primary text-xs font-semibold h-8 px-4 rounded-full inline-flex items-center cursor-pointer shadow-sm">
                                    Sign In
                                </span>
                            </Link>
                        )}

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setMenuOpen(o => !o)}
                            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-foreground/60 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                        >
                            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu dropdown */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="md:hidden absolute top-[4.5rem] left-4 right-4 glass-strong shadow-xl border border-[var(--border)] rounded-2xl p-2 z-40"
                        >
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive(link.href)
                                        ? 'bg-[var(--foreground)] text-[var(--background)] shadow-sm'
                                        : 'text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground'
                                        }`}
                                >
                                    <span className={isActive(link.href) ? 'text-[var(--background)]' : 'text-foreground/50'}>
                                        {link.icon}
                                    </span>
                                    {link.label}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}
