import React from 'react';
import { FormData } from '../types';
import { SectionConfig } from '../data/roleLayouts';
import SocialLinks from './SocialLinks';
import CustomSections from './CustomSections';

const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'Present';
    const s = dateStr.trim();
    if (/present|current|now|ongoing|till date|to date|todate/i.test(s)) return 'Present';
    const m = s.match(/^(\d{4})-(\d{2})$/);
    if (!m) return s;
    const date = new Date(s + '-01');
    if (isNaN(date.getTime())) return s;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export interface SectionStyle {
    sectionClass: string;
    titleClass: string;
    textClass: string;
    entryClass: string;
    entryHeadClass: string;
    entryTitleClass: string;
    companyClass: string;
    dateClass: string;
    bulletsClass: string;
    skillsMode: 'joined' | 'chips' | 'grid';
    chipClass?: string;
    projectClass?: string;
    achievementClass?: string;
    linkClass?: string;
    /** When set, the skills content is wrapped in a container with this class (e.g. competency box) */
    skillsBoxClass?: string;
    /** When set, section titles get a ghost index number prefix (magazine style) */
    numbered?: boolean;
}

const defaultStyle: SectionStyle = {
    sectionClass: 'minimal-section',
    titleClass: 'minimal-section-title',
    textClass: 'minimal-text',
    entryClass: 'minimal-entry',
    entryHeadClass: 'minimal-entry-header',
    entryTitleClass: 'minimal-entry-title',
    companyClass: 'minimal-company',
    dateClass: 'minimal-date',
    bulletsClass: 'minimal-bullets',
    skillsMode: 'joined',
};

/** Render the six core resume sections (plus custom sections) for a template shell. */
export const renderSections = (data: FormData, sectionOrder: SectionConfig[], style: SectionStyle): React.ReactNode[] => {
    const s = { ...defaultStyle, ...style };
    const skills = (data.skillsRaw || '').split(',').map(x => x.trim()).filter(Boolean);

    const renderHeading = (config: SectionConfig, idx: number): React.ReactNode =>
        s.numbered ? (
            <h2 className={s.titleClass}>
                <span className="section-ghost-num">{String(idx + 1).padStart(2, '0')}</span>
                {config.heading}
            </h2>
        ) : (
            <h2 className={s.titleClass}>{config.heading}</h2>
        );

    const blocks = sectionOrder.map((config, idx) => {
        switch (config.id) {
            case 'summary':
                return data.summary ? (
                    <div className={s.sectionClass} key="summary">
                        {renderHeading(config, idx)}
                        <p className={s.textClass}>{data.summary}</p>
                    </div>
                ) : null;

            case 'experience':
                return data.experiences?.length > 0 ? (
                    <div className={s.sectionClass} key="experience">
                        {renderHeading(config, idx)}
                        {data.experiences.map(exp => (
                            <div key={exp.id} className={s.entryClass}>
                                <div className={s.entryHeadClass}>
                                    <div>
                                        <span className={s.entryTitleClass}>{exp.title}</span>
                                        <span className={s.companyClass}>
                                            {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                                        </span>
                                    </div>
                                    <span className={s.dateClass}>{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                                </div>
                                {exp.description && (
                                    <ul className={s.bulletsClass}>
                                        {exp.description.split('\n').filter(Boolean).map((line, i) => (
                                            <li key={i}>{line}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                ) : null;

            case 'education':
                return data.educations?.length > 0 ? (
                    <div className={s.sectionClass} key="education">
                        {renderHeading(config, idx)}
                        {data.educations.map(edu => (
                            <div key={edu.id} className={s.entryClass}>
                                <div className={s.entryHeadClass}>
                                    <div>
                                        <span className={s.entryTitleClass}>{edu.degree}</span>
                                        <span className={s.companyClass}>
                                            {edu.school}{edu.city ? ` · ${edu.city}` : ''}
                                        </span>
                                    </div>
                                    <span className={s.dateClass}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                                </div>
                                {edu.description && <p className={s.textClass}>{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : null;

            case 'skills': {
                if (skills.length === 0) return null;
                const skillsContent = (
                    <>
                        {s.skillsMode === 'joined' && <p className={s.textClass}>{skills.join(' · ')}</p>}
                        {(s.skillsMode === 'chips' || s.skillsMode === 'grid') && (
                            <div className={s.skillsMode === 'grid' ? 'chips-grid' : 'chips-row'}>
                                {skills.map((skill, i) => (
                                    <span key={i} className={s.chipClass || 'section-chip-default'}>{skill}</span>
                                ))}
                            </div>
                        )}
                    </>
                );
                return (
                    <div className={s.sectionClass} key="skills">
                        {renderHeading(config, idx)}
                        {s.skillsBoxClass ? <div className={s.skillsBoxClass}>{skillsContent}</div> : skillsContent}
                    </div>
                );
            }

            case 'projects':
                return data.projects?.length > 0 ? (
                    <div className={s.sectionClass} key="projects">
                        {renderHeading(config, idx)}
                        {data.projects.map(proj => (
                            <div key={proj.id} className={s.projectClass || s.entryClass}>
                                <span className={s.entryTitleClass}>{proj.title}</span>
                                {proj.link && <a className={s.linkClass || 'section-link-default'} href={proj.link} target="_blank" rel="noreferrer"> {proj.link}</a>}
                                {proj.description && <p className={s.textClass}>{proj.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : null;

            case 'achievements':
                return data.achievements?.length > 0 ? (
                    <div className={s.sectionClass} key="achievements">
                        {renderHeading(config, idx)}
                        {data.achievements.map(ach => (
                            <div key={ach.id} className={s.achievementClass || s.entryClass}>
                                <span className={s.entryTitleClass}>{ach.title}</span>
                                {ach.description && <span className={s.companyClass}> — {ach.description}</span>}
                            </div>
                        ))}
                    </div>
                ) : null;
        }
    }).filter(Boolean) as React.ReactNode[];

    blocks.push(
        <CustomSections key="custom-sections" data={data} sectionClass={s.sectionClass} titleClass={s.titleClass} bulletsClass={s.bulletsClass} />
    );

    return blocks;
};

/** Standard contact strip used by most new templates. */
export const ContactStrip: React.FC<{ data: FormData; className: string }> = ({ data, className }) => {
    // Social fields (linkedin/github/website) are rendered by <SocialLinks> below —
    // including them here would show them twice.
    const items = [data.email, data.phone, data.address].filter(Boolean);
    if (items.length === 0) return null;
    return (
        <div className={className}>
            {items.map((item, i) => (
                <span key={i}>{item}</span>
            ))}
            <SocialLinks data={data} />
        </div>
    );
};

