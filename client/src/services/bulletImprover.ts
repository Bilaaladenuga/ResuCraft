import { WritingStyle } from '../types';
import { powerUpBullet } from './ai';

/* ============================================
   Bullet Improver — one-click "make this bullet
   stronger" with strong action verbs.

   Works 100% offline with a local heuristic
   engine. If an AI key is configured, the AI
   produces the primary suggestion and the local
   engine supplies alternatives + tips.
   ============================================ */

export interface BulletSuggestion {
    original: string;
    improved: string;
    alternatives: string[];
    tips: string[];
}

const STRONG_VERB_SET = new Set([
    'led', 'drove', 'drove', 'spearheaded', 'owned', 'directed', 'managed',
    'delivered', 'built', 'created', 'developed', 'launched', 'implemented',
    'optimized', 'streamlined', 'automated', 'increased', 'reduced',
    'accelerated', 'scaled', 'secured', 'negotiated', 'mentored',
    'transformed', 'pioneered', 'championed', 'engineered', 'architected',
    'established', 'orchestrated', 'executed', 'generated', 'boosted',
    'expanded', 'modernized', 'revitalized', 'elevated', 'rebuilt', 'cut',
    'won', 'grew', 'improved', 'doubled', 'tripled', 'saved', 'shipped',
    'designed', 'produced', 'published', 'presented', 'trained', 'coached'
]);

const FILLER_WORDS = /\b(very|really|quite|extremely|just|basically|actually|literally)\b/gi;

/** Strip leading bullet markers + collapse whitespace, drop trailing punctuation */
const cleanText = (raw: string): { text: string; hadPeriod: boolean } => {
    let text = raw.trim().replace(/^[-•–—*▪·◦\s]+/, '').trim().replace(/\s+/g, ' ');
    const hadPeriod = /[.!?]$/.test(text);
    text = text.replace(/[.!?]+$/, '').trim();
    return { text, hadPeriod };
};

const withPeriod = (s: string, hadPeriod: boolean): string =>
    hadPeriod && !/[.!?]$/.test(s) ? `${s}.` : s;

const dedupe = (arr: string[]): string[] => [...new Set(arr)];

/** Common gerunds -> past-tense strong verbs so "responsible for managing" becomes "Managed" */
const GERUND_TO_PAST: Record<string, string> = {
    improving: 'Improved', managing: 'Managed', building: 'Built', leading: 'Led',
    developing: 'Developed', increasing: 'Increased', reducing: 'Reduced',
    creating: 'Created', launching: 'Launched', implementing: 'Implemented',
    optimizing: 'Optimized', growing: 'Grew', expanding: 'Expanded', driving: 'Drove',
    delivering: 'Delivered', designing: 'Designed', executing: 'Executed',
    securing: 'Secured', training: 'Trained', mentoring: 'Mentored',
    establishing: 'Established', automating: 'Automated', streamlining: 'Streamlined',
    cutting: 'Cut', saving: 'Saved', winning: 'Won', producing: 'Produced',
    publishing: 'Published', presenting: 'Presented', coordinating: 'Coordinated',
    planning: 'Planned', analyzing: 'Analyzed', researching: 'Researched',
    testing: 'Tested', writing: 'Wrote', fixing: 'Fixed', maintaining: 'Maintained',
    supporting: 'Supported', reviewing: 'Reviewed', migrating: 'Migrated',
};

/** Convert a gerund to its past-tense form when possible */
const gerundToPast = (word: string): string | null => {
    const w = word.toLowerCase();
    if (GERUND_TO_PAST[w]) return GERUND_TO_PAST[w];
    if (/^[a-z]+ing$/.test(w) && w.length >= 5) {
        const base = w.slice(0, -3);
        if (base.length >= 3 && /^[a-z]+$/.test(base)) return base.charAt(0).toUpperCase() + base.slice(1) + 'ed';
    }
    return null;
};

