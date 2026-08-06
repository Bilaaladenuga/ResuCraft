'use client';
import React, { useState, useCallback, useRef } from 'react';
import { FileText, X, Loader2, CheckCircle, AlertTriangle, Sparkles, Upload, Eye, List } from 'lucide-react';
import { extractPDFText, parseResumeText, parseResumeWithAI } from '../services/pdfImport';
import { extractDOCXText } from '../services/docxImport';
import { checkApiKey } from '../services/ai';
import { FormData } from '../types';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface FileImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: Partial<FormData>) => void;
    /** 'pdf' | 'docx' — which file format this instance handles */
    kind: 'pdf' | 'docx';
}

const KIND_META = {
    pdf: {
        title: 'Import from PDF',
        subtitle: 'Upload an existing resume — we\u2019ll auto-fill the form',
        accent: '#ef4444',
        accentBg: 'rgba(239, 68, 68, 0.1)',
        dropText: 'Drag & drop your resume here',
        dropHint: 'or click to browse \u00b7 PDF only',
        accept: 'application/pdf,.pdf',
        tip: 'Text-based PDFs import best. Scanned/image-only PDFs can\u2019t be read without OCR.',
        processing: 'Extracting text from PDF...',
        processingHint: 'reading pages and structuring your data',
    },
    docx: {
        title: 'Import from Word (DOCX)',
        subtitle: 'Upload a .docx resume — we\u2019ll auto-fill the form',
        accent: '#3b82f6',
        accentBg: 'rgba(59, 130, 246, 0.1)',
        dropText: 'Drag & drop your resume here',
        dropHint: 'or click to browse \u00b7 Word (.docx) only',
        accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        tip: 'Word documents always contain real text — no OCR needed. Everything extracts cleanly.',
        processing: 'Extracting text from Word document...',
        processingHint: 'parsing your document and structuring your data',
    },
} as const;

