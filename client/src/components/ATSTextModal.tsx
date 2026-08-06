'use client';
import React, { useState, useMemo } from 'react';
import { X, Copy, FileText, Download, Check } from 'lucide-react';
import { FormData } from '../types';
import { formDataToPlainText, copyPlainText, downloadPlainText } from '../services/plainText';
import { useToast } from './ToastContext';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface ATSTextModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: FormData;
}

const ATSTextModal: React.FC<ATSTextModalProps> = ({ isOpen, onClose, formData }) => {
    const dialogRef = useModalAccessibility(isOpen, onClose, 'Copy as Plain Text');
    const [copied, setCopied] = useState(false);
    const { success, error } = useToast();

    const plainText = useMemo(() => formDataToPlainText(formData), [formData]);

    if (!isOpen) return null;

    const handleCopy = async () => {
        const ok = await copyPlainText(formData);
        if (ok) {
            setCopied(true);
            success('Resume text copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } else {
            error('Could not copy. Please select the text manually.');
        }
    };

    const handleDownload = () => {
        downloadPlainText(formData);
        success('Downloaded as .txt');
    };

    const lineCount = plainText.split('\n').filter(l => l.trim()).length;
    const charCount = plainText.length;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                ref={dialogRef}
                className="glass-card"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '680px', width: '100%', padding: '1.75rem' }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--success)'
                        }}>
                            <FileText size={22} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.1rem' }}>
                                Copy as Plain Text
                            </h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
                                ATS-friendly format — paste into any job portal
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-icon-sm" style={{ color: 'var(--text-dim)' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Info strip */}
                <div style={{
                    display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap',
                    fontSize: '0.72rem', color: 'var(--text-muted)'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={12} /> {lineCount} lines
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Copy size={12} /> {charCount.toLocaleString()} characters
                    </span>
                </div>

                {/* Plain text preview */}
                <textarea
                    readOnly
                    value={plainText}
                    spellCheck={false}
                    style={{
                        width: '100%',
                        minHeight: '320px',
                        maxHeight: '50vh',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1rem',
                        color: 'var(--text)',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        lineHeight: 1.6,
                        resize: 'vertical',
                        outline: 'none',
                        whiteSpace: 'pre'
                    }}
                />

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleCopy}
                        style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                    <button
                        className="btn btn-accent btn-sm"
                        onClick={handleDownload}
                        style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                        <Download size={14} />
                        Download .txt
                    </button>
                </div>

                <p style={{
                    fontSize: '0.65rem', color: 'var(--text-dim)',
                    textAlign: 'center', marginTop: '0.75rem'
                }}>
                    No tables, columns, or fancy formatting — exactly what ATS systems can read.
                </p>
            </div>
        </div>
    );
};

export default ATSTextModal;
