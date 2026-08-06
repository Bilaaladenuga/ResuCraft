'use client';
import React, { useState, useCallback, useRef } from 'react';
import { FileText, X, Loader2, CheckCircle, AlertTriangle, Sparkles, Upload, Eye } from 'lucide-react';
import { extractPDFText, parseResumeText, parseResumeWithAI } from '../services/pdfImport';
import { checkApiKey } from '../services/ai';
import { FormData } from '../types';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface PDFImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: Partial<FormData>) => void;
}

const PDFImportModal: React.FC<PDFImportModalProps> = ({ isOpen, onClose, onImport }) => {
    const dialogRef = useModalAccessibility(isOpen, onClose, 'Import from PDF');
    const [step, setStep] = useState<'upload' | 'processing' | 'preview' | 'done'>('upload');
    const [fileName, setFileName] = useState('');
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
            setFileName('');
            setParsedData(null);
            setError('');
        }
    }, [isOpen]);

    const handleFile = useCallback(async (file: File | undefined) => {
        if (!file) return;
        if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') {
            setError('Please select a PDF file.');
            return;
        }

        setFileName(file.name);
        setStep('processing');
        setError('');

        try {
            const rawText = await extractPDFText(file);
            const result = useAI ? await parseResumeWithAI(rawText) : parseResumeText(rawText);
            setParsedData(result);
            setStep('preview');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to parse the PDF. Please try another file.');
            setStep('upload');
        }
    }, [useAI]);

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
        setFileName('');
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
                            background: 'rgba(239, 68, 68, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#ef4444'
                        }}>
                            <FileText size={22} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.1rem' }}>
                                Import from PDF
                            </h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
                                Upload an existing resume — we'll auto-fill the form
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
                                Drag & drop your resume here
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                or click to browse · PDF only
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                            style={{ display: 'none' }}
                        />

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

                        <p style={{
                            fontSize: '0.7rem', color: 'var(--text-dim)',
                            marginTop: '1rem', lineHeight: 1.5
                        }}>
                            <Eye size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Tip: Text-based PDFs import best. Scanned/image-only PDFs can't be read without OCR.
                        </p>
                    </>
                )}

                {step === 'processing' && (
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', padding: '3rem 2rem', gap: '1rem'
                    }}>
                        <Loader2 size={32} className="spin-animation" style={{ color: 'var(--secondary)' }} />
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {useAI ? 'Analyzing with AI...' : 'Extracting text from PDF...'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                            {fileName} — reading pages and structuring your data
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
                            Your form has been filled from the PDF. Review and polish before exporting.
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

export default PDFImportModal;
