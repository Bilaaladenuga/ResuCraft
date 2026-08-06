import { FormData } from '../types';
import { generateWithProvider } from './ai';
import { linkedInToFormData } from './linkedinParser';

/* ============================================
   PDF Resume Import
   Extracts text from a PDF using pdfjs-dist,
   then parses it into structured FormData
   (regex-based, with an optional AI pass)
   ============================================ */

let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null;

/**
 * Lazily load pdfjs-dist (client-side only) and configure its worker.
 * Using `new URL` lets the bundler emit the worker as a real asset.
 */
async function getPdfjs(): Promise<typeof import('pdfjs-dist')> {
    if (!pdfjsPromise) {
        pdfjsPromise = import('pdfjs-dist');
        const pdfjs = await pdfjsPromise;
        try {
            // Preferred: bundled worker asset
            const workerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url);
            pdfjs.GlobalWorkerOptions.workerSrc = workerUrl.toString();
        } catch {
            // Fallback: CDN worker (same version as the installed package)
            pdfjs.GlobalWorkerOptions.workerSrc =
                `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
        }
    }
    return pdfjsPromise;
}

/** Extract all text from a PDF file, page by page */
export async function extractPDFText(file: File): Promise<string> {
    const pdfjs = await getPdfjs();
    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
    });

    const doc = await loadingTask.promise;
    const pages: string[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        let lastY: number | null = null;
        let pageText = '';

        for (const item of content.items as Array<{ str?: string; transform?: number[] }>) {
            const str = item.str || '';
            const y = item.transform ? item.transform[5] : null;
            if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) {
                pageText += '\n';
            }
            pageText += str + ' ';
            lastY = y;
        }

        pages.push(pageText.replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n').trim());
    }

    await loadingTask.destroy();
    return pages.filter(Boolean).join('\n\n').trim();
}

/* ============================================
   Heuristic parser (no AI required)
   ============================================ */

const SECTION_PATTERNS: Array<{ key: string; regex: RegExp }> = [
    { key: 'summary', regex: /\b(?:PROFESSIONAL\s+)?(?:SUMMARY|OBJECTIVE|PROFILE|ABOUT(?:\s+ME)?)\b/i },
    { key: 'experience', regex: /\b(?:WORK\s+)?(?:EXPERIENCE|EMPLOYMENT\s+HISTORY|PROFESSIONAL\s+EXPERIENCE|CAREER\s+HISTORY)\b/i },
    { key: 'education', regex: /\b(?:EDUCATION|ACADEMIC\s+BACKGROUND|ACADEMICS)\b/i },
    { key: 'skills', regex: /\b(?:SKILLS|TECHNICAL\s+SKILLS|CORE\s+COMPETENCIES|TECHNOLOGIES|COMPETENCIES)\b/i },
    { key: 'projects', regex: /\b(?:PROJECTS|PROJECT\s+WORK|PERSONAL\s+PROJECTS)\b/i },
    { key: 'achievements', regex: /\b(?:ACHIEVEMENTS|HONORS\s*(?:AND|&)\s*AWARDS|AWARDS|ACCOMPLISHMENTS)\b/i },
    { key: 'languages', regex: /\bLANGUAGES?\b/i },
    { key: 'certifications', regex: /\b(?:CERTIFICATIONS?|LICENSES?\s*(?:AND|&)\s*CERTIFICATIONS?)\b/i },
    { key: 'interests', regex: /\b(?:INTERESTS|HOBBIES)\b/i },
];

interface SectionMap {
    [key: string]: string;
}

/** Split raw resume text into sections by common headers */
export function splitResumeSections(raw: string): SectionMap {
    const lines = raw.split('\n');
    const sections: SectionMap = {};
    let current: string | null = null;

    const matchSection = (line: string): string | null => {
        const trimmed = line.trim().replace(/[:\-–—.]$/, '');
        if (trimmed.length > 40) return null;
        for (const { key, regex } of SECTION_PATTERNS) {
            if (regex.test(trimmed) && trimmed.length < 35) return key;
        }
        return null;
    };

    for (const line of lines) {
        const section = matchSection(line);
        if (section) {
            current = section;
            sections[current] = '';
            continue;
        }
        if (current) {
            sections[current] += (sections[current] ? '\n' : '') + line;
        }
    }

    return sections;
}

/** Find email addresses */
function findEmail(text: string): string {
    const match = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
    return match ? match[0] : '';
}

/** Find phone numbers */
function findPhone(text: string): string {
    const match = text.match(/(?:\(?\d{3}\)?[\s.\-]?)?\d{3}[\s.\-]\d{4}/);
    return match ? match[0] : '';
}

/** Find professional profile links (LinkedIn, GitHub, portfolio) */
function findSocialLinks(text: string): { linkedin: string; github: string; website: string } {
    const result = { linkedin: '', github: '', website: '' };
    if (!text) return result;
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com|github\.com|[\w-]+\.(?:com|org|io|dev|me|net|co|app|ai|online|site|xyz|info))\S*/gi;
    const seen = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = urlRegex.exec(text)) !== null) {
        const full = match[0].replace(/[.,;)]+$/, '');
        if (seen.has(full)) continue;
        seen.add(full);
        const lower = full.toLowerCase();
        if (lower.includes('linkedin.com') && !result.linkedin) {
            result.linkedin = full;
        } else if (lower.includes('github.com') && !result.github) {
            result.github = full;
        } else if (!result.website) {
            result.website = full;
        }
    }
    return result;
}

/** Find the name — typically the first capitalized line that isn't a header */
function findName(lines: string[]): { firstName: string; lastName: string } {
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        // Skip obvious headers/contact lines
        if (/^(http|@|\d|www\.|resume|cv|curriculum)/i.test(trimmed)) continue;
        if (/^(contact|information|reference|page)\b/i.test(trimmed)) continue;
        if (findEmail(trimmed) || findPhone(trimmed)) continue;
        if (trimmed.length > 2 && trimmed.length < 45 && /^[A-Z][a-zA-Z'.\- ]+$/.test(trimmed) && trimmed.split(/\s+/).length >= 2) {
            const parts = trimmed.split(/\s+/);
            if (parts.length >= 2 && parts.length <= 4) {
                return { firstName: parts[0].replace(/[^A-Za-z'.-]/g, ''), lastName: parts.slice(1).join(' ').replace(/[^A-Za-z'.\- ]/g, '') };
            }
        }
    }
    return { firstName: '', lastName: '' };
}

// Hints used to decide which side of a "Company | Title" line is the title vs the company
const TITLE_HINTS = /\b(engineer|developer|manager|designer|analyst|specialist|lead|officer|director|consultant|architect|coordinator|supervisor|associate|intern|head|chief|operator|technician|scientist|nurse|accountant|attorney|administrator|assistant|advisor|representative|writer|editor|researcher|instructor|teacher|professor|sales|marketing|support|recruiter|planner|strategist|qa|dev|eng|pm|accountant|auditor|underwriter|banker)\b/i;
const COMPANY_HINTS = /\b(inc|llc|ltd|corp|co\.?|gmbh|sa|technologies?|systems?|solutions?|group|services?|labs?|limited|bank|university|college|hospital|clinic|foundation|agency|studio|media|healthcare|financial|consulting)\b/i;

/**
 * Split a "Title at Company" / "Title | Company" / "Company | Title" line
 * into title + company, choosing the correct order with light heuristics.
 * Unambiguous forms ("at", "@") keep title-first; pipe-separated lines
 * are re-ordered when the hints clearly indicate which side is the title.
 */
function splitTitleCompany(line: string): { title: string; company: string } {
    // Word separators ('at'/'@') need whitespace on both sides; punctuation
    // separators (comma, pipe, dash) never have a space before them in English
    // ("Title, Company"), so only require whitespace AFTER the separator.
    const m = line.match(/^(.*?)\s+(at|@)\s+(.*)$/)
        || line.match(/^(.*?)\s*([—–-]|,|\|)\s+(.*)$/);
    if (!m) return { title: line.trim(), company: '' };
    const left = m[1].trim();
    const right = m[3].trim();
    const sep = m[2];

    // 'at' / '@' are unambiguous: title first
    if (sep === 'at' || sep === '@') return { title: left, company: right };

    // Pipe-separated lines can be written either way — use hints to pick the order
    if (sep === '|') {
        const leftIsTitle = TITLE_HINTS.test(left);
        const rightIsTitle = TITLE_HINTS.test(right);
        const leftIsCompany = COMPANY_HINTS.test(left);
        const rightIsCompany = COMPANY_HINTS.test(right);

        if (rightIsTitle && !leftIsTitle) return { title: right, company: left };
        if (leftIsCompany && !rightIsCompany) return { title: right, company: left };
        if (rightIsCompany && !leftIsCompany) return { title: left, company: right };
        if (leftIsTitle && !rightIsTitle) return { title: left, company: right };
    }

    // Default title-first for comma / dash
    return { title: left, company: right };
}

/** Parse experience entries from the experience section */
function parseExperiences(sectionText: string): FormData['experiences'] {
    const entries: FormData['experiences'] = [];
    if (!sectionText) return entries;

    const lines = sectionText.split('\n').map(l => l.trim()).filter(Boolean);
    const dateRegex = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*(?:to|–|—|-|,)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current|Now)/i;

    let current: FormData['experiences'][number] | null = null;

    for (const line of lines) {
        // Date range line
        const dateMatch = line.match(dateRegex);
        if (dateMatch) {
            if (current) {
                current.startDate = normalizeDate(dateMatch[1]);
                current.endDate = /present|current|now/i.test(dateMatch[2]) ? '' : normalizeDate(dateMatch[2]);
            }
            continue;
        }

        // Bullet point
        if (/^[•\-\–—\u2022\*]/.test(line)) {
            if (current) {
                const bullet = line.replace(/^[•\-\–—\u2022\*\s]+/, '');
                current.description = current.description ? current.description + '\n' + bullet : bullet;
            }
            continue;
        }

        // "Title at Company" / "Title | Company" / "Company | Title" (attach company to an entry with a title)
        if (current && current.title && !current.company && line.length < 80 && !/^\d/.test(line)) {
            const split = splitTitleCompany(line);
            if (split.company) {
                current.title = split.title;
                current.company = split.company;
                continue;
            }
        }

        // New entry start — a short line that's likely a title
        if (line.length < 90 && !/^http/i.test(line) && !findEmail(line) && !findPhone(line)) {
            if (current && (current.title || current.company)) {
                entries.push(current);
            }
            const split = splitTitleCompany(line);
            current = {
                id: entries.length + 1,
                title: split.title || line,
                company: split.company,
                location: '',
                startDate: '',
                endDate: '',
                description: ''
            };
        }
    }

    if (current && (current.title || current.company)) {
        entries.push(current);
    }

    return entries.map((e, i) => ({ ...e, id: i + 1 }));
}

/** Parse education entries */
function parseEducations(sectionText: string): FormData['educations'] {
    const entries: FormData['educations'] = [];
    if (!sectionText) return entries;

    const lines = sectionText.split('\n').map(l => l.trim()).filter(Boolean);
    const dateRegex = /(\d{4})\s*(?:to|–|—|-|,)\s*(\d{4}|Present|Current)/i;
    const degreeRegex = /\b(Bachelor(?:'s| of)?|Master(?:'s| of)?|PhD|Doctor(?:ate)?|Associate(?:'s| of)?|B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|MBA|JD|MD|Diploma|Certificate)\b/i;

    let current: FormData['educations'][number] | null = null;

    for (const line of lines) {
        const dateMatch = line.match(dateRegex);
        if (dateMatch) {
            if (current) {
                current.startDate = normalizeDate(dateMatch[1]);
                current.endDate = /present|current/i.test(dateMatch[2]) ? '' : normalizeDate(dateMatch[2]);
            }
            continue;
        }

        if (/^[•\-\–—\u2022\*]/.test(line)) {
            if (current) {
                const bullet = line.replace(/^[•\-\–—\u2022\*\s]+/, '');
                current.description = current.description ? current.description + '\n' + bullet : bullet;
            }
            continue;
        }

        if (line.length < 100 && !/^http/i.test(line)) {
            if (degreeRegex.test(line) && current && !current.degree) {
                current.degree = line;
            } else if (/University|College|School|Institute|Academy|High School/i.test(line)) {
                if (current && (current.school || current.degree)) {
                    entries.push(current);
                }
                current = {
                    id: entries.length + 1,
                    school: line,
                    degree: '',
                    city: '',
                    startDate: '',
                    endDate: '',
                    description: ''
                };
            } else if (current && !current.degree) {
                current.degree = line;
            }
        }
    }

    if (current && (current.school || current.degree)) {
        entries.push(current);
    }

    return entries.map((e, i) => ({ ...e, id: i + 1 }));
}

/** Parse skills from the skills section */
function parseSkills(sectionText: string): string {
    if (!sectionText) return '';
    const cleaned = sectionText
        .split('\n')
        .map(l => l.replace(/^[•\-\–—\u2022\*\s]+/, '').trim())
        .filter(Boolean)
        .join(', ');
    // Split by commas/pipes and dedupe
    const skills = cleaned
        .split(/[,|\n;]+/)
        .map(s => s.trim().replace(/\s{2,}/g, ' '))
        .filter(s => s.length > 0 && s.length < 50 && !/^(?:\d+\s*\w*)$/.test(s));
    return [...new Set(skills)].join(', ');
}

/** Parse projects */
function parseProjects(sectionText: string): FormData['projects'] {
    const entries: FormData['projects'] = [];
    if (!sectionText) return entries;
    const lines = sectionText.split('\n').map(l => l.trim()).filter(Boolean);
    let current: FormData['projects'][number] | null = null;

    for (const line of lines) {
        if (/^[•\-\–—\u2022\*]/.test(line)) {
            if (current) {
                current.description = current.description ? current.description + '\n' + line.replace(/^[•\-\–—\u2022\*\s]+/, '') : line.replace(/^[•\-\–—\u2022\*\s]+/, '');
            }
            continue;
        }
        if (line.length < 80 && !/^http/i.test(line) && !findEmail(line)) {
            if (current && current.title) entries.push(current);
            current = { id: entries.length + 1, title: line, link: '', description: '' };
        } else if (current) {
            const linkMatch = line.match(/https?:\/\/[\w./-]+/);
            if (linkMatch) {
                current.link = linkMatch[0];
            } else {
                current.description = current.description ? current.description + '\n' + line : line;
            }
        }
    }
    if (current && current.title) entries.push(current);
    return entries.map((e, i) => ({ ...e, id: i + 1 }));
}

/** Normalize "Sep 2020" or "2020" into YYYY-MM or YYYY */
function normalizeDate(d: string): string {
    if (!d) return '';
    const monthMap: Record<string, number> = {
        jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
        jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
    };
    const m = d.trim().match(/^([A-Za-z]{3,})[a-z]*\.?\s+(\d{4})$/i);
    if (m) {
        const month = monthMap[m[1].toLowerCase().substring(0, 3)];
        if (month) return `${m[2]}-${String(month).padStart(2, '0')}`;
        return m[2];
    }
    if (/^\d{4}$/.test(d.trim())) return d.trim();
    return d.trim();
}

/**
 * Main parser: turn raw PDF text into FormData (best-effort, regex-based)
 */
export function parseResumeText(rawText: string): Partial<FormData> {
    if (!rawText || rawText.trim().length < 20) {
        throw new Error('No text could be extracted from this PDF. It may be a scanned/image-only document.');
    }

    const sections = splitResumeSections(rawText);
    const lines = rawText.split('\n').map(l => l.trim());

    // Header portion = everything before the first recognized section
    let headerText = '';
    for (const line of lines) {
        const trimmed = line.trim();
        const matched = SECTION_PATTERNS.some(({ regex }) => regex.test(trimmed.replace(/[:\-–—.]$/, '')) && trimmed.length < 35);
        if (matched) break;
        headerText += (headerText ? '\n' : '') + line;
    }

    const { firstName, lastName } = findName(headerText.split('\n'));
    const designationLine = headerText.split('\n').find(l => {
        const t = l.trim();
        return t && !findEmail(t) && !findPhone(t) && !/^[A-Z][a-zA-Z'.\- ]+$/.test(t) && t.length < 60 && /^[A-Za-z]/.test(t);
    });
    const social = findSocialLinks(headerText || rawText.slice(0, 1500));

    return {
        firstName,
        lastName,
        designation: designationLine?.trim() || '',
        email: findEmail(rawText),
        phone: findPhone(rawText),
        address: '',
        linkedin: social.linkedin,
        github: social.github,
        website: social.website,
        summary: (sections['summary'] || '').trim(),
        image: null,
        skillsRaw: parseSkills(sections['skills'] || ''),
        experiences: parseExperiences(sections['experience'] || ''),
        educations: parseEducations(sections['education'] || ''),
        projects: parseProjects(sections['projects'] || ''),
        achievements: []
    };
}

/**
 * AI-assisted parsing — uses the configured AI provider for better extraction.
 * Falls back to the regex parser if AI is unavailable/fails.
 */
export async function parseResumeWithAI(rawText: string): Promise<Partial<FormData>> {
    const prompt = `You are a resume data extractor. Parse the following resume text and return ONLY a JSON object with these exact fields:

{
  "firstName": "string",
  "lastName": "string",
  "headline": "string (the professional title/designation)",
  "location": "string",
  "about": "string (the summary/profile section content)",
  "experiences": [
    { "title": "string", "company": "string", "location": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM or empty if Present", "description": "string" }
  ],
  "educations": [
    { "school": "string", "degree": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM" }
  ],
  "skills": ["skill1", "skill2", ...],
  "projects": [ { "title": "string", "description": "string" } ]
}

Rules:
- Extract dates as YYYY-MM format, empty string for Present
- Combine multiple description bullets into one string separated by newlines
- Return ONLY valid JSON, no markdown, no explanation

RESUME TEXT:
${rawText.slice(0, 12000)}`;

    try {
        const response = await generateWithProvider(prompt);
        const cleaned = response.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim();
        const parsed = JSON.parse(cleaned) as {
            firstName?: string;
            lastName?: string;
            headline?: string;
            location?: string;
            about?: string;
            experiences?: Array<{ title?: string; company?: string; location?: string; startDate?: string; endDate?: string; description?: string }>;
            educations?: Array<{ school?: string; degree?: string; startDate?: string; endDate?: string }>;
            skills?: string[];
            projects?: Array<{ title?: string; link?: string; description?: string }>;
        };

        const result = linkedInToFormData({
            firstName: parsed.firstName || '',
            lastName: parsed.lastName || '',
            headline: parsed.headline || '',
            location: parsed.location || '',
            about: parsed.about || '',
            experiences: (parsed.experiences || []).map(e => ({
                title: e.title || '',
                company: e.company || '',
                location: e.location || '',
                startDate: e.startDate || '',
                endDate: e.endDate || '',
                description: e.description || ''
            })),
            educations: (parsed.educations || []).map(e => ({
                school: e.school || '',
                degree: e.degree || '',
                startDate: e.startDate || '',
                endDate: e.endDate || ''
            })),
            skills: parsed.skills || []
        });

        // Preserve projects (linkedInToFormData doesn't map them)
        if (parsed.projects && parsed.projects.length > 0) {
            result.projects = parsed.projects.map((p, i) => ({
                id: i + 1,
                title: p.title || '',
                link: p.link || '',
                description: p.description || ''
            }));
        }

        return result;
    } catch (err) {
        console.warn('AI parsing failed, falling back to regex:', err);
        return parseResumeText(rawText);
    }
}
