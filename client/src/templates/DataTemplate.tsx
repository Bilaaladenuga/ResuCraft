import React from 'react';
import { FormData } from '../types';
import { getSectionOrder } from '../data/roleLayouts';
import { renderSections, ContactStrip, SectionStyle } from './Sections';

const style: SectionStyle = {
    sectionClass: 'data-section',
    titleClass: 'data-section-title',
    textClass: 'data-text',
    entryClass: 'data-entry',
    entryHeadClass: 'data-entry-head',
    entryTitleClass: 'data-entry-title',
    companyClass: 'data-company',
    dateClass: 'data-date',
    bulletsClass: 'data-bullets',
    skillsMode: 'grid',
    chipClass: 'data-chip',
    projectClass: 'data-project',
    achievementClass: 'data-achievement',
};

const DataTemplate = ({ data, roleId }: { data: FormData; roleId?: string }) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const sectionOrder = getSectionOrder('data', roleId);

    return (
        <div className="preview-container template-data">
            <header className="data-header">
                <div>
                    <h1 className="data-name">{fullName}</h1>
                    {data.designation && <p className="data-designation">{data.designation}</p>}
                </div>
                <div className="data-header-contact">
                    <ContactStrip data={data} className="data-contact" />
                </div>
            </header>
            <div className="data-body">
                {renderSections(data, sectionOrder, style)}
            </div>
        </div>
    );
};

export default DataTemplate;