const FileImportModal: React.FC<FileImportModalProps> = ({ isOpen, onClose, onImport, kind }) => {
    const dialogRef = useModalAccessibility(isOpen, onClose, KIND_META[kind].title);
    const meta = KIND_META[kind];
    const [step, setStep] = useState<'upload' | 'processing' | 'preview' | 'done'>('upload');
    const [source, setSource] = useState<'file' | 'text'>('file');
    const [fileName, setFileName] = useState('');
    const [pastedText, setPastedText] = useState('');
    const [parsedData, setParsedData] = useState<Partial<FormData> | null>(null);
    const [error, setError] = useState('');
    const [useAI, setUseAI] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [hasApiKey, setHasApiKey] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        setHasApiKey(checkApiKey());
        if (isOpen) {
            setStep('upload');
            setSource('file');
            setFileName('');
            setPastedText('');
            setParsedData(null);
            setError('');
        }
    }, [isOpen]);

    /** Shared: run the parser (regex or AI) on any raw resume text and show the preview */
    const parseAndPreview = useCallback(async (rawText: string, label: string) => {
        if (!rawText || rawText.trim().length < 20) {
            setError('Please paste at least a few lines of your resume text (name, experience, skills...).');
            setStep('upload');
            return;
        }
        setFileName(label);
        setStep('processing');
        setError('');
        try {
            const result = useAI ? await parseResumeWithAI(rawText) : parseResumeText(rawText);
            setParsedData(result);
            setStep('preview');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to parse the text. Please try again.');
            setStep('upload');
        }
    }, [useAI]);

    const handleFile = useCallback(async (file: File | undefined) => {
        if (!file) return;

        if (kind === 'pdf') {
            if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') {
                setError('Please select a PDF file.');
                return;
            }
        } else {
            if (!/\.docx$/i.test(file.name)) {
                setError('Please select a .docx (Word) file.');
                return;
            }
        }

        setFileName(file.name);
        setStep('processing');
        setError('');

        try {
            const rawText = kind === 'pdf'
                ? await extractPDFText(file)
                : await extractDOCXText(file);

            if (!rawText || rawText.trim().length < 20) {
                throw new Error(
                    kind === 'pdf'
                        ? 'No text could be extracted from this PDF. It may be a scanned/image-only document.'
                        : 'No text could be extracted from this file. It may be empty or corrupt.'
                );
            }

            await parseAndPreview(rawText, file.name);
        } catch (err) {
            const message = err instanceof Error ? err.message : `Failed to parse the ${kind.toUpperCase()}. Please try another file.`;
            setError(message);
            setStep('upload');
            // Scanned PDF? Jump straight to the paste tab so the user can recover.
            if (kind === 'pdf' && message.includes('scanned')) {
                setSource('text');
            }
        }
    }, [kind, parseAndPreview]);

    const handlePasteAnalyze = useCallback(() => {
        parseAndPreview(pastedText, 'Pasted resume text');
    }, [parseAndPreview, pastedText]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
    }, [handleFile]);

    const handleConfirmImport = useCallback(() => {
        if (parsedData) {
            onImport(parsedData);
            setStep('done');
        }
    }, [parsedData, onImport]);

    const handleClose = useCallback(() => {
        setStep('upload');
        setSource('file');
        setFileName('');
        setPastedText('');
        setParsedData(null);
        setError('');
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    const getFieldCount = (data: Partial<FormData>): number => {
        let count = 0;
        if (data.firstName || data.lastName) count++;
        if (data.designation) count++;
        if (data.email) count++;
        if (data.phone) count++;
        if (data.summary && data.summary.length > 20) count++;
        if (data.skillsRaw) count++;
        if (data.experiences && data.experiences.length > 0) count += data.experiences.length;
        if (data.educations && data.educations.length > 0) count += data.educations.length;
        if (data.projects && data.projects.length > 0) count += data.projects.length;
        return count;
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div
                ref={dialogRef}
                className="glass-card linkedin-modal"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '640px', width: '100%' }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: meta.accentBg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: meta.accent
                        }}>
                            <FileText size={22} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.1rem' }}>
                                {meta.title}
                            </h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
                                {meta.subtitle}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="btn-icon-sm" style={{ color: 'var(--text-dim)' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* AI Toggle */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '1rem', padding: '0.5rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-sm)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Sparkles size={14} color={useAI ? 'var(--secondary)' : 'var(--text-dim)'} />
                        Use AI for smarter parsing
                        {useAI && !hasApiKey && <span style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '0.7rem' }}>(no AI key)</span>}
                    </div>
                    <button
                        onClick={() => setUseAI(!useAI)}
                        style={{
                            width: '36px', height: '20px', borderRadius: '10px', border: 'none',
                            background: useAI ? 'var(--secondary)' : 'rgba(255,255,255,0.1)',
                            cursor: 'pointer', position: 'relative', transition: 'var(--transition)',
                            padding: 0
                        }}
                    >
                        <span style={{
                            width: '16px', height: '16px', borderRadius: '50%',
                            background: '#fff', display: 'block',
                            position: 'absolute', top: '2px',
                            left: useAI ? '18px' : '2px',
                            transition: 'var(--transition)'
                        }} />
                    </button>
                </div>

                {step === 'upload' && (
                    <>
                        {/* Source tabs: upload file OR paste text */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.35rem',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.25rem',
                            marginBottom: '1rem'
                        }}>
                            <button
                                onClick={() => { setSource('file'); setError(''); }}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    padding: '0.5rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                    fontSize: '0.75rem', fontWeight: 600,
                                    background: source === 'file' ? 'var(--secondary)' : 'transparent',
                                    color: source === 'file' ? '#000' : 'var(--text-muted)',
                                    transition: 'var(--transition)'
                                }}
                            >
                                <Upload size={13} /> Upload file
                            </button>
                            <button
                                onClick={() => { setSource('text'); setError(''); }}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    padding: '0.5rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                    fontSize: '0.75rem', fontWeight: 600,
                                    background: source === 'text' ? 'var(--secondary)' : 'transparent',
                                    color: source === 'text' ? '#000' : 'var(--text-muted)',
                                    transition: 'var(--transition)'
                                }}
                            >
                                <List size={13} /> Paste text
                            </button>
                        </div>

                        {source === 'file' && (
                            <>
                                {/* Drop zone */}
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: `2px dashed ${dragOver ? 'var(--secondary)' : 'var(--glass-border)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        padding: '3rem 1.5rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: dragOver ? 'rgba(245, 158, 11, 0.05)' : 'rgba(255,255,255,0.02)',
                                        transition: 'var(--transition)'
                                    }}
                                >
                                    <Upload size={32} color="var(--secondary)" style={{ marginBottom: '0.75rem' }} />
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                        {meta.dropText}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                        {meta.dropHint}
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={meta.accept}
                                    onChange={(e) => handleFile(e.target.files?.[0])}
                                    style={{ display: 'none' }}
                                />

                                <p style={{
                                    fontSize: '0.7rem', color: 'var(--text-dim)',
                                    marginTop: '1rem', lineHeight: 1.5
                                }}>
                                    <Eye size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                    Tip: {meta.tip}
                                    {kind === 'pdf' && (
                                        <> Scanned PDF? Switch to <strong style={{ color: 'var(--secondary)' }}>Paste text</strong> and paste your resume instead.</>
                                    )}
                                </p>
                            </>
                        )}

                        {source === 'text' && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Resume Text</label>
                                    <textarea
                                        className="form-input"
                                        placeholder="Paste the full text of your resume here (name, contact, summary, experience, education, skills...). Great for scanned PDFs — extract the text with any OCR tool, or copy it from Google Docs, and paste it here."
                                        value={pastedText}
                                        onChange={(e) => setPastedText(e.target.value)}
                                        style={{
                                            minHeight: '200px',
                                            fontSize: '0.8rem',
                                            resize: 'vertical',
                                            lineHeight: 1.6,
                                            fontFamily: 'monospace'
                                        }}
                                    />
                                </div>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={handlePasteAnalyze}
                                    disabled={pastedText.trim().length < 20}
                                    style={{ width: '100%', marginTop: '0.25rem' }}
                                >
                                    <Sparkles size={14} /> Analyze resume text
                                </button>
                                <p style={{
                                    fontSize: '0.68rem', color: 'var(--text-dim)',
                                    marginTop: '0.6rem', lineHeight: 1.5
                                }}>
                                    <Eye size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                    Everything is parsed locally (or with your own AI key if the toggle above is on).
                                </p>
                            </>
                        )}

                        {error && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.5rem 0.75rem', marginTop: '0.75rem',
                                background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--danger)'
                            }}>
                                <AlertTriangle size={14} />
                                {error}
                            </div>
                        )}
                    </>
                )}

                {step === 'processing' && (
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', padding: '3rem 2rem', gap: '1rem'
                    }}>
                        <Loader2 size={32} className="spin-animation" style={{ color: 'var(--secondary)' }} />
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {useAI ? 'Analyzing with AI...' : meta.processing}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                            {fileName} — {source === 'file' ? meta.processingHint : 'parsing your pasted text'}
                        </div>
                    </div>
                )}

                {step === 'preview' && parsedData && (
                    <div>
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(16, 185, 129, 0.05)',
                            border: '1px solid rgba(16, 185, 129, 0.15)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <CheckCircle size={18} color="var(--success)" />
                            <div>
                                <strong style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                                    {getFieldCount(parsedData)} fields extracted
                                </strong>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>
                                    {useAI ? 'AI-enhanced' : 'Regex-based'} parsing — review the data below
                                </span>
                            </div>
                        </div>

                        {/* Preview details */}
                        <div className="linkedin-preview">
                            {(parsedData.firstName || parsedData.lastName) && (
                                <div className="linkedin-preview-item">
                                    <span className="linkedin-preview-label">Name</span>
                                    <span className="linkedin-preview-value">
                                        {parsedData.firstName} {parsedData.lastName}
                                    </span>
                                </div>
                            )}
                            {parsedData.designation && (
                                <div className="linkedin-preview-item">
                                    <span className="linkedin-preview-label">Role</span>
                                    <span className="linkedin-preview-value">{parsedData.designation}</span>
                                </div>
                            )}
                            {parsedData.email && (
                                <div className="linkedin-preview-item">
                                    <span className="linkedin-preview-label">Email</span>
                                    <span className="linkedin-preview-value">{parsedData.email}</span>
                                </div>
                            )}
                            {parsedData.phone && (
                                <div className="linkedin-preview-item">
                                    <span className="linkedin-preview-label">Phone</span>
                                    <span className="linkedin-preview-value">{parsedData.phone}</span>
                                </div>
                            )}
                            {parsedData.summary && (
                                <div className="linkedin-preview-item">
                                    <span className="linkedin-preview-label">Summary</span>
                                    <span className="linkedin-preview-value linkedin-preview-text">
                                        {parsedData.summary.length > 150
                                            ? parsedData.summary.substring(0, 150) + '...'
                                            : parsedData.summary}
                                    </span>
                                </div>
                            )}
                            {parsedData.experiences && parsedData.experiences.length > 0 && (
                                <div className="linkedin-preview-item">
                                    <span className="linkedin-preview-label">Experience</span>
                                    <span className="linkedin-preview-value">
                                        {parsedData.experiences.length} position{parsedData.experiences.length > 1 ? 's' : ''}
                                        <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', marginLeft: '0.5rem' }}>
                                            {parsedData.experiences.map(e => e.title).filter(Boolean).join(', ')}
                                        </span>
                                    </span>
                                </div>
                            )}
                            {parsedData.educations && parsedData.educations.length > 0 && (
                                <div className="linkedin-preview-item">
                                    <span className="linkedin-preview-label">Education</span>
                                    <span className="linkedin-preview-value">
                                        {parsedData.educations.length} entr{parsedData.educations.length > 1 ? 'ies' : 'y'}
                                        <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', marginLeft: '0.5rem' }}>
                                            {parsedData.educations.map(e => e.school).filter(Boolean).join(', ')}
                                        </span>
                                    </span>
                                </div>
                            )}
                            {parsedData.skillsRaw && (
                                <div className="linkedin-preview-item">
                                    <span className="linkedin-preview-label">Skills</span>
                                    <span className="linkedin-preview-value">
                                        {parsedData.skillsRaw.split(',').length} skills
                                    </span>
                                </div>
                            )}
                            {parsedData.projects && parsedData.projects.length > 0 && (
                                <div className="linkedin-preview-item">
                                    <span className="linkedin-preview-label">Projects</span>
                                    <span className="linkedin-preview-value">
                                        {parsedData.projects.length} project{parsedData.projects.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={{
                            marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-dim)',
                            background: 'rgba(255, 255, 255, 0.02)', padding: '0.6rem 0.75rem',
                            borderRadius: 'var(--radius-sm)', lineHeight: 1.5
                        }}>
                            <Eye size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            The data above will be merged into your form. You can edit any field after import.
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleConfirmImport}
                                style={{ flex: 1 }}
                            >
                                <Upload size={14} /> Import to Resume
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setStep('upload')}>
                                Choose Another
                            </button>
                        </div>
                    </div>
                )}

                {step === 'done' && (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <CheckCircle size={44} color="var(--success)" style={{ marginBottom: '0.75rem' }} />
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Resume Imported! 🎉</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                            Your form has been filled from your {source === 'text' ? 'pasted resume text' : kind.toUpperCase()}. Review and polish before exporting.
                        </p>
                        <button className="btn btn-primary btn-sm" onClick={handleClose} style={{ margin: '0 auto' }}>
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileImportModal;
