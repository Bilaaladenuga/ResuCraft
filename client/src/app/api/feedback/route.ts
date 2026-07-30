import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

interface FeedbackBody {
    category: 'bug' | 'feature' | 'general';
    message: string;
    email?: string;
    userAgent?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
    bug: '🐛 Bug Report',
    feature: '💡 Feature Request',
    general: '📝 General Feedback',
};

export async function POST(request: NextRequest) {
    try {
        const body: FeedbackBody = await request.json();

        if (!body.message?.trim()) {
            return NextResponse.json(
                { success: false, error: 'Message is required.' },
                { status: 400 }
            );
        }

        const smtpEmail = process.env.SMTP_EMAIL;
        const smtpPassword = process.env.SMTP_PASSWORD;

        // If SMTP not configured, just acknowledge receipt (still saved locally)
        if (!smtpEmail || !smtpPassword) {
            console.warn('SMTP not configured — feedback saved client-side only.');
            return NextResponse.json({
                success: true,
                delivered: false,
                message: 'Saved locally. SMTP not configured.',
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: smtpEmail,
                pass: smtpPassword,
            },
        });

        const subject = `${CATEGORY_LABELS[body.category] || '📝 Feedback'} — ResuCraft`;

        const emailBody = [
            `--- ${CATEGORY_LABELS[body.category] || 'Feedback'} ---`,
            ``,
            body.message.trim(),
            ``,
            `--- Metadata ---`,
            `Category: ${body.category}`,
            `From Email: ${body.email || 'Not provided'}`,
            `Date: ${new Date().toLocaleString()}`,
            `User Agent: ${body.userAgent || 'Unknown'}`,
            `Source: ResuCraft Web App`,
        ].join('\n');

        const info = await transporter.sendMail({
            from: `"ResuCraft Feedback" <${smtpEmail}>`,
            to: smtpEmail,
            replyTo: body.email || smtpEmail,
            subject,
            text: emailBody,
        });

        console.log('Feedback email sent:', info.messageId);

        return NextResponse.json({
            success: true,
            delivered: true,
            messageId: info.messageId,
        });
    } catch (err) {
        console.error('Feedback email error:', err);
        return NextResponse.json(
            {
                success: true,
                delivered: false,
                error: err instanceof Error ? err.message : 'Unknown error',
            },
            { status: 200 } // Still 200 so client doesn't show error — saved locally as fallback
        );
    }
}
