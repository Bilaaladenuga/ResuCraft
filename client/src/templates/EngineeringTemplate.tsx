import React from 'react';
import { FormData } from '../types';
import { getSectionOrder } from '../data/roleLayouts';
import { renderSections, ContactStrip, SectionStyle } from './Sections';

const style: SectionStyle = {
    sectionClass: 'engineer-section',
    titleClass: 'engineer-section-title',
    textClass: 'engineer-text',
    entryClass: 'engineer-entry',
    entryHeadClass: 'engineer-entry-head',
    entryTitleClass: 'engineer-entry-title',
    companyClass: 'engineer-company',
    dateClass: 'engineer-date',
    bulletsClass: 'engineer-bullets',
    skillsMode: 'grid',
    chipClass: 'engineer-chip',
    skillsBoxClass: 'engineer-skills-box',
};

const EngineeringTemplate = ({ data, roleId }: { data: FormData; roleId?: string }) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const sectionOrder = getSectionOrder('engineering', roleId);

    return (
        <div className="preview-container template-engineering">
            <header className="engineer-header">
                <div>
                    <h1 className="engineer-name">{fullName}</h1>
                    {data.designation && <p className="engineer-designation">{data.designation}</p>}
                </div>
                <ContactStrip data={data} className="engineer-contact" />
            </header>
            <div className="engineer-body">
                {renderSections(data, sectionOrder, style)}
            </div>
        </div>
    );
};

export default EngineeringTemplate;
