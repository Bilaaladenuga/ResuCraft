'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, FileText, Shield, Download, Layout, Type, Hash, List, Columns, BookOpen } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface ATSChecklistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ChecklistItem {
    id: string;
    category: string;
    icon: React.ReactElement;
    title: string;
    description: string;
    status: 'pass' | 'warning' | 'info';
    tip: string;
}

const checklistItems: ChecklistItem[] = [
    {
        id: 'standard-headers',
        category: 'Structure',
        icon: <FileText size={16} />,
        title: 'Standard Section Headers',
        description: 'Use traditional headers like "Experience," "Education," "Skills" — not creative alternatives',
        status: 'pass',
        tip: 'ATS parsers look for standard headers. "Work History" is fine, but avoid "Where I\'ve Worked"'
    },
    {
        id: 'single-column',
        category: 'Layout',
        icon: <Layout size={16} />,
        title: 'Single-Column Layout',
        description: 'Avoid multi-column layouts that confuse ATS parsing algorithms',
        status: 'pass',
        tip: 'Multi-column layouts cause ATS to read across columns, jumbling your content. All ResuCraft templates are single-column.'
    },
    {
        id: 'no-tables',
        category: 'Layout',
        icon: <Columns size={16} />,
        title: 'No Tables or Text Boxes',
        description: 'Tables and text boxes can cause ATS to skip or misread content',
        status: 'pass',
        tip: 'ResuCraft templates use clean div-based layouts — no tables, no text boxes.'
    },
    {
        id: 'standard-fonts',
        category: 'Typography',
        icon: <Type size={16} />,
        title: 'Standard Fonts',
        description: 'Use widely-recognized fonts like Arial, Calibri, or Times New Roman',
        status: 'warning',
        tip: 'Stick to Arial, Calibri, Verdana, Georgia, or Times New Roman. Avoid script or decorative fonts.'
    },
    {
        id: 'font-size',
        category: 'Typography',
        icon: <Type size={16} />,
        title: 'Readable Font Size (10-12pt)',
        description: 'Body text should be 10-12pt for optimal ATS readability',
        status: 'warning',
        tip: 'Too small (<10pt) and ATS may not read it. Too large (>12pt) and you waste valuable space.'
    },
    {
        id: 'no-headers-footers',
        category: 'Formatting',
        icon: <BookOpen size={16} />,
        title: 'No Headers or Footers',
        description: 'ATS often ignores content placed in document headers and footers',
        status: 'pass',
        tip: 'Put your name and contact info in the main body, not the header/footer. ResuCraft does this automatically.'
    },
    {
        id: 'file-format',
        category: 'Formatting',
        icon: <Download size={16} />,
        title: 'Use .docx Format',
        description: 'DOCX is the most ATS-compatible format. PDF is second-best but can vary.',
        status: 'warning',
        tip: 'DOCX is preferred by 90%+ of ATS systems. ResuCraft offers both DOCX and PDF export.'
    },
    {
        id: 'keyword-density',
        category: 'Content',
        icon: <Hash size={16} />,
        title: 'Keyword Optimization',
        description: 'Include relevant keywords from job descriptions in your skills and experience',
        status: 'info',
        tip: 'Use the ATS Health Check in the AI Panel to match keywords from any job description.'
    },
    {
        id: 'bullet-points',
        category: 'Content',
        icon: <List size={16} />,
        title: 'Use Bullet Points, Not Paragraphs',
        description: 'ATS-friendly resumes use bullet points for easier parsing and scoring',
        status: 'pass',
        tip: 'Bullet points are easier for ATS to parse and score. Keep each bullet to 1-2 lines.'
    },
    {
        id: 'quantified-achievements',
        category: 'Content',
        icon: <AlertTriangle size={16} />,
        title: 'Quantified Achievements',
        description: 'Include numbers, percentages, and metrics to strengthen your content',
        status: 'info',
        tip: 'ATS algorithms rank resumes with quantified results higher. Use the Bullet Power-Up tool to add metrics.'
    },
    {
        id: 'contact-info',
        category: 'Structure',
        icon: <Info size={16} />,
        title: 'Clear Contact Information',
        description: 'Name, phone, email, and LinkedIn should be at the very top of the resume',
        status: 'pass',
        tip: 'ATS needs to clearly identify your contact details. ResuCraft places these prominently at the top.'
    },
    {
        id: 'skills-section',
        category: 'Content',
        icon: <Shield size={16} />,
        title: 'Dedicated Skills Section',
        description: 'Include a comma-separated skills section for optimal keyword matching',
        status: 'info',
        tip: 'A dedicated skills section helps ATS quickly identify your technical and professional competencies.'
    }
];

