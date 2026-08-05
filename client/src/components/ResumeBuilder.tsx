'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Sparkles, Settings, Download, ArrowLeft, ShieldCheck, AlertCircle, Save, Upload, Trash2, Linkedin, TrendingUp, Files, ChevronDown, Plus, Edit3, Copy, Check, BookOpen, Undo2, Redo2, MoreHorizontal, PaintBucket, FileText, Globe, Sun, Moon, Shield, HelpCircle, X, Maximize2, Search } from 'lucide-react';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import AIPanel from './AIPanel';
import SettingsModal from './SettingsModal';
import LinkedInImportModal from './LinkedInImportModal';
import PDFImportModal from './PDFImportModal';
import ATSTextModal from './ATSTextModal';
// PDFExportButton must be client-only — react-pdf's PDFDownloadLink is a
// web-specific API that throws during Next.js SSR/prerendering.
const PDFExportButton = dynamic(() => import('./PDFExport'), { ssr: false });
import DOCXExportButton from './DOCXExport';
import ResumeScoreModal from './ResumeScoreModal';
import ResumeManager from './ResumeManager';
import SpellCheckModal from './SpellCheckModal';
import TemplateCustomizerModal from './TemplateCustomizerModal';
import CoverLetterBuilder from './CoverLetterBuilder';
import TranslateModal from './TranslateModal';
import ATSChecklistModal from './ATSChecklistModal';
import FeedbackInbox from './FeedbackInbox';
import Onboarding from './Onboarding';
import { useToast } from './ToastContext';
import { useTheme } from './ThemeContext';
import { getTemplate } from '../templates';
import { checkApiKey } from '../services/ai';
import { useUndoRedo } from '../services/undoService';
import {
    saveDraft, loadDraft, clearDraft, exportResumeAsJSON, importResumeFromJSON,
    getResumeById, saveResume, getResumeIndex, getActiveResumeId,
    setActiveResumeId, createResume, renameResume, duplicateResume,
    getCustomization, isPageWarningDismissed, setPageWarningDismissedPref
} from '../services/storage';
import { validateSection, validateAllSections, hasErrors } from '../services/validation';
import { FormData, ValidationErrors, TouchedSections, OpenSections, ResumeMeta, TemplateCustomization, DEFAULT_CUSTOMIZATION } from '../types';

const DEFAULT_FORM_DATA: FormData = {
    firstName: '',
    lastName: '',
    designation: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    website: '',
    summary: '',
    image: null,
    skillsRaw: '',
    experiences: [],
    educations: [],
    projects: [],
    achievements: [],
    customSections: []
};

interface Params extends Record<string, string | string[] | undefined> {
    templateId: string;
}

