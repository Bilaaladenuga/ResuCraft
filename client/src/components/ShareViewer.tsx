'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, Printer, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import ResumePreview from './ResumePreview';
import { decodeSharePayload, SharePayload } from '../services/shareService';
import { getTemplate } from '../templates';

type Status = 'loading' | 'ready' | 'invalid';

const ShareViewer = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<Status>('loading');
    const [payload, setPayload] = useState<SharePayload | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const code = searchParams?.get('c');

                if (code) {
                    // Short link — fetch payload from the API
                    const res = await fetch(`/api/share?c=${encodeURIComponent(code)}`);
                    if (!res.ok) {
                        throw new Error(res.status === 404 ? 'link-expired' : 'load-failed');
                    }
                    const data = await res.json();
                    if (!data?.ok || !data.payload) throw new Error('load-failed');
                    const decoded = await decodeSharePayload(data.payload);
                    if (!cancelled) {
                        setPayload(decoded);
                        setStatus('ready');
                    }
                    return;
                }

                // Hash link — payload embedded in the URL itself
                const hash = window.location.hash;
                const match = hash.match(/^#d=([^&]+)/);
                if (!match) {
                    throw new Error('no-data');
                }
                const decoded = await decodeSharePayload(decodeURIComponent(match[1]));
                if (!cancelled) {
                    setPayload(decoded);
                    setStatus('ready');
                }
            } catch (err) {
                const msg = (err as Error)?.message || '';
                if (!cancelled) {
                    setError(
                        msg === 'link-expired'
                            ? 'This share link has expired. Ask the sender to create a new one.'
                            : 'This resume link is invalid or the data could not be read.'
                    );
                    setStatus('invalid');
                }
            }
        };

        load();
        return () => { cancelled = true; };
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className="share-viewer">
                <div className="share-viewer-center">
                    <Loader2 size={28} className="bullet-spin" style={{ color: 'var(--secondary)' }} />
                    <p>Loading shared resume…</p>
                </div>
            </div>
        );
    }

    if (status === 'invalid' || !payload) {
        return (
            <div className="share-viewer">
                <div className="share-viewer-center">
                    <AlertCircle size={34} style={{ color: 'var(--danger)', opacity: 0.8 }} />
                    <h2>Resume unavailable</h2>
                    <p style={{ maxWidth: '420px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                        {error}
                    </p>
                    <Link href="/templates" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
                        <Sparkles size={14} /> Build your own resume
                    </Link>
                </div>
            </div>
        );
    }

    const template = getTemplate(payload.t);

    return (
        <div className="share-viewer">
            {/* Top bar */}
            <div className="share-viewer-bar">
                <Link href="/" className="share-viewer-brand">
                    <Sparkles size={18} color="var(--secondary)" />
                    <span className="gradient-text">ResuCraft</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="share-viewer-badge">
                        {template.name} template
                    </span>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => window.print()}
                        title="Print this resume"
                    >
                        <Printer size={14} /> Print
                    </button>
                    <Link href="/templates" className="btn btn-primary btn-sm">
                        <Sparkles size={14} /> Build yours
                    </Link>
                </div>
            </div>

            {/* Resume sheet */}
            <div className="share-viewer-sheet">
                <ResumePreview
                    formData={payload.d}
                    templateId={payload.t}
                    customization={payload.c}
                />
            </div>

            <div className="share-viewer-footer">
                <p>
                    Shared via ResuCraft — build, optimize, and share your resume free at{' '}
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); router.push('/'); }}
                        style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}
                    >
                        resucraft.app
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ShareViewer;
