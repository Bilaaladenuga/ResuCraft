import { generateWithProvider } from './ai';

/* ============================================
   JD Optimizer — tailor a resume to a specific
   job description.
   - With an AI key: real rewriting via provider
   - Without an AI key: smart template-based
     keyword infusion (never fabricates content)
   ============================================ */

export interface TailorSummaryInput {
    currentSummary: string;
    jobDescription: string;
    role: string;
    skills: string;
    industry: string;
}

export interface TailorExperienceInput {
    experiences: Array<{ title: string; company: string; description: string }>;
    jobDescription: string;
    role: string;
    industry: string;
}

/**
 * AI: Rewrite the summary so it naturally weaves in the JD's most
 * important keywords (only ones that genuinely apply to the candidate).
 */
export const tailorSummaryToJD = async ({
    currentSummary,
    jobDescription,
    role,
    skills,
    industry
}: TailorSummaryInput): Promise<string> => {
    const prompt = `You are an expert resume tailor. Rewrite this professional summary so it matches the job description below.

Current Summary:
${currentSummary || '(empty — write a fresh summary)'}

Target Role: ${role || 'the advertised role'}
Key Skills: ${skills || 'the candidate\'s skills'}
Industry: ${industry || 'general'}
Job Description:
${jobDescription}

Rules:
- Keep to 3-4 sentences, concise and impactful
- Naturally weave in 3-6 of the most important keywords from the job description
- ONLY include keywords that plausibly apply to this candidate — never fabricate skills
- Mirror the job description's language where it genuinely fits
- ATS-friendly, professional tone
- Do NOT include any markdown formatting
- Return ONLY the rewritten summary`;

    return generateWithProvider(prompt);
};

/**
 * AI: Rewrite every experience entry's bullets, weaving in the JD's
 * missing keywords naturally. Output uses the same format as the style
 * rewriter: each entry's bullets on their own lines, entries separated
 * by a blank line, preserving order.
 */
export const tailorExperienceToJD = async ({
    experiences,
    jobDescription,
    role,
    industry
}: TailorExperienceInput): Promise<string> => {
    const experienceText = experiences
        .map(e => `Role: ${e.title || '—'} at ${e.company || '—'}\nBullets:\n${e.description || '(no description)'}`)
        .join('\n\n---\n\n');

    const prompt = `You are an expert resume tailor. Rewrite the experience bullet points so the resume matches the job description.

EXPERIENCES TO REWRITE (listed in order):
${experienceText}

Role context: ${role || 'professional'}
Industry: ${industry || 'general'}

Job Description:
${jobDescription}

RULES:
- Keep the same information and achievements — do NOT fabricate new skills or companies
- Naturally weave 2-4 relevant keywords from the job description into each entry, only where they plausibly apply
- Start bullets with strong action verbs, quantify results where possible
- Keep bullets to 1-2 lines each
- Preserve the EXACT SAME ORDER and GROUPING: first entry's bullets, then a blank line, then next entry's bullets, etc.
- Return ONLY the bullet text — no labels, no roles, no headers, no markdown
- Each bullet on its own line`;

    return generateWithProvider(prompt);
};

/**
 * Fallback (no AI key): keyword-infuse the existing summary.
 * Appends a natural clause naming the top missing keywords, or writes a
 * fresh keyword-rich summary if the summary is empty.
 */
export const generateFallbackTailoredSummary = (
    currentSummary: string,
    role: string,
    industry: string,
    missingSkills: string[]
): string => {
    const skillsToWeave = missingSkills.slice(0, 4);
    if (skillsToWeave.length === 0) return currentSummary.trim();

    const skillClause = skillsToWeave.join(', ');
    const base = currentSummary.trim();

    if (!base) {
        const target = role || (industry ? `${industry} role` : 'professional');
        return `Results-driven ${target} with hands-on strengths in ${skillClause} and a track record of delivering measurable outcomes. Skilled at applying these capabilities to real business problems and aligned with the requirements of the target role.`;
    }

    // Don't double-append if already mentioned
    const lower = base.toLowerCase();
    if (skillsToWeave.some(s => lower.includes(s))) return base;

    return base.replace(/[.!?]?\s*$/, '') + `. Core strengths include ${skillClause}.`;
};

/**
 * Fallback (no AI key): weave the top missing keywords into the last
 * bullet of the first two experience entries. Honest keyword infusion —
 * never fabricates roles or companies.
 */
export const generateFallbackTailoredExperiences = (
    experiences: Array<{ title: string; company: string; description: string }>,
    missingSkills: string[]
): string[] => {
    const skills = missingSkills.slice(0, 4);
    if (skills.length === 0) return experiences.map(e => e.description || '');

    const used = new Set<string>();
    return experiences.map((exp, i) => {
        const desc = exp.description || '';
        const lower = desc.toLowerCase();
        // Only weave into the first two entries, and never repeat a skill
        const unused = skills.filter(s => !lower.includes(s) && !used.has(s));
        if (unused.length === 0 || i > 1) return desc;

        const weave = unused.slice(0, 2);
        weave.forEach(s => used.add(s));
        const phrase = weave.join(' and ');
        const lines = desc.split('\n').filter(Boolean);

        if (lines.length > 0) {
            const last = lines[lines.length - 1].replace(/[.]?\s*$/, '');
            lines[lines.length - 1] = `${last} with ${phrase}.`;
            return lines.join('\n');
        }
        return `Applied ${phrase} to drive measurable outcomes in ${exp.title || 'the role'}.`;
    });
};

/**
 * Parse a tailored-experience AI response (blank-line separated bullet
 * blocks) back into per-entry descriptions, aligned to the experience list.
 */
export const parseTailoredExperiences = (
    raw: string,
    count: number
): string[] => {
    const blocks = raw
        .split(/\n\s*\n/)
        .map(b => b.split('\n').filter(l => l.trim().length > 0))
        .filter(b => b.length > 0);

    return Array.from({ length: count }, (_, i) => {
        const bullets = blocks[i] || [];
        return bullets.join('\n');
    });
};

