'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart, RotateCcw, FileText, Download, Shield, Sparkles, Clock, Target } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface ActivityEntry {
    event: string;
    ts: number;
}

interface StatsData {
    resumes_created: number;
    exports: number;
    ats_checks: number;
    ai_generations: number;
    activity: ActivityEntry[];
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
    resume_created: <FileText size={13} />,
    pdf_export: <Download size={13} />,
    docx_export: <Download size={13} />,
    ats_check: <Shield size={13} />,
    resume_score: <Shield size={13} />,
    keyword_match: <Target size={13} />,
    cover_letter: <FileText size={13} />,
    cover_letter_export: <Download size={13} />,
    ai_generation: <Sparkles size={13} />,
};

const EVENT_LABELS: Record<string, string> = {
    resume_created: 'Resume created',
    pdf_export: 'PDF exported',
    docx_export: 'DOCX exported',
    ats_check: 'ATS checklist run',
    resume_score: 'Resume score run',
    keyword_match: 'Keyword match run',
    cover_letter: 'Cover letter generated',
    cover_letter_export: 'Cover letter exported',
    ai_generation: 'AI rewrite used',
};

const relativeTime = (ts: number): string => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(ts).toLocaleDateString();
};

const StatsPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const dialogRef = useModalAccessibility(isOpen, onClose, 'ResuCraft Usage Stats');
    const [data, setData] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/stats');
            if (!res.ok) throw new Error('Failed to load stats');
            setData(await res.json());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) load();
    }, [isOpen, load]);

    const summaryCards = data
        ? [
              { label: 'Resumes Crafted', value: data.resumes_created, icon: <FileText size={16} /> },
              { label: 'Exports', value: data.exports, icon: <Download size={16} /> },
              { label: 'ATS Checks', value: data.ats_checks, icon: <Shield size={16} /> },
              { label: 'AI Rewrites', value: data.ai_generations, icon: <Sparkles size={16} /> },
          ]
        : [];

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
                            maxWidth: '640px',
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
                            alignItems: 'center',
                            padding: '1.25rem 1.5rem 0.75rem',
                            borderBottom: '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BarChart size={20} color="var(--secondary)" />
                                <div>
                                    <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text)' }}>
                                        Usage Stats
                                    </h2>
                                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                                        Owner view — anonymous activity across the site
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading} title="Refresh">
                                    <RotateCcw size={15} className={loading ? 'spinner-icon' : ''} />
                                </button>
                                <button className="btn-icon" onClick={onClose}>
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                padding: '0.75rem 1.5rem',
                                fontSize: '0.8rem',
                                color: 'var(--danger)'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Summary cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                            gap: '0.6rem',
                            padding: '1rem 1.5rem'
                        }}>
                            {summaryCards.map(card => (
                                <div key={card.label} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '0.75rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ color: 'var(--secondary)', display: 'flex', justifyContent: 'center', marginBottom: '0.3rem' }}>
                                        {card.icon}
                                    </div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>
                                        {card.value.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        {card.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent activity */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '0 1.5rem 1.25rem'
                        }}>
                            <div style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                color: 'var(--text-dim)',
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}>
                                <Clock size={12} /> Recent activity
                            </div>

                            {!data ? (
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', padding: '1.5rem 0' }}>
                                    {loading ? 'Loading…' : 'No data yet'}
                                </div>
                            ) : data.activity.length === 0 ? (
                                <div style={{
                                    background: 'rgba(245, 158, 11, 0.06)',
                                    border: '1px solid rgba(245, 158, 11, 0.15)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '1rem',
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.6
                                }}>
                                    No activity recorded yet. Tracking goes live once{' '}
                                    <strong>UPSTASH_REDIS_REST_URL</strong> and{' '}
                                    <strong>UPSTASH_REDIS_REST_TOKEN</strong> are set on Vercel — until then the
                                    landing page shows seed numbers and no events are stored.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {data.activity.map((entry, i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '0.45rem 0.6rem',
                                            background: 'rgba(255,255,255,0.02)',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.75rem'
                                        }}>
                                            <span style={{ color: 'var(--secondary)', display: 'flex' }}>
                                                {EVENT_ICONS[entry.event] || <Sparkles size={13} />}
                                            </span>
                                            <span style={{ flex: 1, color: 'var(--text)', fontWeight: 500 }}>
                                                {EVENT_LABELS[entry.event] || entry.event}
                                            </span>
                                            <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
                                                {relativeTime(entry.ts)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StatsPanel;
