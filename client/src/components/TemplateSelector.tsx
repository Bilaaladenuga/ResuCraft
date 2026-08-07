'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Code, DollarSign, Heart, Palette, FileText, Scale, BookOpen, ArrowLeft, List, Award, Zap, TrendingUp, BarChart, Wrench, Star, Briefcase, BookOpen as BookIcon } from 'lucide-react';
import ResumeExamplesModal from './ResumeExamplesModal';
import { getAllTemplates } from '../templates';

const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: 'easeOut' as const },
};

interface TemplateCard {
    id: string;
    name: string;
    icon: React.ReactElement;
    description: string;
    color: string;
    bgGradient: string;
    badge: string | null;
    atsTag?: 'premium' | 'optimized' | null;
}

const templates: TemplateCard[] = [
    {
        id: 'tech',
        name: 'Tech / IT',
        icon: <Code size={24} />,
        description: 'Optimized for software engineers, DevOps, data scientists, and IT professionals. Skills-first layout with project highlights.',
        color: '#06b6d4',
        bgGradient: 'linear-gradient(135deg, #0e1628, #0d2f3f)',
        badge: 'Popular',
        atsTag: 'premium'
    },
    {
        id: 'finance',
        name: 'Finance',
        icon: <DollarSign size={24} />,
        description: 'Conservative and professional layout for banking, accounting, and financial services. Experience-focused design.',
        color: '#f59e0b',
        bgGradient: 'linear-gradient(135deg, #1a1507, #2d2000)',
        badge: null,
        atsTag: 'optimized'
    },
    {
        id: 'healthcare',
        name: 'Healthcare',
        icon: <Heart size={24} />,
        description: 'Clean clinical layout for doctors, nurses, and medical professionals. Includes certifications and license sections.',
        color: '#10b981',
        bgGradient: 'linear-gradient(135deg, #071a13, #0a2e1f)',
        badge: null,
        atsTag: 'optimized'
    },
    {
        id: 'creative',
        name: 'Creative / Design',
        icon: <Palette size={24} />,
        description: 'Bold and expressive layout for designers, artists, and creative professionals. Color-rich with portfolio emphasis.',
        color: '#a855f7',
        bgGradient: 'linear-gradient(135deg, #1a0e2e, #250d3d)',
        badge: 'New',
        atsTag: 'premium'
    },
    {
        id: 'general',
        name: 'General',
        icon: <FileText size={24} />,
        description: 'Classic ATS-friendly layout that works for any industry. Balanced sections with a clean, professional look.',
        color: '#64748b',
        bgGradient: 'linear-gradient(135deg, #111827, #1e293b)',
        badge: 'ATS Optimized',
        atsTag: 'premium'
    },
    {
        id: 'legal',
        name: 'Legal / Consulting',
        icon: <Scale size={24} />,
        description: 'Classic law firm layout for attorneys, paralegals, and consultants. Emphasizes education, bar admissions, and client experience.',
        color: '#1e3a5f',
        bgGradient: 'linear-gradient(135deg, #0c1a2e, #1a2d4a)',
        badge: 'New',
        atsTag: 'premium'
    },
    {
        id: 'education',
        name: 'Education',
        icon: <BookOpen size={24} />,
        description: 'Scholarly academic layout for teachers, professors, and researchers. Highlights degrees, teaching experience, and publications.',
        color: '#7d2e2e',
        bgGradient: 'linear-gradient(135deg, #1f0d0d, #3a1a1a)',
        badge: 'New',
        atsTag: 'optimized'
    },
    {
        id: 'minimal',
        name: 'Minimal',
        icon: <List size={24} />,
        description: 'Ultra-clean, whitespace-first layout that works for any industry. Perfect for modern, understated professional brands.',
        color: '#94a3b8',
        bgGradient: 'linear-gradient(135deg, #1e293b, #334155)',
        badge: 'New',
        atsTag: 'premium'
    },
    {
        id: 'executive',
        name: 'Executive',
        icon: <Award size={24} />,
        description: 'Sophisticated serif design for senior leaders, C-suite, and consultants. Timeless typography with refined accents.',
        color: '#d4af37',
        bgGradient: 'linear-gradient(135deg, #1a1507, #2d2000)',
        badge: 'Premium',
        atsTag: 'premium'
    },
    {
        id: 'modern',
        name: 'Modern',
        icon: <Zap size={24} />,
        description: 'Contemporary bold-header layout with a sleek accent bar. A forward-looking choice for fast-growing industries.',
        color: '#22d3ee',
        bgGradient: 'linear-gradient(135deg, #0e1628, #123a4a)',
        badge: 'New',
        atsTag: 'optimized'
    },
    {
        id: 'marketing',
        name: 'Marketing / Sales',
        icon: <TrendingUp size={24} />,
        description: 'Results-first design that puts campaign wins and metrics front and center. Built for marketers, sales, and growth roles.',
        color: '#f97316',
        bgGradient: 'linear-gradient(135deg, #2b1005, #431603)',
        badge: 'Popular',
        atsTag: 'optimized'
    },
    {
        id: 'data',
        name: 'Data & ML',
        icon: <BarChart size={24} />,
        description: 'Analytical layout for data scientists, analysts, and ML engineers. Metric-driven with a technical skills grid.',
        color: '#2dd4bf',
        bgGradient: 'linear-gradient(135deg, #042f2e, #134e4a)',
        badge: 'New',
        atsTag: 'optimized'
    },
    {
        id: 'engineering',
        name: 'Engineering',
        icon: <Wrench size={24} />,
        description: 'Structured technical layout for mechanical, civil, electrical, and manufacturing engineers. Skills-grid focused.',
        color: '#60a5fa',
        bgGradient: 'linear-gradient(135deg, #0f172a, #1d3a8f)',
        badge: 'New',
        atsTag: 'optimized'
    },
    {
        id: 'hospitality',
        name: 'Hospitality / Retail',
        icon: <Star size={24} />,
        description: 'Warm, personable layout for hospitality, retail, and customer-facing roles. Approachable with a friendly profile.',
        color: '#f97316',
        bgGradient: 'linear-gradient(135deg, #2b0f07, #4a1a0a)',
        badge: 'New',
        atsTag: 'optimized'
    },
    {
        id: 'admin',
        name: 'Administrative',
        icon: <Briefcase size={24} />,
        description: 'Clean, organized layout for administrative, HR, and office support roles. Reliable structure with simple clarity.',
        color: '#94a3b8',
        bgGradient: 'linear-gradient(135deg, #111827, #293241)',
        badge: 'ATS Optimized',
        atsTag: 'premium'
    }
];

