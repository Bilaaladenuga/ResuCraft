import type { Metadata } from 'next';
import LandingPage from '../components/LandingPage';

export const metadata: Metadata = {
    title: 'AI Resume Builder — Free ATS-Friendly Templates & Tools',
    description:
        'Create a standout resume in minutes with ResuCraft. AI-powered tools, 7 industry-specific templates, ATS optimization, and real-time preview. No sign-up required.',
    openGraph: {
        title: 'ResuCraft — Free AI Resume Builder',
        description:
            'Create a standout resume in minutes with ResuCraft. AI-powered tools, 7 industry templates, and ATS optimization.',
    },
};

export default function Page() {
    return <LandingPage />;
}
