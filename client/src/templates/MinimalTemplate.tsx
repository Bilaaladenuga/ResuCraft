import React from 'react';
import { FormData } from '../types';
import { getSectionOrder } from '../data/roleLayouts';
import { renderSections, ContactStrip, SectionStyle } from './Sections';

const style: SectionStyle = {
    sectionClass: 'minimal-section',
    titleClass: 'minimal-section-title',
    textClass: 'minimal-text',
    entryClass: 'minimal-entry',
    entryHeadClass: 'minimal-entry-head',
    entryTitleClass: 'minimal-entry-title',
    companyClass: 'minimal-company',
    dateClass: 'minimal-date',
    bulletsClass: 'minimal-bullets',
    skillsMode: 'joined',
};

const MinimalTemplate = ({ data, roleId }: { data: FormData; roleId?: string }) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const sectionOrder = getSectionOrder('minimal', roleId);

    return (
        <div className="preview-container template-minimal">
            <header className="minimal-header">
                <h1 className="minimal-name">{fullName}</h1>
                {data.designation && <p className="minimal-designation">{data.designation}</p>}
                <div className="minimal-rule" />
                <ContactStrip data={data} className="minimal-contact" />
            </header>
            <div className="minimal-body">
                {renderSections(data, sectionOrder, style)}
            </div>
        </div>
    );
};

export default MinimalTemplate;