const TemplateSelector = () => {
    const router = useRouter();
    const [showExamples, setShowExamples] = useState(false);

    const rolesByTemplate = Object.fromEntries(
        getAllTemplates().map(t => [t.id, t.roles || []])
    );

    const handleSelect = (templateId: string) => {
        router.push(`/builder/${templateId}`);
    };

    return (
        <motion.div className="template-selector" {...pageTransition}>
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-inner">
                        <div className="navbar-brand" onClick={() => router.push('/')}>
                            <Sparkles color="var(--secondary)" size={28} />
                            <span className="navbar-brand-text gradient-text">ResuCraft</span>
                        </div>
                        <button className="btn btn-ghost" onClick={() => router.push('/')}>
                            <ArrowLeft size={16} /> Back
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container">
                <motion.div
                    className="template-selector-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="section-label">Choose Your Template</p>
                    <h1 className="gradient-text">Select Your Industry</h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Each template is tailored with industry-specific section ordering, color schemes, and AI prompt optimization.
                    </p>
                </motion.div>

                <motion.div
                    className="examples-banner glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div className="examples-banner-icon">
                        <BookIcon size={22} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Short on time? Start from a sample resume</h3>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Browse 10 professionally written resumes by role — engineer, nurse, lawyer, designer and more — then make it yours.
                        </p>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowExamples(true)} style={{ whiteSpace: 'nowrap' }}>
                        <BookIcon size={14} /> Browse Examples
                    </button>
                </motion.div>

                <div className="template-grid">
                    {templates.map((tmpl, index) => {
                        const cardRoles = rolesByTemplate[tmpl.id] || [];
                        const visibleRoles = cardRoles.slice(0, 6);
                        const extraRoles = cardRoles.length - visibleRoles.length;
                        return (
                            <motion.div
                                key={tmpl.id}
                                className="glass-card template-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                onClick={() => handleSelect(tmpl.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleSelect(tmpl.id);
                                    }
                                }}
                                id={`template-card-${tmpl.id}`}
                            >
                            <div
                                className="template-card-preview"
                                style={{ background: tmpl.bgGradient }}
                            >
                                {/* Landscape mini resume-page mockup */}
                                <div className="template-card-page">
                                    <div className="template-card-page-header" style={{ background: tmpl.color }}>
                                        <div className="template-card-page-icon">
                                            {React.cloneElement(tmpl.icon as React.ReactElement<{ size?: number }>, { size: 16 })}
                                        </div>
                                        <div className="template-card-page-title" />
                                    </div>
                                    <div className="template-card-page-body">
                                        <div className="template-card-page-line template-card-page-line--title" style={{ background: tmpl.color }} />
                                        <div className="template-card-page-line" />
                                        <div className="template-card-page-line template-card-page-line--short" />
                                        <div className="template-card-page-line" />
                                        <div className="template-card-page-line template-card-page-line--short" />
                                    </div>
                                </div>
                                <div className="template-card-flags">
                                    {tmpl.badge && (
                                        <span
                                            className="template-card-badge"
                                            style={{
                                                background: `${tmpl.color}20`,
                                                color: tmpl.color,
                                                border: `1px solid ${tmpl.color}40`
                                            }}
                                        >
                                            {tmpl.badge}
                                        </span>
                                    )}
                                    {tmpl.atsTag && (
                                        <span
                                            className="template-card-ats"
                                            style={{
                                                background: tmpl.atsTag === 'premium'
                                                    ? 'rgba(16, 185, 129, 0.15)'
                                                    : 'rgba(99, 102, 241, 0.12)',
                                                color: tmpl.atsTag === 'premium'
                                                    ? '#10b981'
                                                    : '#818cf8',
                                                border: tmpl.atsTag === 'premium'
                                                    ? '1px solid rgba(16, 185, 129, 0.3)'
                                                    : '1px solid rgba(99, 102, 241, 0.25)'
                                            }}
                                        >
                                            {tmpl.atsTag === 'premium' ? '★ ATS Premium' : 'ATS Ready'}
                                        </span>
                                    )}
                                </div>
                            </div>
                                <div className="template-card-info">
                                    <div className="template-card-info-top">
                                        <h3>{tmpl.name}</h3>
                                        <span className="template-card-arrow" aria-hidden="true">→</span>
                                    </div>
                                    <p>{tmpl.description}</p>
                                    {cardRoles.length > 0 && (
                                        <div className="template-card-roles">
                                            <span className="template-card-roles-label">For:</span>
                                            {visibleRoles.map(role => (
                                                <span key={role} className="template-card-role-tag">{role}</span>
                                            ))}
                                            {extraRoles > 0 && (
                                                <span className="template-card-role-tag template-card-role-tag--more">+{extraRoles} more</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            <ResumeExamplesModal isOpen={showExamples} onClose={() => setShowExamples(false)} />
        </motion.div>
    );
};

export default TemplateSelector;
