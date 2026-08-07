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
    minimal: [
        { id: 'summary', heading: 'Profile' },
        { id: 'experience', heading: 'Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Skills' },
        { id: 'projects', heading: 'Projects' },
        { id: 'achievements', heading: 'Achievements' },
    ],
    executive: [
        { id: 'summary', heading: 'Executive Profile' },
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'achievements', heading: 'Key Accomplishments' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Leadership Competencies' },
        { id: 'projects', heading: 'Selected Engagements' },
    ],
    modern: [
        { id: 'summary', heading: 'About Me' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Selected Work' },
        { id: 'skills', heading: 'Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Awards & Recognition' },
    ],
    marketing: [
        { id: 'summary', heading: 'Profile' },
        { id: 'experience', heading: 'Marketing Experience' },
        { id: 'achievements', heading: 'Campaign Results' },
        { id: 'skills', heading: 'Core Skills' },
        { id: 'projects', heading: 'Campaigns & Projects' },
        { id: 'education', heading: 'Education' },
    ],
    data: [
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Projects & Analyses' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Publications & Awards' },
    ],
    engineering: [
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'experience', heading: 'Engineering Experience' },
        { id: 'projects', heading: 'Projects & Systems' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications & Awards' },
    ],
    hospitality: [
        { id: 'summary', heading: 'Profile' },
        { id: 'experience', heading: 'Experience' },
        { id: 'skills', heading: 'Skills' },
        { id: 'achievements', heading: 'Service Highlights' },
        { id: 'education', heading: 'Education' },
        { id: 'projects', heading: 'Projects' },
    ],
    admin: [
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'experience', heading: 'Experience' },
        { id: 'skills', heading: 'Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Achievements' },
        { id: 'projects', heading: 'Projects' },
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
    'operations-manager': [
        { id: 'experience', heading: 'Operations Experience' },
        { id: 'achievements', heading: 'Key Achievements' },
        { id: 'skills', heading: 'Management Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Key Projects' },
    ],
    'customer-success-manager': [
        { id: 'experience', heading: 'Customer Success Experience' },
        { id: 'achievements', heading: 'Key Achievements' },
        { id: 'skills', heading: 'Customer Success Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Key Programs' },
    ],

    /* -- Engineering disciplines -- */
    'civil-engineer': [
        { id: 'skills', heading: 'Core Skills & Tools' },
        { id: 'experience', heading: 'Engineering Experience' },
        { id: 'projects', heading: 'Projects & Designs' },
        { id: 'education', heading: 'Education & Licensure' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications & Awards' },
    ],
    'mechanical-engineer': [
        { id: 'skills', heading: 'Core Skills & Tools' },
        { id: 'experience', heading: 'Engineering Experience' },
        { id: 'projects', heading: 'Projects & Designs' },
        { id: 'education', heading: 'Education & Licensure' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications & Awards' },
    ],
    'electrical-engineer': [
        { id: 'skills', heading: 'Core Skills & Tools' },
        { id: 'experience', heading: 'Engineering Experience' },
        { id: 'projects', heading: 'Projects & Systems' },
        { id: 'education', heading: 'Education & Licensure' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications & Awards' },
    ],
    'chemical-engineer': [
        { id: 'skills', heading: 'Core Skills & Tools' },
        { id: 'experience', heading: 'Process Engineering Experience' },
        { id: 'projects', heading: 'Process & Plant Projects' },
        { id: 'education', heading: 'Education & Licensure' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications & Awards' },
    ],
    'structural-engineer': [
        { id: 'skills', heading: 'Core Skills & Tools' },
        { id: 'experience', heading: 'Structural Engineering Experience' },
        { id: 'projects', heading: 'Structures & Projects' },
        { id: 'education', heading: 'Education & Licensure' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications & Awards' },
    ],
    'manufacturing-engineer': [
        { id: 'skills', heading: 'Core Skills & Tools' },
        { id: 'experience', heading: 'Manufacturing Experience' },
        { id: 'projects', heading: 'Process Improvement Projects' },
        { id: 'education', heading: 'Education & Licensure' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications & Awards' },
    ],

    /* -- Data & ML roles -- */
    'ml-engineer': [
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'ML Projects' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Publications & Awards' },
    ],
    'data-analyst': [
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Projects & Dashboards' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications' },
    ],
    'data-engineer': [
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Data Projects' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications' },
    ],
    'bi-analyst': [
        { id: 'skills', heading: 'BI Skills & Tools' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Dashboards & Projects' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications' },
    ],

    /* -- Marketing & sales roles -- */
    'marketing-manager': [
        { id: 'experience', heading: 'Marketing Experience' },
        { id: 'achievements', heading: 'Campaign Results' },
        { id: 'skills', heading: 'Marketing Skills' },
        { id: 'projects', heading: 'Campaigns & Projects' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
    ],
    'seo-specialist': [
        { id: 'skills', heading: 'SEO Skills & Tools' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'SEO Projects' },
        { id: 'achievements', heading: 'Results' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
    ],
    'content-marketer': [
        { id: 'projects', heading: 'Content Portfolio' },
        { id: 'skills', heading: 'Content Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'achievements', heading: 'Results' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
    ],
    'account-executive': [
        { id: 'experience', heading: 'Sales Experience' },
        { id: 'achievements', heading: 'Sales Achievements' },
        { id: 'skills', heading: 'Sales Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Key Accounts' },
    ],
    'brand-manager': [
        { id: 'experience', heading: 'Brand Experience' },
        { id: 'projects', heading: 'Campaigns & Launches' },
        { id: 'skills', heading: 'Brand Skills' },
        { id: 'achievements', heading: 'Awards & Recognition' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
    ],

    /* -- Hospitality & retail roles -- */
    'hotel-manager': [
        { id: 'experience', heading: 'Hospitality Experience' },
        { id: 'skills', heading: 'Management Skills' },
        { id: 'achievements', heading: 'Service Highlights' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Initiatives' },
    ],
    'restaurant-manager': [
        { id: 'experience', heading: 'Restaurant Experience' },
        { id: 'skills', heading: 'Management Skills' },
        { id: 'achievements', heading: 'Service Highlights' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Initiatives' },
    ],
    'retail-store-manager': [
        { id: 'experience', heading: 'Retail Experience' },
        { id: 'skills', heading: 'Management Skills' },
        { id: 'achievements', heading: 'Sales Highlights' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Store Initiatives' },
    ],
    'event-coordinator': [
        { id: 'projects', heading: 'Events Portfolio' },
        { id: 'experience', heading: 'Event Experience' },
        { id: 'skills', heading: 'Event Skills' },
        { id: 'achievements', heading: 'Highlights' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
    ],
    'front-of-house-supervisor': [
        { id: 'experience', heading: 'Service Experience' },
        { id: 'skills', heading: 'Service Skills' },
        { id: 'achievements', heading: 'Service Highlights' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Initiatives' },
    ],

    /* -- Administrative roles -- */
    'executive-assistant': [
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'skills', heading: 'Administrative Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Highlights' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Projects' },
    ],
    'office-manager': [
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'skills', heading: 'Office & Management Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Highlights' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Projects' },
    ],
    'administrative-assistant': [
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'skills', heading: 'Administrative Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Highlights' },
        { id: 'projects', heading: 'Projects' },
    ],
    'operations-coordinator': [
        { id: 'skills', heading: 'Operations Skills' },
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'achievements', heading: 'Highlights' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Projects' },
    ],
    'receptionist': [
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'skills', heading: 'Administrative Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Highlights' },
        { id: 'projects', heading: 'Projects' },
    ],

    /* -- Leadership roles -- */
    'ceo': [
        { id: 'summary', heading: 'Executive Profile' },
        { id: 'experience', heading: 'Leadership Experience' },
        { id: 'achievements', heading: 'Key Accomplishments' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Leadership Competencies' },
        { id: 'projects', heading: 'Selected Engagements' },
    ],
    'cto': [
        { id: 'skills', heading: 'Technical Leadership' },
        { id: 'experience', heading: 'Leadership Experience' },
        { id: 'projects', heading: 'Key Initiatives' },
        { id: 'achievements', heading: 'Key Accomplishments' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Executive Profile' },
    ],
    'department-director': [
        { id: 'experience', heading: 'Leadership Experience' },
        { id: 'achievements', heading: 'Key Accomplishments' },
        { id: 'skills', heading: 'Management Competencies' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Executive Profile' },
        { id: 'projects', heading: 'Key Initiatives' },
    ],

    'backend-developer': [
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Projects & Systems' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications' },
    ],

    'full-stack-developer': [
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Projects & Systems' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications' },
    ],

    'qa-engineer': [
        { id: 'skills', heading: 'Testing & QA Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Automation Projects' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications' },
    ],

    'cloud-engineer': [
        { id: 'skills', heading: 'Cloud & Infrastructure Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Infrastructure Projects' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications' },
    ],

    'cybersecurity-analyst': [
        { id: 'skills', heading: 'Security Skills & Tools' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Security Initiatives' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications' },
    ],

    'auditor': [
        { id: 'skills', heading: 'Core Competencies' },
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'achievements', heading: 'Certifications & Licenses' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Key Engagements' },
    ],

    'controller': [
        { id: 'skills', heading: 'Core Competencies' },
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'achievements', heading: 'Certifications & Licenses' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Key Engagements' },
    ],

    'credit-analyst': [
        { id: 'skills', heading: 'Core Competencies' },
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'achievements', heading: 'Certifications & Licenses' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Key Engagements' },
    ],

    'financial-planner': [
        { id: 'skills', heading: 'Core Competencies' },
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'achievements', heading: 'Certifications & Licenses' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Key Engagements' },
    ],

    'physician-assistant': [
        { id: 'experience', heading: 'Clinical Experience' },
        { id: 'skills', heading: 'Clinical Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Certifications & Licenses' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Research & Projects' },
    ],

    'physical-therapist': [
        { id: 'experience', heading: 'Clinical Experience' },
        { id: 'skills', heading: 'Clinical Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Certifications & Licenses' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Research & Projects' },
    ],

    'pharmacist': [
        { id: 'experience', heading: 'Clinical Experience' },
        { id: 'skills', heading: 'Clinical Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Certifications & Licenses' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Research & Projects' },
    ],

    'medical-technician': [
        { id: 'experience', heading: 'Clinical Experience' },
        { id: 'skills', heading: 'Clinical Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Certifications & Licenses' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Research & Projects' },
    ],

    'illustrator': [
        { id: 'projects', heading: 'Portfolio' },
        { id: 'skills', heading: 'Creative Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'About Me' },
        { id: 'achievements', heading: 'Awards' },
    ],

    'motion-designer': [
        { id: 'projects', heading: 'Portfolio' },
        { id: 'skills', heading: 'Creative Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'About Me' },
        { id: 'achievements', heading: 'Awards' },
    ],

    'brand-designer': [
        { id: 'projects', heading: 'Portfolio' },
        { id: 'skills', heading: 'Creative Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'About Me' },
        { id: 'achievements', heading: 'Awards' },
    ],

    'legal-assistant': [
        { id: 'education', heading: 'Legal Education' },
        { id: 'experience', heading: 'Legal Experience' },
        { id: 'skills', heading: 'Areas of Expertise' },
        { id: 'achievements', heading: 'Bar Admissions & Certifications' },
        { id: 'projects', heading: 'Publications & Key Matters' },
        { id: 'summary', heading: 'Professional Summary' },
    ],

    'compliance-officer': [
        { id: 'experience', heading: 'Compliance Experience' },
        { id: 'skills', heading: 'Compliance Skills' },
        { id: 'achievements', heading: 'Certifications & Audits' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Compliance Programs' },
    ],

    'academic-advisor': [
        { id: 'experience', heading: 'Teaching Experience' },
        { id: 'skills', heading: 'Teaching Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Awards & Certifications' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Curriculum Projects' },
    ],

    'curriculum-developer': [
        { id: 'experience', heading: 'Teaching Experience' },
        { id: 'skills', heading: 'Teaching Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Awards & Certifications' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Curriculum Projects' },
    ],

    'hr-generalist': [
        { id: 'experience', heading: 'HR Experience' },
        { id: 'skills', heading: 'HR Skills' },
        { id: 'achievements', heading: 'Certifications' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'HR Initiatives' },
    ],

    'digital-marketing-specialist': [
        { id: 'experience', heading: 'Marketing Experience' },
        { id: 'achievements', heading: 'Campaign Results' },
        { id: 'skills', heading: 'Marketing Skills' },
        { id: 'projects', heading: 'Campaigns & Projects' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
    ],

    'growth-marketer': [
        { id: 'experience', heading: 'Marketing Experience' },
        { id: 'achievements', heading: 'Campaign Results' },
        { id: 'skills', heading: 'Marketing Skills' },
        { id: 'projects', heading: 'Campaigns & Projects' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
    ],

    'aerospace-engineer': [
        { id: 'skills', heading: 'Core Skills & Tools' },
        { id: 'experience', heading: 'Engineering Experience' },
        { id: 'projects', heading: 'Projects & Designs' },
        { id: 'education', heading: 'Education & Licensure' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications & Awards' },
    ],

    'industrial-engineer': [
        { id: 'skills', heading: 'Core Skills & Tools' },
        { id: 'experience', heading: 'Engineering Experience' },
        { id: 'projects', heading: 'Projects & Designs' },
        { id: 'education', heading: 'Education & Licensure' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications & Awards' },
    ],

    'environmental-engineer': [
        { id: 'skills', heading: 'Core Skills & Tools' },
        { id: 'experience', heading: 'Engineering Experience' },
        { id: 'projects', heading: 'Projects & Designs' },
        { id: 'education', heading: 'Education & Licensure' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications & Awards' },
    ],

    'data-architect': [
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Projects & Analyses' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Publications & Awards' },
    ],

    'mlops-engineer': [
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Projects & Analyses' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Publications & Awards' },
    ],

    'statistician': [
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Projects & Analyses' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Publications & Awards' },
    ],

    'barista': [
        { id: 'experience', heading: 'Service Experience' },
        { id: 'skills', heading: 'Service Skills' },
        { id: 'achievements', heading: 'Service Highlights' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Initiatives' },
    ],

    'guest-services-associate': [
        { id: 'experience', heading: 'Service Experience' },
        { id: 'skills', heading: 'Service Skills' },
        { id: 'achievements', heading: 'Service Highlights' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Initiatives' },
    ],

    'office-administrator': [
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'skills', heading: 'Administrative Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Highlights' },
        { id: 'summary', heading: 'Profile' },
        { id: 'projects', heading: 'Projects' },
    ],

    'coo': [
        { id: 'summary', heading: 'Executive Profile' },
        { id: 'experience', heading: 'Leadership Experience' },
        { id: 'achievements', heading: 'Key Accomplishments' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Leadership Competencies' },
        { id: 'projects', heading: 'Selected Engagements' },
    ],

    'vice-president': [
        { id: 'summary', heading: 'Executive Profile' },
        { id: 'experience', heading: 'Leadership Experience' },
        { id: 'achievements', heading: 'Key Accomplishments' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Leadership Competencies' },
        { id: 'projects', heading: 'Selected Engagements' },
    ],

    'head-of-department': [
        { id: 'summary', heading: 'Executive Profile' },
        { id: 'experience', heading: 'Leadership Experience' },
        { id: 'achievements', heading: 'Key Accomplishments' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Leadership Competencies' },
        { id: 'projects', heading: 'Selected Engagements' },
    ],

    'senior-consultant': [
        { id: 'summary', heading: 'Executive Profile' },
        { id: 'experience', heading: 'Leadership Experience' },
        { id: 'achievements', heading: 'Key Accomplishments' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Leadership Competencies' },
        { id: 'projects', heading: 'Selected Engagements' },
    ],

    'managing-director': [
        { id: 'summary', heading: 'Executive Profile' },
        { id: 'experience', heading: 'Leadership Experience' },
        { id: 'achievements', heading: 'Key Accomplishments' },
        { id: 'education', heading: 'Education' },
        { id: 'skills', heading: 'Leadership Competencies' },
        { id: 'projects', heading: 'Selected Engagements' },
    ],

    'startup-founder': [
        { id: 'summary', heading: 'Founder Profile' },
        { id: 'experience', heading: 'Founding Experience' },
        { id: 'projects', heading: 'Products & Launches' },
        { id: 'skills', heading: 'Core Skills' },
        { id: 'achievements', heading: 'Key Milestones' },
        { id: 'education', heading: 'Education' },
    ],

    'operations-lead': [
        { id: 'experience', heading: 'Professional Experience' },
        { id: 'skills', heading: 'Core Skills' },
        { id: 'education', heading: 'Education' },
        { id: 'achievements', heading: 'Key Achievements' },
        { id: 'summary', heading: 'Professional Summary' },
        { id: 'projects', heading: 'Key Projects' },
    ],

    'tech-generalist': [
        { id: 'skills', heading: 'Technical Skills' },
        { id: 'experience', heading: 'Experience' },
        { id: 'projects', heading: 'Projects & Systems' },
        { id: 'education', heading: 'Education' },
        { id: 'summary', heading: 'Profile' },
        { id: 'achievements', heading: 'Certifications' },
    ],
};

/** Get the section order for a given template and optional role */
export function getSectionOrder(templateId: string, roleId?: string): SectionConfig[] {
    if (roleId && ROLE_SECTION_OVERRIDES[roleId]) {
        return ROLE_SECTION_OVERRIDES[roleId];
    }
    return DEFAULT_SECTIONS[templateId] || DEFAULT_SECTIONS.general;
}
