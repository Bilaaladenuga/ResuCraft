'use client';
import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { FileText, Check } from 'lucide-react';
import { trackEvent } from '../services/track';

interface CoverLetterDOCXExportProps {
    content: string;
    fileName: string;
    senderName: string;
    senderRole?: string;
    recipientName?: string;
    companyName?: string;
}

/**
 * Export a generated cover letter as a clean, professional Word document.
 */
function createCoverLetterDocx(props: CoverLetterDOCXExportProps): Document {
    const {
        content,
        senderName,
        senderRole,
        recipientName,
        companyName,
    } = props;

    const children: Paragraph[] = [];

    // ─── Sender block ───
    children.push(
        new Paragraph({
            children: [
                new TextRun({ text: senderName || 'Your Name', bold: true, size: 28, color: '111827', font: 'Calibri' }),
            ],
            spacing: { after: 20 },
        })
    );
    if (senderRole) {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: senderRole, size: 20, color: '6b7280', font: 'Calibri', italics: true }),
                ],
                spacing: { after: 200 },
            })
        );
    }

    // ─── Recipient block ───
    const recipientLines = [
        recipientName ? `Dear ${recipientName},` : 'Dear Hiring Manager,',
    ];
    recipientLines.forEach(line => {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: line, size: 20, color: '374151', font: 'Calibri' }),
                ],
                spacing: { after: 160 },
            })
        );
    });

    // ─── Body — split into paragraphs ───
    const paragraphs = content
        .split('\n')
        .map(p => p.trim())
        .filter(Boolean);

    paragraphs.forEach((para, i) => {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: para, size: 20, color: '374151', font: 'Calibri' }),
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: i === paragraphs.length - 1 ? 240 : 120, line: 300 },
            })
        );
    });

    // ─── Signature ───
    if (companyName) {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: `Application for ${companyName}`, size: 18, color: '9ca3af', font: 'Calibri', italics: true }),
                ],
                spacing: { after: 240 },
            })
        );
    }
    children.push(
        new Paragraph({
            children: [
                new TextRun({ text: 'Sincerely,', size: 20, color: '374151', font: 'Calibri' }),
            ],
            spacing: { after: 40 },
        }),
        new Paragraph({
            children: [
                new TextRun({ text: senderName || 'Your Name', bold: true, size: 20, color: '111827', font: 'Calibri' }),
            ],
            spacing: { after: 20 },
        })
    );
    if (senderRole) {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: senderRole, size: 18, color: '6b7280', font: 'Calibri' }),
                ],
            })
        );
    }

    return new Document({
        title: `Cover Letter - ${companyName || 'Position'}`,
        description: `Cover letter by ${senderName || 'Applicant'}`,
        styles: {
            default: {
                document: {
                    run: { font: 'Calibri', size: 20, color: '374151' },
                    paragraph: { spacing: { after: 60, line: 300 } },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1440,
                            right: 1440,
                            bottom: 1440,
                            left: 1440,
                        },
                    },
                },
                children,
            },
        ],
    });
}

const CoverLetterDOCXExport: React.FC<CoverLetterDOCXExportProps> = (props) => {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleExport = async () => {
        if (!props.content.trim()) return;
        setLoading(true);
        try {
            const doc = createCoverLetterDocx(props);
            const blob = await Packer.toBlob(doc);
            const safeName = props.fileName
                .replace(/[\\/:*?"<>|]+/g, '')
                .replace(/\s+/g, '_')
                .trim() || 'Cover_Letter';
            saveAs(blob, `${safeName}.docx`);
            trackEvent('cover_letter_export');
            setDone(true);
            setTimeout(() => setDone(false), 2500);
        } catch (err) {
            console.error('Cover letter DOCX export failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="btn btn-ghost btn-sm"
            onClick={handleExport}
            disabled={loading}
            title="Export as Word document"
            style={{
                padding: '0.3rem 0.5rem', fontSize: '0.65rem',
                display: 'inline-flex', alignItems: 'center', gap: '4px'
            }}
        >
            {loading ? (
                <>
                    <div className="spinner" style={{ width: 12, height: 12 }} />
                    ...
                </>
            ) : done ? (
                <>
                    <Check size={13} color="var(--success)" /> DOCX ✓
                </>
            ) : (
                <>
                    <FileText size={13} /> DOCX
                </>
            )}
        </button>
    );
};

export default CoverLetterDOCXExport;
