'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

const ONBOARDING_KEY = 'resucraft_onboarding_done';

interface OnboardingStep {
    title: string;
    description: string;
    placement: 'bottom' | 'top' | 'left' | 'right';
    /** CSS selector for the element to highlight */
    targetSelector: string;
}

const steps: OnboardingStep[] = [
    {
        title: 'Fill in Your Details',
        description: 'Start by entering your personal info, experience, education, and skills in the form sections on the left. Each section can be collapsed to stay organized.',
        placement: 'bottom',
        targetSelector: '.builder-left',
    },
    {
        title: 'Preview Updates Live',
        description: 'Your resume preview updates in real-time as you type. Choose from 7 industry-specific templates optimized for ATS compatibility.',
        placement: 'left',
        targetSelector: '#resume-preview',
    },
    {
        title: 'AI-Powered Tools',
        description: 'Use the AI Assistant panel to generate summaries, tailor for job descriptions, power-up bullet points, and check your ATS score.',
        placement: 'top',
        targetSelector: '.ai-panel',
    },
    {
        title: 'Export & Share',
        description: 'When ready, export your resume as PDF or DOCX with one click. You can also save multiple resume versions and switch between them.',
        placement: 'bottom',
        targetSelector: '.navbar-actions',
    },
];

interface OnboardingProps {
    /** Force show onboarding regardless of localStorage */
    forceShow?: boolean;
    onComplete?: () => void;
}

const Onboarding = ({ forceShow, onComplete }: OnboardingProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeen = typeof localStorage !== 'undefined' && localStorage.getItem(ONBOARDING_KEY);
        if (forceShow || !hasSeen) {
            // Small delay to let DOM settle
            const timer = setTimeout(() => setIsOpen(true), 600);
            return () => clearTimeout(timer);
        }
    }, [forceShow]);

    const handleComplete = () => {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(ONBOARDING_KEY, 'true');
        }
        setIsOpen(false);
        onComplete?.();
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    if (!isOpen) return null;

    const step = steps[currentStep];

    // Try to find the target element for positioning
    const targetEl = typeof document !== 'undefined' ? document.querySelector(step.targetSelector) : null;
    const targetRect = targetEl?.getBoundingClientRect();

    // Calculate tooltip position
    let top = 0;
    let left = 0;
    if (targetRect) {
        switch (step.placement) {
            case 'bottom':
                top = targetRect.bottom + 12;
                left = targetRect.left + targetRect.width / 2 - 150;
                break;
            case 'top':
                top = targetRect.top - 12 - 200;
                left = targetRect.left + targetRect.width / 2 - 150;
                break;
            case 'left':
                top = targetRect.top + targetRect.height / 2 - 100;
                left = targetRect.left - 312;
                break;
            case 'right':
                top = targetRect.top + targetRect.height / 2 - 100;
                left = targetRect.right + 12;
                break;
        }
    }

    // Clamp to viewport
    if (typeof window !== 'undefined') {
        left = Math.max(16, Math.min(left, window.innerWidth - 316));
        top = Math.max(16, Math.min(top, window.innerHeight - 220));
    }

    return (
        <>
            {/* Dim overlay */}
            <motion.div
                className="onboarding-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    background: 'rgba(0,0,0,0.4)',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                }}
                onClick={handleNext}
            />

            {/* Tooltip */}
            <motion.div
                className="onboarding-tooltip"
                data-placement={step.placement}
                initial={{ opacity: 0, scale: 0.9, y: step.placement === 'bottom' ? 10 : step.placement === 'top' ? -10 : 0 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                    position: 'fixed',
                    top,
                    left,
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Step indicator */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '0.75rem',
                }}>
                    <Sparkles size={14} color="var(--secondary)" />
                    <span style={{
                        fontSize: '0.6rem',
                        color: 'var(--text-dim)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontWeight: 600,
                    }}>
                        Step {currentStep + 1} of {steps.length}
                    </span>
                    <div style={{ flex: 1 }} />
                    <button
                        onClick={handleComplete}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            borderRadius: '4px',
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Dots */}
                <div style={{
                    display: 'flex',
                    gap: '4px',
                    marginBottom: '0.75rem',
                }}>
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: i === currentStep ? '16px' : '6px',
                                height: '6px',
                                borderRadius: '3px',
                                background: i === currentStep ? 'var(--secondary)' : 'rgba(255,255,255,0.15)',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    ))}
                </div>

                <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '0.5rem',
                }}>
                    {step.title}
                </h4>

                <p style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                }}>
                    {step.description}
                </p>

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: currentStep === 0 ? 'var(--text-dim)' : 'var(--text-muted)',
                            cursor: currentStep === 0 ? 'default' : 'pointer',
                            padding: '0.3rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            transition: 'all 0.15s',
                            opacity: currentStep === 0 ? 0.4 : 1,
                        }}
                        onMouseEnter={e => { if (currentStep > 0) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'; }}
                        onMouseLeave={e => { if (currentStep > 0) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
                    >
                        <ArrowLeft size={12} /> Back
                    </button>

                    <button
                        onClick={handleNext}
                        className="btn btn-primary btn-sm"
                        style={{
                            fontSize: '0.7rem',
                            padding: '0.35rem 0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        {currentStep < steps.length - 1 ? (
                            <>Next <ArrowRight size={12} /></>
                        ) : (
                            <><Check size={12} /> Done</>
                        )}
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default Onboarding;
