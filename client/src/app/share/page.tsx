import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ShareViewer from '../../components/ShareViewer';

export const metadata: Metadata = {
    title: 'Shared Resume',
    description: 'A resume shared with you via ResuCraft.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function SharePage() {
    return (
        <Suspense
            fallback={
                <div className="share-viewer">
                    <div className="share-viewer-center">
                        <Loader2 size={28} className="bullet-spin" style={{ color: 'var(--secondary)' }} />
                        <p>Loading shared resume…</p>
                    </div>
                </div>
            }
        >
            <ShareViewer />
        </Suspense>
    );
}
