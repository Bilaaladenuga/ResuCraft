'use client';
import React from 'react';
import { MessageSquare, HelpCircle, Clock, CheckCircle } from 'lucide-react';
import LegalTopBar from './LegalTopBar';

export const CONTACT_EMAIL = 'adenugabilaal75@gmail.com';

const ContactContent = () => {
    return (
        <div className="legal-page">
            {/* Slim top bar */}
            <LegalTopBar />

            <main className="legal-content">
                <div className="section-label">Contact</div>
                <h1>Get in touch</h1>
                <p className="legal-intro">
                    Questions, feedback, feature ideas, or just want to say hi? We read everything and usually reply within a day or two.
                </p>

                <div className="contact-grid">
                    {/* Email card */}
                    <div className="contact-card glass-card">
                        <div className="contact-card-icon">
                            <MessageSquare size={20} />
                        </div>
                        <h2>Email us</h2>
                        <p>For questions, bug reports, or anything else — write to us directly.</p>
                        <a className="btn btn-primary" href={`mailto:${CONTACT_EMAIL}`}>
                            <MessageSquare size={16} /> Email the team
                        </a>
                        <div className="contact-card-email">{CONTACT_EMAIL}</div>
                    </div>

                    {/* In-app feedback card */}
                    <div className="contact-card glass-card">
                        <div className="contact-card-icon contact-card-icon--accent">
                            <HelpCircle size={20} />
                        </div>
                        <h2>In-app feedback</h2>
                        <p>Spot a bug while building your resume? Use the feedback button — it's always in the corner.</p>
                        <div className="contact-note">
                            <span><CheckCircle size={14} /> Fastest way to report an issue</span>
                            <span><CheckCircle size={14} /> Optional — add your email and we can reply</span>
                        </div>
                    </div>
                </div>

                <div className="contact-response">
                    <Clock size={16} />
                    <span>Response time: usually within 24–48 hours, often much faster.</span>
                </div>
            </main>

            <footer className="legal-footer">
                &copy; 2026 ResuCraft. Built by Bilaal — All Rights Reserved.
            </footer>
        </div>
    );
};

export default ContactContent;
