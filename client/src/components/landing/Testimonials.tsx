'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export interface Testimonial {
    name: string;
    role: string;
    quote: string;
    avatar?: string;
}

interface TestimonialsProps {
    testimonials: Testimonial[];
    autoPlayInterval?: number;
}

const Testimonials: React.FC<TestimonialsProps> = ({
    testimonials,
    autoPlayInterval = 5000,
}) => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        if (testimonials.length <= 1) return;
        const timer = setInterval(() => {
            setDirection(1);
            setCurrent(prev => (prev + 1) % testimonials.length);
        }, autoPlayInterval);
        return () => clearInterval(timer);
    }, [testimonials.length, autoPlayInterval]);

    const goTo = (index: number) => {
        setDirection(index > current ? 1 : -1);
        setCurrent(index);
    };

    const goNext = () => {
        setDirection(1);
        setCurrent(prev => (prev + 1) % testimonials.length);
    };

    const goPrev = () => {
        setDirection(-1);
        setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const variants = {
        enter: (dir: number) => ({ opacity: 0, x: dir * 80 }),
        center: { opacity: 1, x: 0 },
        exit: (dir: number) => ({ opacity: 0, x: dir * -80 }),
    };

    const t = testimonials[current];

    return (
        <section className="section section-testimonials">
            <div className="container text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="section-label">Trusted by professionals</div>
                    <h2 className="section-title center">What Our Users Say</h2>
                    <p className="section-subtitle center">
                        Real stories from people who landed their dream jobs with ResuCraft.
                    </p>
                </motion.div>

                <motion.div
                    className="testimonial-carousel"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.15 }}
                >
                    <div className="testimonial-card glass-card">
                        <div className="testimonial-quote-icon">
                            <Quote size={32} />
                        </div>

                        <div className="testimonial-stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill="var(--secondary)" color="var(--secondary)" />
                            ))}
                        </div>

                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={current}
                                className="testimonial-content"
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: 'easeInOut' }}
                            >
                                <p className="testimonial-quote">"{t.quote}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">
                                        {t.avatar ? (
                                            <img src={t.avatar} alt={t.name} />
                                        ) : (
                                            <span>{t.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="testimonial-author-info">
                                        <strong>{t.name}</strong>
                                        <span>{t.role}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="testimonial-nav">
                            <button className="testimonial-nav-btn" onClick={goPrev} aria-label="Previous testimonial">
                                <ChevronLeft size={18} />
                            </button>
                            <div className="testimonial-dots">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`testimonial-dot ${i === current ? 'active' : ''}`}
                                        onClick={() => goTo(i)}
                                        aria-label={`Go to testimonial ${i + 1}`}
                                    />
                                ))}
                            </div>
                            <button className="testimonial-nav-btn" onClick={goNext} aria-label="Next testimonial">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
