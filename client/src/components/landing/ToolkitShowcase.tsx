'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck, TrendingUp, Download, Upload, Globe,
    FileText, BookOpen, Maximize2, Palette, Sparkles,
    Linkedin, Type, CheckCircle
} from 'lucide-react';

interface ToolItem {
    icon: React.ReactNode;
    title: string;
    description: string;
    tag?: string;
    accent: 'gold' | 'cyan' | 'green' | 'purple';
}

const tools: ToolItem[] = [
    {
        icon: <ShieldCheck size={20} />,
        title: 'ATS Checklist',
        description: 'Live 12-point scan that scores your resume against Applicant Tracking Systems as you type.',
        tag: 'Get hired faster',
        accent: 'green',
    },
    {
        icon: <TrendingUp size={20} />,
        title: 'Resume Score',
        description: 'Instant algorithmic score across 7 categories — personal info, summary, experience, skills and more.',
        tag: 'Know your gaps',
        accent: 'gold',
    },
    {
        icon: <Download size={20} />,
        title: 'PDF & DOCX Export',
        description: 'Export a polished, ATS-friendly resume in both formats with one click — ready to submit anywhere.',
        tag: 'Submit anywhere',
        accent: 'cyan',
    },
    {
        icon: <Upload size={20} />,
        title: 'Import Any Resume',
        description: 'Rebuild a resume from a PDF, a LinkedIn profile, or a JSON backup in seconds — zero retyping.',
        tag: 'Bring your own',
        accent: 'purple',
    },
    {
        icon: <Globe size={20} />,
        title: 'Translate',
        description: 'Instantly translate your resume into 25+ languages so you can apply across borders.',
        tag: 'Apply globally',
        accent: 'cyan',
    },
    {
        icon: <FileText size={20} />,
        title: 'Cover Letter Builder',
        description: 'Generate tailored, human-sounding cover letters from any job description — no blank page dread.',
        tag: 'Pair with your resume',
        accent: 'gold',
    },
    {
        icon: <BookOpen size={20} />,
        title: 'Spell & Grammar Check',
        description: 'Catch typos, grammar slips, and weak phrasing before a recruiter ever sees them.',
        tag: 'Polished first draft',
        accent: 'purple',
    },
    {
        icon: <Maximize2 size={20} />,
        title: 'One-Page Checker',
        description: 'Live page-length estimate with a dismissible warning — keep your resume tight, or let it breathe.',
        tag: 'Stay concise',
        accent: 'green',
    },
    {
        icon: <Palette size={20} />,
        title: 'Template Customizer',
        description: 'Personalize colors, fonts, and spacing to match your industry and your personality.',
        tag: 'Make it yours',
        accent: 'gold',
    },
    {
        icon: <Sparkles size={20} />,
        title: 'AI Rewrites',
        description: 'Power-up summaries, bullets, and skills with AI — including a no-key fallback that still helps.',
        tag: 'Write better, faster',
        accent: 'cyan',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const }
    }
};

const ToolkitShowcase: React.FC = () => {
    return (
        <section className="section section-toolkit">
            <div className="container">
                <div className="section-label center">Your complete toolkit</div>
                <motion.h2
                    className="section-title center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Everything you need to land the job — <span className="gradient-text">in one place</span>
                </motion.h2>
                <motion.p
                    className="section-subtitle center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    No extra tools. No subscriptions. Just a complete workflow from first draft to final submission.
                </motion.p>

                <motion.div
                    className="toolkit-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                >
                    {tools.map(tool => (
                        <motion.div
                            key={tool.title}
                            className={`glass-card toolkit-card toolkit-card--${tool.accent}`}
                            variants={itemVariants}
                            whileHover={{ y: -6 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <div className="toolkit-card-top">
                                <div className="toolkit-card-icon">{tool.icon}</div>
                                {tool.tag && <span className="toolkit-card-tag">{tool.tag}</span>}
                            </div>
                            <h3 className="toolkit-card-title">{tool.title}</h3>
                            <p className="toolkit-card-desc">{tool.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom reassurance strip */}
                <motion.div
                    className="toolkit-note"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <span><CheckCircle size={14} /> Free forever</span>
                    <span><CheckCircle size={14} /> No sign-up required</span>
                    <span><CheckCircle size={14} /> 100% local &amp; private</span>
                    <span><Linkedin size={14} /> LinkedIn import built in</span>
                    <span><Type size={14} /> ATS-safe typography</span>
                </motion.div>
            </div>
        </section>
    );
};

export default ToolkitShowcase;
