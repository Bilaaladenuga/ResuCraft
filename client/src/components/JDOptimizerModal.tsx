'use client';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Target, Wand2, Briefcase, Plus, Check, Copy, Search,
    AlertCircle, BookOpen, Settings, Redo2, List, Sparkles
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
import {
    tailorSummaryToJD,
    tailorExperienceToJD,
    generateFallbackTailoredSummary,
    generateFallbackTailoredExperiences,
    parseTailoredExperiences
} from '../services/jdTailor';
import { trackEvent } from '../services/track';

interface JDOptimizerModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    industry: string;
    hasApiKey: boolean;
    onOpenSettings: () => void;
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

const JDOptimizerModal: React.FC<JDOptimizerModalProps> = ({
    isOpen,
    onClose,
    formData,
    setFormData,
    industry,
    hasApiKey,
    onOpenSettings
}) => {
    const dialogRef = useModalAccessibility(isOpen, onClose, 'JD Optimizer');
    const toastCtx = useToast();
    const isMobile = useIsMobile();

    const [jdText, setJdText] = useState('');
    const [result, setResult] = useState<KeywordMatchResult | null>(null);
    const [showJDPicker, setShowJDPicker] = useState(false);
    const [addedTerms, setAddedTerms] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);
    const [tailoring, setTailoring] = useState<'summary' | 'experience' | null>(null);
    const [pendingSummary, setPendingSummary] = useState<string | null>(null);
    const [pendingExperiences, setPendingExperiences] = useState<string[] | null>(null);
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
            trackEvent('jd_optimizer');
        }, 450);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [jdText, resumeCorpus]);

    // Reset transient state when the modal opens / JD changes
    useEffect(() => {
        if (isOpen) {
            setCopied(false);
            setAddedTerms([]);
            setPendingSummary(null);
            setPendingExperiences(null);
        }
    }, [isOpen]);

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
        trackEvent('jd_optimizer_tailor');
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

    const handleTailorSummary = useCallback(async () => {
        if (!jdText.trim()) {
            toastCtx.info('Paste a job description first');
            return;
        }
        setTailoring('summary');
        try {
            if (hasApiKey) {
                const res = await tailorSummaryToJD({
                    currentSummary: formData.summary || '',
                    jobDescription: jdText,
                    role: formData.designation || '',
                    skills: formData.skillsRaw || '',
                    industry
                });
                if (res) setPendingSummary(res);
            } else {
                setPendingSummary(generateFallbackTailoredSummary(
                    formData.summary || '',
                    formData.designation || '',
                    industry,
                    missingSkills
                ));
            }
            trackEvent('jd_optimizer_tailor');
        } catch (err) {
            toastCtx.error(err instanceof Error ? err.message : 'Tailoring failed — try again');
        } finally {
            setTailoring(null);
        }
    }, [jdText, hasApiKey, formData.summary, formData.designation, formData.skillsRaw, industry, missingSkills, toastCtx]);

    const handleTailorExperience = useCallback(async () => {
        if (!jdText.trim()) {
            toastCtx.info('Paste a job description first');
            return;
        }
        if (!formData.experiences.length) {
            toastCtx.info('Add at least one experience entry to tailor');
            return;
        }
        setTailoring('experience');
        try {
            if (hasApiKey) {
                const raw = await tailorExperienceToJD({
                    experiences: formData.experiences,
                    jobDescription: jdText,
                    role: formData.designation || '',
                    industry
                });
                setPendingExperiences(parseTailoredExperiences(raw, formData.experiences.length));
            } else {
                setPendingExperiences(generateFallbackTailoredExperiences(
                    formData.experiences,
                    missingSkills
                ));
            }
            trackEvent('jd_optimizer_tailor');
        } catch (err) {
            toastCtx.error(err instanceof Error ? err.message : 'Tailoring failed — try again');
        } finally {
            setTailoring(null);
        }
    }, [jdText, hasApiKey, formData.experiences, formData.designation, industry, missingSkills, toastCtx]);

    const applySummary = useCallback(() => {
        if (pendingSummary == null) return;
        setFormData(prev => ({ ...prev, summary: pendingSummary }));
        toastCtx.success('Summary tailored to the job description');
        trackEvent('jd_optimizer_tailor');
        setPendingSummary(null);
    }, [pendingSummary, setFormData, toastCtx]);

    const applyExperiences = useCallback(() => {
        if (!pendingExperiences) return;
        setFormData(prev => ({
            ...prev,
            experiences: prev.experiences.map((exp, i) => {
                const next = pendingExperiences[i];
                return {
                    ...exp,
                    description: next && next.trim() ? next : exp.description
                };
            })
        }));
        toastCtx.success('Experience bullets tailored to the job description');
        trackEvent('jd_optimizer_tailor');
        setPendingExperiences(null);
    }, [pendingExperiences, setFormData, toastCtx]);

    const score = result?.score ?? 0;
    const scoreColor = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--secondary)' : 'var(--danger)';
    const tailoringActive = tailoring !== null;

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
                                    background: 'rgba(139, 92, 246, 0.12)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#a78bfa'
                                }}>
                                    <Target size={20} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1rem', margin: 0 }}>JD Optimizer</h2>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: '2px 0 0' }}>
                                        Paste a job description — analyze your coverage, then tailor your resume to match it
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
                                width: isMobile ? '100%' : '42%',
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
                                        placeholder="Paste the job description here... ResuCraft scans every keyword and can tailor your summary, experience bullets, and skills to match."
                                        value={jdText}
                                        onChange={e => setJdText(e.target.value)}
                                        style={{
                                            minHeight: '220px',
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

                                {/* How it works */}
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
                                        Analysis runs <strong style={{ color: 'var(--text)' }}>100% in your browser</strong>. Tailoring uses your AI key when configured — otherwise smart templates weave in the missing keywords. Nothing is uploaded.
                                    </span>
                                </div>

                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '0.68rem', color: 'var(--text-dim)'
                                }}>
                                    <Check size={12} color="var(--success)" />
                                    Your resume content never leaves this device.
                                </div>
                            </div>

                            {/* Right: Analysis + Tailoring */}
                            <div style={{
                                width: isMobile ? '100%' : '58%',
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
                                            Paste a job description to begin
                                        </p>
                                        <p style={{ fontSize: '0.72rem', opacity: 0.7, maxWidth: '320px' }}>
                                            You'll see your keyword coverage instantly, then one-click options to tailor your summary, experience bullets, and skills.
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
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
                                                    <strong>{result.total}</strong> keywords found.
                                                    {missingSkills.length > 0 && (
                                                        <> {missingSkills.length} look like skills you can weave in.</>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tailor actions */}
                                        <div style={{
                                            background: 'rgba(139, 92, 246, 0.05)',
                                            border: '1px solid rgba(139, 92, 246, 0.2)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '0.85rem'
                                        }}>
                                            <div style={{
                                                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                                                letterSpacing: '0.06em', color: '#a78bfa',
                                                display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.6rem'
                                            }}>
                                                <Wand2 size={12} /> Tailor to this job
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={handleTailorSummary}
                                                    disabled={tailoringActive}
                                                    style={{ fontSize: '0.7rem' }}
                                                    title="Rewrite your summary to weave in the job's keywords"
                                                >
                                                    {tailoring === 'summary' ? <Redo2 size={13} className="spin-animation" /> : <Wand2 size={13} />}
                                                    {tailoring === 'summary' ? 'Writing…' : 'Tailor Summary'}
                                                </button>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={handleTailorExperience}
                                                    disabled={tailoringActive || formData.experiences.length === 0}
                                                    style={{ fontSize: '0.7rem' }}
                                                    title={formData.experiences.length === 0
                                                        ? 'Add at least one experience entry first'
                                                        : 'Rewrite your experience bullets with the job\'s keywords'}
                                                >
                                                    {tailoring === 'experience' ? <Redo2 size={13} className="spin-animation" /> : <Briefcase size={13} />}
                                                    {tailoring === 'experience' ? 'Writing…' : 'Tailor Experience'}
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-sm"
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
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={handleCopyMissing}
                                                    disabled={result.missingTerms.length === 0}
                                                    style={{ fontSize: '0.7rem' }}
                                                >
                                                    {copied ? <Check size={13} /> : <Copy size={13} />}
                                                    {copied ? 'Copied' : 'Copy missing list'}
                                                </button>
                                            </div>

                                            {!hasApiKey && (
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    marginTop: '0.6rem', paddingTop: '0.6rem',
                                                    borderTop: '1px dashed rgba(245, 158, 11, 0.25)',
                                                    fontSize: '0.68rem', color: 'var(--secondary)', lineHeight: 1.5
                                                }}>
                                                    <AlertCircle size={13} style={{ flexShrink: 0 }} />
                                                    <span style={{ flex: 1 }}>
                                                        AI not configured — using smart templates. For richer rewriting, add an API key.
                                                    </span>
                                                    <button
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={onOpenSettings}
                                                        style={{ fontSize: '0.65rem', flexShrink: 0 }}
                                                    >
                                                        <Settings size={12} /> Configure AI
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Pending review */}
                                        {(pendingSummary != null || pendingExperiences != null) && (
                                            <div style={{
                                                background: 'rgba(16, 185, 129, 0.05)',
                                                border: '1px solid rgba(16, 185, 129, 0.25)',
                                                borderRadius: 'var(--radius-sm)',
                                                padding: '0.85rem',
                                                display: 'flex', flexDirection: 'column', gap: '0.6rem'
                                            }}>
                                                <div style={{
                                                    fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                                                    letterSpacing: '0.06em', color: 'var(--success)',
                                                    display: 'flex', alignItems: 'center', gap: '5px'
                                                }}>
                                                    <Check size={12} /> Review before applying — feel free to edit
                                                </div>
                                                {pendingSummary != null && (
                                                    <textarea
                                                        className="form-input"
                                                        value={pendingSummary}
                                                        onChange={e => setPendingSummary(e.target.value)}
                                                        style={{ fontSize: '0.75rem', minHeight: '90px', lineHeight: 1.6, resize: 'vertical' }}
                                                    />
                                                )}
                                                {pendingExperiences != null && (
                                                    <>
                                                        <textarea
                                                            className="form-input"
                                                            value={pendingExperiences.join('\n\n')}
                                                            onChange={e => setPendingExperiences(parseTailoredExperiences(e.target.value, formData.experiences.length))}
                                                            style={{ fontSize: '0.75rem', minHeight: '140px', lineHeight: 1.6, resize: 'vertical' }}
                                                        />
                                                        <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>
                                                            Each role's bullets are separated by a blank line — keep the order and spacing intact.
                                                        </span>
                                                    </>
                                                )}
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <button className="btn btn-primary btn-sm" onClick={pendingSummary != null ? applySummary : applyExperiences} style={{ fontSize: '0.7rem' }}>
                                                        <Check size={13} /> Apply to resume
                                                    </button>
                                                    <button className="btn btn-secondary btn-sm" onClick={pendingSummary != null ? handleTailorSummary : handleTailorExperience} disabled={tailoringActive} style={{ fontSize: '0.7rem' }}>
                                                        <Redo2 size={13} /> Regenerate
                                                    </button>
                                                    <button className="btn btn-ghost btn-sm" onClick={() => { setPendingSummary(null); setPendingExperiences(null); }} style={{ fontSize: '0.7rem' }}>
                                                        <X size={13} /> Discard
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Matched / Missing chips */}
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

export default JDOptimizerModal;
