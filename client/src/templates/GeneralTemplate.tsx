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

const GeneralTemplate = ({ data, roleId }: Props) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const skills = (data.skillsRaw || '').split(',').map(s => s.trim()).filter(Boolean);
    const sectionOrder = getSectionOrder('general', roleId);

    const renderSection = (config: SectionConfig): React.ReactNode => {
        switch (config.id) {
            case 'summary':
                return data.summary ? (
                    <div className="general-section" key="summary">
                        <h2 className="general-section-title">{config.heading}</h2>
                        <p className="general-text">{data.summary}</p>
                    </div>
                ) : null;
            case 'experience':
                return data.experiences?.length > 0 ? (
                    <div className="general-section" key="experience">
                        <h2 className="general-section-title">{config.heading}</h2>
                        {data.experiences.map((exp) => (
                            <div key={exp.id} className="general-entry">
                                <div className="general-entry-header">
                                    <div>
                                        <strong>{exp.title}</strong>
                                        <p className="general-company">{exp.company}{exp.location ? ` — ${exp.location}` : ''}</p>
                                    </div>
                                    <span className="general-date">{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                                </div>
                                {exp.description && (
                                    <ul className="general-bullets">
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
                    <div className="general-section" key="education">
                        <h2 className="general-section-title">{config.heading}</h2>
                        {data.educations.map((edu) => (
                            <div key={edu.id} className="general-entry">
                                <div className="general-entry-header">
                                    <div>
                                        <strong>{edu.degree}</strong>
                                        <p className="general-company">{edu.school}{edu.city ? ` — ${edu.city}` : ''}</p>
                                    </div>
                                    <span className="general-date">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                                </div>
                                {edu.description && <p className="general-text">{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : null;
            case 'skills':
                return skills.length > 0 ? (
                    <div className="general-section" key="skills">
                        <h2 className="general-section-title">{config.heading}</h2>
                        <p className="general-text">{skills.join(' · ')}</p>
                    </div>
                ) : null;
            case 'projects':
                return data.projects?.length > 0 ? (
                    <div className="general-section" key="projects">
                        <h2 className="general-section-title">{config.heading}</h2>
                        {data.projects.map((proj) => (
                            <div key={proj.id} className="general-entry">
                                <strong>{proj.title}</strong>
                                {proj.description && <p className="general-text">{proj.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : null;
            case 'achievements':
                return data.achievements?.length > 0 ? (
                    <div className="general-section" key="achievements">
                        <h2 className="general-section-title">{config.heading}</h2>
                        {data.achievements.map((ach) => (
                            <div key={ach.id} className="general-entry">
                                <strong>{ach.title}</strong>
                                {ach.description && <span> — {ach.description}</span>}
                            </div>
                        ))}
                    </div>
                ) : null;
        }
    };

    return (
        <div className="preview-container template-general">
            <div className="general-header">
                <div className="general-header-top">
                    {data.image && <img src={data.image} alt="Profile" className="general-avatar" />}
                    <div>
                        <h1 className="general-name">{fullName}</h1>
                        <p className="general-designation">{data.designation || 'Professional Title'}</p>
                    </div>
                </div>
                <div className="general-contact">
                    {data.email && <span>{data.email}</span>}
                    {data.phone && <span>{data.phone}</span>}
                    {data.address && <span>{data.address}</span>}
                </div>
            </div>

            <div className="general-body">
                {sectionOrder.map(cfg => renderSection(cfg))}
            </div>
        </div>
    );
};

export default GeneralTemplate;
