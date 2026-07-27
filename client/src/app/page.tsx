import type { Metadata } from 'next';
import LandingPage from '../components/LandingPage';

const SITE_URL = 'https://resu-craft-smoky.vercel.app';

export const metadata: Metadata = {
    title: 'AI Resume Builder — Free ATS-Friendly Templates & Tools',
    description:
        'Create a standout resume in minutes with ResuCraft. AI-powered tools, 7 industry-specific templates, ATS optimization, and real-time preview. No sign-up required.',
    openGraph: {
        title: 'ResuCraft — Free AI Resume Builder',
        description:
            'Create a standout resume in minutes with ResuCraft. AI-powered tools, 7 industry templates, and ATS optimization.',
        url: SITE_URL,
        siteName: 'ResuCraft',
        locale: 'en_US',
        type: 'website',
    },
};

export default function Page() {
    return <LandingPage />;
}
