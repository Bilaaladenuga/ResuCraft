import './globals.css';
import React from 'react';
import type { Metadata, Viewport } from 'next';
import ToastProvider from '../components/ToastContext';
import ThemeProvider from '../components/ThemeContext';
import FeedbackButton from '../components/FeedbackButton';

const SITE_URL = 'https://resu-craft-smoky.vercel.app';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'ResuCraft — AI Resume Builder & Career Strategist',
        template: '%s | ResuCraft',
    },
    description:
        'Build professional, ATS-friendly resumes with AI-powered assistance. Choose from 7 industry-specific templates, optimize for job descriptions, and export as PDF or DOCX — 100% free.',
    keywords: [
        'resume builder',
        'AI resume builder',
        'ATS-friendly resume',
        'free resume template',
        'resume creator',
        'job application',
        'career',
        'CV maker',
        'professional resume',
        'resume generator',
    ],
    authors: [{ name: 'Bilaal', url: SITE_URL }],
    creator: 'Bilaal',
    publisher: 'ResuCraft',
    openGraph: {
        title: 'ResuCraft — AI Resume Builder & Career Strategist',
        description:
            'Build professional, ATS-friendly resumes with AI-powered assistance. Choose from 7 industry-specific templates.',
        url: SITE_URL,
        siteName: 'ResuCraft',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ResuCraft — AI Resume Builder',
        description:
            'Build professional, ATS-friendly resumes with AI-powered assistance.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
    },
    manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: dark)', color: '#060a14' },
        { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
            <head>
                {/* Google Fonts: Outfit (headings) + Inter (body) */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />

                {/* Google Search Console verification */}
                <meta
                    name="google-site-verification"
                    content="t5sT4BNpi-zHmKh2Zj5mKFiDhEtUUqcGLBwl1uxLktc"
                />
            </head>
            <body>
                <ThemeProvider>
                    <ToastProvider>
                        {children}
                        <FeedbackButton />
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
