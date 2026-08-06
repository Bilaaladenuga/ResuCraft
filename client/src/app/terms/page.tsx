import type { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';

const SITE_URL = 'https://resu-craft-smoky.vercel.app';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description:
        'The terms governing your use of ResuCraft, the free AI-powered resume builder. Review before using the service.',
    openGraph: {
        title: 'Terms of Service | ResuCraft',
        description: 'The terms governing your use of ResuCraft.',
        url: `${SITE_URL}/terms`,
        siteName: 'ResuCraft',
        locale: 'en_US',
        type: 'website',
    },
};

export default function TermsPage() {
    return (
        <LegalPage
            title="Terms of Service"
            updated="August 6, 2026"
            intro="Welcome to ResuCraft. By using this free resume builder, you agree to the terms below. They are written in plain language — please read them."
            sections={[
                {
                    heading: '1. The service',
                    paragraphs: [
                        'ResuCraft is a free, browser-based tool that helps you create, customize, and export resumes and cover letters. It offers AI-assisted writing features that require you to provide your own API key.',
                        'The service is provided free of charge and without an account requirement. Your data is stored locally in your browser (see the Privacy Policy).',
                    ],
                },
                {
                    heading: '2. Your responsibilities',
                    paragraphs: [
                        'You are responsible for the accuracy of the information you enter into your resume. Resumes are used for job applications, so make sure your details are truthful and current.',
                        'If you choose to use AI features with your own API key, you are responsible for that key and for complying with the terms of your chosen provider.',
                    ],
                },
                {
                    heading: '3. AI-generated content',
                    paragraphs: [
                        'AI-generated text (summaries, bullet points, translations, cover letters) is produced by large language models and may contain errors, inaccuracies, or outdated information.',
                        'You are responsible for reviewing and editing all AI-generated content before using it in a real application. Never include false claims in a resume, whether AI-written or not.',
                    ],
                },
                {
                    heading: '4. Ownership',
                    paragraphs: [
                        'You own the resume content you create. ResuCraft grants you a non-exclusive, revocable license to use the application and its templates for your personal, non-commercial career purposes.',
                        'The ResuCraft application, its design, templates, and branding remain the property of ResuCraft and its developer.',
                    ],
                },
                {
                    heading: '5. No warranty',
                    paragraphs: [
                        'ResuCraft is provided \u201cas is\u201d and \u201cas available.\u201d While we work hard to make it reliable, we make no guarantees that it will be uninterrupted, error-free, or that using it will result in interviews or job offers.',
                        'ATS compatibility and resume scores are best-effort guidance based on common industry practices — they are not a guarantee of any outcome.',
                    ],
                },
                {
                    heading: '6. Limitation of liability',
                    paragraphs: [
                        'To the maximum extent permitted by law, ResuCraft and its developer are not liable for any indirect, incidental, or consequential damages arising from your use of the service, including lost opportunities or employment outcomes.',
                    ],
                },
                {
                    heading: '7. Changes to these terms',
                    paragraphs: [
                        'We may update these terms from time to time. The \u201cLast updated\u201d date at the top of this page reflects the most recent version. Continued use of the service after changes constitutes acceptance of the new terms.',
                    ],
                },
                {
                    heading: '8. Contact',
                    paragraphs: [
                        'Questions about these terms? Email us at adenugabilaal75@gmail.com.',
                    ],
                },
            ]}
        />
    );
}
