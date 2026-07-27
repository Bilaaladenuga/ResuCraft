import React from 'react';
import { FormData } from '../types';
import { getSectionOrder, SectionConfig } from '../data/roleLayouts';

const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

interface Props {
    data: FormData;
    roleId?: string;
}

const CreativeTemplate = ({ data, roleId }: Props) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const skills = (data.skillsRaw || '').split(',').map(s => s.trim()).filter(Boolean);
    const sectionOrder = getSectionOrder('creative', roleId);

    const renderSection = (config: SectionConfig): React.ReactNode => {
        switch (config.id) {
            case 'summary':
                return data.summary ? (
                    <div className="creative-section" key="summary">
                        <h2 className="creative-section-title">{config.heading}</h2>
                        <p className="creative-text">{data.summary}</p>
                    </div>
                ) : null;
            case 'skills':
                return skills.length > 0 ? (
                    <div className="creative-section" key="skills">
                        <h2 className="creative-section-title">{config.heading}</h2>
                        <div className="creative-skills">
                            {skills.map((skill, i) => (
                                <span key={i} className="creative-skill-tag">{skill}</span>
                            ))}
                        </div>
                    </div>
                ) : null;
            case 'projects':
                return data.projects?.length > 0 ? (
                    <div className="creative-section" key="projects">
                        <h2 className="creative-section-title">{config.heading}</h2>
                        <div className="creative-projects-grid">
                            {data.projects.map((proj) => (
                                <div key={proj.id} className="creative-project-card">
                                    <h4>{proj.title}</h4>
                                    {proj.description && <p>{proj.description}</p>}
                                    {proj.link && <a href={proj.link} className="creative-link">View →</a>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null;
            case 'experience':
                return data.experiences?.length > 0 ? (
                    <div className="creative-section" key="experience">
                        <h2 className="creative-section-title">{config.heading}</h2>
                        {data.experiences.map((exp) => (
                            <div key={exp.id} className="creative-entry">
                                <div className="creative-entry-dot"></div>
                                <div className="creative-entry-content">
                                    <div className="creative-entry-header">
                                        <strong>{exp.title}</strong>
                                        <span className="creative-date">{formatDate(exp.startDate)} — {formatDate(exp.endDate)}</span>
                                    </div>
                                    <p className="creative-company">{exp.company}</p>
                                    {exp.description && (
                                        <ul className="creative-bullets">
                                            {exp.description.split('\n').filter(Boolean).map((line, i) => (
                                                <li key={i}>{line}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null;
            case 'education':
                return data.educations?.length > 0 ? (
                    <div className="creative-section" key="education">
                        <h2 className="creative-section-title">{config.heading}</h2>
                        {data.educations.map((edu) => (
                            <div key={edu.id} className="creative-entry">
                                <div className="creative-entry-dot"></div>
                                <div className="creative-entry-content">
                                    <strong>{edu.degree}</strong>
                                    <p className="creative-company">{edu.school}{edu.city ? `, ${edu.city}` : ''}</p>
                                    <span className="creative-date">{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null;
            case 'achievements':
                return data.achievements?.length > 0 ? (
                    <div className="creative-section" key="achievements">
                        <h2 className="creative-section-title">{config.heading}</h2>
                        {data.achievements.map((ach) => (
                            <div key={ach.id} style={{ marginBottom: '0.5rem' }}>
                                <strong>{ach.title}</strong>
                                {ach.description && <span> — {ach.description}</span>}
                            </div>
                        ))}
                    </div>
                ) : null;
        }
    };

    return (
        <div className="preview-container template-creative">
            <div className="creative-header">
                <div className="creative-header-bg"></div>
                <div className="creative-header-content">
                    {data.image && <img src={data.image} alt="Profile" className="creative-avatar" />}
                    <div>
                        <h1 className="creative-name">{fullName}</h1>
                        <p className="creative-designation">{data.designation || 'Creative Professional'}</p>
                        <div className="creative-contact">
                            {data.email && <span>{data.email}</span>}
                            {data.phone && <span>{data.phone}</span>}
                            {data.address && <span>{data.address}</span>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="creative-body">
                {sectionOrder.map(cfg => renderSection(cfg))}
            </div>
        </div>
    );
};

export default CreativeTemplate;
