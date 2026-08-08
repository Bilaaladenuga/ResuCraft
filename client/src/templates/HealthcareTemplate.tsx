import React from 'react';
import { FormData } from '../types';
import { getSectionOrder, SectionConfig } from '../data/roleLayouts';
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

interface Props {
    data: FormData;
    roleId?: string;
}

const HealthcareTemplate = ({ data, roleId }: Props) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const skills = (data.skillsRaw || '').split(',').map(s => s.trim()).filter(Boolean);
    const sectionOrder = getSectionOrder('healthcare', roleId);
    // Filter out skills & achievements since they're already in the sidebar
    const mainSectionOrder = sectionOrder.filter(
        s => s.id !== 'skills' && s.id !== 'achievements'
    );

    const renderSection = (config: SectionConfig): React.ReactNode => {
        switch (config.id) {
            case 'summary':
                return data.summary ? (
                    <div className="hc-section" key="summary">
                        <h2 className="hc-section-title">{config.heading}</h2>
                        <p className="hc-text">{data.summary}</p>
                    </div>
                ) : null;
            case 'experience':
                return data.experiences?.length > 0 ? (
                    <div className="hc-section" key="experience">
                        <h2 className="hc-section-title">{config.heading}</h2>
                        {data.experiences.map((exp) => (
                            <div key={exp.id} className="hc-entry">
                                <div className="hc-entry-header">
                                    <strong>{exp.title}</strong>
                                    <span className="hc-date">{formatDate(exp.startDate)} — {formatDate(exp.endDate)}</span>
                                </div>
                                <p className="hc-company">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                                {exp.description && (
                                    <ul className="hc-bullets">
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
                    <div className="hc-section" key="education">
                        <h2 className="hc-section-title">{config.heading}</h2>
                        {data.educations.map((edu) => (
                            <div key={edu.id} className="hc-entry">
                                <div className="hc-entry-header">
                                    <strong>{edu.degree}</strong>
                                    <span className="hc-date">{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</span>
                                </div>
                                <p className="hc-company">{edu.school}{edu.city ? ` · ${edu.city}` : ''}</p>
                                {edu.description && <p className="hc-text">{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : null;
            case 'projects':
                return data.projects?.length > 0 ? (
                    <div className="hc-section" key="projects">
                        <h2 className="hc-section-title">{config.heading}</h2>
                        {data.projects.map((proj) => (
                            <div key={proj.id} className="hc-entry">
                                <strong>{proj.title}</strong>
                                {proj.description && <p className="hc-text">{proj.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : null;
        }
    };

    return (
        <div className="preview-container template-healthcare">
            <div className="hc-layout">
                <div className="hc-sidebar">
                    {data.image && <img src={data.image} alt="Profile" className="hc-avatar" />}
                    <h1 className="hc-name">{fullName}</h1>
                    <p className="hc-designation">{data.designation || 'Professional Title'}</p>

                    <div className="hc-sidebar-section">
                        <h3 className="hc-sidebar-title">Contact</h3>
                        {data.email && <p className="hc-sidebar-text">{data.email}</p>}
                        {data.phone && <p className="hc-sidebar-text">{data.phone}</p>}
                        {data.address && <p className="hc-sidebar-text">{data.address}</p>}
                        <SocialLinks data={data} />
                    </div>

                    {skills.length > 0 && (
                        <div className="hc-sidebar-section">
                            <h3 className="hc-sidebar-title">Skills</h3>
                            <ul className="hc-skills-list">
                                {skills.map((skill, i) => (
                                    <li key={i}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {data.achievements?.length > 0 && (
                        <div className="hc-sidebar-section">
                            <h3 className="hc-sidebar-title">Certifications</h3>
                            {data.achievements.map((ach) => (
                                <div key={ach.id} className="hc-cert-item">
                                    <strong>{ach.title}</strong>
                                    {ach.description && <p className="hc-sidebar-text">{ach.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hc-main">
                    {mainSectionOrder.map(cfg => renderSection(cfg))}
                    <CustomSections data={data} sectionClass="hc-section" titleClass="hc-section-title" bulletsClass="hc-bullets" />
                </div>
            </div>
        </div>
    );
};

export default HealthcareTemplate;
