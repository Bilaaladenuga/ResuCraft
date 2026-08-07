import { TemplateConfig } from '../types';
import TechTemplate from './TechTemplate';
import FinanceTemplate from './FinanceTemplate';
import HealthcareTemplate from './HealthcareTemplate';
import CreativeTemplate from './CreativeTemplate';
import GeneralTemplate from './GeneralTemplate';
import LegalTemplate from './LegalTemplate';
import EducationTemplate from './EducationTemplate';
import MinimalTemplate from './MinimalTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import ModernTemplate from './ModernTemplate';
import MarketingTemplate from './MarketingTemplate';
import DataTemplate from './DataTemplate';
import EngineeringTemplate from './EngineeringTemplate';
import HospitalityTemplate from './HospitalityTemplate';
import AdminTemplate from './AdminTemplate';

const templates: Record<string, TemplateConfig> = {
    tech: {
        id: 'tech',
        name: 'Tech / IT',
        component: TechTemplate,
        industry: 'technology',
        roles: ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'DevOps Engineer', 'Cloud Engineer', 'Cybersecurity Analyst', 'QA Engineer', 'Data Scientist', 'ML Engineer', 'Data Analyst']
    },
    finance: {
        id: 'finance',
        name: 'Finance',
        component: FinanceTemplate,
        industry: 'finance',
        roles: ['Financial Analyst', 'Accountant', 'Investment Banker', 'Auditor', 'Financial Planner', 'Credit Analyst', 'Controller']
    },
    healthcare: {
        id: 'healthcare',
        name: 'Healthcare',
        component: HealthcareTemplate,
        industry: 'healthcare',
        roles: ['Registered Nurse', 'Physician / Medical Doctor', 'Physician Assistant', 'Pharmacist', 'Physical Therapist', 'Healthcare Administrator', 'Medical Technician']
    },
    creative: {
        id: 'creative',
        name: 'Creative / Design',
        component: CreativeTemplate,
        industry: 'creative design',
        roles: ['Graphic Designer', 'UI/UX Designer', 'Art Director', 'Illustrator', 'Motion Designer', 'Brand Designer']
    },
    general: {
        id: 'general',
        name: 'General',
        component: GeneralTemplate,
        industry: 'general',
        roles: ['Business Analyst', 'Project Manager', 'Operations Manager', 'Customer Success Manager', 'HR Generalist', 'Any Role']
    },
    legal: {
        id: 'legal',
        name: 'Legal / Consulting',
        component: LegalTemplate,
        industry: 'legal',
        roles: ['Attorney / Lawyer', 'Paralegal', 'Corporate Counsel', 'Legal Assistant', 'Compliance Officer']
    },
    education: {
        id: 'education',
        name: 'Education',
        component: EducationTemplate,
        industry: 'education',
        roles: ['Teacher', 'Professor / Lecturer', 'Instructional Designer', 'Academic Advisor', 'Curriculum Developer']
    },
    minimal: {
        id: 'minimal',
        name: 'Minimal',
        component: MinimalTemplate,
        industry: 'universal',
        roles: ['Recent Graduates', 'Career Changers', 'Internships', 'Any Role']
    },
    executive: {
        id: 'executive',
        name: 'Executive',
        component: ExecutiveTemplate,
        industry: 'leadership',
        roles: ['CEO', 'COO', 'CTO', 'Vice President', 'Department Director', 'Head of Department', 'Senior Consultant', 'Managing Director']
    },
    modern: {
        id: 'modern',
        name: 'Modern',
        component: ModernTemplate,
        industry: 'contemporary',
        roles: ['Product Manager', 'Startup Founder', 'Marketing Manager', 'Operations Lead', 'Tech Generalist', 'Business Analyst']
    },
    marketing: {
        id: 'marketing',
        name: 'Marketing / Sales',
        component: MarketingTemplate,
        industry: 'marketing',
        roles: ['Marketing Manager', 'Sales Representative', 'Digital Marketing Specialist', 'SEO Specialist', 'Content Marketer', 'Growth Marketer', 'Account Executive', 'Brand Manager']
    },
    data: {
        id: 'data',
        name: 'Data & ML',
        component: DataTemplate,
        industry: 'data',
        roles: ['Data Scientist', 'ML Engineer', 'Data Analyst', 'Business Intelligence Analyst', 'MLOps Engineer', 'Data Engineer', 'Data Architect', 'Statistician']
    },
    engineering: {
        id: 'engineering',
        name: 'Engineering',
        component: EngineeringTemplate,
        industry: 'engineering',
        roles: ['Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Chemical Engineer', 'Industrial Engineer', 'Structural Engineer', 'Aerospace Engineer', 'Manufacturing Engineer', 'Environmental Engineer']
    },
    hospitality: {
        id: 'hospitality',
        name: 'Hospitality / Retail',
        component: HospitalityTemplate,
        industry: 'hospitality',
        roles: ['Hotel Manager', 'Restaurant Manager', 'Retail Store Manager', 'Event Coordinator', 'Barista', 'Front-of-House Supervisor', 'Guest Services Associate']
    },
    admin: {
        id: 'admin',
        name: 'Administrative',
        component: AdminTemplate,
        industry: 'administration',
        roles: ['Executive Assistant', 'Office Manager', 'HR Coordinator', 'Receptionist', 'Operations Coordinator', 'Administrative Assistant', 'Office Administrator']
    }
};

export const getTemplate = (id: string): TemplateConfig => templates[id] || templates.general;
export const getAllTemplates = (): TemplateConfig[] => Object.values(templates);
export default templates;
