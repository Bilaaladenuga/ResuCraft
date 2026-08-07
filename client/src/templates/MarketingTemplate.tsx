import React from 'react';
import { FormData } from '../types';
import { getSectionOrder } from '../data/roleLayouts';
import { renderSections, ContactStrip, SectionStyle } from './Sections';

const style: SectionStyle = {
    sectionClass: 'marketing-section',
    titleClass: 'marketing-section-title',
    textClass: 'marketing-text',
    entryClass: 'marketing-entry',
    entryHeadClass: 'marketing-entry-head',
    entryTitleClass: 'marketing-entry-title',
    companyClass: 'marketing-company',
    dateClass: 'marketing-date',
    bulletsClass: 'marketing-bullets',
    skillsMode: 'chips',
    chipClass: 'marketing-chip',
    achievementClass: 'marketing-achievement',
};

const MarketingTemplate = ({ data, roleId }: { data: FormData; roleId?: string }) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const sectionOrder = getSectionOrder('marketing', roleId);

    return (
        <div className="preview-container template-marketing">
            <header className="marketing-header">
                <div className="marketing-header-band">
                    <div className="marketing-monogram">{`${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}` || 'RC'}</div>
                    <div className="marketing-name-wrap">
                        <h1 className="marketing-name">{fullName}</h1>
                        {data.designation && <p className="marketing-designation">{data.designation}</p>}
                    </div>
                </div>
                <div className="marketing-contact-strip">
                    <ContactStrip data={data} className="marketing-contact" />
                </div>
            </header>
            <div className="marketing-body">
                {renderSections(data, sectionOrder, style)}
            </div>
        </div>
    );
};

export default MarketingTemplate;
