import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import {
    User, Briefcase, GraduationCap, FolderKanban, Award, Wrench, List,
    ChevronDown, ChevronUp, Plus, X, Image as ImageIcon, AlertCircle, Sparkles, GripVertical, Check
} from 'lucide-react';
import { FormData, OpenSections, ValidationErrors, TouchedSections, WritingStyle } from '../types';
import { getSavedStyle } from '../services/prompts';
import {
    checkApiKey,
    generateSummary,
    generateExperienceEntries,
    generateEducationEntries,
    generateProjectEntries,
    generateAchievementEntries,
    generateSkills,
    generateFallbackSummary,
    generateFallbackExperienceEntries,
    generateFallbackEducationEntries,
    generateFallbackProjectEntries,
    generateFallbackAchievementEntries,
    generateFallbackSkills,
    parseExperienceEntries,
    parseEducationEntries,
    parseProjectEntries,
    parseAchievementEntries
} from '../services/ai';
import RoleSelector from './RoleSelector';
import { RoleConfig } from '../data/roleData';

interface SectionConfig {
    id: string;
    title: string;
    icon: React.ReactElement;
    defaultOpen: boolean;
}

const sectionConfig: SectionConfig[] = [
    { id: 'about', title: 'About', icon: <User size={16} />, defaultOpen: true },
    { id: 'experience', title: 'Experience', icon: <Briefcase size={16} />, defaultOpen: false },
    { id: 'education', title: 'Education', icon: <GraduationCap size={16} />, defaultOpen: false },
    { id: 'projects', title: 'Projects', icon: <FolderKanban size={16} />, defaultOpen: false },
    { id: 'skills', title: 'Skills', icon: <Wrench size={16} />, defaultOpen: false },
    { id: 'achievements', title: 'Achievements', icon: <Award size={16} />, defaultOpen: false },
    { id: 'custom', title: 'Custom Sections', icon: <List size={16} />, defaultOpen: false },
];

interface FormInputProps {
    label: string;
    error: string | null;
    touched: boolean | undefined;
    inputId?: string;
    children: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, touched, inputId, children }) => {
    const showError = touched && error;
    return (
        <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }} htmlFor={inputId}>
                {label}
                {showError && <AlertCircle size={10} color="var(--danger)" />}
            </label>
            {children}
            {showError && (
                <span
                    role="alert"
                    style={{
                        fontSize: '0.72rem',
                        color: 'var(--danger)',
                        marginTop: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                    }}
                >
                    <AlertCircle size={10} /> {error}
                </span>
            )}
        </div>
    );
};

