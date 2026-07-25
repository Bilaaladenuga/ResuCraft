'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Sparkles, FileText, Copy, Check, Trash2,
    Save, Download, ChevronDown, ChevronUp, Clock,
    Plus, BookOpen, AlertCircle
} from 'lucide-react';
import CoverLetterTemplate from './CoverLetterTemplate';
import { useToast } from './ToastContext';
import { FormData, WritingStyle, WRITING_STYLES, SavedCoverLetter } from '../types';
import { getSavedStyle, saveStyle } from '../services/prompts';
import {
    generateCoverLetter,
    generateFallbackCoverLetter,
    checkApiKey,
    getProviderConfig
} from '../services/ai';
import {
    getCoverLetterIndex,
    getCoverLetterById,
    saveCoverLetter,
    deleteCoverLetter,
    createCoverLetter
} from '../services/storage';

interface CoverLetterBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    formData: FormData;
    industry: string;
    onOpenSettings: () => void;
}

const CoverLetterBuilder: React.FC<CoverLetterBuilderProps> = ({
    isOpen,
    onClose,
    formData,
    industry,
    onOpenSettings
}) => {
    const toastCtx = useToast();
    const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ').trim() || 'Applicant';

    // Form state
    const [recipientName, setRecipientName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [position, setPosition] = useState(formData.designation || '');
    const [jobDescription, setJobDescription] = useState('');
    const [writingStyle, setWritingStyle] = useState<WritingStyle>(getSavedStyle());
    const [clContent, setClContent] = useState('');
    const [clTitle, setClTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Saved cover letters
    const [savedLetters, setSavedLetters] = useState<SavedCoverLetter[]>([]);
    const [showSaved, setShowSaved] = useState(false);
    const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const hasApiKey = checkApiKey();
    const providerConfig = getProviderConfig();

    // Load saved cover letters
    useEffect(() => {
        if (isOpen) {
            setSavedLetters(getCoverLetterIndex());
        }
    }, [isOpen]);

    // Reset form when opening
    useEffect(() => {
        if (isOpen) {
            setPosition(formData.designation || '');
            setError('');
        }
    }, [isOpen, formData.designation]);

    const getAIErrorMessage = (err: unknown): string => {
        const msg = (err as Error)?.message || '';
        if (msg.includes('429') || msg.toLowerCase().includes('quota')) {
            return `${providerConfig.label} quota reached. Using fallback.`;
        }
        if (msg.toLowerCase().includes('api key') || msg.includes('403') || msg.includes('401')) {
            return 'API key issue. Check settings. Using fallback.';
        }
        return 'AI generation failed. Using fallback.';
    };

    const handleGenerate = async () => {
        if (!jobDescription.trim()) {
            toastCtx.warning('Please paste a job description first');
            return;
        }

        setError('');
        setLoading(true);

        // Build context from formData
        const experience = (formData.experiences || [])
            .map(e => `${e.title} at ${e.company}`)
            .join(', ');
        const skills = formData.skillsRaw || '';

        try {
            let result: string;
            if (hasApiKey) {
                result = await generateCoverLetter({
                    name: fullName,
                    role: position || formData.designation || '',
                    experience,
                    skills,
                    jobDescription,
                    industry
                }, writingStyle);
            } else {
                result = generateFallbackCoverLetter({
                    name: fullName,
                    role: position || formData.designation || '',
                    experience,
                    skills,
                    jobDescription,
                    industry
                }, writingStyle);
            }
            setClContent(result);

            // Auto-generate a title
            const companyStr = companyName || 'Position';
            const roleStr = position || formData.designation || 'Role';
            setClTitle(`Cover Letter - ${companyStr} - ${roleStr}`);

            toastCtx.success('Cover letter generated!');
        } catch (err) {
            handleAIError('Cover letter generation', err);
            setClContent(generateFallbackCoverLetter({
                name: fullName,
                role: position || formData.designation || '',
                experience,
                skills,
                jobDescription,
                industry
            }, writingStyle));
        } finally {
            setLoading(false);
        }
    };

    const handleAIError = (label: string, err: unknown) => {
        console.error(`${label} failed:`, err);
        setError(getAIErrorMessage(err));
    };

    const handleSave = () => {
        if (!clContent.trim()) {
            toastCtx.warning('Generate a cover letter before saving');
            return;
        }

        const title = clTitle.trim() || `Cover Letter - ${companyName || 'Company'} - ${position || 'Role'}`;

        if (selectedLetterId) {
            // Update existing
            const existing = getCoverLetterById(selectedLetterId);
            if (existing) {
                saveCoverLetter({
                    ...existing,
                    name: title,
                    recipientName,
                    companyName,
                    position,
                    jobDescription,
                    content: clContent,
                    updatedAt: new Date().toISOString()
                });
                toastCtx.success('Cover letter updated!');
            }
        } else {
            // Create new
            createCoverLetter(title, recipientName, companyName, position, jobDescription, clContent);
            toastCtx.success('Cover letter saved!');
        }

        setSavedLetters(getCoverLetterIndex());
    };

    const handleLoad = (id: string) => {
        const cl = getCoverLetterById(id);
        if (!cl) return;
        setSelectedLetterId(cl.id);
        setRecipientName(cl.recipientName || '');
        setCompanyName(cl.companyName || '');
        setPosition(cl.position || '');
        setJobDescription(cl.jobDescription || '');
        setClContent(cl.content || '');
        setClTitle(cl.name || '');
        setShowSaved(false);
        toastCtx.info('Cover letter loaded');
    };

    const handleDelete = (id: string) => {
        deleteCoverLetter(id);
        setSavedLetters(getCoverLetterIndex());
        if (selectedLetterId === id) {
            setSelectedLetterId(null);
            setClContent('');
            setClTitle('');
        }
        toastCtx.success('Cover letter deleted');
    };

    const handleNew = () => {
        setSelectedLetterId(null);
        setRecipientName('');
        setClContent('');
        setClTitle('');
        setError('');
    };

    const handleCopy = async () => {
        if (!clContent) return;
        try {
            await navigator.clipboard.writeText(clContent);
            setCopied(true);
            toastCtx.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toastCtx.error('Failed to copy');
        }
    };

    const handleExportPDF = () => {
        if (!clContent) return;
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toastCtx.error('Please allow popups for PDF export');
            return;
        }

        const styledContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Cover Letter - ${companyName || 'Company'}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body {
                        font-family: 'Inter', Georgia, serif;
                        color: #1a1a1a;
                        padding: 2.5rem 2.8rem;
                        max-width: 794px;
                        margin: 0 auto;
                        line-height: 1.6;
                    }
                    .cl-header {
                        text-align: center;
                        padding-bottom: 1.25rem;
                        margin-bottom: 1.5rem;
                        border-bottom: 2px solid #e5e7eb;
                    }
                    .cl-name { font-size: 1.5rem; font-weight: 700; color: #111827; }
                    .cl-role { font-size: 0.85rem; color: #6b7280; margin-top: 4px; }
                    .cl-body p {
                        margin-bottom: 0.85em;
                        font-size: 0.92rem;
                        color: #374151;
                        line-height: 1.7;
                    }
                    .cl-signature {
                        margin-top: 2rem;
                        padding-top: 1rem;
                        border-top: 2px solid #e5e7eb;
                    }
                    .cl-signature .name { font-weight: 600; color: #111827; }
                    .cl-signature .role { font-size: 0.8rem; color: #6b7280; margin-top: 2px; }
                    @media print {
                        body { padding: 0; }
                        .cl-header { border-bottom-color: #000; }
                        .cl-signature { border-top-color: #000; }
                    }
                </style>
            </head>
            <body>
                <div class="cl-header">
                    <div class="cl-name">${fullName}</div>
                    <div class="cl-role">${position || formData.designation || ''}</div>
                </div>
                <div class="cl-body">
                    ${clContent.split('\n').filter(l => l.trim()).map(l => `<p>${l.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('')}
                </div>
                <div class="cl-signature">
                    <div class="name">${fullName}</div>
                    ${(position || formData.designation) ? `<div class="role">${position || formData.designation}</div>` : ''}
                </div>
                <script>
                    window.onload = function() { window.print(); window.close(); }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(styledContent);
        printWindow.document.close();
    };

    const hasContent = clContent.trim().length > 0;
    const canGenerate = jobDescription.trim().length > 0;

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
                        className="modal-card"
                        style={{
                            maxWidth: '900px',
                            width: '100%',
                            padding: 0,
                            background: 'var(--primary-light)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        onClick={e => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.02)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FileText size={20} color="var(--accent)" />
                                <div>
                                    <h2 style={{ fontSize: '1rem', margin: 0 }}>Cover Letter Builder</h2>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: '2px 0 0' }}>
                                        AI-powered cover letters tailored to your resume
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => setShowSaved(!showSaved)}
                                    title="Saved cover letters"
                                    style={{ padding: '0.35rem' }}
                                >
                                    <BookOpen size={16} />
                                </button>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={onClose}
                                    style={{ padding: '0.35rem' }}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            flex: 1,
                            overflow: 'hidden'
                        }}>
                            {/* Left: Form */}
                            <div style={{
                                width: '45%',
                                padding: '1.25rem 1.5rem',
                                overflowY: 'auto',
                                borderRight: '1px solid var(--glass-border)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.85rem'
                            }}>
                                {/* Title field */}
                                <div className="form-group">
                                    <label className="form-label">Cover Letter Title</label>
                                    <input
                                        className="form-input"
                                        placeholder="e.g. Cover Letter - Google - Software Engineer"
                                        value={clTitle}
                                        onChange={e => setClTitle(e.target.value)}
                                        style={{ fontSize: '0.8rem', padding: '0.5rem 0.7rem' }}
                                    />
                                </div>

                                {/* Recipient */}
                                <div className="form-group">
                                    <label className="form-label">Recipient Name</label>
                                    <input
                                        className="form-input"
                                        placeholder="e.g. Hiring Manager"
                                        value={recipientName}
                                        onChange={e => setRecipientName(e.target.value)}
                                        style={{ fontSize: '0.8rem', padding: '0.5rem 0.7rem' }}
                                    />
                                </div>

                                {/* Company + Position row */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Company</label>
                                        <input
                                            className="form-input"
                                            placeholder="e.g. Google"
                                            value={companyName}
                                            onChange={e => setCompanyName(e.target.value)}
                                            style={{ fontSize: '0.8rem', padding: '0.5rem 0.7rem' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Position</label>
                                        <input
                                            className="form-input"
                                            placeholder="e.g. Software Engineer"
                                            value={position}
                                            onChange={e => setPosition(e.target.value)}
                                            style={{ fontSize: '0.8rem', padding: '0.5rem 0.7rem' }}
                                        />
                                    </div>
                                </div>

                                {/* Writing Style */}
                                <div className="form-group">
                                    <label className="form-label">Writing Style</label>
                                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                        {(Object.entries(WRITING_STYLES) as [WritingStyle, typeof WRITING_STYLES[WritingStyle]][]).map(([key, ws]) => (
                                            <button
                                                key={key}
                                                className={`btn btn-sm ${writingStyle === key ? 'btn-primary' : 'btn-ghost'}`}
                                                onClick={() => {
                                                    setWritingStyle(key);
                                                    saveStyle(key);
                                                }}
                                                style={{
                                                    fontSize: '0.7rem',
                                                    padding: '0.3rem 0.6rem',
                                                    textTransform: 'none',
                                                    letterSpacing: 'normal'
                                                }}
                                                title={ws.description}
                                            >
                                                {ws.icon} {ws.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">
                                        Job Description
                                        <span style={{ color: 'var(--danger)', marginLeft: '2px' }}>*</span>
                                    </label>
                                    <textarea
                                        className="form-input"
                                        placeholder="Paste the job description here to generate a tailored cover letter..."
                                        value={jobDescription}
                                        onChange={e => setJobDescription(e.target.value)}
                                        style={{
                                            minHeight: '120px',
                                            flex: 1,
                                            fontSize: '0.8rem',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>

                                {/* Action buttons */}
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={handleGenerate}
                                        disabled={!canGenerate || loading}
                                        style={{ flex: 1, fontSize: '0.75rem' }}
                                    >
                                        {loading ? (
                                            <span className="ai-loading" style={{ gap: '6px' }}>
                                                <span className="spinner" style={{ width: '14px', height: '14px' }} />
                                                Generating...
                                            </span>
                                        ) : (
                                            <>
                                                <Sparkles size={14} /> Generate
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={handleSave}
                                        disabled={!hasContent}
                                        title="Save cover letter"
                                    >
                                        <Save size={14} />
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={handleNew}
                                        title="Start fresh"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div style={{
                                        padding: '0.5rem 0.7rem',
                                        background: 'rgba(239, 68, 68, 0.08)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <AlertCircle size={12} color="var(--danger)" />
                                        {error}
                                    </div>
                                )}

                                {/* Saved cover letters panel */}
                                {showSaved && (
                                    <div style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            padding: '0.5rem 0.7rem',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            color: 'var(--text-dim)',
                                            borderBottom: '1px solid var(--glass-border)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span>Saved Cover Letters ({savedLetters.length})</span>
                                            <button className="btn btn-ghost btn-sm" onClick={() => setShowSaved(false)} style={{ padding: '0.2rem' }}>
                                                <X size={12} />
                                            </button>
                                        </div>
                                        {savedLetters.length === 0 ? (
                                            <div style={{ padding: '1rem 0.7rem', fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                                                No saved cover letters yet
                                            </div>
                                        ) : (
                                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {savedLetters.map(cl => (
                                                    <div
                                                        key={cl.id}
                                                        style={{
                                                            padding: '0.5rem 0.7rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                                                            cursor: 'pointer',
                                                            background: cl.id === selectedLetterId ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                                                            transition: 'background 0.1s'
                                                        }}
                                                        onClick={() => handleLoad(cl.id)}
                                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = cl.id === selectedLetterId ? 'rgba(245, 158, 11, 0.08)' : 'transparent'; }}
                                                    >
                                                        <FileText size={12} color="var(--text-dim)" />
                                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                                            <div style={{ fontSize: '0.78rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {cl.name}
                                                            </div>
                                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                                <Clock size={9} />
                                                                {new Date(cl.updatedAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="btn btn-ghost btn-sm"
                                                            onClick={e => { e.stopPropagation(); handleDelete(cl.id); }}
                                                            style={{ padding: '0.2rem', color: 'var(--text-dim)', flexShrink: 0 }}
                                                        >
                                                            <Trash2 size={11} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right: Preview */}
                            <div style={{
                                width: '55%',
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'rgba(255,255,255,0.02)'
                            }}>
                                {/* Preview toolbar */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.6rem 1rem',
                                    borderBottom: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.02)'
                                }}>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: 'var(--text-dim)',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Preview
                                    </span>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={handleCopy}
                                            disabled={!hasContent}
                                            title="Copy to clipboard"
                                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.65rem' }}
                                        >
                                            {copied ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                                            <span style={{ marginLeft: '3px' }}>{copied ? 'Copied' : 'Copy'}</span>
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={handleExportPDF}
                                            disabled={!hasContent}
                                            title="Export as PDF"
                                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.65rem' }}
                                        >
                                            <Download size={13} />
                                            <span style={{ marginLeft: '3px' }}>PDF</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Preview content */}
                                <div style={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    padding: '1rem',
                                    display: 'flex',
                                    alignItems: hasContent ? 'flex-start' : 'center',
                                    justifyContent: 'center'
                                }}>
                                    {hasContent ? (
                                        <div style={{
                                            background: '#fff',
                                            borderRadius: 'var(--radius-md)',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)',
                                            overflow: 'hidden',
                                            width: '100%',
                                            maxWidth: '500px',
                                            margin: '0 auto'
                                        }}>
                                            <CoverLetterTemplate
                                                content={clContent}
                                                recipientName={recipientName}
                                                companyName={companyName}
                                                position={position || formData.designation}
                                                userFirstName={formData.firstName}
                                                userLastName={formData.lastName}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                                            <FileText size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                                Your cover letter will appear here
                                            </p>
                                            <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                                                Fill in the job description and click Generate
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CoverLetterBuilder;
