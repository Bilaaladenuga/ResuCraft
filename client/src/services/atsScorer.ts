import { FormData } from '../types';
import { hasNumbers, isValidEmail, ACTION_VERBS } from './resumeScorer';

/* ============================================
   Dynamic ATS Checklist Scorer
   Analyzes the ACTUAL resume content and returns
   per-item statuses + an overall ATS score.
   Exactly 12 checks — matches the landing-page
   "12 ATS Checks" copy.
   ============================================ */

export type ATSStatus = 'pass' | 'warning' | 'info';

export interface ATSCheckItem {
    id: string;
    category: string;
    title: string;
    description: string;
    status: ATSStatus;
    tip: string;
}

/**
 * Build the ATS checklist with statuses derived from the actual resume
 */
export function buildATSChecklist(formData: FormData): ATSCheckItem[] {
    const items: ATSCheckItem[] = [];

    const firstName = formData.firstName?.trim() || '';
    const lastName = formData.lastName?.trim() || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const email = formData.email?.trim() || '';
    const phone = formData.phone?.trim() || '';
    const summary = formData.summary?.trim() || '';

    const exps = formData.experiences || [];

    const skills = (formData.skillsRaw || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    // All bullet text across experience entries
    const allBullets: string[] = [];
    exps.forEach(exp => {
        if (exp.description?.trim()) {
            exp.description.split('\n').filter(Boolean).forEach(b => allBullets.push(b));
        }
    });

    // Genuine bullet usage = multi-line descriptions (a single paragraph is NOT bullets)
    const multiLineExps = exps.filter(exp => (exp.description || '').split('\n').filter(Boolean).length >= 2);
    const hasBullets = multiLineExps.length > 0;

    const quantifiedCount = allBullets.filter(b => hasNumbers(b)).length;
    const actionVerbCount = allBullets.filter(b => {
        const firstWord = b.trim().toLowerCase().split(/\s+/)[0];
        return ACTION_VERBS.includes(firstWord);
    }).length;

    /* ---------- STRUCTURE (template guarantees) ---------- */

    items.push({
        id: 'standard-headers',
        category: 'Structure',
        title: 'Standard Section Headers',
        description: 'Use traditional headers like "Experience," "Education," "Skills" — not creative alternatives',
        status: 'pass',
        tip: 'ATS parsers look for standard headers. All ResuCraft templates use them automatically.'
    });

    items.push({
        id: 'single-column',
        category: 'Layout',
        title: 'Single-Column Layout',
        description: 'Avoid multi-column layouts that confuse ATS parsing algorithms',
        status: 'pass',
        tip: 'Multi-column layouts cause ATS to jumble content. All ResuCraft templates are single-column.'
    });

    items.push({
        id: 'no-tables',
        category: 'Layout',
        title: 'No Tables or Text Boxes',
        description: 'Tables and text boxes can cause ATS to skip or misread content',
        status: 'pass',
        tip: 'ResuCraft templates use clean div-based layouts — no tables, no text boxes.'
    });

    // Note: these two are guaranteed by DEFAULT template styling. Users who override
    // fonts/sizes via the Template Customizer may diverge — accepted limitation.
    items.push({
        id: 'standard-fonts',
        category: 'Typography',
        title: 'Standard Fonts',
        description: 'Use widely-recognized fonts like Arial, Calibri, or Times New Roman',
        status: 'pass',
        tip: 'ResuCraft templates ship with ATS-safe fonts out of the box.'
    });

    items.push({
        id: 'font-size',
        category: 'Typography',
        title: 'Readable Font Size (10-12pt)',
        description: 'Body text should be 10-12pt for optimal ATS readability',
        status: 'pass',
        tip: 'ResuCraft templates use 10-12pt body text by default.'
    });

    items.push({
        id: 'no-headers-footers',
        category: 'Formatting',
        title: 'No Headers or Footers',
        description: 'ATS often ignores content placed in document headers and footers',
        status: 'pass',
        tip: 'ResuCraft places your name and contact info in the main body automatically.'
    });

    /* ---------- CONTENT (dynamic) ---------- */

    // Clear contact information
    const contactComplete = Boolean(fullName && isValidEmail(email) && phone);
    const contactPartial = Boolean(fullName || email || phone);

    items.push({
        id: 'contact-info',
        category: 'Structure',
        title: 'Clear Contact Information',
        description: 'Name, phone, and a valid email at the very top of the resume',
        status: contactComplete ? 'pass' : contactPartial ? 'warning' : 'info',
        tip: contactComplete
            ? 'Your name, a valid email, and phone are all present at the top.'
            : 'Add your full name, a valid email address, and a phone number so recruiters can reach you.'
    });

    // Professional summary
    items.push({
        id: 'summary',
        category: 'Content',
        title: 'Professional Summary',
        description: 'A 2-4 sentence summary helps ATS and recruiters understand your profile instantly',
        status: summary.length < 50 ? 'warning' : 'pass',
        tip: summary.length === 0
            ? 'Add a professional summary — it\'s the first thing recruiters and ATS read.'
            : summary.length < 50
                ? 'Your summary is short — aim for 2-4 sentences covering your key strengths.'
                : 'Your summary is well-developed. Nice work!'
    });

    // Experience with genuine bullet points
    items.push({
        id: 'bullet-points',
        category: 'Content',
        title: 'Use Bullet Points, Not Paragraphs',
        description: 'ATS-friendly resumes use bullet points for easier parsing and scoring',
        status: hasBullets ? 'pass' : exps.length > 0 ? 'warning' : 'info',
        tip: exps.length === 0
            ? 'Add your work experience — then describe each role with bullet points.'
            : hasBullets
                ? 'Your experience is broken into scannable bullet points.'
                : 'Break your experience descriptions into bullet points — one achievement per line.'
    });

    // Quantified achievements
    items.push({
        id: 'quantified-achievements',
        category: 'Content',
        title: 'Quantified Achievements',
        description: 'Include numbers, percentages, and metrics to strengthen your content',
        status: quantifiedCount >= 3 ? 'pass' : quantifiedCount > 0 ? 'warning' : 'info',
        tip: quantifiedCount >= 3
            ? `You have ${quantifiedCount} quantified achievements — ATS ranks these higher.`
            : quantifiedCount > 0
                ? `Only ${quantifiedCount} bullet${quantifiedCount === 1 ? '' : 's'} contain numbers. Add metrics like "Increased sales by 20%".`
                : 'Add numbers to your bullets — percentages, dollar amounts, and counts make impact concrete.'
    });

    // Strong action verbs
    items.push({
        id: 'action-verbs',
        category: 'Content',
        title: 'Strong Action Verbs',
        description: 'Start bullets with verbs like "Led," "Developed," "Optimized"',
        status: actionVerbCount >= 3 ? 'pass' : allBullets.length > 0 && actionVerbCount > 0 ? 'warning' : 'info',
        tip: actionVerbCount >= 3
            ? 'Your bullets start with strong, active verbs. Great.'
            : 'Start bullet points with strong action verbs like "Led", "Developed", or "Optimized".'
    });

    // Skills
    items.push({
        id: 'skills-section',
        category: 'Content',
        title: 'Dedicated Skills Section',
        description: 'Include a comma-separated skills section for optimal keyword matching',
        status: skills.length >= 5 ? 'pass' : skills.length > 0 ? 'warning' : 'info',
        tip: skills.length === 0
            ? 'Add a comma-separated skills list — critical for ATS keyword matching.'
            : skills.length >= 5
                ? `You have ${skills.length} skills — great ATS coverage.`
                : `Only ${skills.length} skills listed. Add at least 5 for better ATS keyword coverage.`
    });

    return items;
}

/**
 * Compute the ATS score summary from a checklist
 */
export function summarizeATSChecklist(items: ATSCheckItem[]): { score: number; passCount: number; total: number } {
    const passCount = items.filter(i => i.status === 'pass').length;
    const total = items.length;
    const score = total > 0 ? Math.round((passCount / total) * 100) : 0;
    return { score, passCount, total };
}
