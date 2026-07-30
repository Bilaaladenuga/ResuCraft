'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Trash2, AlertTriangle, Sparkles, FileText, CheckCircle, HelpCircle, Clock } from 'lucide-react';

type FeedbackCategory = 'bug' | 'feature' | 'general';

interface FeedbackEntry {
    id: string;
    category: FeedbackCategory;
    message: string;
    email: string;
    timestamp: number;
    sent?: boolean;
}

const CATEGORY_META: Record<FeedbackCategory, { label: string; icon: React.ReactNode; color: string }> = {
    bug: {
        label: 'Bug Report',
        icon: <AlertTriangle size={11} />,
        color: '#ef4444',
    },
    feature: {
        label: 'Feature Request',
        icon: <Sparkles size={11} />,
        color: '#f59e0b',
    },
    general: {
        label: 'General Feedback',
        icon: <FileText size={11} />,
        color: '#3b82f6',
    },
};

const STORAGE_KEY = 'resucraft_feedback';

interface FeedbackInboxProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeedbackInbox = ({ isOpen, onClose }: FeedbackInboxProps) => {
    const [entries, setEntries] = useState<FeedbackEntry[]>([]);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Load entries from localStorage whenever modal opens
    useEffect(() => {
        if (isOpen) {
            loadEntries();
        }
    }, [isOpen]);

    const loadEntries = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const data = stored ? JSON.parse(stored) : [];
            setEntries(data.sort((a: FeedbackEntry, b: FeedbackEntry) => b.timestamp - a.timestamp));
        } catch {
            setEntries([]);
        }
    };

    const exportAll = () => {
        try {
            const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resucraft-feedback-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch { /* ignore */ }
    };

    const clearAll = () => {
        try {
            localStorage.setItem(STORAGE_KEY, '[]');
            setEntries([]);
            setShowClearConfirm(false);
        } catch { /* ignore */ }
    };

    const formatDate = (ts: number) => {
        const d = new Date(ts);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays === 1) {
            return `Yesterday at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        }
        return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-container"
                        style={{ maxWidth: '620px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <HelpCircle size={18} color="var(--secondary)" />
                                <h2 className="modal-title" style={{ margin: 0, fontSize: '1rem' }}>
                                    Feedback Inbox
                                </h2>
                                {entries.length > 0 && (
                                    <span style={{
                                        fontSize: '0.65rem',
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '999px',
                                        background: 'rgba(245, 158, 11, 0.15)',
                                        color: 'var(--secondary)',
                                        fontWeight: 600,
                                    }}>
                                        {entries.length}
                                    </span>
                                )}
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '0.3rem' }}>
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1rem' }}>
                            {entries.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '3rem 1rem',
                                    color: 'var(--text-dim)',
                                }}>
                                    <FileText size={40} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>No feedback yet</p>
                                    <p style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>
                                        Feedback from users will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {entries.map((entry, index) => {
                                        const meta = CATEGORY_META[entry.category] || CATEGORY_META.general;
                                        return (
                                            <motion.div
                                                key={entry.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                style={{
                                                    background: 'rgba(255,255,255,0.02)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    padding: '0.65rem 0.75rem',
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                                            >
                                                {/* Entry header */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    marginBottom: '0.35rem',
                                                }}>
                                                    {/* Category badge */}
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '3px',
                                                        padding: '0.12rem 0.45rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.6rem',
                                                        fontWeight: 600,
                                                        background: `${meta.color}15`,
                                                        color: meta.color,
                                                    }}>
                                                        {meta.icon}
                                                        {meta.label}
                                                    </span>

                                                    {/* Timestamp */}
                                                    <span style={{
                                                        fontSize: '0.6rem',
                                                        color: 'var(--text-dim)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '3px',
                                                        marginLeft: 'auto',
                                                    }}>
                                                        <Clock size={9} />
                                                        {formatDate(entry.timestamp)}
                                                    </span>

                                                    {/* Delivery status */}
                                                    {entry.sent === true && (
                                                        <CheckCircle size={11} color="var(--success)" aria-label="Delivered" />
                                                    )}
                                                </div>

                                                {/* Message */}
                                                <p style={{
                                                    fontSize: '0.78rem',
                                                    lineHeight: 1.5,
                                                    color: 'var(--text)',
                                                    margin: 0,
                                                    wordBreak: 'break-word',
                                                }}>
                                                    {entry.message}
                                                </p>

                                                {/* Email (if provided) */}
                                                {entry.email && (
                                                    <div style={{
                                                        fontSize: '0.6rem',
                                                        color: 'var(--text-dim)',
                                                        marginTop: '0.3rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                    }}>
                                                        <FileText size={9} />
                                                        {entry.email}
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {entries.length > 0 && (
                            <div className="modal-footer" style={{
                                display: 'flex',
                                gap: '6px',
                                justifyContent: 'flex-end',
                                padding: '0.65rem 1rem',
                                borderTop: '1px solid var(--glass-border)',
                            }}>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={exportAll}
                                    style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                                >
                                    <Download size={12} />
                                    Export All
                                </button>

                                {showClearConfirm ? (
                                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Are you sure?</span>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={clearAll}
                                            style={{ fontSize: '0.7rem', color: 'var(--danger)' }}
                                        >
                                            Yes, Clear
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => setShowClearConfirm(false)}
                                            style={{ fontSize: '0.7rem' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => setShowClearConfirm(true)}
                                        style={{ fontSize: '0.7rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <Trash2 size={12} />
                                        Clear All
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FeedbackInbox;