const ATSChecklistModal: React.FC<ATSChecklistModalProps> = ({ isOpen, onClose }) => {
    const dialogRef = useModalAccessibility(isOpen, onClose, 'ATS Compatibility Checklist');
    const passCount = checklistItems.filter(i => i.status === 'pass').length;
    const totalCount = checklistItems.length;
    const score = Math.round((passCount / totalCount) * 100);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        ref={dialogRef}
                        className="modal-content glass-card"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onClick={e => e.stopPropagation()}
                        style={{
                            maxWidth: '700px',
                            width: '95%',
                            maxHeight: '85vh',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            padding: '1.25rem 1.5rem 0.75rem',
                            borderBottom: '1px solid var(--border)'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Shield size={20} color="var(--secondary)" />
                                    <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text)' }}>ATS Compatibility Checklist</h2>
                                </div>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem', margin: '0.3rem 0 0' }}>
                                    Ensure your resume passes Applicant Tracking Systems with these best practices
                                </p>
                            </div>
                            <button className="btn-icon" onClick={onClose} style={{ flexShrink: 0 }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Score summary */}
                        <div style={{
                            padding: '1rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'rgba(255,255,255,0.02)',
                            borderBottom: '1px solid var(--border)'
                        }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1rem', fontWeight: 800,
                                background: score >= 80 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                color: score >= 80 ? '#10b981' : '#f59e0b',
                                border: `2px solid ${score >= 80 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                            }}>
                                {score}%
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
                                    {score >= 80 ? 'Great ATS Foundation' : 'Room for Improvement'}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {passCount} of {totalCount} best practices met by ResuCraft templates
                                </div>
                            </div>
                        </div>

                        {/* Checklist items */}
                        <div style={{
                            padding: '0.75rem 1.5rem 1.5rem',
                            overflowY: 'auto',
                            flex: 1
                        }}>
                            {checklistItems.map((item, idx) => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        gap: '0.75rem',
                                        padding: '0.65rem 0',
                                        borderBottom: idx < checklistItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    {/* Status icon */}
                                    <div style={{ flexShrink: 0, paddingTop: '2px' }}>
                                        {item.status === 'pass' ? (
                                            <CheckCircle size={16} color="#10b981" />
                                        ) : item.status === 'warning' ? (
                                            <AlertTriangle size={16} color="#f59e0b" />
                                        ) : (
                                            <Info size={16} color="#06b6d4" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            flexWrap: 'wrap',
                                            marginBottom: '0.15rem'
                                        }}>
                                            {/* Category tag */}
                                            <span style={{
                                                fontSize: '0.55rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                padding: '1px 5px',
                                                borderRadius: '3px',
                                                background: 'rgba(255,255,255,0.05)',
                                                color: 'var(--text-dim)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '3px'
                                            }}>
                                                {item.category}
                                            </span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>
                                                {item.title}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.1rem 0 0.2rem', lineHeight: 1.4 }}>
                                            {item.description}
                                        </p>
                                        <p style={{
                                            fontSize: '0.68rem',
                                            color: item.status === 'pass' ? 'rgba(16, 185, 129, 0.8)' : 'var(--text-dim)',
                                            margin: 0,
                                            lineHeight: 1.3,
                                            fontStyle: 'italic'
                                        }}>
                                            💡 {item.tip}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '0.75rem 1.5rem',
                            borderTop: '1px solid var(--border)',
                            textAlign: 'center',
                            fontSize: '0.72rem',
                            color: 'var(--text-dim)'
                        }}>
                            ResuCraft templates are designed to pass ATS scans. Use the <strong>ATS Health Check</strong> in the AI Panel to test against specific job descriptions.
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ATSChecklistModal;
