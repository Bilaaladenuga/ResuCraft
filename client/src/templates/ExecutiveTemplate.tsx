import React from 'react';
import { FormData } from '../types';
import { getSectionOrder } from '../data/roleLayouts';
import { renderSections, ContactStrip, SectionStyle } from './Sections';

const style: SectionStyle = {
    sectionClass: 'executive-section',
    titleClass: 'executive-section-title',
    textClass: 'executive-text',
    entryClass: 'executive-entry',
    entryHeadClass: 'executive-entry-head',
    entryTitleClass: 'executive-entry-title',
    companyClass: 'executive-company',
    dateClass: 'executive-date',
    bulletsClass: 'executive-bullets',
    skillsMode: 'grid',
    chipClass: 'executive-chip',
    skillsBoxClass: 'executive-competencies',
    achievementClass: 'executive-achievement',
};

const ExecutiveTemplate = ({ data, roleId }: { data: FormData; roleId?: string }) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const sectionOrder = getSectionOrder('executive', roleId);

    return (
        <div className="preview-container template-executive">
            <header className="executive-header">
                <h1 className="executive-name">{fullName}</h1>
                {data.designation && <p className="executive-designation">{data.designation}</p>}
                <div className="executive-rule" />
                <ContactStrip data={data} className="executive-contact" />
            </header>
            <div className="executive-body">
                {renderSections(data, sectionOrder, style)}
            </div>
        </div>
    );
};

export default ExecutiveTemplate;
