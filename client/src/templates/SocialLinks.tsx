import React from 'react';
import { FormData } from '../types';

/** Ensure a URL has a protocol so anchors work when clicked */
export function normalizeUrl(url: string): string {
    const trimmed = (url || '').trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
}

/** Strip protocol/www for a compact display label */
export function displayHost(url: string): string {
    try {
        return new URL(normalizeUrl(url)).hostname.replace(/^www\./, '');
    } catch {
        return (url || '').trim();
    }
}

interface SocialLinksProps {
    data: FormData;
}

/**
 * Renders the user's professional links (LinkedIn, GitHub, website) as
 * spans inside a template's contact container. Returns null when none set.
 */
const SocialLinks: React.FC<SocialLinksProps> = ({ data }) => {
    const links: Array<{ key: string; label: string; href: string }> = [];

    if (data.linkedin?.trim()) {
        links.push({ key: 'linkedin', label: 'LinkedIn', href: normalizeUrl(data.linkedin) });
    }
    if (data.github?.trim()) {
        links.push({ key: 'github', label: 'GitHub', href: normalizeUrl(data.github) });
    }
    if (data.website?.trim()) {
        links.push({ key: 'website', label: displayHost(data.website), href: normalizeUrl(data.website) });
    }

    if (links.length === 0) return null;

    return (
        <>
            {links.map(l => (
                <span key={l.key} className="social-link">
                    <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                        {l.label}
                    </a>
                </span>
            ))}
        </>
    );
};

export default SocialLinks;
