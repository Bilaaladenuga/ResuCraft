'use client';
import React, { useState } from 'react';
import { Document, Page, View, Text, StyleSheet, pdf } from '@react-pdf/renderer';
import { Download, Check } from 'lucide-react';
import { trackEvent } from '../services/track';

interface CoverLetterPDFExportProps {
    content: string;
    fileName: string;
    senderName: string;
    senderRole?: string;
    recipientName?: string;
    companyName?: string;
}

const colors = {
    primary: '#111827',
    muted: '#6b7280',
    text: '#374151',
    border: '#e5e7eb',
};

const styles = StyleSheet.create({
    page: {
        padding: '48px 56px',
        fontFamily: 'Helvetica',
        fontSize: 10.5,
        color: colors.text,
        backgroundColor: '#ffffff',
        lineHeight: 1.6,
    },
    header: {
        textAlign: 'center',
        paddingBottom: 14,
        marginBottom: 22,
        borderBottomWidth: 2,
        borderBottomColor: colors.border,
        borderBottomStyle: 'solid',
    },
    name: {
        fontSize: 20,
        fontWeight: 700,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
        marginBottom: 3,
    },
    role: {
        fontSize: 10,
        color: colors.muted,
        marginBottom: 8,
    },
    metaLine: {
        fontSize: 9,
        color: colors.muted,
        marginBottom: 3,
    },
    greeting: {
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
        marginBottom: 12,
    },
    paragraph: {
        fontSize: 10.5,
        color: colors.text,
        marginBottom: 10,
        textAlign: 'justify',
    },
    closing: {
        fontSize: 10.5,
        fontWeight: 700,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
        marginTop: 12,
        marginBottom: 4,
    },
    signature: {
        marginTop: 26,
        paddingTop: 12,
        borderTopWidth: 2,
        borderTopColor: colors.border,
        borderTopStyle: 'solid',
    },
    signatureName: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
        marginBottom: 2,
    },
    signatureRole: {
        fontSize: 9,
        color: colors.muted,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 7,
        color: colors.muted,
    },
});

const CoverLetterPDFDocument: React.FC<CoverLetterPDFExportProps> = ({
    content,
    senderName,
    senderRole,
    recipientName,
    companyName,
}) => {
    const name = senderName || 'Your Name';
    const role = senderRole || '';
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Split content into paragraphs and classify letter sections
    const paragraphs = content
        .split('\n')
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => {
            if (/^(sincerely|best regards|cheers|yours truly|thank you|warm regards)/i.test(p)) {
                return { type: 'closing' as const, text: p };
            }
            if (/^dear\s/i.test(p)) {
                return { type: 'greeting' as const, text: p };
            }
            return { type: 'body' as const, text: p };
        });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Sender header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{name}</Text>
                    {role && <Text style={styles.role}>{role}</Text>}
                    <Text style={styles.metaLine}>{today}</Text>
                    {companyName && <Text style={styles.metaLine}>Application for {companyName}</Text>}
                </View>

                {/* Body */}
                {paragraphs.map((p, i) => {
                    if (p.type === 'greeting') {
                        return <Text key={i} style={styles.greeting}>{p.text}</Text>;
                    }
                    if (p.type === 'closing') {
                        return <Text key={i} style={styles.closing}>{p.text}</Text>;
                    }
                    return <Text key={i} style={styles.paragraph}>{p.text}</Text>;
                })}

                {/* Signature */}
                <View style={styles.signature}>
                    <Text style={styles.signatureName}>{name}</Text>
                    {role && <Text style={styles.signatureRole}>{role}</Text>}
                </View>

                <Text style={styles.footer}>Generated with ResuCraft</Text>
            </Page>
        </Document>
    );
};

const CoverLetterPDFExport: React.FC<CoverLetterPDFExportProps> = (props) => {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleExport = async () => {
        if (!props.content.trim() || loading) return;
        setLoading(true);
        try {
            const blob = await pdf(<CoverLetterPDFDocument {...props} />).toBlob();
            const safeName = props.fileName
                .replace(/[\\/:*?"<>|]+/g, '')
                .replace(/\s+/g, '_')
                .trim() || 'Cover_Letter';
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${safeName}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            trackEvent('cover_letter_pdf_export');
            setDone(true);
            setTimeout(() => setDone(false), 2500);
        } catch (err) {
            console.error('Cover letter PDF export failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="btn btn-ghost btn-sm"
            onClick={handleExport}
            disabled={loading}
            title="Download as PDF"
            style={{
                padding: '0.3rem 0.5rem', fontSize: '0.65rem',
                display: 'inline-flex', alignItems: 'center', gap: '4px'
            }}
        >
            {loading ? (
                <>
                    <div className="spinner" style={{ width: 12, height: 12 }} />
                    <span style={{ marginLeft: '3px' }}>PDF…</span>
                </>
            ) : done ? (
                <>
                    <Check size={13} color="var(--success)" /> PDF ✓
                </>
            ) : (
                <>
                    <Download size={13} /> PDF
                </>
            )}
        </button>
    );
};

export default CoverLetterPDFExport;
