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

const EducationTemplate = ({ data, roleId }: Props) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const skills = (data.skillsRaw || '').split(',').map(s => s.trim()).filter(Boolean);
    const sectionOrder = getSectionOrder('education', roleId);

    const renderSection = (config: SectionConfig): React.ReactNode => {
        switch (config.id) {
            case 'summary':
                return data.summary ? (
                    <div className="edu-section" key="summary">
                        <h2 className="edu-section-title">{config.heading}</h2>
                        <p className="edu-text">{data.summary}</p>
                    </div>
                ) : null;
            case 'education':
                return data.educations?.length > 0 ? (
                    <div className="edu-section" key="education">
                        <h2 className="edu-section-title">{config.heading}</h2>
                        {data.educations.map((edu) => (
                            <div key={edu.id} className="edu-entry">
                                <div className="edu-entry-header">
                                    <div>
                                        <strong>{edu.degree}</strong>
                                        <p className="edu-institution">{edu.school}{edu.city ? `, ${edu.city}` : ''}</p>
                                    </div>
                                    <span className="edu-date">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                                </div>
                                {edu.description && <p className="edu-text" style={{ marginTop: '0.3rem' }}>{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : null;
            case 'experience':
                return data.experiences?.length > 0 ? (
                    <div className="edu-section" key="experience">
                        <h2 className="edu-section-title">{config.heading}</h2>
                        {data.experiences.map((exp) => (
                            <div key={exp.id} className="edu-entry">
                                <div className="edu-entry-header">
                                    <div>
                                        <strong>{exp.title}</strong>
                                        <p className="edu-institution">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                                    </div>
                                    <span className="edu-date">{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                                </div>
                                {exp.description && (
                                    <ul className="edu-bullets">
                                        {exp.description.split('\n').filter(Boolean).map((line, i) => (
                                            <li key={i}>{line}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                ) : null;
            case 'achievements':
                return data.achievements?.length > 0 ? (
                    <div className="edu-section" key="achievements">
                        <h2 className="edu-section-title">{config.heading}</h2>
                        {data.achievements.map((ach) => (
                            <div key={ach.id} className="edu-entry">
                                <strong>{ach.title}</strong>
                                {ach.description && <p className="edu-text">{ach.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : null;
            case 'projects':
                return data.projects?.length > 0 ? (
                    <div className="edu-section" key="projects">
                        <h2 className="edu-section-title">{config.heading}</h2>
                        {data.projects.map((proj) => (
                            <div key={proj.id} className="edu-entry">
                                <strong>{proj.title}</strong>
                                {proj.description && <p className="edu-text">{proj.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : null;
            case 'skills':
                return skills.length > 0 ? (
                    <div className="edu-section" key="skills">
                        <h2 className="edu-section-title">{config.heading}</h2>
                        <div className="edu-skills">
                            {skills.map((skill, i) => (
                                <span key={i} className="edu-skill-chip">{skill}</span>
                            ))}
                        </div>
                    </div>
                ) : null;
        }
    };

    return (
        <div className="preview-container template-education">
            {/* Header with academic crest feel */}
            <div className="edu-header">
                <div className="edu-header-content">
                    {data.image && <img src={data.image} alt="Profile" className="edu-avatar" />}
                    <div>
                        <h1 className="edu-name">{fullName}</h1>
                        <p className="edu-designation">{data.designation || 'Educator'}</p>
                        <div className="edu-contact">
                            {data.email && <span>{data.email}</span>}
                            {data.phone && <span>{data.phone}</span>}
                            {data.address && <span>{data.address}</span>}
                            <SocialLinks data={data} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="edu-body">
                {sectionOrder.map(cfg => renderSection(cfg))}
                <CustomSections data={data} sectionClass="edu-section" titleClass="edu-section-title" bulletsClass="edu-bullets" />
            </div>
        </div>
    );
};

export default EducationTemplate;
