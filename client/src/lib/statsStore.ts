import { Redis } from '@upstash/redis';

/* ============================================
   Server-side usage stats store (Upstash Redis)
   Counts anonymous events (never resume content).
   Public stats = modest seed baselines + real usage,
   so the landing page looks alive from day one
   while still growing with genuine activity.
   ============================================ */

export type StatsEvent =
    | 'resume_created'
    | 'pdf_export'
    | 'docx_export'
    | 'ats_check'
    | 'resume_score'
    | 'cover_letter'
    | 'ai_generation';

export const EVENT_LABELS: Record<StatsEvent, string> = {
    resume_created: 'Resume Created',
    pdf_export: 'PDF Export',
    docx_export: 'DOCX Export',
    ats_check: 'ATS Checklist Run',
    resume_score: 'Resume Score Run',
    cover_letter: 'Cover Letter Generated',
    ai_generation: 'AI Rewrite',
};

export const ALL_EVENTS = Object.keys(EVENT_LABELS) as StatsEvent[];

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = REDIS_URL && REDIS_TOKEN
    ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
    : null;

// Modest, believable baselines — real usage adds on top.
export const SEEDS = {
    resumes_created: 57,
    exports: 32,
    ats_checks: 41,
    ai_generations: 86,
};

const ACTIVITY_KEY = 'stats:activity';
const MAX_ACTIVITY = 100;

const eventKey = (event: StatsEvent) => `stats:${event}`;

/**
 * Increment a counter and record a recent-activity entry.
 * Fire-and-forget friendly; never throws to the caller.
 */
export async function incrementEvent(event: StatsEvent): Promise<void> {
    if (!redis) return;
    try {
        await redis.incr(eventKey(event));
        const entry = JSON.stringify({ event, ts: Date.now() });
        await redis.lpush(ACTIVITY_KEY, entry);
        await redis.ltrim(ACTIVITY_KEY, 0, MAX_ACTIVITY - 1);
    } catch (err) {
        console.error('Stats increment failed:', err);
    }
}

export interface PublicStats {
    resumes_created: number;
    exports: number;
    ats_checks: number;
    ai_generations: number;
}

/**
 * Aggregate public stats: seed baseline + real deltas.
 * Falls back to seeds alone if Redis is unavailable.
 */
export async function getPublicStats(): Promise<PublicStats> {
    const d = {
        resume_created: 0,
        pdf_export: 0,
        docx_export: 0,
        ats_check: 0,
        resume_score: 0,
        cover_letter: 0,
        ai_generation: 0,
    };

    if (redis) {
        try {
            const vals = await redis.mget(
                eventKey('resume_created'),
                eventKey('pdf_export'),
                eventKey('docx_export'),
                eventKey('ats_check'),
                eventKey('resume_score'),
                eventKey('cover_letter'),
                eventKey('ai_generation')
            );
            const keys = Object.keys(d) as StatsEvent[];
            keys.forEach((k, i) => {
                const v = vals[i];
                if (typeof v === 'number') d[k] = v;
            });
        } catch (err) {
            console.error('Stats read failed:', err);
        }
    }

    return {
        resumes_created: SEEDS.resumes_created + d.resume_created,
        exports: SEEDS.exports + d.pdf_export + d.docx_export,
        ats_checks: SEEDS.ats_checks + d.ats_check + d.resume_score,
        ai_generations: SEEDS.ai_generations + d.ai_generation + d.cover_letter,
    };
}

export interface ActivityEntry {
    event: StatsEvent;
    ts: number;
}

/**
 * Recent activity feed (most recent first) for the owner stats view.
 */
export async function getActivity(limit = 50): Promise<ActivityEntry[]> {
    if (!redis) return [];
    try {
        const raw = await redis.lrange(ACTIVITY_KEY, 0, limit - 1);
        return raw
            .map(r => {
                try {
                    const parsed = JSON.parse(r);
                    return parsed && typeof parsed.event === 'string' && typeof parsed.ts === 'number'
                        ? parsed as ActivityEntry
                        : null;
                } catch {
                    return null;
                }
            })
            .filter((e): e is ActivityEntry => e !== null);
    } catch (err) {
        console.error('Stats activity read failed:', err);
        return [];
    }
}
