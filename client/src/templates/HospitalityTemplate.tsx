import React from 'react';
import { FormData } from '../types';
import { getSectionOrder } from '../data/roleLayouts';
import { renderSections, ContactStrip, SectionStyle } from './Sections';

const style: SectionStyle = {
    sectionClass: 'hospitality-section',
    titleClass: 'hospitality-section-title',
    textClass: 'hospitality-text',
    entryClass: 'hospitality-entry',
    entryHeadClass: 'hospitality-entry-head',
    entryTitleClass: 'hospitality-entry-title',
    companyClass: 'hospitality-company',
    dateClass: 'hospitality-date',
    bulletsClass: 'hospitality-bullets',
    skillsMode: 'chips',
    chipClass: 'hospitality-chip',
    achievementClass: 'hospitality-achievement',
};

const HospitalityTemplate = ({ data, roleId }: { data: FormData; roleId?: string }) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const sectionOrder = getSectionOrder('hospitality', roleId);

    return (
        <div className="preview-container template-hospitality">
            <header className="hospitality-header">
                <div className="hospitality-avatar-circle">
                    {data.image ? (
                        <img src={data.image} alt="Profile" className="hospitality-avatar-img" />
                    ) : (
                        <span>{`${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}` || 'RC'}</span>
                    )}
                </div>
                <h1 className="hospitality-name">{fullName}</h1>
                {data.designation && <p className="hospitality-designation">{data.designation}</p>}
                <div className="hospitality-header-band">
                    <ContactStrip data={data} className="hospitality-contact" />
                </div>
            </header>
            <div className="hospitality-body">
                {renderSections(data, sectionOrder, style)}
            </div>
        </div>
    );
};

export default HospitalityTemplate;
