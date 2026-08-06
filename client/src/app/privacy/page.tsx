import type { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';

const SITE_URL = 'https://resu-craft-smoky.vercel.app';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description:
        'ResuCraft is privacy-first: your resume data stays in your browser, you control your own AI API keys, and nothing is sold or shared.',
    openGraph: {
        title: 'Privacy Policy | ResuCraft',
        description: 'How ResuCraft protects your data — local storage, AI keys, and more.',
        url: `${SITE_URL}/privacy`,
        siteName: 'ResuCraft',
        locale: 'en_US',
        type: 'website',
    },
};

export default function PrivacyPage() {
    return (
        <LegalPage
            title="Privacy Policy"
            updated="August 6, 2026"
            intro="ResuCraft was built with privacy as a core principle. In short: your resumes live in your browser, you control your own AI keys, and we do not sell or share your personal data."
            sections={[
                {
                    heading: '1. Where your resume data lives',
                    paragraphs: [
                        'All resume content you create — your details, work history, education, skills, and template preferences — is stored locally in your own browser using localStorage. Nothing is uploaded to our servers when you simply build, edit, or export a resume.',
                        'Because your data stays on your device, it is private to you and never appears in our databases. Clearing your browser storage will remove locally saved resumes, so we recommend using the Export JSON option to keep a backup.',
                    ],
                },
                {
                    heading: '2. AI features and API keys',
                    paragraphs: [
                        'ResuCraft offers AI-powered writing tools (summaries, bullet power-ups, skills, translation, and more). These features only work when you provide an API key from a provider of your choice — Gemini, OpenAI-compatible, OpenRouter, or a fully local Ollama instance.',
                        'Your API key is stored in your browser only, never sent to us. When you use an AI feature, the relevant resume text is sent directly to the provider you configured in order to generate a response. If you use Ollama, everything runs locally on your machine and nothing leaves it.',
                        'You can remove your key at any time via the AI Configuration settings, and the app remains fully usable without AI.',
                    ],
                },
                {
                    heading: '3. Feedback and contact',
                    paragraphs: [
                        'If you choose to submit feedback through the in-app feedback button, your message (and optionally your email address) is transmitted to the developer via a third-party email service (Web3Forms) so we can respond. Your email is used only to reply to your feedback.',
                    ],
                },
                {
                    heading: '4. Analytics and site health',
                    paragraphs: [
                        'We use Google Search Console to monitor basic site health and search visibility. This does not collect personal information or track individual users across the internet.',
                    ],
                },
                {
                    heading: '5. Third-party services',
                    bullets: [
                        'Google Fonts — loads the Outfit and Inter font files used to style the site.',
                        'AI providers you configure (Gemini, OpenAI-compatible, OpenRouter, Ollama) — receive only the text you explicitly ask to process.',
                        'Web3Forms — delivers feedback messages you voluntarily submit to the developer\u2019s email.',
                        'Google Search Console — site health and search analytics.',
                    ],
                },
                {
                    heading: '6. Your choices and deletion',
                    paragraphs: [
                        'You are in full control:',
                    ],
                    bullets: [
                        'Clear Resume removes the current resume from the builder.',
                        'Export JSON lets you download and keep a backup of your data.',
                        'Deleting your browser storage removes all locally saved resumes and settings.',
                        'Removing your AI API key from Settings stops all AI requests.',
                    ],
                },
                {
                    heading: '7. Changes to this policy',
                    paragraphs: [
                        'We may update this Privacy Policy from time to time. When we do, the \u201cLast updated\u201d date at the top of this page will change. Continued use of ResuCraft after changes means you accept the updated policy.',
                    ],
                },
                {
                    heading: '8. Contact us',
                    paragraphs: [
                        'If you have any questions about this policy or your data, email us at adenugabilaal75@gmail.com.',
                    ],
                },
            ]}
        />
    );
}
