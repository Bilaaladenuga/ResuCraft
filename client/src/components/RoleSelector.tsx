'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ChevronDown, ChevronUp, Briefcase, Wand2 } from 'lucide-react';
import { RoleConfig, getRolesForIndustry } from '../data/roleData';

interface RoleSelectorProps {
    industry: string;
    currentDesignation: string;
    onSelectRole: (role: RoleConfig) => void;
    onQuickFill: (role: RoleConfig) => void;
    quickFillLoading: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
    industry,
    currentDesignation,
    onSelectRole,
    onQuickFill,
    quickFillLoading
}) => {
    const [expanded, setExpanded] = useState(true);
    const roles = getRolesForIndustry(industry);
    const hasRole = !!currentDesignation.trim();

    // Auto-collapse when a role is selected
    useEffect(() => {
        if (hasRole) {
            setExpanded(false);
        }
    }, [hasRole]);

    // Find if current designation matches any role
    const matchedRole = roles.find(
        r => r.title.toLowerCase() === currentDesignation.toLowerCase().trim()
    );

    return (
        <div className="glass-card" style={{
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06), rgba(245, 158, 11, 0.04))',
            border: '1px solid rgba(6, 182, 212, 0.15)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div
                onClick={() => setExpanded(!expanded)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '28px', height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(6, 182, 212, 0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent)'
                    }}>
                        <Briefcase size={14} />
                    </div>
                    <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                            {hasRole
                                ? `Role: ${currentDesignation}`
                                : 'Pick Your Role'
                            }
                        </span>
                        {!hasRole && (
                            <span style={{
                                display: 'block',
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                marginTop: '1px'
                            }}>
                                Get pre-filled skills and AI-generated content tailored to your job
                            </span>
                        )}
                    </div>
                </div>
                {expanded ? <ChevronUp size={16} color="var(--text-dim)" /> : <ChevronDown size={16} color="var(--text-dim)" />}
            </div>

            {/* Expanded content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        style={{ padding: '0 1rem 1rem' }}
                    >
                        {/* Role chips */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            marginBottom: '0.75rem'
                        }}>
                            {roles.map((role) => {
                                const isSelected = matchedRole?.id === role.id;
                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => onSelectRole(role)}
                                        style={{
                                            padding: '0.45rem 0.85rem',
                                            fontSize: '0.78rem',
                                            fontWeight: 500,
                                            border: `1px solid ${isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}`,
                                            borderRadius: '100px',
                                            cursor: 'pointer',
                                            background: isSelected
                                                ? 'rgba(6, 182, 212, 0.12)'
                                                : 'rgba(255,255,255,0.03)',
                                            color: isSelected ? 'var(--accent)' : 'var(--text)',
                                            transition: 'all 0.15s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.35rem'
                                        }}
                                        title={role.description}
                                        onMouseEnter={e => {
                                            if (!isSelected) {
                                                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!isSelected) {
                                                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                                            }
                                        }}
                                    >
                                        {isSelected && <Check size={12} />}
                                        {role.title}
                                    </button>
                                );
                            })}
                        </div>

                        {matchedRole && (
                            <>
                                {/* Quick Fill button */}
                                <button
                                    className="btn btn-accent"
                                    onClick={() => onQuickFill(matchedRole)}
                                    disabled={quickFillLoading}
                                    style={{
                                        width: '100%',
                                        fontSize: '0.8rem',
                                        padding: '0.5rem '
                                    }}
                                >
                                    {quickFillLoading ? (
                                        <><span className="spinner" style={{ width: 14, height: 14 }} /> Auto-Filling...</>
                                    ) : (
                                        <><Wand2 size={14} /> Auto-Fill Resume with {matchedRole.title} Content</>
                                    )}
                                </button>
                                <p style={{
                                    fontSize: '0.65rem',
                                    color: 'var(--text-dim)',
                                    textAlign: 'center',
                                    marginTop: '0.5rem'
                                }}>
                                    Pre-fills skills, generates summary, and creates experience entries
                                </p>
                            </>
                        )}

                        {!hasRole && (
                            <p style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-dim)',
                                textAlign: 'center'
                            }}>
                                Click a role above to set your job title and unlock role-specific skills.
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoleSelector;
