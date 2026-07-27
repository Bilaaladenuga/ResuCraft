'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ComparisonRow {
    aspect: string;
    traditional: string;
    resucraft: string;
    highlight?: boolean;
}

const ROWS: ComparisonRow[] = [
    {
        aspect: 'Formatting',
        traditional: 'Spend hours wrestling with Word margins and fonts',
        resucraft: 'Real-time preview with 7 professionally designed templates',
        highlight: true,
    },
    {
        aspect: 'ATS Screening',
        traditional: 'Often rejected by screening software without human review',
        resucraft: 'Built for ATS with optimized structure and keyword strategy',
        highlight: true,
    },
    {
        aspect: 'Content Quality',
        traditional: 'Generic job descriptions that blend in with hundreds of others',
        resucraft: 'AI-powered bullet points with data-driven achievements',
    },
    {
        aspect: 'Skills',
        traditional: 'A messy comma-separated list hidden at the bottom',
        resucraft: 'Organized skill badges and intelligent keyword suggestions',
    },
    {
        aspect: 'Cover Letter',
        traditional: 'Write from scratch for every single application',
        resucraft: 'AI-generated cover letters tailored to each job description',
    },
    {
        aspect: 'Export Options',
        traditional: 'Print to PDF and hope formatting doesn\'t break',
        resucraft: 'One-click PDF and DOCX export that preserves your layout',
    },
    {
        aspect: 'Privacy',
        traditional: 'Upload your data to unknown third-party servers',
        resucraft: '100% local in your browser — you control your data',
        highlight: true,
    },
];

const ComparisonTable: React.FC = () => {
    const router = useRouter();

    return (
        <section className="section section-comparison">
            <div className="container">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="section-label">Why switch?</div>
                    <h2 className="section-title center">Traditional Resume vs. ResuCraft</h2>
                    <p className="section-subtitle center">
                        See how ResuCraft transforms every aspect of your resume.
                    </p>
                </motion.div>

                <motion.div
                    className="comparison-table-wrapper"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: 0.15 }}
                >
                    {/* Column headers */}
                    <div className="comparison-header">
                        <div className="comparison-header-col comparison-header-col--spacer"></div>
                        <div className="comparison-header-col comparison-header-col--traditional">
                            <X size={18} />
                            <span>Traditional Resume</span>
                        </div>
                        <div className="comparison-header-col comparison-header-col--resucraft">
                            <Sparkles size={18} />
                            <span>ResuCraft</span>
                        </div>
                    </div>

                    {/* Rows */}
                    {ROWS.map((row, i) => (
                        <motion.div
                            key={row.aspect}
                            className={`comparison-row ${row.highlight ? 'highlight' : ''}`}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                        >
                            <div className="comparison-aspect">{row.aspect}</div>
                            <div className="comparison-cell comparison-cell--traditional">
                                <X size={14} className="comparison-icon comparison-icon--bad" />
                                <span>{row.traditional}</span>
                            </div>
                            <div className="comparison-cell comparison-cell--resucraft">
                                <Check size={14} className="comparison-icon comparison-icon--good" />
                                <span>{row.resucraft}</span>
                            </div>
                        </motion.div>
                    ))}

                    {/* CTA */}
                    <motion.div
                        className="comparison-cta"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => router.push('/templates')}
                        >
                            Create Your ResuCraft Resume <ArrowRight size={20} />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ComparisonTable;
