import type { Metadata } from 'next';
import ResumeBuilder from '../../../components/ResumeBuilder';

const SITE_URL = 'https://resu-craft-smoky.vercel.app';

interface BuilderPageParams {
    params: Promise<{ templateId: string }>;
}

const templateNames: Record<string, string> = {
    tech: 'Tech / IT',
    finance: 'Finance',
    healthcare: 'Healthcare',
    creative: 'Creative / Design',
    general: 'General',
    legal: 'Legal / Consulting',
    education: 'Education',
    minimal: 'Minimal',
    executive: 'Executive',
    modern: 'Modern',
    marketing: 'Marketing / Sales',
    data: 'Data & ML',
    engineering: 'Engineering',
    hospitality: 'Hospitality / Retail',
    admin: 'Administrative',
};

const templateDescriptions: Record<string, string> = {
    tech: 'Skills-first layout optimized for software engineers, DevOps, and IT professionals.',
    finance: 'Conservative, experience-focused design for banking, accounting, and finance.',
    healthcare: 'Clean clinical layout for doctors, nurses, and medical professionals.',
    creative: 'Bold, expressive layout for designers, artists, and creative professionals.',
    general: 'Classic ATS-friendly layout suitable for any industry or role.',
    legal: 'Authoritative law firm layout for attorneys, paralegals, and consultants.',
    education: 'Scholarly academic layout for teachers, professors, and researchers.',
    minimal: 'Ultra-clean, whitespace-first layout that works for any industry.',
    executive: 'Sophisticated serif design for senior leaders, C-suite, and consultants.',
    modern: 'Contemporary bold-header layout with a sleek accent bar.',
    marketing: 'Results-first design built for marketers, sales, and growth roles.',
    data: 'Analytical layout for data scientists, analysts, and ML engineers.',
    engineering: 'Structured technical layout for mechanical, civil, and electrical engineers.',
    hospitality: 'Warm, personable layout for hospitality, retail, and customer-facing roles.',
    admin: 'Clean, organized layout for administrative, HR, and office support roles.',
};

export async function generateMetadata({ params }: BuilderPageParams): Promise<Metadata> {
    const resolvedParams = await params;
    const name = templateNames[resolvedParams.templateId] || 'Resume';
    const description =
        templateDescriptions[resolvedParams.templateId] ||
        `Build a professional resume with AI-powered assistance.`;

    return {
        title: `${name} Resume Builder`,
        description: `Build a professional ${name} resume with AI-powered assistance. ${description}`,
        openGraph: {
            title: `${name} Resume Builder | ResuCraft`,
            description: `Build a professional ${name} resume with AI-powered tools. ${description}`,
            url: `${SITE_URL}/builder/${resolvedParams.templateId}`,
            siteName: 'ResuCraft',
            locale: 'en_US',
            type: 'website',
        },
    };
}

export default function BuilderPage() {
    return <ResumeBuilder />;
}
