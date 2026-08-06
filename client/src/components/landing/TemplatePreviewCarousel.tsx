'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TemplatePreview {
    id: string;
    name: string;
    industry: string;
    accent: string;
    description: string;
    highlight: string;
    features: string[];
}

const TEMPLATES: TemplatePreview[] = [
    {
        id: 'tech',
        name: 'Tech / IT',
        industry: 'technology',
        accent: '#06b6d4',
        description: 'Modern, clean layout with skill badges and project-first structure.',
        highlight: 'Skill badges · Project emphasis · Clean typography',
        features: ['Technical Skills Grid', 'Project Portfolio', 'Achievement Tracking', 'ATS Optimized']
    },
    {
        id: 'finance',
        name: 'Finance',
        industry: 'finance',
        accent: '#10b981',
        description: 'Professional, data-driven design with competency-focused sections.',
        highlight: 'Competency focus · Data presentation · Formal styling',
        features: ['Core Competencies', 'Experience Timeline', 'Certifications', 'Clean Contact Bar']
    },
    {
        id: 'healthcare',
        name: 'Healthcare',
        industry: 'healthcare',
        accent: '#3b82f6',
        description: 'Sidebar layout with certifications and clinical experience emphasis.',
        highlight: 'Sidebar layout · Certifications · Clinical focus',
        features: ['Sidebar Profile', 'Certifications Section', 'Clinical Experience', 'Contact Card']
    },
    {
        id: 'creative',
        name: 'Creative / Design',
        industry: 'creative design',
        accent: '#a855f7',
        description: 'Bold gradient header with portfolio grid and visual timeline.',
        highlight: 'Gradient design · Portfolio grid · Visual timeline',
        features: ['Portfolio Grid', 'Visual Timeline', 'Skill Tags', 'Award Highlights']
    },
    {
        id: 'general',
        name: 'General',
        industry: 'general',
        accent: '#f59e0b',
        description: 'Balanced, universal layout suitable for any industry or role.',
        highlight: 'Universal design · Balanced sections · Simple structure',
        features: ['Professional Summary', 'Work History', 'Education', 'Skills & Projects']
    },
    {
        id: 'legal',
        name: 'Legal / Consulting',
        industry: 'legal',
        accent: '#8b5cf6',
        description: 'Classic, authoritative design with bar admissions and publications.',
        highlight: 'Classic styling · Bar admissions · Publications',
        features: ['Bar Admissions Section', 'Case Publications', 'Areas of Expertise', 'Education First']
    },
    {
        id: 'education',
        name: 'Education',
        industry: 'education',
        accent: '#e11d48',
        description: 'Academic-focused layout with publications, grants, and research.',
        highlight: 'Academic focus · Grants & research · Publications',
        features: ['Publications Section', 'Grants & Awards', 'Teaching Experience', 'Research Areas']
    }
];

const MiniPreview: React.FC<{ template: TemplatePreview }> = ({ template }) => {
    const { accent, name } = template;

    return (
        <div className="carousel-preview" style={{ '--preview-accent': accent } as React.CSSProperties}>
            {/* Mini mockup header */}
            <div className="carousel-preview-header">
                <div className="carousel-preview-avatar" />
                <div>
                    <div className="carousel-preview-name">{name.split('/')[0]}</div>
                    <div className="carousel-preview-title">Professional</div>
                </div>
                <div className="carousel-preview-badge" style={{ borderColor: accent, color: accent }}>
                    ATS ✓
                </div>
            </div>

            {/* Mini mockup body */}
            <div className="carousel-preview-body">
                <div className="carousel-preview-label">Summary</div>
                <div className="carousel-preview-line" />
                <div className="carousel-preview-line carousel-preview-line--short" />

                <div className="carousel-preview-spacer" />

                <div className="carousel-preview-label">Experience</div>
                <div className="carousel-preview-line" />
                <div className="carousel-preview-line carousel-preview-line--medium" />
                <div className="carousel-preview-line" />
            </div>

            {/* Mini skill chips */}
            <div className="carousel-preview-chips">
                <span style={{ background: `${accent}18`, color: accent, borderColor: `${accent}30` }}>Skill</span>
                <span style={{ background: `${accent}18`, color: accent, borderColor: `${accent}30` }}>Expertise</span>
            </div>
        </div>
    );
};

const TemplatePreviewCarousel: React.FC = () => {
    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const t = TEMPLATES[current];

    const goTo = (index: number) => {
        setDirection(index > current ? 1 : -1);
        setCurrent(index);
    };

    const goNext = () => {
        setDirection(1);
        setCurrent(prev => (prev + 1) % TEMPLATES.length);
    };

    const goPrev = () => {
        setDirection(-1);
        setCurrent(prev => (prev - 1 + TEMPLATES.length) % TEMPLATES.length);
    };

    return (
        <section className="section section-carousel" id="templates">
            <div className="container">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="section-label">Pick your style</div>
                    <h2 className="section-title center">Browse Industry Templates</h2>
                    <p className="section-subtitle center">
                        7 professionally designed templates — each tailored for a specific industry.
                    </p>
                </motion.div>

                <motion.div
                    className="carousel-wrapper"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="carousel-layout">
                        {/* Left: Mini preview */}
                        <div className="carousel-visual">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={current}
                                    custom={direction}
                                    initial={{ opacity: 0, x: direction * 60 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: direction * -60 }}
                                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                                >
                                    <MiniPreview template={t} />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right: Details */}
                        <div className="carousel-details">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div
                                        className="carousel-accent-line"
                                        style={{ background: t.accent }}
                                    />
                                    <h3 className="carousel-name">{t.name}</h3>
                                    <p className="carousel-industry" style={{ color: t.accent }}>
                                        {t.industry}
                                    </p>
                                    <p className="carousel-description">{t.description}</p>

                                    <div className="carousel-highlight">
                                        <span className="carousel-highlight-label">Key features:</span>
                                        <span>{t.highlight}</span>
                                    </div>

                                    <ul className="carousel-features">
                                        {t.features.map((f, i) => (
                                            <li key={i}>
                                                <CheckCircle size={14} color={t.accent} />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => router.push(`/builder/${t.id}`)}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        Use This Template <ArrowRight size={16} />
                                    </button>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="carousel-nav">
                                <button className="carousel-nav-btn" onClick={goPrev} aria-label="Previous template">
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="carousel-dots">
                                    {TEMPLATES.map((_, i) => (
                                        <button
                                            key={i}
                                            className={`carousel-dot ${i === current ? 'active' : ''}`}
                                            onClick={() => goTo(i)}
                                            aria-label={`Go to template ${i + 1}`}
                                            style={i === current ? { background: t.accent } : {}}
                                        />
                                    ))}
                                </div>
                                <button className="carousel-nav-btn" onClick={goNext} aria-label="Next template">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TemplatePreviewCarousel;
