import { FormData } from '../types';

/* ============================================
   ATS Keyword Matcher — paste any job description
   and instantly see which keywords your resume
   covers and which are missing.
   Runs 100% locally — no API key, no network.
   ============================================ */

export interface KeywordHit {
    term: string;
    /** Number of times the term appears in the job description */
    count: number;
    /** Whether the term appears in the resume corpus */
    matched: boolean;
    /** Whether the term looks like a skill (multi-word or rare/specialized single word) */
    looksLikeSkill: boolean;
}

export interface KeywordMatchResult {
    hits: KeywordHit[];
    total: number;
    matched: number;
    /** 0 - 100 */
    score: number;
    matchedTerms: string[];
    missingTerms: string[];
}

// Words too generic to be meaningful keywords
const STOPWORDS = new Set([
    'the', 'and', 'for', 'with', 'you', 'your', 'will', 'our', 'are', 'this', 'that',
    'have', 'has', 'from', 'they', 'them', 'their', 'what', 'when', 'where', 'which',
    'who', 'whom', 'were', 'was', 'been', 'being', 'can', 'could', 'would', 'should',
    'shall', 'may', 'might', 'must', 'not', 'but', 'all', 'any', 'each', 'every',
    'some', 'more', 'most', 'other', 'such', 'only', 'own', 'same', 'too', 'very',
    'just', 'also', 'into', 'over', 'under', 'about', 'between', 'through', 'during',
    'before', 'after', 'above', 'below', 'again', 'once', 'here', 'there', 'why',
    'how', 'because', 'until', 'while', 'within', 'without', 'against', 'among',
    'upon', 'via', 'per', 'etc', 'including', 'include', 'includes', 'including',
    'related', 'performs', 'perform', 'perform', 'job', 'jobs', 'position', 'role',
    'work', 'works', 'working', 'team', 'teams', 'company', 'companies', 'business',
    'experience', 'years', 'year', 'month', 'months', 'day', 'days', 'hour', 'hours',
    'ability', 'able', 'skills', 'skill', 'required', 'requirements', 'requirement',
    'responsibilities', 'responsibility', 'duties', 'duty', 'qualifications',
    'qualification', 'knowledge', 'knowledge', 'candidate', 'candidates', 'applicant',
    'applicants', 'new', 'new', 'plus', 'preferred', 'nice', 'must', 'good', 'great',
    'strong', 'excellent', 'proven', 'relevant', 'equivalent', 'minimum', 'least',
    'using', 'use', 'used', 'one', 'two', 'three', 'well', 'best', 'ideal',
    'senior', 'junior', 'mid', 'lead', 'principal', 'staff', 'looking', 'seeking',
    'deep', 'build', 'builds', 'built', 'building', 'develop', 'develops', 'developed',
    'join', 'welcome', 'apply', 'application', 'web', 'work', 'working', 'works',
]);

// Single words that are common but not skills — excluded from "Add to skills"
const GENERIC_SINGLE_WORDS = new Set([
    'management', 'communication', 'collaboration', 'leadership', 'organization',
    'planning', 'development', 'customer', 'client', 'clients', 'people',
    'multiple', 'projects', 'project', 'product', 'products', 'process',
    'processes', 'data', 'software', 'systems', 'system', 'tools', 'tool',
    'environment', 'environments', 'deadlines', 'fast', 'paced', 'detail',
    'oriented', 'written', 'verbal', 'interpersonal', 'analytical', 'technical',
    'complex', 'problems', 'problem', 'solving', 'cross', 'functional',
    'engineer', 'engineers', 'engineering', 'developer', 'developers',
    'design', 'designing', 'designer', 'designers', 'building', 'developing',
    'deployment', 'delivery', 'quality', 'performance', 'security', 'agile',
    'scrum', 'cloud', 'web', 'mobile', 'backend', 'frontend', 'full', 'stack',
    'code', 'coding', 'testing', 'documentation', 'research', 'analysis',
    'scalable', 'automated', 'maintaining', 'maintain', 'support', 'supporting',
    'integration', 'implementing', 'implementation', 'requirements',
]);

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Build a single searchable string from the whole resume
 */
export function getResumeCorpus(formData: FormData): string {
    const parts: string[] = [];

    parts.push(formData.firstName || '');
    parts.push(formData.lastName || '');
    parts.push(formData.designation || '');
    parts.push(formData.summary || '');
    parts.push(formData.skillsRaw || '');

    (formData.experiences || []).forEach(exp => {
        parts.push(exp.title, exp.company, exp.location, exp.description);
    });
    (formData.educations || []).forEach(edu => {
        parts.push(edu.degree, edu.school, edu.city, edu.description);
    });
    (formData.projects || []).forEach(p => {
        parts.push(p.title, p.link || '', p.description);
    });
    (formData.achievements || []).forEach(a => {
        parts.push(a.title, a.description || '');
    });
    (formData.customSections || []).forEach(s => {
        parts.push(s.title || '', ...(s.items || []));
    });

    return parts.filter(Boolean).join('\n').toLowerCase();
}