interface ResumeFormProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    openSections: OpenSections;
    setOpenSections: React.Dispatch<React.SetStateAction<OpenSections>>;
    errors?: ValidationErrors;
    touched?: TouchedSections;
    onSectionTouch?: (section: string) => void;
    industry?: string;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ formData, setFormData, openSections, setOpenSections, errors = {}, touched = {}, onSectionTouch, industry = '' }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageError, setImageError] = useState('');
    const [writeLoading, setWriteLoading] = useState<string | null>(null);
    const [writeError, setWriteError] = useState('');
    const [quickFillLoading, setQuickFillLoading] = useState(false);
    const [hasApiKey, setHasApiKey] = useState(false);
    const [writingStyle, setWritingStyle] = useState<WritingStyle>('professional');
    useEffect(() => {
        setHasApiKey(checkApiKey());
        setWritingStyle(getSavedStyle());
    }, []);

    const generateForSection = useCallback(async (sectionId: string) => {
        setWriteLoading(sectionId);
        setWriteError('');

        try {
            switch (sectionId) {
                case 'about': {
                    // Generate summary
                    let summary = '';
                    if (hasApiKey) {
                        summary = await generateSummary({
                            name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
                            role: formData.designation || '',
                            experience: (formData.experiences || []).map(e => `${e.title} at ${e.company}: ${e.description}`).join('. '),
                            skills: formData.skillsRaw || '',
                            industry
                        }, writingStyle);
                    } else {
                        summary = generateFallbackSummary({
                            name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
                            role: formData.designation || '',
                            experience: '',
                            skills: '',
                            industry
                        }, writingStyle);
                    }
                    setFormData(prev => ({ ...prev, summary }));
                    break;
                }
                case 'experience': {
                    let raw = '';
                    if (hasApiKey) {
                        raw = await generateExperienceEntries(
                            formData.designation || 'Professional',
                            industry,
                            writingStyle
                        );
                    } else {
                        raw = generateFallbackExperienceEntries(
                            formData.designation || 'Professional',
                            industry
                        );
                    }
                    const entries = parseExperienceEntries(raw);
                    if (entries.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            experiences: entries.map(e => ({ ...e, id: Date.now() + Math.random() * 1000 }))
                        }));
                    }
                    break;
                }
                case 'education': {
                    let raw = '';
                    if (hasApiKey) {
                        raw = await generateEducationEntries(
                            formData.designation || 'Professional',
                            industry,
                            writingStyle
                        );
                    } else {
                        raw = generateFallbackEducationEntries(
                            formData.designation || 'Professional',
                            industry
                        );
                    }
                    const entries = parseEducationEntries(raw);
                    if (entries.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            educations: entries.map(e => ({ ...e, id: Date.now() + Math.random() * 1000 }))
                        }));
                    }
                    break;
                }
                case 'skills': {
                    let skills = '';
                    if (hasApiKey) {
                        skills = await generateSkills({
                            role: formData.designation || '',
                            rawSkills: formData.skillsRaw || '',
                            industry
                        }, writingStyle);
                    } else {
                        skills = generateFallbackSkills({
                            role: formData.designation || '',
                            rawSkills: formData.skillsRaw || '',
                            industry
                        });
                    }
                    setFormData(prev => ({ ...prev, skillsRaw: skills }));
                    break;
                }
                case 'projects': {
                    let raw = '';
                    if (hasApiKey) {
                        raw = await generateProjectEntries(
                            formData.designation || 'Professional',
                            industry,
                            formData.skillsRaw || '',
                            writingStyle
                        );
                    } else {
                        raw = generateFallbackProjectEntries(
                            formData.designation || 'Professional',
                            industry,
                            formData.skillsRaw || ''
                        );
                    }
                    const entries = parseProjectEntries(raw);
                    if (entries.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            projects: entries.map(e => ({ ...e, id: Date.now() + Math.random() * 1000 }))
                        }));
                    }
                    break;
                }
                case 'achievements': {
                    let raw = '';
                    if (hasApiKey) {
                        raw = await generateAchievementEntries(
                            formData.designation || 'Professional',
                            industry,
                            writingStyle
                        );
                    } else {
                        raw = generateFallbackAchievementEntries();
                    }
                    const entries = parseAchievementEntries(raw);
                    if (entries.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            achievements: entries.map(e => ({ ...e, id: Date.now() + Math.random() * 1000 }))
                        }));
                    }
                    break;
                }
            }
        } catch (err) {
            console.error(`Write for Me (${sectionId}) failed:`, err);
            setWriteError(`AI generation failed for this section. Please try again or fill it manually.`);
        } finally {
            setWriteLoading(null);
            setTimeout(() => setWriteError(''), 4000);
        }
    }, [formData, setFormData, industry, writingStyle, hasApiKey]);

    // Compute completion percentage
    const completion = useMemo(() => {
        let filled = 0;
        let total = 8; // core fields: name, email, phone, designation, summary, skills, experiences, education
        if (formData.firstName?.trim() || formData.lastName?.trim()) filled++;
        if (formData.email?.trim()) filled++;
        if (formData.phone?.trim()) filled++;
        if (formData.designation?.trim()) filled++;
        if (formData.summary?.trim()) filled++;
        if (formData.skillsRaw?.trim()) filled++;
        if (formData.experiences?.length > 0) filled++;
        if (formData.educations?.length > 0) filled++;
        return Math.round((filled / total) * 100);
    }, [formData]);

    const getCompletionColor = (pct: number): string => {
        if (pct >= 80) return 'var(--success)';
        if (pct >= 40) return 'var(--secondary)';
        return 'var(--text-dim)';
    };

    const toggleSection = useCallback((sectionId: string) => {
        setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
        if (onSectionTouch) onSectionTouch(sectionId);
    }, [setOpenSections, onSectionTouch]);

    const handleChange = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, [setFormData]);

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setImageError('Image must be under 5MB');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setImageError('Only JPEG, PNG, WebP, and GIF images are allowed');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setImageError('');
        const reader = new FileReader();
        reader.onloadend = () => {
            handleChange('image', reader.result as string);
        };
        reader.readAsDataURL(file);
    }, [handleChange]);

    // Reorder helper for drag & drop
    const reorderRepeaterItems = useCallback((field: string, reordered: any[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: reordered
        }));
    }, [setFormData]);

    // Repeater helpers
    const addRepeaterItem = useCallback((field: string, template: Record<string, any>) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field as keyof FormData] as any[] || []), { ...template, id: Date.now() }]
        }));
    }, [setFormData]);

    const removeRepeaterItem = useCallback((field: string, id: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field as keyof FormData] as any[]).filter((item: any) => item.id !== id)
        }));
    }, [setFormData]);

    const updateRepeaterItem = useCallback((field: string, id: number, key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field as keyof FormData] as any[]).map((item: any) =>
                item.id === id ? { ...item, [key]: value } : item
            )
        }));
    }, [setFormData]);

    const updateCustomSectionItems = useCallback((id: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            customSections: (prev.customSections || []).map(s =>
                s.id === id ? { ...s, items: value.split('\n') } : s
            )
        }));
    }, [setFormData]);

    // Completion status for each section — feeds the header badge (done / partial / empty)
    const getSectionStatus = useCallback((sectionId: string): 'done' | 'partial' | 'empty' => {
        const f = formData;
        switch (sectionId) {
            case 'about': {
                const filled = [f.firstName, f.lastName, f.designation, f.email, f.phone, f.summary]
                    .filter(v => v && v.trim()).length;
                if (filled >= 4) return 'done';
                if (filled > 0) return 'partial';
                return 'empty';
            }
            case 'experience': return f.experiences?.length ? 'done' : 'empty';
            case 'education': return f.educations?.length ? 'done' : 'empty';
            case 'projects': return f.projects?.length ? 'done' : 'empty';
            case 'achievements': return f.achievements?.length ? 'done' : 'empty';
            case 'skills': return f.skillsRaw?.trim() ? 'done' : 'empty';
            case 'custom': return f.customSections?.length ? 'done' : 'empty';
            default: return 'empty';
        }
    }, [formData]);

    const renderSection = (section: SectionConfig) => {
        const isOpen = openSections[section.id];
        const sectionStatus = getSectionStatus(section.id);
        const hasSectionError = touched[section.id] && errors[section.id] && Object.keys(errors[section.id]).length > 0;
        const isLoading = writeLoading === section.id;

        return (
            <div key={section.id} className={`form-section ${isOpen ? 'open' : ''}`}>
                <div
                    className="form-section-header"
                    onClick={() => toggleSection(section.id)}
                    style={hasSectionError ? { borderLeft: '2px solid var(--danger)' } : {}}
                >
                    <div className="form-section-title">
                        <span
                            className={`section-complete ${sectionStatus}`}
                            title={
                                sectionStatus === 'done' ? 'Section complete' :
                                sectionStatus === 'partial' ? 'Partially filled' :
                                'Empty section'
                            }
                        >
                            {sectionStatus === 'done' && <Check size={11} />}
                        </span>
                        {section.icon}
                        {section.title}
                        {hasSectionError && <AlertCircle size={12} color="var(--danger)" />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {section.id !== 'custom' && (
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={e => { e.stopPropagation(); generateForSection(section.id); }}
                                disabled={isLoading}
                                title={`AI-generate ${section.title.toLowerCase()} content`}
                                style={{
                                    padding: '0.25rem 0.4rem',
                                    fontSize: '0.6rem',
                                    color: 'var(--accent)',
                                    opacity: isLoading ? 0.5 : 0.7,
                                    transition: 'all 0.2s',
                                    textTransform: 'none',
                                    letterSpacing: 'normal',
                                    fontWeight: 500
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.7'; }}
                            >
                                {isLoading ? (
                                    <span className="spinner" style={{ width: '12px', height: '12px', borderWidth: '1.5px' }} />
                                ) : (
                                    <Sparkles size={12} />
                                )}
                                <span style={{ marginLeft: '2px' }}>{isLoading ? 'Writing...' : 'Write for Me'}</span>
                            </button>
                        )}
                        {isOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                    </div>
                </div>

                {isOpen && (
                    <div className="form-section-content">
                        {section.id === 'about' && renderAboutSection()}
                        {section.id === 'experience' && renderExperienceSection()}
                        {section.id === 'education' && renderEducationSection()}
                        {section.id === 'projects' && renderProjectsSection()}
                        {section.id === 'skills' && renderSkillsSection()}
                        {section.id === 'achievements' && renderAchievementsSection()}
                        {section.id === 'custom' && renderCustomSection()}
                        {writeError && (
                            <div style={{
                                padding: '0.4rem 0.6rem',
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <AlertCircle size={10} color="var(--danger)" />
                                {writeError}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const handleSelectRole = useCallback((role: RoleConfig) => {
        // Set the designation, roleId, and pre-fill skills
        setFormData(prev => ({
            ...prev,
            designation: role.title,
            roleId: role.id,
            skillsRaw: prev.skillsRaw?.trim()
                ? prev.skillsRaw  // Don't overwrite if user already added skills
                : role.skills.join(', ')
        }));
    }, [setFormData]);

    const handleQuickFill = useCallback(async (role: RoleConfig) => {
        setQuickFillLoading(true);
        setWriteError('');

        try {
            // 1. Set designation + skills first
            const skillsText = role.skills.join(', ');

            // 2. Generate summary
            const summaryText = role.summaryTemplate;

            // 3. Generate experience entries (2 entries using fallback)
            const rawExp = generateFallbackExperienceEntries(role.title, industry);
            const expEntries = parseExperienceEntries(rawExp).map(e => ({
                ...e,
                id: Date.now() + Math.random() * 1000
            }));

            // 4. Generate education entry
            const rawEdu = `SCHOOL: Example University\nDEGREE: ${role.sampleEducation}\nCITY: City, State\nSTART: ${new Date().getFullYear() - 6}-09\nEND: ${new Date().getFullYear() - 2}-06\nDESCRIPTION: Relevant coursework and projects. Dean's List. Graduated with honors.`;
            const eduEntries = parseEducationEntries(rawEdu).map(e => ({
                ...e,
                id: Date.now() + Math.random() * 1000 + 100
            }));

            // Apply all at once
            setFormData(prev => ({
                ...prev,
                designation: role.title,
                roleId: role.id,
                skillsRaw: skillsText,
                summary: summaryText,
                experiences: expEntries,
                educations: eduEntries
            }));
        } catch (err) {
            console.error('Quick Fill failed:', err);
            setWriteError('Quick fill encountered an issue. Some fields may not have been filled.');
            setTimeout(() => setWriteError(''), 4000);
        } finally {
            setQuickFillLoading(false);
        }
    }, [setFormData, industry]);

    const renderAboutSection = () => {
        const isTouched = touched.about;
        const secErrors = errors.about || {};
        return (
            <>
                {/* Role Selector — shown at top of About section */}
                <RoleSelector
                    industry={industry}
                    currentDesignation={formData.designation || ''}
                    onSelectRole={handleSelectRole}
                    onQuickFill={handleQuickFill}
                    quickFillLoading={quickFillLoading}
                />
                <div className="form-row">
                    <FormInput label="First Name" error={secErrors.firstName} touched={isTouched} inputId="firstName">
                        <input
                            id="firstName"
                            name="firstName"
                            className={`form-input${secErrors.firstName && isTouched ? ' input-error' : ''}`}
                            placeholder="e.g. John"
                            value={formData.firstName || ''}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                        />
                    </FormInput>
                    <FormInput label="Last Name" error={secErrors.lastName} touched={isTouched} inputId="lastName">
                        <input
                            id="lastName"
                            name="lastName"
                            className={`form-input${secErrors.lastName && isTouched ? ' input-error' : ''}`}
                            placeholder="e.g. Doe"
                            value={formData.lastName || ''}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                        />
                    </FormInput>
                </div>
                <div className="form-row">
                    <FormInput label="Designation / Role" error={secErrors.designation} touched={isTouched} inputId="designation">
                        <input
                            id="designation"
                            name="designation"
                            className={`form-input${secErrors.designation && isTouched ? ' input-error' : ''}`}
                            placeholder="e.g. Senior Software Engineer"
                            value={formData.designation || ''}
                            onChange={(e) => handleChange('designation', e.target.value)}
                        />
                    </FormInput>
                    <div className="form-group">
                        <label className="form-label" htmlFor="profilePhoto">Profile Photo</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                ref={fileInputRef}
                                id="profilePhoto"
                                name="profilePhoto"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleImageUpload}
                                className="form-input"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <ImageIcon size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                        </div>
                        {imageError && (
                            <span style={{
                                fontSize: '0.65rem',
                                color: 'var(--danger)',
                                marginTop: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px'
                            }}>
                                <AlertCircle size={10} /> {imageError}
                            </span>
                        )}
                    </div>
                </div>
                <div className="form-row">
                    <FormInput label="Email" error={secErrors.email} touched={isTouched} inputId="email">
                        <input
                            id="email"
                            name="email"
                            className={`form-input${secErrors.email && isTouched ? ' input-error' : ''}`}
                            type="email"
                            placeholder="e.g. john@example.com"
                            value={formData.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </FormInput>
                    <FormInput label="Phone" error={secErrors.phone} touched={isTouched} inputId="phone">
                        <input
                            id="phone"
                            name="phone"
                            className={`form-input${secErrors.phone && isTouched ? ' input-error' : ''}`}
                            placeholder="e.g. +1 (555) 123-4567"
                            value={formData.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </FormInput>
                </div>
                <FormInput label="Address" error={null} touched={false} inputId="address">
                    <input
                        id="address"
                        name="address"
                        className="form-input"
                        placeholder="e.g. San Francisco, CA"
                        value={formData.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                    />
                </FormInput>
                {/* Professional Links */}
                <div style={{ marginTop: '0.75rem' }}>
                    <div style={{
                        fontSize: '0.68rem', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '1px',
                        marginBottom: '0.5rem'
                    }}>
                        Professional Links (optional)
                    </div>
                    <div className="form-row">
                        <FormInput label="LinkedIn" error={null} touched={false} inputId="linkedin">
                            <input
                                id="linkedin"
                                name="linkedin"
                                className="form-input"
                                placeholder="linkedin.com/in/yourname"
                                value={formData.linkedin || ''}
                                onChange={(e) => handleChange('linkedin', e.target.value)}
                            />
                        </FormInput>
                        <FormInput label="GitHub" error={null} touched={false} inputId="github">
                            <input
                                id="github"
                                name="github"
                                className="form-input"
                                placeholder="github.com/yourname"
                                value={formData.github || ''}
                                onChange={(e) => handleChange('github', e.target.value)}
                            />
                        </FormInput>
                    </div>
                    <FormInput label="Portfolio / Website" error={null} touched={false} inputId="website">
                        <input
                            id="website"
                            name="website"
                            className="form-input"
                            placeholder="yourwebsite.com"
                            value={formData.website || ''}
                            onChange={(e) => handleChange('website', e.target.value)}
                        />
                    </FormInput>
                </div>
                <FormInput label="Professional Summary" error={secErrors.summary} touched={isTouched} inputId="summary">
                    <textarea
                        id="summary"
                        name="summary"
                        className={`form-input${secErrors.summary && isTouched ? ' input-error' : ''}`}
                        placeholder="A brief overview of your professional background..."
                        value={formData.summary || ''}
                        onChange={(e) => handleChange('summary', e.target.value)}
                        style={{ minHeight: '100px' }}
                    />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.2rem', textAlign: 'right', display: 'block' }}>
                        {(formData.summary || '').length}/1500
                    </span>
                </FormInput>
            </>
        );
    };

    const renderExperienceSection = () => {
        const items = formData.experiences || [];
        return (
            <>
                <Reorder.Group axis="y" values={items} onReorder={(reordered) => reorderRepeaterItems('experiences', reordered)} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map((exp) => (
                        <Reorder.Item key={exp.id} value={exp} className="repeater-item" style={{ position: 'relative', listStyle: 'none' }}>
                            <button className="repeater-remove-btn" onClick={() => removeRepeaterItem('experiences', exp.id)}>
                                <X size={12} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '0.75rem' }}>
                                <button
                                    className="drag-handle"
                                    title="Drag to reorder"
                                    aria-label="Drag to reorder this item"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-dim)',
                                        padding: '2px 0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexShrink: 0,
                                        transition: 'color 0.15s'
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; }}
                                >
                                    <GripVertical size={16} />
                                </button>
                                <div style={{ flex: 1 }}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Job Title</label>
                                            <input className="form-input" placeholder="e.g. Software Engineer" value={exp.title || ''} onChange={(e) => updateRepeaterItem('experiences', exp.id, 'title', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Company</label>
                                            <input className="form-input" placeholder="e.g. Google" value={exp.company || ''} onChange={(e) => updateRepeaterItem('experiences', exp.id, 'company', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-row" style={{ marginTop: '0.75rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">Location</label>
                                            <input className="form-input" placeholder="e.g. Mountain View, CA" value={exp.location || ''} onChange={(e) => updateRepeaterItem('experiences', exp.id, 'location', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Start Date</label>
                                            <input className="form-input" type="month" value={exp.startDate || ''} onChange={(e) => updateRepeaterItem('experiences', exp.id, 'startDate', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">End Date</label>
                                            <input className="form-input" type="month" value={exp.endDate || ''} onChange={(e) => updateRepeaterItem('experiences', exp.id, 'endDate', e.target.value)} placeholder="Present" />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: '0.75rem' }}>
                                        <label className="form-label">Description (one bullet per line)</label>
                                        <textarea className="form-input" placeholder="Managed a team of 5 engineers..." value={exp.description || ''} onChange={(e) => updateRepeaterItem('experiences', exp.id, 'description', e.target.value)} style={{ minHeight: '80px' }} />
                                    </div>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
                <button className="repeater-add-btn" onClick={() => addRepeaterItem('experiences', { title: '', company: '', location: '', startDate: '', endDate: '', description: '' })}>
                    <Plus size={14} /> Add Experience
                </button>
            </>
        );
    };

    const renderEducationSection = () => {
        const items = formData.educations || [];
        return (
            <>
                <Reorder.Group axis="y" values={items} onReorder={(reordered) => reorderRepeaterItems('educations', reordered)} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map((edu) => (
                        <Reorder.Item key={edu.id} value={edu} className="repeater-item" style={{ position: 'relative', listStyle: 'none' }}>
                            <button className="repeater-remove-btn" onClick={() => removeRepeaterItem('educations', edu.id)}>
                                <X size={12} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <button
                                    className="drag-handle"
                                    title="Drag to reorder"
                                    aria-label="Drag to reorder this item"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-dim)',
                                        padding: '2px 0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexShrink: 0,
                                        transition: 'color 0.15s'
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; }}
                                >
                                    <GripVertical size={16} />
                                </button>
                                <div style={{ flex: 1 }}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">School</label>
                                            <input className="form-input" placeholder="e.g. MIT" value={edu.school || ''} onChange={(e) => updateRepeaterItem('educations', edu.id, 'school', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Degree</label>
                                            <input className="form-input" placeholder="e.g. B.Sc. Computer Science" value={edu.degree || ''} onChange={(e) => updateRepeaterItem('educations', edu.id, 'degree', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-row" style={{ marginTop: '0.75rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">City</label>
                                            <input className="form-input" placeholder="e.g. Cambridge, MA" value={edu.city || ''} onChange={(e) => updateRepeaterItem('educations', edu.id, 'city', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Start Date</label>
                                            <input className="form-input" type="month" value={edu.startDate || ''} onChange={(e) => updateRepeaterItem('educations', edu.id, 'startDate', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">End Date</label>
                                            <input className="form-input" type="month" value={edu.endDate || ''} onChange={(e) => updateRepeaterItem('educations', edu.id, 'endDate', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: '0.75rem' }}>
                                        <label className="form-label">Description</label>
                                        <textarea className="form-input" placeholder="Relevant coursework, honors..." value={edu.description || ''} onChange={(e) => updateRepeaterItem('educations', edu.id, 'description', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
                <button className="repeater-add-btn" onClick={() => addRepeaterItem('educations', { school: '', degree: '', city: '', startDate: '', endDate: '', description: '' })}>
                    <Plus size={14} /> Add Education
                </button>
            </>
        );
    };

    const renderProjectsSection = () => {
        const items = formData.projects || [];
        return (
            <>
                <Reorder.Group axis="y" values={items} onReorder={(reordered) => reorderRepeaterItems('projects', reordered)} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map((proj) => (
                        <Reorder.Item key={proj.id} value={proj} className="repeater-item" style={{ position: 'relative', listStyle: 'none' }}>
                            <button className="repeater-remove-btn" onClick={() => removeRepeaterItem('projects', proj.id)}>
                                <X size={12} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <button
                                    className="drag-handle"
                                    title="Drag to reorder"
                                    aria-label="Drag to reorder this item"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-dim)',
                                        padding: '2px 0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexShrink: 0,
                                        transition: 'color 0.15s'
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; }}
                                >
                                    <GripVertical size={16} />
                                </button>
                                <div style={{ flex: 1 }}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Project Name</label>
                                            <input className="form-input" placeholder="e.g. E-Commerce Platform" value={proj.title || ''} onChange={(e) => updateRepeaterItem('projects', proj.id, 'title', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Link</label>
                                            <input className="form-input" placeholder="e.g. https://github.com/..." value={proj.link || ''} onChange={(e) => updateRepeaterItem('projects', proj.id, 'link', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: '0.75rem' }}>
                                        <label className="form-label">Description</label>
                                        <textarea className="form-input" placeholder="What did you build? What technologies?" value={proj.description || ''} onChange={(e) => updateRepeaterItem('projects', proj.id, 'description', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
                <button className="repeater-add-btn" onClick={() => addRepeaterItem('projects', { title: '', link: '', description: '' })}>
                    <Plus size={14} /> Add Project
                </button>
            </>
        );
    };

    const renderSkillsSection = () => (
        <>
            <div className="form-group">
                <label className="form-label" htmlFor="skillsRaw">Skills (comma separated)</label>
                <textarea
                    id="skillsRaw"
                    name="skillsRaw"
                    className="form-input"
                    placeholder="e.g. JavaScript, React, Node.js, Python, AWS..."
                    value={formData.skillsRaw || ''}
                    onChange={(e) => handleChange('skillsRaw', e.target.value)}
                    style={{ minHeight: '60px' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Separate each skill with a comma. AI can enhance these for you.
                </span>
            </div>
        </>
    );

    const renderAchievementsSection = () => {
        const items = formData.achievements || [];
        return (
            <>
                <Reorder.Group axis="y" values={items} onReorder={(reordered) => reorderRepeaterItems('achievements', reordered)} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map((ach) => (
                        <Reorder.Item key={ach.id} value={ach} className="repeater-item" style={{ position: 'relative', listStyle: 'none' }}>
                            <button className="repeater-remove-btn" onClick={() => removeRepeaterItem('achievements', ach.id)}>
                                <X size={12} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <button
                                    className="drag-handle"
                                    title="Drag to reorder"
                                    aria-label="Drag to reorder this item"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-dim)',
                                        padding: '2px 0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexShrink: 0,
                                        transition: 'color 0.15s'
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; }}
                                >
                                    <GripVertical size={16} />
                                </button>
                                <div style={{ flex: 1 }}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Title</label>
                                            <input className="form-input" placeholder="e.g. Employee of the Year" value={ach.title || ''} onChange={(e) => updateRepeaterItem('achievements', ach.id, 'title', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Description</label>
                                            <input className="form-input" placeholder="Brief description..." value={ach.description || ''} onChange={(e) => updateRepeaterItem('achievements', ach.id, 'description', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
                <button className="repeater-add-btn" onClick={() => addRepeaterItem('achievements', { title: '', description: '' })}>
                    <Plus size={14} /> Add Achievement
                </button>
            </>
        );
    };

    const renderCustomSection = () => {
        const items = formData.customSections || [];
        return (
            <>
                {items.length === 0 && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                        Add sections like <strong>Languages</strong>, <strong>Certifications</strong>, or <strong>Volunteering</strong> —
                        they'll appear at the bottom of your resume in every template.
                    </p>
                )}
                <Reorder.Group axis="y" values={items} onReorder={(reordered) => reorderRepeaterItems('customSections', reordered)} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map((sec) => (
                        <Reorder.Item key={sec.id} value={sec} className="repeater-item" style={{ position: 'relative', listStyle: 'none' }}>
                            <button className="repeater-remove-btn" onClick={() => removeRepeaterItem('customSections', sec.id)}>
                                <X size={12} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <button
                                    className="drag-handle"
                                    title="Drag to reorder"
                                    aria-label="Drag to reorder this section"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-dim)',
                                        padding: '2px 0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexShrink: 0,
                                        transition: 'color 0.15s'
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; }}
                                >
                                    <GripVertical size={16} />
                                </button>
                                <div style={{ flex: 1 }}>
                                    <div className="form-group">
                                        <label className="form-label">Section Title</label>
                                        <input
                                            className="form-input"
                                            placeholder="e.g. Languages"
                                            value={sec.title || ''}
                                            onChange={(e) => updateRepeaterItem('customSections', sec.id, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginTop: '0.75rem' }}>
                                        <label className="form-label">Items (one per line)</label>
                                        <textarea
                                            className="form-input"
                                            placeholder={'English — Native\nSpanish — Fluent'}
                                            value={(sec.items || []).join('\n')}
                                            onChange={(e) => updateCustomSectionItems(sec.id, e.target.value)}
                                            style={{ minHeight: '70px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '0.5rem' }}>
                    <button className="repeater-add-btn" onClick={() => addRepeaterItem('customSections', { title: 'Languages', items: [] })}>
                        <Plus size={14} /> Languages
                    </button>
                    <button className="repeater-add-btn" onClick={() => addRepeaterItem('customSections', { title: 'Certifications', items: [] })}>
                        <Plus size={14} /> Certifications
                    </button>
                    <button className="repeater-add-btn" onClick={() => addRepeaterItem('customSections', { title: 'Volunteering', items: [] })}>
                        <Plus size={14} /> Volunteering
                    </button>
                    <button className="repeater-add-btn" onClick={() => addRepeaterItem('customSections', { title: 'Custom Section', items: [] })}>
                        <Plus size={14} /> Custom
                    </button>
                </div>
            </>
        );
    };

    return (
        <div>
            {/* Form Progress Bar */}
            <div className="form-progress-bar">
                <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: completion >= 100 ? 'rgba(16, 185, 129, 0.15)' :
                        completion >= 40 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.04)',
                    color: getCompletionColor(completion),
                    flexShrink: 0,
                    fontSize: '0.6rem',
                    fontWeight: 800
                }}>
                    {completion >= 100 ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <span>{completion}%</span>
                    )}
                </div>
                <div className="form-progress-track">
                    <div
                        className="form-progress-fill"
                        style={{
                            width: `${completion}%`,
                            background: getCompletionColor(completion),
                        }}
                    />
                </div>
                <span className="form-progress-label">
                    {completion < 40 ? 'Getting started' :
                     completion < 80 ? 'Building momentum' :
                     completion < 100 ? 'Almost done!' : 'Complete!'}
                </span>
            </div>

            {sectionConfig.map(renderSection)}
        </div>
    );
};

export default ResumeForm;
