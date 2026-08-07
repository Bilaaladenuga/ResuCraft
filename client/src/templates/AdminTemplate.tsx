import React from 'react';
import { FormData } from '../types';
import { getSectionOrder } from '../data/roleLayouts';
import { renderSections, ContactStrip, SectionStyle } from './Sections';

const style: SectionStyle = {
    sectionClass: 'admin-section',
    titleClass: 'admin-section-title',
    textClass: 'admin-text',
    entryClass: 'admin-entry',
    entryHeadClass: 'admin-entry-head',
    entryTitleClass: 'admin-entry-title',
    companyClass: 'admin-company',
    dateClass: 'admin-date',
    bulletsClass: 'admin-bullets',
    skillsMode: 'joined',
    skillsBoxClass: 'admin-skills-box',
};

const AdminTemplate = ({ data, roleId }: { data: FormData; roleId?: string }) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const sectionOrder = getSectionOrder('admin', roleId);

    return (
        <div className="preview-container template-admin">
            <header className="admin-header">
                <div className="admin-header-row">
                    <h1 className="admin-name">{fullName}</h1>
                    <div className="admin-badge">ATS Ready</div>
                </div>
                {data.designation && <p className="admin-designation">{data.designation}</p>}
                <ContactStrip data={data} className="admin-contact" />
            </header>
            <div className="admin-body">
                {renderSections(data, sectionOrder, style)}
            </div>
        </div>
    );
};

export default AdminTemplate;
