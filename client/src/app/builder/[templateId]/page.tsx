import type { Metadata } from 'next';
import ResumeBuilder from '../../../components/ResumeBuilder';

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
};

const templateDescriptions: Record<string, string> = {
    tech: 'Skills-first layout optimized for software engineers, DevOps, and IT professionals.',
    finance: 'Conservative, experience-focused design for banking, accounting, and finance.',
    healthcare: 'Clean clinical layout for doctors, nurses, and medical professionals.',
    creative: 'Bold, expressive layout for designers, artists, and creative professionals.',
    general: 'Classic ATS-friendly layout suitable for any industry or role.',
    legal: 'Authoritative law firm layout for attorneys, paralegals, and consultants.',
    education: 'Scholarly academic layout for teachers, professors, and researchers.',
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
        },
    };
}

export default function BuilderPage() {
    return <ResumeBuilder />;
}
