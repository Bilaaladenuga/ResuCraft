'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X, Sparkles, Check, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { FormData, LANGUAGES, LanguageCode } from '../types';
import { translateResumeContent, generateFallbackTranslation, checkApiKey } from '../services/ai';
import { useToast } from './ToastContext';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface TranslateModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    industry?: string;
    onOpenSettings?: () => void;
}

interface SectionStatus {
    id: string;
    label: string;
    status: 'pending' | 'translating' | 'done' | 'skipped';
}

const TranslateModal: React.FC<TranslateModalProps> = ({
    isOpen,
    onClose,
    formData,
    setFormData,
    industry = '',
    onOpenSettings
}) => {
    const dialogRef = useModalAccessibility(isOpen, onClose, 'Translate Resume');
    const [targetLanguage, setTargetLanguage] = useState<LanguageCode>('es');
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationResult, setTranslationResult] = useState<FormData | null>(null);
    const [showOriginal, setShowOriginal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [error, setError] = useState('');
    const hasApiKey = checkApiKey();
    const toastCtx = useToast();

    const selectedLanguage = LANGUAGES.find(l => l.code === targetLanguage);

    // Check if resume has content
    const hasContent = (): boolean => {
        return !!(
            formData.summary?.trim() ||
            formData.firstName?.trim() ||
            formData.experiences?.length > 0 ||
            formData.skillsRaw?.trim()
        );
    };

    const handleTranslate = async () => {
        if (!hasContent()) {
            toastCtx.error('Add some resume content first before translating');
            return;
        }

        setIsTranslating(true);
        setError('');
        setTranslationResult(null);

        try {
            let translated: FormData;

            if (hasApiKey) {
                translated = await translateResumeContent(formData, targetLanguage, industry);
            } else {
                translated = generateFallbackTranslation(formData, targetLanguage);
                // If no API key and fallback returned same data, show a helpful message
                if (JSON.stringify(translated) === JSON.stringify(formData)) {
                    toastCtx.warning('Configure an AI API key for accurate translations. Showing original content.');
                }
            }

            setTranslationResult(translated);
            toastCtx.success(`Resume translated to ${selectedLanguage?.nativeLabel || targetLanguage}!`);
        } catch (err: any) {
            console.error('Translation failed:', err);
            setError(err.message || 'Translation failed. Please check your API key.');
            toastCtx.error(err.message || 'Translation failed');
        } finally {
            setIsTranslating(false);
        }
    };

    const handleApply = () => {
        if (translationResult) {
            setFormData(translationResult);
            toastCtx.success(`Resume updated with ${selectedLanguage?.nativeLabel || targetLanguage} translation`);
            onClose();
        }
    };

    const handleLanguageChange = (code: LanguageCode) => {
        setTargetLanguage(code);
        setTranslationResult(null);
        setShowDetails(false);
    };

    // Count total fields that would be translated
    const getFieldCount = () => {
        let count = 0;
        if (formData.summary?.trim()) count++;
        if (formData.designation?.trim()) count++;
        if (formData.address?.trim()) count++;
        if (formData.skillsRaw?.trim()) count++;
        count += (formData.experiences || []).filter(e => e.title || e.description).length * 2;
        count += (formData.educations || []).filter(e => e.degree || e.description).length * 2;
        count += (formData.projects || []).filter(e => e.title || e.description).length * 2;
        count += (formData.achievements || []).filter(e => e.title || e.description).length;
        return count;
    };

    const sectionStatuses: SectionStatus[] = [
        { id: 'about', label: 'About / Summary', status: 'pending' as const },
        { id: 'experience', label: 'Experience', status: formData.experiences?.length > 0 ? 'pending' as const : 'skipped' as const },
        { id: 'education', label: 'Education', status: formData.educations?.length > 0 ? 'pending' as const : 'skipped' as const },
        { id: 'projects', label: 'Projects', status: formData.projects?.length > 0 ? 'pending' as const : 'skipped' as const },
        { id: 'achievements', label: 'Achievements', status: formData.achievements?.length > 0 ? 'pending' as const : 'skipped' as const },
        { id: 'skills', label: 'Skills', status: formData.skillsRaw?.trim() ? 'pending' as const : 'skipped' as const },
    ].map((s): SectionStatus => ({
        ...s,
        status: isTranslating ? 'translating' :
                translationResult ? 'done' : s.status
    }));

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
                        className="modal-card glass-card"
                        style={{
                            maxWidth: '560px',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '36px', height: '36px',
                                    borderRadius: '10px',
                                    background: 'rgba(6, 182, 212, 0.1)',
                                    color: 'var(--accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Globe size={18} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1rem', margin: 0 }}>Translate Resume</h2>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: '2px 0 0' }}>
                                        Convert your resume to another language
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '0.3rem' }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Language Selector */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                                Target Language
                            </label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                gap: '6px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                padding: '2px'
                            }}>
                                {LANGUAGES.filter(l => l.code !== 'en').map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '0.4rem 0.6rem',
                                            borderRadius: 'var(--radius-sm)',
                                            border: `1px solid ${targetLanguage === lang.code ? 'var(--accent)' : 'var(--glass-border)'}`,
                                            background: targetLanguage === lang.code
                                                ? 'rgba(6, 182, 212, 0.08)'
                                                : 'rgba(255,255,255,0.02)',
                                            color: targetLanguage === lang.code ? 'var(--accent)' : 'var(--text)',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontFamily: 'var(--font-body)',
                                            fontWeight: targetLanguage === lang.code ? 600 : 400,
                                            transition: 'all 0.15s',
                                            textAlign: 'left',
                                            width: '100%'
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = targetLanguage === lang.code ? 'var(--accent)' : 'var(--glass-border)'; }}
                                    >
                                        <span style={{ fontSize: '1.1rem' }}>{lang.flag}</span>
                                        <span>{lang.nativeLabel}</span>
                                        {targetLanguage === lang.code && (
                                            <span style={{ marginLeft: 'auto' }}>
                                                <Check size={10} />
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Summary */}
                        {hasContent() && !translationResult && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--glass-border)',
                                marginBottom: '1rem',
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)'
                            }}>
                                <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                                    {getFieldCount()} text fields
                                </span> will be translated to <strong>{selectedLanguage?.nativeLabel}</strong>
                            </div>
                        )}

                        {/* No content message */}
                        {!hasContent() && (
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(245, 158, 11, 0.06)',
                                border: '1px solid rgba(245, 158, 11, 0.15)',
                                borderRadius: 'var(--radius-sm)',
                                marginBottom: '1rem',
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '8px'
                            }}>
                                <AlertCircle size={14} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '1px' }} />
                                <div>
                                    <strong style={{ color: 'var(--secondary)' }}>No content to translate yet.</strong>
                                    <br />
                                    Fill in some resume sections first, then come back here to translate everything at once.
                                </div>
                            </div>
                        )}

                        {/* Translation result preview */}
                        {translationResult && (
                            <div style={{
                                marginBottom: '1rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--glass-border)',
                                overflow: 'hidden'
                            }}>
                                {/* Section status summary */}
                                <div
                                    onClick={() => setShowDetails(!showDetails)}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        background: 'rgba(16, 185, 129, 0.04)',
                                        borderBottom: showDetails ? '1px solid var(--glass-border)' : 'none'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Check size={14} color="var(--success)" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--success)' }}>
                                            Translation Complete
                                        </span>
                                    </div>
                                    <ChevronDown size={14} color="var(--text-muted)" style={{
                                        transform: showDetails ? 'rotate(180deg)' : 'none',
                                        transition: 'transform 0.2s'
                                    }} />
                                </div>

                                {showDetails && (
                                    <div style={{ padding: '0.75rem 1rem' }}>
                                        {/* Quick preview of translated content */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                            marginBottom: '0.75rem',
                                            fontSize: '0.7rem'
                                        }}>
                                            <button
                                                className={`btn btn-ghost btn-sm`}
                                                onClick={() => setShowOriginal(false)}
                                                style={{
                                                    flex: 1,
                                                    background: !showOriginal ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                                                    borderColor: !showOriginal ? 'var(--accent)' : 'var(--glass-border)',
                                                    color: !showOriginal ? 'var(--accent)' : 'var(--text-muted)'
                                                }}
                                            >
                                                🌍 Translated
                                            </button>
                                            <button
                                                className={`btn btn-ghost btn-sm`}
                                                onClick={() => setShowOriginal(true)}
                                                style={{
                                                    flex: 1,
                                                    background: showOriginal ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                                                    borderColor: showOriginal ? 'var(--secondary)' : 'var(--glass-border)',
                                                    color: showOriginal ? 'var(--secondary)' : 'var(--text-muted)'
                                                }}
                                            >
                                                🇬🇧 Original
                                            </button>
                                        </div>

                                        {/* Preview of summary */}
                                        {(showOriginal ? formData.summary : translationResult.summary) && (
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <div style={{
                                                    fontSize: '0.6rem',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    color: 'var(--text-dim)',
                                                    letterSpacing: '1px',
                                                    marginBottom: '4px'
                                                }}>
                                                    Summary
                                                </div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-muted)',
                                                    lineHeight: '1.5',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    maxHeight: '80px',
                                                    overflowY: 'auto'
                                                }}>
                                                    {showOriginal ? formData.summary : translationResult.summary}
                                                </div>
                                            </div>
                                        )}

                                        {/* Preview of skills */}
                                        {(showOriginal ? formData.skillsRaw : translationResult.skillsRaw) && (
                                            <div>
                                                <div style={{
                                                    fontSize: '0.6rem',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    color: 'var(--text-dim)',
                                                    letterSpacing: '1px',
                                                    marginBottom: '4px'
                                                }}>
                                                    Skills
                                                </div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-muted)',
                                                    lineHeight: '1.5',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: 'var(--radius-sm)'
                                                }}>
                                                    {showOriginal ? formData.skillsRaw : translationResult.skillsRaw}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div style={{
                                padding: '0.6rem 0.8rem',
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '8px',
                                marginBottom: '1rem'
                            }}>
                                <AlertCircle size={14} color="var(--danger)" style={{ flexShrink: 0, marginTop: '1px' }} />
                                <div>
                                    <strong style={{ color: 'var(--danger)' }}>Translation failed</strong>
                                    <br />
                                    {error}
                                    {!hasApiKey && (
                                        <div style={{ marginTop: '6px' }}>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => { onOpenSettings?.(); }}
                                                style={{ fontSize: '0.65rem', padding: '0.25rem 0.6rem' }}
                                            >
                                                <Sparkles size={10} /> Configure AI
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '1rem',
                            flexDirection: 'column'
                        }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleTranslate}
                                    disabled={isTranslating || !hasContent()}
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    {isTranslating ? (
                                        <>
                                            <Loader2 size={14} className="spin-animation" />
                                            Translating...
                                        </>
                                    ) : (
                                        <>
                                            <Globe size={14} />
                                            Translate to {selectedLanguage?.nativeLabel}
                                        </>
                                    )}
                                </button>
                            </div>

                            {translationResult && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="btn btn-accent"
                                        onClick={handleApply}
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        <Check size={14} />
                                        Apply Translation
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setTranslationResult(null)}
                                        style={{
                                            fontSize: '0.75rem',
                                            padding: '0.5rem 1rem'
                                        }}
                                    >
                                        <X size={14} />
                                        Discard
                                    </button>
                                </div>
                            )}

                            {!hasApiKey && (
                                <div style={{
                                    fontSize: '0.65rem',
                                    color: 'var(--text-dim)',
                                    textAlign: 'center',
                                    padding: '0.5rem',
                                    background: 'rgba(245, 158, 11, 0.05)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid rgba(245, 158, 11, 0.1)'
                                }}>
                                    <AlertCircle size={10} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                    For accurate translations, configure an AI provider in
                                    <button
                                        onClick={() => onOpenSettings?.()}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--secondary)',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.65rem',
                                            textDecoration: 'underline',
                                            marginLeft: '4px'
                                        }}
                                    >
                                        Settings
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TranslateModal;