/** Common base verbs -> past tense, so "helped build X" becomes "Built X" */
const BASE_TO_PAST: Record<string, string> = {
    build: 'Built', improve: 'Improved', reduce: 'Reduced', develop: 'Developed',
    create: 'Created', launch: 'Launched', deliver: 'Delivered', increase: 'Increased',
    manage: 'Managed', lead: 'Led', drive: 'Drove', design: 'Designed',
    implement: 'Implemented', optimize: 'Optimized', automate: 'Automated',
    streamline: 'Streamlined', expand: 'Expanded', grow: 'Grew', cut: 'Cut',
    save: 'Saved', win: 'Won', produce: 'Produced', publish: 'Published',
    present: 'Presented', train: 'Trained', mentor: 'Mentored', establish: 'Established',
    execute: 'Executed', secure: 'Secured', coordinate: 'Coordinated', plan: 'Planned',
    analyze: 'Analyzed', research: 'Researched', test: 'Tested', write: 'Wrote',
    fix: 'Fixed', maintain: 'Maintained', support: 'Supported', review: 'Reviewed',
    migrate: 'Migrated', ship: 'Shipped', scale: 'Scaled', negotiate: 'Negotiated',
    transform: 'Transformed', champion: 'Championed', pioneer: 'Pioneered',
    orchestrate: 'Orchestrated', generate: 'Generated', boost: 'Boosted',
    accelerate: 'Accelerated', modernize: 'Modernized', revitalize: 'Revitalized',
    elevate: 'Elevated', rebuild: 'Rebuilt', double: 'Doubled', triple: 'Tripled',
    engineer: 'Engineered', architect: 'Architected', onboard: 'Onboarded',
    hire: 'Hired', recruit: 'Recruited', coach: 'Coached', collaborate: 'Collaborated',
};

/**
 * Normalize the remainder of a bullet after the opener verb so it reads
 * naturally after a strong verb ("Enabled customer onboarding", not
 * "Enabled Customer onboarding"). Preserves acronyms (QA, AWS) and articles.
 */
const normalizeRest = (rest: string): string => {
    const words = rest.split(' ');
    if (!words[0]) return rest;
    const first = words[0];
    if (/^[A-Z]{2,}$/.test(first)) return rest; // acronym — keep as-is
    if (/^(the|a|an|my|our|their|its|his|her|this|that|these|those|every|each|all|some|any|no)$/i.test(first)) {
        return rest; // article/pronoun — keep as-is
    }
    return first.charAt(0).toLowerCase() + first.slice(1) + (words.length > 1 ? ' ' + words.slice(1).join(' ') : '');
};

/**
 * Build variants for one opener match, handling gerunds and prepositions:
 *   "Worked on improving website performance" -> "Improved website performance" (+ verb variants)
 *   "Helped with customer onboarding"        -> "Enabled customer onboarding"
 */
const buildOpenerVariants = (verbs: string[], rest: string): string[] => {
    const trimmed = rest.replace(/^(with|for|to|in|on|at|about|over|through|across)\s+/i, '');
    const words = trimmed.split(' ');
    const first = words[0] || '';
    const gerund = first ? gerundToPast(first) : null;

    if (gerund && words.length >= 1) {
        // "managing a team" -> "Managed a team" / "Led a team" / "Drove a team"
        const remainder = words.slice(1).join(' ');
        const tail = remainder ? normalizeRest(remainder) : '';
        const main = tail ? `${gerund} ${tail}` : gerund;
        const alts = verbs.map(v => (tail ? `${v} ${tail}` : v));
        return dedupe([main, ...alts]);
    }

    // Base verb: "helped build the checkout flow" -> "Built the checkout flow"
    const base = first ? BASE_TO_PAST[first.toLowerCase()] : null;
    if (base) {
        const tail = normalizeRest(words.slice(1).join(' '));
        return [tail ? `${base} ${tail}` : base];
    }

    const restNorm = normalizeRest(trimmed);
    return verbs.map(v => `${v} ${restNorm}`);
};