const looksLikeSkillTerm = (term: string): boolean => {
    if (term.includes(' ')) return true; // phrases are almost always skills
    if (term.length <= 2) return false;
    if (/^[a-z]{3,}$/i.test(term)) {
        // Rare/specialized single words read as skills (e.g. "kafka", "jira", "figma")
        // Generic words don't.
        return !GENERIC_SINGLE_WORDS.has(term.toLowerCase());
    }
    return false; // numbers or mixed symbols
};

/**
 * Extract candidate keywords from a job description.
 * Includes: meaningful single words, quoted/parenthesized phrases,
 * ALL-CAPS acronyms, and common adjective+noun skill phrases.
 */
export function extractKeywords(jd: string): { term: string; count: number }[] {
    const text = jd.toLowerCase();
    const freq = new Map<string, number>();

    const addTerm = (raw: string) => {
        const term = raw.trim().replace(/\s+/g, ' ').toLowerCase();
        if (!term) return;
        const words = term.split(' ');
        if (words.length === 1) {
            const w = words[0];
            if (w.length < 3 || STOPWORDS.has(w) || /^\d+$/.test(w)) return;
        } else {
            if (words.length > 4) return; // skip overly long phrases
            if (words.some(w => w.length < 3)) return;
            if (words.every(w => STOPWORDS.has(w))) return;
        }
        freq.set(term, (freq.get(term) || 0) + 1);
    };

    // 1) Quoted and parenthesized phrases
    const quoted = text.match(/["“”‘’()]([^"“”‘’()]{2,60})["“”‘’()]/g) || [];
    quoted.forEach(q => {
        const inner = q.replace(/["“”‘’()]/g, '').trim();
        if (inner.includes(' ')) addTerm(inner);
    });

    // 2) ALL-CAPS acronyms in the original text
    const acronyms = jd.match(/\b[A-Z]{2,6}\b/g) || [];
    acronyms.forEach(a => addTerm(a));

    // 3) Individual meaningful words (strip trailing punctuation like "postgresql.")
    const tokens = text.split(/[^a-z0-9+#.]+/)
        .map(t => t.replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, ''))
        .filter(Boolean);
    tokens.forEach(t => addTerm(t));

    // 4) Adjective+noun / noun+noun skill phrases (bigrams of non-stopword tokens)
    const candidates = text.split(/[^a-z0-9+#.]+/)
        .map(t => t.replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, ''))
        .filter(t => {
            const w = t.toLowerCase();
            return w.length >= 3 && !STOPWORDS.has(w) && !/^\d+$/.test(w);
        });
    for (let i = 0; i < candidates.length - 1; i++) {
        const pair = `${candidates[i]} ${candidates[i + 1]}`.toLowerCase();
        if (text.includes(pair)) addTerm(pair);
    }

    // Sort by frequency desc, then alphabetically — most-mentioned first
    return [...freq.entries()]
        .map(([term, count]) => ({ term, count }))
        .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term));
}

/**
 * Match extracted keywords against the resume corpus.
 * The corpus is normalized so whitespace (incl. line breaks) becomes single
 * spaces — multi-word phrases match even when they sit across a line break.
 */
export function analyzeKeywordMatch(jd: string, resumeText: string): KeywordMatchResult {
    const corpus = resumeText.toLowerCase().replace(/\s+/g, ' ');
    const keywords = extractKeywords(jd);

    const hits: KeywordHit[] = keywords.map(({ term, count }) => {
        // Plain alpha(+space) terms get word-boundary matching on the
        // normalized corpus; terms with special chars ("C++", "C#", "Node.js")
        // use a simple containment check — \b is unreliable around non-word chars.
        const isPlainTerm = /^[a-z ]+$/.test(term);
        const matched = isPlainTerm
            ? new RegExp(`\\b${escapeRegExp(term)}\\b`).test(corpus)
            : corpus.includes(term);
        return {
            term,
            count,
            matched,
            looksLikeSkill: looksLikeSkillTerm(term),
        };
    });

    const matchedHits = hits.filter(h => h.matched);
    const total = hits.length;
    const matched = matchedHits.length;
    const score = total > 0 ? Math.round((matched / total) * 100) : 0;

    return {
        hits,
        total,
        matched,
        score,
        matchedTerms: matchedHits.map(h => h.term),
        missingTerms: hits.filter(h => !h.matched).map(h => h.term),
    };
}

/**
 * Pick the most impactful missing skill-looking terms to suggest adding
 * to the resume skills list. Phrases and high-frequency terms first.
 */
export function suggestMissingSkills(result: KeywordMatchResult, limit = 10): string[] {
    return result.hits
        .filter(h => !h.matched && h.looksLikeSkill)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
        .map(h => h.term);
}
