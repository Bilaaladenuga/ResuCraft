'use client';
import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const BeforeAfterSlider: React.FC = () => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(1, Math.min(clientX - rect.left, rect.width));
        setSliderPos((x / rect.width) * 100);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        handleMove(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        isDragging.current = true;
        handleMove(touch.clientX);
    };

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging.current) handleMove(e.clientX);
        };
        const handleMouseUp = () => { isDragging.current = false; };
        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging.current) {
                const touch = e.touches[0];
                handleMove(touch.clientX);
            }
        };
        const handleTouchEnd = () => { isDragging.current = false; };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleMove]);

    return (
        <section className="section section-beforeafter">
            <div className="container">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="section-label">See the difference</div>
                    <h2 className="section-title center">Before ResuCraft vs. After</h2>
                    <p className="section-subtitle center">
                        Drag the slider to compare a traditional resume with an AI-enhanced one.
                    </p>
                </motion.div>

                <motion.div
                    className="ba-container"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: 0.15 }}
                >
                    <div
                        className="ba-frame"
                        ref={containerRef}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                    >
                        {/* Labels */}
                        <div className="ba-label ba-label--before">Before</div>
                        <div className="ba-label ba-label--after">After</div>

                        {/* After (right side) — shown as the full image */}
                        <div className="ba-side ba-side--after">
                            <div className="ba-content ba-content--after">
                                <div className="ba-after-header">
                                    <div>
                                        <h4>Alex Rivera</h4>
                                        <p>Senior Software Engineer</p>
                                    </div>
                                    <span className="ba-after-badge">
                                        <Sparkles size={12} /> AI Enhanced
                                    </span>
                                </div>
                                <div className="ba-after-summary">
                                    <span className="ba-section-tag">Professional Summary</span>
                                    <p>
                                        Results-driven Senior Software Engineer with 8+ years of experience in
                                        full-stack development, distributed systems, and team leadership.
                                        <span className="ba-highlight"> Architected microservices that reduced API latency by 45%</span>
                                        and improved system reliability to 99.9% uptime.
                                    </p>
                                </div>
                                <div className="ba-after-experience">
                                    <span className="ba-section-tag">Experience</span>
                                    <div className="ba-after-entry">
                                        <strong>Tech Corp</strong>
                                        <ul>
                                            <li>Led migration of legacy monolith to microservices, <span className="ba-highlight">reducing deployment time by 80%</span></li>
                                            <li>Mentored 5 junior engineers through structured code review program</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="ba-after-skills">
                                    <span className="ba-section-tag">Skills</span>
                                    <div className="ba-after-chips">
                                        {['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes'].map(s => (
                                            <span key={s} className="ba-chip">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Before (left side) — clipped by overflow hidden */}
                        <div
                            className="ba-side ba-side--before"
                            style={{ width: `${sliderPos}%` }}
                        >
                            <div className="ba-content ba-content--before" style={{ width: `calc(100% / ${sliderPos / 100})` }}>
                                <div className="ba-before-header">
                                    <h4>Alex Rivera</h4>
                                    <p>Worked at some companies</p>
                                </div>
                                <div className="ba-before-summary">
                                    <span className="ba-before-section-tag">Summary</span>
                                    <p>
                                        I am a software engineer. I have worked with many technologies.
                                        I like coding and building things. Looking for new opportunities
                                        in software development.
                                    </p>
                                </div>
                                <div className="ba-before-experience">
                                    <span className="ba-before-section-tag">Work</span>
                                    <div className="ba-before-entry">
                                        <strong>Tech Corp</strong>
                                        <p>Worked on backend services. Did some coding. Helped the team.</p>
                                    </div>
                                </div>
                                <div className="ba-before-skills">
                                    <span className="ba-before-section-tag">Skills</span>
                                    <p>React, Node, AWS, coding, programming</p>
                                </div>
                            </div>
                        </div>

                        {/* Slider handle */}
                        <div
                            className="ba-handle"
                            style={{ left: `${sliderPos}%` }}
                        >
                            <div className="ba-handle-line" />
                            <div className="ba-handle-knob">
                                <ArrowRight size={14} />
                                <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
                            </div>
                        </div>
                    </div>

                    <p className="ba-hint">⇦ Drag the slider to compare ⇨</p>
                </motion.div>
            </div>
        </section>
    );
};

export default BeforeAfterSlider;
