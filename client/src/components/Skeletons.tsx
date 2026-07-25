'use client';
import React from 'react';

/* ---------- Base Skeleton ---------- */
const SkeletonBox = ({ width, height, borderRadius }: { width?: string; height?: string; borderRadius?: string }) => (
    <div
        style={{
            width: width || '100%',
            height: height || '1rem',
            borderRadius: borderRadius || 'var(--radius-sm)',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite',
        }}
    />
);

/* ---------- Template Grid Skeleton ---------- */
export const TemplateGridSkeleton = () => (
    <div className="template-selector">
        <div className="container" style={{ paddingTop: '8rem' }}>
            {/* Header skeleton */}
            <div style={{ textAlign: 'center', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <SkeletonBox width="120px" height="0.75rem" />
                <SkeletonBox width="300px" height="2.5rem" />
                <SkeletonBox width="450px" height="1rem" />
            </div>

            {/* Card grid skeleton */}
            <div className="template-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div
                        key={i}
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Preview area */}
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                            <SkeletonBox width="48px" height="48px" borderRadius="50%" />
                        </div>
                        {/* Info area */}
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <SkeletonBox width="60%" height="1.2rem" />
                            <SkeletonBox width="100%" height="0.75rem" />
                            <SkeletonBox width="90%" height="0.75rem" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <style>{`
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
        `}</style>
    </div>
);

/* ---------- Builder Page Skeleton ---------- */
export const BuilderSkeleton = () => (
    <div className="builder">
        {/* Navbar skeleton */}
        <nav className="navbar">
            <div className="container">
                <div className="navbar-inner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <SkeletonBox width="28px" height="28px" borderRadius="50%" />
                        <SkeletonBox width="120px" height="1.5rem" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SkeletonBox width="80px" height="1.5rem" borderRadius="4px" />
                        <SkeletonBox width="60px" height="1.5rem" borderRadius="4px" />
                        <SkeletonBox width="60px" height="1.5rem" borderRadius="4px" />
                        <SkeletonBox width="70px" height="1.5rem" borderRadius="4px" />
                        <SkeletonBox width="70px" height="1.5rem" borderRadius="4px" />
                    </div>
                </div>
            </div>
        </nav>

        {/* Builder content skeleton */}
        <div className="builder-content" style={{ paddingTop: '2rem' }}>
            {/* Left: Form skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        style={{
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{
                            padding: '1rem 1.25rem',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            background: 'rgba(255,255,255,0.02)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <SkeletonBox width="16px" height="16px" borderRadius="4px" />
                                <SkeletonBox width="100px" height="1rem" />
                            </div>
                            <SkeletonBox width="16px" height="16px" borderRadius="4px" />
                        </div>
                        <div style={{ padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <SkeletonBox width="100%" height="2.5rem" />
                            <SkeletonBox width="100%" height="2.5rem" />
                            <SkeletonBox width="100%" height="5rem" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Right: Preview skeleton */}
            <div style={{
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                minHeight: '800px',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
            }}>
                <SkeletonBox width="200px" height="2rem" />
                <SkeletonBox width="150px" height="1rem" />
                <div style={{ height: '2px', background: '#eee', width: '100%' }} />
                <SkeletonBox width="100%" height="0.8rem" />
                <SkeletonBox width="90%" height="0.8rem" />
                <SkeletonBox width="95%" height="0.8rem" />
                <div style={{ height: '1.5rem' }} />
                <SkeletonBox width="180px" height="1.2rem" />
                <SkeletonBox width="100%" height="4rem" />
                <div style={{ height: '1.5rem' }} />
                <SkeletonBox width="180px" height="1.2rem" />
                <SkeletonBox width="100%" height="4rem" />
                <div style={{ height: '1.5rem' }} />
                <SkeletonBox width="150px" height="1.2rem" />
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <SkeletonBox width="60px" height="1.5rem" borderRadius="20px" />
                    <SkeletonBox width="80px" height="1.5rem" borderRadius="20px" />
                    <SkeletonBox width="70px" height="1.5rem" borderRadius="20px" />
                    <SkeletonBox width="90px" height="1.5rem" borderRadius="20px" />
                    <SkeletonBox width="55px" height="1.5rem" borderRadius="20px" />
                </div>
            </div>
        </div>
    </div>
);

export default SkeletonBox;
