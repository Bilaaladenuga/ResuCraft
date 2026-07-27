/* ============================================
   Role Layouts — role-aware section ordering
   Phase 3: Each role gets a custom section order
   and heading overrides for their ideal resume layout
   ============================================ */

export type SectionId = 'summary' | 'experience' | 'education' | 'projects' | 'skills' | 'achievements';

export interface SectionConfig {
    id: SectionId;
    heading: string;
}

/* ---- Default order per template (current behavior) ---- */
const DEFAULT_SECTIONS: Record<string, SectionConfig[]> = {
    tech: [
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'summary', heading: 'Summary' },
        { id: 'projects', heading: 'Projects' },
        { id: 'experience', heading: 'Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Achievements' },
    ],
    finance: [
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Core Competencies' },
        { id: 'achievements', heading: 'Awards & Certifications' },
        { id: 'projects', heading: 'Key Projects' },
    ],
    healthcare: [
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'experience', heading: 'Clinical Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'projects', heading: 'Research & Projects' },
    ],
    creative: [
        { id: 'summary', heading: 'About Me' },
        { id: 'skills', heading: 'Expertise' },
        { id: 'projects', heading: 'Portfolio' },
        { id: 'experience', heading: 'Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Awards' },
    ],
    general: [
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'experience', heading: 'Work Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Skills' },
        { id: 'projects', heading: 'Projects' },
        { id: 'achievements', heading: 'Achievements' },
    ],
    legal: [
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Areas of Expertise' },
        { id: 'achievements', heading: 'Bar Admissions & Certifications' },
        { id: 'projects', heading: 'Publications & Key Matters' },
    ],
    education: [
        { id: 'summary', heading: 'Academic Profile' },
        { id: 'education', heading: 'Education' },
        { id: 'experience', heading: 'Teaching & Professional Experience' },
        { id: 'achievements', heading: 'Grants, Awards & Research' },
        { id: 'projects', heading: 'Publications & Projects' },
        { id: 'skills', heading: 'Research Areas & Skills' },
    ],
};

