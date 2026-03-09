'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Zap, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();
    const isAdmin = user?.role === 'admin';

    const navLinks = isAdmin
        ? [
            { href: '/admin', label: 'Dashboard' },
            { href: '/admin/enrollments', label: 'Teams' },
            { href: '/admin/submissions', label: 'Submissions' },
            { href: '/admin/hackathon', label: 'Hackathon' },
            { href: '/admin/announcements', label: 'Announcements' },
        ]
        : isAuthenticated
            ? [
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/dashboard/ideation', label: 'Ideation' },
                { href: '/dashboard/development', label: 'Development' },
                { href: '/dashboard/hackathon', label: 'Hackathon' },
                { href: '/dashboard/agents', label: 'AI Agents' },
            ]
            : [];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50 glass-strong"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet to-cyan flex items-center justify-center shadow-lg shadow-violet/20"
                        >
                            <Zap className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="font-display text-lg font-bold gradient-text-violet tracking-tight">
                            Make It Happen
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                        ? 'text-violet bg-violet/8'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-violet to-cyan rounded-full"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                                    >
                                        <Avatar className="w-8 h-8 shadow-md shadow-violet/10">
                                            <AvatarFallback className="bg-gradient-to-br from-violet/20 to-cyan/20 text-violet text-sm font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                                    </motion.div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white border-surface-border shadow-xl shadow-violet/5">
                                    <DropdownMenuItem className="text-muted-foreground text-xs" disabled>
                                        {isAdmin ? <Shield className="w-3 h-3 mr-2" /> : <User className="w-3 h-3 mr-2" />}
                                        {isAdmin ? 'Admin' : 'Participant'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => { window.location.href = isAdmin ? '/admin' : '/dashboard'; }}
                                        className="cursor-pointer"
                                    >
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            logout();
                                            window.location.href = '/';
                                        }}
                                        className="text-red-500 cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground rounded-xl">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/enroll">
                                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                        <Button size="sm" className="bg-gradient-to-r from-violet to-indigo text-white rounded-xl shadow-lg shadow-violet/25 animate-glow-pulse">
                                            Enroll Now
                                        </Button>
                                    </motion.div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
