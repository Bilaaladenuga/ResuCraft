'use client';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Target, Search, Check, Copy, Plus, BookOpen,
    AlertCircle, Sparkles, List
} from 'lucide-react';
import JDRepositoryModal from './JDRepositoryModal';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { useIsMobile } from '../hooks/useIsMobile';
import { useToast } from './ToastContext';
import { FormData } from '../types';
import {
    analyzeKeywordMatch,
    getResumeCorpus,
    suggestMissingSkills,
    KeywordMatchResult
} from '../services/atsKeywordMatcher';
import { trackEvent } from '../services/track';

interface KeywordMatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const SAMPLE_JD = `Senior Software Engineer (React / Node.js)
We are looking for a Senior Software Engineer to build scalable web applications. You will work with React, TypeScript, Node.js, and PostgreSQL, collaborating with product managers and designers.

Responsibilities:
- Design and implement REST APIs and microservices
- Optimize application performance and write automated tests
- Lead code reviews and mentor junior engineers
- Work with AWS, Docker, and CI/CD pipelines

Requirements:
- 5+ years of software engineering experience
- Deep knowledge of React and TypeScript
- Experience with GraphQL, Redis, and Kubernetes is a plus
- Strong problem-solving and communication skills`;

const KeywordMatchModal: React.FC<KeywordMatchModalProps> = ({
    isOpen,
    onClose,
    formData,
    setFormData
}) => {
    const dialogRef = useModalAccessibility(isOpen, onClose, 'ATS Keyword Match');
    const toastCtx = useToast();
    const isMobile = useIsMobile();

    const [jdText, setJdText] = useState('');
    const [result, setResult] = useState<KeywordMatchResult | null>(null);
    const [showJDPicker, setShowJDPicker] = useState(false);
    const [copied, setCopied] = useState(false);
    const [addedTerms, setAddedTerms] = useState<string[]>([]);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resumeCorpus = useMemo(() => getResumeCorpus(formData), [formData]);

    // Debounced analysis — purely local, instant
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!jdText.trim()) {
            setResult(null);
            return;
        }

        debounceRef.current = setTimeout(() => {
            const res = analyzeKeywordMatch(jdText, resumeCorpus);
            setResult(res);
            trackEvent('keyword_match');
        }, 450);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [jdText, resumeCorpus]);

    useEffect(() => {
        if (isOpen) {
            setCopied(false);
            setAddedTerms([]);
        }
    }, [isOpen]);

    // Re-enable the add-to-skills button when the job description changes
    useEffect(() => {
        setAddedTerms([]);
    }, [jdText]);

    const missingSkills = useMemo(
        () => (result ? suggestMissingSkills(result) : []),
        [result]
    );

    const handleAddSkills = useCallback(() => {
        if (!missingSkills.length) return;

        const current = (formData.skillsRaw || '')
            .split(',')
            .map(s => s.trim().toLowerCase())
            .filter(Boolean);

        const newOnes = missingSkills.filter(t => !current.includes(t.toLowerCase()));
        if (!newOnes.length) {
            toastCtx.info('All suggested keywords are already in your skills');
            return;
        }

        const merged = [
            ...(formData.skillsRaw || '').split(',').map(s => s.trim()).filter(Boolean),
            ...newOnes
        ];
        setFormData(prev => ({ ...prev, skillsRaw: merged.join(', ') }));
        setAddedTerms(newOnes);
        toastCtx.success(`${newOnes.length} keyword${newOnes.length === 1 ? '' : 's'} added to Skills`);
    }, [formData.skillsRaw, missingSkills, setFormData, toastCtx]);

    const handleCopyMissing = useCallback(async () => {
        if (!result || !result.missingTerms.length) return;
        try {
            await navigator.clipboard.writeText(result.missingTerms.join(', '));
            setCopied(true);
            toastCtx.success('Missing keywords copied');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toastCtx.error('Failed to copy');
        }
    }, [result, toastCtx]);

    const score = result?.score ?? 0;
    const scoreColor = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--secondary)' : 'var(--danger)';

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
                            maxWidth: '980px',
                            width: '100%',
                            padding: 0,
                            background: 'var(--primary-light)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            overflowY: isMobile ? 'auto' : 'hidden',
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
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: 'rgba(245, 158, 11, 0.12)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--secondary)'
                                }}>
                                    <Target size={20} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1rem', margin: 0 }}>ATS Keyword Match</h2>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: '2px 0 0' }}>
                                        Paste a job description — see exactly what your resume covers (100% local, no AI needed)
                                    </p>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '0.35rem' }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>
                            {/* Left: Job Description */}
                            <div style={{
                                width: isMobile ? '100%' : '44%',
                                padding: '1.25rem 1.5rem',
                                overflowY: isMobile ? 'visible' : 'auto',
                                borderRight: isMobile ? 'none' : '1px solid var(--glass-border)',
                                borderBottom: isMobile ? '1px solid var(--glass-border)' : 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem'
                            }}>
                                <div className="form-group">
                                    <label className="form-label">Job Description</label>
                                    <textarea
                                        className="form-input"
                                        placeholder="Paste the job description here... ResuCraft scans it and compares every keyword against your resume."
                                        value={jdText}
                                        onChange={e => setJdText(e.target.value)}
                                        style={{
                                            minHeight: '240px',
                                            flex: 1,
                                            fontSize: '0.8rem',
                                            resize: 'vertical',
                                            lineHeight: 1.6
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setShowJDPicker(true)}
                                        style={{ fontSize: '0.7rem' }}
                                    >
                                        <BookOpen size={13} /> Load from JD Repository
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => setJdText(SAMPLE_JD)}
                                        style={{ fontSize: '0.7rem' }}
                                        title="Fill with a sample job description"
                                    >
                                        <Sparkles size={13} /> Try sample
                                    </button>
                                    {jdText && (
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => setJdText('')}
                                            style={{ fontSize: '0.7rem' }}
                                        >
                                            <X size={13} /> Clear
                                        </button>
                                    )}
                                </div>

                                {/* Resume coverage summary */}
                                <div style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '0.75rem 0.85rem',
                                    fontSize: '0.72rem',
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '8px',
                                    lineHeight: 1.6
                                }}>
                                    <List size={13} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }} />
                                    <span>
                                        Scans your <strong style={{ color: 'var(--text)' }}>summary, skills, experience, education, projects</strong> and more — everything that ships in your PDF/DOCX export.
                                    </span>
                                </div>

                                {/* Privacy note */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '0.68rem', color: 'var(--text-dim)'
                                }}>
                                    <Check size={12} color="var(--success)" />
                                    Runs entirely in your browser — nothing is uploaded.
                                </div>
                            </div>

                            {/* Right: Results */}
                            <div style={{
                                width: isMobile ? '100%' : '56%',
                                overflowY: isMobile ? 'visible' : 'auto',
                                padding: '1.25rem 1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                {!result ? (
                                    <div style={{
                                        flex: 1,
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center',
                                        gap: '0.5rem',
                                        color: 'var(--text-dim)',
                                        textAlign: 'center',
                                        padding: '2rem 1rem'
                                    }}>
                                        <Search size={36} style={{ opacity: 0.3 }} />
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 0 }}>
                                            Paste a job description to analyze
                                        </p>
                                        <p style={{ fontSize: '0.72rem', opacity: 0.7, maxWidth: '300px' }}>
                                            Keywords appear instantly as you type — matched ones turn green, missing ones amber.
                                        </p>
                                    </div>
                                ) : result.total === 0 ? (
                                    <div style={{
                                        flex: 1,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'center'
                                    }}>
                                        Could not find meaningful keywords in that description. Try pasting a longer job post.
                                    </div>
                                ) : (
                                    <>
                                        {/* Score header */}
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '1.25rem'
                                        }}>
                                            <div style={{
                                                width: '84px', height: '84px', borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: `conic-gradient(${scoreColor} ${score * 3.6}deg, rgba(255,255,255,0.07) 0deg)`,
                                                position: 'relative', flexShrink: 0
                                            }}>
                                                <div style={{
                                                    position: 'absolute', width: '66px', height: '66px',
                                                    background: 'var(--primary-light)', borderRadius: '50%'
                                                }} />
                                                <span style={{
                                                    position: 'relative', zIndex: 1,
                                                    fontWeight: 800, fontSize: '1.35rem', color: scoreColor
                                                }}>
                                                    {score}%
                                                </span>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.15rem' }}>
                                                    {score >= 75 ? 'Great keyword coverage!' :
                                                     score >= 50 ? 'Decent — but gaps remain' : 'Needs work'}
                                                </div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                                    <strong style={{ color: 'var(--success)' }}>{result.matched}</strong> of{' '}
                                                    <strong>{result.total}</strong> keywords found in your resume.
                                                    {missingSkills.length > 0 && (
                                                        <> {missingSkills.length} look like skills you could add.</>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={handleAddSkills}
                                                disabled={missingSkills.length === 0 || addedTerms.length > 0}
                                                style={{ fontSize: '0.7rem' }}
                                                title={addedTerms.length ? 'Already added to Skills' : 'Append suggested keywords to your Skills section'}
                                            >
                                                {addedTerms.length > 0 ? <Check size={13} /> : <Plus size={13} />}
                                                {addedTerms.length > 0
                                                    ? `${addedTerms.length} added to Skills`
                                                    : `Add ${missingSkills.length} to Skills`}
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={handleCopyMissing}
                                                disabled={result.missingTerms.length === 0}
                                                style={{ fontSize: '0.7rem' }}
                                            >
                                                {copied ? <Check size={13} /> : <Copy size={13} />}
                                                {copied ? 'Copied' : 'Copy missing list'}
                                            </button>
                                        </div>

                                        {/* Matched */}
                                        <div>
                                            <div style={{
                                                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                                                letterSpacing: '0.06em', color: 'var(--success)',
                                                display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.5rem'
                                            }}>
                                                <Check size={12} /> Matched ({result.matched})
                                            </div>
                                            {result.matched === 0 ? (
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                                                    No keywords found yet.
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {result.hits.filter(h => h.matched).map(h => (
                                                        <span key={h.term} style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                            padding: '0.25rem 0.6rem',
                                                            background: 'rgba(16, 185, 129, 0.08)',
                                                            border: '1px solid rgba(16, 185, 129, 0.25)',
                                                            borderRadius: '999px',
                                                            fontSize: '0.72rem', fontWeight: 600,
                                                            color: 'var(--success)'
                                                        }}>
                                                            {h.term}
                                                            {h.count > 1 && (
                                                                <span style={{ opacity: 0.6, fontSize: '0.62rem' }}>×{h.count}</span>
                                                            )}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Missing */}
                                        <div>
                                            <div style={{
                                                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                                                letterSpacing: '0.06em', color: 'var(--secondary)',
                                                display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.5rem'
                                            }}>
                                                <AlertCircle size={12} /> Missing ({result.missingTerms.length})
                                            </div>
                                            {result.missingTerms.length === 0 ? (
                                                <div style={{
                                                    background: 'rgba(16, 185, 129, 0.06)',
                                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    padding: '0.75rem',
                                                    fontSize: '0.75rem',
                                                    color: 'var(--success)'
                                                }}>
                                                    🎉 Your resume covers every keyword this job description mentions!
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {result.hits.filter(h => !h.matched).map(h => (
                                                        <span key={h.term} style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                            padding: '0.25rem 0.6rem',
                                                            background: h.looksLikeSkill
                                                                ? 'rgba(245, 158, 11, 0.1)'
                                                                : 'rgba(255,255,255,0.03)',
                                                            border: h.looksLikeSkill
                                                                ? '1px solid rgba(245, 158, 11, 0.35)'
                                                                : '1px solid var(--glass-border)',
                                                            borderRadius: '999px',
                                                            fontSize: '0.72rem', fontWeight: 600,
                                                            color: h.looksLikeSkill ? 'var(--secondary)' : 'var(--text-muted)'
                                                        }}>
                                                            {h.term}
                                                            {h.count > 1 && (
                                                                <span style={{ opacity: 0.6, fontSize: '0.62rem' }}>×{h.count}</span>
                                                            )}
                                                            {h.looksLikeSkill && <Plus size={10} />}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {result.missingTerms.length > 0 && (
                                                <p style={{
                                                    fontSize: '0.65rem', color: 'var(--text-dim)',
                                                    marginTop: '0.5rem', lineHeight: 1.5
                                                }}>
                                                    Amber chips are skill-like terms worth weaving into your resume. Mention
                                                    them naturally in bullets or add them to your Skills section — then re-run to watch your score climb.
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* JD Repository picker */}
                    <JDRepositoryModal
                        isOpen={showJDPicker}
                        onClose={() => setShowJDPicker(false)}
                        onSelect={(jd) => {
                            setJdText(jd.content);
                            setShowJDPicker(false);
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default KeywordMatchModal;
