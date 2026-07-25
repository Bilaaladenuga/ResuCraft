'use client';
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, HelpCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
};

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={16} />,
    error: <AlertCircle size={16} />,
    warning: <AlertTriangle size={16} />,
    info: <HelpCircle size={16} />,
};

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; color: string }> = {
    success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', color: 'var(--success)' },
    error: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', color: 'var(--danger)' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', color: 'var(--secondary)' },
    info: { bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.3)', color: 'var(--accent)' },
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const counterRef = useRef(0);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3500) => {
        const id = `toast-${++counterRef.current}`;
        setToasts(prev => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    }, [removeToast]);

    const toast = useCallback((message: string, type?: ToastType, duration?: number) => addToast(message, type, duration), [addToast]);
    const success = useCallback((message: string, duration?: number) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message: string, duration?: number) => addToast(message, 'error', duration), [addToast]);
    const warning = useCallback((message: string, duration?: number) => addToast(message, 'warning', duration), [addToast]);
    const info = useCallback((message: string, duration?: number) => addToast(message, 'info', duration), [addToast]);

    return (
        <ToastContext.Provider value={{ toast, success, error, warning, info }}>
            {children}
            {/* Toast container */}
            <div style={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 99999,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                maxWidth: '400px',
                pointerEvents: 'none',
            }}>
                <AnimatePresence>
                    {toasts.map(t => {
                        const colors = TOAST_COLORS[t.type];
                        return (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(17, 24, 39, 0.95)',
                                    backdropFilter: 'blur(12px)',
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                    pointerEvents: 'auto',
                                    minWidth: '280px',
                                }}
                            >
                                <span style={{ color: colors.color, flexShrink: 0, display: 'flex' }}>
                                    {TOAST_ICONS[t.type]}
                                </span>
                                <span style={{
                                    flex: 1,
                                    fontSize: '0.8rem',
                                    color: 'var(--text)',
                                    lineHeight: 1.4,
                                    fontWeight: 500,
                                }}>
                                    {t.message}
                                </span>
                                <button
                                    onClick={() => removeToast(t.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-dim)',
                                        cursor: 'pointer',
                                        padding: '2px',
                                        display: 'flex',
                                        flexShrink: 0,
                                        borderRadius: '4px',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'}
                                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)'}
                                >
                                    <X size={14} />
                                </button>
                                {/* Progress bar */}
                                <motion.div
                                    initial={{ width: '100%' }}
                                    animate={{ width: '0%' }}
                                    transition={{ duration: t.duration! / 1000, ease: 'linear' }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        height: '2px',
                                        background: colors.color,
                                        borderRadius: '0 0 0 4px',
                                        opacity: 0.4,
                                    }}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
