'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Sparkles, ArrowRight, FileText } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { getResumeExamples, ResumeExample } from '../data/resumeExamples';
import { getTemplate } from '../templates';
import { createResumeWithData, setActiveResumeId } from '../services/storage';
import { trackEvent } from '../services/track';

// A4 at 96dpi
const PAGE_W = 794;
const PAGE_H = 1123;

interface ResumeExamplesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExamplePreview: React.FC<{ example: ResumeExample }> = ({ example }) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.3);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const update = () => setScale((el.clientWidth || PAGE_W) / PAGE_W);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const Template = getTemplate(example.templateId).component;

    return (
        <div
            ref={wrapRef}
            className="examples-preview-wrap"
            style={{ height: PAGE_H * scale }}
        >
            <div
                aria-hidden="true"
                style={{
                    width: PAGE_W,
                    height: PAGE_H,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    overflow: 'hidden',
                    borderRadius: 6,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                }}
            >
                <Template data={example.formData} roleId={example.roleId} />
            </div>
        </div>
    );
};

const ResumeExamplesModal: React.FC<ResumeExamplesModalProps> = ({ isOpen, onClose }) => {
    const dialogRef = useModalAccessibility(isOpen, onClose, 'Resume Examples Library');
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [error, setError] = useState('');

    const examples = useMemo(() => getResumeExamples(), []);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        examples.forEach(e => e.tags.forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [examples]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return examples.filter(e => {
            const matchesQuery =
                !q ||
                e.title.toLowerCase().includes(q) ||
                e.role.toLowerCase().includes(q) ||
                e.description.toLowerCase().includes(q) ||
                e.tags.some(t => t.toLowerCase().includes(q));
            const matchesTag = !activeTag || e.tags.includes(activeTag);
            return matchesQuery && matchesTag;
        });
    }, [examples, query, activeTag]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setActiveTag(null);
            setError('');
        }
    }, [isOpen]);

    const handleUse = (example: ResumeExample) => {
        try {
            const resume = createResumeWithData(example.title, example.templateId, example.formData);
            trackEvent('resume_example');
            setActiveResumeId(resume.meta.id);
            onClose();
            router.push(`/builder/${example.templateId}?resume=${resume.meta.id}`);
        } catch {
            setError('Could not create the resume. Storage may be full.');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    <motion.div
                        ref={dialogRef}
                        className="modal glass-card"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            maxWidth: '860px',
                            width: '92%',
                            maxHeight: '88vh',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 0,
                            overflow: 'hidden'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1.25rem 1.75rem',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Sparkles size={20} color="var(--secondary)" />
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Resume Examples</h2>
                                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                                        Start from a professionally written sample — fully editable
                                    </p>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={onClose}>
                                <X size={16} />
                            </button>
                        </div>

                        {/* Search + tag filter */}
                        <div style={{
                            padding: '0.85rem 1.75rem',
                            borderBottom: '1px solid var(--border)',
                            flexShrink: 0
                        }}>
                            <div style={{ position: 'relative', marginBottom: '0.6rem' }}>
                                <Search size={14} style={{
                                    position: 'absolute', left: '10px', top: '50%',
                                    transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none'
                                }} />
                                <input
                                    type="text"
                                    placeholder="Search by role, industry, or skill…"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.75rem 0.5rem 2rem',
                                        background: 'var(--bg)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--text)',
                                        fontSize: '0.8rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <button
                                    className={`examples-tag ${activeTag === null ? 'active' : ''}`}
                                    onClick={() => setActiveTag(null)}
                                >
                                    All
                                </button>
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        className={`examples-tag ${activeTag === tag ? 'active' : ''}`}
                                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grid */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '1.25rem 1.75rem'
                        }}>
                            {error && (
                                <div style={{
                                    marginBottom: '0.75rem', fontSize: '0.78rem',
                                    color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                    <FileText size={13} /> {error}
                                </div>
                            )}
                            {filtered.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--text-dim)' }}>
                                    <p>No examples match your search.</p>
                                </div>
                            ) : (
                                <div className="examples-grid">
                                    {filtered.map(example => (
                                        <motion.div
                                            key={example.id}
                                            className="glass-card examples-card"
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ExamplePreview example={example} />
                                            <div className="examples-card-info">
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{example.title}</h3>
                                                    <span style={{
                                                        fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                                                        letterSpacing: '0.05em', color: 'var(--secondary)',
                                                        background: 'rgba(245,158,11,0.1)', padding: '0.15rem 0.45rem',
                                                        borderRadius: '100px', whiteSpace: 'nowrap'
                                                    }}>
                                                        {example.role}
                                                    </span>
                                                </div>
                                                <p style={{
                                                    margin: '0.4rem 0 0.5rem', fontSize: '0.72rem',
                                                    color: 'var(--text-muted)', lineHeight: 1.5,
                                                    display: '-webkit-box', WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                                }}>
                                                    {example.description}
                                                </p>
                                                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                                                    {example.tags.map(tag => (
                                                        <span key={tag} className="examples-tag static">{tag}</span>
                                                    ))}
                                                </div>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleUse(example)}
                                                    style={{ width: '100%' }}
                                                >
                                                    Use This Example <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '0.65rem 1.75rem',
                            borderTop: '1px solid var(--border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexShrink: 0,
                            fontSize: '0.7rem',
                            color: 'var(--text-dim)'
                        }}>
                            <span>{filtered.length} of {examples.length} examples</span>
                            <span>Sample content is yours to edit and replace</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ResumeExamplesModal;
