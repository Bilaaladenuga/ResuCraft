'use client';
import React, { useState } from 'react';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet, pdf } from '@react-pdf/renderer';
import { FormData } from '../types';
import { trackEvent } from '../services/track';
import { FileText } from 'lucide-react';

// No font registration needed — Helvetica is built into @react-pdf/renderer
// Using built-in fonts avoids blank PDFs caused by external font load failures

const colors = {
    primary: '#111827',
    secondary: '#3b82f6',
    muted: '#6b7280',
    border: '#e5e7eb',
    background: '#ffffff',
    text: '#374151'
};

const styles = StyleSheet.create({
    page: {
        padding: '40px 48px',
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: colors.text,
        backgroundColor: colors.background
    },
    header: {
        borderBottomWidth: 3,
        borderBottomColor: colors.secondary,
        borderBottomStyle: 'solid',
        paddingBottom: 12,
        marginBottom: 20
    },
    name: {
        fontSize: 26,
        fontWeight: 700,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
        marginBottom: 2
    },
    designation: {
        fontSize: 12,
        fontWeight: 600,
        color: colors.secondary,
        marginBottom: 6
    },
    contactRow: {
        flexDirection: 'row',
        fontSize: 9,
        color: colors.muted
    },
    contactItem: {
        marginRight: 16,
        fontSize: 9,
        color: colors.muted
    },
    section: {
        marginBottom: 14
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 700,
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        borderBottomStyle: 'solid',
        paddingBottom: 3,
        marginBottom: 8
    },
    summaryText: {
        fontSize: 9.5,
        lineHeight: 1.6,
        color: colors.text
    },
    entry: {
        marginBottom: 10
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2
    },
    entryTitle: {
        fontSize: 10,
        fontWeight: 600,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
        flexGrow: 1
    },
    entryDate: {
        fontSize: 8.5,
        color: colors.muted,
        textAlign: 'right'
    },
    entryCompany: {
        fontSize: 9,
        color: colors.muted,
        marginBottom: 3
    },
    bullet: {
        fontSize: 9,
        lineHeight: 1.5,
        color: colors.text,
        marginLeft: 10,
        marginBottom: 1.5
    },
    inlineItem: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 2
    },
    inlineLabel: {
        fontSize: 9,
        fontWeight: 600,
        color: colors.primary,
        minWidth: 50
    },
    inlineValue: {
        fontSize: 9,
        color: colors.text,
        flexGrow: 1
    },
    footer: {
        fontSize: 7,
        color: colors.muted,
        textAlign: 'center',
        marginTop: 20
    }
});

