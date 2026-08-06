'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';

const LegalTopBar = () => {
    const router = useRouter();

    return (
        <div className="legal-topbar">
            <a
                className="legal-topbar-brand"
                href="/"
                onClick={e => { e.preventDefault(); router.push('/'); }}
                aria-label="ResuCraft home"
            >
                <Sparkles color="var(--secondary)" size={22} />
                <span className="gradient-text">ResuCraft</span>
            </a>
            <button className="legal-back" onClick={() => router.back()} aria-label="Go back">
                <ArrowLeft size={14} /> Back
            </button>
        </div>
    );
};

export default LegalTopBar;