const ResumeBuilder = () => {
    const params = useParams<Params>();
    const templateId = params?.templateId || 'general';
    const router = useRouter();
    const searchParams = useSearchParams();
    const template = getTemplate(templateId);

    const [showSettings, setShowSettings] = useState(false);
    const [showResumeManager, setShowResumeManager] = useState(false);
    const { state: formData, setState: setFormData, undo, redo, canUndo, canRedo } = useUndoRedo(DEFAULT_FORM_DATA);
    const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
    const [currentResumeName, setCurrentResumeName] = useState<string>('');
    const [openSections, setOpenSections] = useState<OpenSections>({
        about: true,
        experience: false,
        education: false,
        projects: false,
        skills: false,
        achievements: false,
        custom: false
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<TouchedSections>({});
    const [savedStatus, setSavedStatus] = useState<string>(''); // '', 'saving', 'saved', 'error'
    const [importError, setImportError] = useState('');
    const [showLinkedInModal, setShowLinkedInModal] = useState(false);
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [showSpellCheck, setShowSpellCheck] = useState(false);
    const [showCustomizer, setShowCustomizer] = useState(false);
    const [showCoverLetter, setShowCoverLetter] = useState(false);
    const [showTranslate, setShowTranslate] = useState(false);
    const [showATSChecklist, setShowATSChecklist] = useState(false);
    const [showFeedbackInbox, setShowFeedbackInbox] = useState(false);
    const [showPDFImport, setShowPDFImport] = useState(false);
    const [showATSText, setShowATSText] = useState(false);
    const [estimatedPages, setEstimatedPages] = useState<number | null>(null);
    const [pageWarningDismissed, setPageWarningDismissed] = useState(false);
    const [previewZoom, setPreviewZoom] = useState<'fit' | '50' | '75' | '100'>('fit');
    const previewWrapRef = useRef<HTMLDivElement>(null);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    // Sync dismissal preference after mount (avoids SSR hydration mismatch from
    // reading localStorage during render) and reset it when switching templates.
    useEffect(() => {
        setPageWarningDismissed(isPageWarningDismissed(templateId));
    }, [templateId]);

    const handleDismissPageWarning = useCallback(() => {
        setPageWarningDismissed(true);
        setPageWarningDismissedPref(templateId, true);
    }, [templateId]);

    const handleRestorePageWarning = useCallback(() => {
        setPageWarningDismissed(false);
        setPageWarningDismissedPref(templateId, false);
    }, [templateId]);
    const [customization, setCustomization] = useState<TemplateCustomization>(DEFAULT_CUSTOMIZATION);
    const [showResumeDropdown, setShowResumeDropdown] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [resumeList, setResumeList] = useState<ResumeMeta[]>([]);
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    const [hasApiKey, setHasApiKey] = useState(false);
    useEffect(() => { setHasApiKey(checkApiKey()); }, []);
    const toastCtx = useToast();
    const { theme, toggleTheme } = useTheme();

    // Load resume on mount — prefer resume ID from URL, then active resume, then draft
    useEffect(() => {
        const resumeIdFromUrl = searchParams?.get('resume');

        if (resumeIdFromUrl) {
            const stored = getResumeById(resumeIdFromUrl);
            if (stored) {
                setFormData(prev => ({ ...DEFAULT_FORM_DATA, ...stored.formData }));
                setCurrentResumeId(stored.meta.id);
                setCurrentResumeName(stored.meta.name);
                setActiveResumeId(stored.meta.id);
                return;
            }
        }

        const activeId = getActiveResumeId();
        if (activeId) {
            const stored = getResumeById(activeId);
            if (stored && stored.meta.templateId === templateId) {
                setFormData(prev => ({ ...DEFAULT_FORM_DATA, ...stored.formData }));
                setCurrentResumeId(stored.meta.id);
                setCurrentResumeName(stored.meta.name);
                return;
            }
        }

        // Fall back to legacy draft
        const saved = loadDraft(templateId);
        if (saved) {
            setFormData(prev => ({ ...DEFAULT_FORM_DATA, ...saved }));
        }

        // Load template customization
        const savedCustom = getCustomization(templateId);
        const hasCustom = savedCustom.primaryColor || savedCustom.fontFamily ||
            savedCustom.fontSize !== 'medium' || savedCustom.spacing !== 'normal';
        if (hasCustom) {
            setCustomization(savedCustom);
        }
    }, [templateId, searchParams]);

    // Refresh resume dropdown list
    const refreshResumeList = useCallback(() => {
        setResumeList(getResumeIndex().filter(r => r.templateId === templateId));
    }, [templateId]);

    useEffect(() => {
        refreshResumeList();
    }, [refreshResumeList, formData]);

    // Keyboard shortcuts: Ctrl+Z = undo, Ctrl+Shift+Z = redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't interfere with text editing shortcuts
            const tag = (e.target as HTMLElement)?.tagName || '';
            const isInput = tag === 'INPUT' || tag === 'TEXTAREA';
            if (isInput && (e.ctrlKey || e.metaKey)) {
                // Allow native undo/redo in text fields — only intercept if modifier+shift+z
                if (e.key === 'z' && e.shiftKey) {
                    e.preventDefault();
                    redo();
                }
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    // One-Page Checker — measure the rendered preview height at fixed A4 width (794px @ 96dpi),
    // compared against A4 height (1123px @ 96dpi). Temporarily forcing the width keeps the
    // estimate accurate regardless of the fluid preview column width.
    useEffect(() => {
        const measure = () => {
            const wrap = previewWrapRef.current?.parentElement as HTMLElement | null;
            const el = previewWrapRef.current?.querySelector('#resume-preview') as HTMLElement | null;
            if (!el) return;
            // Reset zoom temporarily so the measurement is zoom-independent
            const originalZoom = wrap?.style.zoom || '';
            if (wrap) wrap.style.zoom = '1';
            const originalWidth = el.style.width;
            el.style.width = '794px'; // A4 width — measure at the real sheet size
            const h = el.scrollHeight;
            el.style.width = originalWidth;
            if (wrap) wrap.style.zoom = originalZoom;
            setEstimatedPages(h / 1123);
        };
        // Wait for render + fonts, then measure
        const timer = setTimeout(measure, 350);
        let ro: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined' && previewWrapRef.current) {
            ro = new ResizeObserver(measure);
            ro.observe(previewWrapRef.current);
        }
        return () => {
            clearTimeout(timer);
            ro?.disconnect();
        };
    }, [formData, templateId, customization, previewZoom]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowResumeDropdown(false);
            }
            if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
                setShowMoreMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Auto-save draft with debounce
    useEffect(() => {
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }

        // Skip save on initial empty state
        const hasData = Object.values(formData).some(v =>
            Array.isArray(v) ? v.length > 0 : (v && typeof v === 'string' ? v.trim() : v)
        );
        if (!hasData) return;

        setSavedStatus('saving');
        saveTimerRef.current = setTimeout(() => {
            let success = false;
            if (currentResumeId) {
                // Update existing resume
                const stored = getResumeById(currentResumeId);
                if (stored) {
                    success = saveResume(stored.meta, formData);
                }
            } else {
                // Fall back to legacy draft
                success = saveDraft(templateId, formData);
            }
            setSavedStatus(success ? 'saved' : 'error');
            setTimeout(() => setSavedStatus(''), 2000);
        }, 1000);

        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, [formData, templateId, currentResumeId]);

    const handleValidateAll = useCallback(() => {
        const allErrors = validateAllSections(formData);
        setErrors(allErrors);
        const touchedSections: TouchedSections = {};
        Object.keys(allErrors).forEach(s => { touchedSections[s] = true; });
        setTouched(prev => ({ ...prev, ...touchedSections }));

        if (hasErrors(allErrors)) {
            const sectionsToOpen: OpenSections = {};
            Object.keys(allErrors).forEach(s => { sectionsToOpen[s] = true; });
            setOpenSections(prev => ({ ...prev, ...sectionsToOpen }));
        }

        return !hasErrors(allErrors);
    }, [formData]);

    const handleSectionTouch = useCallback((section: string) => {
        if (!touched[section]) {
            const sectionErrors = validateSection(section, formData);
            setErrors(prev => ({
                ...prev,
                [section]: sectionErrors
            }));
            setTouched(prev => ({
                ...prev,
                [section]: true
            }));
        }
    }, [formData, touched]);

    const handleExportJSON = () => {
        exportResumeAsJSON(formData);
        toastCtx.success('Resume exported as JSON');
    };

    const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImportError('');
        importResumeFromJSON(file)
            .then(data => {
                setFormData(prev => ({ ...DEFAULT_FORM_DATA, ...data }));
                if (fileInputRef.current) fileInputRef.current.value = '';
                toastCtx.success('Resume imported from JSON');
            })
            .catch((err: Error) => {
                setImportError(err.message);
                if (fileInputRef.current) fileInputRef.current.value = '';
                toastCtx.error(err.message);
            });
    };

    const handleLinkedInImport = useCallback((imported: Partial<FormData>) => {
        setFormData(prev => {
            const merged = { ...DEFAULT_FORM_DATA, ...prev };
            (Object.keys(imported) as (keyof FormData)[]).forEach(key => {
                const val = imported[key];
                if (val !== null && val !== undefined && val !== '') {
                    if (Array.isArray(val) && val.length > 0) {
                        (merged as any)[key] = val;
                    } else if (!Array.isArray(val)) {
                        (merged as any)[key] = val;
                    }
                }
            });
            return merged;
        });
    }, []);

    const handleClearDraft = () => {
        // Just reset form state — don't save empty data to localStorage
        // Auto-save won't fire since hasData check returns false for empty form
        if (!currentResumeId) {
            clearDraft(templateId);
        }
        setFormData(DEFAULT_FORM_DATA);
        setErrors({});
        setTouched({});
        setSavedStatus('');
    };

    const handleSwitchResume = (resume: ResumeMeta) => {
        setShowResumeDropdown(false);
        setActiveResumeId(resume.id);
        router.push(`/builder/${resume.templateId}?resume=${resume.id}`);
    };

    const handleCreateNewInBuilder = () => {
        setShowResumeDropdown(false);
        const resume = createResume(`${template.name} Resume`, templateId);
        setActiveResumeId(resume.meta.id);
        router.push(`/builder/${templateId}?resume=${resume.meta.id}`);
    };

    const handleRenameStart = () => {
        if (!currentResumeId) return;
        setIsRenaming(true);
        setRenameValue(currentResumeName);
    };

    const handleRenameConfirm = () => {
        if (currentResumeId && renameValue.trim()) {
            renameResume(currentResumeId, renameValue.trim());
            setCurrentResumeName(renameValue.trim());
        }
        setIsRenaming(false);
    };

    const handleDuplicateCurrent = () => {
        if (!currentResumeId) return;
        const dup = duplicateResume(currentResumeId);
        if (dup) {
            setActiveResumeId(dup.meta.id);
            router.push(`/builder/${dup.meta.templateId}?resume=${dup.meta.id}`);
        }
    };

    return (
        <motion.div
            className="builder"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Navbar */}
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-inner">
                        <div className="navbar-brand" onClick={() => router.push('/')}>
                            <Sparkles color="var(--secondary)" size={24} />
                            <span className="navbar-brand-text gradient-text">ResuCraft</span>
                        </div>

                        <div className="navbar-actions" style={{ gap: '6px' }}>
                            {/* Resume selector dropdown (ALWAYS VISIBLE) */}
                            <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => { refreshResumeList(); setShowResumeDropdown(!showResumeDropdown); }}
                                    title="Switch resume"
                                    style={{
                                        maxWidth: '160px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '0.7rem',
                                        padding: '0.35rem 0.6rem'
                                    }}
                                >
                                    <Files size={13} />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>
                                        {currentResumeName || `${template.name} Draft`}
                                    </span>
                                    <ChevronDown size={10} />
                                </button>

                                {showResumeDropdown && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        marginTop: '4px',
                                        minWidth: '260px',
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-sm)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                        zIndex: 100,
                                        overflow: 'hidden'
                                    }}>
                                        {currentResumeId && (
                                            <div style={{
                                                padding: '0.5rem 0.75rem',
                                                borderBottom: '1px solid var(--border)',
                                                background: 'rgba(245, 158, 11, 0.05)'
                                            }}>
                                                {isRenaming ? (
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        <input
                                                            type="text"
                                                            value={renameValue}
                                                            onChange={e => setRenameValue(e.target.value)}
                                                            onKeyDown={e => { if (e.key === 'Enter') handleRenameConfirm(); if (e.key === 'Escape') setIsRenaming(false); }}
                                                            onBlur={handleRenameConfirm}
                                                            autoFocus
                                                            style={{
                                                                flex: 1,
                                                                padding: '0.25rem 0.5rem',
                                                                background: 'var(--bg)',
                                                                border: '1px solid var(--secondary)',
                                                                borderRadius: '4px',
                                                                color: 'var(--text)',
                                                                fontSize: '0.8rem',
                                                                outline: 'none'
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: '2px' }}>Current Resume</div>
                                                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentResumeName}</div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '2px' }}>
                                                            <button className="btn btn-ghost btn-sm" onClick={handleRenameStart} title="Rename" style={{ padding: '0.25rem' }}>
                                                                <Edit3 size={12} />
                                                            </button>
                                                            <button className="btn btn-ghost btn-sm" onClick={handleDuplicateCurrent} title="Duplicate" style={{ padding: '0.25rem' }}>
                                                                <Copy size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {resumeList.length === 0 ? (
                                                <div style={{ padding: '1rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                                                    No saved resumes yet
                                                </div>
                                            ) : (
                                                resumeList.map(r => (
                                                    <div
                                                        key={r.id}
                                                        style={{
                                                            padding: '0.5rem 0.75rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            background: r.id === currentResumeId ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                                                            borderBottom: '1px solid var(--border)',
                                                            transition: 'background 0.1s'
                                                        }}
                                                        onClick={() => handleSwitchResume(r)}
                                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = r.id === currentResumeId ? 'rgba(245, 158, 11, 0.08)' : 'transparent'; }}
                                                    >
                                                        <Files size={12} color="var(--text-dim)" />
                                                        <span style={{ fontSize: '0.8rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {r.name}
                                                        </span>
                                                        {r.id === currentResumeId && (
                                                            <Check size={10} color="var(--secondary)" />
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div style={{
                                            padding: '0.5rem 0.75rem',
                                            borderTop: '1px solid var(--border)',
                                            display: 'flex', flexDirection: 'column', gap: '4px'
                                        }}>
                                            <button className="btn btn-ghost btn-sm" onClick={handleCreateNewInBuilder} style={{ justifyContent: 'flex-start', width: '100%' }}>
                                                <Plus size={12} /> New Resume
                                            </button>
                                            <button className="btn btn-ghost btn-sm" onClick={() => { setShowResumeDropdown(false); setShowResumeManager(true); }} style={{ justifyContent: 'flex-start', width: '100%' }}>
                                                <Files size={12} /> Manage All Resumes
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Save status (auto-shown) */}
                            {savedStatus && (
                                <span style={{
                                    fontSize: '0.6rem',
                                    color: savedStatus === 'saved' ? 'var(--success)' :
                                           savedStatus === 'saving' ? 'var(--text-muted)' :
                                           savedStatus === 'error' ? 'var(--danger)' : 'var(--text-dim)',
                                    display: 'flex', alignItems: 'center', gap: '3px',
                                    padding: '0.2rem 0.4rem',
                                    background: savedStatus === 'saved' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                    borderRadius: '4px', flexShrink: 0
                                }}>
                                    <Save size={9} />
                                    {savedStatus === 'saving' ? 'Saving...' :
                                     savedStatus === 'saved' ? 'Saved' : 'Failed'}
                                </span>
                            )}

                            {/* Theme toggle */}
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={toggleTheme}
                                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                                style={{ padding: '0.35rem', flexShrink: 0, color: 'var(--text-muted)' }}
                            >
                                {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
                            </button>

                            {/* Undo / Redo (ALWAYS VISIBLE) */}
                            <button className="btn btn-ghost btn-sm" onClick={undo} disabled={!canUndo}
                                title="Undo (Ctrl+Z)"
                                style={{ opacity: canUndo ? 1 : 0.3, cursor: canUndo ? 'pointer' : 'not-allowed', padding: '0.35rem', flexShrink: 0 }}>
                                <Undo2 size={13} />
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={redo} disabled={!canRedo}
                                title="Redo (Ctrl+Shift+Z)"
                                style={{ opacity: canRedo ? 1 : 0.3, cursor: canRedo ? 'pointer' : 'not-allowed', padding: '0.35rem', flexShrink: 0 }}>
                                <Redo2 size={13} />
                            </button>

                            {/* AI Status + Settings (ALWAYS VISIBLE) */}
                            <div className={`status-badge ${hasApiKey ? 'online' : 'offline'}`} style={{ flexShrink: 0, fontSize: '0.6rem', padding: '0.2rem 0.5rem' }}>
                                {hasApiKey ? <ShieldCheck size={10} /> : <AlertCircle size={10} />}
                                <span style={{ fontSize: '0.6rem' }}>{hasApiKey ? 'Ready' : 'Offline'}</span>
                            </div>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setShowSettings(true)}
                                title="Configure AI settings"
                                style={{ padding: '0.35rem', flexShrink: 0, color: 'var(--secondary)' }}
                            >
                                <Settings size={14} />
                            </button>

                            {/* Export buttons (ALWAYS VISIBLE) */}
                            <PDFExportButton formData={formData} templateName={template.name} />
                            <DOCXExportButton formData={formData} templateName={template.name} />
                            {/* Print / Save as PDF */}
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={handlePrint}
                                title="Print or save as PDF"
                                style={{ padding: '0.35rem 0.5rem', flexShrink: 0 }}
                            >
                                <FileText size={14} />
                            </button>

                            {/* Hidden file input for JSON import */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleImportJSON}
                                style={{ display: 'none' }}
                            />

                            {/* ⚡ MORE DROPDOWN (collapsible secondary actions) */}
                            <div ref={moreMenuRef} style={{ position: 'relative', flexShrink: 0 }}>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                                    title="More actions"
                                    style={{ padding: '0.35rem 0.5rem' }}
                                >
                                    <MoreHorizontal size={16} />
                                </button>

                                {showMoreMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '4px',
                                        minWidth: '200px',
                                        background: 'var(--bg-dropdown)',
                                        border: '1px solid rgba(245, 158, 11, 0.15)',
                                        borderRadius: 'var(--radius-sm)',
                                        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                                        zIndex: 200,
                                        overflow: 'hidden',
                                        padding: '4px'
                                    }}>
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); router.push('/templates'); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                                                            <ArrowLeft size={13} /> Templates
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); setShowLinkedInModal(true); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem', color: '#0a66c2' }}>
                                                            <Linkedin size={13} /> LinkedIn Import
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); setShowPDFImport(true); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem', color: '#ef4444' }}>
                                                            <Upload size={13} /> Import PDF
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); setShowATSText(true); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem', color: '#10b981' }}>
                                                            <Copy size={13} /> Copy as Text (ATS)
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); fileInputRef.current?.click(); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                                                            <Upload size={13} /> Import JSON
                                                        </button>                                                            <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); handleExportJSON(); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                                                            <Save size={13} /> Export JSON
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); setShowOnboarding(true); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem', color: 'var(--secondary)' }}>
                                                            <Sparkles size={13} /> Restart Tutorial
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); setShowFeedbackInbox(true); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem', color: 'var(--secondary)' }}>
                                                            <HelpCircle size={13} /> Feedback Inbox
                                                        </button>
                                                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '2px 0' }} />
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); handleValidateAll(); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                                                            <ShieldCheck size={13} /> Validate
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => {
                                                                setShowMoreMenu(false);
                                                                if (pageWarningDismissed) {
                                                                    handleRestorePageWarning();
                                                                } else {
                                                                    handleDismissPageWarning();
                                                                }
                                                            }}
                                                            title={pageWarningDismissed ? 'Show the one-page warning again' : 'Hide the one-page warning'}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                                                            <ShieldCheck size={13} />
                                                            <span style={{ flex: 1 }}>One-Page Warning</span>
                                                            <Check size={12} color={pageWarningDismissed ? 'var(--text-dim)' : 'var(--success)'} />
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); setShowSpellCheck(true); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                                                            <BookOpen size={13} /> Spell Check
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); setShowCustomizer(true); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                                                            <PaintBucket size={13} /> Customize
                                                        </button>                                                            <button className="btn btn-ghost btn-sm"
                                                                onClick={() => { setShowMoreMenu(false); setShowCoverLetter(true); }}
                                                                style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem', color: 'var(--accent)' }}>
                                                                <FileText size={13} /> Cover Letter
                                                            </button>
                                                            <button className="btn btn-ghost btn-sm"
                                                                onClick={() => { setShowMoreMenu(false); setShowTranslate(true); }}
                                                                style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem', color: 'var(--accent)' }}>
                                                                <Globe size={13} /> Translate
                                                            </button>
                                                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '2px 0' }} />
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); setShowATSChecklist(true); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem', color: '#10b981' }}>
                                                            <Shield size={13} /> ATS Checklist
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); setShowScoreModal(true); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                                                            <TrendingUp size={13} /> Score
                                                        </button>
                                                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '2px 0' }} />
                                                        <button className="btn btn-ghost btn-sm"
                                                            onClick={() => { setShowMoreMenu(false); handleClearDraft(); }}
                                                            style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem', color: 'var(--danger)' }}>
                                                            <Trash2 size={13} /> Clear Resume
                                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Import error */}
            {importError && (
                <div style={{
                    maxWidth: '1600px',
                    margin: '5rem auto 0',
                    padding: '0 2rem',
                    width: '100%'
                }}>
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.75rem 1rem',
                        fontSize: '0.8rem',
                        color: 'var(--text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <AlertCircle size={14} color="var(--danger)" />
                        {importError}
                        <button
                            onClick={() => setImportError('')}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Builder Content */}
            <div className="builder-content">
                {/* Left: Form + AI */}
                <div className="builder-left no-print">
                    <ResumeForm
                        formData={formData}
                        setFormData={setFormData}
                        openSections={openSections}
                        setOpenSections={setOpenSections}
                        errors={errors}
                        touched={touched}
                        onSectionTouch={handleSectionTouch}
                        industry={template.industry}
                    />
                    <AIPanel
                        formData={formData}
                        setFormData={setFormData}
                        industry={template.industry}
                        onOpenSettings={() => setShowSettings(true)}
                    />
                </div>

                {/* Right: Preview */}
                <div className="builder-right">
                    {/* One-Page Checker chip (dismissible — some resumes are meant to be longer) */}
                    {estimatedPages !== null && !(estimatedPages > 1.1 && pageWarningDismissed) && (
                        <div className="no-print" style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '0.45rem 0.85rem',
                            marginBottom: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.72rem', fontWeight: 600,
                            border: `1px solid ${estimatedPages > 1.1 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.25)'}`,
                            background: estimatedPages > 1.1 ? 'rgba(245, 158, 11, 0.06)' : 'rgba(16, 185, 129, 0.05)',
                            color: estimatedPages > 1.1 ? 'var(--secondary)' : 'var(--success)'
                        }}>
                            {estimatedPages > 1.1 ? (
                                <>
                                    <AlertCircle size={13} />
                                    <span style={{ flex: 1 }}>
                                        ~{estimatedPages.toFixed(1)} pages — recruiters prefer one. Try trimming bullets or using Compact spacing in Customize.
                                    </span>
                                    <button
                                        onClick={handleDismissPageWarning}
                                        title="Ignore — my resume is meant to be this long"
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: 'inherit', opacity: 0.6, padding: '2px',
                                            display: 'flex', alignItems: 'center',
                                            transition: 'opacity 0.15s'
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.6'; }}
                                    >
                                        <X size={13} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={13} />
                                    <span>Fits on 1 page ✓</span>
                                </>
                            )}
                        </div>
                    )}
                    {/* Zoom toolbar */}
                    <div className="preview-toolbar">
                        <span className="preview-toolbar-label"><Search size={11} /> Zoom</span>
                        <div className="preview-zoom-controls">
                            {(['fit', '50', '75', '100'] as const).map(z => (
                                <button
                                    key={z}
                                    className={`preview-zoom-btn${previewZoom === z ? ' active' : ''}`}
                                    onClick={() => setPreviewZoom(z)}
                                    title={z === 'fit' ? 'Fit to column width' : `Zoom to ${z}%`}
                                >
                                    {z === 'fit' ? <Maximize2 size={11} /> : `${z}%`}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div
                        className="preview-zoom-wrap"
                        style={previewZoom !== 'fit' ? { zoom: parseInt(previewZoom, 10) / 100 } : undefined}
                    >
                        <div ref={previewWrapRef}>
                            <ResumePreview formData={formData} templateId={templateId} customization={customization} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

            {/* LinkedIn Import Modal */}
            <LinkedInImportModal
                isOpen={showLinkedInModal}
                onClose={() => setShowLinkedInModal(false)}
                onImport={handleLinkedInImport}
            />

            {/* PDF Import Modal */}
            <PDFImportModal
                isOpen={showPDFImport}
                onClose={() => setShowPDFImport(false)}
                onImport={handleLinkedInImport}
            />

            {/* ATS Text Modal */}
            <ATSTextModal
                isOpen={showATSText}
                onClose={() => setShowATSText(false)}
                formData={formData}
            />

            {/* Resume Score Modal */}
            <ResumeScoreModal
                isOpen={showScoreModal}
                onClose={() => setShowScoreModal(false)}
                formData={formData}
            />

            {/* Spell & Grammar Check Modal */}
            <SpellCheckModal
                isOpen={showSpellCheck}
                onClose={() => setShowSpellCheck(false)}
                formData={formData}
            />

            {/* Cover Letter Builder */}
            <CoverLetterBuilder
                isOpen={showCoverLetter}
                onClose={() => setShowCoverLetter(false)}
                formData={formData}
                industry={template.industry}
                onOpenSettings={() => setShowSettings(true)}
            />

            {/* Translate Modal */}
            <TranslateModal
                isOpen={showTranslate}
                onClose={() => setShowTranslate(false)}
                formData={formData}
                setFormData={setFormData}
                industry={template.industry}
                onOpenSettings={() => setShowSettings(true)}
            />

            {/* ATS Checklist Modal */}
            <ATSChecklistModal
                isOpen={showATSChecklist}
                onClose={() => setShowATSChecklist(false)}
            />

            {/* Template Customizer Modal */}
            <TemplateCustomizerModal
                isOpen={showCustomizer}
                onClose={() => setShowCustomizer(false)}
                templateId={templateId}
                current={customization}
                onApply={(c) => setCustomization(c)}
            />

            {/* Resume Manager Modal */}
            <ResumeManager
                isOpen={showResumeManager}
                onClose={() => setShowResumeManager(false)}
            />

            {/* Feedback Inbox */}
            <FeedbackInbox isOpen={showFeedbackInbox} onClose={() => setShowFeedbackInbox(false)} />

            {/* First-run onboarding */}
            <Onboarding forceShow={showOnboarding} onComplete={() => setShowOnboarding(false)} />
        </motion.div>
    );
};

export default ResumeBuilder;
