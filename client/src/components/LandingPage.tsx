'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Sparkles, Zap, FileText, ArrowRight, Layout, Cpu,
    CheckCircle, Search, BarChart, ShieldCheck, Globe,
    ChevronRight, Award, Files, Sun, Moon
} from 'lucide-react';
import ResumeManager from './ResumeManager';
import { useTheme } from './ThemeContext';

const LandingPage = () => {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [showResumeManager, setShowResumeManager] = useState(false);

    const heroHighlights = [
        { icon: Award, label: 'ATS-ready structure' },
        { icon: Sparkles, label: 'AI-powered rewrites' },
        { icon: ShieldCheck, label: 'Privacy-first workflow' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" as const }
        }
    };

    return (
        <motion.div
            className="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="landing-bg" />

            {/* Navbar */}
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-inner">
                        <div className="navbar-brand">
                            <Sparkles color="var(--secondary)" size={28} />
                            <span className="navbar-brand-text gradient-text">ResuCraft</span>
                        </div>
                        <div className="navbar-actions">
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={toggleTheme}
                                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                                style={{
                                    padding: '0.35rem',
                                    color: 'var(--text-muted)',
                                    borderRadius: 'var(--radius-sm)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--secondary)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                            >
                                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <div className="landing-hero">
                <div className="hero-shell">
                    <motion.div
                        className="hero-copy"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="landing-badge">
                            <Cpu size={14} />
                            AI-Powered Career Strategist
                        </div>

                        <h1 className="landing-title">
                            Only <span className="gradient-text-gold">2%</span> of resumes make it past the first round.
                            <br />
                            <span className="gradient-text-cyan">Be in the top 2%</span>
                        </h1>

                        <p className="landing-subtitle">
                            Standard resumes get lost in the noise. ResuCraft gives you a sharper,
                            recruiter-ready story with ATS structure, human-friendly language,
                            and AI-powered guidance built in.
                        </p>

                        <div className="landing-actions">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => router.push('/templates')}
                                id="cta-create-resume"
                            >
                                Create My Resume <ArrowRight size={20} />
                            </button>
                            <button
                                className="btn btn-secondary btn-lg"
                                onClick={() => setShowResumeManager(true)}
                            >
                                <Files size={18} /> My Resumes
                            </button>
                        </div>

                        <div className="hero-trust-row">
                            {heroHighlights.map(({ icon: Icon, label }) => (
                                <div className="hero-trust-pill" key={label}>
                                    <Icon size={16} />
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual-card"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        <div className="hero-visual-glow" />
                        <div className="hero-visual-top">
                            <span className="hero-pill">Live preview</span>
                            <span className="hero-pill hero-pill--accent">One-click export</span>
                        </div>
                        <div className="hero-visual-stack">
                            <div className="hero-preview-card hero-preview-card--main">
                                <div className="hero-preview-toolbar">
                                    <div className="hero-preview-dots">
                                        <span className="hero-preview-dot" />
                                        <span className="hero-preview-dot" />
                                        <span className="hero-preview-dot" />
                                    </div>
                                    <span className="hero-preview-pill">Resume preview</span>
                                </div>
                                <div className="hero-preview-content">
                                    <div className="hero-preview-header">
                                        <div>
                                            <h4>Alicia Chen</h4>
                                            <p>Senior Product Designer · AI SaaS</p>
                                        </div>
                                        <span className="hero-preview-badge">ATS Ready</span>
                                    </div>
                                    <div className="hero-preview-section">
                                        <p className="hero-preview-label">Summary</p>
                                        <div className="hero-preview-line" />
                                        <div className="hero-preview-line hero-preview-line--short" />
                                    </div>
                                    <div className="hero-preview-section">
                                        <p className="hero-preview-label">Experience</p>
                                        <div className="hero-preview-line" />
                                        <div className="hero-preview-line hero-preview-line--short" />
                                        <div className="hero-preview-line" />
                                    </div>
                                    <div className="hero-preview-chips">
                                        <span className="hero-preview-chip">UX Strategy</span>
                                        <span className="hero-preview-chip">Product Design</span>
                                        <span className="hero-preview-chip">Figma</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hero-preview-card hero-preview-card--side">
                                <p className="hero-preview-label">Best-fit template</p>
                                <div className="hero-template-surface">
                                    <div className="hero-template-bar" />
                                    <div className="hero-template-row" />
                                    <div className="hero-template-row hero-template-row--short" />
                                    <div className="hero-template-row" />
                                </div>
                                <div className="hero-preview-chips">
                                    <span className="hero-preview-chip">Tech</span>
                                    <span className="hero-preview-chip">Creative</span>
                                </div>
                            </div>
                        </div>
                        <div className="hero-visual-footer">
                            <div className="hero-stat">
                                <strong>92%</strong>
                                <span>ATS fit</span>
                            </div>
                            <div className="hero-stat">
                                <strong>5</strong>
                                <span>templates</span>
                            </div>
                            <div className="hero-stat">
                                <strong>24/7</strong>
                                <span>AI guidance</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Core Features Grid */}
                <motion.div
                    className="landing-features"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div className="glass-card feature-card" variants={itemVariants}>
                        <div className="feature-card-icon gold">
                            <Zap size={24} />
                        </div>
                        <h3>AI Powered</h3>
                        <p>Gemini AI integration crafts compelling professional narratives that pass ATS scans and highlight your strengths.</p>
                    </motion.div>

                    <motion.div className="glass-card feature-card" variants={itemVariants}>
                        <div className="feature-card-icon cyan">
                            <Layout size={24} />
                        </div>
                        <h3>Industry Templates</h3>
                        <p>Choose from 5 professionally designed templates tailored for IT, Finance, Healthcare, Creative, and General roles.</p>
                    </motion.div>

                    <motion.div className="glass-card feature-card" variants={itemVariants}>
                        <div className="feature-card-icon green">
                            <FileText size={24} />
                        </div>
                        <h3>Instant Export</h3>
                        <p>Live preview updates in real-time. Export your polished resume to PDF with a single click, ready to send.</p>
                    </motion.div>
                </motion.div>
            </div>

            {/* How It Works Section */}
            <section className="section bg-alt">
                <div className="container">
                    <div className="section-label">How it works</div>
                    <motion.h2
                        className="section-title center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        A guided path from draft to recruiter-ready resume
                    </motion.h2>
                    <motion.p
                        className="section-subtitle center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Three simple steps to your most powerful resume yet.
                    </motion.p>

                    <motion.div
                        className="steps-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.div className="step-card" variants={itemVariants}>
                            <div className="step-num">01</div>
                            <div className="step-icon">
                                <Layout />
                            </div>
                            <h3>Select Template</h3>
                            <p>Choose a template specifically designed for your industry (Tech, Finance, etc.)</p>
                        </motion.div>

                        <motion.div className="step-card" variants={itemVariants}>
                            <div className="step-num">02</div>
                            <div className="step-icon">
                                <Sparkles />
                            </div>
                            <h3>AI Power-Up</h3>
                            <p>Fill in your details and use AI to generate summaries and power-up your experience.</p>
                        </motion.div>

                        <motion.div className="step-card" variants={itemVariants}>
                            <div className="step-num">03</div>
                            <div className="step-icon">
                                <FileText />
                            </div>
                            <h3>Export PDF</h3>
                            <p>Download your professionally formatted, ATS-friendly resume instantly.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* AI Deep Dive Section */}
            <section className="section">
                <div className="container">
                    <div className="section-label">Why it stands out</div>
                    <motion.h2
                        className="section-title center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        AI-Powered Advantage
                    </motion.h2>
                    <motion.p
                        className="section-subtitle center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Stop guessing what recruiters want. Let our AI tell you.
                    </motion.p>

                    <motion.div
                        className="features-grid-large"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.div className="glass-card ai-feature" variants={itemVariants}>
                            <div className="ai-feature-icon"><Zap /></div>
                            <h4>AI Summary Generator</h4>
                            <p>Instantly create a powerful professional summary that captures your career essence.</p>
                        </motion.div>
                        <motion.div className="glass-card ai-feature" variants={itemVariants}>
                            <div className="ai-feature-icon"><Search /></div>
                            <h4>Resume Tailor</h4>
                            <p>Paste a job description and watch the AI rewrite your summary to match perfectly.</p>
                        </motion.div>
                        <motion.div className="glass-card ai-feature" variants={itemVariants}>
                            <div className="ai-feature-icon"><BarChart /></div>
                            <h4>Bullet Power-Up</h4>
                            <p>Transform boring tasks into data-driven achievements that wow hiring managers.</p>
                        </motion.div>
                        <motion.div className="glass-card ai-feature" variants={itemVariants}>
                            <div className="ai-feature-icon"><Sparkles /></div>
                            <h4>Skills Enhancer</h4>
                            <p>Discover hidden skills you did not know you had and present them professionally.</p>
                        </motion.div>
                        <motion.div className="glass-card ai-feature" variants={itemVariants}>
                            <div className="ai-feature-icon"><ShieldCheck /></div>
                            <h4>ATS Validator</h4>
                            <p>Ensures your resume structure is readable by automated screening systems.</p>
                        </motion.div>
                        <motion.div className="glass-card ai-feature" variants={itemVariants}>
                            <div className="ai-feature-icon"><Globe /></div>
                            <h4>Industry Tuning</h4>
                            <p>AI models specifically tuned for Tech, Finance, Healthcare, and Creative fields.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Value Prop Section */}
            <section className="section section-value bg-alt">
                <div className="container">
                    <div className="text-center max-w-800 mx-auto">
                        <h2 className="section-title">Use the best resume maker as your guide!</h2>
                        <p className="section-text text-xl">
                            Getting that dream job can seem like an impossible task. We are here to change that.
                            Give yourself a real advantage with the best online resume maker:
                            <strong> created by experts, improved by data, trusted by millions</strong> of professionals.
                        </p>
                        <ul className="value-list-grid">
                            <li><CheckCircle size={18} color="var(--secondary)" /> <span>Recruiter-tested templates</span></li>
                            <li><CheckCircle size={18} color="var(--secondary)" /> <span>AI-driven power words</span></li>
                            <li><CheckCircle size={18} color="var(--secondary)" /> <span>ATS-optimized structures</span></li>
                            <li><CheckCircle size={18} color="var(--secondary)" /> <span>100% Data Privacy</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Authentic Showcase Section */}
            <section className="section section-showcase">
                <div className="container text-center">
                    <h2 className="section-title center">Authentic Experience. Real Results.</h2>
                    <p className="section-subtitle center">Take a look at the powerful interface helping professionals worldwide.</p>

                    <div className="showcase-grid showcase-grid--triple">
                        <motion.div
                            className="showcase-item"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <img src="/assets/ai-panel-screenshot.png" alt="AI-Powered Resume Tools" className="showcase-img" loading="lazy" />
                            <div className="showcase-caption">AI-Powered Resume Tools</div>
                        </motion.div>
                        <motion.div
                            className="showcase-item"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 }}
                        >
                            <img src="/assets/templates-screenshot.png" alt="Career-Focused Templates" className="showcase-img" loading="lazy" />
                            <div className="showcase-caption">Career-Focused Templates</div>
                        </motion.div>
                        <motion.div
                            className="showcase-item"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <img src="/assets/coverletter-screenshot.png" alt="Cover Letter" className="showcase-img" loading="lazy" />
                            <div className="showcase-caption">Cover Letter</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles color="var(--secondary)" size={20} />
                                <span className="gradient-text">ResuCraft</span>
                            </h4>
                            <p>AI-powered career strategist that helps you craft recruiter-ready resumes in minutes.</p>
                        </div>
                        <div className="footer-links">
                            <div>
                                <h5>Product</h5>
                                <ul>
                                    <li onClick={() => router.push('/templates')}>Templates</li>
                                    <li onClick={() => setShowResumeManager(true)}>My Resumes</li>
                                    <li onClick={() => document.getElementById('cta-create-resume')?.click()}>Get Started</li>
                                </ul>
                            </div>
                            <div>
                                <h5>Company</h5>
                                <ul>
                                    <li>Privacy</li>
                                    <li>Terms</li>
                                    <li>Contact</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <p className="footer-copyright">&copy; 2026 ResuCraft. Built by Bilaal — All Rights Reserved.</p>
                </div>
            </footer>
            {/* Resume Manager Modal */}
            <ResumeManager
                isOpen={showResumeManager}
                onClose={() => setShowResumeManager(false)}
            />
        </motion.div>
    );
};

export default LandingPage;
