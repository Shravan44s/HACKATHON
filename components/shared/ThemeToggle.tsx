'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        // Sync with current DOM state on mount
        setDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggle = () => {
        const isDark = !dark;
        setDark(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('mih-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('mih-theme', 'light');
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.90 }}
            whileHover={{ scale: 1.06 }}
            onClick={toggle}
            aria-label="Toggle dark / light mode"
            className="w-9 h-9 rounded-xl glass border border-white/10 dark:border-white/10 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors duration-200"
        >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>
    );
}
