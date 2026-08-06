'use client';
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, FileText, Shield, Download, Layout, Type, Columns } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { buildATSChecklist, summarizeATSChecklist, ATSCheckItem, ATSStatus } from '../services/atsScorer';
import { FormData } from '../types';

interface ATSChecklistModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: FormData;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    Structure: <Columns size={16} />,
    Layout: <Layout size={16} />,
    Typography: <Type size={16} />,
    Formatting: <Download size={16} />,
    Content: <FileText size={16} />,
};

const STATUS_ICONS: Record<ATSStatus, React.ReactNode> = {
    pass: <CheckCircle size={16} color="#10b981" />,
    warning: <AlertTriangle size={16} color="#f59e0b" />,
    info: <Info size={16} color="#06b6d4" />,
};

const ATSChecklistModal: React.FC<ATSChecklistModalProps> = ({ isOpen, onClose, formData }) => {
    const dialogRef = useModalAccessibility(isOpen, onClose, 'ATS Compatibility Checklist');

    const items = useMemo(() => buildATSChecklist(formData), [formData]);
    const { score, passCount, total } = useMemo(() => summarizeATSChecklist(items), [items]);

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
                                    Live analysis of your resume — scores update as you edit
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
                                background: score >= 80 ? 'rgba(16, 185, 129, 0.12)' : score >= 60 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                color: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444',
                                border: `2px solid ${score >= 80 ? 'rgba(16, 185, 129, 0.3)' : score >= 60 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                            }}>
                                {score}%
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
                                    {score >= 80 ? 'Great ATS Foundation' : score >= 60 ? 'Getting There' : 'Needs Work'}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {passCount} of {total} checks passed by <strong>your resume</strong>
                                </div>
                            </div>
                        </div>

                        {/* Checklist items */}
                        <div style={{
                            padding: '0.75rem 1.5rem 1.5rem',
                            overflowY: 'auto',
                            flex: 1
                        }}>
                            {items.map((item: ATSCheckItem, idx: number) => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        gap: '0.75rem',
                                        padding: '0.65rem 0',
                                        borderBottom: idx < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    {/* Status icon */}
                                    <div style={{ flexShrink: 0, paddingTop: '2px' }}>
                                        {STATUS_ICONS[item.status]}
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
                                                {CATEGORY_ICONS[item.category]}
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
                            This score updates live as you edit your resume. Export as <strong>DOCX</strong> for maximum ATS compatibility, with PDF as a strong second option.
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ATSChecklistModal;
