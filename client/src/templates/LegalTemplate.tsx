import React from 'react';
import { FormData } from '../types';
import { getSectionOrder, SectionConfig } from '../data/roleLayouts';
import SocialLinks from './SocialLinks';
import CustomSections from './CustomSections';

const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

interface Props {
    data: FormData;
    roleId?: string;
}

const LegalTemplate = ({ data, roleId }: Props) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const skills = (data.skillsRaw || '').split(',').map(s => s.trim()).filter(Boolean);
    const sectionOrder = getSectionOrder('legal', roleId);

    const renderSection = (config: SectionConfig): React.ReactNode => {
        switch (config.id) {
            case 'summary':
                return data.summary ? (
                    <div className="legal-section" key="summary">
                        <h2 className="legal-section-title">{config.heading}</h2>
                        <p className="legal-text">{data.summary}</p>
                    </div>
                ) : null;
            case 'experience':
                return data.experiences?.length > 0 ? (
                    <div className="legal-section" key="experience">
                        <h2 className="legal-section-title">{config.heading}</h2>
                        {data.experiences.map((exp) => (
                            <div key={exp.id} className="legal-entry">
                                <div className="legal-entry-header">
                                    <div>
                                        <strong>{exp.title}</strong>
                                        <p className="legal-company">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                                    </div>
                                    <span className="legal-date">{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                                </div>
                                {exp.description && (
                                    <ul className="legal-bullets">
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
                    <div className="legal-section" key="education">
                        <h2 className="legal-section-title">{config.heading}</h2>
                        {data.educations.map((edu) => (
                            <div key={edu.id} className="legal-entry">
                                <div className="legal-entry-header">
                                    <strong>{edu.degree}</strong>
                                    <span className="legal-date">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                                </div>
                                <p className="legal-company">{edu.school}{edu.city ? `, ${edu.city}` : ''}</p>
                                {edu.description && <p className="legal-text">{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : null;
            case 'skills':
                return skills.length > 0 ? (
                    <div className="legal-section" key="skills">
                        <h2 className="legal-section-title">{config.heading}</h2>
                        <div className="legal-skills-grid">
                            {skills.map((skill, i) => (
                                <span key={i} className="legal-skill-item">{skill}</span>
                            ))}
                        </div>
                    </div>
                ) : null;
            case 'achievements':
                return data.achievements?.length > 0 ? (
                    <div className="legal-section" key="achievements">
                        <h2 className="legal-section-title">{config.heading}</h2>
                        {data.achievements.map((ach) => (
                            <div key={ach.id} className="legal-entry">
                                <strong>{ach.title}</strong>
                                {ach.description && <p className="legal-text" style={{ marginTop: '0.15rem' }}>{ach.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : null;
            case 'projects':
                return data.projects?.length > 0 ? (
                    <div className="legal-section" key="projects">
                        <h2 className="legal-section-title">{config.heading}</h2>
                        {data.projects.map((proj) => (
                            <div key={proj.id} className="legal-entry">
                                <strong>{proj.title}</strong>
                                {proj.description && <p className="legal-text">{proj.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : null;
        }
    };

    return (
        <div className="preview-container template-legal">
            {/* Header with classic law firm feel */}
            <div className="legal-header">
                {data.image && <img src={data.image} alt="Profile" className="legal-avatar" />}
                <h1 className="legal-name">{fullName}</h1>
                <p className="legal-designation">{data.designation || 'Legal Professional'}</p>
                <div className="legal-contact">
                    {data.email && <span>{data.email}</span>}
                    {data.phone && <span>{data.phone}</span>}
                    {data.address && <span>{data.address}</span>}
                    <SocialLinks data={data} />
                </div>
                <div className="legal-header-bar"></div>
            </div>

            <div className="legal-body">
                {sectionOrder.map(cfg => renderSection(cfg))}
                <CustomSections data={data} sectionClass="legal-section" titleClass="legal-section-title" bulletsClass="legal-bullets" />
            </div>
        </div>
    );
};

export default LegalTemplate;