const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'Present';
    const s = dateStr.trim();
    if (/present|current|now|ongoing|till date|to date|todate/i.test(s)) return 'Present';
    const m = s.match(/^(\d{4})-(\d{2})$/);
    if (!m) return s;
    const date = new Date(s + '-01');
    if (isNaN(date.getTime())) return s;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const PDFDocument: React.FC<{ data: FormData }> = ({ data }) => {
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Your Name';
    const skills = (data.skillsRaw || '').split(',').map(s => s.trim()).filter(Boolean);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{fullName}</Text>
                    {data.designation && <Text style={styles.designation}>{data.designation}</Text>}
                    <View style={styles.contactRow}>
                        {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
                        {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
                        {data.address && <Text style={styles.contactItem}>{data.address}</Text>}
                        {data.linkedin && <Text style={styles.contactItem}>LinkedIn: {data.linkedin}</Text>}
                        {data.github && <Text style={styles.contactItem}>GitHub: {data.github}</Text>}
                        {data.website && <Text style={styles.contactItem}>{data.website}</Text>}
                    </View>
                </View>

                {/* Summary */}
                {data.summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text style={styles.summaryText}>{data.summary}</Text>
                    </View>
                )}

                {/* Experience */}
                {data.experiences && data.experiences.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Work Experience</Text>
                        {data.experiences.map((exp) => (
                            <View key={exp.id} style={styles.entry}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>{exp.title}</Text>
                                    <Text style={styles.entryDate}>
                                        {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                                    </Text>
                                </View>
                                {(exp.company || exp.location) && (
                                    <Text style={styles.entryCompany}>
                                        {[exp.company, exp.location].filter(Boolean).join(' — ')}
                                    </Text>
                                )}
                                {exp.description && (
                                    <View>
                                        {exp.description.split('\n').filter(Boolean).map((line, i) => (
                                            <Text key={i} style={styles.bullet}>• {line}</Text>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {data.educations && data.educations.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {data.educations.map((edu) => (
                            <View key={edu.id} style={styles.entry}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>{edu.degree}</Text>
                                    <Text style={styles.entryDate}>
                                        {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                                    </Text>
                                </View>
                                <Text style={styles.entryCompany}>
                                    {[edu.school, edu.city].filter(Boolean).join(' — ')}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <Text style={styles.summaryText}>{skills.join(' · ')}</Text>
                    </View>
                )}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {data.projects.map((proj) => (
                            <View key={proj.id} style={styles.entry}>
                                <Text style={styles.entryTitle}>{proj.title}</Text>
                                {proj.description && (
                                    <Text style={styles.summaryText}>{proj.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Achievements */}
                {data.achievements && data.achievements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Achievements</Text>
                        {data.achievements.map((ach) => (
                            <View key={ach.id} style={styles.entry}>
                                <Text style={styles.entryTitle}>{ach.title}</Text>
                                {ach.description && (
                                    <Text style={styles.summaryText}>{ach.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Custom Sections */}
                {(data.customSections || []).filter(s => s.title?.trim() && (s.items || []).some(i => i?.trim())).map((sec) => (
                    <View key={sec.id} style={styles.section}>
                        <Text style={styles.sectionTitle}>{sec.title}</Text>
                        {sec.items.filter(i => i.trim()).map((item, i) => (
                            <Text key={i} style={styles.bullet}>• {item}</Text>
                        ))}
                    </View>
                ))}

                {/* Footer */}
                <Text style={styles.footer}>Generated with ResuCraft</Text>
            </Page>
        </Document>
    );
};

interface PDFExportButtonProps {
    formData: FormData;
    templateName: string;
    variant?: 'navbar' | 'menu';
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ formData, templateName, variant = 'navbar' }) => {
    const fileName = [formData.firstName, formData.lastName, 'Resume', templateName]
        .filter(Boolean)
        .join('_')
        .replace(/[\s/]+/g, '_') + '.pdf';
    const [menuLoading, setMenuLoading] = useState(false);

    // Menu variant — a plain button that generates the PDF only on click
    // (avoids mounting a second PDFDownloadLink, which would render eagerly)
    const handleMenuExport = async () => {
        if (menuLoading) return;
        setMenuLoading(true);
        try {
            const blob = await pdf(<PDFDocument data={formData} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            trackEvent('pdf_export');
        } catch (err) {
            console.error('PDF export failed:', err);
        } finally {
            setMenuLoading(false);
        }
    };

    if (variant === 'menu') {
        return (
            <button
                className="more-item"
                onClick={handleMenuExport}
                disabled={menuLoading}
                title="Download as PDF"
                style={{ '--item-color': '#ef4444' } as React.CSSProperties}
            >
                <FileText size={13} color="#ef4444" />
                <span style={{ flex: 1, textAlign: 'left' }}>Export PDF</span>
                {menuLoading && (
                    <span className="more-item-badge" style={{ color: '#ef4444' }}>
                        Generating…
                    </span>
                )}
            </button>
        );
    }

    return (
        <PDFDownloadLink
            document={<PDFDocument data={formData} />}
            fileName={fileName}
            style={{ textDecoration: 'none' }}
        >
            {({ loading }) => (
                <div
                    onClick={() => trackEvent('pdf_export')}
                    className={loading ? 'btn btn-primary btn-sm' : 'btn btn-accent btn-sm'}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '0.4rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    } as React.CSSProperties}
                >
                    {loading ? 'Generating PDF...' : 'Export PDF'}
                </div>
            )}
        </PDFDownloadLink>
    );
};

export default PDFExportButton;
