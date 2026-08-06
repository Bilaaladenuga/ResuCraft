'use client';
import React from 'react';
import LegalTopBar from './LegalTopBar';

export interface LegalSection {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
}

interface LegalPageProps {
    title: string;
    updated: string;
    intro: string;
    sections: LegalSection[];
}

const LegalPage: React.FC<LegalPageProps> = ({ title, updated, intro, sections }) => {
    return (
        <div className="legal-page">
            {/* Slim top bar (non-fixed, so it scrolls with the page) */}
            <LegalTopBar />

            <main className="legal-content">
                <div className="section-label">Legal</div>
                <h1>{title}</h1>
                <p className="legal-updated">Last updated: {updated}</p>
                <p className="legal-intro">{intro}</p>

                {sections.map(section => (
                    <div key={section.heading} className="legal-section">
                        <h2>{section.heading}</h2>
                        {section.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                        {section.bullets && (
                            <ul>
                                {section.bullets.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                        )}
                    </div>
                ))}
            </main>

            <footer className="legal-footer">
                &copy; 2026 ResuCraft. Built by Bilaal — All Rights Reserved.
            </footer>
        </div>
    );
};

export default LegalPage;
