import './globals.css';
import React from 'react';
import ToastProvider from '../components/ToastContext';

export const metadata = {
    title: 'ResuCraft',
    description: 'AI-Powered Career Strategist',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
            <body>
                <ToastProvider>{children}</ToastProvider>
            </body>
        </html>
    );
}
