import React from 'react';
import { FormData } from '../types';

interface CustomSectionsProps {
    data: FormData;
    /** Template CSS class for a section wrapper, e.g. "general-section" */
    sectionClass: string;
    /** Template CSS class for a section title, e.g. "general-section-title" */
    titleClass: string;
    /** Template CSS class for the bullet list, e.g. "general-bullets" */
    bulletsClass: string;
}

/**
 * Renders user-defined custom sections (Languages, Certifications,
 * Volunteering, …) using the host template's class names so they
 * inherit the same styling as built-in sections.
 */
const CustomSections: React.FC<CustomSectionsProps> = ({ data, sectionClass, titleClass, bulletsClass }) => {
    const custom = (data.customSections || []).filter(
        s => s.title?.trim() && (s.items || []).some(i => i?.trim())
    );

    if (custom.length === 0) return null;

    return (
        <>
            {custom.map(sec => (
                <div key={sec.id} className={sectionClass}>
                    <h2 className={titleClass}>{sec.title}</h2>
                    <ul className={bulletsClass}>
                        {sec.items.filter(i => i.trim()).map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </>
    );
};

export default CustomSections;