/**
 * Local heuristic improvement — no API key required.
 * Swaps weak openers for strong action verbs, removes filler words,
 * flags passive voice and missing metrics, and generates alternatives.
 */
export function improveBulletLocal(bullet: string): BulletSuggestion {
    const { text, hadPeriod } = cleanText(bullet);
    const original = text;

    if (!text) {
        return { original: bullet.trim(), improved: '', alternatives: [], tips: [] };
    }

    const tips: string[] = [];
    const variants: string[] = [];
    const addVariant = (v: string) => {
        const clean = v.trim().replace(/[.!?]+$/, '');
        if (clean && clean.length > 2 && !variants.includes(clean)) {
            variants.push(withPeriod(clean, hadPeriod));
        }
    };

    // ---- 1) Weak opener -> strong action verb ----
    const openerRules: Array<{ re: RegExp; verbs: string[] }> = [
        { re: /^worked?\s+as\s+a\s+/i, verbs: ['Served as a', 'Acted as a'] },
        { re: /^worked?\s+(?:on|with|in|at|towards?)\s+/i, verbs: ['Led', 'Drove', 'Spearheaded'] },
        { re: /^was\s+responsible\s+for\s+/i, verbs: ['Owned', 'Directed'] },
        { re: /^responsible\s+for\s+/i, verbs: ['Owned', 'Directed'] },
        { re: /^in\s+charge\s+of\s+/i, verbs: ['Directed', 'Owned'] },
        { re: /^helped\s+(?:to\s+)?/i, verbs: ['Enabled', 'Facilitated'] },
        { re: /^assisted\s+(?:with|in|to)\s+/i, verbs: ['Supported', 'Facilitated'] },
        { re: /^participated\s+in\s+/i, verbs: ['Contributed to', 'Played a key role in'] },
        { re: /^involved\s+in\s+/i, verbs: ['Drove', 'Led'] },
        { re: /^took\s+care\s+of\s+/i, verbs: ['Managed', 'Oversaw'] },
        { re: /^took\s+part\s+in\s+/i, verbs: ['Contributed to', 'Participated in'] },
        { re: /^did\s+/i, verbs: ['Executed', 'Delivered'] },
        { re: /^made\s+/i, verbs: ['Created', 'Built'] },
        { re: /^handled\s+/i, verbs: ['Managed', 'Oversaw'] },
        { re: /^tasked\s+with\s+/i, verbs: ['Owned', 'Led'] },
    ];

    let improved = text;
    let openerChanged = false;

    for (const rule of openerRules) {
        const m = text.match(rule.re);
        if (m) {
            const rest = text.slice(m[0].length).trim();
            const variants = buildOpenerVariants(rule.verbs, rest);
            variants.forEach(addVariant);
            improved = variants[0] || text;
            openerChanged = true;
            const weakWord = text.split(' ').slice(0, 2).join(' ').toLowerCase();
            tips.push(`Replace the weak opener "${weakWord}" with a strong action verb.`);
            break;
        }
    }

    if (openerChanged) {
        // Opener fix done — still offer the no-opener alternatives below.
    }

    // ---- 2) General polish when no opener matched ----
    if (!openerChanged) {
        const firstWord = text.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
        const startsWithArticle = /^(a|an|the|as|with|by|for|to|in|on|at|of|from)\b/i.test(text);
        const firstWordIsStrongVerb = STRONG_VERB_SET.has(firstWord);

        if (!startsWithArticle && !firstWordIsStrongVerb && firstWord.length > 2) {
            tips.push('Start with a strong action verb (e.g. Led, Built, Increased, Reduced).');
        }

        // Passive phrasing cleanup — "was able to reduce costs" -> "Reduced costs"
        if (/\bwas\s+(able\s+to|responsible|in\s+charge|part\s+of)\b/i.test(text)) {
            const cleaned = text.replace(/\bwas\s+(able\s+to|responsible|in\s+charge|part\s+of)\b/gi, '').trim();
            if (cleaned && cleaned.length > 2) {
                const cw = cleaned.split(' ');
                const past = cw[0] ? BASE_TO_PAST[cw[0].toLowerCase()] : null;
                const cap = past
                    ? (cw.length > 1 ? `${past} ${normalizeRest(cw.slice(1).join(' '))}` : past)
                    : cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
                addVariant(cap);
            }
            tips.push('Rewrite passive phrasing ("was able to", "was responsible for") in the active voice.');
        }

        // Filler-word removal
        const fillerMatches = text.match(FILLER_WORDS);
        if (fillerMatches) {
            const cleaned = text.replace(FILLER_WORDS, '').replace(/\s{2,}/g, ' ').trim();
            if (cleaned && cleaned.length > 2 && cleaned !== text) {
                addVariant(cleaned.charAt(0).toUpperCase() + cleaned.slice(1));
            }
            tips.push(`Remove filler word${fillerMatches.length > 1 ? 's' : ''}: ${[...new Set(fillerMatches.map(f => f.toLowerCase()))].join(', ')}.`);
        }
    }

    // ---- 3) Metric tip ----
    if (!/\d/.test(text)) {
        tips.push('Add a metric (%, $, count, or time) to show measurable impact.');
    }

    // ---- 4) Passive voice tip ----
    if (!openerChanged && /\b(was|were|been|being)\s+\w+ed\b/i.test(text)) {
        tips.push('Passive voice detected — rephrase to lead with who performed the action.');
    }

    // ---- 5) Too vague tip ----
    if (text.split(' ').length <= 4) {
        tips.push('Make this bullet more specific — what exactly did you do, and what was the result?');
    }

    // Final: assemble variants, ensure improved is the first one
    if (!improved) improved = text;
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);
    addVariant(improved);

    const finalVariants = variants.length > 0 ? variants : [withPeriod(improved, hadPeriod)];
    const improvedFinal = finalVariants[0];

    return {
        original: bullet.trim(),
        improved: improvedFinal,
        alternatives: dedupe(finalVariants).slice(1, 4),
        tips: dedupe(tips).slice(0, 3),
    };
}

