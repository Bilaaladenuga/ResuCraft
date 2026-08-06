'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface StatItem {
    value: number;
    suffix?: string;
    label: string;
    icon: React.ReactNode;
}

interface StatsCounterProps {
    stats: StatItem[];
}

const AnimatedNumber = ({ value, suffix }: { value: number; suffix?: string }) => {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const duration = 2000;
                    const steps = 60;
                    const increment = value / steps;
                    let current = 0;
                    timerRef.current = setInterval(() => {
                        current += increment;
                        if (current >= value) {
                            setDisplay(value);
                            if (timerRef.current) {
                                clearInterval(timerRef.current);
                                timerRef.current = null;
                            }
                        } else {
                            setDisplay(Math.floor(current));
                        }
                    }, duration / steps);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [value]);

    const formatNumber = (n: number, sfx?: string): string => {
        if (n >= 1000) {
            const k = n >= 10000
                ? Math.round(n / 1000) + 'K'
                : (n / 1000).toFixed(1) + 'K';
            return k + (sfx === '%' ? '' : '+');
        }
        if (sfx === '%') return n.toLocaleString();
        return n.toLocaleString();
    };

    return (
        <span ref={ref} className="stat-counter-value">
            {formatNumber(display, suffix)}{suffix === '%' ? '%' : ''}
        </span>
    );
};

const StatsCounter: React.FC<StatsCounterProps> = ({ stats }) => {
    return (
        <section className="section section-stats">
            <div className="container">
                <motion.div
                    className="stats-grid"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            className="glass-card stat-card"
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <div className="stat-card-icon">{stat.icon}</div>
                            <div className="stat-card-value">
                                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="stat-card-label">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default StatsCounter;
