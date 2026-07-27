import type { Metadata } from 'next';
import TemplateSelector from '../../components/TemplateSelector';

export const metadata: Metadata = {
    title: 'Resume Templates',
    description:
        'Choose from 7 professionally designed, ATS-friendly resume templates tailored for Tech, Finance, Healthcare, Creative, General, Legal, and Education industries.',
    openGraph: {
        title: 'Resume Templates | ResuCraft',
        description:
            'Choose from 7 ATS-friendly resume templates tailored for your industry.',
    },
};

export default function TemplatesPage() {
    return <TemplateSelector />;
}