/**
 * Improve a single bullet — uses the AI provider when configured,
 * otherwise the local heuristic engine. Never throws.
 */
export async function improveBullet(
    bullet: string,
    opts: { role?: string; industry?: string; hasApiKey?: boolean; style?: WritingStyle } = {}
): Promise<BulletSuggestion> {
    const local = improveBulletLocal(bullet);

    if (!opts.hasApiKey) {
        return local;
    }

    try {
        const ai = await powerUpBullet(
            { bulletText: bullet, role: opts.role || '', industry: opts.industry || '' },
            opts.style || 'professional'
        );
        const aiClean = ai.replace(/^[-•–—*\s]+/, '').trim();
        if (!aiClean) return local;

        return {
            original: bullet.trim(),
            improved: aiClean,
            alternatives: dedupe([aiClean, local.improved, ...local.alternatives]).slice(1, 4),
            tips: local.tips,
        };
    } catch {
        return local;
    }
}

/**
 * Improve every non-empty line of a multi-bullet description.
 * Runs sequentially to be gentle on rate limits.
 */
export async function improveAllBullets(
    description: string,
    opts: { role?: string; industry?: string; hasApiKey?: boolean; style?: WritingStyle } = {}
): Promise<string> {
    const lines = description.split('\n');
    const result: string[] = [];

    for (const line of lines) {
        if (!line.trim()) {
            result.push(line);
            continue;
        }
        const res = await improveBullet(line, opts);
        result.push(res.improved || line);
    }

    return result.join('\n');
}