/* ---- Role-specific overrides ---- */
const ROLE_SECTION_OVERRIDES: Record<string, SectionConfig[]> = {
    /* -- Tech roles -- */
    'software-engineer': [
        { id: 'projects', heading: 'Projects & Technical Work' },
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'summary', heading: 'Summary' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Achievements & Certifications' },
    ],
    'frontend-developer': [
        { id: 'skills', heading: 'Frontend Skills' },
        { id: 'projects', heading: 'Projects & Portfolio' },
        { id: 'experience', heading: 'Experience' },
        { id: 'summary', heading: 'Summary' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Achievements' },
    ],
    'data-scientist': [
        { id: 'education', heading: 'Education & Research Background' },
        { id: 'skills', heading: 'Technical Skills & Tools' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Research & Projects' },
        { id: 'summary', heading: 'Summary' },
        { id: 'achievements', heading: 'Publications & Awards' },
    ],
    'devops-engineer': [
        { id: 'skills', heading: 'DevOps & Infrastructure Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Infrastructure Projects' },
        { id: 'summary', heading: 'Summary' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Certifications' },
    ],
    'product-manager': [
        { id: 'experience', heading: 'Product Experience' },
        { id: 'achievements', heading: 'Key Achievements' },
        { id: 'projects', heading: 'Product Launches & Projects' },
        { id: 'skills', heading: 'Product Skills' },
        { id: 'summary', heading: 'Summary' },
        { id: 'education', heading: 'Education' },
    ],

    /* -- Finance roles -- */
    'accountant': [
        { id: 'skills', heading: 'Core Competencies' },
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'achievements', heading: 'Certifications & Licenses' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Key Engagements' },
    ],
    'financial-analyst': [
        { id: 'experience', heading: 'Analytical Experience' },
        { id: 'skills', heading: 'Analytical Skills & Tools' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Certifications & Awards' },
        { id: 'projects', heading: 'Key Projects' },
        { id: 'summary', heading: 'Summary' },
    ],
    'investment-banker': [
        { id: 'experience', heading: 'Transaction Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Financial Skills' },
        { id: 'achievements', heading: 'Deal Highlights' },
        { id: 'projects', heading: 'Key Transactions' },
        { id: 'summary', heading: 'Summary' },
    ],

    /* -- Healthcare roles -- */
    'registered-nurse': [
        { id: 'experience', heading: 'Clinical Experience' },
        { id: 'skills', heading: 'Clinical Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Research & Projects' },
        { id: 'achievements', heading: 'Certifications & Licenses' },
    ],
    'medical-doctor': [
        { id: 'education', heading: 'Medical Education' },
        { id: 'skills', heading: 'Medical Skills' },
        { id: 'experience', heading: 'Clinical Experience' },
        { id: 'achievements', heading: 'Board Certifications' },
        { id: 'projects', heading: 'Research & Publications' },
        { id: 'summary', heading: 'Summary' },
    ],
    'healthcare-administrator': [
        { id: 'experience', heading: 'Administrative Experience' },
        { id: 'skills', heading: 'Management Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Achievements & Certifications' },
        { id: 'summary', heading: 'Summary' },
        { id: 'projects', heading: 'Strategic Projects' },
    ],

    /* -- Creative roles -- */
    'graphic-designer': [
        { id: 'projects', heading: 'Portfolio' },
        { id: 'skills', heading: 'Design Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'About Me' },
        { id: 'achievements', heading: 'Awards' },
    ],
    'ui-ux-designer': [
        { id: 'projects', heading: 'Portfolio & Case Studies' },
        { id: 'skills', heading: 'Design & Research Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'About Me' },
        { id: 'achievements', heading: 'Awards' },
    ],
    'art-director': [
        { id: 'experience', heading: 'Creative Direction Experience' },
        { id: 'projects', heading: 'Campaigns & Portfolio' },
        { id: 'skills', heading: 'Creative Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'About Me' },
        { id: 'achievements', heading: 'Awards & Recognition' },
    ],

    /* -- Legal roles -- */
    'attorney': [
        { id: 'education', heading: 'Legal Education' },
        { id: 'experience', heading: 'Legal Experience' },
        { id: 'skills', heading: 'Areas of Expertise' },
        { id: 'achievements', heading: 'Bar Admissions & Certifications' },
        { id: 'projects', heading: 'Publications & Key Cases' },
        { id: 'summary', heading: 'Professional Summary' },
    ],
    'paralegal': [
        { id: 'skills', heading: 'Paralegal Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Summary' },
        { id: 'achievements', heading: 'Certifications' },
        { id: 'projects', heading: 'Key Matters' },
    ],
    'corporate-counsel': [
        { id: 'experience', heading: 'Corporate Legal Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Legal Expertise' },
        { id: 'achievements', heading: 'Bar Admissions' },
        { id: 'projects', heading: 'Transactions & Publications' },
        { id: 'summary', heading: 'Summary' },
    ],

    /* -- Education roles -- */
    'teacher': [
        { id: 'experience', heading: 'Teaching Experience' },
        { id: 'skills', heading: 'Teaching Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Awards & Certifications' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Curriculum Projects' },
    ],
    'professor': [
        { id: 'education', heading: 'Academic Background' },
        { id: 'achievements', heading: 'Grants, Awards & Fellowships' },
        { id: 'projects', heading: 'Publications & Research' },
        { id: 'experience', heading: 'Teaching & Academic Experience' },
        { id: 'skills', heading: 'Research Areas' },
        { id: 'summary', heading: 'Academic Profile' },
    ],
    'instructional-designer': [
        { id: 'projects', heading: 'E-Learning Portfolio' },
        { id: 'skills', heading: 'Instructional Design Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Summary' },
        { id: 'achievements', heading: 'Certifications' },
    ],

    /* -- General roles -- */
    'business-analyst': [
        { id: 'skills', heading: 'Business Analysis Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Key Projects' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Summary' },
        { id: 'achievements', heading: 'Certifications' },
    ],
    'project-manager': [
        { id: 'experience', heading: 'Project Management Experience' },
        { id: 'achievements', heading: 'Key Achievements' },
        { id: 'skills', heading: 'Management Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Summary' },
        { id: 'projects', heading: 'Notable Projects' },
    ],
    'sales-representative': [
        { id: 'experience', heading: 'Sales Experience' },
        { id: 'achievements', heading: 'Sales Achievements' },
        { id: 'skills', heading: 'Sales Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Summary' },
        { id: 'projects', heading: 'Key Accounts & Campaigns' },
    ],
    'marketing-coordinator': [
        { id: 'projects', heading: 'Campaign Portfolio' },
        { id: 'skills', heading: 'Marketing Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Campaign Results' },
        { id: 'summary', heading: 'Summary' },
    ],
    'hr-coordinator': [
        { id: 'experience', heading: 'HR Experience' },
        { id: 'skills', heading: 'HR Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Certifications' },
        { id: 'summary', heading: 'Summary' },
        { id: 'projects', heading: 'HR Initiatives' },
    ],
};

/** Get the section order for a given template and optional role */
export function getSectionOrder(templateId: string, roleId?: string): SectionConfig[] {
    if (roleId && ROLE_SECTION_OVERRIDES[roleId]) {
        return ROLE_SECTION_OVERRIDES[roleId];
    }
    return DEFAULT_SECTIONS[templateId] || DEFAULT_SECTIONS.general;
}
