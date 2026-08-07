import React from 'react';
import { FormData } from '../types';
import { getSectionOrder } from '../data/roleLayouts';
import { renderSections, SectionStyle } from './Sections';
import SocialLinks from './SocialLinks';

const style: SectionStyle = {
    sectionClass: 'modern-section',
    titleClass: 'modern-section-title',
    textClass: 'modern-text',
    entryClass: 'modern-entry',
    entryHeadClass: 'modern-entry-head',
    entryTitleClass: 'modern-entry-title',
    companyClass: 'modern-company',
    dateClass: 'modern-date',
    bulletsClass: 'modern-bullets',
    skillsMode: 'chips',
    chipClass: 'modern-chip',
    numbered: true,
};

const ModernTemplate = ({ data, roleId }: { data: FormData; roleId?: string }) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const sectionOrder = getSectionOrder('modern', roleId);
    // Social fields are rendered by <SocialLinks> below — including them here would duplicate them.
    const contactItems = [data.email, data.phone, data.address].filter(Boolean);

    return (
        <div className="preview-container template-modern">
            <header className="modern-header">
                <div className="modern-header-left">
                    <h1 className="modern-name">{fullName}</h1>
                    {data.designation && <p className="modern-designation">{data.designation}</p>}
                </div>
                <div className="modern-header-right">
                    {contactItems.map((item, i) => (
                        <span key={i} className="modern-contact-item">{item}</span>
                    ))}
                    <SocialLinks data={data} />
                </div>
            </header>
            <div className="modern-body">
                {renderSections(data, sectionOrder, style)}
            </div>
        </div>
    );
};

export default ModernTemplate;
