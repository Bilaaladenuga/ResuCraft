import type { Metadata } from 'next';
import ContactContent from '../../components/ContactContent';

const SITE_URL = 'https://resu-craft-smoky.vercel.app';

export const metadata: Metadata = {
    title: 'Contact',
    description:
        'Get in touch with the ResuCraft team — questions, feedback, or feature ideas. Email us or use the in-app feedback button.',
    openGraph: {
        title: 'Contact | ResuCraft',
        description: 'Get in touch with the ResuCraft team.',
        url: `${SITE_URL}/contact`,
        siteName: 'ResuCraft',
        locale: 'en_US',
        type: 'website',
    },
};

export default function ContactPage() {
    return <ContactContent />;
}
