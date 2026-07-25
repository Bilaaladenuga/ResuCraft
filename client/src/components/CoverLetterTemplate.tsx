import React from 'react';

interface CoverLetterTemplateProps {
    content: string;
    recipientName: string;
    companyName: string;
    position: string;
    userFirstName?: string;
    userLastName?: string;
}

const CoverLetterTemplate: React.FC<CoverLetterTemplateProps> = ({
    content,
    recipientName,
    companyName,
    position,
    userFirstName,
    userLastName
}) => {
    const fullName = [userFirstName, userLastName].filter(Boolean).join(' ') || 'Applicant';
    const recipient = recipientName || 'Hiring Manager';
    const company = companyName || 'the Company';

    // Parse content into paragraphs
    const paragraphs = content
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => {
            // Detect common letter sections
            const trimmed = line.trim();
            if (/^(sincerely|best regards|cheers|yours truly|thank you|warm regards)/i.test(trimmed)) {
                return { type: 'closing' as const, text: trimmed };
            }
            if (/^dear\s/i.test(trimmed)) {
                return { type: 'greeting' as const, text: trimmed };
            }
            if (/^(i am writing|i'm writing|with great|i submit)/i.test(trimmed)) {
                return { type: 'opening' as const, text: trimmed };
            }
            return { type: 'body' as const, text: trimmed };
        });

    return (
        <div className="cover-letter-preview">
            {/* Header with user info */}
            <div className="cl-header">
                <div className="cl-name">{fullName}</div>
                <div className="cl-role">{position || 'Professional'}</div>
            </div>

            {/* Letter content */}
            <div className="cl-body">
                {paragraphs.length > 0 ? (
                    paragraphs.map((p, i) => (
                        <p
                            key={i}
                            className={`cl-paragraph cl-${p.type}`}
                            style={{
                                fontWeight: p.type === 'greeting' || p.type === 'closing' ? 600 : 400,
                                marginBottom: p.type === 'closing' || (i === paragraphs.length - 1) ? '0' : '0.85em',
                                color: p.type === 'greeting' ? '#1a1a1a' : '#374151',
                                fontSize: p.type === 'greeting' ? '1rem' : '0.92rem',
                                lineHeight: '1.7'
                            }}
                        >
                            {p.text}
                        </p>
                    ))
                ) : (
                    <p style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
                        Your cover letter will appear here...
                    </p>
                )}
            </div>

            {/* Signature area */}
            {paragraphs.length > 0 && (
                <div className="cl-signature">
                    <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.92rem' }}>
                        {fullName}
                    </div>
                    {position && (
                        <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '2px' }}>
                            {position}
                        </div>
                    )}
                </div>
            )}

            {/* Internal CSS for the cover letter preview */}
            <style>{`
                .cover-letter-preview {
                    font-family: 'Inter', 'Georgia', 'Times New Roman', serif;
                    background: #fff;
                    color: #1a1a1a;
                    padding: 2.5rem 2.8rem;
                    max-width: 794px;
                    margin: 0 auto;
                    min-height: 500px;
                }
                .cl-header {
                    text-align: center;
                    padding-bottom: 1.25rem;
                    margin-bottom: 1.5rem;
                    border-bottom: 2px solid #f3f4f6;
                }
                .cl-name {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #111827;
                    letter-spacing: -0.5px;
                }
                .cl-role {
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin-top: 4px;
                    font-weight: 500;
                }
                .cl-body {
                    padding: 0 0.25rem;
                }
                .cl-paragraph {
                    margin: 0;
                }
                .cl-greeting {
                    margin-bottom: 1.25rem !important;
                }
                .cl-closing {
                    margin-top: 1rem !important;
                }
                .cl-signature {
                    margin-top: 1.5rem;
                    padding-top: 0.5rem;
                    border-top: 2px solid #f3f4f6;
                    text-align: left;
                }
                @media (max-width: 480px) {
                    .cover-letter-preview {
                        padding: 1.5rem 1.25rem;
                    }
                    .cl-name {
                        font-size: 1.1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default CoverLetterTemplate;
