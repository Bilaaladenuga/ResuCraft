import type { Metadata } from 'next';
import TemplateSelector from '../../components/TemplateSelector';

const SITE_URL = 'https://resu-craft-smoky.vercel.app';

export const metadata: Metadata = {
    title: 'Resume Templates',
    description:
        'Choose from 15 professionally designed, ATS-friendly resume templates tailored for Tech, Finance, Healthcare, Creative, General, Legal, Education, Engineering, Data & ML, Marketing, Hospitality, Administrative, and Executive roles.',
    openGraph: {
        title: 'Resume Templates | ResuCraft',
        description:
            'Choose from 15 ATS-friendly resume templates tailored for your industry.',
        url: `${SITE_URL}/templates`,
        siteName: 'ResuCraft',
        locale: 'en_US',
        type: 'website',
    },
};

export default function TemplatesPage() {
    return <TemplateSelector />;
}
