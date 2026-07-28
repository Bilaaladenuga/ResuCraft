'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, ArrowRight, AlertTriangle, Sparkles, FileText, CheckCircle } from 'lucide-react';
import { useToast } from './ToastContext';

type FeedbackCategory = 'bug' | 'feature' | 'general';

const CATEGORIES: { value: FeedbackCategory; label: string; icon: React.ReactNode }[] = [
    { value: 'bug', label: 'Bug Report', icon: <AlertTriangle size={14} /> },
    { value: 'feature', label: 'Feature Request', icon: <Sparkles size={14} /> },
    { value: 'general', label: 'General Feedback', icon: <FileText size={14} /> },
];

const STORAGE_KEY = 'resucraft_feedback';

interface FeedbackEntry {
    id: string;
    category: FeedbackCategory;
    message: string;
    email: string;
    timestamp: number;
}

const FeedbackButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState<FeedbackCategory>('general');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { success, error } = useToast();

    const handleSubmit = () => {
        if (!message.trim()) {
            error('Please write a message before submitting.');
            return;
        }

        const entry: FeedbackEntry = {
            id: `fb-${Date.now()}`,
            category,
            message: message.trim(),
            email: email.trim(),
            timestamp: Date.now(),
        };

        try {
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            existing.push(entry);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
            setSubmitted(true);
            success('Thank you! Your feedback has been saved.');
            setTimeout(() => {
                setIsOpen(false);
                setSubmitted(false);
                setMessage('');
                setEmail('');
                setCategory('general');
            }, 1500);
        } catch {
            error('Could not save feedback. Please try again.');
        }
    };

    return (
        <>
            {/* FAB */}
            <motion.button
                className="feedback-fab"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Send feedback"
                style={{
                    position: 'fixed',
                    bottom: '1.5rem',
                    right: '1.5rem',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--secondary), #d97706)',
                    color: '#000',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px var(--secondary-glow)',
                    zIndex: 9998,
                    transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 30px var(--secondary-glow)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px var(--secondary-glow)')}
            >
                {isOpen ? <X size={20} /> : <HelpCircle size={20} />}
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="feedback-modal"
                        initial={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            bottom: 'calc(1.5rem + 56px)',
                            right: '1.5rem',
                            width: '360px',
                            maxWidth: 'calc(100vw - 2rem)',
                            background: 'rgba(17, 24, 39, 0.96)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.25rem',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                            zIndex: 9997,
                        }}
                    >
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                                <CheckCircle size={40} color="var(--success)" style={{ marginBottom: '0.75rem' }} />
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Feedback Sent!</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thanks for helping improve ResuCraft.</p>
                            </div>
                        ) : (
                            <>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '1rem',
                                }}>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                                        <HelpCircle size={16} style={{ marginRight: '8px', color: 'var(--secondary)', verticalAlign: 'middle' }} />
                                        Send Feedback
                                    </h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--text-dim)',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            transition: 'all 0.15s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Category selector */}
                                <div style={{
                                    display: 'flex',
                                    gap: '6px',
                                    marginBottom: '1rem',
                                    flexWrap: 'wrap',
                                }}>
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.value}
                                            onClick={() => setCategory(cat.value)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                padding: '0.4rem 0.65rem',
                                                borderRadius: '999px',
                                                border: `1px solid ${category === cat.value ? 'var(--secondary)' : 'var(--glass-border)'}`,
                                                background: category === cat.value ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                                                color: category === cat.value ? 'var(--secondary)' : 'var(--text-muted)',
                                                fontSize: '0.72rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                fontFamily: 'var(--font-body)',
                                            }}
                                        >
                                            {cat.icon}
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Message */}
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '0.35rem',
                                    }}>
                                        Your Message *
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder={category === 'bug' ? 'Describe the bug you encountered...' : category === 'feature' ? 'What feature would you like to see?' : 'Share your thoughts...'}
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '0.65rem 0.75rem',
                                            color: 'var(--text)',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '0.8rem',
                                            resize: 'vertical',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                            lineHeight: 1.5,
                                        }}
                                        onFocus={e => e.target.style.borderColor = 'var(--secondary)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                                    />
                                </div>

                                {/* Email (optional) */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '0.35rem',
                                    }}>
                                        Email <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--text-dim)' }}>(optional)</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="So I can follow up..."
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '0.55rem 0.75rem',
                                            color: 'var(--text)',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '0.8rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                        }}
                                        onFocus={e => e.target.style.borderColor = 'var(--secondary)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={!message.trim()}
                                    className="btn btn-primary btn-sm"
                                    style={{
                                        width: '100%',
                                        fontSize: '0.75rem',
                                        padding: '0.6rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    <ArrowRight size={14} />
                                    Send Feedback
                                </button>

                                <p style={{
                                    fontSize: '0.6rem',
                                    color: 'var(--text-dim)',
                                    textAlign: 'center',
                                    marginTop: '0.5rem',
                                }}>
                                    Your feedback stays on your device until you export it.
                                </p>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FeedbackButton;
