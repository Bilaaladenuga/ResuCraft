'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ShortcutRow {
    keys: string[];
    action: string;
    hint?: string;
}

const GROUPS: { title: string; rows: ShortcutRow[] }[] = [
    {
        title: 'Editing',
        rows: [
            { keys: ['Ctrl', 'Z'], action: 'Undo last change' },
            { keys: ['Ctrl', 'Shift', 'Z'], action: 'Redo change', hint: 'or Ctrl + Y' },
        ],
    },
    {
        title: 'File',
        rows: [
            { keys: ['Ctrl', 'S'], action: 'Save resume' },
            { keys: ['Ctrl', 'P'], action: 'Print / Save as PDF' },
            { keys: ['Ctrl', 'E'], action: 'Open export menu (Files tab)' },
        ],
    },
    {
        title: 'Help & Navigation',
        rows: [
            { keys: ['Ctrl', '/'], action: 'Show this help', hint: 'or press ?' },
            { keys: ['Esc'], action: 'Close menus & confirmations' },
        ],
    },
];

const kbdStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '22px',
    padding: '2px 6px',
    borderRadius: '5px',
    border: '1px solid var(--glass-border)',
    borderBottomWidth: '2px',
    background: 'rgba(255,255,255,0.04)',
    fontSize: '0.68rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    lineHeight: 1.4,
};

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
    const dialogRef = useModalAccessibility(isOpen, onClose, 'Keyboard Shortcuts');

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
                        className="modal-card"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Keyboard shortcuts"
                        onClick={e => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            maxWidth: '460px',
                            width: '100%',
                            padding: 0,
                            overflow: 'hidden',
                            background: 'var(--primary-light)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            maxHeight: '85vh'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem 1.25rem',
                            borderBottom: '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.02)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Zap size={18} color="var(--accent)" />
                                <div>
                                    <h2 style={{ fontSize: '0.95rem', margin: 0 }}>Keyboard Shortcuts</h2>
                                    <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', margin: '2px 0 0' }}>
                                        Speed up your workflow
                                    </p>
                                </div>
                            </div>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={onClose}
                                style={{ padding: '0.35rem' }}
                                title="Close (Esc)"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Shortcut list */}
                        <div style={{ padding: '0.75rem 1.25rem 1.25rem', overflowY: 'auto', maxHeight: '60vh' }}>
                            {GROUPS.map(group => (
                                <div key={group.title} style={{ marginBottom: '1rem' }}>
                                    <div style={{
                                        fontSize: '0.62rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.8px',
                                        color: 'var(--text-dim)',
                                        marginBottom: '0.4rem'
                                    }}>
                                        {group.title}
                                    </div>
                                    {group.rows.map(row => (
                                        <div
                                            key={row.action}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '12px',
                                                padding: '0.42rem 0.15rem',
                                                borderBottom: '1px solid rgba(255,255,255,0.04)'
                                            }}
                                        >
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>
                                                {row.action}
                                                {row.hint && (
                                                    <span style={{ fontSize: '0.66rem', color: 'var(--text-dim)', marginLeft: '6px' }}>
                                                        {row.hint}
                                                    </span>
                                                )}
                                            </span>
                                            <span style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                                {row.keys.map(k => (
                                                    <span key={k} style={kbdStyle}>{k}</span>
                                                ))}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}

                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.6rem 0.75rem',
                                background: 'rgba(34, 211, 238, 0.06)',
                                border: '1px solid rgba(34, 211, 238, 0.15)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                lineHeight: 1.5
                            }}>
                                💡 Tip: undo/redo works everywhere, including inside text fields. Typing in an input
                                always keeps native editing shortcuts working — we never override those.
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default KeyboardShortcutsModal;
