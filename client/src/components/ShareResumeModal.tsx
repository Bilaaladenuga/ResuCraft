'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
    X, Share2, Link2, Copy, Check, Download, ExternalLink, Loader2,
    AlertCircle, Sparkles, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { useToast } from './ToastContext';
import { FormData, TemplateCustomization } from '../types';
import {
    encodeSharePayload,
    buildShareUrl,
    SHARE_TTL_DAYS,
} from '../services/shareService';

interface ShareResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: FormData;
    templateId: string;
    customization?: TemplateCustomization;
}

type BuildStatus = 'building' | 'ready' | 'error';

const ShareResumeModal: React.FC<ShareResumeModalProps> = ({
    isOpen,
    onClose,
    formData,
    templateId,
    customization,
}) => {
    const dialogRef = useModalAccessibility(isOpen, onClose, 'Share resume');
    const toastCtx = useToast();
    const qrRef = useRef<HTMLCanvasElement>(null);

    const [status, setStatus] = useState<BuildStatus>('building');
    const [url, setUrl] = useState('');
    const [mode, setMode] = useState<'short' | 'hash'>('short');
    const [copied, setCopied] = useState(false);
    const [downloadable, setDownloadable] = useState(false);

    const build = useCallback(async () => {
        if (!isOpen) return;
        setStatus('building');
        try {
            const payload = await encodeSharePayload(formData, templateId, customization);

            // Prefer a short server-side link (QR-friendly)
            try {
                const res = await fetch('/api/share', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ payload }),
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data?.ok && data?.code) {
                        setUrl(buildShareUrl('', data.code));
                        setMode('short');
                        setStatus('ready');
                        return;
                    }
                }
            } catch {
                // fall through to hash link
            }

            // Fallback: hash-embedded link (no backend needed)
            setUrl(buildShareUrl(payload));
            setMode('hash');
            setStatus('ready');
        } catch (err) {
            console.error('Share build failed:', err);
            setStatus('error');
        }
    }, [isOpen, formData, templateId, customization]);

    useEffect(() => {
        if (isOpen) {
            setCopied(false);
            setDownloadable(false);
            build();
        }
    }, [isOpen, build]);

    const handleCopy = useCallback(async () => {
        if (!url) return;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toastCtx.success('Share link copied');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toastCtx.error('Could not copy link');
        }
    }, [url, toastCtx]);

    const handleDownloadQR = useCallback(() => {
        const canvas = qrRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `resume-qr-${templateId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setDownloadable(true);
        toastCtx.success('QR code downloaded');
    }, [templateId, toastCtx]);

    const handleNativeShare = useCallback(async () => {
        if (!url) return;
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({ title: 'My Resume', url });
                return;
            } catch {
                // user cancelled or failed — fall back to copy
            }
        }
        await handleCopy();
    }, [url, handleCopy]);

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
                        style={{
                            maxWidth: '460px',
                            width: '100%',
                            padding: 0,
                            background: 'var(--primary-light)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.02)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: 'rgba(245, 158, 11, 0.12)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--secondary)'
                                }}>
                                    <Share2 size={20} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1rem', margin: 0 }}>Share Resume</h2>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: '2px 0 0' }}>
                                        Send a live, read-only version to anyone — no account needed
                                    </p>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '0.35rem' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {status === 'building' && (
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    justifyContent: 'center', gap: '0.75rem', padding: '2.5rem 1rem', color: 'var(--text-dim)'
                                }}>
                                    <Loader2 size={26} className="bullet-spin" style={{ color: 'var(--secondary)' }} />
                                    <p style={{ fontSize: '0.82rem', margin: 0 }}>Preparing your share link…</p>
                                </div>
                            )}

                            {status === 'error' && (
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    justifyContent: 'center', gap: '0.75rem', padding: '2rem 1rem', textAlign: 'center'
                                }}>
                                    <AlertCircle size={30} style={{ color: 'var(--danger)' }} />
                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                                        Could not create a share link. Please try again.
                                    </p>
                                </div>
                            )}

                            {status === 'ready' && url && (
                                <>
                                    {/* QR code */}
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{
                                            background: '#ffffff',
                                            borderRadius: 'var(--radius-md)',
                                            padding: '0.85rem',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
                                        }}>
                                            <QRCodeCanvas
                                                ref={qrRef}
                                                value={url}
                                                size={190}
                                                level="M"
                                                bgColor="#ffffff"
                                                fgColor="#0b1220"
                                                includeMargin={false}
                                            />
                                        </div>
                                    </div>
                                    <p style={{
                                        fontSize: '0.7rem', color: 'var(--text-dim)', textAlign: 'center', margin: '-0.25rem 0 0'
                                    }}>
                                        Scan to open the resume on any phone
                                    </p>

                                    {/* Link row */}
                                    <div style={{
                                        display: 'flex', gap: '6px',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '0.3rem 0.3rem 0.3rem 0.7rem',
                                        alignItems: 'center',
                                        background: 'rgba(255,255,255,0.02)'
                                    }}>
                                        <Link2 size={13} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                                        <input
                                            readOnly
                                            value={url}
                                            onFocus={(e) => e.target.select()}
                                            style={{
                                                flex: 1, minWidth: 0, background: 'transparent', border: 'none',
                                                color: 'var(--text)', fontSize: '0.72rem', outline: 'none',
                                                fontFamily: 'var(--font-body)'
                                            }}
                                        />
                                        <button className="btn btn-primary btn-sm" onClick={handleCopy} style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                                            {copied ? <Check size={13} /> : <Copy size={13} />}
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleNativeShare} style={{ fontSize: '0.72rem' }}>
                                            <Smartphone size={13} /> Share…
                                        </button>
                                        <button className="btn btn-ghost btn-sm" onClick={handleDownloadQR} style={{ fontSize: '0.72rem' }}>
                                            {downloadable ? <Check size={13} /> : <Download size={13} />}
                                            {downloadable ? 'Saved' : 'Download QR'}
                                        </button>
                                        <a
                                            className="btn btn-ghost btn-sm"
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ fontSize: '0.72rem', textDecoration: 'none' }}
                                        >
                                            <ExternalLink size={13} /> Open preview
                                        </a>
                                    </div>

                                    {/* Privacy note */}
                                    <div style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '7px',
                                        fontSize: '0.68rem', color: 'var(--text-dim)', lineHeight: 1.6,
                                        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.75rem'
                                    }}>
                                        <Sparkles size={12} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                                        <span>
                                            {mode === 'short'
                                                ? <>Your resume is stored securely for {SHARE_TTL_DAYS} days via a short link. Viewers see a read-only copy — they can't edit it.</>
                                                : <>Your resume is embedded directly in the link — nothing is uploaded to a server. Viewers see a read-only copy.</>}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShareResumeModal;
